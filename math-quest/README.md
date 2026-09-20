# Ethan Math Quest — Algebra 1

A responsive, static Algebra 1 companion at `/math-quest/`. Serve the repository with any static HTTP server (for example `python -m http.server 8080`) and open `/math-quest/`.

## First release

- Approved ivory/sage/teal homepage with sidebar, course map, search, and responsive mobile navigation.
- Nine course destinations, aligned with the MCPS-linked Illustrative Mathematics unit structure plus foundations and review.
- One complete lesson: equations with variables on both sides, with sequential worked example and interactive equality explorer.
- Equation practice in three real difficulty levels: two-step, variables on both sides, and distribution with signed solutions.
- Fourteen original topic exercises, mixed practice, hints, solutions, and review of mistakes or assisted attempts.
- First-attempt progress tracked separately from viewing a lesson. No completion-based mastery claims.
- Parent guidance, JSON progress export/import, and scoped reset.

## Content boundary

This is the approved homepage and complete sample-lesson checkpoint, not the finished whole-course content expansion. Other units show their planned skill outlines and available original introductions. Detailed lessons and the proposed 600 reviewed questions remain future work. No locked links pretend those lessons exist.

## Data and compatibility

New progress uses `ethan_math_quest_v2` in browser localStorage. It does not synchronize between devices. Export/import transfers a backup. The original page is preserved at `classic.html`, along with its assets and original `ethan_math_quest_progress_v1` storage key. Existing original-guide history is not relabeled as independent accuracy.

Answer checking supports numeric fractions, optional `x=`, and enumerated equivalent forms for the original questions. It is not a general symbolic algebra engine. Skips and incorrect first attempts count as not independently correct. Days practiced are counted by UTC date, not described as a streak.

## Artwork

`assets/algebra-hero.webp` is generated study-desk artwork created specifically for this page. All interactive text, controls, and course tiles are real HTML; the hero image contains no baked-in interface text.

## Verification

Browser smoke checks are in `tests/smoke.cjs`. With Playwright installed, serve the repo on port 8080 and run `node math-quest/tests/smoke.cjs`. Override `MATH_BASE_URL` for another server and `MATH_BROWSER_EXECUTABLE` for a custom browser.

Checks cover 3,000 generated equation solutions, accepted numeric answer forms, wrong-answer retries, first-attempt tracking, lesson controls, persistence after reload, search, and mobile navigation/overflow. Desktop and 390px mobile screenshots were visually inspected during implementation.

Lora and Noto fonts are bundled locally under their included SIL Open Font Licenses.
