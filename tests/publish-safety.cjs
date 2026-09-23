/* ---------------------------------------------------------------------------
   publish-safety.cjs — the site is in use, so a deploy must not be able to
   lose a note.

   Publishing this site is a push to main: GitHub Pages serves the files as
   they are, and the notes live in the Durable Object and in each browser, so
   nothing about shipping HTML can reach them. The two ways a release HAS
   taken data before are both about code, and both are checked here:

     1. A merge rule that subtracts.  Every rule in journal-merge.js and
        progress-merge.js has to be additive: union by id, max, or OR. A side
        that knows nothing may never remove what the other side has. That is
        the rule that matters on a parent's laptop, which arrives empty.

     2. Somebody's notes committed to the repo.  This repository is public.
        A journal payload pasted into a fixture or a debug file would publish
        his school notes to the world, and every later deploy would serve
        them again.

   No browser and no network: `node tests/publish-safety.cjs`.
   --------------------------------------------------------------------------- */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let bad = 0;
const ok = (cond, msg) => { if (!cond) bad++; console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${msg}`); };

/* The merge files are classic scripts that hang themselves off globalThis,
   which is exactly how the Worker loads them. */
const sandbox = { globalThis: null };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of ['shared/journal-merge.js', 'shared/progress-merge.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
}
const { JournalMerge, ProgressMerge } = sandbox;

/* --- a journal with something of everything in it ------------------------- */
const rich = () => ({
  entries: [
    {
      subject: 'biology', date: '2026-09-22', text: 'learned about area capacity', ts: 1000,
      comments: [
        { id: 'c1', who: 'parent', text: 'Great! Pls give me one or two examples.', ts: 1100 },
        { id: 'c2', who: 'ethan', text: 'Like a pond holding so many frogs.', ts: 1200 },
        { id: 'c3', who: 'parent', text: 'typo', ts: 1300, del: true },
      ],
      reactions: [{ k: 'proud', who: 'parent', ts: 1150 }],
      links: [
        { id: 'l1', title: 'Population growth and limits', href: '#lesson/populations', ts: 1050 },
        { id: 'l2', title: 'Taken off', href: '#lesson/gone', ts: 1060, del: true },
      ],
    },
    {
      subject: 'math', date: '2026-09-22', text: 'We practiced system of equations', ts: 900,
      comments: [], reactions: [],
      links: [{ id: 'l3', title: 'Systems of equations', href: '#u2lesson/systems', ts: 950 }],
    },
    /* A day written before links were a list of their own. */
    {
      subject: 'apgov', date: '2026-09-18', text: 'Federalism', ts: 800,
      lesson: { title: 'Federalism', href: '#chapter/federalism' },
    },
  ],
});

const liveLinks = (e) => (e.links || []).filter((l) => !l.del);
const find = (doc, subject, date) =>
  (doc.entries || []).filter((e) => e.subject === subject && e.date === date)[0];

console.log('a laptop that knows nothing cannot take anything away');
{
  const empty = { entries: [] };
  for (const [a, b, side] of [[rich(), empty, 'empty second'], [empty, rich(), 'empty first']]) {
    const out = JournalMerge.mergeAll(a, b);
    ok(out.entries.length === 3, `${side}: all three days survive`);
    const bio = find(out, 'biology', '2026-09-22');
    ok(bio && bio.text === 'learned about area capacity', `${side}: his note is word for word`);
    ok(bio && bio.comments.length === 3, `${side}: the thread is whole, tombstone and all`);
    ok(bio && liveLinks(bio).length === 1, `${side}: the lesson link is still on`);
    ok(bio && bio.reactions.length === 1, `${side}: the reaction is still on`);
    const gov = find(out, 'apgov', '2026-09-18');
    ok(gov && gov.lesson && gov.lesson.href === '#chapter/federalism',
      `${side}: a day from before links were a list keeps its lesson`);
  }
}

console.log('');
console.log('and neither can a laptop holding an older copy');
{
  /* She has yesterday's copy: an older note, no reply of his, no link. */
  const stale = {
    entries: [{
      subject: 'biology', date: '2026-09-22', text: 'area', ts: 500,
      comments: [{ id: 'c1', who: 'parent', text: 'Great! Pls give me one or two examples.', ts: 1100 }],
      reactions: [], links: [],
    }],
  };
  const out = JournalMerge.mergeAll(stale, rich());
  const bio = find(out, 'biology', '2026-09-22');
  ok(bio.text === 'learned about area capacity', 'the newer note wins; the older copy does not overwrite it');
  ok(bio.comments.length === 3, 'her missing replies are not read as deletions');
  ok(liveLinks(bio).length === 1, 'her missing link is not read as a removal');
  ok(JournalMerge.mergeAll(rich(), stale).entries.length === 3, 'and the other way round is the same');
}

console.log('');
console.log('what a delete must still do');
{
  const out = JournalMerge.mergeAll(rich(), rich());
  const bio = find(out, 'biology', '2026-09-22');
  ok(bio.comments.filter((c) => c.id === 'c3')[0].del === true, 'a deleted comment stays deleted');
  ok(bio.links.filter((l) => l.id === 'l2')[0].del === true, 'a removed link stays removed');
  ok(bio.comments.length === 3 && bio.links.length === 2,
    'tombstones are kept, not dropped - a hole would be refilled by the next laptop');
}

console.log('');
console.log('the same promise for his exercises and quiz scores');
{
  const work = {
    stores: {
      ethan_biology_v1: {
        explored: ['cells', 'investigations'], last: 'cells',
        attempts: [{ id: 'q1', lesson: 'cells', correct: true, ts: 10 }],
        notes: { cells: 'Mitochondria make energy for the cell.' },
      },
      ethan_math_quest_v2: {
        attempts: [{ id: 'm1', topic: 'systems', ts: 20 }],
        lessonStarted: true, lessonComplete: true, version: 2,
      },
      ethanQuizScoresV1: { congress: { best: 8, total: 10, attempts: 3, last: 8 } },
    },
  };
  const blank = { stores: {} };
  for (const [a, b, side] of [[work, blank, 'empty second'], [blank, work, 'empty first']]) {
    const out = ProgressMerge.mergeAll(a, b).stores;
    ok(out.ethan_biology_v1.attempts.length === 1, `${side}: his biology attempt is kept`);
    ok(out.ethan_biology_v1.explored.length === 2, `${side}: the lessons he explored are kept`);
    ok(out.ethan_biology_v1.notes.cells === 'Mitochondria make energy for the cell.',
      `${side}: his lesson note is kept`);
    ok(out.ethan_math_quest_v2.lessonComplete === true, `${side}: you cannot un-finish a lesson`);
    ok(out.ethanQuizScoresV1.congress.best === 8, `${side}: his best score cannot go down`);
  }
  /* A worse run later must not lower the best. */
  const worse = { stores: { ethanQuizScoresV1: { congress: { best: 3, total: 10, attempts: 4, last: 3 } } } };
  const out = ProgressMerge.mergeAll(work, worse).stores;
  ok(out.ethanQuizScoresV1.congress.best === 8, 'a worse attempt does not lower his best');
  ok(out.ethanQuizScoresV1.congress.attempts === 4, 'but the attempt is still counted');
}

console.log('');
console.log('every rule is additive, by inspection of the source');
{
  const prog = fs.readFileSync(path.join(ROOT, 'shared/progress-merge.js'), 'utf8');
  const jour = fs.readFileSync(path.join(ROOT, 'shared/journal-merge.js'), 'utf8');
  const worker = fs.readFileSync(path.join(ROOT, 'worker/journal.js'), 'utf8');
  ok(Object.keys(ProgressMerge.RULES).length === 3,
    `three stores have rules of their own (${Object.keys(ProgressMerge.RULES).join(', ')})`);
  ok(!/\.splice\(|\.shift\(|delete\s+out\[/.test(prog), 'nothing in the progress rules removes an item');
  ok(!/\.splice\(|\.shift\(/.test(jour), 'nothing in the journal rules removes an item');
  ok(worker.includes("import '../shared/journal-merge.js'") &&
     worker.includes("import '../shared/progress-merge.js'"),
    'the Worker imports these very files, so browser and server cannot drift apart');
}

console.log('');
console.log('nobody is having their notes committed to a public repo');
{
  const skip = new Set(['.git', 'node_modules', '.vscode']);
  const TEXT = /\.(js|cjs|mjs|json|html|css|md|txt|yml|yaml|toml)$/i;
  /* A serialised journal or progress payload, wherever it might have been
     pasted. Source that NAMES these keys is fine; a file holding one of
     their payloads is not. */
  const payload = [
    /"entries"\s*:\s*\[\s*\{/,
    /"subject"\s*:\s*"(biology|math|apgov)"\s*,\s*"date"/,
    /"stores"\s*:\s*\{\s*"ethan_/,
  ];
  const hits = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      if (skip.has(name)) continue;
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) { walk(full); continue; }
      if (!TEXT.test(name)) continue;
      const src = fs.readFileSync(full, 'utf8');
      if (payload.some((re) => re.test(src))) hits.push(path.relative(ROOT, full));
    }
  }(ROOT));
  ok(hits.length === 0, hits.length ? `journal data found in: ${hits.join(', ')}` : 'no journal payload in any file');

  const key = fs.readFileSync(path.join(ROOT, 'shared/family-key.js'), 'utf8');
  ok(/not a secret/i.test(key), 'the family key still says in writing that it is not a secret');
}

console.log('');
console.log(bad ? `${bad} FAILED` : 'A deploy cannot reach the notes, and no rule can subtract.');
process.exit(bad ? 1 : 0);
