/* ---------------------------------------------------------------------------
   course-map.js — the five AP course areas.

   The old version locked body scroll (`body.no-scroll`) to force the whole
   explorer into one viewport, which clipped the panel and overlapped the
   heading with its own body text. This version simply scrolls.
   --------------------------------------------------------------------------- */

import { AREAS, getArea } from '../content/course.js';
import { el, html, esc } from '../layout/dom.js';

function hero() {
  return html(`
    <section class="cm-hero">
      <div class="cm-hero__inner shell">
        <div>
          <p class="eyebrow eyebrow--on-dark">AP U.S. Government &amp; Politics · Course map</p>
          <h1 class="cm-hero__title">Five areas.<br>One connected course.</h1>
        </div>
        <p class="cm-hero__note">
          See the whole course first. Pick an area to read what it is really
          about, then open the full study guide.
        </p>
      </div>
    </section>`);
}

function rail(selected) {
  const items = AREAS.map((a) => `
    <li>
      <a class="cm-rail__item" href="#/course/${a.n}"
         ${a.n === selected ? 'aria-current="true"' : ''}>
        <span class="cm-rail__n">0${a.n}</span>
        <span class="cm-rail__text">
          <small class="cm-rail__weight">Unit ${a.n} · ${esc(a.weight)}</small>
          <strong class="cm-rail__short">${esc(a.short)}</strong>
          <span class="cm-rail__title">${esc(a.title)}</span>
        </span>
        <span class="cm-rail__chev" aria-hidden="true">›</span>
      </a>
    </li>`).join('');

  return `
    <nav class="cm-rail" aria-label="Course areas">
      <p class="eyebrow">The course · five areas</p>
      <ol class="cm-rail__list">${items}</ol>
    </nav>`;
}

function panel(area) {
  const chain = area.chain
    .map((step) => `<li class="cm-chain__step">${esc(step)}</li>`)
    .join('<li class="cm-chain__arrow" aria-hidden="true">→</li>');

  const topics = area.topics.map((t, i) => `
    <li>
      <a class="cm-topic" href="#/study">
        <span class="cm-topic__n">0${i + 1}</span>
        <span class="cm-topic__label">${esc(t)}</span>
        <span class="cm-topic__chev" aria-hidden="true">→</span>
      </a>
    </li>`).join('');

  return `
    <article class="cm-panel">
      <header class="cm-panel__head">
        <p class="cm-panel__kicker">Unit 0${area.n} · before you study</p>
        <h2 class="cm-panel__title">${esc(area.title)}</h2>
        <p class="cm-panel__why">${esc(area.why)}</p>
      </header>

      <div class="cm-panel__body">
        <section class="cm-about">
          <div>
            <p class="eyebrow">What this area is really about</p>
            <p class="cm-about__know">${esc(area.know)}</p>
          </div>
          <aside class="cm-about__aside">
            <p class="eyebrow">Why it matters</p>
            <p>${esc(area.matters)}</p>
          </aside>
        </section>

        <section class="cm-idea">
          <p class="eyebrow">See the idea</p>
          <ol class="cm-chain">${chain}</ol>
        </section>

        <section class="cm-next">
          <div class="cm-next__topics">
            <p class="eyebrow">What you will learn</p>
            <ol class="cm-topics">${topics}</ol>
          </div>
          <aside class="cm-next__cta">
            <p class="eyebrow">Ready to go deeper?</p>
            <p class="cm-next__text">
              The study guide breaks this area into short explanations,
              visuals, examples, and practice.
            </p>
            <a class="btn btn--primary" href="#/study">Open the ${esc(area.short)} study guide →</a>
            <p class="cm-next__lens"><strong>Study lens:</strong> ${esc(area.lens)}</p>
          </aside>
        </section>
      </div>
    </article>`;
}

export default {
  id: 'course-map',
  nav: 'course',
  title: (params) => {
    const area = getArea(params.unit);
    return area ? `${area.short} · Course Map` : 'Course Map';
  },
  render(params) {
    // Unknown or missing unit falls back to the first area rather than blank.
    const area = getArea(params.unit) || AREAS[0];
    const page = el('div', 'page page--course-map');
    page.append(hero());
    page.append(html(`
      <div class="cm-explorer shell">
        ${rail(area.n)}
        ${panel(area)}
      </div>`));
    return page;
  },
};
