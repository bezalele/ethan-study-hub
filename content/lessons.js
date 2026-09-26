/* ---------------------------------------------------------------------------
   lessons.js — the study lessons that sit under each unit on the Course page.

   Two things live here:

     LESSON_INDEX   the cards under "What Unit 1 covers" — a picture, a title
                    and one short sentence. Nothing else: the card is a door,
                    not a summary.

     LESSONS        the lessons themselves, keyed unit → slug.

   Every lesson has the same eight parts, in this order:

     question   the one thing the lesson answers
     intro      two sentences, no more
     chart      the single strong visual
     highlights three to five points, each a heading and one line
     realLife   one concrete example from his own life
     fact       one, and only where it genuinely helps him remember
     exercises  three to five questions, answered in one click

   The order is the argument: look, then read, then check. A student should
   get the idea from the headings, the pictures and the chart before reading
   a full sentence. Anything that needed a second click to reveal itself has
   been unfolded and left open.

   Image credits travel with the image in `credit`; the full provenance is in
   content/SOURCES.md. Every image is a file in this repository.
   --------------------------------------------------------------------------- */

/* --- What Unit 1 covers ---------------------------------------------------- */

export const LESSON_INDEX = {
  1: [
    {
      slug: 'why-democracy',
      n: 1,
      title: 'Why Democracy?',
      blurb: 'Why govern by consent at all.',
      ap: 'AP 1.1',
      image: 'assets/chapters/colonies/house-of-burgesses.jpg',
      alt: 'The House of Burgesses in session in colonial Virginia',
      ready: false,
    },
    {
      slug: 'who-should-have-power',
      n: 2,
      title: 'Who Should Have Power?',
      blurb: 'Rights, consent, and the right to start over.',
      ap: 'AP 1.2–1.3',
      image: 'assets/chapters/declaration/presentation-to-congress.jpg',
      alt: 'The drafting committee presenting the Declaration of Independence to Congress',
      ready: false,
    },
    {
      slug: 'building-a-new-government',
      n: 3,
      title: 'Building a New Government',
      blurb: 'The first try, and why it failed.',
      ap: 'AP 1.4–1.5',
      image: 'assets/chapters/articles/hero-confederation-congress.jpg',
      alt: 'The Confederation Congress meeting in session',
      ready: false,
    },
    {
      slug: 'dividing-power',
      n: 4,
      title: 'How the Constitution Divides Power',
      blurb: 'Three branches that can stop each other.',
      ap: 'AP 1.6',
      image: 'assets/chapters/convention/signing-constitution.jpg',
      alt: 'The signing of the Constitution at the Philadelphia convention',
      ready: false,
    },
    {
      slug: 'federalism',
      n: 5,
      title: 'Federalism — Federal, State, or Both?',
      blurb: 'Who decides: Washington, your state, or both.',
      ap: 'AP 1.7–1.9',
      image: 'assets/course-map/federalism/capitol.jpg',
      alt: 'The United States Capitol seen from the West Front',
      ready: true,
    },
  ],
};

/* --- Federalism ------------------------------------------------------------ */

const FEDERALISM = {
  slug: 'federalism',
  unit: 1,
  n: 5,
  title: 'Federalism — Federal, State, or Both?',
  ap: 'AP 1.7–1.9',

  question: 'Who gets to decide — federal, state, or both?',
  intro: [
    'The United States has two levels of government, and the Constitution splits the job between them.',
    'Some decisions belong to Washington, some belong to your state, and some are made by both.',
  ],

  /* The one strong visual. Everything is on it from the first look - no
     clicking to find out what an example means. Two real buildings, one of
     them forty minutes from home, so "the state" is a place he has been. */
  chart: {
    caption: 'Three kinds of power. Everything the lesson is about is on this chart.',
    columns: [
      {
        key: 'federal',
        label: 'Federal',
        kind: 'Only Washington',
        image: 'assets/course-map/federalism/capitol.jpg',
        alt: 'The United States Capitol, where Congress meets',
        credit: 'U.S. Capitol · public domain',
        items: [
          { title: 'Coin money', note: 'One dollar, every state.' },
          { title: 'Declare war', note: 'No governor can do this.' },
        ],
      },
      {
        key: 'state',
        label: 'State',
        kind: 'Only your state',
        image: 'assets/course-map/federalism/maryland-state-house.jpg',
        alt: 'The Maryland State House in Annapolis, where the state legislature meets',
        credit: 'Maryland State House, Annapolis · CC0',
        items: [
          { title: 'Schools', note: 'Your school day is decided here.' },
          { title: 'Local government', note: 'Counties and towns.' },
          { title: 'State and local elections', note: 'States run the voting.' },
        ],
      },
      {
        key: 'both',
        label: 'Both',
        kind: 'Each one, separately',
        image: 'assets/course-map/federalism/both.jpg',
        alt: 'The United States Capitol and the Maryland State House, side by side',
        credit: 'Capitol and Maryland State House · public domain / CC0',
        items: [
          { title: 'Taxes', note: 'Both take a share.' },
          { title: 'Courts', note: 'Two separate court systems.' },
        ],
      },
    ],
  },

  /* Three to five points. Each one is a heading you can read on its own and
     a single line underneath. The reserved-powers point carries a small
     three-step strip, because that idea is easier seen than read. */
  highlights: [
    {
      title: 'Federal powers are written down',
      body: 'The Constitution lists what the national government may do. That list is where federal power comes from.',
    },
    {
      title: 'State powers are what is left over',
      body: 'Anything the Constitution does not hand to Washington stays with the states. These are called reserved powers.',
      steps: ['Given to the federal government', 'Not given to anyone', 'Left to the states'],
    },
    {
      title: 'The Tenth Amendment says so',
      body: 'It is the line in the Constitution that leaves the remaining powers to the states, or to the people.',
    },
    {
      title: 'Some powers belong to both',
      body: 'Taxing and running courts are done by each level for itself. These are called concurrent powers.',
    },
    {
      title: 'The Supreme Court settles arguments',
      body: 'When the two levels disagree about who decides, the Court draws the line.',
    },
  ],

  realLife: {
    title: 'One day, two governments',
    body: 'The dollar in your pocket was made by the federal government. The school you spend the day in was set up by Maryland. Neither one could do the other’s job.',
    image: 'assets/course-map/federalism/both.jpg',
    alt: 'The United States Capitol and the Maryland State House, side by side',
    /* Short here on purpose: the same picture is credited in full on the
       chart above, and again in content/SOURCES.md. */
    credit: 'Capitol · Maryland State House',
  },

  fact: 'The Tenth Amendment is only 28 words long. The whole idea of reserved powers fits in one sentence.',

  /* One click each, feedback straight away. The first three are the sorting
     the chart teaches; the last two check that the words stuck. */
  exercises: [
    {
      question: 'Who decides what your school teaches?',
      options: ['Federal', 'State', 'Both'],
      answer: 1,
      why: 'Schools are a state power. The Constitution never mentions schools, so it stays with the states.',
    },
    {
      question: 'Who can print United States dollars?',
      options: ['Federal', 'State', 'Both'],
      answer: 0,
      why: 'Coining money is on the federal list. That is why a dollar works the same in every state.',
    },
    {
      question: 'Who collects taxes?',
      options: ['Federal', 'State', 'Both'],
      answer: 2,
      why: 'Both do. The federal government taxes, and so does your state — two governments, one paycheck.',
    },
    {
      question: 'What are reserved powers?',
      options: [
        'Powers the Constitution gives to Washington',
        'Powers left to the states because they were not given away',
        'Powers no government is allowed to use',
      ],
      answer: 1,
      why: 'Reserved powers are the leftovers. Whatever the Constitution did not hand to the federal government stays with the states.',
    },
    {
      question: 'Which amendment leaves the remaining powers to the states?',
      options: ['First Amendment', 'Fifth Amendment', 'Tenth Amendment'],
      answer: 2,
      why: 'The Tenth — all 28 words of it.',
    },
  ],
};

export const LESSONS = {
  1: { federalism: FEDERALISM },
};

/** The lesson at unit/slug, or null. Null means: this is not a lesson route. */
export function getLesson(unit, slug) {
  const forUnit = LESSONS[Number(unit)];
  return (forUnit && forUnit[slug]) || null;
}

/** The cards under a unit, or an empty list for units not yet written. */
export function lessonsFor(unit) {
  return LESSON_INDEX[Number(unit)] || [];
}
