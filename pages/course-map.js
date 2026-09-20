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

import { AREAS, getArea } from '../content/course.js';
import { getDetail } from '../content/courseDetails.js';
import { el, html, esc } from '../layout/dom.js';

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

function sectionVisual(d) {
  const v = d.visual;
  return `
    <section class="cm-sec" aria-labelledby="cm-vs">
      <h3 class="cm-sec__label" id="cm-vs">Visual story</h3>
      ${v && v.src
        ? `<figure class="cm-visual">
             <img src="${esc(v.src)}" alt="${esc(v.alt || '')}" loading="lazy">
             <figcaption>
               <span>${esc(v.caption || '')}</span>
               ${v.credit ? `<small>${esc(v.credit)}</small>` : ''}
             </figcaption>
           </figure>`
        : `<div class="cm-visual cm-visual--empty">
             ${placeholder('Visual story', 'One strong image for this unit, from assets/course-map/.')}
           </div>`}
    </section>`;
}

function sectionModel(d) {
  const m = d.model;
  if (!m || !m.nodes || !m.nodes.length) {
    return `
      <section class="cm-sec" aria-labelledby="cm-md">
        <h3 class="cm-sec__label" id="cm-md">How it fits together</h3>
        ${placeholder('Interactive concept model',
          'Click a step to see what it does. Built in the next checkpoint.')}
      </section>`;
  }

  const nodes = m.nodes.map((n, i) => `
    <li>
      <button class="cm-node" type="button" data-node="${i}"
              aria-expanded="${i === 0}" aria-controls="cm-node-body">
        ${esc(n.label)}
      </button>
    </li>`).join('<li class="cm-model__link" aria-hidden="true"></li>');

  return `
    <section class="cm-sec" aria-labelledby="cm-md" data-model>
      <h3 class="cm-sec__label" id="cm-md">How it fits together</h3>
      ${m.intro ? `<p class="cm-model__intro">${esc(m.intro)}</p>` : ''}
      <ol class="cm-model">${nodes}</ol>
      <p class="cm-node__body" id="cm-node-body" data-node-body></p>
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

function sectionRemember(d) {
  const r = d.remember || [];
  return `
    <section class="cm-sec cm-sec--remember" aria-labelledby="cm-rm">
      <h3 class="cm-sec__label" id="cm-rm">If you remember only this…</h3>
      ${r.length
        ? `<ol class="cm-remember">${r.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`
        : placeholder('One-minute summary', 'Three statements that tie the unit together.')}
    </section>`;
}

function sectionQuickCheck(d) {
  const q = d.quickCheck;
  if (!q) {
    return `
      <section class="cm-sec" aria-labelledby="cm-qc">
        <h3 class="cm-sec__label" id="cm-qc">Quick check</h3>
        ${placeholder('Quick check', 'One question drawn from this summary.')}
      </section>`;
  }

  const options = q.options.map((o, i) => `
    <li>
      <label class="cm-opt">
        <input type="radio" name="cm-quick" value="${i}">
        <span class="cm-opt__marker" aria-hidden="true"></span>
        <span>${esc(o)}</span>
      </label>
    </li>`).join('');

  return `
    <section class="cm-sec" aria-labelledby="cm-qc" data-quickcheck data-answer="${q.answer}">
      <h3 class="cm-sec__label" id="cm-qc">Quick check</h3>
      <p class="cm-check__q">${esc(q.question)}</p>
      <ol class="cm-opts">${options}</ol>
      <button class="btn btn--primary" type="button" data-check>Check answer</button>
      <p class="cm-check__result" data-result hidden></p>
      ${q.why ? `<p class="cm-check__why" data-why hidden>${esc(q.why)}</p>` : ''}
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
        ${sectionVisual(d)}
        ${sectionModel(d)}
        ${sectionCoreIdeas(area, d)}
        ${sectionRemember(d)}
        ${sectionQuickCheck(d)}
        ${sectionFullGuide(area, d)}
      </div>
    </article>`;
}

/* --- Behaviour ------------------------------------------------------------ */

function wireModel(root, area) {
  const box = root.querySelector('[data-model]');
  if (!box) return;
  const nodes = (getDetail(area.n).model || {}).nodes || [];
  const buttons = [...box.querySelectorAll('[data-node]')];
  const body = box.querySelector('[data-node-body]');

  function show(i) {
    buttons.forEach((b, n) => b.setAttribute('aria-expanded', String(n === i)));
    body.textContent = (nodes[i] || {}).body || '';
  }

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-node]');
    if (btn) show(buttons.indexOf(btn));
  });
  show(0);
}

function wireQuickCheck(root) {
  const box = root.querySelector('[data-quickcheck]');
  if (!box) return;
  const answer = Number(box.dataset.answer);
  const result = box.querySelector('[data-result]');
  const why = box.querySelector('[data-why]');

  box.querySelector('[data-check]').addEventListener('click', () => {
    const picked = box.querySelector('input[name="cm-quick"]:checked');
    if (!picked) {
      result.hidden = false;
      result.className = 'cm-check__result';
      result.textContent = 'Choose an answer first.';
      return;
    }
    const right = Number(picked.value) === answer;
    result.hidden = false;
    result.className = `cm-check__result ${right ? 'is-right' : 'is-wrong'}`;
    result.textContent = right ? 'Correct.' : 'Not quite.';
    picked.closest('.cm-opt').classList.add(right ? 'is-right' : 'is-wrong');
    if (why) why.hidden = false;
  });
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
    const page = el('div', 'page page--course-map');
    page.append(html(`
      <div class="cm-shell">
        ${header()}
        <div class="cm-explorer shell">
          ${rail(area.n)}
          ${panel(area)}
        </div>
      </div>`));
    wireModel(page, area);
    wireQuickCheck(page);
    return page;
  },
};
