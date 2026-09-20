/* ---------------------------------------------------------------------------
   chapters.js — the five founding-story chapters.

   One source of truth. The home timeline, the shared timeline component and
   every chapter page read from here; there is no second list to keep in sync.

   ===========================================================================
   FILLING IN CONTENT
   ===========================================================================
   Every field below is optional except id, n, years, title and short. The
   chapter template renders only the blocks it has data for and silently skips
   the rest, so you can fill this in a piece at a time and the page stays
   correct at every step.

   See docs/CONTENT-GUIDE.md for the field-by-field brief, including target
   lengths — that file is written to be handed straight to an assistant.

   Fields, in the order they appear on the page:

     deck        one line under the title. A hook, not a summary.
     intro       2-3 sentences in the hero, under the deck.
     heroQuote   { text, source } — the pull quote on the right of the hero.
     actions     [{ label, href, primary? }] — hero buttons. Omit for none.

     bigPicture  { heading, body } — the opening section. `body` may contain
                 <strong> around key terms; nothing else.
     gallery     [{ src, alt, label, caption }] — the image carousel. One
                 entry is fine; the arrows and thumbnails appear from two up.
     takeaways   [string] — the numbered "Key Takeaways" list. Aim for five.
     fact        { text, name?, dates?, portrait? } — "Interesting Fact". With
                 no portrait image a lettered medallion is drawn instead.

     closerLook  { title, body, cta, image?, sections: [{ label, note }] }
     whyItMatters{ body, steps?: [string] } — steps render as a flow diagram.
     quickCheck  { question, options: [string], answer: <index>, why? }
     whatsNext   { body } — the next chapter is linked automatically.

   IMAGES
   Every image slot is optional and falls back to something designed rather
   than broken. To add art, drop the file in assets/ and reference it here.
   docs/CONTENT-GUIDE.md lists the slots with recommended dimensions.
   --------------------------------------------------------------------------- */

import { CHAPTER_IMAGES, IMAGES } from './assets.js';

/** Used as the chapter hero until a chapter supplies its own `hero`. */
const DEFAULT_HERO = IMAGES.heroSigning;

const DATA = [
  {
    id: 'colonies',
    n: '01',
    years: '1607–1775',
    short: 'British Colonies',
    title: 'The British Colonies',
    tagline: 'Foundations and frustrations',
    summary:
      'Long before independence, colonists were already governing themselves — electing assemblies, arguing about taxes, and deciding much of their daily life.',
    question: 'If you already govern yourselves in practice, who really holds authority?',

    deck: 'Self-government arrived long before independence.',
    intro:
      'For more than a century before 1776, the colonies elected their own assemblies and ran much of their own affairs. When Britain tightened control after 1763, it was interrupting a habit of self-rule that was already old.',
    heroQuote: {
      text: 'No taxation without representation.',
      source: 'Colonial slogan, 1760s',
    },

    bigPicture: {
      heading: 'Why did the colonies drift apart from Britain?',
      body:
        'The colonies were British possessions, but distance did its work. Colonial <strong>assemblies</strong> taxed and legislated locally for generations. After war debt pushed Parliament to tax the colonies directly, the dispute became less about money and more about <strong>who had the right to decide</strong>.',
    },
    takeaways: [
      'Colonial assemblies gave Americans long practice at representative self-government.',
      'Britain governed loosely for decades — a pattern later called salutary neglect.',
      'War debt after 1763 pushed Parliament to tax the colonies directly.',
      'Colonists objected that taxation required representation they did not have.',
      'By 1775 a constitutional argument had become an armed conflict.',
    ],
    fact: {
      text:
        'Virginia’s House of Burgesses first met in 1619 — more than 150 years before independence. Representative government in America is older than the United States.',
      name: 'House of Burgesses',
      dates: 'first met 1619',
    },
    closerLook: {
      title: 'The road to rupture',
      body:
        'Four moments turned a loose imperial relationship into a constitutional crisis. Each one raised the same question about consent.',
      cta: 'Read the documents',
      sections: [
        { label: 'Salutary neglect', note: 'Decades of loose control' },
        { label: 'Stamp Act', note: '1765 — direct taxation' },
        { label: 'Townshend & Tea', note: 'Escalation and boycott' },
        { label: 'Coercive Acts', note: '1774 — the breaking point' },
      ],
    },
    whyItMatters: {
      body:
        'The founders did not invent self-government in 1776. They were defending something they already had — which is why the Declaration reads as a list of things taken away.',
      steps: ['Local assemblies', 'New taxes', 'Protest', 'Armed conflict'],
    },
    quickCheck: {
      question: 'What was the colonists’ main constitutional objection to the Stamp Act?',
      options: [
        'The tax rate was higher than in Britain',
        'Parliament taxed them without their representation',
        'It applied only to the northern colonies',
        'It was imposed by the king rather than Parliament',
      ],
      answer: 1,
      why:
        'The objection was about consent, not cost: colonists argued that only a body in which they were represented could tax them.',
    },
    whatsNext: {
      body:
        'The argument over consent eventually produced a formal break — and a statement of the principles behind it.',
    },
  },

  {
    id: 'declaration',
    n: '02',
    years: '1776',
    short: 'Declaration of Independence',
    title: 'Declaration of Independence',
    tagline: 'A new nation',
    summary:
      'The colonies turned a political dispute into a principle: governments derive their just powers from the consent of the governed.',
    question: 'What makes a government legitimate in the first place?',

    deck: 'A bold statement. A new nation. A big question: now what?',
    intro:
      'On July 4, 1776, the thirteen colonies declared that they were no longer part of Britain. The Declaration of Independence explained why — and laid out powerful ideas about liberty, rights, and government.',
    heroQuote: {
      text: 'We hold these truths to be self-evident, that all men are created equal…',
      source: 'Declaration of Independence (1776)',
    },

    bigPicture: {
      heading: 'Why the Declaration?',
      body:
        'The colonies were frustrated with British rule — high taxes, limited representation, and <strong>increasing control</strong>. The <strong>Declaration of Independence</strong> was their formal statement to the world: they were leaving, and they were forming a new nation.',
    },
    takeaways: [
      'Explains why the colonies are separating from Britain.',
      'Introduces powerful ideas: natural rights, equality, and consent of the governed.',
      'Lists specific complaints against the king.',
      'Declares the colonies to be free and independent states.',
      'Serves as a statement of principles, not a detailed plan for government.',
    ],
    fact: {
      text:
        'Thomas Jefferson was the main author, but it was edited by others, including John Adams and Benjamin Franklin.',
      name: 'Thomas Jefferson',
      dates: '1743–1826',
    },
    closerLook: {
      title: 'The Document',
      body:
        'The Declaration has four main parts: a statement of principles, a list of complaints, a declaration of independence, and a statement of mutual support.',
      cta: 'Read & explore the document',
      sections: [
        { label: 'Preamble', note: 'The big idea' },
        { label: 'Grievances', note: 'List of complaints' },
        { label: 'Declaration', note: 'The break' },
        { label: 'Signatures', note: '56 signers' },
      ],
    },
    whyItMatters: {
      body:
        'The Declaration’s ideas — equality and natural rights — influenced other movements for freedom around the world.',
      steps: [
        'American Revolution (1776)',
        'French Revolution (1789)',
        'Independence movements (19th–20th c.)',
      ],
    },
    quickCheck: {
      question: 'What was the main purpose of the Declaration of Independence?',
      options: [
        'To create a plan for the new government',
        'To explain why the colonies were separating from Britain',
        'To establish the Bill of Rights',
        'To end slavery',
      ],
      answer: 1,
      why:
        'The Declaration justifies separation. The plan of government comes later, with the Articles and then the Constitution.',
    },
    whatsNext: {
      body:
        'The Declaration was just the beginning. Next, the new nation tried its first constitution — the Articles of Confederation.',
    },
  },

  {
    id: 'articles',
    n: '03',
    years: '1781–1789',
    short: 'Articles of Confederation',
    title: 'The Articles of Confederation',
    tagline: 'A government in practice',
    summary:
      'America’s first national framework was deliberately weak — and its weakness revealed exactly which powers a working government cannot do without.',
    question: 'How much power is too little?',

    deck: 'A government designed to be weak — and it was.',
    intro:
      'Having just fought a war against concentrated power, the states built a national government that could barely act. The Articles held the union together, but only just.',
    heroQuote: {
      text: 'A firm league of friendship…',
      source: 'Articles of Confederation, Article III',
    },

    bigPicture: {
      heading: 'What happens when government is too weak?',
      body:
        'Congress could declare war and make treaties, but it could not <strong>tax</strong>, could not <strong>regulate commerce</strong>, and could not enforce its own laws. Every state had <strong>one vote</strong>, and amendments required <strong>unanimous</strong> consent.',
    },
    takeaways: [
      'The Articles created a league of sovereign states, not a national government.',
      'Congress could not tax; it could only request money from the states.',
      'Congress could not regulate interstate or foreign commerce.',
      'There was no national executive and no national court system.',
      'Amending the Articles required all thirteen states to agree.',
    ],
    fact: {
      text:
        'Congress could ask the states for money but never compel it. Through the 1780s the states paid only a fraction of what Congress requested.',
      name: 'The Articles',
      dates: 'in force 1781–1789',
    },
    closerLook: {
      title: 'What the Articles could not do',
      body:
        'Each gap below became a specific power written into the Constitution a few years later.',
      cta: 'Read the documents',
      sections: [
        { label: 'No power to tax', note: 'Requests, not revenue' },
        { label: 'No commerce power', note: 'States set their own rules' },
        { label: 'No executive', note: 'Nobody to carry out law' },
        { label: 'Unanimous amendment', note: 'Any one state could block' },
      ],
    },
    whyItMatters: {
      body:
        'Nearly every major feature of the Constitution is an answer to a specific failure of the Articles.',
      steps: ['Weak centre', 'Debt & disorder', 'Calls for reform', 'Convention'],
    },
    quickCheck: {
      question: 'Which power did the national government lack under the Articles?',
      options: [
        'The power to declare war',
        'The power to make treaties',
        'The power to tax directly',
        'The power to run a postal service',
      ],
      answer: 2,
      why:
        'Congress could requisition money from the states but had no power to tax, which left it dependent and often unpaid.',
    },
    whatsNext: {
      body:
        'The weaknesses became impossible to ignore. Delegates gathered in Philadelphia to fix them — and wrote something new instead.',
    },
  },

  {
    id: 'convention',
    n: '04',
    years: '1787',
    short: 'Constitutional Convention',
    title: 'The Constitutional Convention',
    tagline: 'Designing a better system',
    summary:
      'Delegates in Philadelphia rebuilt the government around a hard trade-off: enough power to govern, divided enough that no one part could dominate.',
    question: 'How do you divide power so it still works?',

    deck: 'Fifty-five delegates. One hard trade-off.',
    intro:
      'Delegates met to revise the Articles and instead wrote a new framework. The core problem: build a government strong enough to govern, and divided enough that no part of it could take over.',
    heroQuote: {
      text: 'If men were angels, no government would be necessary.',
      source: 'James Madison, Federalist No. 51',
    },

    bigPicture: {
      heading: 'How do you divide power so it still works?',
      body:
        'The <strong>Great Compromise</strong> settled representation with a House based on population and a Senate with equal state votes. Power was split between <strong>branches</strong> and between <strong>levels of government</strong>, each able to check the others.',
    },
    takeaways: [
      'Delegates replaced the Articles rather than amending them.',
      'The Great Compromise created a bicameral Congress.',
      'The Three-Fifths Compromise settled representation by counting enslaved people as three-fifths.',
      'Separation of powers divides authority among three branches.',
      'Checks and balances let each branch restrain the others.',
    ],
    fact: {
      text:
        'The delegates met in secret through a Philadelphia summer with the windows shut, so their debates would not be reported before they had finished.',
      name: 'James Madison',
      dates: '1751–1836',
    },
    closerLook: {
      title: 'The compromises',
      body:
        'The Constitution was not designed from a single plan. It is a set of bargains between states that wanted different things.',
      cta: 'Read the documents',
      sections: [
        { label: 'Great Compromise', note: 'House and Senate' },
        { label: 'Three-Fifths', note: 'Representation and slavery' },
        { label: 'Electoral College', note: 'Choosing a president' },
        { label: 'Commerce', note: 'Trade and the slave trade' },
      ],
    },
    whyItMatters: {
      body:
        'Nearly every argument in American politics today runs through a structure decided in one room in 1787.',
      steps: ['Convention', 'Compromise', 'Separated powers', 'Checks and balances'],
    },
    quickCheck: {
      question: 'What did the Great Compromise resolve?',
      options: [
        'Whether to keep the Articles of Confederation',
        'How states would be represented in Congress',
        'Whether the president could veto legislation',
        'How federal judges would be appointed',
      ],
      answer: 1,
      why:
        'It combined representation by population in the House with equal representation by state in the Senate.',
    },
    whatsNext: {
      body:
        'A finished draft is not a government. It still had to be ratified — and ratification came with a condition.',
    },
  },

  {
    id: 'constitution-rights',
    n: '05',
    years: '1788–1791',
    short: 'Constitution + Bill of Rights',
    title: 'The Constitution and the Bill of Rights',
    tagline: 'Rights, balance, and a lasting union',
    summary:
      'Ratification came with a promise. The first ten amendments wrote specific protections for individual liberty into the constitutional settlement.',
    question: 'How is liberty protected once the government is strong?',

    deck: 'Ratification came with a promise.',
    intro:
      'Anti-Federalists warned that a stronger national government would threaten liberty. Ratification succeeded partly on a pledge: the first Congress would add explicit protections for individual rights.',
    heroQuote: {
      text: 'A bill of rights is what the people are entitled to against every government on earth.',
      source: 'Thomas Jefferson, 1787',
    },

    bigPicture: {
      heading: 'How is liberty protected once the government is strong?',
      body:
        '<strong>Federalists</strong> argued that a large republic would control faction and that structure alone would restrain power. <strong>Anti-Federalists</strong> answered that no structure is enough without written limits. The <strong>Bill of Rights</strong> wrote those limits down.',
    },
    takeaways: [
      'Ratification required nine of thirteen states and was closely contested.',
      'Federalists defended the Constitution in the Federalist Papers.',
      'Anti-Federalists demanded explicit protection for individual rights.',
      'The Bill of Rights was ratified in 1791 as the first ten amendments.',
      'The Tenth Amendment reserves remaining powers to the states and the people.',
    ],
    fact: {
      text:
        'One amendment proposed alongside the Bill of Rights in 1789 was not ratified until 1992 — 202 years later. It became the Twenty-Seventh Amendment.',
      name: 'Bill of Rights',
      dates: 'ratified 1791',
    },
    closerLook: {
      title: 'The first ten',
      body:
        'The Bill of Rights is short. Most of the rights arguments you will study are about how these few lines apply to new situations.',
      cta: 'Read the documents',
      sections: [
        { label: 'First Amendment', note: 'Speech, press, religion, assembly' },
        { label: 'Second Amendment', note: 'Arms' },
        { label: 'Fourth–Eighth', note: 'Process and the accused' },
        { label: 'Ninth–Tenth', note: 'Unenumerated and reserved powers' },
      ],
    },
    whyItMatters: {
      body:
        'Most rights cases today are arguments about how these ten amendments apply to situations the founders never imagined.',
      steps: ['Ratification debate', 'Bill of Rights', 'Incorporation', 'Rights today'],
    },
    quickCheck: {
      question: 'Why was the Bill of Rights added to the Constitution?',
      options: [
        'To give the national government more power',
        'To answer Anti-Federalist demands for explicit protection of rights',
        'To replace the Articles of Confederation',
        'To settle representation between large and small states',
      ],
      answer: 1,
      why:
        'Several states ratified only on the understanding that written protections for individual rights would follow.',
    },
    whatsNext: {
      body:
        'That is the founding story. From here the course moves into how the system actually runs — branches, rights, beliefs and participation.',
    },
  },
];

/* ---------------------------------------------------------------------------
   GALLERY SLIDES

   Five slides per chapter. `src: null` renders a designed placeholder panel
   showing the label and caption, so the carousel works fully before any art
   exists. To add an image, drop the file in assets/chapters/ and set `src`.

   Recommended size: 1200x800 (3:2). Anything wider than 900px is fine.
   --------------------------------------------------------------------------- */

const GALLERIES = {
  colonies: [
    { src: null, label: 'Settlement',      caption: 'Colonists arrive and build local institutions along the coast.' },
    { src: null, label: 'Self-government', caption: 'Elected assemblies debate taxes and local law.' },
    { src: null, label: 'New taxes',       caption: 'Parliament imposes direct taxes after the war debt of 1763.' },
    { src: null, label: 'Protest',         caption: 'Boycotts and petitions answer taxation without representation.' },
    { src: null, label: 'Open conflict',   caption: 'By 1775 the constitutional dispute has become a war.' },
  ],
  declaration: [
    { src: null, label: 'Drafting',        caption: 'A committee, including Thomas Jefferson, drafts the Declaration in June 1776.' },
    { src: null, label: 'The Document',    caption: 'Principles, grievances, and a formal declaration of separation.' },
    { src: null, label: 'Public Reading',  caption: 'The Declaration is read aloud in towns across the colonies.' },
    { src: null, label: 'Spreading',       caption: 'Printers carry the text far beyond Philadelphia.' },
    { src: null, label: 'A New Nation',    caption: 'Thirteen colonies declare themselves free and independent states.' },
  ],
  articles: [
    { src: null, label: 'First framework', caption: 'The Articles join sovereign states in a deliberately limited union.' },
    { src: null, label: 'A weak Congress', caption: 'One vote per state, and no power to tax.' },
    { src: null, label: 'Trade disputes',  caption: 'States set their own commercial rules against one another.' },
    { src: null, label: 'Debt & unrest',   caption: 'Economic pressure tests whether the union can hold.' },
    { src: null, label: 'Calls for reform',caption: 'Leaders begin arguing that the framework itself is the problem.' },
  ],
  convention: [
    { src: null, label: 'Philadelphia',    caption: 'Delegates gather in May 1787 to revise the Articles.' },
    { src: null, label: 'The debate',      caption: 'Large and small states argue over representation.' },
    { src: null, label: 'Compromise',      caption: 'A bicameral Congress settles the deadlock.' },
    { src: null, label: 'Separated power', caption: 'Authority is divided among three branches.' },
    { src: null, label: 'Signing',         caption: 'The delegates sign the finished draft in September 1787.' },
  ],
  'constitution-rights': [
    { src: null, label: 'Ratification',    caption: 'State conventions debate whether to accept the Constitution.' },
    { src: null, label: 'The argument',    caption: 'Federalists and Anti-Federalists make their case in print.' },
    { src: null, label: 'A promise',       caption: 'Several states ratify expecting a bill of rights to follow.' },
    { src: null, label: 'Bill of Rights',  caption: 'Ten amendments are ratified in 1791.' },
    { src: null, label: 'A lasting union', caption: 'The framework still structures national government today.' },
  ],
};

/** Attach the timeline thumbnail and the hero image to each chapter. */
export const CHAPTERS = DATA.map((c) => ({
  ...c,
  image: CHAPTER_IMAGES[c.id],
  hero: c.hero || DEFAULT_HERO,
  gallery: GALLERIES[c.id] || [],
}));

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

/** 1-based position of `id` in the story, for "Chapter 2 of 5". */
export function chapterPosition(id) {
  return CHAPTERS.findIndex((c) => c.id === id) + 1;
}
