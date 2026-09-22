# Ethan Study Hub

A lightweight visual study site for Ethan and Dad. The first course is **AP U.S. Government & Politics (2026–27)**.

> **Running or changing this site?** Read [docs/OPERATIONS.md](docs/OPERATIONS.md)
> first — hosting, deploys, tests, where the journal data actually lives, the
> Cloudflare sync setup, and the known issues. **Writing content for Ethan?**
> Read [docs/BUILD-GUIDE.md](docs/BUILD-GUIDE.md).

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
components/
  timeline.js/.css  the five-chapter strip, shared by home and chapters
styles/
  tokens.css        every colour, size and space value, as custom properties
  base.css          reset plus shared primitives (.btn .card .eyebrow .shell)
pages/
  home.js        home.css
  course-map.js  course-map.css
  study.js       study.css        chapter index + documents shelf
  chapter.js     chapter.css      the standard template for all 5 chapters
  practice.js    practice.css
content/
  assets.js         every image the site uses, in one place
  chapters.js       the five founding-story chapters — ALL chapter content
  course.js         the five AP course areas
  contentData.js    legacy content blob (practice questions)
assets/             images
docs/CONTENT-GUIDE.md  field-by-field brief for filling in chapter content
tests/smoke.cjs        structural invariants (source)
tests/layout-check.cjs rendered checks in a real browser
tests/quiz-check.cjs   drives the chapter quizzes and checks scoring
math-quest/         a separate, self-contained sub-app
```

### Rules that keep changes local

These are enforced by `tests/smoke.cjs`, so breaking one fails the build rather than
quietly breaking a page:

1. **The header renders once.** `layout.js` writes it at boot and never again; navigation
   only replaces the children of `<main>`. The header cannot drift between pages.
2. **Page CSS is scoped.** Every selector in `pages/NAME.css` begins with `.page--NAME`,
   and every selector in `components/NAME.css` begins with `.c-NAME`. Editing the home
   page cannot affect the course map.
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
#/study/:chapter      one chapter, via the standard chapter template
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
node tests/smoke.cjs          # source checks, no browser needed
node tests/layout-check.cjs   # rendered checks; needs Chrome + the server running
node tests/quiz-check.cjs     # drives each chapter quiz and checks the scoring
```

`smoke.cjs` checks that every file is present, every route resolves, every nav and in-page
link points at a real route, every referenced image exists and is a structurally valid
image file, no two image files are byte-identical, and the five rules above all hold.

`layout-check.cjs` drives a real Chrome over the DevTools protocol and checks the rendered
result at six viewport sizes: that every route actually paints content, that no element
overflows horizontally, that no image is broken, that no text renders below 12px, that the
home page and course map fit one screen, and that a chapter page's slideshow thumbnails are
visible on landing. Start the server first.

`quiz-check.cjs` answers every question on all five chapters correctly and then incorrectly,
and checks the page reports 5/5 and 0/5.

## Writing chapter content

All five chapter pages share one template, `pages/chapter.js`, driven entirely by
`content/chapters.js`. Every block is optional — a chapter with no `fact` simply has no
Interesting Fact card — so content can be filled in a field at a time without the page
ever looking half-finished.

See **[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)** for the field-by-field brief,
target lengths, and the list of image slots with recommended dimensions. That file is
written to be handed straight to an assistant along with `content/chapters.js`.

Image slots with no file render a designed placeholder showing their label, so the layout
is final before the art arrives.

## GitHub Pages
Publish from the `main` branch / root in repository Settings → Pages.
