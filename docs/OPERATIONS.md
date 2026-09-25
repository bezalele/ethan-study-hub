# Ethan Study Hub — operations manual

Everything needed to run, change, deploy and recover this site. None of it is
visible from the UI. If something here stops being true, fix this file in the
same commit that made it untrue.

For *how to write for Ethan* — voice, fun facts, using his name — see
[BUILD-GUIDE.md](BUILD-GUIDE.md). This file is the machinery.

---

## 1. What this is

A zero-build static site. No bundler, no framework, no npm dependencies at
runtime. Plain HTML, CSS and JavaScript served straight off disk.

| | Lives at | Style |
| --- | --- | --- |
| **Study Hub landing** | `index.html` + `hub/styles.css` | three-subject chooser |
| **AP U.S. Government** | `american-history.html` + `layout/`, `pages/`, `components/` | ES modules, hash routing, master-page layout |
| **Honors Biology** | `biology/` | classic scripts, left sidebar |
| **Math Quest** | `math-quest/` | classic scripts, left sidebar |
| **Shared across all three** | `shared/` | classic scripts, so both module and non-module apps can use them |

- Repo: `https://github.com/bezalele/ethan-study-hub` — **public**
- Live: `https://bezalele.github.io/ethan-study-hub/`

**The repo being public is a hard constraint.** Ethan's school notes must
never be committed to it. See §6.

---

## 2. Running it locally

```
cd C:\Users\bezuw\ethan-study-hub
python -m http.server 8777
```

Then:

- http://127.0.0.1:8777/ — landing page
- http://127.0.0.1:8777/american-history.html — AP Government
- http://127.0.0.1:8777/biology/ — Biology
- http://127.0.0.1:8777/math-quest/ — Math Quest

A plain file:// open will **not** work: the AP Gov app uses ES modules, which
browsers refuse to load from the filesystem.

To stop the server:

```
netstat -ano | findstr :8777
taskkill /PID <pid> /F
```

---

## 3. Branching and deploying

**The rule: nothing reaches `main` without a local review first.** Work on a
branch, show it, merge on approval.

```
git checkout -b some/branch        # work
node tests/smoke.cjs               # must be 210/210
git checkout main
git merge --ff-only some/branch
git push origin main               # this IS the deploy
```

Pushing to `main` is the deploy. GitHub Pages rebuilds in roughly 40 seconds.
Confirm it actually landed rather than assuming:

```
gh run list --limit 2
curl -s https://bezalele.github.io/ethan-study-hub/shared/learning-log.js | head -3
```

### The two workflows

| Workflow | Status | Gates the deploy? |
| --- | --- | --- |
| `pages-build-deployment` | should be green | yes — this is the deploy |
| `chapter-verify.yml` ("Verify chapter content build") | **red, and has been for a while** | no |

`chapter-verify` runs `tests/layout-check.cjs`, which fails on 36 pre-existing
small-text findings (§8). It has been red since before the header work. Do not
read a red tick there as "my change broke something" — check *which* checks
failed first.

### Stale branches

`pending-fixes` and `rebuild/structure` are old and unmerged. Do not bring
anything back from them without reading it first. `biology/learning-sync` holds
the half-built sync merge logic (§6).

---

## 4. Cache busting — the rule that bites

Every stylesheet, script and **relative module import** must carry the same
`?v=N` within one app. A module reached under two different query strings is
loaded **twice**, as two separate instances with separate state, and the
symptoms are baffling.

- **AP Government**: one number across the whole graph — `american-history.html`,
  `layout/*.js`, `pages/*.js`, `components/*.js`, `content/*.js`. Currently
  `?v=12`. `tests/smoke.cjs` fails if any of them drift.
- **Biology / Math Quest**: their own numbers, bumped per file.

Bump AP Gov's whole graph with:

```bash
for f in american-history.html components/timeline.js content/chapters.js \
         layout/router.js pages/chapter.js pages/course-map.js pages/home.js \
         pages/journal.js pages/practice.js pages/study.js; do
  sed -i 's/?v=12/?v=13/g' "$f"
done
```

If a change does not show up in the browser, this is the first thing to check.

---

## 5. Tests

| Command | What it proves | Expected |
| --- | --- | --- |
| `node tests/smoke.cjs` | structural invariants — CSS scoping, one cache version, no inline handlers, every image exists, the shared header and journal rules | **210/210** |
| `node tests/quiz-check.cjs` | the AP Gov quizzes score correctly | passes |
| `node tests/layout-check.cjs` | renders every route and looks for tiny text, overflow, missing images | **36/72 — 36 known failures** (§8) |
| `node tests/publish-safety.cjs` | a deploy cannot lose a note: every merge rule is additive, and no journal payload is committed to this public repo | passes |
| `node tools/backup.cjs` | not a test - takes the copy you want to have before publishing | writes two files |
| `node tools/restore.cjs --list` | not a test - shows what you can roll back to | lists snapshots |

`smoke.cjs` must be green before any merge. It is the file that stops the three
subjects quietly drifting apart.

### Back it up before you publish

```
node tools/backup.cjs
```

Reads the journal and his work off the Worker and writes them to
`~/esh-backups` as plain JSON, outside this repository because this repository
is public. It prints what it saved in words - *"5 notes, 1 replies, 4 lesson
links, 2026-09-22 to 2026-09-23"* - and reads each file back before claiming
it is saved. It never writes to the server.

Do this before every publish. It takes two seconds and it is the copy that
survives the Worker itself.

**Restoring**, if it ever comes to that: POST the file back. The command is
printed at the end of every backup. A POST *merges* - it adds what is missing
and cannot subtract - so putting an old copy back cannot undo anything written
since. That is rehearsed, not assumed: `restore-drill.cjs` puts a real backup
onto an empty local worker, checks every note, reply, reaction and link comes
back word for word, then writes something new and restores the old copy over
the top to prove the new thing survives.

**The Worker keeps its own history too.** It snapshots before every write:
the last 60, plus the first of each day for forty days. Sixty on their own
covered nineteen hours once the family started using it properly, so a busy
week would have pushed last Tuesday off the end. `GET /journal/history` lists
them, `POST /journal/restore {id}` puts one back, and the state being replaced
is itself snapshotted first.

### If the worst happens: putting it back

```
node tools/restore.cjs --list                       # what you can go back to
node tools/restore.cjs --to 2026-09-24T02:00        # look at what that would do
node tools/restore.cjs --to 2026-09-24T02:00 --yes  # do it
```

Nothing writes without `--yes`, and every run prints what would change note by
note, with `<< WOULD BE LOST` against anything that would go. The state being
replaced is saved twice before it goes: the Worker snapshots it, and the tool
writes a `*-before-restore-*.json` on this laptop. A restore is itself
reversible.

**Two ways back, for two different accidents.**

| What happened | What to use |
| --- | --- |
| Something is MISSING | `--to <time>` (a server snapshot), or `--from <backup file>` which merges: it adds and never removes |
| Something WRONG is there and has to go | `--from <file> --replace`, which clears the server first |

`--what progress` does the same for his attempts, explanations and quiz scores.

**Rehearsed, not assumed.** `rollback.cjs` in the scratchpad plays the whole
thing out against a local worker: a real journal, wiped; restored from the
server's history; then overwritten with nonsense, merged back (and the nonsense
correctly still there), then `--replace`d (and the nonsense correctly gone);
then his progress the same way. Run it before trusting any change to this
path.

### Publishing cannot reach the notes

Asked directly, more than once: *does pushing the code and publishing overwrite
the notes?* No — and here is the whole argument, so it can be checked rather
than believed.

**The notes are not in the repository.** Publishing is a push to `main`; GitHub
Pages serves the files as they are. A deploy replaces HTML, CSS and JS. The
notes live in the Durable Object and in each browser, which a file deploy has
no way to touch. `tests/publish-safety.cjs` walks every text file in the repo
and fails if a journal or progress payload was ever pasted into one — that
would also publish his school notes to the world, since the repo is public.

**No merge rule can subtract.** The only way a release has ever taken data is
through code, so every rule in `journal-merge.js` and `progress-merge.js` is a
union, a max or an OR. A side that knows nothing about something may never
remove it. That is the rule that matters on a parent's laptop, which arrives
empty, and it is what `tests/publish-safety.cjs` checks case by case: an empty
copy merged either way round keeps every note, reply, reaction, link and score,
a stale copy is not read as a set of deletions, and deletes still travel as
tombstones rather than holes.

**And it is proved end to end, not only in the rules.** The browser test
`fresh.cjs` (scratchpad) seeds a local worker with a note, thread, reaction and
link, then opens the site in a browser with empty storage, leaves it through a
full round of polling, reloads it as though a new version had shipped, and
opens a second empty machine. The server is byte-for-byte unchanged, and the
empty laptop pulls the note down rather than pushing its emptiness up.

**The one real risk is shipping half of it.** The site and the Worker share
`shared/journal-merge.js`, so they cannot drift in the repo — but they can
drift *in production* if one is deployed without the other. An older Worker
silently drops fields the new site writes; that is how the first lesson links
disappeared. §7 has the probe. Ship both, in that order, every time.

### Never test against the live Worker

**Tests must point at a local worker, never at
`ethan-journal.bezuwm.workers.dev`.**

```
npx wrangler dev --port 8788 --local --var FAMILY_KEY:ethan-lab-2026
```

Several tests clear the journal so they start from a known state. Pointed at
the deployed Worker, that is a production delete. It happened on 2026-09-22,
while Ethan was writing, and wiped the journal he was adding to. The DELETE
route exists *for testing* and was aimed at the family's data.

The rule is absolute: no test, probe or one-off script writes to production.
Reading it to check something is fine. Writing is not. If a script needs a
clean slate, it needs a local worker.

### Browser testing

There is no test framework. Browser tests are written ad hoc against the Chrome
DevTools Protocol using Node's built-in `WebSocket` — no dependencies. They
spawn `--headless=new` Chrome on a private debug port and a throwaway profile.

Two habits worth keeping:

- **Kill the Chrome you spawned.** A timed-out probe leaves a browser holding
  the debug port, and the next run silently connects to the *old* one and
  reports stale results. This has cost hours before.
- **Assigning `location.href` to the URL you are already on does not reload.**
  Check and call `location.reload()` instead, or the second half of a test
  silently tests nothing.

---

## 6. Where the journal data lives

**This is the most important section in this file.**

### The browser holds a copy; the Worker holds the journal

| | |
| --- | --- |
| Where | `localStorage`, key `esh-learning-log-v1` |
| Scope | this browser — a cache, synced to the Worker in §7 |
| Shape | `{ entries: [{ subject, date, text, ts, comments: [{id, who, text, ts, del?}], reactions: [{k, who, ts, off?}] }], seen: {}, lastWho }` |
| Written by | `shared/learning-log.js` |

All three subjects share one key and are told apart by the `subject` field, so
a combined view across subjects stays possible without moving anyone's data.

### His work, as opposed to his notes

Separate stores, one per subject, each with a shape its own app chose long
before any of this synced. All three are synced by `shared/progress-sync.js`
to the `/progress` document (§7).

| Key | Holds |
| --- | --- |
| `ethan_biology_v1` | `{ explored[], attempts[], notes{}, last }` |
| `ethan_math_quest_v2` | `{ version, attempts[], lessonStarted, lessonComplete, ... }` |
| `ethanQuizScoresV1` | `{ chapterId: { best, last, total, attempts } }` |

**Every merge rule in `shared/progress-merge.js` is a union, a maximum or an
OR. Nothing there can make a store smaller.** That is the safety property the
whole feature rests on, not tidiness: a parent's laptop has no progress on it,
so a rule that could subtract would mean his mum opening the Biology page
deletes his term's work.

Two consequences worth knowing before changing that file:

- A sync can never remove anything, so clearing is a deliberate `DELETE` (§7).
- Biology's per-lesson note boxes carry no timestamp, so when two copies
  differ the longer text wins. It is a guess, chosen because it loses the
  least — he adds to those as he thinks, and an empty box never beats a
  written one.

### A deploy does not touch it

Verified, not assumed. Notes and a full comment thread were written on the live
build, then every file was overwritten underneath a running server — same
origin, same browser, hard reload, nothing cleared:

```
3 entries, 3 comments written on the old build
  → all 3 entries survived, text word for word
  → the conversation survived in order
  → reactions worked on a note written before reactions existed
  → storage key unchanged
```

Notes live in the browser's storage, not in the site's files. Deploys replace
files. The storage is untouched.

### What *would* lose them

1. **Changing the storage key.** `esh-learning-log-v1` is load-bearing. If the
   format ever has to change, **migrate** — read the old key, transform, write
   the new one. Never just bump the version and ship.
2. Clearing browser data, a different browser, a different device, private
   windows.
3. A schema change that drops fields. Every reader in `learning-log.js` is
   defensive (`comments(e)`, `reactions(e)` both default to `[]`) so older
   entries keep working. Keep it that way.

### It is a cache, not the only copy

Reading never waits on the network: every page draws from this local copy, so
the journal is instant and works offline. §7 keeps it in step with the Worker
in the background. A laptop that is **not** connected still works perfectly —
it is simply private to that machine, and the strip under the calendar says
so in as many words.

Losing this local copy is no longer losing the journal: connect the laptop
again and it comes back down from the Worker.

`biology/learning-sync` holds an earlier attempt at sync using a private GitHub
repo and a personal access token. **It is not what was built** — a token
in browser storage on a shared origin, expiring within a year and failing
silently, is worse than the alternative below.

---

## 7. Sync — the Cloudflare Worker

**This is live.** The journal is shared across devices.

| | |
| --- | --- |
| Endpoint | `https://ethan-journal.bezuwm.workers.dev/journal` |
| Worker | `worker/journal.js`, config in `wrangler.toml` |
| Storage | a Durable Object named `family`, one JSON document |
| Auth | one shared passphrase in an `Authorization: Bearer` header |
| Account | `bezuwm@gmail.com`, `d278cfe038a87cd5b338f95e49971bc1` |
| Client | `shared/journal-sync.js`, merge rules in `shared/journal-merge.js` |

Routes:

```
GET    /journal    -> { entries: [...] }     the daily notes and the thread
POST   /journal    -> merged in, returns the result

GET    /progress   -> { stores: {...} }      lessons, practice, quiz scores
POST   /progress   -> merged in, returns the result

DELETE /journal | /progress   -> clears that document
```

Both documents live in the same Durable Object under different keys, with the
same auth. Their merge rules differ because their shapes do.

`DELETE` exists because nothing in either merge can take anything away, so
there has to be exactly one deliberate way to clear a document — a new school
year, or a test that needs to start from nothing. **No page on the site ever
sends it.**

**POST merges, it never replaces.** Three laptops can write the same day
while offline and come back in any order; the server settles it with the same
rules the browsers use, because it imports the very file the browsers load.
There is no "last write wins on the whole document", which is how you lose an
afternoon's work to a stale tab.

### Why a Durable Object and not KV

It was KV first, and KV was wrong. Every write here is read-merge-write, and
KV caches reads at the edge with no read-after-write guarantee. The
two-browser test caught the consequence: one laptop synced while its read was
stale, merged its own nothing into an empty journal, and wrote that back over
a note that had already reached the server.

A Durable Object serialises every request through one instance with strongly
consistent storage, so the read a merge is based on is always the real one.
**Do not move this back to KV.** Any store without read-after-write
consistency is unsafe for this access pattern.

### Deploying a change to the Worker

```
npx wrangler deploy          # from the repo root
```

**The site and the Worker are two separate deploys, and they share code.**
`shared/journal-merge.js` and `shared/progress-merge.js` are loaded by the
browser *and* compiled into the Worker. Touch either and BOTH must ship.

This is not a tidiness rule. The merge decides which fields survive, so a
Worker running the older copy **silently drops whatever the new browsers are
sending**. It happened on 2026-09-22: the site shipped with lesson links on
the daily note, the Worker did not, and every link was stripped on the next
sync — no error, no warning, the field simply vanished.

The check, after any release that touches a merge file:

```bash
# write a value only the new merge understands, and read it back
node -e "fetch('https://ethan-journal.bezuwm.workers.dev/journal',{method:'POST',
  headers:{Authorization:'Bearer <key>','Content-Type':'application/json'},
  body:JSON.stringify({entries:[{subject:'math',date:'1970-01-01',text:'probe',
  ts:Date.now(),lesson:{title:'t',href:'#h'}}]})}).then(r=>r.json())
  .then(j=>console.log(j.entries.find(e=>e.date==='1970-01-01').lesson || 'DROPPED'))"
```

If it prints `DROPPED`, the Worker is behind the site.

### The journal keeps its own history

Every change snapshots the version before it. Sixty are kept, and a restore
snapshots what it replaces, so a restore is itself reversible.

```
GET  /journal/history        what can be gone back to, newest first
POST /journal/restore        { "id": "snap:journal-v1:1790..." }
GET  /progress/history       the same for his work
POST /progress/restore
```

**Nobody should ever retype a note from a screenshot.** That happened on
2026-09-22, twice, because the Worker kept no history and there was nothing
to go back to. Restoring is now a command, not archaeology.

Snapshots are taken only when a write actually changes something, so a laptop
polling every 45 seconds does not fill the history with identical copies.
DELETE snapshots first as well.

### Never write to the journal by hand

Not to clean up test data, not to tidy, not to fix formatting. The only
writes to `/journal` and `/progress` come from the site itself.

Restoring a snapshot after a confirmed loss is the sole exception, and it is
the user's call, not the assistant's. Every hand-written "cleanup" in this
project has destroyed something real: a note was blanked on 2026-09-22
because it had been written in the minutes between reading the server and
writing to it. Reading is safe. Writing is not.

### The key, and why it ships with the page

`shared/family-key.js` carries the key, so **every browser is connected the
moment it loads the site**. No prompt, no button, nothing to remember, on any
machine.

**It is not a secret and nothing should be built as though it were.** It is
served to anyone who opens the site. What it buys is that Ethan never writes
a note, saves it, and finds out later it went nowhere — which is the failure
a per-browser passphrase allowed, and the reason the trade was made. The site
carries a `noindex` and is not linked from anywhere, so it is unlisted rather
than protected.

The server side is a real secret and stays one:

```
npx wrangler secret put FAMILY_KEY      # Cloudflare's copy
```

To rotate: change `shared/family-key.js`, publish, and set the secret to
match. Every browser follows on its next load — no going round three laptops.

**Planned:** a proper login in front of this. The `connect` / `disconnect`
path in `shared/journal-sync.js` is deliberately still there and still works,
so that can replace the built-in key without a rewrite.

### Connecting a laptop

Nothing to do. Opening the site is connecting.

### What syncs and what does not

Journal entries sync — notes, comments, reactions, and their tombstones — and
so do the three progress stores. `seen` and `lastWho` do **not**: they say what the person at *this* device has read and
who they last posted as. Syncing `seen` would clear Ethan's unread badge the
moment his mum opened the journal on hers.

### Deletes are tombstones, not holes

A deleted note is an empty `text` with a fresh timestamp. A deleted comment
keeps its id and carries `del: true`. A reaction taken off keeps its row and
carries `off: true`. All three are invisible in the UI and all three must
stay in the store — a row that simply vanished would be restored by the next
laptop that still had it. `comments()` and `reactions()` in
`shared/learning-log.js` filter them for display; `rawComments()` and
`rawReactions()` are what writing and merging use.

### Clearing the journal

There is no delete endpoint by design. To wipe it, POST every entry back
blanked — an empty `text`, every comment `del: true`, every reaction
`off: true`, all with a timestamp ahead of what is stored. A tombstone with
an older timestamp will simply lose the merge.

## 8. Known issues

| Issue | Detail |
| --- | --- |
| **`chapter-verify` is red** | 36 findings of 11–12px text on the AP Gov home and chapter pages. Pre-existing, unrelated to recent work, does not gate the deploy. |
| **Biology home overflows** | ~110px too tall on windows between roughly 780px and 1000px tall, so a scrollbar appears. Confirmed pre-existing against an untouched `main`. Math Quest's home has had the fix; Biology's has not. |
| **The founding story has no way in** | AP Gov's `#/study` routes all work and the chapters link to each other, but nothing at the top level points into them since Study left the nav. A link from the Course Map is the natural fix. |
| **`/favicon.ico` 404** | Biology and Math Quest declare no icon, so the browser probes the site root. Cosmetic. |
| **The journal is unlisted, not private** | The key ships with the page, so anyone who opens the site — or reads its source — is in. Deliberate, documented in `shared/family-key.js`, and to be replaced by a login. |
| **The school calendar is empty** | `shared/school-calendar.js` has no dates in it, so every weekday counts as a school day and a holiday will show as a day Ethan missed. It needs the district's published academic calendar — **not** a sports fixture list, and nothing from memory. See BUILD-GUIDE. |

---

## 9. Conventions worth not rediscovering

- **CSS scoping is enforced.** `pages/NAME.css` may only contain selectors
  starting `.page--NAME`; `components/NAME.css` only `.c-NAME`. Only
  `layout.css` may style `header`, `footer`, `body`. Zero `!important`. No
  inline `on*` handlers. `smoke.cjs` checks all of it.
- **The AP Gov chrome renders once**, at boot, and navigation only moves
  `aria-current`. That is what guarantees the header is identical on every
  route. Do not re-render it per route.
- **The shared header cluster** (`shared/subject-header.js`) is built once and
  mounted by each app into an empty element. Never hand-roll one of its four
  controls inside a subject's own header — that is how the three drifted apart
  the first time.
- **Editing files from a script:** encode before opening. `open(p, 'w')`
  truncates on open, so an encoding error part-way through leaves a zero-byte
  file. Do `data = text.encode('utf-8')` first, then `open(p, 'wb')`.
- **Regexes inside JavaScript template literals lose their backslashes.**
  `` `...match(/of (\d+)/)` `` becomes `/of (d+)/`. Write `\\d`, or avoid the
  regex.
