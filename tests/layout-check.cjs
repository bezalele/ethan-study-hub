/* ---------------------------------------------------------------------------
   layout-check.cjs — real-browser layout checks.

   smoke.cjs checks the source. This drives a real Chrome over the DevTools
   protocol and checks the rendered result: that every route actually paints
   content, that nothing overflows horizontally, and that the home page fits
   one screen without a scrollbar.

   It waits for the router to mount a page before measuring — an earlier
   iframe-based harness measured before render and reported everything clean
   because every page was still empty.

   Usage:
     node tests/layout-check.cjs [baseUrl]      default http://localhost:8080

   Requires Chrome (or set CHROME=/path/to/chrome) and a running static server.
   --------------------------------------------------------------------------- */

const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:8080';
const PORT = 9333;

const CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));

const ROUTES = [
  '#/', '#/course', '#/course/3', '#/study',
  '#/study/colonies', '#/study/declaration', '#/study/articles',
  '#/study/convention', '#/study/constitution-rights',
  '#/study/documents', '#/study/practice', '#/study/nope',
];

const SIZES = [
  [390, 844], [768, 1024], [1280, 800], [1366, 768], [1536, 1024], [1920, 1080],
];

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

async function waitFor(fn, tries = 100, gap = 100) {
  for (let i = 0; i < tries; i += 1) {
    try { return await fn(); } catch (e) { /* retry */ }
    await new Promise((r) => setTimeout(r, gap));
  }
  throw new Error('timed out waiting for Chrome');
}

/** Minimal CDP client over the built-in WebSocket. */
function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    let id = 0;
    ws.addEventListener('open', () => resolve({
      send(method, params = {}) {
        return new Promise((res, rej) => {
          const mid = ++id;
          pending.set(mid, { res, rej });
          ws.send(JSON.stringify({ id: mid, method, params }));
        });
      },
      close: () => ws.close(),
    }));
    ws.addEventListener('error', reject);
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      }
    });
  });
}

/* Runs inside the page. Waits for the router to mount, then measures. */
const PROBE = `(async () => {
  const main = document.getElementById('app-main');
  for (let i = 0; i < 120; i++) {
    if (main && main.querySelector('.page') && main.textContent.trim().length > 40) break;
    await new Promise(r => setTimeout(r, 25));
  }
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 150)));

  const de = document.documentElement;
  const vw = window.innerWidth, vh = window.innerHeight;
  const over = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 1) {
      over.push(Math.round(r.right - vw) + 'px ' + el.tagName.toLowerCase() +
        '.' + (el.className || '').toString().trim().split(/\\s+/)[0]);
    }
  });
  const clipped = [];
  document.querySelectorAll('.page--home section, .page--home nav').forEach(b => {
    if (b.scrollHeight > b.clientHeight + 2) clipped.push(b.className.split(/\s+/)[0] + ' by ' + (b.scrollHeight - b.clientHeight) + 'px');
  });
  return JSON.stringify({
    chars: main ? main.textContent.trim().length : 0,
    imgs: document.querySelectorAll('#app-main img').length,
    broken: [...document.querySelectorAll('#app-main img')]
      .filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
    hOver: de.scrollWidth - vw,
    vOver: de.scrollHeight - vh,
    over: over.slice(0, 3),
    clipped,
  });
})()`;

(async () => {
  if (!CHROME) {
    console.error('Chrome not found. Set CHROME=/path/to/chrome');
    process.exit(2);
  }

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: 'ignore' });

  let failures = 0;
  let checks = 0;

  try {
    const version = await waitFor(() => getJSON(`http://127.0.0.1:${PORT}/json/version`));
    const client = await connect(version.webSocketDebuggerUrl);
    const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
    const targets = await getJSON(`http://127.0.0.1:${PORT}/json/list`);
    const page = targets.find((t) => t.id === targetId);
    const tab = await connect(page.webSocketDebuggerUrl);
    await tab.send('Page.enable');
    await tab.send('Runtime.enable');

    for (const [w, h] of SIZES) {
      console.log(`\n${w} x ${h}`);
      await tab.send('Emulation.setDeviceMetricsOverride', {
        width: w, height: h, deviceScaleFactor: 1, mobile: w < 700,
      });

      for (const route of ROUTES) {
        // Cache-bust the query so each route is a fresh document load.
        await tab.send('Page.navigate', { url: `${BASE}/?n=${Date.now()}${route}` });
        await new Promise((r) => setTimeout(r, 250));

        const { result } = await tab.send('Runtime.evaluate', {
          expression: PROBE, awaitPromise: true, returnByValue: true,
        });
        const m = JSON.parse(result.value);

        const problems = [];
        if (m.chars < 40) problems.push('EMPTY');
        if (m.hOver > 1) problems.push(`H-OVERFLOW ${m.hOver}px (${m.over.join(', ')})`);
        if (m.broken.length) problems.push(`BROKEN IMG ${m.broken.join(', ')}`);
        if (route === '#/' && w >= 1001 && h >= 700) {
          if (m.vOver > 1) problems.push(`HOME SCROLLS ${m.vOver}px`);
          if (m.clipped.length) problems.push(`CLIPPED ${m.clipped.join(', ')}`);
        }

        checks += 1;
        if (problems.length) {
          failures += 1;
          console.log(`  FAIL  ${route.padEnd(30)} ${problems.join(' | ')}`);
        } else {
          console.log(`  ok    ${route.padEnd(30)} chars=${String(m.chars).padEnd(5)} imgs=${m.imgs}`);
        }
      }
    }

    tab.close();
    client.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }

  console.log(`\n${checks - failures}/${checks} rendered checks passed`);
  if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
  console.log('Every route renders, nothing overflows, home fits one screen.');
})().catch((e) => { console.error(e); process.exit(2); });
