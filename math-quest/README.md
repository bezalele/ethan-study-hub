# Ethan Math Quest — Algebra 1

A responsive, static Algebra 1 companion at `/math-quest/`. Serve the repository with any static HTTP server (for example `python -m http.server 8080`) and open `/math-quest/`.

## Current release — Unit 2 exam preparation

Unit 2 has 11 teaching sections, 44 fully expanded worked examples, and 235 additional practice questions (279 total bank entries). The first six sections match the supplied class assignment: one-step, two-step, distribution, three-step, single-step literal, and multistep literal equations. Each has a concept explanation, method, common mistake, guided question, and independent practice.

The other sections cover variables on both sides, modeling, slope/graphing, systems, and inequalities. A 12-question self-check balances two questions across each of the six exam-focus skills and delays solutions until completion. The original screenshot identifies focus topics, not a verified exhaustive exam syllabus.

Unit 2 uses a restricted symbolic parser for arithmetic rational expressions with single-letter, case-sensitive variables. Equivalent rearrangements are compared algebraically; inputs are never executed. Nonzero-denominator assumptions are shown with literal questions. Exponents and functions are outside this parser’s scope.

Run `node math-quest/tests/unit2-content.cjs` for bank and equivalence checks. `tests/smoke.cjs` covers browser flows.

## Original homepage release

- Approved ivory/sage/teal homepage with sidebar, course map, search, and responsive mobile navigation.
- Nine course destinations, aligned with the MCPS-linked Illustrative Mathematics unit structure plus foundations and review.
- One complete lesson: equations with variables on both sides, with sequential worked example and interactive equality explorer.
- Equation practice in three real difficulty levels: two-step, variables on both sides, and distribution with signed solutions.
- Fourteen original topic exercises, mixed practice, hints, solutions, and review of mistakes or assisted attempts.
- First-attempt progress tracked separately from viewing a lesson. No completion-based mastery claims.
- Parent guidance, JSON progress export/import, and scoped reset.

## Content boundary

Unit 2 is expanded as described above. The other course units retain their outlines and original topic introductions. Full-course expansion beyond Unit 2 remains future work.

## Data and compatibility

New progress uses `ethan_math_quest_v2` in browser localStorage. It does not synchronize between devices. Export/import transfers a backup. The original page is preserved at `classic.html`, along with its assets and original `ethan_math_quest_progress_v1` storage key. Existing original-guide history is not relabeled as independent accuracy.

The original questions retain numeric fractions, optional `x=`, and enumerated equivalent forms. Unit 2 uses the symbolic checker described above; it is limited to the supported expression grammar. Skips and incorrect first attempts count as not independently correct. Days practiced are counted by UTC date, not described as a streak.

## Artwork

`assets/algebra-hero.webp` is generated study-desk artwork created specifically for this page. All interactive text, controls, and course tiles are real HTML; the hero image contains no baked-in interface text.

## Verification

Browser smoke checks are in `tests/smoke.cjs`. With Playwright installed, serve the repo on port 8080 and run `node math-quest/tests/smoke.cjs`. Override `MATH_BASE_URL` for another server and `MATH_BROWSER_EXECUTABLE` for a custom browser.

Checks cover all Unit 2 lesson routes, worked examples, literal-answer equivalence, wrong-answer retries, first-attempt tracking, balanced self-check selection, deferred answers, persistence, and mobile navigation/overflow. Desktop and 390px mobile screenshots were visually inspected during implementation.

Lora and Noto fonts are bundled locally under their included SIL Open Font Licenses.
