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
      'Before independence, many colonists already had practice with elected assemblies. That made later British taxes and tighter control feel like a challenge to habits of self-government.',
    question: 'If people help govern themselves locally, who has the final say?',

    deck: 'Self-government existed long before independence.',
    intro:
      'The colonies were part of the British Empire, but many also elected local assemblies that handled taxes and laws. Political participation was limited and unequal. After 1763, Parliament tightened control and raised revenue, forcing a question that would drive the Revolution: who had the right to govern the colonies?',
    heroQuote: {
      text: 'No taxation without representation.',
      source: 'Colonial political slogan, 1760s',
    },
    hero: {
      src: 'assets/chapters/colonies/patrick-henry.jpg',
      alt: 'Patrick Henry speaking before the Virginia House of Burgesses during the Stamp Act crisis',
    },

    bigPicture: {
      heading: 'Why did the colonies drift apart from Britain?',
      body:
        'Colonists did not begin with a blank slate in 1776. Elected <strong>assemblies</strong> had given many white male property holders experience with representative government, while many others were excluded. After the Seven Years’ War, new taxes and tighter British oversight turned a dispute over revenue into a dispute over <strong>representation, consent, and authority</strong>.',
    },
    takeaways: [
      'Colonies remained under British authority while elected assemblies handled many local decisions.',
      'Political participation was limited; women, enslaved people, and many others lacked political power.',
      'After 1763, Britain increased taxes and regulation to raise revenue and tighten imperial control.',
      'Colonists argued that legitimate taxation required representation and consent.',
      'Protest, punishment, and failed compromise turned a political dispute into armed conflict by 1775.',
    ],
    fact: {
      text:
        'Virginia’s House of Burgesses first met in 1619 — more than 150 years before independence. Representative institutions in the colonies were older than the United States itself.',
      name: 'House of Burgesses',
      dates: 'first met 1619',
    },
    closerLook: {
      title: 'From self-rule to resistance',
      body:
        'The Revolution did not begin with one tax or one protest. Watch the argument escalate as colonists and Parliament each insisted that legitimate authority was on their side.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/colonies/boston-tea-party.jpg',
        alt: 'Engraving of colonists destroying tea in Boston Harbor',
      },
      sections: [
        { label: 'Local assemblies', note: 'Practice in self-rule' },
        { label: 'Stamp Act', note: '1765 — consent challenged' },
        { label: 'Boston Tea Party', note: '1773 — direct resistance' },
        { label: 'Lexington', note: '1775 — fighting begins' },
      ],
    },
    whyItMatters: {
      body:
        'The founding argument begins here: government needs authority, but people also expect a voice in how that authority is used. Representation and consent remain basic ideas in American government.',
      steps: ['Local self-rule', 'New controls', 'Resistance', 'Revolution'],
    },
    quickCheck: {
      question: 'What was the colonists’ main constitutional objection to the Stamp Act?',
      options: [
        'The tax rate was higher than taxes paid in Britain',
        'Parliament taxed them without representatives they had elected',
        'The tax applied only to northern colonies',
        'The king, rather than Parliament, created the tax',
      ],
      answer: 1,
      why:
        'The central objection was about consent and representation: colonists argued that a legislature in which they had no elected representatives should not tax them.',
    },
    whatsNext: {
      body:
        'By 1776, resistance had become a decision to separate. The next challenge was explaining why independence was justified.',
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
      'The Declaration turned independence into an argument about natural rights, equality, and the idea that legitimate government rests on the consent of the governed.',
    question: 'What makes a government legitimate in the first place?',

    deck: 'Independence needed an argument, not just an announcement.',
    intro:
      'On July 4, 1776, Congress adopted a statement explaining why the colonies were leaving Britain. The Declaration connected independence to natural rights, equality, and consent of the governed — ideas that became central to American political thought even when the country did not yet live up to them.',
    heroQuote: {
      text: 'We hold these truths to be self-evident, that all men are created equal…',
      source: 'Declaration of Independence, 1776',
    },
    hero: {
      src: 'assets/chapters/declaration/presentation-to-congress.jpg',
      alt: 'Historical print depicting the Declaration of Independence being presented to the Continental Congress',
    },

    bigPicture: {
      heading: 'What argument does the Declaration make?',
      body:
        'The Declaration begins with <strong>natural rights</strong> and says governments gain legitimate power from the <strong>consent of the governed</strong>. It then lists grievances meant to show that British rule violated those principles. Its conclusion is independence. It explains <strong>why to leave</strong>; it does not design the new government.',
    },
    takeaways: [
      'Natural rights are rights people possess by virtue of being human.',
      'Government is legitimate when its authority rests on the consent of the governed.',
      'The grievances are evidence for the claim that British rule violated those principles.',
      'The document declares the colonies to be free and independent states.',
      'The Declaration states political principles; it is not a constitution or plan of government.',
    ],
    fact: {
      text:
        'Congress voted for independence on July 2, adopted the Declaration on July 4, and delegates began signing the engrossed parchment on August 2. The famous signing was not one single July 4 event.',
      name: 'The Declaration',
      dates: '1776',
    },
    closerLook: {
      title: 'The argument on one page',
      body:
        'The Declaration is easier to remember as a four-part argument: principles, evidence, conclusion, and a public pledge by the signers.',
      cta: 'Read & explore the document',
      image: {
        src: 'assets/chapters/declaration/declaration-document.jpg',
        alt: 'The engrossed Declaration of Independence held by the National Archives',
      },
      sections: [
        { label: 'Principles', note: 'Rights and consent' },
        { label: 'Grievances', note: 'Evidence against the king' },
        { label: 'Independence', note: 'The political break' },
        { label: 'Signatures', note: 'A public commitment' },
      ],
    },
    whyItMatters: {
      body:
        'Later Americans repeatedly returned to the Declaration’s language of equality and rights — including abolitionists, women’s-rights advocates, and civil-rights leaders — to challenge the gap between national ideals and lived reality.',
      steps: ['Natural rights', 'Consent', 'Independence', 'A lasting ideal'],
    },
    quickCheck: {
      question: 'What was the main purpose of the Declaration of Independence?',
      options: [
        'To create the structure of the new national government',
        'To explain and justify the colonies’ separation from Britain',
        'To add a bill of rights to the new government',
        'To divide power among three branches',
      ],
      answer: 1,
      why:
        'The Declaration justifies separation. A governing framework came later, first through the Articles of Confederation and then the Constitution.',
    },
    whatsNext: {
      body:
        'Independence answered “Why leave Britain?” It did not answer “How should thirteen states govern together?” That became the next experiment.',
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
      'America’s first constitution protected state independence and gave Congress important national responsibilities, but it left the central government dependent on state cooperation.',
    question: 'What happens when a national government has too little power to solve shared problems?',

    deck: 'The first design protected the states — sometimes too well.',
    intro:
      'Congress adopted the Articles in 1777, but all thirteen states had to ratify them before they took effect. Maryland became the final state to ratify in 1781. The Confederation helped conduct the war and diplomacy, yet Congress lacked reliable revenue and several powers needed to manage a growing union.',
    heroQuote: {
      text: 'Each state retains its sovereignty, freedom and independence…',
      source: 'Articles of Confederation, Article II',
    },
    hero: {
      src: 'assets/chapters/articles/federal-hall.jpg',
      alt: 'Historical view of Federal Hall in New York, a national seat of government at the end of the 1780s',
    },

    bigPicture: {
      heading: 'What could the Confederation do — and not do?',
      body:
        'Congress could conduct diplomacy, make treaties, declare war, and manage western lands. But it could not <strong>tax people directly</strong> or <strong>regulate interstate commerce</strong>. There was no separate national executive or national court system. Major decisions depended heavily on the states, making coordinated action difficult.',
    },
    takeaways: [
      'The Articles created a union of states whose governments kept most political authority.',
      'Each state had one vote in the Confederation Congress, regardless of population.',
      'Congress could request money from states but could not impose direct federal taxes.',
      'The Confederation achieved important results, including the Treaty of Paris and Northwest Ordinance.',
      'Debt, trade disputes, unrest, and weak enforcement increased pressure for a stronger national framework.',
    ],
    fact: {
      text:
        'Maryland was the thirteenth and final state to ratify the Articles. Its approval on March 1, 1781, allowed the Articles formally to take effect — a useful local connection for Maryland students.',
      name: 'Maryland',
      dates: 'ratified March 1, 1781',
    },
    closerLook: {
      title: 'A government with real limits',
      body:
        'The Articles were not “no government.” Congress had national responsibilities. The problem was that several of those responsibilities came without the powers or revenue needed to carry them out consistently.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/articles/articles-document.jpg',
        alt: 'First page of the Articles of Confederation in the National Archives',
      },
      sections: [
        { label: 'War & treaties', note: 'National powers existed' },
        { label: 'Revenue', note: 'Requests, not direct taxes' },
        { label: 'Commerce', note: 'No national trade rule' },
        { label: 'Enforcement', note: 'No separate executive' },
      ],
    },
    whyItMatters: {
      body:
        'The Constitution makes more sense when you see it as a response to the Articles. Many powers granted in 1787 answer specific coordination problems experienced during the 1780s.',
      steps: ['Limited union', 'Shared problems', 'Pressure for reform', 'Convention'],
    },
    quickCheck: {
      question: 'Which power did Congress lack under the Articles of Confederation?',
      options: [
        'The power to declare war',
        'The power to make treaties',
        'The power to impose direct federal taxes',
        'The power to manage western territories',
      ],
      answer: 2,
      why:
        'Congress could ask states for money, but it could not levy direct federal taxes. That made reliable national revenue difficult.',
    },
    whatsNext: {
      body:
        'By 1787, many leaders believed the system needed more than small repairs. Delegates met in Philadelphia to revise the Articles and produced a new design instead.',
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
      'The Philadelphia Convention redesigned national government around representation, federalism, separated powers, and checks — while also making compromises that protected slavery.',
    question: 'How do you build a government strong enough to act but limited enough to resist abuse?',

    deck: 'The assignment was revision. The result was a new system.',
    intro:
      'A quorum of delegates gathered in Philadelphia on May 25, 1787. Fifty-five delegates from twelve states attended at some point; Rhode Island sent none. Instead of merely repairing the Articles, they debated representation, national power, executive authority, slavery, and the relationship between states and the new federal government.',
    heroQuote: {
      text: 'If men were angels, no government would be necessary.',
      source: 'James Madison, Federalist No. 51, 1788',
    },
    hero: {
      src: 'assets/chapters/convention/signing-constitution.jpg',
      alt: 'Howard Chandler Christy painting of delegates at the signing of the United States Constitution',
    },

    bigPicture: {
      heading: 'How did the framers divide power?',
      body:
        'The <strong>Great Compromise</strong> created a House based on population and a Senate with equal state representation. The Constitution divided authority among branches and between federal and state governments. Other bargains were deeply unjust: the <strong>Three-Fifths Clause</strong> increased slaveholding states’ representation while enslaved people had no political rights.',
    },
    takeaways: [
      'The convention was called to revise the Articles but produced an entirely new Constitution.',
      'The Great Compromise created a two-house Congress balancing population and equal state representation.',
      'Separation of powers gives legislative, executive, and judicial institutions different responsibilities.',
      'Checks and balances give each branch tools to restrain the others.',
      'Compromises over slavery protected the institution and shaped representation in the new government.',
    ],
    fact: {
      text:
        'Seventy-four delegates were appointed, 55 attended at some point, and only 39 signed the finished Constitution. Rhode Island was the only state that sent no delegates.',
      name: 'Philadelphia Convention',
      dates: 'May–September 1787',
    },
    closerLook: {
      title: 'The design problems',
      body:
        'The Constitution grew out of competing plans and interests. The most useful way to study the convention is to ask what problem each compromise or structural choice was trying to solve.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/convention/virginia-plan.jpg',
        alt: 'Virginia Plan document from the Constitutional Convention',
      },
      sections: [
        { label: 'Representation', note: 'Large states vs. small' },
        { label: 'Three branches', note: 'Separate institutions' },
        { label: 'Federalism', note: 'National and state power' },
        { label: 'Slavery', note: 'Power and human bondage' },
      ],
    },
    whyItMatters: {
      body:
        'Congress, the presidency, the courts, federalism, and the amendment process all grow from choices made in 1787. Later AP Government units are largely a study of how this architecture works in practice.',
      steps: ['Competing plans', 'Compromise', 'New architecture', 'Ratification'],
    },
    quickCheck: {
      question: 'What did the Great Compromise resolve?',
      options: [
        'Whether the United States would keep the Articles of Confederation',
        'How states would be represented in the national legislature',
        'Whether presidents could veto legislation',
        'How the Bill of Rights would be written',
      ],
      answer: 1,
      why:
        'It combined representation by population in the House with equal representation for each state in the Senate.',
    },
    whatsNext: {
      body:
        'Writing a Constitution did not make it law. The proposed system still had to win ratification — and critics demanded stronger protection for individual liberty.',
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
      'Ratification created a stronger federal system; the Bill of Rights then added explicit protections for individual liberty and limits on national power.',
    question: 'How can government be strong enough to work and still remain limited?',

    deck: 'A stronger government came with an argument about liberty.',
    intro:
      'The Constitution was ratified in 1788 and the new federal government began operating in 1789. Federalists defended the new structure; Anti-Federalists warned that centralized power could endanger liberty. The First Congress answered a central criticism by proposing amendments that became the Bill of Rights in 1791.',
    heroQuote: {
      text: 'A bill of rights is what the people are entitled to against every government on earth.',
      source: 'Thomas Jefferson to James Madison, 1787',
    },
    hero: {
      src: 'assets/chapters/constitution-rights/bill-of-rights.jpg',
      alt: 'The Bill of Rights held by the National Archives',
    },

    bigPicture: {
      heading: 'How does the Constitution limit power?',
      body:
        'The Constitution begins with <strong>popular sovereignty</strong> — “We the People” — and distributes power through <strong>federalism, separation of powers, and checks and balances</strong>. The ratification debate asked whether structure alone was enough. The <strong>Bill of Rights</strong> added written protections for speech, religion, due process, and other liberties.',
    },
    takeaways: [
      'The Constitution creates a federal republic in which national and state governments share power.',
      'Separation of powers and checks and balances are designed to prevent concentrated authority.',
      'Federalists argued for ratification; Anti-Federalists warned about centralized power and individual liberty.',
      'Twelve amendments were proposed in 1789; ten were ratified as the Bill of Rights in 1791.',
      'The first ten amendments protect liberties while also reserving undelegated powers to states or the people.',
    ],
    fact: {
      text:
        'Congress proposed twelve amendments in 1789, not ten. Ten became the Bill of Rights in 1791; one of the other two was eventually ratified in 1992 as the Twenty-Seventh Amendment.',
      name: 'Bill of Rights',
      dates: 'ratified 1791',
    },
    closerLook: {
      title: 'Read the architecture and the rights together',
      body:
        'The Constitution mostly limits power by designing institutions; the Bill of Rights adds explicit rules about what government may not do. AP Government asks you to understand both kinds of limits.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/constitution-rights/constitution.jpg',
        alt: 'First page of the United States Constitution in the National Archives',
      },
      sections: [
        { label: 'Structure', note: 'Articles I–III' },
        { label: 'Federalism', note: 'Shared sovereignty' },
        { label: 'First Amendment', note: 'Core expressive freedoms' },
        { label: 'Ninth–Tenth', note: 'Rights and reserved powers' },
      ],
    },
    whyItMatters: {
      body:
        'The rest of AP Government keeps returning to this settlement: who has power, how institutions check one another, what rights government must respect, and how citizens use the system.',
      steps: ['Ratification', 'New government', 'Bill of Rights', 'Government today'],
    },
    quickCheck: {
      question: 'Why was the Bill of Rights added to the Constitution?',
      options: [
        'To give Congress more power over the states',
        'To answer demands for explicit protections of individual rights and limits on government',
        'To replace the system of checks and balances',
        'To decide representation between large and small states',
      ],
      answer: 1,
      why:
        'Anti-Federalist criticism and ratifying-convention recommendations pushed Federalists to support explicit protections, which the First Congress proposed in 1789.',
    },
    whatsNext: {
      body:
        'That completes the founding story. The course now turns from designing the system to watching it operate through branches, rights, beliefs, elections, and participation.',
    },
  },
]

/* ---------------------------------------------------------------------------
   GALLERY SLIDES

   Five slides per chapter. `src: null` renders a designed placeholder panel
   showing the label and caption, so the carousel works fully before any art
   exists. To add an image, drop the file in assets/chapters/ and set `src`.

   Recommended size: 1200x800 (3:2). Anything wider than 900px is fine.
   --------------------------------------------------------------------------- */

const GALLERIES = {
  colonies: [
    {
      src: 'assets/chapters/colonies/house-of-burgesses.jpg',
      alt: 'Historical image of the Virginia House of Burgesses chamber',
      label: 'Self-government',
      caption: 'Colonial assemblies gave many settlers experience with elected representative government.',
    },
    {
      src: 'assets/chapters/colonies/patrick-henry.jpg',
      alt: 'Patrick Henry speaking against the Stamp Act before the Virginia House of Burgesses',
      label: 'Stamp Act',
      caption: 'New imperial taxes sharpen the argument over representation and consent.',
    },
    {
      src: 'assets/chapters/colonies/boston-massacre.jpg',
      alt: 'Paul Revere engraving depicting the Boston Massacre',
      label: 'Tension',
      caption: 'A famous propaganda image shows how conflict was framed for colonial audiences.',
    },
    {
      src: 'assets/chapters/colonies/boston-tea-party.jpg',
      alt: 'Engraving of colonists destroying tea in Boston Harbor',
      label: 'Resistance',
      caption: 'The Boston Tea Party turns opposition to taxation into direct political action.',
    },
    {
      src: 'assets/chapters/colonies/lexington.jpg',
      alt: 'Amos Doolittle print of the Battle of Lexington in April 1775',
      label: 'Open conflict',
      caption: 'At Lexington, the constitutional dispute finally becomes an armed conflict.',
    },
  ],
  declaration: [
    {
      src: 'assets/chapters/declaration/committee-of-five.jpg',
      alt: 'Historical print of the committee appointed to draft the Declaration of Independence',
      label: 'Drafting',
      caption: 'Jefferson drafts the text, with Adams and Franklin among those reviewing it.',
    },
    {
      src: 'assets/chapters/declaration/presentation-to-congress.jpg',
      alt: 'Historical print of the Declaration being presented to Congress',
      label: 'Debate',
      caption: 'Congress edits the draft after voting for independence on July 2.',
    },
    {
      src: 'assets/chapters/declaration/declaration-document.jpg',
      alt: 'The engrossed Declaration of Independence',
      label: 'The document',
      caption: 'Principles and grievances build toward a formal declaration of independence.',
    },
    {
      src: 'assets/chapters/declaration/public-reading.jpg',
      alt: 'Historical print of a public reading of the Declaration of Independence',
      label: 'Public reading',
      caption: 'Printed copies carry the argument beyond Philadelphia to soldiers and communities.',
    },
    {
      src: 'assets/chapters/declaration/signing.jpg',
      alt: 'Historical print depicting the signing of the Declaration of Independence',
      label: 'A new nation',
      caption: 'The engrossed parchment becomes a public commitment by the signers.',
    },
  ],
  articles: [
    {
      src: 'assets/chapters/articles/articles-document.jpg',
      alt: 'The Articles of Confederation document',
      label: 'First framework',
      caption: 'The first U.S. constitution creates a union while preserving broad state authority.',
    },
    {
      src: 'assets/chapters/articles/treaty-of-paris.jpg',
      alt: 'The Treaty of Paris of 1783',
      label: 'A real success',
      caption: 'The Confederation government helps secure the treaty that ends the Revolutionary War.',
    },
    {
      src: 'assets/chapters/articles/northwest-ordinance.jpg',
      alt: 'The Northwest Ordinance document',
      label: 'Western lands',
      caption: 'The Northwest Ordinance creates a durable process for governing and admitting territories.',
    },
    {
      src: 'assets/chapters/articles/shays-rebellion.jpg',
      alt: 'Historical proclamation connected with Shays’ Rebellion',
      label: 'Debt & unrest',
      caption: 'Economic unrest adds urgency to arguments over the government’s capacity to act.',
    },
    {
      src: 'assets/chapters/articles/federal-hall.jpg',
      alt: 'Historical view of Federal Hall in New York',
      label: 'A changing system',
      caption: 'By the end of the 1780s, Americans are moving toward a different national framework.',
    },
  ],
  convention: [
    {
      src: 'assets/chapters/convention/independence-hall.jpg',
      alt: 'Independence Hall in Philadelphia',
      label: 'Philadelphia',
      caption: 'Delegates gather in the Pennsylvania State House to reconsider the national system.',
    },
    {
      src: 'assets/chapters/convention/virginia-plan.jpg',
      alt: 'The Virginia Plan from the Constitutional Convention',
      label: 'Competing plans',
      caption: 'The Virginia Plan begins a major debate over representation and national power.',
    },
    {
      src: 'assets/chapters/convention/james-madison.jpg',
      alt: 'Portrait of James Madison',
      label: 'The debates',
      caption: 'Madison’s detailed notes became a major record of the convention’s arguments.',
    },
    {
      src: 'assets/chapters/constitution-rights/constitution.jpg',
      alt: 'First page of the United States Constitution',
      label: 'New architecture',
      caption: 'The final framework separates powers while creating a government able to act nationally.',
    },
    {
      src: 'assets/chapters/convention/signing-constitution.jpg',
      alt: 'Howard Chandler Christy painting of the signing of the Constitution',
      label: 'Signing',
      caption: 'Thirty-nine delegates sign the finished Constitution on September 17, 1787.',
    },
  ],
  'constitution-rights': [
    {
      src: 'assets/chapters/constitution-rights/constitution.jpg',
      alt: 'First page of the United States Constitution',
      label: 'The Constitution',
      caption: '“We the People” introduces a new federal framework based on popular sovereignty.',
    },
    {
      src: 'assets/chapters/convention/james-madison.jpg',
      alt: 'Portrait of James Madison',
      label: 'Federalist case',
      caption: 'Federalists defend the proposed Constitution and explain its republican design.',
    },
    {
      src: 'assets/chapters/constitution-rights/alexander-hamilton.jpg',
      alt: 'Portrait of Alexander Hamilton',
      label: 'Ratification',
      caption: 'Federalists and Anti-Federalists debate power, representation, and the protection of liberty.',
    },
    {
      src: 'assets/chapters/constitution-rights/bill-of-rights.jpg',
      alt: 'The Bill of Rights held by the National Archives',
      label: 'Bill of Rights',
      caption: 'Ten amendments are ratified in 1791 with explicit protections for individual liberty.',
    },
    {
      src: 'assets/home/course-capitol.png',
      alt: 'United States Capitol dome framed by cherry blossoms',
      label: 'A living system',
      caption: 'The constitutional framework still organizes national government more than two centuries later.',
    },
  ],
}

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
