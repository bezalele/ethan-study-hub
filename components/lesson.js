/* ---------------------------------------------------------------------------
   lesson.js — a study lesson rendered inside the Course page's panel.

   Follows the same arrangement as power-triangle.js: this module owns the
   markup and the behaviour, and its styles live in pages/course-map.css so
   the page keeps one stylesheet and one scope.

   The lesson is built from the data in content/lessons.js. Nothing here is
   specific to Federalism; a section whose data is absent simply does not
   render, so lessons 1-4 can be written without touching this file.

   Reading order is deliberate. Every section leads with a picture, a
   heading or a diagram, and puts its prose second - the student should be
   able to follow the argument from the shapes before reading a word of it.
   Long explanations are hidden behind a click until they are wanted.
   --------------------------------------------------------------------------- */

import { esc } from '../layout/dom.js?v=20';

/* --- Small shared pieces --------------------------------------------------- */

function sectionHead(label, lead) {
  return `
    <header class="les-sec__head">
      <h3 class="les-sec__label">${esc(label)}</h3>
      ${lead ? `<p class="les-sec__lead">${esc(lead)}</p>` : ''}
    </header>`;
}

/* A numbered left-to-right flow. Used twice: once for the Tenth Amendment's
   logic, once for how federal money becomes a state programme. */
function flow(steps, modifier) {
  const items = steps.map((s, i) => `
    <li class="les-flow__item">
      <span class="les-flow__n">${i + 1}</span>
      <span class="les-flow__body">
        <strong>${esc(s.step)}</strong>
        <span>${esc(s.body)}</span>
      </span>
    </li>`).join('<li class="les-flow__arrow" aria-hidden="true">→</li>');
  return `<ol class="les-flow${modifier ? ' ' + modifier : ''}">${items}</ol>`;
}

/* --- 1. The opening -------------------------------------------------------- */

function head(lesson, area) {
  return `
    <header class="les-head">
      <a class="les-back" href="#/course/${area.n}">← Unit 0${area.n} · ${esc(area.short || area.title)}</a>
      <p class="les-head__kicker">
        Lesson ${lesson.n}
        <span class="les-head__ap">${esc(lesson.ap)}</span>
      </p>
      <h2 class="les-head__q">${esc(lesson.question)}</h2>
      <div class="les-head__lede">
        ${lesson.opening.map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
    </header>`;
}

/* --- 2. Federal / State / Both -------------------------------------------- */

/* Three columns, each headed by a real building, each listing what that
   level of government may do. Every example is a button; the explanation
   appears in one strip below, so choosing a second example never makes the
   columns change height. */
function sorter(s) {
  if (!s) return '';
  const cols = s.columns.map((c) => `
    <article class="les-col les-col--${esc(c.key)}">
      <figure class="les-col__art">
        <img src="${esc(c.image)}" alt="${esc(c.alt)}" loading="lazy">
        <figcaption>${esc(c.credit)}</figcaption>
      </figure>
      <header class="les-col__head">
        <h4 class="les-col__label">${esc(c.label)}</h4>
        <p class="les-col__kind">${esc(c.kind)}</p>
        <p class="les-col__gloss">${esc(c.gloss)}</p>
      </header>
      <ul class="les-col__items">
        ${c.items.map((it, i) => `
          <li>
            <button class="les-item" type="button" aria-pressed="false"
                    data-power="${esc(c.key)}:${i}">
              <span>${esc(it.title)}</span>
              <span class="les-item__more" aria-hidden="true">+</span>
            </button>
          </li>`).join('')}
      </ul>
    </article>`).join('');

  return `
    <section class="les-sec les-sec--sorter" data-sorter>
      ${sectionHead('Federal, state, or both', s.intro)}
      <div class="les-cols">${cols}</div>
      <div class="les-reveal" data-reveal aria-live="polite">
        <p class="les-reveal__prompt" data-reveal-prompt>Pick any example above.</p>
        <div class="les-reveal__body" data-reveal-body hidden>
          <p class="les-reveal__tag" data-reveal-tag></p>
          <p class="les-reveal__title" data-reveal-title></p>
          <p class="les-reveal__text" data-reveal-text></p>
        </div>
      </div>
    </section>`;
}

/* --- 3. Who has the power? ------------------------------------------------- */

/* One scenario at a time, three buttons, an answer you cannot take back.
   The explanation says why, which is the only part worth reading. */
function challenge(ch) {
  if (!ch) return '';
  const cards = ch.questions.map((q, n) => `
    <div class="les-ch__card${n ? '' : ' is-on'}" data-ch="${n}" data-answer="${esc(q.answer)}">
      <p class="les-ch__prompt">${esc(q.prompt)}</p>
      <div class="les-ch__picks">
        ${['federal', 'state', 'both'].map((k) => `
          <button class="les-pick les-pick--${k}" type="button" data-pick="${k}">
            ${k === 'federal' ? 'Federal' : k === 'state' ? 'State' : 'Both'}
          </button>`).join('')}
      </div>
      <p class="les-ch__verdict" data-verdict hidden></p>
      <p class="les-ch__why" data-why hidden>${esc(q.why)}</p>
    </div>`).join('');

  return `
    <section class="les-sec les-sec--challenge" data-challenge>
      <div class="les-ch__head">
        ${sectionHead('Who has the power?', ch.lead)}
        <p class="les-ch__count" data-ch-count>1 of ${ch.questions.length}</p>
      </div>
      <div class="les-ch__cards">${cards}</div>
      <div class="les-ch__nav">
        <button class="les-ch__step" type="button" data-ch-prev disabled>← Back</button>
        <button class="les-ch__step" type="button" data-ch-next>Next →</button>
      </div>
      <p class="les-ch__score" data-ch-score>Answer all ${ch.questions.length} to see your score.</p>
    </section>`;
}

/* --- 4. Reserved powers ---------------------------------------------------- */

function reserved(r) {
  if (!r) return '';
  return `
    <section class="les-sec les-sec--reserved">
      ${sectionHead(r.label, r.lead)}
      <p class="les-reserved__source">${esc(r.amendment)}</p>
      ${flow(r.flow, 'les-flow--reserved')}
      ${r.didYouKnow ? `
        <aside class="les-fact">
          <span class="les-fact__tag">Did you know?</span>
          <p>${esc(r.didYouKnow)}</p>
        </aside>` : ''}
    </section>`;
}

/* --- 5. Where the power comes from ----------------------------------------- */

/* Four doors. Behind each is one to three sentences, never the text of the
   clause itself - a wall of eighteenth-century English would undo the point
   of the whole page. */
function anchors(a) {
  if (!a) return '';
  const tabs = a.items.map((it, i) => `
    <button class="les-anchor" type="button" aria-pressed="${i === 0}" data-anchor="${i}">
      <span class="les-anchor__title">${esc(it.title)}</span>
      <span class="les-anchor__tag">${esc(it.tag)}</span>
    </button>`).join('');

  const bodies = a.items.map((it, i) => `
    <div class="les-anchor__body" data-anchor-body="${i}" ${i ? 'hidden' : ''}>
      <p>${esc(it.body)}</p>
    </div>`).join('');

  return `
    <section class="les-sec les-sec--anchors" data-anchors>
      ${sectionHead('Where does this power come from?', a.lead)}
      <div class="les-anchors">${tabs}</div>
      <div class="les-anchor__bodies" aria-live="polite">${bodies}</div>
    </section>`;
}

/* --- 6. The Supreme Court changes the line --------------------------------- */

/* Two cases, drawn identically so the difference between them is the only
   thing that stands out. Recognition, not a case brief. */
function cases(c) {
  if (!c) return '';
  const items = c.items.map((k) => `
    <article class="les-case les-case--${esc(k.direction)}">
      <div class="les-case__top">
        <h4 class="les-case__name">${esc(k.name)}</h4>
        <p class="les-case__year">${esc(k.year)}</p>
      </div>
      <p class="les-case__q">${esc(k.question)}</p>
      <p class="les-case__held">${esc(k.held)}</p>
      <p class="les-case__model">
        <span class="les-case__arrow" aria-hidden="true">${k.direction === 'up' ? '▲' : '▼'}</span>
        ${esc(k.model)}
      </p>
    </article>`).join('');

  return `
    <section class="les-sec les-sec--cases">
      ${sectionHead('The Supreme Court changes the line', c.lead)}
      <figure class="les-cases__art">
        <img src="${esc(c.image)}" alt="${esc(c.alt)}" loading="lazy">
        <figcaption>${esc(c.credit)}</figcaption>
      </figure>
      <div class="les-cases">${items}</div>
    </section>`;
}

/* --- 7. Federalism in real life -------------------------------------------- */

function realLife(r) {
  if (!r) return '';
  return `
    <section class="les-sec les-sec--real">
      ${sectionHead('Federalism in real life', r.lead)}
      ${flow(r.flow, 'les-flow--real')}
      ${r.note ? `<p class="les-real__note">${esc(r.note)}</p>` : ''}
    </section>`;
}

/* --- 8. The three sentences ------------------------------------------------ */

function remember(list) {
  if (!list || !list.length) return '';
  return `
    <section class="les-sec les-sec--remember">
      ${sectionHead('If you remember only three things…')}
      <ol class="les-remember">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    </section>`;
}

/* --- 9. The evaluation ----------------------------------------------------- */

/* Built to the same shape as the unit Quick check so the two feel like one
   thing the site does, rather than two quizzes that happen to share a page. */
function check(qs) {
  if (!qs || !qs.length) return '';
  const cards = qs.map((q, n) => {
    const options = q.options.map((o, i) => `
      <li>
        <label class="cm-opt">
          <input type="radio" name="les-q${n}" value="${i}">
          <span class="cm-opt__marker" aria-hidden="true"></span>
          <span>${esc(o)}</span>
        </label>
      </li>`).join('');
    return `
      <div class="cm-check__card${n ? '' : ' is-on'}" data-q="${n}" data-answer="${q.answer}">
        <p class="cm-check__q">${esc(q.question)}</p>
        <ol class="cm-opts">${options}</ol>
      </div>`;
  }).join('');

  const verdicts = qs.map((q, n) => `
    <div class="cm-check__verdict${n ? '' : ' is-on'}" data-v="${n}" aria-hidden="true">
      <p class="cm-check__result" data-result></p>
      <p class="cm-check__why">${esc(q.why)}</p>
    </div>`).join('');

  return `
    <section class="cm-sec cm-sec--check les-sec les-sec--check" data-quiz>
      <div class="cm-check__head">
        <h3 class="cm-sec__label">What you can now answer</h3>
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

/* --- The whole lesson ------------------------------------------------------ */

export function renderLesson(lesson, area) {
  return `
    <div class="les">
      ${head(lesson, area)}
      ${sorter(lesson.sorter)}
      ${challenge(lesson.challenge)}
      ${reserved(lesson.reserved)}
      ${anchors(lesson.anchors)}
      ${cases(lesson.cases)}
      ${realLife(lesson.realLife)}
      ${remember(lesson.remember)}
      ${check(lesson.check)}
      <footer class="les-foot">
        <a class="btn btn--primary" href="#/course/${area.n}">← Back to Unit 0${area.n}</a>
      </footer>
    </div>`;
}

/* --- Behaviour ------------------------------------------------------------- */

function wireSorter(root, lesson) {
  const box = root.querySelector('[data-sorter]');
  if (!box || !lesson.sorter) return;
  const byKey = {};
  lesson.sorter.columns.forEach((c) => { byKey[c.key] = c; });

  const buttons = [...box.querySelectorAll('[data-power]')];
  const prompt = box.querySelector('[data-reveal-prompt]');
  const body = box.querySelector('[data-reveal-body]');
  const tag = box.querySelector('[data-reveal-tag]');
  const title = box.querySelector('[data-reveal-title]');
  const text = box.querySelector('[data-reveal-text]');

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-power]');
    if (!btn) return;
    const [key, i] = btn.dataset.power.split(':');
    const col = byKey[key];
    const item = col && col.items[Number(i)];
    if (!item) return;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    prompt.hidden = true;
    body.hidden = false;
    body.dataset.key = key;
    tag.textContent = `${col.label} · ${col.kind}`;
    title.textContent = item.title;
    text.textContent = item.body;
  });
}

function wireChallenge(root) {
  const box = root.querySelector('[data-challenge]');
  if (!box) return;
  const cards = [...box.querySelectorAll('[data-ch]')];
  const count = box.querySelector('[data-ch-count]');
  const score = box.querySelector('[data-ch-score]');
  const prev = box.querySelector('[data-ch-prev]');
  const next = box.querySelector('[data-ch-next]');
  const marks = new Array(cards.length);
  let at = 0;

  const NAME = { federal: 'Federal', state: 'State', both: 'Both' };

  function show(i) {
    at = Math.max(0, Math.min(cards.length - 1, i));
    cards.forEach((c, n) => c.classList.toggle('is-on', n === at));
    count.textContent = `${at + 1} of ${cards.length}`;
    prev.disabled = at === 0;
    next.disabled = at === cards.length - 1;
  }

  function report() {
    if (marks.filter((m) => m !== undefined).length < cards.length) return;
    const right = marks.filter(Boolean).length;
    score.classList.add('is-done');
    score.textContent = `You placed ${right} of ${cards.length} correctly.`;
  }

  box.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-pick]');
    if (!pick) return;
    const card = cards[at];
    if (card.dataset.done) return;
    const want = card.dataset.answer;
    const got = pick.dataset.pick;
    const right = got === want;
    card.dataset.done = '1';
    marks[at] = right;

    card.querySelectorAll('[data-pick]').forEach((b) => {
      b.disabled = true;
      if (b.dataset.pick === want) b.classList.add('is-right');
      else if (b === pick) b.classList.add('is-wrong');
    });
    const verdict = card.querySelector('[data-verdict]');
    verdict.hidden = false;
    verdict.className = `les-ch__verdict ${right ? 'is-right' : 'is-wrong'}`;
    verdict.textContent = right ? 'Correct.' : `Not quite — it is ${NAME[want]}.`;
    card.querySelector('[data-why]').hidden = false;
    report();
  });

  prev.addEventListener('click', () => show(at - 1));
  next.addEventListener('click', () => show(at + 1));
  show(0);
}

function wireAnchors(root) {
  const box = root.querySelector('[data-anchors]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-anchor]')];
  const bodies = [...box.querySelectorAll('[data-anchor-body]')];
  box.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-anchor]');
    if (!tab) return;
    const i = tabs.indexOf(tab);
    tabs.forEach((t, n) => t.setAttribute('aria-pressed', String(n === i)));
    bodies.forEach((b, n) => { b.hidden = n !== i; });
  });
}

export function wireLesson(root, lesson) {
  wireSorter(root, lesson);
  wireChallenge(root);
  wireAnchors(root);
}
