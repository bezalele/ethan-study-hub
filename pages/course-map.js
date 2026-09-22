/* ---------------------------------------------------------------------------
   course-map.js — the Course Map: the map of the whole AP course.

   Routes: #/course (defaults to Unit 1) and #/course/:unit

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

import { AREAS, getArea } from '../content/course.js?v=14';
import { getDetail } from '../content/courseDetails.js?v=14';
import { renderTriangle, wireTriangle } from '../components/power-triangle.js?v=14';
import { el, html, esc } from '../layout/dom.js?v=14';

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
  const ideas = d.coreIdeas && d.coreIdeas.length
    ? d.coreIdeas
    : area.topics.map((t) => ({ title: t, note: '' }));

  const items = ideas.map((idea, i) => `
    <li class="cm-idea">
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
  return `
    <div class="cm-recap">
      <section class="cm-sec cm-sec--remember" aria-labelledby="cm-rm">
        <h3 class="cm-sec__label" id="cm-rm">If you remember only this…</h3>
        ${r.length
          ? `<ol class="cm-remember">${r.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`
          : placeholder('One-minute summary', 'Three statements that tie the unit together.')}
      </section>
      ${sectionQuickCheck(d)}
    </div>`;
}

/* A short paged quiz: one question on screen, answered before you can move
   on, scored out of the total. Older content gave a single object rather
   than a list, so both shapes are accepted. */
function sectionQuickCheck(d) {
  const qs = Array.isArray(d.quickCheck) ? d.quickCheck : (d.quickCheck ? [d.quickCheck] : []);
  if (!qs.length) {
    return `
      <section class="cm-sec cm-sec--check" aria-labelledby="cm-qc">
        <h3 class="cm-sec__label" id="cm-qc">Quick check</h3>
        ${placeholder('Quick check', 'Three or more questions drawn from this summary.')}
      </section>`;
  }

  const cards = qs.map((q, n) => {
    const options = q.options.map((o, i) => `
      <li>
        <label class="cm-opt">
          <input type="radio" name="cm-q${n}" value="${i}">
          <span class="cm-opt__marker" aria-hidden="true"></span>
          <span>${esc(o)}</span>
        </label>
      </li>`).join('');
    // Every card is laid into the same grid cell, so the panel is as tall as
    // its tallest question from the first paint and never resizes as you page.
    return `
      <div class="cm-check__card${n ? '' : ' is-on'}" data-q="${n}" data-answer="${q.answer}">
        <p class="cm-check__q">${esc(q.question)}</p>
        <ol class="cm-opts">${options}</ol>
      </div>`;
  }).join('');

  /* The verdicts sit below the buttons, where you are already looking once
     you have clicked, and are stacked the same way. Their space is held
     from the start so revealing one does not move anything. */
  const verdicts = qs.map((q, n) => `
    <div class="cm-check__verdict${n ? '' : ' is-on'}" data-v="${n}" aria-hidden="true">
      <p class="cm-check__result" data-result></p>
      ${q.why ? `<p class="cm-check__why">${esc(q.why)}</p>` : ''}
    </div>`).join('');

  return `
    <section class="cm-sec cm-sec--check" aria-labelledby="cm-qc" data-quiz>
      <div class="cm-check__head">
        <h3 class="cm-sec__label" id="cm-qc">Quick check</h3>
        <p class="cm-check__count" data-count>1 of ${qs.length}</p>
      </div>
      <div class="cm-check__cards">${cards}</div>
      <div class="cm-check__nav">
        <button class="cm-check__step" type="button" data-prev disabled>← Back</button>
        <button class="btn btn--primary" type="button" data-check>Check answer</button>
        <button class="cm-check__step" type="button" data-next>Next →</button>
      </div>
      <div class="cm-check__verdicts">
        <p class="cm-check__hint" data-hint>Pick an option, then check it.</p>
        ${verdicts}
      </div>
      <p class="cm-check__score" data-score>Answer all ${qs.length} to see your score.</p>
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
  const d = getDetail(area.n);
  return `
    <article class="cm-panel">
      <div class="cm-panel__scroll" data-panel tabindex="-1">
        ${sectionUnitHeader(area, d)}
        ${sectionBigQuestion(d)}
        ${sectionModel(d)}
        ${sectionCoreIdeas(area, d)}
        ${sectionRecap(d)}
        ${sectionFullGuide(area, d)}
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

function wireQuickCheck(root) {
  const box = root.querySelector('[data-quiz]');
  if (!box) return;

  const cards = [...box.querySelectorAll('[data-q]')];
  const verdicts = [...box.querySelectorAll('[data-v]')];
  const count = box.querySelector('[data-count]');
  const score = box.querySelector('[data-score]');
  const prev = box.querySelector('[data-prev]');
  const next = box.querySelector('[data-next]');
  const check = box.querySelector('[data-check]');
  const hint = box.querySelector('[data-hint]');
  // One entry per question: true, false, or undefined while unanswered. A
  // question is scored on its first answer, so a second guess cannot lift
  // the total.
  const marks = new Array(cards.length);
  let at = 0;

  function show(i) {
    at = Math.max(0, Math.min(cards.length - 1, i));
    cards.forEach((c, n) => c.classList.toggle('is-on', n === at));
    verdicts.forEach((v, n) => v.classList.toggle('is-on', n === at));
    hint.classList.toggle('is-off', verdicts[at].classList.contains('is-shown'));
    count.textContent = `${at + 1} of ${cards.length}`;
    prev.disabled = at === 0;
    next.disabled = at === cards.length - 1;
    check.disabled = marks[at] !== undefined;
    check.textContent = marks[at] === undefined ? 'Check answer' : 'Answered';
  }

  function report() {
    const done = marks.filter((m) => m !== undefined).length;
    if (done < cards.length) return;
    const right = marks.filter(Boolean).length;
    score.classList.add('is-done');
    score.textContent = `You scored ${right} out of ${cards.length}.`;
  }

  function reveal() {
    verdicts[at].classList.add('is-shown');
    verdicts[at].setAttribute('aria-hidden', 'false');
    hint.classList.add('is-off');
  }

  check.addEventListener('click', () => {
    const card = cards[at];
    const result = verdicts[at].querySelector('[data-result]');
    const picked = card.querySelector('input:checked');
    if (!picked) {
      result.className = 'cm-check__result';
      result.textContent = 'Choose an answer first.';
      reveal();
      return;
    }
    const right = Number(picked.value) === Number(card.dataset.answer);
    marks[at] = right;
    result.className = `cm-check__result ${right ? 'is-right' : 'is-wrong'}`;
    result.textContent = right ? 'Correct.' : 'Not quite.';
    picked.closest('.cm-opt').classList.add(right ? 'is-right' : 'is-wrong');
    card.querySelectorAll('input').forEach((i) => { i.disabled = true; });
    reveal();
    check.disabled = true;
    check.textContent = 'Answered';
    report();
  });

  prev.addEventListener('click', () => show(at - 1));
  next.addEventListener('click', () => show(at + 1));
  show(0);
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
    const d0 = getDetail(area.n);
    const page = el('div', 'page page--course-map');
    page.append(html(`
      <div class="cm-shell">
        ${header()}
        <div class="cm-explorer shell">
          ${rail(area.n)}
          ${panel(area)}
        </div>
      </div>`));
    wireWalk(page);
    if (d0.model && d0.model.type === 'triangle') wireTriangle(page, d0.model, esc);
    wireQuickCheck(page);
    return page;
  },
};
