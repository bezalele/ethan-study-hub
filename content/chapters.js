/* ---------------------------------------------------------------------------
   chapters.js — the five founding-story chapters.

   One source of truth, consumed by the home page journey rail and by the
   study page. Adding a chapter here adds it in both places; there is no
   second list to keep in sync.
   --------------------------------------------------------------------------- */

import { CHAPTER_IMAGES } from './assets.js';

export const CHAPTERS = [
  {
    id: 'colonies',
    n: '01',
    years: '1607–1775',
    title: 'British Colonies',
    tagline: 'Foundations and frustrations',
    summary:
      'Long before independence, colonists were already governing themselves — electing assemblies, debating taxes, and arguing about who had the right to decide.',
    question: 'If you already govern yourselves in practice, who really holds authority?',
  },
  {
    id: 'declaration',
    n: '02',
    years: '1776',
    title: 'Declaration of Independence',
    tagline: 'A new nation',
    summary:
      'The colonies turned a political dispute into a principle: governments derive their just powers from the consent of the governed, and a people may replace one that does not.',
    question: 'What makes a government legitimate in the first place?',
  },
  {
    id: 'articles',
    n: '03',
    years: '1781–1789',
    title: 'Articles of Confederation',
    tagline: 'A government in practice',
    summary:
      'America’s first national framework was deliberately weak — and its weakness revealed exactly which powers a working government cannot do without.',
    question: 'How much power is too little?',
  },
  {
    id: 'convention',
    n: '04',
    years: '1787',
    title: 'Constitutional Convention',
    tagline: 'Designing a better system',
    summary:
      'Delegates in Philadelphia rebuilt the government around a hard trade-off: enough power to govern, divided enough that no one part could dominate.',
    question: 'How do you divide power so it still works?',
  },
  {
    id: 'constitution-rights',
    n: '05',
    years: '1788–1791',
    title: 'Constitution + Bill of Rights',
    tagline: 'Rights, balance, and a lasting union',
    summary:
      'Ratification came with a promise. The first ten amendments wrote specific protections for individual liberty directly into the constitutional settlement.',
    question: 'How is liberty protected once the government is strong?',
  },
].map((c) => ({ ...c, image: CHAPTER_IMAGES[c.id] }));

/** Look up a chapter by id. Returns undefined for an unknown id. */
export function getChapter(id) {
  return CHAPTERS.find((c) => c.id === id);
}

/** The chapter after `id`, or null at the end of the story. */
export function nextChapter(id) {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null;
}

/** The chapter before `id`, or null at the start. */
export function prevChapter(id) {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return i > 0 ? CHAPTERS[i - 1] : null;
}
