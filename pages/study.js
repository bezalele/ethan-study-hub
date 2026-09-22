/* ---------------------------------------------------------------------------
   study.js — the founding story.

   Two views off one module, chosen by route params:
     #/study                 chapter index
     #/study/documents       reference shelf   (params.view === 'documents')

   An individual chapter is its own page module, pages/chapter.js, because it
   carries the full standard chapter template.
   --------------------------------------------------------------------------- */

import { CHAPTERS } from '../content/chapters.js?v=12';
import { el, html, esc } from '../layout/dom.js?v=12';

/* --- Reference shelf ------------------------------------------------------ */

const DOCUMENTS = [
  {
    unit: 'Foundations',
    note: 'Documents that explain the founding',
    items: [
      ['Declaration of Independence', 'The colonies state why they are separating, and on what principle.'],
      ['U.S. Constitution', 'The framework: separated powers, federalism, and amendment.'],
      ['Federalist No. 10', 'Factions and the argument for a large republic.'],
      ['Brutus No. 1', 'An Anti-Federalist warning about national power.'],
      ['Federalist No. 51', 'Separation of powers and checks and balances.'],
      ['McCulloch v. Maryland', 'Federal power, implied powers, and national supremacy.'],
    ],
  },
  {
    unit: 'Branches & Power',
    note: 'Institutions and checks',
    items: [
      ['Federalist No. 70', 'The argument for an energetic executive.'],
      ['Federalist No. 78', 'The role and independence of the judiciary.'],
      ['Marbury v. Madison', 'Judicial review.'],
    ],
  },
  {
    unit: 'Liberties & Rights',
    note: 'Rights applied to real disputes',
    items: [
      ['Brown v. Board of Education', 'Equal protection and public-school segregation.'],
      ['Tinker v. Des Moines', 'Student speech under the First Amendment.'],
    ],
  },
  {
    unit: 'Participation',
    note: 'Elections, groups, campaigns and media',
    items: [
      ['Citizens United v. FEC', 'Political spending and First Amendment protections.'],
    ],
  },
];

function documentsView() {
  const shelves = DOCUMENTS.map((shelf) => `
    <section class="st-shelf">
      <header class="st-shelf__head">
        <h2 class="st-shelf__title">${esc(shelf.unit)}</h2>
        <p class="st-shelf__note">${esc(shelf.note)}</p>
      </header>
      <ul class="st-shelf__list">
        ${shelf.items.map(([name, note]) => `
          <li class="st-doc">
            <strong class="st-doc__name">${esc(name)}</strong>
            <span class="st-doc__note">${esc(note)}</span>
          </li>`).join('')}
      </ul>
    </section>`).join('');

  return html(`
    <div>
      <section class="st-banner">
        <div class="st-banner__inner shell">
          <p class="eyebrow eyebrow--on-dark">Documents &amp; cases</p>
          <h1>Evidence behind the story.</h1>
          <p class="st-banner__deck">
            A reference shelf, not another course. Learn the idea in a chapter
            first, then come here to examine what it rests on.
          </p>
        </div>
      </section>
      <div class="st-shelves shell">${shelves}</div>
    </div>`);
}

/* --- Chapter index -------------------------------------------------------- */

function indexView() {
  const rows = CHAPTERS.map((c) => `
    <li>
      <a class="st-row" href="#/study/${c.id}">
        <img class="st-row__thumb" src="${c.image.src}" alt="" loading="lazy">
        <span class="st-row__text">
          <small class="st-row__meta">Chapter ${c.n} · ${esc(c.years)}</small>
          <strong class="st-row__title">${esc(c.title)}</strong>
          <span class="st-row__summary">${esc(c.summary)}</span>
        </span>
        <span class="st-row__chev" aria-hidden="true">→</span>
      </a>
    </li>`).join('');

  return html(`
    <div>
      <section class="st-banner">
        <div class="st-banner__inner shell">
          <p class="eyebrow eyebrow--on-dark">Unit 1 · the founding story</p>
          <h1>Five chapters. One argument.</h1>
          <p class="st-banner__deck">
            Each chapter answers one question. Read them in order and the
            Constitution stops being a list of rules and starts being a
            solution to a problem.
          </p>
        </div>
      </section>
      <div class="st-index shell">
        <ol class="st-rows">${rows}</ol>
        <aside class="st-aside">
          <p class="eyebrow">Also here</p>
          <a class="btn btn--ghost" href="#/study/documents">Documents &amp; cases →</a>
          <a class="btn btn--ghost" href="#/study/practice">Practice questions →</a>
        </aside>
      </div>
    </div>`);
}

/* --- Module --------------------------------------------------------------- */

export default {
  id: 'study',
  nav: 'study',
  title: (params) => (params.view === 'documents' ? 'Documents & Cases' : 'Study'),
  render(params) {
    const page = el('div', 'page page--study');

    if (params.view === 'documents') {
      page.append(documentsView());
      return page;
    }

    page.append(indexView());
    return page;
  },
};
