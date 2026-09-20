# Ethan Study Hub — Structural Rebuild

Date: 2026-09-20
Branch: `rebuild/structure`
Status: approved, in implementation

## Problem

The site works but cannot be maintained. Four structural defects, measured on `main` at `0d1cff0`:

1. **No layout/master page.** All 9 "pages" are `<section class="page">` inside one 156-line `index.html`, toggled by `show()`. There is no single place that owns the header.
2. **Cascade war.** `style.css` (1325 ln) -> `home-override.css` (675 ln, 353 `!important`) -> `home-assets.css` (320 ln, 83 `!important`). 441 `!important` total. Nothing is scoped, so any edit can reach any page.
3. **56% dead CSS.** 195 of 347 classes are referenced by no HTML and no JS — residue of at least four abandoned design generations (`.approved-home-*`, `.roadmap-*`, `.study-home`, `.learn-page`, `.course-path`).
4. **Header mutates per page.** `home-override.css:28-46` restyles the header via `body:has(#home.active)` — different font size, letter-spacing, nav gap and padding on Home than elsewhere.

Live bugs carried alongside:

- `app.js:199` sets `body.no-scroll` on the Course Map, clipping the panel and overlapping its own heading.
- `home-override.css:672` references `assets/home/10-book-logo.png`, which does not exist (404).
- Nav exposes 4 of 9 destinations; 5 are reachable only through inline `onclick`.
- `content/contentData.js:54` carries a stale `'Wikimedia Commons'` credit string.

Not a problem, contrary to initial suspicion: **there are zero external image URLs.** Every image resolves to `assets/`. Only documentation citations in `content/SOURCES.md` point off-site.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Build | Zero-build static site | Deploys by pushing to `main`; no toolchain for the user to maintain |
| Layout | Single shell + per-page JS modules | One owner for the header, so it cannot drift between pages |
| Nav | `Home \| Course Map \| Study` | User's call; three destinations |
| Routing | Hash router | Works on GitHub Pages without server rewrites |
| Scope | Structure + Home + Course Map | Other pages ported faithfully, redesigned in a later pass |

## Architecture

```
index.html                 thin shell: <head> + #app-header, #app-main, #app-footer
/layout
  layout.js                renders header + footer ONCE at boot; owns the NAV array
  router.js                hash route -> page module
  layout.css               header/footer/shell only
/styles
  tokens.css               color/type/space/radius as CSS custom properties
  base.css                 reset + shared primitives (.btn .card .eyebrow .prose)
/pages
  home.js        home.css
  course-map.js  course-map.css
  study.js       study.css
  practice.js    practice.css
/content
  contentData.js           data only, zero markup (kept)
/assets                    unchanged
```

Deleted: `style.css`, `home-override.css`, `home-assets.css`. Their live rules fold into the
owning page file; the 195 dead classes are dropped. `math-quest/` is a self-contained sub-app
and is not touched.

## Invariants

These are what make small changes safe. They are enforced by `tests/smoke.cjs`, not by discipline.

1. **The header renders once.** `layout.js` writes the header and footer at boot and never again.
   Navigation replaces only the children of `<main>`. The header cannot differ between pages
   because it is never re-rendered.
2. **Page CSS is scoped.** Each page module renders into `<div class="page page--NAME">`, and
   every selector in `NAME.css` begins with `.page--NAME`. A home edit cannot reach the course map.
3. **No page stylesheet may match `header`, `footer`, or `body`.** Those belong to `layout.css`.
4. **Zero `!important` in the codebase.** Currently 441.
5. **No inline `onclick`.** Navigation uses `<a href="#/...">`, so back/forward, middle-click and
   deep links work.

## Routes

```
#/                    home
#/course              5 AP areas
#/course/1 .. /5      unit study page
#/study               chapter index
#/study/:chapter      one of 5 founding chapters
#/study/documents     Declaration + Constitution explorers, cases
#/study/practice      quiz
```

All 9 existing sections get a real route. Unknown hash falls back to Home rather than rendering blank.

Nav active state is `aria-current="page"` on exactly one `<a>`. Nothing else changes.

## Fixes included

- Remove the `body.no-scroll` toggle (Course Map clipping).
- Replace the missing `10-book-logo.png` with an inline SVG book mark, which cannot 404.
- Replace the stale `'Wikimedia Commons'` credit string with an accurate local credit.
- Move the floating "Upload Images" customizer behind a `?edit=1` query flag: available when
  wanted, invisible to Ethan.

## Visual system

`tokens.css` centralizes the palette already present across the approved mockups:
forest `#123f35`, parchment `#f6f1e7` / `#fffaf2`, brick `#a64b33`, gold `#efc27c`;
Georgia display serif with a sans for eyebrows and labels.

Home and Course Map are rebuilt against the approved mockups — full-bleed warm imagery,
generous whitespace, serif display type. Study, Documents and Practice are ported to the new
shell and made to work correctly, but are not redesigned in this pass.

## Verification

`tests/smoke.cjs`, following the pattern already used in `math-quest/tests/`:

- every route renders non-empty content
- every nav link resolves to a real route
- every asset path referenced in CSS or JS exists on disk
- zero `!important` across the stylesheets
- no page stylesheet matches `header`, `footer` or `body`
- no inline `onclick` remains

## Local preview and publishing

GitHub Pages serves from `main`, so publishing means pushing to `main`. All work happens on
`rebuild/structure`; `main` is frozen until explicitly approved.

```
cd C:\Users\bezuw\ethan-study-hub
python -m http.server 8080      # -> http://localhost:8080/
```

JS modules are blocked over `file://`, so the server is required. This is a deliberate trade:
double-clicking `index.html` no longer works. Documented in the README.

## Out of scope

- Redesign of Study, Documents and Practice beyond correct behaviour in the new shell
- Any change to `math-quest/`
- Content rewrites; `contentData.js` is carried over as data
