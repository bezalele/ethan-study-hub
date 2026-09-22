# Ethan Study Hub build guide

Applies to every subject in the hub — Honors Biology, Algebra / Math Quest,
and AP U.S. Government. Hand this to an assistant along with whichever
content file is being edited.

This is a living document. Guidelines get added as we go; nothing here is
final. If a rule and good judgement disagree on a particular page, say so
rather than following the rule off a cliff.

---

## How we work

**The owner provides the course material. The assistant builds the
platform.** For every subject, the owner supplies the content and says what
he wants done. The assistant's job is the implementation: making it easy to
use, friendly, interesting, and interactive. Do not invent course content to
fill a gap — ask for it, or leave a clearly marked placeholder.

**Nothing is pushed or published until the owner has reviewed it locally and
approved it.** Not a commit to `main`, not a push to any branch, not a
deploy. The sequence is always:

1. Build the change on a branch off current `main`.
2. Run the local server and tell the owner what to look at.
3. Wait for approval.
4. Only then commit, push, and publish.

`main` is what GitHub Pages serves, so merging to `main` *is* publishing.
Treat it accordingly. Pull before branching, so work never starts from a
stale tree.

---

## Who this is for

One reader: **Ethan**, a high-school student. Not a class, not a general
audience, not a textbook committee. A parent may read alongside, but Ethan is
who the page is talking to.

Write like a person who knows him and wants him to get this, and who is not
going to waste his time.

---

## The voice

**Relaxed and direct.** Short sentences. Contractions are fine. Say the thing
rather than circling it.

> Cells are the smallest unit that counts as alive. Everything below that —
> a protein, a strand of DNA — is a part, not a living thing.

not

> It is important to note that the cell may be considered the fundamental
> structural and functional unit of all known living organisms.

**Second person.** "You" and "your", not "the student" or "one".

**Curious, not cheerful.** The energy comes from the material actually being
interesting, not from exclamation marks. Never fake enthusiasm — he can tell,
and it makes the real interesting bits harder to spot.

**Never condescending.** No "don't worry, this is easy!" If something is hard,
say it is hard and then make it clear.

---

## Using his name

Use **Ethan's name where it lands**, and nowhere else. Roughly:

- **Once or twice per page**, not per section.
- At the moments that carry weight: a welcome, a hard idea he is about to hit,
  a win worth marking, a warning that something is a common trap.
- Never in the middle of an explanation. It interrupts.

> **Heads up, Ethan** — this next part is the one people lose marks on.

Name-spamming reads like a mail merge and wears out fast. If a paragraph works
without his name, leave it out.

---

## Fun facts

A fun fact is a **named slot**, not sprinkled asides. Give it its own visible
component so it reads as a bonus, and so skipping it costs nothing.

Rules:

1. **True.** A fun fact that turns out to be wrong costs more trust than it
   ever bought. If it cannot be checked, drop it.
2. **Connected.** It has to attach to the idea on that page, not just be
   nearby. Something he would repeat at dinner *because* of what he just read.
3. **Short.** One or two sentences.
4. **Rationed.** Around one per lesson or section. Several in a row stop being
   a treat and become noise.
5. **Cite anything surprising** in the source notes, so it can be checked later.

> **Fun fact.** Your body makes about two million red blood cells every
> second. By the time you finish this sentence you have made a few million
> more.

---

## Drawing attention to what matters

Ethan needs to be able to tell, at a glance, what is load-bearing and what is
context. Use a small, fixed set of markers and use them consistently — the
value is in the consistency, not the variety.

| Marker | For | Frequency |
|---|---|---|
| **This is the one to remember** | The single idea the section exists to teach | One per section, at most |
| **Common trap** | A mistake that reliably costs marks | Only where it is genuinely common |
| **Fun fact** | A bonus that makes the idea stick | About one per lesson |
| **Test yourself** | A question he answers before moving on | End of a section |

If everything is highlighted, nothing is. When in doubt, highlight less.

---

## Where the tone changes

Relaxed is the default, not a rule that overrides the subject.

- **Serious history** — slavery, who counted as a person, who could vote — is
  written plainly and without jokes. Warmth is fine; levity is not. This
  matches `docs/CONTENT-GUIDE.md`, which stays authoritative for the AP Gov
  chapters.
- **Anything he will be examined on** is precise first and friendly second. If
  making a sentence fun makes it less accurate, it stays boring.
- **Nonpartisan** throughout, as before. Where people genuinely disagree, say
  that they disagree.

---

## The header is the same in every subject

Top right of Biology, Math Quest and AP U.S. Government, in this order:

| | who it is for | what it does |
| --- | --- | --- |
| **Today's Note** | Ethan | opens the editor over the page he is already on |
| **Ethan's Journal** | his mum, and him | the whole record: every day, every reply |
| **Study Hub** | both | back out to the three subjects |
| **E** | — | whose hub this is |

Two doors to the same notes on purpose. Writing should cost him nothing —
one click, from wherever he is, no navigation. Reading is a different job:
his mum needs one address she can be told once and find in any subject, and
replies need the history around them to make sense.

The unread-replies badge sits on **Ethan's Journal**, never on Today's Note.
A reply is something to go and read; a number on the writing button would
read as homework outstanding.

This is built once, in `shared/subject-header.js` and
`shared/subject-header.css`, and mounted by each app into an empty element.
Do not hand-roll any of the four in a subject's own header — that is exactly
how the three drifted apart the first time. `tests/smoke.cjs` checks all
three subjects load the shared files, mount the cluster, and have no
leftover search box or second avatar.

Each subject sets only three colour variables (`--sh-ink`, `--sh-fill`,
`--sh-edge`) so the shapes stay identical while the palette stays native.
AP Gov adds `sh-on-dark` because its header is a green banner.

### What each control means

- The **wordmark** goes to that subject's own home page, on all three. It is
  the subject's masthead, not the way out.
- The **Study Hub chip** is the only way out of a subject, and it is in the
  same corner everywhere. One exit, labelled, always in the same place.
- **Home** in the side nav does the same job as the wordmark. That is fine:
  a logo that goes home is what people expect.

### The sidebar footer

Biology and Math Quest end their side nav with one true fact, chosen by the
date so it does not flicker as he moves between pages. It replaced a slogan.
He reads that spot a hundred times a term and a slogan goes invisible by the
third day; a fact that changes is worth a glance.

The facts live in a `FACTS` array at the bottom of each app's `app.js`.
Anything in there must be true — see the last section. Swap them freely.

### Home pages fit one screen

All three home pages are sized to the viewport rather than scrolling, so the
first thing he sees is the whole thing. Math Quest gets there with clamps
tied to `vh`, and below an 880px-tall window it drops the unit descriptions
the way the header chips drop their labels when they run out of width — the
unit number and name still say what each card is.

Known exception: the Biology home page overflows by about 110px on windows
between roughly 780px and 1000px tall. It predates this work.

---

## Accuracy beats everything here

Every rule in this document loses to being correct. A relaxed, funny,
personalised page that teaches him something false has done real damage — he
is going to be tested on this.

---

## Adding to this guide

Add a section, keep the examples concrete, and say what the rule is *for*.
Rules without reasons get applied in the wrong places.
