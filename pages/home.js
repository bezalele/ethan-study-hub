/* ---------------------------------------------------------------------------
   home.js — the landing page.

   Laid out to fill one viewport with no scrollbar, matching the approved
   model: hero / timeline / three cards / closing band. See home.css for how
   the four bands are sized.

   Page module contract:
     id     unique name, matches the CSS root class .page--<id>
     nav    which nav item gets aria-current while this page is shown
     title  document title fragment
     render (params) -> HTMLElement
   --------------------------------------------------------------------------- */

import { IMAGES } from '../content/assets.js';
import { CHAPTERS } from '../content/chapters.js';
import { el, html, esc } from '../layout/dom.js';

function hero() {
  return html(`
    <section class="home-hero">
      <img class="home-hero__bg" src="${IMAGES.heroSigning.src}" alt="${IMAGES.heroSigning.alt}" fetchpriority="high">
      <div class="home-hero__scrim"></div>
      <div class="home-hero__inner shell">
        <div class="home-hero__copy">
          <p class="eyebrow eyebrow--on-dark">People. Ideas. A more perfect union.</p>
          <h1 class="home-hero__title">The story of<br>America.</h1>
          <p class="home-hero__deck">
            Explore how a group of colonies became a nation — and what their
            story teaches us about government, freedom, and our
            responsibilities today.
          </p>
          <blockquote class="home-hero__quote">
            “The experiment, sir, is not over.”
            <cite>— Benjamin Franklin, 1787</cite>
          </blockquote>
        </div>
        <blockquote class="home-hero__quote home-hero__quote--aside">
          “We hold these truths to be self-evident, that all men are created equal…”
          <cite>— Declaration of Independence, 1776</cite>
        </blockquote>
      </div>
    </section>`);
}

/* The timeline reads as one continuous line: a connector node sits before the
   first chapter, between each pair, and after the last. Year and title only —
   no ordinal, no tagline. */
function timeline() {
  const node = '<li class="home-tl__node" aria-hidden="true"></li>';

  const items = CHAPTERS.map((c) => `
    <li class="home-tl__item">
      <a class="home-tl__card" href="#/study/${c.id}">
        <img class="home-tl__thumb" src="${c.image.src}" alt="" loading="lazy">
        <span class="home-tl__text">
          <span class="home-tl__year">${esc(c.years)}</span>
          <span class="home-tl__title">${esc(c.title)}</span>
        </span>
      </a>
    </li>`).join(node);

  return html(`
    <nav class="home-tl" aria-label="The founding story">
      <ol class="home-tl__list shell">${node}${items}${node}</ol>
    </nav>`);
}

function cards() {
  return html(`
    <section class="home-cards shell">
      <article class="home-card home-card--story">
        <div class="home-card__body">
          <p class="eyebrow">Start with the story</p>
          <h2>History first.<br>AP Government<br>underneath.</h2>
          <p class="home-card__text">
            Understand what happened, why it mattered, and how it connects to
            the government we have today.
          </p>
          <a class="btn btn--primary" href="#/study">Begin the Journey →</a>
        </div>
        <img class="home-card__art" src="${IMAGES.soldier.src}" alt="" loading="lazy">
      </article>

      <article class="home-card home-card--question">
        <p class="eyebrow">The big question</p>
        <h2 class="home-card__question">
          How do you give government enough power to protect people — without
          giving it so much power that it threatens their liberty?
        </h2>
        <hr class="home-card__rule">
        <p class="eyebrow">Explore. Think. Discuss. Practice.</p>
        <p class="home-card__text">Built for Ethan — and any curious learner.</p>
      </article>

      <article class="home-card home-card--course">
        <div class="home-card__body">
          <p class="eyebrow">AP success</p>
          <h2>Need the full<br>course view?</h2>
          <p class="home-card__text">
            See all units, topics, and practice — connected to the historical story.
          </p>
          <a class="btn btn--ghost" href="#/course">Open Course Map →</a>
        </div>
        <img class="home-card__art" src="${IMAGES.capitol.src}" alt="" loading="lazy">
      </article>
    </section>`);
}

function closing() {
  return html(`
    <section class="home-closing">
      <div class="home-closing__inner shell">
        <blockquote class="home-closing__quote">
          “A well-instructed people alone can be permanently a free people.”
          <cite>— James Madison</cite>
        </blockquote>
        <p class="home-closing__tag">Past informs the future <span aria-hidden="true">———</span></p>
      </div>
    </section>`);
}

export default {
  id: 'home',
  nav: 'home',
  title: '',
  render() {
    const page = el('div', 'page page--home');
    page.append(hero(), timeline(), cards(), closing());
    return page;
  },
};
