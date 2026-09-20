# Course Map Interactive Study Guide — Claude Implementation Specification

**Status:** Approved direction for implementation review  
**Product owner:** Bezalel  
**Content/product lead:** ChatGPT  
**Implementation engineer:** Claude  
**Target branch:** `course-page-interactive-study-guide`  
**Scope:** ONLY the AP U.S. Government Course Map / Course page (`#/course`)

---

## 1. Branch and safety rules

This work is intentionally isolated from the live/main experience.

- Work only on `course-page-interactive-study-guide`.
- Do **not** merge to `main` without explicit product-owner approval.
- Do **not** deploy/publish from this branch unless the product owner explicitly asks.
- Do not modify Home, Study, story chapter pages, Constitution pages, Biology, Math Quest, or the Study Hub.
- Preserve the existing global header/navigation unless a Course-page-only CSS adjustment is strictly required.
- Keep each review checkpoint as its own commit so the product owner can inspect or revert it independently.
- If implementation requires touching a file that affects pages outside `#/course`, stop and explain why before changing it.

### Expected Course-page files

Prefer to keep changes limited to:

- `pages/course-map.js`
- `pages/course-map.css`
- `content/course.js`
- a new Course-page-only data module such as `content/courseDetails.js`
- new Course-page-only images under `assets/course-map/`

Avoid changes to shared/global CSS and shared route behavior unless absolutely necessary.

---

## 2. Product goal

The Course page is the **map of the entire AP U.S. Government course**.

It should not feel like a syllabus, textbook table of contents, LMS, or a wall of cards.

The student should be able to click any of the five units in the left rail and immediately get a **simple, visual, interactive explanation on the right**:

1. What is this unit really about?
2. Why should I care?
3. What is the big question?
4. What are the few core ideas I need to understand first?
5. Can I interact with a visual model to see how the pieces connect?
6. Can I try one short knowledge check?
7. If I want the full course material, where will the future full Unit Detail page live?

The Course page is the **summary + orientation layer**.

The future Unit Detail pages are where complete coverage, documents, cases, vocabulary, lessons, and larger practice sets will live. Do **not** build those separate Unit Detail pages in this phase.

---

## 3. Locked page behavior

### No page-level vertical scrollbar on desktop

The page itself must fit inside the browser viewport.

- The browser/body Course page must not vertically scroll at normal desktop sizes.
- The top navigation and existing Course Map title band remain visible.
- The left unit rail remains visible.
- The **right Course Detail panel is the scrollable region** when its content is taller than the available space.
- Use a layout that correctly supports nested scrolling: grid/flex children should use `min-height: 0`; the detail panel should use `overflow-y: auto`.
- The detail panel scrollbar should be visually subtle but discoverable.
- Do not hide content merely to eliminate the scrollbar.

Desktop acceptance sizes:
- 1440 × 900
- 1920 × 1080

At those sizes, there should be **no browser/body vertical scrollbar** while the right detail panel may scroll internally.

### Responsive behavior

On smaller screens:
- preserve the same information hierarchy;
- convert the five-unit rail to compact horizontal tabs/chips or another space-efficient selector;
- keep the unit detail as the primary readable area;
- avoid tiny text or squeezed multi-column cards;
- internal scrolling is acceptable, but the experience must remain obvious and usable.

---

## 4. Main interaction model

### Left rail = unit selector

Keep the five official AP U.S. Government units visible:

1. Foundations of American Democracy — 15–22%
2. Interactions Among Branches of Government — 25–36%
3. Civil Liberties and Civil Rights — 13–18%
4. American Political Ideologies and Beliefs — 10–15%
5. Political Participation — 20–27%

When a unit is selected:

- update the right panel **in place**;
- do not navigate away from the Course page;
- clearly show which unit is active;
- use a short restrained transition (fade/slide, approximately 150–250 ms);
- honor `prefers-reduced-motion`;
- preserve keyboard access;
- do not auto-scroll the whole page.

The default selection remains Unit 1.

### Right panel = interactive unit summary

The right panel should feel like a small visual lesson, not a static description.

Recommended order inside the internally scrollable panel:

1. **Unit header**
2. **Big question / why it matters**
3. **Visual story / image**
4. **Interactive concept model**
5. **Core ideas**
6. **One-minute study summary**
7. **Quick Check**
8. **Future full-unit CTA / reserved area**

Do not show all sections as identical bordered cards. Use editorial hierarchy, imagery, diagrams, and whitespace.

---

## 5. Unit panel component design

### A. Unit header

Show:

- `UNIT 01` etc.
- official unit title
- exam weighting in small secondary text
- one short human-readable hook
- 1–2 sentence plain-English summary

The title and summary should be readable without scrolling on initial selection.

### B. Big Question

A visually distinct prompt answering: “What question is this unit trying to answer?”

Keep it to one sentence.

### C. Visual Story

Each unit gets one strong visual anchor.

Preferred treatment:
- one large image or composed historical/civic visual;
- short caption;
- optional 2–3 thumbnail alternatives only if they add meaning;
- image should support the concept, not decorate empty space.

Image rules:
- prefer public-domain or official historical/civic sources;
- no fabricated historical scenes;
- no partisan campaign imagery used as decoration;
- no external image hotlinks in the final implementation;
- store images in `assets/course-map/`;
- include alt text and source/credit metadata.

### D. Interactive Concept Model

Each unit must have one simple click/tap interaction that helps the student understand the structure of the unit.

Behavior:
- show the model at a glance;
- clicking one node highlights it and reveals a 1–3 sentence explanation;
- one concept should be expanded at a time;
- keyboard operable;
- selected state must be visually obvious;
- no modal required;
- keep it simple enough to understand in seconds.

### E. Core Ideas

Show 4–6 core ideas.

Each item:
- short title;
- one plain-English sentence;
- optional tiny icon/image;
- expandable only if useful.

Do not turn this into the full AP topic list. The purpose is orientation.

### F. One-Minute Study Summary

A compact section titled something like **“If you remember only this…”**

Use 3 concise statements that connect the unit into a coherent mental model.

### G. Quick Check

One short interactive question per unit.

- four plausible options;
- one correct answer;
- immediate feedback;
- explain *why* in one or two sentences;
- never use trick questions;
- content must come from information presented in this Course-page summary;
- do not mark progress/mastery simply because a page was opened.

### H. Future Full Unit Guide

Reserve a clear location for:
**“Open the full Unit X study guide →”**

Important for this phase:
- Do not create the full Unit Detail pages yet.
- Do not create dead links.
- If a full-unit route does not exist, render the CTA as a non-clickable “Full unit guide — next phase” treatment or omit it.
- The architecture should make it easy to wire future routes such as `#/course/unit/1` through `#/course/unit/5` later.

The current `#/study` Founding Story is a separate learning experience. Do not modify it in this work.

---

## 6. Content for the five Course-page summaries

The language below is product-approved direction. Claude may make tiny grammar/length adjustments to fit the UI but should not materially rewrite the learning meaning.

### UNIT 1 — Foundations of American Democracy

**Hook:** How do you build a government strong enough to work, but limited enough to protect freedom?

**Plain-English summary:**  
The United States did not begin with the Constitution. Americans declared independence, tried a weak national government under the Articles of Confederation, then redesigned the system around divided and limited power.

**Big Question:**  
Why was American government designed this way?

**Visual Story:**  
Use a historical/document-centered image. The visual sequence should make the progression easy to grasp:
**Declaration → Articles of Confederation → Constitution → Bill of Rights**

**Interactive Concept Model:**  
A four-step document/story path. Clicking each step explains its job:
- **Declaration** — explains why the colonies claimed independence and states political ideals.
- **Articles** — the first national governing framework; intentionally kept the central government limited.
- **Constitution** — creates a stronger national government while dividing and limiting its power.
- **Bill of Rights** — the first ten amendments, added to protect specific liberties and address concerns about federal power.

**Core Ideas:**
- Ideals of democracy
- Popular sovereignty and consent
- Limited government
- Separation of powers
- Checks and balances
- Federalism

**If you remember only this:**
1. Independence created a new problem: the states now needed a workable national government.
2. The Articles showed the costs of a national government with very limited power.
3. The Constitution strengthened national authority while dividing power to prevent concentration.

**Quick Check:**  
Why did the Constitution create separate branches with different powers?

Correct idea: to divide government power so no single institution controls all major national powers.

---

### UNIT 2 — Interactions Among Branches of Government

**Hook:** Who does what in Washington — and who can stop whom?

**Plain-English summary:**  
Congress, the president, the federal courts, and the bureaucracy have different jobs. Government policy emerges from how those institutions share power, compete, cooperate, and check one another.

**Big Question:**  
How do the branches use power and influence one another?

**Visual Story:**  
Use a neutral civic/institutional image showing or representing the Capitol, White House, and Supreme Court. Avoid partisan officeholder imagery as the main visual.

**Interactive Concept Model:**  
A three-branch diagram:
- **Congress** — makes federal laws and controls major legislative powers.
- **President / Executive** — carries out laws and directs the executive branch.
- **Courts** — interpret laws and constitutional questions in cases before them.

Add simple arrows representing examples of checks:
- veto / override
- confirmation
- impeachment/removal process
- judicial review
- appointments

Do not imply that every branch has identical power.

**Core Ideas:**
- House and Senate
- Presidential powers
- Federal courts
- Checks and balances
- Federal bureaucracy
- Policymaking across institutions

**If you remember only this:**
1. The branches have different constitutional roles.
2. Their powers overlap enough that major action often requires interaction.
3. Checks and balances make concentrated power harder and can also create conflict or delay.

**Quick Check:**  
Which idea best explains why a president cannot normally make a federal statute alone?

Correct idea: federal lawmaking ordinarily requires the legislative process involving Congress, with the president participating through signature or veto.

---

### UNIT 3 — Civil Liberties and Civil Rights

**Hook:** What freedoms are protected, and what does equal protection require?

**Plain-English summary:**  
Civil liberties concern freedoms government must respect. Civil rights concern protection against unequal treatment. Courts, constitutional amendments, laws, and social movements have shaped how those protections apply.

**Big Question:**  
Where are the limits on government power over individual freedom and equality?

**Visual Story:**  
Use a rights-centered historical visual: Bill of Rights/document detail, courthouse, or historically appropriate civil-rights imagery with accurate source context.

**Interactive Concept Model:**  
A two-column explorer:
- **Civil Liberties** — freedoms such as speech, religion, due process, and other constitutional protections.
- **Civil Rights** — legal protections involving equality and discrimination.

Clicking a concept reveals a simple scenario and asks which side it belongs to.

**Core Ideas:**
- Bill of Rights
- First Amendment
- Due process
- Selective incorporation
- Equal protection
- Supreme Court interpretation

**If you remember only this:**
1. Civil liberties focus on protected freedoms.
2. Civil rights focus on equal treatment and protection from discrimination.
3. The meaning and application of these protections has developed through amendments, legislation, court decisions, and political action.

**Quick Check:**  
A dispute about whether government may punish protected political speech is primarily a question about what?

Correct idea: civil liberties, particularly freedom of speech.

---

### UNIT 4 — American Political Ideologies and Beliefs

**Hook:** Why can people look at the same government problem and want very different solutions?

**Plain-English summary:**  
Political beliefs develop through experience, family, community, events, information, and values. Polling and other data help us measure public opinion, but good analysis depends on understanding how the data were collected.

**Big Question:**  
Where do political beliefs come from, and how can we measure them?

**Visual Story:**  
Prefer a neutral data/public-opinion visual: people, survey/polling imagery, or a clean chart. Do not use imagery that presents one ideology or party as the default.

**Interactive Concept Model:**  
A flow:
**Experiences & institutions → political beliefs → public opinion → policy preferences**

Clickable influences may include:
- family
- school/community
- major events
- media/information
- demographic and social context

Explain these as influences, not deterministic causes.

**Core Ideas:**
- Political socialization
- Public opinion
- Polling
- Ideology
- Economic policy views
- Social policy views

**If you remember only this:**
1. Political beliefs are shaped by many influences rather than one single cause.
2. Public opinion can be measured, but sampling and question design matter.
3. Ideology helps organize political beliefs but does not make every person identical.

**Quick Check:**  
Why does the way a polling sample is selected matter?

Correct idea: a biased or unrepresentative sample can distort what the poll suggests about the larger population.

---

### UNIT 5 — Political Participation

**Hook:** How does a citizen’s voice become political influence?

**Plain-English summary:**  
People participate through voting, parties, campaigns, interest groups, civic activity, and political communication. Elections and political organizations connect citizens to government, but participation takes many forms.

**Big Question:**  
How do people influence elections, government, and public policy?

**Visual Story:**  
Use a neutral civic-participation image: voting, public meeting, historical ballot/campaign material, or news/media context. Avoid promoting a candidate or party.

**Interactive Concept Model:**  
A pathway:
**Citizens → participation → parties/groups/campaigns/media → elections & government → policy**

Clicking a participation method reveals a concise example:
- voting
- political parties
- interest groups
- campaigns
- media/information
- civic participation

**Core Ideas:**
- Voting and turnout
- Elections
- Political parties
- Interest groups
- Campaign finance
- Media

**If you remember only this:**
1. Voting is important, but it is only one form of political participation.
2. Parties, groups, campaigns, and media connect citizens with political institutions.
3. Rules, resources, information, and incentives can affect whether and how people participate.

**Quick Check:**  
Which statement best describes political participation?

Correct idea: it includes voting as well as other lawful ways people try to influence political outcomes and government.

---

## 7. Data architecture

Do not hard-code five separate large HTML blocks in `course-map.js`.

Prefer a data-driven structure such as:

`content/courseDetails.js`

Each unit should be able to provide fields similar to:

- `unit`
- `title`
- `weight`
- `hook`
- `summary`
- `bigQuestion`
- `visual: { src, alt, caption, credit }`
- `model: { type, nodes[] }`
- `coreIdeas[]`
- `remember[]`
- `quickCheck: { question, options[], answer, why }`
- `fullGuideRoute` (nullable for now)

The Course page renderer should use the same component structure for all five units.

Keep the content layer separate from rendering logic so ChatGPT can revise course material without redesigning the UI.

---

## 8. Visual direction

Preserve the approved Course-page visual language already visible in the current design:

- warm cream background
- deep green
- muted rust/orange accent
- editorial serif headings
- clean sans-serif body text
- restrained borders/shadows
- academic, premium, calm

But improve the right panel so it has more visual energy and meaning.

The result should feel like:
**a compact museum exhibit / interactive study guide**

Not:
- an LMS
- a grid of identical cards
- a textbook outline
- a dashboard full of metrics
- a children's game

Use imagery generously but intelligently.

---

## 9. Accessibility and engineering

- semantic buttons for unit selection and interactive nodes;
- keyboard access to every interaction;
- visible focus state;
- meaningful image alt text;
- source/credit for images;
- no text embedded in images when normal HTML can render it;
- respect reduced-motion preferences;
- no console errors;
- no broken image paths;
- no horizontal overflow at supported widths;
- maintain static GitHub Pages compatibility;
- no framework/build-system introduction.

---

## 10. Review checkpoints — STOP for owner review

Claude should not implement everything in one invisible batch.

### Checkpoint A — layout shell

Implement only:
- fixed viewport Course page;
- left unit selector;
- internally scrollable right detail panel;
- responsive behavior;
- temporary neutral placeholders for detail sections.

Commit:
`course-map: establish fixed viewport interactive shell`

Then show screenshots at desktop width and mobile width and **pause for owner review**.

### Checkpoint B — Unit 1 experience

After Checkpoint A approval:
- implement Unit 1 content;
- add its visual;
- build the reusable interactive concept model;
- implement “If you remember only this” and Quick Check.

Commit:
`course-map: build Unit 1 interactive summary`

Show the full Unit 1 experience and **pause for owner review**.

### Checkpoint C — Units 2–5

After Unit 1 direction is approved:
- populate Units 2–5 using the same reusable structure;
- use unit-appropriate imagery/model content;
- verify consistent behavior.

Commit:
`course-map: add interactive summaries for Units 2 through 5`

Show screenshots/recording of all five unit selections and **pause for owner review**.

### Checkpoint D — polish and verification

After owner approval:
- accessibility pass;
- responsive pass;
- animation/reduced-motion pass;
- smoke tests;
- verify no other page changed visually or functionally.

Commit:
`course-map: polish and verify interactive course guide`

Do **not** merge to `main`. Wait for explicit owner approval.

---

## 11. Acceptance criteria

The phase is ready for owner acceptance only when:

1. `#/course` has no browser/body vertical scrollbar at 1440×900 and 1920×1080.
2. The right detail panel scrolls independently when needed.
3. The five-unit selector is always easy to find.
4. Clicking each unit changes the right panel in place.
5. Each unit has a human-readable hook, summary, big question, visual, interactive model, core ideas, memory summary, and one Quick Check.
6. Unit 1 feels inviting and visual enough for a 14-year-old without feeling childish.
7. Images have alt text and source/credit metadata.
8. No dead “full guide” links are present.
9. No other page has been redesigned or materially changed.
10. No console errors, broken routes, or broken images.
11. The existing site continues to work under GitHub Pages paths.
12. Work remains isolated on `course-page-interactive-study-guide` until explicit owner approval.

---

## 12. Curriculum authority / factual accuracy

Use the current College Board AP U.S. Government and Politics framework as the course authority.

Official framework:
https://apcentral.collegeboard.org/courses/ap-united-states-government-and-politics

Current five-unit multiple-choice weighting:
- Unit 1: 15–22%
- Unit 2: 25–36%
- Unit 3: 13–18%
- Unit 4: 10–15%
- Unit 5: 20–27%

For 2026–27, College Board also notes additional required foundational documents. Full foundational-document/case coverage belongs in the future Unit Detail layer, not this Course-page summary phase.

Political/civic content must remain nonpartisan, factual, and clear about the difference between constitutional structure, historical fact, and interpretation.

---

## 13. Claude handoff instruction

Before coding:

1. Read this specification.
2. Inspect the current `#/course` implementation and relevant Course-page-only files.
3. Confirm the proposed file changes and note any place where the current architecture conflicts with this spec.
4. Do not redesign other pages.
5. Begin with **Checkpoint A only**.
6. Stop after Checkpoint A screenshots and wait for owner review.
