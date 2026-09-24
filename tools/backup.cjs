/* ---------------------------------------------------------------------------
   backup.cjs — take a copy of the journal and his work, off the server and
   onto this machine.

   The Worker keeps its own snapshots, and they have never lost anything. This
   is the copy that survives the Worker itself: a plain JSON file on a laptop,
   readable with any text editor, restorable with the command printed at the
   end.

       node tools/backup.cjs

   It writes to a folder OUTSIDE this repository, because the repository is
   public and these are a child's school notes. Nothing is ever written to the
   server by this script: it reads, and only reads.

       node tools/backup.cjs --dir "D:/somewhere/else"
       node tools/backup.cjs --endpoint http://127.0.0.1:8788   (a test worker)

   Run it before every publish. docs/OPERATIONS.md says the same.
   --------------------------------------------------------------------------- */
const fs = require('fs');
const os = require('os');
const path = require('path');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i > -1 && args[i + 1] ? args[i + 1] : fallback;
};

const ENDPOINT = opt('endpoint', 'https://ethan-journal.bezuwm.workers.dev').replace(/\/+$/, '');
const DIR = opt('dir', path.join(os.homedir(), 'esh-backups'));
const KEY = opt('key', process.env.ESH_FAMILY_KEY || 'ethan-lab-2026');

const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

async function pull(what) {
  const res = await fetch(`${ENDPOINT}/${what}`, { headers: { Authorization: 'Bearer ' + KEY } });
  if (!res.ok) throw new Error(`${what}: the server said ${res.status}`);
  const text = await res.text();
  JSON.parse(text);                       // refuse to save something unreadable
  return text;
}

/** What is actually in there, in words rather than bytes. */
function describe(what, text) {
  const doc = JSON.parse(text);
  if (what === 'journal') {
    const notes = (doc.entries || []).filter((e) => e.text);
    const replies = notes.reduce((n, e) => n + (e.comments || []).filter((c) => !c.del).length, 0);
    const links = notes.reduce((n, e) => n + (e.links || []).filter((l) => !l.del).length, 0);
    const days = [...new Set(notes.map((e) => e.date))].sort();
    return `${notes.length} notes, ${replies} replies, ${links} lesson links`
      + (days.length ? `, ${days[0]} to ${days[days.length - 1]}` : '');
  }
  const stores = doc.stores || {};
  return Object.keys(stores).map((k) => {
    const v = stores[k] || {};
    const attempts = (v.attempts || []).length;
    const scored = Object.keys(v).filter((x) => v[x] && v[x].best !== undefined).length;
    return `${k}: ${attempts ? attempts + ' attempts' : scored + ' chapters scored'}`;
  }).join('; ') || 'nothing yet';
}

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  console.log(`reading ${ENDPOINT}`);
  const written = [];
  for (const what of ['journal', 'progress']) {
    const text = await pull(what);
    const file = path.join(DIR, `${what}-${stamp}.json`);
    fs.writeFileSync(file, text, 'utf8');
    /* Read it back before claiming it is saved. */
    const back = fs.readFileSync(file, 'utf8');
    if (back !== text) throw new Error(`${file} did not save whole`);
    JSON.parse(back);
    console.log(`  ${what.padEnd(8)} ${describe(what, back)}`);
    console.log(`  ${''.padEnd(8)} saved to ${file} (${back.length} bytes, reads back clean)`);
    written.push([what, file]);
  }
  console.log('');
  console.log('To put one of these back on the server, if it ever comes to that:');
  for (const [what, file] of written) {
    console.log(`  curl -X POST "${ENDPOINT}/${what}" -H "Authorization: Bearer <key>" \\`);
    console.log(`       -H "Content-Type: application/json" --data-binary "@${file}"`);
  }
  console.log('');
  console.log('A POST merges - it adds what is missing and never subtracts - so putting');
  console.log('an old copy back cannot remove anything written since.');
})().catch((e) => { console.error('BACKUP FAILED:', e.message); process.exit(1); });
