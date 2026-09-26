/* ---------------------------------------------------------------------------
   course-map.js — the Course Map: the map of the whole AP course.

   Routes: #/course (defaults to Unit 1), #/course/:unit, and
   #/course/:unit/:topic, which opens the unit at one of its core ideas -
   that is what the daily note's lesson links point at.

   Layout, per docs/COURSE_PAGE_IMPLEMENTATION_SPEC.md section 3: the page
   itself never scrolls on desktop. The unit selector stays put and the right
   detail panel is the single scrolling region.

   The panel is assembled from one component structure for all five units.
   Content comes from content/courseDetails.js; the unit number, title and
   exam weighting come from content/course.js, which stays the single source
   for them. A section whose content is missing renders a neutral labelled
   placeholder rather than disappearing, so the shell can be reviewed before
   the content lands.
   --------------------------------------------------------------------------- */

import { AREAS, getArea, topicSlug } from '../content/course.js?v=21';
import { getDetail, unitIdeas } from '../content/courseDetails.js?v=21';
import { renderTriangle, wireTriangle } from '../components/power-triangle.js?v=21';
import { renderLesson, wireLesson, quiz, wireQuiz } from '../components/lesson.js?v=21';
import { lessonsFor, getLesson } from '../content/lessons.js?v=21';
import { el, html, esc } from '../layout/dom.js?v=21';

/* --- Shared pieces -------------------------------------------------------- */

/** Stands in for a section that has no content yet. */
function placeholder(label, note) {
  return `
    <div class="cm-todo">
      <span class="cm-todo__label">${esc(label)}</span>
      <span class="cm-todo__note">${esc(note)}</span>
    </div>`;
}

function header() {
  return `
    <header class="cm-head">
      <div class="cm-head__inner shell">
        <div>
          <p class="eyebrow eyebrow--on-dark">AP U.S. Government &amp; Politics · Course map</p>
          <h1 class="cm-head__title">Five areas. One connected course.</h1>
        </div>
        <p class="cm-head__note">
          Pick a unit to see what it is really about, then open its study guide.
        </p>
      </div>
    </header>`;
}

/* --- Unit selector -------------------------------------------------------- */

function rail(selected) {
  const items = AREAS.map((a) => `
    <li>
      <a class="cm-unit" href="#/course/${a.n}"
         ${a.n === selected ? 'aria-current="page"' : ''}>
        <span class="cm-unit__n">0${a.n}</span>
        <span class="cm-unit__text">
          <span class="cm-unit__meta">Unit ${a.n} · ${esc(a.weight)}</span>
          <span class="cm-unit__name">${esc(a.title)}</span>
          <span class="cm-unit__count">${a.topics.length} topics</span>
        </span>
        <span class="cm-unit__chev" aria-hidden="true">›</span>
      </a>
    </li>`).join('');

  return `
    <nav class="cm-rail" aria-label="Course units">
      <p class="cm-rail__head">The course · five units</p>
      <ol class="cm-rail__list">${items}</ol>
      <p class="cm-rail__foot">Exam weights are College Board multiple-choice weightings.</p>
    </nav>`;
}

/* --- Detail panel sections ------------------------------------------------ */

function sectionUnitHeader(area, d) {
  return `
    <header class="cm-unit-head">
      <p class="cm-unit-head__kicker">Unit 0${area.n} · ${esc(area.weight)} of the exam</p>
      <h2 class="cm-unit-head__title">${esc(area.title)}</h2>
      ${d.hook
        ? `<p class="cm-unit-head__hook">${esc(d.hook)}</p>`
        : placeholder('Hook', 'One line: the human question this unit answers.')}
      ${d.summary
        ? `<p class="cm-unit-head__summary">${esc(d.summary)}</p>`
        : placeholder('Plain-English summary', 'Two or three sentences.')}
    </header>`;
}

function sectionBigQuestion(d) {
  return `
    <section class="cm-sec cm-sec--question" aria-labelledby="cm-bq">
      <h3 class="cm-sec__label" id="cm-bq">The big question</h3>
      ${d.bigQuestion
        ? `<p class="cm-question">${esc(d.bigQuestion)}</p>`
        : placeholder('Big question', 'One sentence the whole unit is trying to answer.')}
    </section>`;
}

/* The visual story and the concept model are one component: a sequence the
   student clicks through. Four tiny decorative thumbnails would not teach the
   progression; a stage that changes with the step does. */
function sectionModel(d) {
  const m = d.model;
  if (m && m.type === 'triangle') return renderTriangle(m, esc);
  return sectionDocumentWalk(d);
}

function sectionDocumentWalk(d) {
  const m = d.model;
  if (!m || !m.nodes || !m.nodes.length) {
    return `
      <section class="cm-sec" aria-labelledby="cm-md">
        <h3 class="cm-sec__label" id="cm-md">The story in four documents</h3>
        ${placeholder('Visual story and concept model',
          'A sequence the student clicks through. Built per unit.')}
      </section>`;
  }

  const steps = m.nodes.map((n, i) => `
    <li class="cm-step">
      <button class="cm-step__btn" type="button" data-node="${i}"
              aria-pressed="${i === 0}" aria-controls="cm-stage">
        <img class="cm-step__thumb" src="${esc(n.thumb || n.image)}" alt="" loading="lazy">
        <span class="cm-step__year">${esc(n.step)}</span>
        <span class="cm-step__label">${esc(n.label)}</span>
      </button>
    </li>`).join('<li class="cm-step__link" aria-hidden="true"></li>');

  const stages = m.nodes.map((n, i) => `
    <figure class="cm-stage" data-stage="${i}" ${i ? 'hidden' : ''}>
      <img src="${esc(n.image)}" alt="${esc(n.alt || '')}" loading="${i ? 'lazy' : 'eager'}">
      <figcaption>
        <p class="cm-stage__did">${esc(n.did)}</p>
        ${n.next
          ? `<p class="cm-stage__next"><span>Why the next step followed</span>${esc(n.next)}</p>`
          : '<p class="cm-stage__next cm-stage__next--end"><span>End of the sequence</span>This is the framework still in use today.</p>'}
        <small class="cm-stage__credit">${esc(n.credit || '')}</small>
      </figcaption>
    </figure>`).join('');

  return `
    <section class="cm-sec cm-walk" aria-labelledby="cm-md" data-walk>
      <h3 class="cm-sec__label" id="cm-md">The story in four documents</h3>
      ${m.intro ? `<p class="cm-walk__intro">${esc(m.intro)}</p>` : ''}
      <ol class="cm-steps">${steps}</ol>
      <div class="cm-stages" id="cm-stage" aria-live="polite">${stages}</div>
    </section>`;
}

function sectionCoreIdeas(area, d) {
  /* unitIdeas is the shared answer; the notes beside them are this page's. */
  const ideas = d.coreIdeas && d.coreIdeas.length
    ? d.coreIdeas
    : unitIdeas(area).map((t) => ({ title: t, note: '' }));

  /* The id is the same slug the daily note links to, so a note that says
     "we did checks and balances" lands on that line rather than at the top
     of the unit. */
  const items = ideas.map((idea, i) => `
    <li class="cm-idea" id="idea-${esc(topicSlug(idea.title))}">
      <span class="cm-idea__n">${String(i + 1).padStart(2, '0')}</span>
      <span class="cm-idea__text">
        <strong>${esc(idea.title)}</strong>
        ${idea.note ? `<span>${esc(idea.note)}</span>` : ''}
      </span>
    </li>`).join('');

  return `
    <section class="cm-sec" aria-labelledby="cm-ci">
      <h3 class="cm-sec__label" id="cm-ci">Core ideas</h3>
      <ol class="cm-ideas">${items}</ol>
    </section>`;
}

/* The one-minute summary and the quiz are one band: read the three
   statements, then answer on the same screen without scrolling between
   them. */
function sectionRecap(d) {
  const r = d.remember || [];
  const qs = Array.isArray(d.quickCheck) ? d.quickCheck : (d.quickCheck ? [d.quickCheck] : []);
  return `
    ${r.length ? `
      <section class="cm-sec cm-sec--remember" aria-labelledby="cm-rm">
        <h3 class="cm-sec__label" id="cm-rm">If you remember only this…</h3>
        <ol class="cm-remember">${r.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
      </section>` : ''}
    ${qs.length ? quiz(qs, { name: 'cm', label: 'Quick check', unit: d.unitN }) : ''}`;
}

/* --- What this unit covers ------------------------------------------------ */

/* A card is a door, not a summary: a picture, a title, one line. The AP
   number is a small tag for the parent checking coverage and is not part of
   what the student reads.

   A lesson that is not written yet is marked on the picture and is not a
   link, which is the rule the full-guide slot below it already followed. */
function sectionLessons(area) {
  const lessons = lessonsFor(area.n);
  if (!lessons.length) return '';

  const cards = lessons.map((l) => {
    const inner = `
      <span class="cm-lesson__art">
        <img src="${esc(l.image)}" alt="${esc(l.alt)}" loading="lazy">
        ${l.ready ? '' : '<span class="cm-lesson__soon">Soon</span>'}
      </span>
      <span class="cm-lesson__text">
        <strong class="cm-lesson__title">${esc(l.title)}</strong>
        <span class="cm-lesson__blurb">${esc(l.blurb)}</span>
      </span>
      <span class="cm-lesson__ap">${esc(l.ap)}</span>`;

    return l.ready
      ? `<li><a class="cm-lesson" href="#/course/${area.n}/${esc(l.slug)}">${inner}</a></li>`
      : `<li><div class="cm-lesson cm-lesson--soon" aria-disabled="true">${inner}</div></li>`;
  }).join('');

  return `
    <section class="cm-sec cm-sec--lessons" aria-labelledby="cm-ls">
      <h3 class="cm-sec__label" id="cm-ls">What Unit ${area.n} covers</h3>
      <ol class="cm-lessons">${cards}</ol>
    </section>`;
}

/* Reserved slot for the future Unit Detail route. Never a dead link: without
   a route it renders as plain text, per spec section 5H. */
function sectionFullGuide(area, d) {
  return `
    <footer class="cm-go">
      <p class="cm-go__lens"><strong>Study lens.</strong> ${esc(area.lens)}</p>
      ${d.fullGuideRoute
        ? `<a class="btn btn--primary" href="${esc(d.fullGuideRoute)}">Open the full Unit ${area.n} guide →</a>`
        : `<p class="cm-go__soon">Full Unit ${area.n} guide — next phase</p>`}
    </footer>`;
}

function panel(area) {
  const d = { ...getDetail(area.n), unitN: area.n };
  return `
    <article class="cm-panel">
      <div class="cm-panel__scroll" data-panel tabindex="-1">
        ${sectionUnitHeader(area, d)}
        ${sectionBigQuestion(d)}
        ${sectionModel(d)}
        ${sectionCoreIdeas(area, d)}
        ${sectionLessons(area)}
        ${sectionRecap(d)}
        ${sectionFullGuide(area, d)}
      </div>
    </article>`;
}

/* The same panel shell, holding a lesson. Keeping the shell means the rail,
   the header and the single scrolling region all behave exactly as they do
   on the unit view - a lesson is a different thing to read, not a different
   page to learn. */
function lessonPanel(area, lesson) {
  return `
    <article class="cm-panel cm-panel--lesson">
      <div class="cm-panel__scroll" data-panel tabindex="-1">
        ${renderLesson(lesson, area)}
      </div>
    </article>`;
}

/* --- Behaviour ------------------------------------------------------------ */

function wireWalk(root) {
  const box = root.querySelector('[data-walk]');
  if (!box) return;
  const buttons = [...box.querySelectorAll('[data-node]')];
  const stages = [...box.querySelectorAll('[data-stage]')];

  function show(i) {
    buttons.forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    stages.forEach((st, n) => { st.hidden = n !== i; });
  }

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-node]');
    if (btn) show(buttons.indexOf(btn));
  });
}

/* Arriving from a daily note: mark the idea it named and bring it into view.
   The page is not in the document yet when render returns, so this waits for
   the frame after it is - and the panel is the scrolling region, not the
   window, so the line is scrolled inside that. */
function focusTopic(page, slug) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const li = page.querySelector('#idea-' + CSS.escape(slug));
    if (!li) return;
    li.classList.add('is-named');
    li.scrollIntoView({ block: 'center' });
  }));
}

/* --- Module --------------------------------------------------------------- */

export default {
  id: 'course-map',
  nav: 'course',
  title: (params) => {
    const area = getArea(params.unit);
    return area ? `${area.short} · Course Map` : 'Course Map';
  },
  render(params) {
    // Unknown or missing unit falls back to the first unit rather than blank.
    const area = getArea(params.unit) || AREAS[0];
    /* A topic segment is either the name of a lesson or, as it has always
       been, the name of a core idea to scroll to. Lessons are checked first;
       anything else falls through to the behaviour daily-note links rely on. */
    const lesson = params.topic ? getLesson(area.n, params.topic) : null;
    const d0 = getDetail(area.n);
    const page = el('div', 'page page--course-map');
    page.append(html(`
      <div class="cm-shell">
        ${header()}
        <div class="cm-explorer shell">
          ${rail(area.n)}
          ${lesson ? lessonPanel(area, lesson) : panel(area)}
        </div>
      </div>`));

    if (lesson) {
      wireLesson(page, lesson);
      wireQuiz(page);
      return page;
    }

    wireWalk(page);
    if (d0.model && d0.model.type === 'triangle') wireTriangle(page, d0.model, esc);
    wireQuiz(page);
    if (params.topic) focusTopic(page, params.topic);
    return page;
  },
};
