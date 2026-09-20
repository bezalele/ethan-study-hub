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

    deck: 'Before there was a United States, there were thirteen separate colonies.',
    intro:
      'The colonies belonged to Britain, but many had elected assemblies that handled local taxes and laws. Political power was still limited to a small part of the population. After Britain tightened control and raised new revenue after 1763, a disagreement over taxes grew into a much bigger argument about representation, consent, and who had the right to govern.',
    heroQuote: {
      text: 'No taxation without representation.',
      source: 'Colonial political slogan, 1760s',
    },
    hero: {
      src: 'assets/chapters/colonies/hero-colonial-harbor.jpg',
      alt: 'A colonial harbour at sunset: British ships at anchor, dockworkers unloading barrels, and a small port town beyond',
    },

    bigPicture: {
      heading: 'Start here: America was not a country yet',
      body:
        'Each colony had its own government, but the <strong>king and Parliament</strong> still claimed final authority. Colonial assemblies gave many white male property holders real experience voting and making local laws, while women, enslaved people, Indigenous peoples, and many poor men had little or no political voice. That tension between <strong>local self-rule</strong> and distant power is the beginning of the story.',
    },
    takeaways: [
      'The thirteen colonies were separate British colonies, not one united country.',
      'Many colonies had elected assemblies that handled local laws and taxes.',
      'After the Seven Years’ War, Britain increased taxes and tightened imperial control.',
      'Colonists increasingly argued that taxation required representation and consent.',
      'By 1775, political protest had turned into armed conflict at Lexington and Concord.',
    ],
    fact: {
      text:
        'Virginia’s House of Burgesses first met in 1619 — more than 150 years before independence. Representative government in British North America was already an old habit by 1776.',
      name: 'House of Burgesses',
      dates: 'first met 1619',
    },
    closerLook: {
      title: 'How a tax argument became a revolution',
      body:
        'Think of the crisis as an escalation: Britain wanted more control and revenue; colonists pushed back; Britain punished resistance; the colonies organized together; then fighting began.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/colonies/boston-tea-party.jpg',
        alt: 'Historical print of colonists destroying tea in Boston Harbor',
      },
      sections: [
        { label: '1765', note: 'Stamp Act protest' },
        { label: '1773', note: 'Boston Tea Party' },
        { label: '1774', note: 'Continental Congress' },
        { label: '1775', note: 'Lexington & Concord' },
      ],
    },
    whyItMatters: {
      body:
        'AP Government begins with a question that started before independence: when is political power legitimate? The colonial experience made representation and consent central to the American argument about government.',
      steps: ['Local self-rule', 'British control', 'Resistance', 'Revolution'],
    },
    quickCheck: {
      question: 'What was the colonists’ main constitutional objection to the Stamp Act?',
      options: [
        'The tax was more expensive than taxes paid in Britain',
        'Parliament taxed them without representatives they had elected',
        'The tax applied only to New England colonies',
        'The king created the tax without Parliament',
      ],
      answer: 1,
      why:
        'The main objection was about political consent: colonists argued that a legislature in which they had no elected representatives should not tax them.',
    },
    whatsNext: {
      body:
        'By 1776 the argument was no longer just about taxes. The colonies now had to explain why they had the right to leave Britain altogether.',
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

    deck: 'The Declaration is an argument for independence — not a plan of government.',
    intro:
      'Congress voted for independence on July 2, 1776 and adopted the Declaration on July 4. Thomas Jefferson drafted the first version, with help and edits from John Adams, Benjamin Franklin, the Committee of Five, and Congress. The document explains what government is for, what Britain had done wrong, and why the colonies believed separation was justified.',
    heroQuote: {
      text: 'We hold these truths to be self-evident, that all men are created equal…',
      source: 'Declaration of Independence, 1776',
    },
    hero: {
      src: 'assets/chapters/declaration/hero-presenting-declaration.jpg',
      alt: 'A delegate standing to present the Declaration of Independence to the seated Continental Congress',
    },

    bigPicture: {
      heading: 'The Declaration does three big jobs',
      body:
        'First, it states the <strong>idea</strong>: people have natural rights and government gets legitimate power from their consent. Second, it gives the <strong>evidence</strong>: a long list of grievances against British rule. Third, it announces the <strong>decision</strong>: the colonies are now free and independent states. Remember: it explains <strong>why</strong> independence happened, not how the new government would work.',
    },
    takeaways: [
      'Natural rights are rights people possess simply because they are human.',
      'Consent of the governed means legitimate political power comes from the people.',
      'The grievances are the evidence used to justify breaking with Britain.',
      'Congress adopted the Declaration on July 4, 1776; most delegates signed later.',
      'Its equality language became a powerful ideal even though slavery and political exclusion continued.',
    ],
    fact: {
      text:
        'July 4 is famous, but Congress actually voted for independence on July 2. The final parchment was prepared afterward, and most delegates signed it beginning on August 2.',
      name: 'Three dates to remember',
      dates: 'July 2 · July 4 · August 2',
    },
    closerLook: {
      title: 'Read it like an argument',
      body:
        'You do not need to memorize the whole document. Follow its logic: principle → grievances → independence. That structure makes the Declaration much easier to understand.',
      cta: 'Read & explore the document',
      image: {
        src: 'assets/chapters/declaration/declaration-document.jpg',
        alt: 'The engrossed Declaration of Independence held by the National Archives',
      },
      sections: [
        { label: 'Principles', note: 'Rights and consent' },
        { label: 'Grievances', note: 'What Britain did wrong' },
        { label: 'Conclusion', note: 'Independence declared' },
        { label: 'Signatures', note: 'A public commitment' },
      ],
    },
    whyItMatters: {
      body:
        'The Declaration gave later generations a language for challenging unequal treatment. Abolitionists, women’s-rights advocates, and civil-rights leaders all returned to its promises of equality and natural rights.',
      steps: ['Natural rights', 'Consent', 'Independence', 'A lasting ideal'],
    },
    quickCheck: {
      question: 'What was the main purpose of the Declaration of Independence?',
      options: [
        'To create the structure of the new national government',
        'To explain and justify the colonies’ separation from Britain',
        'To create the Bill of Rights',
        'To divide power among three branches',
      ],
      answer: 1,
      why:
        'The Declaration explains and justifies separation. The actual structure of government came later with the Articles and then the Constitution.',
    },
    whatsNext: {
      body:
        'The colonies had answered “Why are we leaving Britain?” Now they faced a harder practical question: how should thirteen independent states govern together?',
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

    deck: 'The first U.S. government had no president and no national Supreme Court.',
    intro:
      'The states had just fought a war against powerful central authority, so they built a national government designed to be limited. The Articles took effect in 1781 after Maryland became the final state to ratify them. The system could conduct diplomacy and war, but it depended heavily on the states for money and enforcement.',
    heroQuote: {
      text: 'Each state retains its sovereignty, freedom and independence…',
      source: 'Articles of Confederation, Article II',
    },
    hero: {
      src: 'assets/chapters/articles/hero-confederation-congress.jpg',
      alt: 'Delegates of the Confederation Congress bent over maps of the states and western territory',
    },

    bigPicture: {
      heading: 'The first U.S. government had one national branch',
      body:
        'At the national level there was a <strong>Congress</strong>, but no separate president and no national court system like today’s. Each state had <strong>one vote</strong>. Congress could make treaties, declare war, and manage western lands, but it could not directly tax citizens or regulate interstate commerce. The design protected state power — but made national action difficult.',
    },
    takeaways: [
      'Maryland became the final state to ratify the Articles on March 1, 1781.',
      'Each state had one vote in Congress, whether large or small.',
      'Congress could not impose direct federal taxes; it had to ask states for money.',
      'The Confederation achieved real successes, including the Treaty of Paris and Northwest Ordinance.',
      'Debt, interstate trade problems, and unrest helped build support for constitutional change.',
    ],
    fact: {
      text:
        'A major moment in this chapter happened close to home: George Washington resigned his military commission to Congress in Annapolis in 1783, reinforcing the principle that the military answers to civilian government.',
      name: 'Maryland connection',
      dates: 'Annapolis · December 23, 1783',
    },
    closerLook: {
      title: 'Strong enough to win a war — too weak to run the peace?',
      body:
        'The Articles were not useless. The better question is whether Congress had enough power to solve problems that crossed state lines once the Revolutionary War was over.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/articles/articles-document.jpg',
        alt: 'First page of the Articles of Confederation in the National Archives',
      },
      sections: [
        { label: 'Money', note: 'No direct federal tax' },
        { label: 'Trade', note: 'No commerce power' },
        { label: 'Executive', note: 'No separate president' },
        { label: 'Amendments', note: 'All 13 states needed' },
      ],
    },
    whyItMatters: {
      body:
        'Many powers in the Constitution make more sense when you see the problem they were designed to fix. The Articles are the “before” picture for understanding the stronger federal system created in 1787.',
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
        'By 1787 many leaders thought the problem was not one bad law but the design itself. Delegates gathered in Philadelphia to rethink the system.',
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

    deck: 'One summer. Fifty-five delegates. A completely new design.',
    intro:
      'Delegates met in Philadelphia in 1787 to revise the Articles, but they soon began designing a new government. Fifty-five delegates from twelve states attended at some point; Rhode Island sent none. The debates centered on representation, national versus state power, the presidency, the courts, and slavery.',
    heroQuote: {
      text: 'If men were angels, no government would be necessary.',
      source: 'James Madison, Federalist No. 51, 1788',
    },
    hero: {
      src: 'assets/chapters/convention/hero-convention-debate.jpg',
      alt: 'The Constitutional Convention in session, delegates in debate with George Washington presiding',
    },

    bigPicture: {
      heading: 'The Convention was a giant design problem',
      body:
        'The delegates wanted a government strong enough to act, but not strong enough to become tyrannical. The <strong>Great Compromise</strong> created a House based on population and a Senate with equal state representation. They also divided power among branches and between federal and state governments. Some compromises protected slavery and increased the political power of slaveholding states.',
    },
    takeaways: [
      'The Convention met from May to September 1787 in Philadelphia.',
      'The Great Compromise created today’s House and Senate structure.',
      'Separation of powers gives legislative, executive, and judicial institutions different jobs.',
      'Checks and balances give each branch tools to limit the others.',
      'Thirty-nine delegates signed the final Constitution on September 17, 1787.',
    ],
    fact: {
      text:
        'The delegates kept their debates secret. Windows were often shut despite the summer heat so people outside could not easily hear what was being discussed.',
      name: 'Inside Independence Hall',
      dates: 'summer 1787',
    },
    closerLook: {
      title: 'Four problems they had to solve',
      body:
        'The Constitution is easier to understand when you treat each major feature as an answer to a problem the delegates were facing.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/convention/virginia-plan.jpg',
        alt: 'The Virginia Plan from the Constitutional Convention',
      },
      sections: [
        { label: 'Representation', note: 'Large vs. small states' },
        { label: 'Power', note: 'National vs. state' },
        { label: 'Control', note: 'Checks among branches' },
        { label: 'Slavery', note: 'Compromise and injustice' },
      ],
    },
    whyItMatters: {
      body:
        'The rest of AP Government is largely the story of this architecture in action: Congress, the presidency, courts, federalism, elections, rights, and conflicts over who can do what.',
      steps: ['Competing plans', 'Compromise', 'New architecture', 'Ratification'],
    },
    quickCheck: {
      question: 'What did the Great Compromise resolve?',
      options: [
        'Whether to keep the Articles of Confederation',
        'How states would be represented in Congress',
        'Whether the president could veto legislation',
        'How the Bill of Rights would be written',
      ],
      answer: 1,
      why:
        'It combined representation by population in the House with equal representation for each state in the Senate.',
    },
    whatsNext: {
      body:
        'Writing the Constitution did not make it law. The new system still had to win approval from the states — and critics demanded stronger protection for liberty.',
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

    deck: 'The Constitution builds the machine. The Bill of Rights draws lines it should not cross.',
    intro:
      'The Constitution won the required ninth state for ratification in 1788, and the new federal government began operating in 1789. Federalists defended the stronger system; Anti-Federalists worried about centralized power and individual liberty. The First Congress answered a major criticism by proposing amendments that became the Bill of Rights in 1791.',
    heroQuote: {
      text: 'A bill of rights is what the people are entitled to against every government on earth.',
      source: 'Thomas Jefferson to James Madison, 1787',
    },
    hero: {
      src: 'assets/chapters/constitution-rights/hero-constitution-legacy.jpg',
      alt: 'The United States Capitol at sunset with the Constitution unfurled and Americans of many backgrounds looking on',
    },

    bigPicture: {
      heading: 'Constitution = structure. Bill of Rights = limits.',
      body:
        'The Constitution organizes power through <strong>popular sovereignty, federalism, separation of powers, and checks and balances</strong>. The Bill of Rights adds explicit protections for liberties such as speech, religion, assembly, due process, and protection from unreasonable searches. Together they answer two questions: <strong>How can government work?</strong> and <strong>How can government be limited?</strong>',
    },
    takeaways: [
      'Nine states were required to ratify the Constitution; New Hampshire became the ninth in 1788.',
      'The new federal government began operating in 1789 under the Constitution.',
      'Federalists supported ratification; Anti-Federalists pressed hard for stronger protections of liberty.',
      'Congress proposed twelve amendments in 1789; ten were ratified in 1791.',
      'The Bill of Rights became the first ten amendments to the Constitution.',
    ],
    fact: {
      text:
        'The Bill of Rights began as twelve proposed amendments. Ten were ratified in 1791. Another waited more than 200 years before becoming the Twenty-Seventh Amendment in 1992.',
      name: '12 proposed → 10 ratified',
      dates: '1789 · 1791 · 1992',
    },
    closerLook: {
      title: 'Two ways the system limits power',
      body:
        'The Constitution mostly limits government by dividing power among institutions. The Bill of Rights adds direct rules about freedoms and legal protections government must respect.',
      cta: 'Read the documents',
      image: {
        src: 'assets/chapters/constitution-rights/bill-of-rights.jpg',
        alt: 'The Bill of Rights held by the National Archives',
      },
      sections: [
        { label: 'Articles I–III', note: 'Three branches' },
        { label: 'Federalism', note: 'Two levels of power' },
        { label: 'Amendments 1–8', note: 'Freedoms and process' },
        { label: 'Amendments 9–10', note: 'Rights and reserved power' },
      ],
    },
    whyItMatters: {
      body:
        'Almost every later AP Government topic comes back to this framework: who has power, who can stop whom, what rights government must respect, and how citizens use the system.',
      steps: ['Ratification', 'New government', 'Bill of Rights', 'Government today'],
    },
    quickCheck: {
      question: 'Why was the Bill of Rights added to the Constitution?',
      options: [
        'To give Congress more power over the states',
        'To answer demands for explicit protections of individual rights and limits on government',
        'To replace checks and balances with a list of freedoms',
        'To decide representation between large and small states',
      ],
      answer: 1,
      why:
        'Anti-Federalist criticism and state ratifying conventions pushed supporters of the Constitution to add explicit protections for individual liberty.',
    },
    whatsNext: {
      body:
        'That completes the founding story. From here, the course moves from designing the system to seeing how its branches, rights, beliefs, elections, and participation work in practice.',
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
/* ---------------------------------------------------------------------------
   GALLERY SLIDES

   Five slides per chapter, in narrative order. Each has a full-size stage
   image (2000x800) and a separate small `thumb`, because reusing the stage
   file for the thumbnail strip pulled about 1.9MB per page for five images
   displayed at 150px.
   --------------------------------------------------------------------------- */

const GALLERIES = {
  colonies: [
    {
      src: 'assets/chapters/colonies/slides/arrival-and-settlement.jpg',
      thumb: 'assets/chapters/colonies/slides/arrival-and-settlement-thumb.jpg',
      alt: 'Colonists coming ashore to build the first coastal settlements',
      label: 'Arrival',
      caption: 'Early English settlers establish fragile communities along the Atlantic coast.',
    },
    {
      src: 'assets/chapters/colonies/slides/everyday-colonial-life.jpg',
      thumb: 'assets/chapters/colonies/slides/everyday-colonial-life-thumb.jpg',
      alt: 'A busy colonial town of markets, workshops and farms',
      label: 'Everyday Life',
      caption: 'Markets, trades and farms turn scattered settlements into a growing colonial society.',
    },
    {
      src: 'assets/chapters/colonies/slides/self-government.jpg',
      thumb: 'assets/chapters/colonies/slides/self-government-thumb.jpg',
      alt: 'Colonists debating in a local assembly',
      label: 'Self-Government',
      caption: 'Colonists gain long practice debating and deciding local matters for themselves.',
    },
    {
      src: 'assets/chapters/colonies/slides/taxes-and-growing-protest.jpg',
      thumb: 'assets/chapters/colonies/slides/taxes-and-growing-protest-thumb.jpg',
      alt: 'Colonists protesting British taxation',
      label: 'Taxes and Protest',
      caption: 'Tension rises as Britain tightens control and raises new revenue after 1763.',
    },
    {
      src: 'assets/chapters/colonies/slides/boston-tea-party-road-to-revolution.jpg',
      thumb: 'assets/chapters/colonies/slides/boston-tea-party-road-to-revolution-thumb.jpg',
      alt: 'Colonists destroying chests of tea in Boston Harbour',
      label: 'Road to Revolution',
      caption: 'Resistance hardens and moves the colonies towards open conflict.',
    },
  ],
  declaration: [
    {
      src: 'assets/chapters/declaration/slides/drafting-the-declaration.jpg',
      thumb: 'assets/chapters/declaration/slides/drafting-the-declaration-thumb.jpg',
      alt: 'The drafting committee at work on the Declaration of Independence',
      label: 'Drafting',
      caption: 'Jefferson and the committee work out the wording of the Declaration.',
    },
    {
      src: 'assets/chapters/declaration/slides/the-document.jpg',
      thumb: 'assets/chapters/declaration/slides/the-document-thumb.jpg',
      alt: 'The Declaration of Independence as a finished document',
      label: 'The Document',
      caption: 'A statement of principles first, and a declaration of separation second.',
    },
    {
      src: 'assets/chapters/declaration/slides/public-reading.jpg',
      thumb: 'assets/chapters/declaration/slides/public-reading-thumb.jpg',
      alt: 'A public reading of the Declaration to a town crowd',
      label: 'Public Reading',
      caption: 'The Declaration is read aloud to crowds in towns across the colonies.',
    },
    {
      src: 'assets/chapters/declaration/slides/spreading-the-news.jpg',
      thumb: 'assets/chapters/declaration/slides/spreading-the-news-thumb.jpg',
      alt: 'Riders and printers spreading news of independence',
      label: 'Spreading the News',
      caption: 'Riders and printed copies carry the argument far beyond Philadelphia.',
    },
    {
      src: 'assets/chapters/declaration/slides/a-new-nation.jpg',
      thumb: 'assets/chapters/declaration/slides/a-new-nation-thumb.jpg',
      alt: 'Celebration and uncertainty as a new nation begins',
      label: 'A New Nation',
      caption: 'Independence creates a new political future — and a new problem: how to govern.',
    },
  ],
  articles: [
    {
      src: 'assets/chapters/articles/slides/first-national-government.jpg',
      thumb: 'assets/chapters/articles/slides/first-national-government-thumb.jpg',
      alt: 'The Confederation Congress meeting under the Articles',
      label: 'First Government',
      caption: 'The states agree to cooperate under a deliberately limited national framework.',
    },
    {
      src: 'assets/chapters/articles/slides/states-hold-most-power.jpg',
      thumb: 'assets/chapters/articles/slides/states-hold-most-power-thumb.jpg',
      alt: 'State delegates holding the balance of power',
      label: 'States Hold Power',
      caption: 'The national government depends on the states for money and for enforcement.',
    },
    {
      src: 'assets/chapters/articles/slides/money-debt-and-trade-problems.jpg',
      thumb: 'assets/chapters/articles/slides/money-debt-and-trade-problems-thumb.jpg',
      alt: 'Merchants and officials facing debt and trade disputes',
      label: 'Money and Debt',
      caption: 'Without the power to tax, Congress cannot pay its debts or steady trade.',
    },
    {
      src: 'assets/chapters/articles/slides/shays-rebellion.jpg',
      thumb: 'assets/chapters/articles/slides/shays-rebellion-thumb.jpg',
      alt: 'Armed farmers confronting authorities during Shays’ Rebellion',
      label: 'Shays’ Rebellion',
      caption: 'Armed unrest in Massachusetts exposes how little the national government can do.',
    },
    {
      src: 'assets/chapters/articles/slides/road-to-philadelphia.jpg',
      thumb: 'assets/chapters/articles/slides/road-to-philadelphia-thumb.jpg',
      alt: 'Delegates travelling to the Philadelphia convention',
      label: 'Road to Philadelphia',
      caption: 'Leaders conclude the framework itself is the problem, and call a convention.',
    },
  ],
  convention: [
    {
      src: 'assets/chapters/convention/slides/washington-presides.jpg',
      thumb: 'assets/chapters/convention/slides/washington-presides-thumb.jpg',
      alt: 'George Washington presiding over the Constitutional Convention',
      label: 'Washington Presides',
      caption: 'Delegates meet in Philadelphia in May 1787 to redesign the government.',
    },
    {
      src: 'assets/chapters/convention/slides/the-great-compromise.jpg',
      thumb: 'assets/chapters/convention/slides/the-great-compromise-thumb.jpg',
      alt: 'Delegates debating representation in Congress',
      label: 'The Great Compromise',
      caption: 'Large and small states settle how each will be represented in Congress.',
    },
    {
      src: 'assets/chapters/convention/slides/committee-work-and-compromise.jpg',
      thumb: 'assets/chapters/convention/slides/committee-work-and-compromise-thumb.jpg',
      alt: 'A convention committee working through competing plans',
      label: 'Committee Work',
      caption: 'Smaller groups grind through competing plans and unresolved detail.',
    },
    {
      src: 'assets/chapters/convention/slides/debate-over-a-new-system.jpg',
      thumb: 'assets/chapters/convention/slides/debate-over-a-new-system-thumb.jpg',
      alt: 'Delegates in open debate over the new system of government',
      label: 'The Debate',
      caption: 'Delegates argue over powers, structure and the limits of government.',
    },
    {
      src: 'assets/chapters/convention/slides/signing-the-constitution.jpg',
      thumb: 'assets/chapters/convention/slides/signing-the-constitution-thumb.jpg',
      alt: 'Delegates signing the United States Constitution',
      label: 'Signing',
      caption: 'The delegates complete and sign the new framework in September 1787.',
    },
  ],
  'constitution-rights': [
    {
      src: 'assets/chapters/constitution-rights/slides/ratification-debate.jpg',
      thumb: 'assets/chapters/constitution-rights/slides/ratification-debate-thumb.jpg',
      alt: 'Federalists and Anti-Federalists arguing over ratification',
      label: 'Ratification Debate',
      caption: 'Federalists and Anti-Federalists argue the Constitution state by state.',
    },
    {
      src: 'assets/chapters/constitution-rights/slides/constitution-takes-effect.jpg',
      thumb: 'assets/chapters/constitution-rights/slides/constitution-takes-effect-thumb.jpg',
      alt: 'The first federal government beginning its work',
      label: 'It Takes Effect',
      caption: 'The new federal system begins operating in 1789.',
    },
    {
      src: 'assets/chapters/constitution-rights/slides/bill-of-rights-drafting.jpg',
      thumb: 'assets/chapters/constitution-rights/slides/bill-of-rights-drafting-thumb.jpg',
      alt: 'The drafting of the Bill of Rights',
      label: 'Bill of Rights',
      caption: 'Amendments are drafted to write protections for liberty into the settlement.',
    },
    {
      src: 'assets/chapters/constitution-rights/slides/first-amendment-freedoms.jpg',
      thumb: 'assets/chapters/constitution-rights/slides/first-amendment-freedoms-thumb.jpg',
      alt: 'First Amendment freedoms in civic life',
      label: 'First Amendment',
      caption: 'Speech, press, religion, assembly and petition in everyday civic life.',
    },
    {
      src: 'assets/chapters/constitution-rights/slides/rights-across-generations.jpg',
      thumb: 'assets/chapters/constitution-rights/slides/rights-across-generations-thumb.jpg',
      alt: 'Americans across generations claiming constitutional rights',
      label: 'Rights Over Time',
      caption: 'The same principles keep shaping the struggle for equal rights and liberty.',
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
