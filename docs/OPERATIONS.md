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

`smoke.cjs` must be green before any merge. It is the file that stops the three
subjects quietly drifting apart.

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

Two routes, nothing else:

```
GET  /journal   -> { entries: [...] }
POST /journal   -> body { entries: [...] }, merged in, returns the result
```

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

The site and the Worker deploy separately. Changing `shared/journal-merge.js`
changes both, so deploy the Worker and push the site together, or the two
sides will disagree about a merge for as long as they are out of step.

### The passphrase

Currently `ethan-lab-2026`. It lives in exactly two places: Cloudflare, and
each laptop's browser storage. **Never in this repo, which is public.**

```
npx wrangler secret put FAMILY_KEY      # to change it
```

Changing it disconnects every laptop until each retypes the new one.

### Connecting a laptop

Once per browser, about ten seconds:

1. Open the journal on that laptop
2. Under the calendar: *"Saved on this laptop only. Connect this laptop"*
3. Type the passphrase, press enter
4. It then reads *"Shared with your family"* and never asks again

It is per **browser**, not per laptop: Chrome and Safari on the same machine
are two connections.

### What syncs and what does not

Entries sync — notes, comments, reactions, and their tombstones. `seen` and
`lastWho` do **not**: they say what the person at *this* device has read and
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
| **Sync is opt-in per browser** | A laptop nobody connected keeps its notes to itself, silently and correctly. If a note "did not arrive", check the strip under the calendar on both machines first. |
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
