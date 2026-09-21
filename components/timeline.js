/* ---------------------------------------------------------------------------
   timeline.js — the five-chapter chronological strip.

   Shared by the home page and every chapter page, so it lives in components/
   rather than in either page. Its CSS is scoped to .c-timeline for the same
   reason: a page stylesheet may not reach it, and it may not reach a page.

   activeId highlights one chapter (chapter pages); pass nothing for no
   highlight (home).
   --------------------------------------------------------------------------- */

import { CHAPTERS } from '../content/chapters.js?v=9';
import { html, esc } from '../layout/dom.js?v=9';

export function renderTimeline(activeId) {
  const node = '<li class="c-timeline__node" aria-hidden="true"></li>';

  const items = CHAPTERS.map((c) => {
    const isActive = c.id === activeId;
    return `
      <li class="c-timeline__item">
        <a class="c-timeline__card" href="#/study/${c.id}"
           ${isActive ? 'aria-current="page"' : ''}>
          <img class="c-timeline__thumb" src="${c.image.src}" alt="" loading="lazy">
          <span class="c-timeline__text">
            <span class="c-timeline__year">${esc(c.years)}</span>
            <span class="c-timeline__title">${esc(c.short || c.title)}</span>
          </span>
        </a>
      </li>`;
  }).join(node);

  return html(`
    <nav class="c-timeline" aria-label="The founding story">
      <ol class="c-timeline__list shell">${node}${items}${node}</ol>
    </nav>`);
}
