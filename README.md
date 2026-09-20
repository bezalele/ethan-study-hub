# Ethan Study Hub

A lightweight visual study site for Ethan and Dad. The first course is **AP U.S. Government & Politics (2026–27)**.

## Design
- Map first, zoom second
- Visual founding timeline
- Constitution mental model
- Parent quick-learning + student deep-dive structure
- Retrieval practice
- Local progress tracking; no backend

The course map follows the College Board AP U.S. Government & Politics framework. Content is educational and nonpartisan.

## Run it locally

The site uses JavaScript modules, which browsers block over `file://`. **Double-clicking
`index.html` will not work** — start a static server first:

```
cd ethan-study-hub
python -m http.server 8080
```

Then open <http://localhost:8080/>.

## Structure

The site is a zero-build static app. There is nothing to install and nothing to compile;
what is in the repository is what ships.

```
index.html          thin shell: <head> plus three mount points
layout/
  layout.js         renders the header and footer ONCE at boot; owns the nav
  router.js         hash route -> page module
  dom.js            two small DOM helpers
  layout.css        header / footer / shell chrome
styles/
  tokens.css        every colour, size and space value, as custom properties
  base.css          reset plus shared primitives (.btn .card .eyebrow .shell)
pages/
  home.js        home.css
  course-map.js  course-map.css
  study.js       study.css
  practice.js    practice.css
content/
  assets.js         every image the site uses, in one place
  chapters.js       the five founding-story chapters
  course.js         the five AP course areas
  contentData.js    legacy content blob (declaration, constitution, practice)
assets/             images
tests/smoke.cjs     structural invariants
math-quest/         a separate, self-contained sub-app
```

### Rules that keep changes local

These are enforced by `tests/smoke.cjs`, so breaking one fails the build rather than
quietly breaking a page:

1. **The header renders once.** `layout.js` writes it at boot and never again; navigation
   only replaces the children of `<main>`. The header cannot drift between pages.
2. **Page CSS is scoped.** Every selector in `pages/NAME.css` begins with `.page--NAME`.
   Editing the home page cannot affect the course map.
3. **Only `layout.css` styles the chrome.** No page stylesheet may select `header`,
   `footer` or `body`.
4. **No `!important`.** Anywhere.
5. **No inline `onclick`.** Links are real `<a href="#/...">`, so back, forward,
   middle-click and deep links all work.

### Routes

```
#/                    home
#/course              five AP areas
#/course/1 .. /5      one area
#/study               founding-story chapter index
#/study/:chapter      one chapter
#/study/documents     documents and cases
#/study/practice      practice questions
```

An unknown hash falls back to home rather than rendering a blank page.

### Adding a page

1. Create `pages/thing.js` exporting `{ id, nav, title, render(params) }`.
2. Create `pages/thing.css` with every selector under `.page--thing`.
3. Link the stylesheet in `index.html`.
4. Add a route to `ROUTES` in `layout/router.js`.
5. If it needs a nav entry, add one to `NAV` in `layout/layout.js`.
6. Run `node tests/smoke.cjs`.

## Test

```
node tests/smoke.cjs
```

Checks that every file is present, every route resolves, every nav and in-page link points
at a real route, every referenced image exists and is a structurally valid image file, no
two image files are byte-identical, and the five rules above all hold.

## GitHub Pages
Publish from the `main` branch / root in repository Settings → Pages.
