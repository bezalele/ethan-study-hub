/* ---------------------------------------------------------------------------
   chapter.js — the standard template for all five founding-story chapters.

   Route: #/study/:chapter

   Every block is driven by content/chapters.js and every block is optional:
   if a chapter has no `fact`, no Interesting Fact card is rendered; if it has
   no gallery, no carousel. That means content can be filled in one field at a
   time and the page is never broken or half-empty.

   Image slots that have no file yet render a designed placeholder rather than
   a broken image, so the layout is final before the art arrives.
   --------------------------------------------------------------------------- */

import {
  CHAPTERS, getChapter, nextChapter, prevChapter, chapterPosition,
} from '../content/chapters.js';
import { renderTimeline } from '../components/timeline.js';
import { el, html, esc } from '../layout/dom.js';

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

/* --- Hero ----------------------------------------------------------------- */

function hero(ch) {
  const pos = chapterPosition(ch.id);
  const actions = (ch.actions || []).map((a) => `
    <a class="btn ${a.primary ? 'btn--on-dark' : 'btn--outline-light'}"
       href="${esc(a.href || '#/study')}">${esc(a.label)}</a>`).join('');

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
          ${ch.intro ? `<p class="ch-hero__intro">${esc(ch.intro)}</p>` : ''}
          ${actions ? `<div class="ch-hero__actions">${actions}</div>` : ''}
        </div>
        ${ch.heroQuote ? `
          <blockquote class="ch-hero__quote">
            “${esc(ch.heroQuote.text)}”
            <cite>— ${esc(ch.heroQuote.source)}</cite>
          </blockquote>` : ''}
      </div>
    </section>`;
}

/* --- Gallery -------------------------------------------------------------- */

function gallery(ch) {
  const slides = ch.gallery || [];
  if (!slides.length) return '';

  const stage = slides.map((s, i) => `
    <figure class="ch-slide" data-slide="${i}" ${i ? 'hidden' : ''}>
      ${picture(s, s.label, 'ch-slide__img')}
      <figcaption class="ch-slide__cap">
        <strong>${esc(s.label)}</strong>
        <span>${esc(s.caption)}</span>
      </figcaption>
    </figure>`).join('');

  const thumbs = slides.map((s, i) => `
    <li>
      <button class="ch-thumb" type="button" data-goto="${i}"
              ${i === 0 ? 'aria-current="true"' : ''}>
        ${picture(s, s.label, 'ch-thumb__img')}
        <span class="ch-thumb__label">${esc(s.label)}</span>
      </button>
    </li>`).join('');

  const multi = slides.length > 1;

  return `
    <div class="ch-gallery" data-gallery data-count="${slides.length}">
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

/* --- Right rail ----------------------------------------------------------- */

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
  const f = ch.fact;
  if (!f) return '';

  // With no portrait file, draw a medallion from the subject's initials.
  const initials = (f.name || '?')
    .split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  const figure = f.portrait
    ? `<img class="ch-fact__portrait" src="${f.portrait}" alt="${esc(f.name || '')}" loading="lazy">`
    : `<span class="ch-fact__medallion" aria-hidden="true">${esc(initials)}</span>`;

  return `
    <section class="ch-card ch-card--fact">
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">💡</span> Interesting Fact</h2>
      <div class="ch-fact">
        <p class="ch-fact__text">${esc(f.text)}</p>
        ${(f.name || f.portrait) ? `
          <figure class="ch-fact__who">
            ${figure}
            <figcaption>
              <strong>${esc(f.name || '')}</strong>
              ${f.dates ? `<span>${esc(f.dates)}</span>` : ''}
            </figcaption>
          </figure>` : ''}
      </div>
    </section>`;
}

/* --- A closer look -------------------------------------------------------- */

function closerLook(ch) {
  const cl = ch.closerLook;
  if (!cl) return '';

  const sections = (cl.sections || []).map((s) => `
    <li>
      <a class="ch-section" href="#/study/documents">
        <strong>${esc(s.label)}</strong>
        <span>${esc(s.note)}</span>
        <i aria-hidden="true">›</i>
      </a>
    </li>`).join('');

  return `
    <section class="ch-closer">
      <div class="ch-closer__copy">
        <p class="eyebrow">A closer look</p>
        <h2>${esc(cl.title)}</h2>
        <p class="ch-closer__body">${esc(cl.body)}</p>
        <a class="btn btn--primary" href="#/study/documents">${esc(cl.cta || 'Read the documents')} →</a>
      </div>
      <div class="ch-closer__art">
        ${picture(cl.image, cl.title, 'ch-closer__img')}
      </div>
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

  const steps = (w.steps || []).map((s, i, arr) => `
    <li class="ch-flow__step">${esc(s)}</li>
    ${i < arr.length - 1 ? '<li class="ch-flow__arrow" aria-hidden="true">→</li>' : ''}`).join('');

  return `
    <section class="ch-card ch-card--matters">
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">🌎</span> Why It Matters</h2>
      <p class="ch-card__text">${esc(w.body)}</p>
      ${steps ? `<ol class="ch-flow">${steps}</ol>` : ''}
    </section>`;
}

function quickCheck(ch) {
  const q = ch.quickCheck;
  if (!q) return '';

  const options = q.options.map((o, i) => `
    <li>
      <label class="ch-opt">
        <input type="radio" name="ch-quick" value="${i}">
        <span class="ch-opt__marker" aria-hidden="true"></span>
        <span class="ch-opt__label">${esc(o)}</span>
      </label>
    </li>`).join('');

  return `
    <section class="ch-card ch-card--check" data-quickcheck data-answer="${q.answer}">
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">✅</span> Quick Check</h2>
      <p class="ch-check__q">${esc(q.question)}</p>
      <ol class="ch-opts">${options}</ol>
      <button class="btn btn--primary" type="button" data-check>Check answer</button>
      <p class="ch-check__result" data-result hidden></p>
      ${q.why ? `<p class="ch-check__why" data-why hidden>${esc(q.why)}</p>` : ''}
    </section>`;
}

function whatsNext(ch) {
  const next = nextChapter(ch.id);
  const body = ch.whatsNext && ch.whatsNext.body;

  return `
    <section class="ch-card ch-card--next">
      <h2 class="ch-card__head"><span class="ch-card__icon" aria-hidden="true">➡️</span> What’s Next?</h2>
      ${body ? `<p class="ch-card__text">${esc(body)}</p>` : ''}
      ${next ? `
        <a class="ch-next" href="#/study/${next.id}">
          <img class="ch-next__thumb" src="${next.image.src}" alt="" loading="lazy">
          <span>
            <small>Up next · ${esc(next.years)}</small>
            <strong>${esc(next.short)}</strong>
          </span>
        </a>
        <a class="btn btn--ghost" href="#/study/${next.id}">Continue the story →</a>`
      : `<a class="btn btn--ghost" href="#/study/practice">Practice what you read →</a>`}
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

function wireQuickCheck(root) {
  const card = root.querySelector('[data-quickcheck]');
  if (!card) return;

  const answer = Number(card.dataset.answer);
  const result = card.querySelector('[data-result]');
  const why = card.querySelector('[data-why]');

  card.querySelector('[data-check]').addEventListener('click', () => {
    const picked = card.querySelector('input[name="ch-quick"]:checked');
    if (!picked) {
      result.hidden = false;
      result.className = 'ch-check__result ch-check__result--none';
      result.textContent = 'Choose an answer first.';
      return;
    }
    const right = Number(picked.value) === answer;
    result.hidden = false;
    result.className = `ch-check__result ${right ? 'ch-check__result--right' : 'ch-check__result--wrong'}`;
    result.textContent = right ? 'Correct.' : 'Not quite — try again.';
    picked.closest('.ch-opt').classList.toggle('ch-opt--right', right);
    picked.closest('.ch-opt').classList.toggle('ch-opt--wrong', !right);
    if (why && right) why.hidden = false;
  });
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

    // Unknown chapter id: send the reader to the index rather than a blank page.
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

    page.append(html(hero(ch)));
    page.append(renderTimeline(ch.id));

    page.append(html(`
      <div class="ch-body shell">
        <div class="ch-main">
          ${ch.bigPicture ? `
            <section class="ch-big">
              <p class="eyebrow">The big picture</p>
              <h2 class="ch-big__head">${esc(ch.bigPicture.heading)}</h2>
              <p class="ch-big__body">${ch.bigPicture.body}</p>
            </section>` : ''}
          ${gallery(ch)}
        </div>
        <aside class="ch-rail">
          ${takeaways(ch)}
          ${factCard(ch)}
        </aside>
      </div>`));

    if (ch.closerLook) page.append(html(`<div class="shell">${closerLook(ch)}</div>`));

    page.append(html(`
      <div class="ch-cards shell">
        ${whyItMatters(ch)}
        ${quickCheck(ch)}
        ${whatsNext(ch)}
      </div>`));

    page.append(html(`
      <nav class="ch-pager shell" aria-label="Chapter navigation">
        <a class="ch-pager__back" href="#/study">← Back to the story</a>
        <ol class="ch-pager__dots">
          ${CHAPTERS.map((c, i) => `
            <li><a class="ch-pager__dot" href="#/study/${c.id}"
                   ${i === pos - 1 ? 'aria-current="page"' : ''}
                   aria-label="${esc(c.short)}"></a></li>`).join('')}
        </ol>
        ${next
          ? `<a class="ch-pager__next" href="#/study/${next.id}">Next: ${esc(next.short)} →</a>`
          : `<a class="ch-pager__next" href="#/course">Next: Course Map →</a>`}
      </nav>`));

    // Hidden but useful: keep prev reachable from the keyboard order.
    if (prev) {
      page.querySelector('.ch-pager__back').setAttribute('href', `#/study/${prev.id}`);
      page.querySelector('.ch-pager__back').textContent = `← ${prev.short}`;
    }

    wireGallery(page);
    wireQuickCheck(page);
    return page;
  },
};
