# Claude UI / Implementation Handoff

## Role
ChatGPT is the lead engineer and content lead for Ethan Study Hub. Claude is the UI/implementation engineer.

Your job is to turn the content and learning architecture in this repository into an exceptionally polished, clear, interactive experience. Use judgment. Do not wait for detailed pixel-by-pixel instructions.

## Product goal
This should not feel like an online AP syllabus, LMS, or another textbook Ethan has to finish.

It should feel like an interactive history documentary / museum / discovery experience for an intelligent 14-year-old who is curious about how American government came to exist and how it works.

The AP U.S. Government curriculum is the hidden coverage framework underneath the experience, not the primary navigation language.

Desired feeling:
- cinematic but restrained
- highly visual
- historical
- curious and exploratory
- clear enough to understand at a glance
- sophisticated enough not to feel childish
- excellent typography and spacing
- responsive on desktop and mobile
- interactions should invite discovery, not create clutter

## Primary experience
Lead with a natural narrative:
1. Why do people need government?
2. What can go wrong when government has too much power? Too little?
3. Colonial America and British rule
4. Conflict and independence
5. Declaration of Independence — what was it actually saying?
6. A new country now needs a government
7. Articles of Confederation — the first attempt
8. Why the first system struggled
9. Constitutional Convention — redesigning the system
10. Ratification debate
11. Constitution — zoomable map
12. Bill of Rights and the continuing American constitutional story
13. From that foundation, branch naturally into Congress, presidency, courts, federalism, civil liberties/civil rights, beliefs, elections and participation.

Do not force all of this onto one page. Create an elegant journey with progressive disclosure.

## Interaction model: map → story → zoom
Use three levels:
- DISCOVER: beautiful high-level story, pictures, timeline, transitions, compelling questions.
- UNDERSTAND: concise explanation, visual mental model, important vocabulary and connections.
- EXPLORE DEEPER: document text, historical context, required AP material, cases, detailed explanations, optional media.

A student should never encounter a wall of text by default.

## Visual storytelling
Use large visual moments and image-led sections. Support:
- image galleries / slideshows where they genuinely help
- horizontal or vertical historical timelines
- document close-ups
- maps/diagrams
- interactive cards
- subtle motion/transitions
- clear next/previous story progression
- expandable details
- strong captions and source attribution

Prefer authentic public-domain/official historical imagery. Keep source metadata with assets/content. If remote images are unreliable, design graceful fallbacks.

## Constitution explorer
The Constitution needs a first-class interactive explorer.

Top level:
- Preamble — purpose
- Article I — Legislative
- Article II — Executive
- Article III — Judicial
- Article IV — States
- Article V — Amendment process
- Article VI — Federal law / obligations
- Article VII — Ratification
- Amendments
  - Bill of Rights (1–10)
  - Later amendments (11–27)

At first glance show only this architecture. Clicking/zooming should progressively reveal sections, plain-English explanation, historical context, relationships to other parts, and eventually source text. Preserve the ability to return to the high-level map easily.

## School/AP layer
Keep AP alignment available but quiet. Do not lead pages with strings like "UNIT 02 · 25–36% OF MCQ" unless the user deliberately enters a School/AP view.

Provide a compact School/AP view or overlay where later we can show:
- official AP unit/topic mapping
- school-current topic
- covered / understood / needs review
- required foundational documents
- required Supreme Court cases
- AP skills/practice

The discovery experience and AP tracking experience should share content; do not create duplicate lesson systems.

## Progress
Keep progress lightweight and local for now (localStorage is fine).
Prefer meaningful states:
- Not explored
- Explored
- I understand this
- Review later

Do not pretend that opening a page means mastery.

## Content architecture
Refactor substantive content out of app.js/index.html into a clean data/content layer so ChatGPT can add and revise content without colliding with UI work.

Choose the simplest durable structure appropriate for this static site (JSON/JS modules/data files are fine). Do NOT introduce a framework/build system unless there is a compelling concrete need.

Content should be able to carry:
- id / title / subtitle
- narrative blocks
- date/era
- image(s) with caption, alt text, credit/source
- key ideas
- vocabulary
- connections
- optional deep dive
- AP mapping
- source references
- knowledge-check questions

Do not invent substantive political/history content merely to fill UI placeholders. Clearly mark content placeholders for ChatGPT instead.

## Engineering constraints
- Static GitHub Pages site.
- Keep dependencies minimal.
- Accessibility matters: keyboard navigation, semantic HTML, alt text, readable contrast, reduced-motion consideration.
- Fast loading.
- No backend/authentication for this phase.
- Preserve working GitHub Pages deployment.
- Avoid giant monolithic app.js as the content grows.
- Keep the design system coherent rather than adding unrelated visual tricks.

## Content authority
Do not materially rewrite factual/history/AP content without a clear reason. ChatGPT owns curriculum/content. Claude owns presentation and implementation. If content is missing, create a visually complete placeholder/component and leave a clear TODO/content slot rather than hallucinating material.

## Current priority
Transform the existing prototype away from "course outline cards" and toward the discovery model above. Build the reusable UI/content architecture first, then polish the initial Founding Journey and Constitution Explorer so they can become the demonstration Ethan sees.

## Landing page requirements
This is a single-page AP U.S. Government study hub designed for Ethan and Dad. The landing screen should feel calm, academic, and premium without feeling heavy or cluttered.

### Design direction
- Background: warm cream paper tone
- Primary accent: deep green header and dark-olive content blocks
- Secondary accent: warm rust/orange for emphasis and typography highlights
- Typography: serif headline, clean sans body text
- Layout: concentrated hero card, then a tight two-column unit grid
- Goal: one-screen desktop presentation with no vertical scrollbar and no overwhelming content density

### Layout requirements
1. Fixed dark-green header with compact nav labels.
2. Centered hero card with serif headline and warm accent emphasis.
3. Stat pills beneath the hero.
4. Tight course overview section with one highlighted top unit card and four secondary cards beneath it.
5. Keep the landing screen on a single viewport at standard desktop size.
6. Preserve static-site functionality: no backend, local progress via browser storage, all sections still navigate correctly.

### Engineering notes
- Prefer CSS-driven layout over JavaScript manipulation for the landing page.
- Maintain semantic HTML and accessible contrast.
- Keep the page responsive, but prioritize desktop single-screen composition.
- Preserve the existing story, Constitution, and practice sections as the product’s deeper learning screens.

### Acceptance criteria
- No vertical scrollbar on a typical desktop viewport.
- The landing page visually matches the provided reference with a clean, editorial presentation.
- Cards and spacing remain balanced with the dark-green header and cream page background.
- Navigation and interactive behaviors continue to work without regressions.

## Before handing back
- Test all navigation/interactions.
- Check desktop and mobile.
- Ensure no console errors.
- Ensure GitHub Pages paths work under /ethan-study-hub/.
- Keep a short CHANGELOG/HANDOFF note describing what changed and where ChatGPT should add content next.
- Commit the work to the repository. The parent will decide when to publish/deploy if the workflow separates implementation from publication.
