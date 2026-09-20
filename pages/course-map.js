/* ---------------------------------------------------------------------------
   course-map.js — the five AP course areas. The main study page.

   Routes: #/course (defaults to Unit 1) and #/course/:unit

   Layout: a compact page header, then a two-column explorer that fills the
   rest of the viewport. The page itself never scrolls; the summary panel
   scrolls internally if a unit needs more room.

   Panel order is deliberate: the high-level idea first, then the one-line
   sequence, then the detail. Ethan should be able to say what a unit is about
   from the top of the panel alone.
   --------------------------------------------------------------------------- */

import { AREAS, getArea } from '../content/course.js?v=3';
import { el, html, esc } from '../layout/dom.js?v=3';

function header() {
  return `
    <header class="cm-head">
      <div class="cm-head__inner shell">
        <div>
          <p class="eyebrow eyebrow--on-dark">AP U.S. Government &amp; Politics · Course map</p>
          <h1 class="cm-head__title">Five areas. One connected course.</h1>
        </div>
        <p class="cm-head__note">
          Pick an area to see what it is really about, then open its study guide.
        </p>
      </div>
    </header>`;
}

function rail(selected) {
  const items = AREAS.map((a) => `
    <li>
      <a class="cm-unit" href="#/course/${a.n}"
         ${a.n === selected ? 'aria-current="page"' : ''}>
        <span class="cm-unit__n">0${a.n}</span>
        <span class="cm-unit__text">
          <span class="cm-unit__meta">Unit ${a.n} · ${esc(a.weight)}</span>
          <span class="cm-unit__name">${esc(a.short)}</span>
        </span>
        <span class="cm-unit__chev" aria-hidden="true">›</span>
      </a>
    </li>`).join('');

  return `
    <nav class="cm-rail" aria-label="Course areas">
      <p class="cm-rail__head">The course · five areas</p>
      <ol class="cm-rail__list">${items}</ol>
    </nav>`;
}

function panel(area) {
  const chain = area.chain
    .map((step) => `<li class="cm-chain__step">${esc(step)}</li>`)
    .join('<li class="cm-chain__arrow" aria-hidden="true">→</li>');

  const topics = area.topics.map((t, i) => `
    <li class="cm-topic">
      <span class="cm-topic__n">${String(i + 1).padStart(2, '0')}</span>
      <span class="cm-topic__label">${esc(t)}</span>
    </li>`).join('');

  const cta = area.detail
    ? `<a class="btn btn--primary" href="${esc(area.detail)}">Open the ${esc(area.short)} study guide →</a>`
    : `<p class="cm-soon">The full ${esc(area.short)} study guide is being written.
         Unit 1 is the one to start with.</p>
       <a class="btn btn--ghost" href="#/course/1">Go to Unit 1 →</a>`;

  return `
    <article class="cm-panel" id="cm-panel" tabindex="-1">
      <div class="cm-panel__scroll">

        <header class="cm-panel__head">
          <p class="cm-panel__kicker">Unit 0${area.n} · ${esc(area.weight)} of the exam</p>
          <h2 class="cm-panel__title">${esc(area.title)}</h2>
        </header>

        <p class="cm-lede">${esc(area.know)}</p>

        <div class="cm-points">
          <section class="cm-point">
            <h3 class="cm-point__head">The question it answers</h3>
            <p class="cm-point__body">${esc(area.question)}</p>
          </section>
          <section class="cm-point cm-point--why">
            <h3 class="cm-point__head">Why it matters</h3>
            <p class="cm-point__body">${esc(area.matters)}</p>
          </section>
        </div>

        <section class="cm-idea">
          <h3 class="cm-sub">See the idea</h3>
          <ol class="cm-chain">${chain}</ol>
        </section>

        <section class="cm-learn">
          <h3 class="cm-sub">What you will learn</h3>
          <ol class="cm-topics">${topics}</ol>
        </section>

        <footer class="cm-go">
          <p class="cm-go__lens"><strong>Study lens.</strong> ${esc(area.lens)}</p>
          ${cta}
        </footer>

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
    page.append(html(`
      <div class="cm-shell">
        ${header()}
        <div class="cm-explorer shell">
          ${rail(area.n)}
          ${panel(area)}
        </div>
      </div>`));
    return page;
  },
};
