/* ---------------------------------------------------------------------------
   restore.cjs — put his notes and his work back.

   The worst case: something writes nonsense over the journal, or wipes it, or
   a bad release mangles it and nobody notices until the evening. This is the
   way back, and it is meant to be usable by somebody who is upset.

   Look first. Nothing here writes without --yes.

       node tools/restore.cjs --list
       node tools/restore.cjs --list --what progress

   Go back to a moment on the server. The Worker snapshots before every write
   and keeps the last 60 plus one a day for forty days:

       node tools/restore.cjs --to snap:journal-v1:1790214414653
       node tools/restore.cjs --to 2026-09-24T02:00        (nearest at or before)
       node tools/restore.cjs --to 2026-09-24T02:00 --yes

   Or go back to a file on this laptop, from tools/backup.cjs:

       node tools/restore.cjs --from ~/esh-backups/journal-2026-09-24-14-45.json
       node tools/restore.cjs --from <file> --replace --yes

   MERGE or REPLACE. By default a file is merged: everything in the file is
   added, nothing already there is removed. That is the safe one, and it is
   what you want when something has gone MISSING. --replace throws away what
   is on the server first, which is what you want when something WRONG is
   there and has to go. A server snapshot (--to) always replaces, which is the
   point of it.

   Whatever you do, the state you are replacing is saved twice before it goes:
   the Worker snapshots it, and this takes a fresh file on this laptop.
   --------------------------------------------------------------------------- */
const fs = require('fs');
const os = require('os');
const path = require('path');

const args = process.argv.slice(2);
const has = (name) => args.includes('--' + name);
const opt = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i > -1 && args[i + 1] ? args[i + 1] : fallback;
};

const ENDPOINT = opt('endpoint', 'https://ethan-journal.bezuwm.workers.dev').replace(/\/+$/, '');
const KEY = opt('key', process.env.ESH_FAMILY_KEY || 'ethan-lab-2026');
const DIR = opt('dir', path.join(os.homedir(), 'esh-backups'));
const WHAT = opt('what', 'journal');
const GO = has('yes');

const head = (h) => ({ Authorization: 'Bearer ' + KEY, ...(h || {}) });
const get = (what) => fetch(`${ENDPOINT}/${what}`, { headers: head() }).then((r) => r.json());

/* --- what is in a document, in words ------------------------------------- */

function noteRows(doc) {
  return (doc.entries || []).filter((e) => e && e.text);
}
function tally(what, doc) {
  if (what === 'progress') {
    const stores = doc.stores || {};
    return Object.keys(stores).map((k) => {
      const v = stores[k] || {};
      const attempts = (v.attempts || []).length;
      const scored = Object.keys(v).filter((x) => v[x] && v[x].best !== undefined).length;
      return `${k}: ${attempts ? attempts + ' attempts' : scored + ' scored'}`;
    }).join('; ') || 'nothing';
  }
  const notes = noteRows(doc);
  const replies = notes.reduce((n, e) => n + (e.comments || []).filter((c) => !c.del).length, 0);
  const links = notes.reduce((n, e) => n + (e.links || []).filter((l) => !l.del).length, 0);
  /* Read under stress, so it reads like a sentence. */
  const s = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  return `${s(notes.length, 'note', 'notes')}, ${s(replies, 'reply', 'replies')}, ` +
    `${s(links, 'lesson link', 'lesson links')}`;
}

/** What this would change, note by note, so nobody restores blind. */
function difference(before, after) {
  const key = (e) => e.subject + ' ' + e.date;
  const was = new Map(noteRows(before).map((e) => [key(e), e]));
  const will = new Map(noteRows(after).map((e) => [key(e), e]));
  const lines = [];
  for (const [k, e] of will) {
    const old = was.get(k);
    if (!old) lines.push(`  + ${k}  ${JSON.stringify(e.text)}`);
    else if (old.text !== e.text) lines.push(`  ~ ${k}  ${JSON.stringify(old.text)} -> ${JSON.stringify(e.text)}`);
  }
  for (const [k, e] of was) {
    if (!will.has(k)) lines.push(`  - ${k}  ${JSON.stringify(e.text)}  << WOULD BE LOST`);
  }
  return lines;
}

/* --- the copy taken before anything is written --------------------------- */

async function safetyCopy(what) {
  fs.mkdirSync(DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const doc = await get(what);
  const file = path.join(DIR, `${what}-before-restore-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(doc), 'utf8');
  JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log(`  the state being replaced is saved to ${file}`);
  return doc;
}

/* --- the three things this can do ---------------------------------------- */

async function list(what) {
  const rows = (await fetch(`${ENDPOINT}/${what}/history`, { headers: head() }).then((r) => r.json())).snapshots || [];
  const now = await get(what);
  console.log(`on the server now: ${tally(what, now)}`);
  console.log('');
  console.log(`${rows.length} snapshots to go back to, newest first:`);
  rows.slice(0, 25).forEach((s) => {
    const size = what === 'progress' ? `${s.stores || 0} stores` : `${s.notes} notes`;
    console.log(`  ${s.when}   ${String(size).padEnd(10)}  ${s.id}`);
  });
  if (rows.length > 25) console.log(`  … and ${rows.length - 25} older`);
  console.log('');
  console.log('Then:  node tools/restore.cjs --to <id or time>        (look)');
  console.log('       node tools/restore.cjs --to <id or time> --yes  (do it)');
}

async function toSnapshot(what, want) {
  const rows = (await fetch(`${ENDPOINT}/${what}/history`, { headers: head() }).then((r) => r.json())).snapshots || [];
  if (!rows.length) throw new Error('the server has no snapshots');

  let picked = rows.find((s) => s.id === want);
  if (!picked) {
    const at = Date.parse(want);
    if (Number.isNaN(at)) throw new Error(`not a snapshot id or a time: ${want}`);
    picked = rows.find((s) => s.at <= at);          // rows are newest first
    if (!picked) throw new Error(`nothing that old - the oldest is ${rows[rows.length - 1].when}`);
  }

  const before = await get(what);
  /* A snapshot's contents are not in the listing, so ask what it holds by
     restoring into nothing - we cannot, so instead we show the counts the
     listing gives and the difference in note numbers. */
  console.log(`now:        ${tally(what, before)}`);
  console.log(`going back: ${picked.when}  (${picked.notes !== undefined ? picked.notes + ' notes' : (picked.stores || 0) + ' stores'})`);
  console.log(`            ${picked.id}`);
  console.log('');
  if (!GO) {
    console.log('Nothing written. Add --yes to do it.');
    return;
  }
  await safetyCopy(what);
  const res = await fetch(`${ENDPOINT}/${what}/restore`, {
    method: 'POST', headers: head({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: picked.id }),
  });
  if (!res.ok) throw new Error(`the server said ${res.status}`);
  const after = await get(what);
  console.log('');
  console.log(`restored:   ${tally(what, after)}`);
  difference(before, after).forEach((l) => console.log(l));
}

async function fromFile(what, file) {
  const text = fs.readFileSync(file, 'utf8');
  const doc = JSON.parse(text);
  const before = await get(what);
  const replace = has('replace');

  console.log(`now:   ${tally(what, before)}`);
  console.log(`file:  ${tally(what, doc)}   ${file}`);
  console.log(`mode:  ${replace ? 'REPLACE - what is on the server goes first' : 'merge - adds, never removes'}`);
  console.log('');

  /* What a merge would do is knowable without writing: the merge rules are
     additive, so it is the file's notes plus the server's. A replace is the
     file, exactly. */
  const predicted = replace ? doc : { entries: noteRows(before).concat(noteRows(doc)) };
  const lines = difference(before, predicted);
  if (lines.length) { console.log('changes:'); lines.forEach((l) => console.log(l)); console.log(''); }
  else console.log('nothing would change.\n');

  if (!GO) {
    console.log('Nothing written. Add --yes to do it.');
    return;
  }
  await safetyCopy(what);
  if (replace) {
    const wipe = await fetch(`${ENDPOINT}/${what}`, { method: 'DELETE', headers: head() });
    if (!wipe.ok) throw new Error(`clearing first: the server said ${wipe.status}`);
  }
  const res = await fetch(`${ENDPOINT}/${what}`, {
    method: 'POST', headers: head({ 'Content-Type': 'application/json' }), body: text,
  });
  if (!res.ok) throw new Error(`the server said ${res.status}`);
  const after = await get(what);
  console.log(`result: ${tally(what, after)}`);
  const lost = difference(doc, after).filter((l) => l.startsWith('  -'));
  if (lost.length) { console.log('STILL MISSING:'); lost.forEach((l) => console.log(l)); }
}

/* --- go -------------------------------------------------------------------- */

(async () => {
  if (!['journal', 'progress'].includes(WHAT)) throw new Error('--what must be journal or progress');
  console.log(`${ENDPOINT} · ${WHAT}`);
  console.log('');
  if (has('list') || args.length === 0) return list(WHAT);
  if (has('to')) return toSnapshot(WHAT, opt('to', ''));
  if (has('from')) return fromFile(WHAT, opt('from', '').replace(/^~/, os.homedir()));
  return list(WHAT);
})().catch((e) => { console.error('RESTORE FAILED:', e.message); process.exit(1); });
