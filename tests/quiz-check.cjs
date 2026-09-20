/* Drive the chapter quiz end to end in a real browser and check the score. */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9414;
const BASE = process.argv[2] || 'http://localhost:8080';
const CHAPTERS = ['colonies', 'declaration', 'articles', 'convention', 'constitution-rights'];

function getJSON(u) {
  return new Promise((res, rej) => http.get(u, (r) => { let b = ''; r.on('data', (d) => { b += d; }); r.on('end', () => { try { res(JSON.parse(b)); } catch (e) { rej(e); } }); }).on('error', rej));
}
async function waitFor(fn, n = 100) {
  for (let i = 0; i < n; i += 1) { try { return await fn(); } catch (e) { /* retry */ } await new Promise((r) => setTimeout(r, 100)); }
  throw new Error('chrome did not start');
}
function connect(u) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(u); const pending = new Map(); let id = 0;
    ws.addEventListener('open', () => resolve({
      send(m, p = {}) { return new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); }); },
      close: () => ws.close(),
    }));
    ws.addEventListener('error', reject);
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); if (m.error) rej(new Error(m.error.message)); else res(m.result); }
    });
  });
}

/* Answers every question correctly, then every question wrong, and reports
   the score the page shows in each case. */
const RUN = (wrong) => `(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < 150; i++) {
    if (document.querySelector('[data-quiz]')) break;
    await sleep(25);
  }
  const box = document.querySelector('[data-quiz]');
  if (!box) return JSON.stringify({ error: 'no quiz' });
  const total = Number(box.dataset.total);
  const next = box.querySelector('[data-next]');
  const steps = [];

  for (let q = 0; q < total; q++) {
    const card = box.querySelector('.ch-q[data-q="' + q + '"]');
    if (!card || card.hidden) return JSON.stringify({ error: 'card ' + q + ' not visible' });
    const correct = Number(card.dataset.answer);
    const n = card.querySelectorAll('input').length;
    const pick = ${wrong} ? (correct + 1) % n : correct;
    card.querySelectorAll('input')[pick].click();
    next.click();                 // grade
    await sleep(30);
    steps.push(box.querySelector('[data-progress]').textContent);
    next.click();                 // advance / finish
    await sleep(30);
  }
  const result = box.querySelector('[data-result]');
  return JSON.stringify({
    total,
    shown: result.hidden ? null : box.querySelector('[data-score]').textContent,
    best: box.querySelector('[data-best]').textContent,
    formHidden: box.querySelector('[data-form]').hidden,
    steps,
  });
})()`;

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'quiz-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  let fails = 0;
  try {
    const v = await waitFor(() => getJSON(`http://127.0.0.1:${PORT}/json/version`));
    const client = await connect(v.webSocketDebuggerUrl);
    const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
    const list = await getJSON(`http://127.0.0.1:${PORT}/json/list`);
    const tab = await connect(list.find((t) => t.id === targetId).webSocketDebuggerUrl);
    await tab.send('Page.enable'); await tab.send('Runtime.enable');
    await tab.send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });

    for (const ch of CHAPTERS) {
      for (const wrong of [false, true]) {
        await tab.send('Page.navigate', { url: `${BASE}/?n=${Date.now()}#/study/${ch}` });
        await new Promise((r) => setTimeout(r, 400));
        const { result } = await tab.send('Runtime.evaluate', { expression: RUN(wrong), awaitPromise: true, returnByValue: true });
        const m = JSON.parse(result.value);
        const want = wrong ? '0' : String(m.total);
        const ok = !m.error && m.shown === want && m.formHidden;
        if (!ok) fails += 1;
        console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${ch.padEnd(22)} ${wrong ? 'all wrong' : 'all right'} -> scored ${m.shown}/${m.total}${m.error ? '  ' + m.error : ''}`);
      }
    }
    tab.close(); client.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
  console.log(fails ? `\n${fails} FAILED` : '\nQuiz scores correctly on all five chapters.');
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
