/* ---------------------------------------------------------------------------
   chapter.js — the standard template for all five founding-story chapters.

   Route: #/study/:chapter

   The page opens on one full screen: a compact hero, the chapter timeline,
   and then the slideshow with its thumbnails beside the quiz. Everything
   below that — the big picture, takeaways, facts, documents — is there when
   you scroll, but nothing Ethan needs on landing is hidden.

   The explanation is spread across the slides rather than sitting in one
   paragraph: each slide carries one point, taken from the chapter's own
   takeaways unless the slide defines its own.

   Every block is driven by content/chapters.js and every block is optional,
   so content can be filled in one field at a time without the page breaking.
   --------------------------------------------------------------------------- */

import {
  CHAPTERS, getChapter, nextChapter, prevChapter, chapterPosition,
} from '../content/chapters.js?v=5';
import { renderTimeline } from '../components/timeline.js?v=5';
import { el, html, esc } from '../layout/dom.js?v=5';

/* --- Small shared pieces -------------------------------------------------- */

/** A labelled placeholder used wherever art is not in the repo yet. */
function placeholder(label, modifier = '') {
  return `
    <div class="ch-ph ${modifier}" role="img" aria-label="${esc(label)} — image to come">
      <span class="ch-ph__mark" aria-hidden="true"></span>
      <span class="ch-ph__label">${esc(label)}</span>
    </div>`;
}

/** An image if we have one, otherwise the placeholder. */
function picture(image, label, modifier = '') {
  if (image && image.src) {
    return `<img class="ch-img ${modifier}" src="${image.src}"
                 alt="${esc(image.alt || label)}" loading="lazy">`;
  }
  return placeholder(label, modifier);
}

/** The chapter's facts, whether it supplies one or several. */
function factsOf(ch) {
  if (Array.isArray(ch.facts)) return ch.facts;
  return ch.fact ? [ch.fact] : [];
}

/* Prose fields may carry <strong> and <em> for key terms. Everything is
   escaped first and only those two tags are let back through, so the content
   file cannot inject markup by accident — and a stray <strong> no longer
   prints as literal text, which is what happened when some fields were
   escaped and others were not. */
function prose(text) {
  return esc(text || '').replace(/&lt;(\/?)(strong|em)&gt;/g, '<$1$2>');
}

/* --- Hero ----------------------------------------------------------------- */

function hero(ch) {
  const pos = chapterPosition(ch.id);
  return `
    <section class="ch-hero">
      <img class="ch-hero__bg" src="${ch.hero.src}" alt="${esc(ch.hero.alt || '')}" fetchpriority="high">
      <div class="ch-hero__scrim"></div>
      <div class="ch-hero__inner shell">
        <div class="ch-hero__copy">
          <p class="eyebrow eyebrow--on-dark">
            Unit 1 · The Story <span class="ch-hero__sep">·</span> Chapter ${pos} of ${CHAPTERS.length}
          </p>
          <p class="ch-hero__year">${esc(ch.years)}</p>
          <h1 class="ch-hero__title">${esc(ch.title)}</h1>
          ${ch.deck ? `<p class="ch-hero__deck">${esc(ch.deck)}</p>` : ''}
        </div>
        ${ch.heroQuote ? `
          <blockquote class="ch-hero__quote">
            “${esc(ch.heroQuote.text)}”
            <cite>— ${esc(ch.heroQuote.source)}</cite>
          </blockquote>` : ''}
      </div>
    </section>`;
}

/* --- Slideshow ------------------------------------------------------------ */

function gallery(ch) {
  const slides = ch.gallery || [];
  if (!slides.length) return '';

  // One point per slide: the slide's own, else the matching takeaway.
  const pointFor = (s, i) => s.point || (ch.takeaways || [])[i] || s.caption || '';

  const stage = slides.map((s, i) => `
    <figure class="ch-slide" data-slide="${i}" ${i ? 'hidden' : ''}>
      ${picture(s, s.label, 'ch-slide__img')}
      <figcaption class="ch-slide__cap">
        <strong class="ch-slide__label">${esc(s.label)}</strong>
        <span class="ch-slide__point">${esc(pointFor(s, i))}</span>
      </figcaption>
    </figure>`).join('');

  const thumbs = slides.map((s, i) => `
    <li>
      <button class="ch-thumb" type="button" data-goto="${i}"
              ${i === 0 ? 'aria-current="true"' : ''}>
        ${picture({ src: s.thumb || s.src, alt: '' }, s.label, 'ch-thumb__img')}
        <span class="ch-thumb__label">${esc(s.label)}</span>
      </button>
    </li>`).join('');

  const multi = slides.length > 1;

  return `
    <div class="ch-gallery" data-gallery>
      <div class="ch-gallery__stage">
        ${stage}
        ${multi ? `
          <button class="ch-gallery__arrow ch-gallery__arrow--prev" type="button"
                  data-step="-1" aria-label="Previous image">‹</button>
          <button class="ch-gallery__arrow ch-gallery__arrow--next" type="button"
                  data-step="1" aria-label="Next image">›</button>
          <p class="ch-gallery__count" data-count-label>1 / ${slides.length}</p>` : ''}
      </div>
      ${multi ? `<ol class="ch-gallery__thumbs">${thumbs}</ol>` : ''}
    </div>`;
}

/* --- Quiz ----------------------------------------------------------------- */

function quiz(ch) {
  const qs = ch.quiz || [];
  if (!qs.length) return '';

  const cards = qs.map((q, n) => `
    <fieldset class="ch-q" data-q="${n}" ${n ? 'hidden' : ''}>
      <legend class="ch-q__text">${esc(q.question)}</legend>
      <ol class="ch-q__opts">
        ${q.options.map((o, i) => `
          <li>
            <label class="ch-opt">
              <input type="radio" name="q${n}" value="${i}">
              <span class="ch-opt__marker" aria-hidden="true"></span>
              <span class="ch-opt__label">${esc(o)}</span>
            </label>
          </li>`).join('')}
      </ol>
      <p class="ch-q__why" data-why hidden>${esc(q.why || '')}</p>
    </fieldset>`).join('');

  return `
    <section class="ch-quiz" data-quiz data-total="${qs.length}" data-chapter="${esc(ch.id)}">
      <header class="ch-quiz__head">
        <h2 class="ch-quiz__title">Quick check</h2>
        <p class="ch-quiz__meta"><span data-progress>1</span> of ${qs.length}</p>
      </header>

      <ol class="ch-quiz__dots" aria-hidden="true">
        ${qs.map((_, i) => `<li class="ch-quiz__dot${i ? '' : ' is-current'}" data-dot="${i}"></li>`).join('')}
      </ol>

      <form class="ch-quiz__form" data-form>${cards}</form>

      <div class="ch-quiz__foot">
        <button class="btn btn--ghost" type="button" data-prev disabled>← Back</button>
        <button class="btn btn--primary" type="button" data-next>Check</button>
      </div>

      <div class="ch-quiz__result" data-result hidden>
        <p class="ch-quiz__score"><strong data-score>0</strong> out of ${qs.length}</p>
        <p class="ch-quiz__best" data-best></p>
        <button class="btn btn--ghost" type="button" data-again>Try again</button>
      </div>
    </section>`;
}

/* --- Right rail (below the fold) ------------------------------------------ */

function takeaways(ch) {
  if (!ch.takeaways || !ch.takeaways.length) return '';
  const items = ch.takeaways.map((t, i) => `
    <li class="ch-take">
      <span class="ch-take__n">${i + 1}</span>
      <span>${esc(t)}</span>
    </li>`).join('');

  return `
    <section class="ch-card ch-card--takeaways">
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">🔑</span> Key Takeaways</h2>
      <ol class="ch-takes">${items}</ol>
    </section>`;
}

function factCard(ch) {
  const facts = factsOf(ch);
  if (!facts.length) return '';

  const panels = facts.map((f, i) => {
    const initials = (f.name || '?')
      .split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    const figure = f.portrait
      ? `<img class="ch-fact__portrait" src="${f.portrait}" alt="${esc(f.name || '')}" loading="lazy">`
      : `<span class="ch-fact__medallion" aria-hidden="true">${esc(initials)}</span>`;

    return `
      <div class="ch-fact" data-fact="${i}" ${i ? 'hidden' : ''}>
        <p class="ch-fact__text">${esc(f.text)}</p>
        ${(f.name || f.portrait) ? `
          <figure class="ch-fact__who">
            ${figure}
            <figcaption>
              <strong>${esc(f.name || '')}</strong>
              ${f.dates ? `<span>${esc(f.dates)}</span>` : ''}
            </figcaption>
          </figure>` : ''}
      </div>`;
  }).join('');

  // A pager appears only when there is more than one fact.
  const pager = facts.length > 1 ? `
    <div class="ch-fact__pager">
      <button class="ch-fact__arrow" type="button" data-fact-step="-1" aria-label="Previous fact">‹</button>
      <span class="ch-fact__count"><span data-fact-label>1</span> / ${facts.length}</span>
      <button class="ch-fact__arrow" type="button" data-fact-step="1" aria-label="Next fact">›</button>
    </div>` : '';

  return `
    <section class="ch-card ch-card--fact" data-facts>
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">💡</span> Interesting Fact</h2>
      ${panels}
      ${pager}
    </section>`;
}

/* The middle of "A closer look" is a slideshow when the chapter has more than
   one image, and a plain picture when it has one. */
function closerArt(cl) {
  const images = cl.images && cl.images.length ? cl.images : (cl.image ? [cl.image] : []);
  if (!images.length) return placeholder(cl.title, 'ch-closer__img');
  if (images.length === 1) return picture(images[0], cl.title, 'ch-closer__img');

  const frames = images.map((im, i) => `
    <div class="ch-closer__frame" data-cframe="${i}" ${i ? 'hidden' : ''}>
      ${picture(im, cl.title, 'ch-closer__img')}
    </div>`).join('');

  const dots = images.map((_, i) => `
    <button class="ch-closer__dot${i ? '' : ' is-current'}" type="button"
            data-cgoto="${i}" aria-label="Image ${i + 1} of ${images.length}"></button>`).join('');

  return `
    <div class="ch-closer__slides" data-closer>
      ${frames}
      <button class="ch-closer__arrow ch-closer__arrow--prev" type="button"
              data-cstep="-1" aria-label="Previous image">‹</button>
      <button class="ch-closer__arrow ch-closer__arrow--next" type="button"
              data-cstep="1" aria-label="Next image">›</button>
      <div class="ch-closer__dots">${dots}</div>
    </div>`;
}

/* --- A closer look -------------------------------------------------------- */

function closerLook(ch) {
  const cl = ch.closerLook;
  if (!cl) return '';

  /* A section is a link only when it has somewhere of its own to go. Without
     an href it is a plain row: four chevrons all leading to the same shelf
     promised four destinations that did not exist. */
  const sections = (cl.sections || []).map((s) => {
    const body = `
      <strong>${esc(s.label)}</strong>
      <span>${prose(s.note)}</span>
      ${s.href ? '<i aria-hidden="true">›</i>' : ''}`;
    return s.href
      ? `<li><a class="ch-section ch-section--link" href="${esc(s.href)}">${body}</a></li>`
      : `<li><div class="ch-section">${body}</div></li>`;
  }).join('');

  return `
    <section class="ch-closer">
      <div class="ch-closer__copy">
        <p class="eyebrow">A closer look</p>
        <h2>${esc(cl.title)}</h2>
        <p class="ch-closer__body">${prose(cl.body)}</p>
        <a class="btn btn--primary" href="#/study/documents">${esc(cl.cta || 'Read the documents')} →</a>
      </div>
      <div class="ch-closer__art">${closerArt(cl)}</div>
      <div class="ch-closer__sections">
        <h3 class="ch-closer__sections-head">Explore by section</h3>
        <ol>${sections}</ol>
      </div>
    </section>`;
}

/* --- Bottom row ----------------------------------------------------------- */

function whyItMatters(ch) {
  const w = ch.whyItMatters;
  if (!w) return '';

  const connections = (w.connections || []).map((c) => `
    <li class="ch-meaning__row">
      <span class="ch-meaning__from">${esc(c.from)}</span>
      <span class="ch-meaning__arrow" aria-hidden="true">→</span>
      <span class="ch-meaning__to">${esc(c.to)}</span>
    </li>`).join('');

  const steps = !connections && (w.steps || []).map((s, i, arr) => `
    <li class="ch-flow__step">${esc(s)}</li>
    ${i < arr.length - 1 ? '<li class="ch-flow__arrow" aria-hidden="true">→</li>' : ''}`).join('');

  return `
    <section class="ch-card ch-card--matters">
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">🌎</span> Why It Matters</h2>
      <p class="ch-card__text">${prose(w.body)}</p>
      ${connections ? `
        <div class="ch-card__minihead">History → government idea</div>
        <ol class="ch-meaning">${connections}</ol>` : ''}
      ${steps ? `<ol class="ch-flow">${steps}</ol>` : ''}
    </section>`;
}

function whatsNext(ch) {
  const next = nextChapter(ch.id);
  const w = ch.whatsNext || {};
  const bridge = (w.bridge || []).map((b) => `
    <li class="ch-bridge__item">
      <span class="ch-bridge__label">${esc(b.label)}</span>
      <strong>${esc(b.title)}</strong>
      <span class="ch-bridge__note">${esc(b.note)}</span>
    </li>`).join('');

  return `
    <section class="ch-card ch-card--next">
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">➡️</span> What’s Next?</h2>
      ${w.body ? `<p class="ch-card__text">${prose(w.body)}</p>` : ''}
      ${bridge ? `<ol class="ch-bridge">${bridge}</ol>` : ''}
      ${next ? `
        <a class="ch-next ch-next--compact" href="#/study/${next.id}">
          <img class="ch-next__thumb" src="${next.image.src}" alt="" loading="lazy">
          <span>
            <small>Next chapter · ${esc(next.years)}</small>
            <strong>${esc(next.short)}</strong>
          </span>
        </a>`
      : '<a class="btn btn--ghost" href="#/study/practice">Practice what you read →</a>'}
    </section>`;
}

/* --- Behaviour ------------------------------------------------------------ */

function wireGallery(root) {
  const g = root.querySelector('[data-gallery]');
  if (!g) return;

  const slides = [...g.querySelectorAll('.ch-slide')];
  const thumbs = [...g.querySelectorAll('.ch-thumb')];
  const label = g.querySelector('[data-count-label]');
  let index = 0;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => { s.hidden = n !== index; });
    thumbs.forEach((t, n) => {
      if (n === index) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
    });
    if (label) label.textContent = `${index + 1} / ${slides.length}`;
  }

  g.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]');
    if (step) { show(index + Number(step.dataset.step)); return; }
    const goto = e.target.closest('[data-goto]');
    if (goto) show(Number(goto.dataset.goto));
  });
}

function wireCloser(root) {
  const box = root.querySelector('[data-closer]');
  if (!box) return;
  const frames = [...box.querySelectorAll('[data-cframe]')];
  const dots = [...box.querySelectorAll('[data-cgoto]')];
  let i = 0;

  function show(n) {
    i = (n + frames.length) % frames.length;
    frames.forEach((f, k) => { f.hidden = k !== i; });
    dots.forEach((d, k) => d.classList.toggle('is-current', k === i));
  }

  box.addEventListener('click', (e) => {
    const step = e.target.closest('[data-cstep]');
    if (step) { show(i + Number(step.dataset.cstep)); return; }
    const goto = e.target.closest('[data-cgoto]');
    if (goto) show(Number(goto.dataset.cgoto));
  });
}

function wireFacts(root) {
  const box = root.querySelector('[data-facts]');
  if (!box) return;
  const panels = [...box.querySelectorAll('[data-fact]')];
  const label = box.querySelector('[data-fact-label]');
  if (panels.length < 2) return;
  let i = 0;

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fact-step]');
    if (!btn) return;
    i = (i + Number(btn.dataset.factStep) + panels.length) % panels.length;
    panels.forEach((p, n) => { p.hidden = n !== i; });
    if (label) label.textContent = String(i + 1);
  });
}

const SCORE_KEY = 'ethanQuizScoresV1';

function readScores() {
  try { return JSON.parse(localStorage.getItem(SCORE_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveScore(chapter, score, total) {
  // Best-effort only: private windows and blocked storage must not break the quiz.
  try {
    const all = readScores();
    const prev = all[chapter] || { best: 0, attempts: 0 };
    all[chapter] = {
      best: Math.max(prev.best || 0, score),
      last: score,
      total,
      attempts: (prev.attempts || 0) + 1,
    };
    localStorage.setItem(SCORE_KEY, JSON.stringify(all));
    return all[chapter];
  } catch (e) {
    return { best: score, last: score, total, attempts: 1 };
  }
}

function wireQuiz(root) {
  const box = root.querySelector('[data-quiz]');
  if (!box) return;

  const total = Number(box.dataset.total);
  const chapter = box.dataset.chapter;
  const cards = [...box.querySelectorAll('.ch-q')];
  const dots = [...box.querySelectorAll('[data-dot]')];
  const progress = box.querySelector('[data-progress]');
  const prevBtn = box.querySelector('[data-prev]');
  const nextBtn = box.querySelector('[data-next]');
  const result = box.querySelector('[data-result]');
  const scoreEl = box.querySelector('[data-score]');
  const bestEl = box.querySelector('[data-best]');
  const answers = new Array(total).fill(null);

  // Each question carries its correct index on the element, stamped at render.
  const CORRECT = cards.map((c) => Number(c.dataset.answer));

  let i = 0;
  let checked = false;

  function render() {
    cards.forEach((c, n) => { c.hidden = n !== i; });
    dots.forEach((d, n) => d.classList.toggle('is-current', n === i));
    progress.textContent = String(i + 1);
    prevBtn.disabled = i === 0;
    checked = answers[i] !== null;
    nextBtn.textContent = checked ? (i === total - 1 ? 'See score' : 'Next →') : 'Check';
  }

  function grade() {
    const card = cards[i];
    const picked = card.querySelector('input:checked');
    if (!picked) {
      card.classList.add('is-nudge');
      setTimeout(() => card.classList.remove('is-nudge'), 400);
      return;
    }
    answers[i] = Number(picked.value);
    card.querySelectorAll('.ch-opt').forEach((o) => o.classList.add('is-locked'));
    const label = picked.closest('.ch-opt');
    const right = Number(picked.value) === CORRECT[i];
    label.classList.add(right ? 'ch-opt--right' : 'ch-opt--wrong');
    if (!right) {
      const good = card.querySelectorAll('.ch-opt')[CORRECT[i]];
      if (good) good.classList.add('ch-opt--right');
    }
    const why = card.querySelector('[data-why]');
    if (why && why.textContent.trim()) why.hidden = false;
    dots[i].classList.add(right ? 'is-right' : 'is-wrong');
    checked = true;
    nextBtn.textContent = i === total - 1 ? 'See score' : 'Next →';
  }

  function finish() {
    const score = answers.reduce((n, a, k) => n + (a === CORRECT[k] ? 1 : 0), 0);
    scoreEl.textContent = String(score);
    const rec = saveScore(chapter, score, total);
    bestEl.textContent = rec.attempts > 1
      ? `Best so far ${rec.best} of ${total} · ${rec.attempts} attempts`
      : 'Saved on this device.';
    box.querySelector('[data-form]').hidden = true;
    box.querySelector('.ch-quiz__foot').hidden = true;
    box.querySelector('.ch-quiz__dots').hidden = true;
    result.hidden = false;
  }

  nextBtn.addEventListener('click', () => {
    if (!checked) { grade(); return; }
    if (i === total - 1) { finish(); return; }
    i += 1;
    render();
  });
  prevBtn.addEventListener('click', () => { if (i > 0) { i -= 1; render(); } });
  box.querySelector('[data-again]').addEventListener('click', () => {
    window.location.reload();
  });

  render();
}

/* --- Module --------------------------------------------------------------- */

export default {
  id: 'chapter',
  nav: 'study',
  title: (params) => {
    const c = getChapter(params.chapter);
    return c ? c.short : 'Study';
  },
  render(params) {
    const ch = getChapter(params.chapter);
    const page = el('div', 'page page--chapter');

    if (!ch) {
      page.append(html(`
        <div class="ch-missing shell">
          <h1>Chapter not found</h1>
          <p><a href="#/study">Back to the founding story →</a></p>
        </div>`));
      return page;
    }

    const prev = prevChapter(ch.id);
    const next = nextChapter(ch.id);
    const pos = chapterPosition(ch.id);

    /* The first screen: hero, timeline, then slideshow beside the quiz. */
    const top = el('div', 'ch-top');
    top.append(html(hero(ch)));
    top.append(renderTimeline(ch.id));
    top.append(html(`
      <div class="ch-focus shell">
        <div class="ch-focus__main">
          ${ch.bigPicture ? `
            <div class="ch-lede">
              <h2 class="ch-lede__head">${esc(ch.bigPicture.heading)}</h2>
              <p class="ch-lede__body">${prose(ch.bigPicture.body)}</p>
            </div>` : ''}
          ${gallery(ch)}
        </div>
        <aside class="ch-focus__rail">
          ${takeaways(ch)}
          ${factCard(ch)}
        </aside>
      </div>`));
    page.append(top);


    if (ch.closerLook) page.append(html(`<div class="shell">${closerLook(ch)}</div>`));

    page.append(html(`
      <div class="ch-cards shell">
        ${whyItMatters(ch)}
        ${whatsNext(ch)}
        ${quiz(ch)}
      </div>`));

    page.append(html(`
      <nav class="ch-pager shell" aria-label="Chapter navigation">
        <a class="ch-pager__back" href="${prev ? `#/study/${prev.id}` : '#/study'}">
          ← ${prev ? esc(prev.short) : 'Back to the story'}
        </a>
        <ol class="ch-pager__dots">
          ${CHAPTERS.map((c, i) => `
            <li><a class="ch-pager__dot" href="#/study/${c.id}"
                   ${i === pos - 1 ? 'aria-current="page"' : ''}
                   aria-label="${esc(c.short)}"></a></li>`).join('')}
        </ol>
        ${next
          ? `<a class="ch-pager__next" href="#/study/${next.id}">Next: ${esc(next.short)} →</a>`
          : '<a class="ch-pager__next" href="#/course">Next: Course Map →</a>'}
      </nav>`));

    // Stamp each question with its answer so the grader reads it from the DOM.
    (ch.quiz || []).forEach((q, n) => {
      const card = page.querySelector(`.ch-q[data-q="${n}"]`);
      if (card) card.dataset.answer = String(q.answer);
    });

    wireGallery(page);
    wireCloser(page);
    wireFacts(page);
    wireQuiz(page);
    return page;
  },
};
