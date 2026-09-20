/* ---------------------------------------------------------------------------
   home.js — the landing page.

   Page module contract:
     id     unique name, matches the CSS root class .page--<id>
     nav    which nav item gets aria-current while this page is shown
     title  document title fragment
     render (params) -> HTMLElement
   --------------------------------------------------------------------------- */

import { IMAGES } from '../content/assets.js';
import { CHAPTERS } from '../content/chapters.js';
import { el, html } from '../layout/dom.js';

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
          <div class="home-hero__actions">
            <a class="btn btn--on-dark" href="#/study">Start the Story</a>
            <a class="btn btn--outline-light" href="#/course">View Course Map</a>
          </div>
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

function journey() {
  const cards = CHAPTERS.map((c) => `
    <li class="home-journey__item">
      <a class="home-journey__card" href="#/study/${c.id}">
        <img class="home-journey__thumb" src="${c.image.src}" alt="" loading="lazy">
        <span class="home-journey__meta">
          <span class="home-journey__n">${c.n}</span>
          <span class="home-journey__years">${c.years}</span>
        </span>
        <strong class="home-journey__title">${c.title}</strong>
        <small class="home-journey__tagline">${c.tagline}</small>
      </a>
    </li>`).join('');

  return html(`
    <section class="home-journey">
      <div class="home-journey__inner shell">
        <div class="home-journey__lede">
          <p class="eyebrow">Explore the journey</p>
          <p>Five chapters. One big story. Open any chapter to dive in.</p>
        </div>
        <ol class="home-journey__list">${cards}</ol>
      </div>
    </section>`);
}

function cards() {
  return html(`
    <section class="home-cards shell">
      <article class="home-card home-card--story">
        <div class="home-card__body">
          <p class="eyebrow">Start with the story</p>
          <h2>History first.<br>AP Government underneath.</h2>
          <p class="home-card__text">
            Understand what happened, why it mattered, and how it connects to
            the government we have today.
          </p>
          <a class="btn btn--primary" href="#/study">Begin the Journey →</a>
        </div>
        <img class="home-card__art home-card__art--story"
             src="${IMAGES.soldier.src}" alt="" loading="lazy">
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
          <h2>Need the full course view?</h2>
          <p class="home-card__text">
            See all units, topics, and practice — connected to the historical story.
          </p>
          <a class="btn btn--ghost" href="#/course">Open Course Map →</a>
        </div>
        <img class="home-card__art home-card__art--course"
             src="${IMAGES.capitol.src}" alt="" loading="lazy">
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
        <p class="home-closing__tag">Past informs the future</p>
      </div>
    </section>`);
}

export default {
  id: 'home',
  nav: 'home',
  title: '',
  render() {
    const page = el('div', 'page page--home');
    page.append(hero(), journey(), cards(), closing());
    return page;
  },
};
