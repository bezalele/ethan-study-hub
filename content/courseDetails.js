/* ---------------------------------------------------------------------------
   courseDetails.js — the Course page's per-unit summary content.

   Scope: the Course Map (#/course) only. See
   docs/COURSE_PAGE_IMPLEMENTATION_SPEC.md section 7.

   This is the content layer. pages/course-map.js renders the same component
   structure for all five units, so course material can be revised here
   without touching the UI.

   ===========================================================================
   STATUS
   ===========================================================================
   Unit 1 is complete (Checkpoint B). Units 2–5 are empty and render neutral
   labelled placeholders until Checkpoint C.

   Fields per unit (all optional):

     hook          One line. The human question the unit answers.
     summary       2–3 plain-English sentences.
     bigQuestion   One sentence. The question the unit is trying to answer.
     model         The interactive centrepiece. `type: 'documents'` renders a
                   sequence the student clicks through:
                     { type, intro, nodes: [{ id, step, label, thumb, image,
                       alt, credit, did, next }] }
                   `did`  — what this document actually did.
                   `next` — why the following step became necessary. Omit on
                            the last node.
     coreIdeas     [{ title, note }] — 4 to 6 orientation items.
     remember      [string] — exactly 3 statements.
     quickCheck    { question, options: [string], answer: <index>, why }
     fullGuideRoute  A route such as '#/course/unit/1', or null. When null the
                   renderer shows a non-clickable "next phase" note rather
                   than a dead link.

   The unit number, official title and exam weighting are not repeated here —
   they come from content/course.js, which stays the single source for them.

   Images are reused from assets/chapters/ rather than copied. Stage images
   are the 1448px versions; the thumbnails are the smaller document crops,
   which are the right size for a 64px step button.
   --------------------------------------------------------------------------- */

const EMPTY = {
  hook: null,
  summary: null,
  bigQuestion: null,
  model: null,
  coreIdeas: [],
  remember: [],
  quickCheck: null,
  fullGuideRoute: null,
};

/** Keyed by unit number, matching content/course.js. */
export const COURSE_DETAILS = {
  1: {
    hook: 'How do you build a government strong enough to work, but limited enough to protect freedom?',
    summary:
      'The United States did not begin with the Constitution. Americans declared independence, tried a weak national government under the Articles of Confederation, then redesigned the system around divided and limited power.',
    bigQuestion: 'Why was American government designed this way?',

    model: {
      type: 'documents',
      intro: 'Four documents, in order. Click one to see what it did — and why the next one followed.',
      nodes: [
        {
          id: 'declaration',
          step: '1776',
          label: 'Declaration',
          thumb: 'assets/chapters/declaration/declaration-document.jpg',
          image: 'assets/chapters/declaration/closer/the-engrossed-copy.jpg',
          alt: 'The engrossed Declaration of Independence on a desk with a quill and seal',
          credit: 'Declaration of Independence, 1776',
          did:
            'Explains why the colonies claimed independence, and states the political ideals behind the claim: people have rights, and government gets its authority from the consent of the governed.',
          next:
            'It justified the break, but it never said how thirteen states would govern together. That problem came next.',
        },
        {
          id: 'articles',
          step: '1781',
          label: 'Articles',
          thumb: 'assets/chapters/articles/articles-document.jpg',
          image: 'assets/chapters/articles/closer/what-it-could-not-do.jpg',
          alt: 'The Articles of Confederation beside notes on unpaid debts and missing national powers',
          credit: 'Articles of Confederation, in force 1781–1789',
          did:
            'The first national governing framework. It deliberately kept the central government limited: Congress could not tax directly or regulate commerce between the states, and there was no separate executive or national court system.',
          next:
            'Those limits were the point — but they also left the national government unable to pay debts, settle trade disputes, or respond to unrest.',
        },
        {
          id: 'constitution',
          step: '1787',
          label: 'Constitution',
          thumb: 'assets/chapters/constitution-rights/constitution.jpg',
          image: 'assets/chapters/convention/closer/we-the-people.jpg',
          alt: 'The opening of the Constitution — “We the People” and Article I — beside the flag',
          credit: 'U.S. Constitution, signed 1787',
          did:
            'Creates a stronger national government, then divides and limits its power: authority is split among three branches and shared between the national government and the states, so no single institution holds it all.',
          next:
            'Critics answered that structure alone was not enough. They wanted specific protections written down.',
        },
        {
          id: 'bill-of-rights',
          step: '1791',
          label: 'Bill of Rights',
          thumb: 'assets/chapters/constitution-rights/closer/bill-of-rights.jpg',
          image: 'assets/chapters/constitution-rights/closer/bill-of-rights.jpg',
          alt: 'The Bill of Rights, the first ten amendments, laid out with all ten legible',
          credit: 'Bill of Rights, ratified 1791',
          did:
            'The first ten amendments, added to protect specific liberties and answer concerns about federal power. The Tenth Amendment also reserves undelegated powers to the states and the people.',
        },
      ],
    },

    coreIdeas: [
      { title: 'Ideals of democracy', note: 'The values the founding claims to rest on.' },
      { title: 'Popular sovereignty', note: 'Authority comes from the people and their consent.' },
      { title: 'Limited government', note: 'Power is bounded by law, not unlimited.' },
      { title: 'Separation of powers', note: 'Different branches are given different jobs.' },
      { title: 'Checks and balances', note: 'Each branch can restrain the others.' },
      { title: 'Federalism', note: 'Authority is divided between nation and states.' },
    ],

    remember: [
      'Independence created a new problem: the states now needed a workable national government.',
      'The Articles showed the costs of a national government with very limited power.',
      'The Constitution strengthened national authority while dividing power to prevent concentration.',
    ],

    quickCheck: {
      question: 'Why did the Constitution create separate branches with different powers?',
      options: [
        'To make the federal government act more quickly',
        'To divide power so no single institution controls all major national powers',
        'To give the states authority over federal law',
        'To replace the need for elections',
      ],
      answer: 1,
      why:
        'Dividing power among branches — and between the nation and the states — makes concentrated control harder. Speed was not the goal; restraint was.',
    },

    fullGuideRoute: null,
  },

  2: { ...EMPTY },
  3: { ...EMPTY },
  4: { ...EMPTY },
  5: { ...EMPTY },
};

/** Detail for a unit. Always returns an object, never undefined. */
export function getDetail(n) {
  return COURSE_DETAILS[Number(n)] || { ...EMPTY };
}
