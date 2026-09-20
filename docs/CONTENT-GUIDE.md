# Chapter content guide

This file is written to be handed straight to an assistant (ChatGPT or similar)
along with `content/chapters.js`. It describes exactly what goes in each field
and how long it should be.

**The only file to edit is `content/chapters.js`.** Nothing else needs to
change. Every field is optional: the page renders the blocks it has data for
and skips the rest, so content can be filled in one piece at a time and the
page is never broken or half-empty.

The five chapters are, in order:

| id | years | short |
|---|---|---|
| `colonies` | 1607–1775 | British Colonies |
| `declaration` | 1776 | Declaration of Independence |
| `articles` | 1781–1789 | Articles of Confederation |
| `convention` | 1787 | Constitutional Convention |
| `constitution-rights` | 1788–1791 | Constitution + Bill of Rights |

---

## Audience and tone

Written for a high-school student taking AP U.S. Government, and for a parent
reading alongside. Plain, confident sentences. Explain the idea rather than
listing dates. Nonpartisan throughout — where historians disagree, say so
rather than picking a side. Do not soften the difficult parts of the founding
(slavery, who counted as a person, who could vote); state them plainly.

---

## Fields

### Identity — do not change
`id`, `n`, `years`, `short` are used by the timeline and the routes. Leave
them alone unless you also want the URL to change.

### Hero

| field | what it is | length |
|---|---|---|
| `title` | The chapter heading. May include the year, e.g. `1776 — Declaration of Independence`. | under 45 characters |
| `deck` | One line under the title. A hook, not a summary. | 6–12 words |
| `intro` | Sets up the chapter in the hero. | 2–3 sentences, 40–60 words |
| `heroQuote` | `{ text, source }`. A real quotation from or about the period. | text under 25 words |
| `actions` | Optional hero buttons: `[{ label, href, primary }]`. Omit for none. | 1–2 buttons |

### The big picture

| field | what it is | length |
|---|---|---|
| `bigPicture.heading` | A question the chapter answers. Not a label. | under 60 characters |
| `bigPicture.body` | The core explanation. May wrap key terms in `<strong>` or `<em>` — see below. | 45–70 words |

> **Where HTML is allowed.** Four prose fields accept `<strong>` and `<em>` and
> nothing else: `bigPicture.body`, `closerLook.body`, `closerLook.sections[].note`,
> `whyItMatters.body` and `whatsNext.body`. Everything else is escaped, so a tag
> typed into any other field will print as literal text. Any other tag, even in
> the fields above, is escaped too.

### Gallery

`gallery` lives in the `GALLERIES` map near the bottom of `chapters.js`.
Five slides per chapter.

| field | what it is | length |
|---|---|---|
| `label` | Thumbnail caption. | 1–3 words |
| `caption` | One line under the image on the big stage. | 8–16 words |
| `src` | Path to the image, or `null` for a placeholder. | see **Images** |

The five slides should tell the chapter as a sequence — beginning, turn,
consequence — not five views of the same moment.

### Key takeaways

`takeaways` — an array of **five** strings, each a complete sentence, 8–18
words. These are what a student should be able to say back without notes.
Order them so they build.

### Interesting fact

| field | what it is |
|---|---|
| `fact.text` | One genuinely surprising, verifiable fact. 25–45 words. |
| `fact.name` | The person or thing the fact is about. |
| `fact.dates` | e.g. `1743–1826`, or `ratified 1791`. |
| `fact.portrait` | Optional image path. Without one, a medallion of the initials is drawn. |

### A closer look

| field | what it is |
|---|---|
| `closerLook.title` | What is being examined, e.g. `The Document`. |
| `closerLook.body` | Why it is worth examining. 25–40 words. |
| `closerLook.href` | Where the button goes. **Omit it and no button is shown** — currently omitted on all five chapters. |
| `closerLook.cta` | Button label, used only when `href` is set. The arrow is added automatically. |
| `closerLook.image` | Optional image path. |
| `closerLook.sections` | **Four** `{ label, note }` pairs. Add `href` to a pair to make that row a link; without one it is a plain row. |

### Why it matters

| field | what it is |
|---|---|
| `whyItMatters.body` | Why this still matters. 25–40 words. |
| `whyItMatters.steps` | 3–4 short stages, rendered as a flow diagram. 1–4 words each. |

### Quick check

| field | what it is |
|---|---|
| `quickCheck.question` | One multiple-choice question on the chapter's main idea. |
| `quickCheck.options` | **Four** options. The wrong ones must be plausible, not filler. |
| `quickCheck.answer` | **Zero-based index** of the correct option. `0` is the first. |
| `quickCheck.why` | Shown after a correct answer. Explains *why*, 15–30 words. |

> Getting `answer` wrong is the easiest mistake to make. It is an index, not a
> number: if the third option is correct, `answer: 2`.

### What's next

`whatsNext.body` — one or two sentences pointing forward, 20–35 words. Do not
name the next chapter's title; it is linked automatically.

---

## Images

Every image slot is optional. A slot with no file renders a designed
placeholder showing its label, so the layout is final before art arrives.

To add an image: drop the file in `assets/chapters/` and set the path in
`chapters.js`.

| slot | where it appears | recommended size | how many |
|---|---|---|---|
| Gallery slide | the large carousel | 1200 × 515 (21:9) | 5 per chapter = **25** |
| `closerLook.image` | middle of the closer-look band | 800 × 600 (4:3) | 1 per chapter = **5** |
| `fact.portrait` | Interesting Fact card | 200 × 200, square | 1 per chapter = **5** |
| `hero` | full-bleed chapter hero | 2400 × 1000 or wider | 1 per chapter = **5** |
| timeline thumbnail | the five-chapter strip | 240 × 264 | already present, low-res |

Notes:

- The hero currently falls back to `assets/home/hero-signing.jpg` for every
  chapter. That is the only high-resolution image in the repo.
- The five timeline thumbnails are about 72 × 104, which is roughly their
  display size — they will look soft on a high-DPI screen. Replacements at
  240 × 264 would sharpen them.
- Use public-domain sources. Record the credit alongside the entry.
- No external URLs. Images must be committed to the repo.

---

## After editing

```
node tests/smoke.cjs      # checks every image path resolves to a real file
python -m http.server 8080
```

Then open <http://localhost:8080/#/study/declaration> and step through all five
chapters.

`chapters.js` is plain JavaScript, so a stray quote or a missing comma will
stop the page rendering. If a chapter page comes up blank, that is almost
always the cause — check the browser console for the line number.
