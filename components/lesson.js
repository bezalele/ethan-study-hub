/* ---------------------------------------------------------------------------
   lesson.js — a study lesson rendered inside the Course page's panel.

   Same arrangement as power-triangle.js: this module owns the markup and the
   behaviour, and its styles live in pages/course-map.css so the page keeps
   one stylesheet and one scope.

   Eight parts, always in this order: question, intro, chart, highlights, one
   real-life example, one fact, and the exercises. A section whose data is
   missing does not render, so the other Unit 1 lessons can be written
   without touching this file.

   Two rules run through the whole thing.

   Nothing hides. There are no tabs, no accordions and no "click to reveal":
   every example and every explanation is on the page from the first paint.
   The reader should be able to follow the lesson from the headings, the
   pictures and the chart without clicking anything at all.

   The only clicks are answers. One click per question, feedback straight
   away, no Check button and no paging.
   --------------------------------------------------------------------------- */

import { esc } from '../layout/dom.js?v=21';

/* --- 1 + 2. Title, guiding question, short intro -------------------------- */

function head(lesson, area) {
  return `
    <header class="les-head">
      <a class="les-back" href="#/course/${area.n}">← Unit ${area.n}</a>
      <p class="les-head__kicker">${esc(lesson.title)}<span class="les-head__ap">${esc(lesson.ap)}</span></p>
      <h2 class="les-head__q">${esc(lesson.question)}</h2>
      <div class="les-head__intro">
        ${(lesson.intro || []).map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
    </header>`;
}

/* --- 3. The one strong visual --------------------------------------------- */

/* Three columns, everything visible. The note under each example is the
   plain-English gloss that used to sit behind a click. */
function chart(c) {
  if (!c) return '';
  const cols = c.columns.map((col) => `
    <article class="les-col les-col--${esc(col.key)}">
      <figure class="les-col__art">
        <img src="${esc(col.image)}" alt="${esc(col.alt)}" loading="lazy">
        <figcaption>${esc(col.credit)}</figcaption>
      </figure>
      <p class="les-col__label">${esc(col.label)}</p>
      <p class="les-col__kind">${esc(col.kind)}</p>
      <ul class="les-col__items">
        ${col.items.map((it) => `
          <li>
            <strong>${esc(it.title)}</strong>
            <span>${esc(it.note)}</span>
          </li>`).join('')}
      </ul>
    </article>`).join('');

  return `
    <section class="les-sec les-sec--chart">
      <div class="les-cols">${cols}</div>
      ${c.caption ? `<p class="les-cols__caption">${esc(c.caption)}</p>` : ''}
    </section>`;
}

/* --- 4. Three to five highlights ------------------------------------------ */

/* Each one reads on its own. The optional strip of steps is there for ideas
   that are easier seen than read - reserved powers being the reason it
   exists. */
function highlights(list) {
  if (!list || !list.length) return '';
  const items = list.map((h, i) => `
    <li class="les-hi">
      <span class="les-hi__n">${i + 1}</span>
      <div class="les-hi__text">
        <strong>${esc(h.title)}</strong>
        <p>${esc(h.body)}</p>
        ${h.steps ? `
          <ol class="les-steps">
            ${h.steps.map((s) => `<li>${esc(s)}</li>`).join('')}
          </ol>` : ''}
      </div>
    </li>`).join('');

  return `
    <section class="les-sec les-sec--highlights">
      <h3 class="les-sec__label">What to know</h3>
      <ul class="les-his">${items}</ul>
    </section>`;
}

/* --- 5. One real-life connection ------------------------------------------ */

function realLife(r) {
  if (!r) return '';
  return `
    <section class="les-sec les-sec--real">
      <h3 class="les-sec__label">In real life</h3>
      <div class="les-real">
        ${r.image ? `
          <figure class="les-real__art">
            <img src="${esc(r.image)}" alt="${esc(r.alt || '')}" loading="lazy">
            <figcaption>${esc(r.credit || '')}</figcaption>
          </figure>` : ''}
        <div class="les-real__text">
          <strong>${esc(r.title)}</strong>
          <p>${esc(r.body)}</p>
        </div>
      </div>
    </section>`;
}

/* --- 6. One fact ---------------------------------------------------------- */

function fact(text) {
  if (!text) return '';
  return `
    <aside class="les-fact">
      <span class="les-fact__tag">Worth remembering</span>
      <p>${esc(text)}</p>
    </aside>`;
}

/* --- 7 + 8. The exercises, which are also the only interaction ------------ */

/* One click per question. The answer and the reason appear together, in
   place, and the question stays on screen beside them - there is nothing to
   page through and nothing to go back to. */
export function quiz(questions, opts) {
  const o = opts || {};
  const name = o.name || 'q';
  const items = questions.map((q, n) => `
    <li class="les-ex" data-ex="${n}" data-answer="${q.answer}">
      <p class="les-ex__q"><span class="les-ex__n">${n + 1}</span>${esc(q.question)}</p>
      <div class="les-ex__opts">
        ${q.options.map((op, i) => `
          <button class="les-ex__opt" type="button" data-opt="${i}"
                  id="${name}-${n}-${i}">${esc(op)}</button>`).join('')}
      </div>
      <p class="les-ex__why" data-why hidden>${esc(q.why)}</p>
    </li>`).join('');

  return `
    <section class="les-sec les-sec--ex" data-quiz${o.unit ? ` data-unit="${esc(String(o.unit))}"` : ''}>
      <div class="les-ex__head">
        <h3 class="les-sec__label">${esc(o.label || 'Check yourself')}</h3>
        <p class="les-ex__score" data-score>${questions.length} questions. Tap an answer.</p>
      </div>
      <ol class="les-exs">${items}</ol>
    </section>`;
}

export function wireQuiz(root) {
  root.querySelectorAll('[data-quiz]').forEach((box) => {
    const items = [...box.querySelectorAll('[data-ex]')];
    const score = box.querySelector('[data-score]');
    const unit = box.dataset.unit;
    const marks = new Array(items.length);

    box.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-opt]');
      if (!btn) return;
      const item = btn.closest('[data-ex]');
      if (item.dataset.done) return;

      const want = Number(item.dataset.answer);
      const got = Number(btn.dataset.opt);
      const right = got === want;
      item.dataset.done = '1';
      marks[items.indexOf(item)] = right;

      item.querySelectorAll('[data-opt]').forEach((b) => {
        b.disabled = true;
        if (Number(b.dataset.opt) === want) b.classList.add('is-right');
        else if (b === btn) b.classList.add('is-wrong');
      });
      item.classList.add(right ? 'is-right' : 'is-wrong');
      const why = item.querySelector('[data-why]');
      why.hidden = false;

      const done = marks.filter((m) => m !== undefined).length;
      const got_ = marks.filter(Boolean).length;
      if (done < items.length) {
        score.textContent = `${done} of ${items.length} answered.`;
        return;
      }
      score.classList.add('is-done');
      score.textContent = `You got ${got_} of ${items.length}.`;
      /* Kept, rather than shown and forgotten: it syncs like everything
         else, so the run he did on his laptop is the run his parents see. */
      if (unit && window.ApGovProgress) {
        window.ApGovProgress.recordUnitCheck(Number(unit), got_, items.length);
      }
    });
  });
}

/* --- The whole lesson ------------------------------------------------------ */

export function renderLesson(lesson, area) {
  return `
    <div class="les">
      ${head(lesson, area)}
      ${chart(lesson.chart)}
      ${highlights(lesson.highlights)}
      ${realLife(lesson.realLife)}
      ${fact(lesson.fact)}
      ${lesson.exercises ? quiz(lesson.exercises, { name: 'les', label: 'Check yourself' }) : ''}
      <footer class="les-foot">
        <a class="btn btn--primary" href="#/course/${area.n}">← Back to Unit ${area.n}</a>
      </footer>
    </div>`;
}

export function wireLesson(root) {
  wireQuiz(root);
}
