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

import { CHAPTER_IMAGES, IMAGES } from './assets.js?v=4';

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
      'Long before independence, colonists were already governing themselves locally — and that made later British control feel like something was being taken away.',
    question: 'If people already help govern themselves, who gets the final say?',

    deck: 'Before there was a United States, there were thirteen separate British colonies.',
    intro:
      'Before the United States existed, the thirteen colonies were part of the British Empire. Many colonies had elected assemblies that handled local laws and taxes, so generations of colonists grew used to having a voice in government. The Seven Years’ War ended in 1763 after leaving Britain with heavy war costs and debt, so Parliament sought more revenue from the colonies and tightened imperial control. The argument quickly became bigger than money: could Parliament tax the colonies when colonists elected no members to Parliament?',
    heroQuote: {
      text: 'No taxation without representation.',
      source: 'Colonial political slogan, 1760s',
    },
    hero: {
      src: 'assets/chapters/colonies/hero-colonial-harbor.jpg',
      alt: 'A colonial harbour at sunset: British ships at anchor, dockworkers unloading barrels, and a small port town beyond',
    },

    bigPicture: {
      heading: 'Why did loyal British colonists end up rebelling?',
      body:
        'For more than a century, many colonists had practiced <strong>local self-government</strong> through elected assemblies. Britain still held final authority, and political participation was limited — women, enslaved people, Indigenous peoples, and many poor men had little or no political power. After 1763, Parliament began using that authority more aggressively. What started as a fight over taxes became a fight over <strong>representation, consent, and who had the right to govern</strong>.',
    },
    takeaways: [
      'Before 1776, the thirteen colonies were British colonies — not one united American country.',
      'Many colonists had practiced local self-government through elected assemblies for generations.',
      'After the Seven Years’ War ended in 1763, Britain sought more revenue and tighter control over the colonies.',
      'The Stamp Act crisis made representation the central issue: colonists objected to taxation by a Parliament in which they elected no members.',
      'The Tea Party, the Coercive Acts, and Lexington and Concord moved the colonies from protest to coordinated resistance and then war.',
    ],
    facts: [
      {
        text:
          'Virginia’s House of Burgesses first met at Jamestown in 1619. That means representative government in Virginia existed more than 150 years before the Declaration of Independence.',
        name: 'House of Burgesses',
        dates: 'Jamestown · 1619',
      },
      {
        text:
          'During the Boston Tea Party on December 16, 1773, protesters destroyed 342 chests of East India Company tea from three ships in Boston Harbor.',
        name: '342 chests of tea',
        dates: 'Boston · 1773',
      },
      {
        text:
          'The First Continental Congress met in Philadelphia in 1774 with delegates from twelve colonies. Georgia was the only colony that did not send delegates.',
        name: '12 colonies met',
        dates: 'Philadelphia · 1774',
      },
      {
        text:
          'The first shots of the Revolutionary War were fired at Lexington and Concord on April 19, 1775. Accounts disagree about exactly who fired first at Lexington.',
        name: 'War begins',
        dates: 'April 19, 1775',
      },
    ],
    closerLook: {
      title: 'From protest to revolution: 1765–1775',
      body:
        'In just ten years, a tax dispute became a war. The Stamp Act triggered organized protests over representation. The Boston Tea Party challenged British authority directly. Britain answered with the Coercive Acts, which closed Boston’s port and punished Massachusetts. Twelve colonies then met at the First Continental Congress to coordinate a response. In April 1775, British troops marched toward Concord to seize military supplies, and fighting broke out at Lexington and Concord.',
      cta: 'Explore the events',
      images: [
        {
          src: 'assets/chapters/colonies/closer/thirteen-colonies-map.jpg',
          alt: 'A period map of the thirteen British colonies along the Atlantic coast',
        },
      ],
      sections: [
        {
          label: '1765',
          note: 'Stamp Act — a direct tax on printed materials. Colonists answer: taxation requires representation.',
        },
        {
          label: '1773',
          note: 'Boston Tea Party — protesters destroy 342 chests of taxed tea in Boston Harbor.',
        },
        {
          label: '1774',
          note: 'First Continental Congress — delegates from 12 colonies coordinate a response to Britain’s Coercive Acts.',
        },
        {
          label: '1775',
          note: 'Lexington & Concord — British troops and colonial militia exchange fire; the Revolutionary War begins.',
        },
      ],
    },
    whyItMatters: {
      body:
        'This chapter sets up one of AP Government’s biggest ideas: legitimate power depends on more than simply having authority. Britain claimed the legal power to govern the colonies; colonists increasingly argued that government also needed representation and consent. That disagreement leads directly into the Declaration of Independence.',
      connections: [
        { from: 'Colonial assemblies', to: 'Representation' },
        { from: '“No taxation without representation”', to: 'Consent of the governed' },
        { from: 'British crackdown', to: 'Limits on government power' },
      ],
    },
    quiz: [
      {
        question: 'Before 1776, how were the thirteen colonies organised?',
        options: [
          'As one united American country',
          'As thirteen separate British colonies',
          'As independent republics allied by treaty',
          'As provinces with no local governments',
        ],
        answer: 1,
        why: 'They were separate British colonies. The United States did not yet exist as one country.',
      },
      {
        question: 'What did colonial assemblies give many colonists practice in?',
        options: [
          'Electing a national president',
          'Handling local laws and taxes through representatives',
          'Negotiating foreign treaties',
          'Choosing members of the British Parliament',
        ],
        answer: 1,
        why: 'For generations, elected colonial assemblies handled many local laws and taxes, giving colonists experience with representative government.',
      },
      {
        question: 'Why did Britain tighten control and seek more revenue after 1763?',
        options: [
          'The Seven Years’ War had ended and Britain faced large costs and debt',
          'The colonies had already declared independence',
          'France controlled Parliament',
          'The colonies refused to trade with Britain at all',
        ],
        answer: 0,
        why: 'After the Seven Years’ War, Britain sought more revenue from the colonies and enforced imperial rules more closely.',
      },
      {
        question: 'What did “no taxation without representation” mean?',
        options: [
          'Colonists wanted every tax abolished',
          'Colonists argued they should not be taxed by a Parliament in which they elected no representatives',
          'Only the king could create taxes',
          'Colonists wanted to pay taxes only with goods',
        ],
        answer: 1,
        why: 'The central argument was about consent and representation — who had the right to make binding tax decisions for the colonies.',
      },
      {
        question: 'What happened at Lexington and Concord in April 1775?',
        options: [
          'Britain repealed all colonial taxes',
          'The First Continental Congress met for the first time',
          'Armed fighting began between British troops and colonial militia',
          'The Declaration of Independence was signed',
        ],
        answer: 2,
        why: 'The first shots of the Revolutionary War were fired at Lexington and Concord on April 19, 1775.',
      },
    ],
    whatsNext: {
      body:
        'The fighting had started. Now the colonies had to explain why breaking away was justified.',
      bridge: [
        { label: '1775', title: 'War begins', note: 'Lexington and Concord turn protest into armed conflict.' },
        { label: '1776', title: 'Independence explained', note: 'The Declaration states the principles and case for separation.' },
      ],
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
      'The Declaration turned independence into an argument: people have rights, government gets power from the people, and government can lose legitimacy when it repeatedly violates those rights.',
    question: 'What makes a government legitimate in the first place?',

    deck: 'The Declaration explains why the colonies believed they had the right to leave Britain.',
    intro:
      'Congress voted for independence on July 2, 1776 and adopted the Declaration on July 4. Thomas Jefferson drafted the first version, with edits from John Adams, Benjamin Franklin, the Committee of Five, and Congress. The document is not a plan for government. It is a public argument: people have natural rights, governments exist to protect those rights, and rulers who repeatedly violate them can lose the consent of the governed.',
    heroQuote: {
      text: 'We hold these truths to be self-evident, that all men are created equal…',
      source: 'Declaration of Independence, 1776',
    },
    hero: {
      src: 'assets/chapters/declaration/hero-presenting-declaration.jpg',
      alt: 'A delegate standing to present the Declaration of Independence to the seated Continental Congress',
    },

    bigPicture: {
      heading: 'The Declaration is a three-part argument',
      body:
        '<strong>1. The principle:</strong> people possess natural rights, and legitimate government depends on their consent. This reflects the idea of a <strong>social contract</strong>: people accept government authority so government will protect their rights. <strong>2. The evidence:</strong> the Declaration lists grievances meant to show a pattern of British abuses. <strong>3. The conclusion:</strong> because that political relationship had broken down, the colonies declared themselves free and independent states. This connects <strong>natural rights, popular sovereignty, limited government, and the social contract</strong>.',
    },
    takeaways: [
      'Natural rights are rights people possess simply because they are human; the Declaration names life, liberty, and the pursuit of happiness.',
      'Consent of the governed means legitimate political power ultimately comes from the people, not simply from a king or legislature.',
      'The grievances are evidence: the Declaration argues that repeated abuses showed Britain had broken the political relationship.',
      'Congress voted for independence on July 2, adopted the Declaration on July 4, and delegates began signing the engrossed parchment on August 2.',
      'The Declaration’s equality language became a lasting American ideal even though slavery and major political exclusions continued in 1776.',
    ],
    facts: [
      {
        text:
          'July 4 is the date Congress adopted the Declaration, but the vote for independence happened two days earlier, on July 2.',
        name: 'The famous date',
        dates: 'July 2 → July 4, 1776',
      },
      {
        text:
          'Most delegates did not sign the parchment on July 4. Congress ordered an engrossed copy later, and delegates began signing that version on August 2.',
        name: 'The signing came later',
        dates: 'August 2, 1776',
      },
      {
        text:
          'Fifty-six delegates eventually signed the Declaration. Some members of Congress who supported independence never signed the engrossed copy.',
        name: '56 signers',
        dates: '13 states',
      },
      {
        text:
          'Printer John Dunlap worked through the night after adoption and produced about 200 broadside copies so the Declaration could be sent to assemblies, committees, and military commanders.',
        name: 'News spreads fast',
        dates: 'July 4–5, 1776',
      },
    ],
    closerLook: {
      title: 'Read the Declaration in four moves',
      body:
        'You do not need to memorize every grievance. Follow the logic. The document starts with a theory of legitimate government, argues that Britain violated that theory, and then announces the political consequence: independence. That basic structure is what Ethan should be able to explain.',
      cta: 'Explore the document',
      images: [
        {
          src: 'assets/chapters/declaration/closer/the-engrossed-copy.jpg',
          alt: 'The engrossed Declaration of Independence with quill and seal',
        },
      ],
      sections: [
        {
          label: 'Principles',
          note: 'Natural rights + equality — government exists to secure rights, not create them.',
        },
        {
          label: 'Consent',
          note: 'Government gets its “just powers” from the governed; political authority is not unlimited.',
        },
        {
          label: 'Grievances',
          note: 'The long complaint list is the evidence meant to show a repeated pattern of abuse.',
        },
        {
          label: 'Independence',
          note: 'The colonies conclude that they are “Free and Independent States,” ending political ties with Britain.',
        },
      ],
    },
    whyItMatters: {
      body:
        'AP Government returns to these ideas again and again: natural rights, popular sovereignty, and limited government. Later Americans also used the Declaration’s language of equality to challenge slavery, racial discrimination, and the exclusion of women from political rights.',
      connections: [
        { from: 'Natural rights', to: 'Purpose of government' },
        { from: 'Consent of the governed', to: 'Popular sovereignty' },
        { from: 'List of grievances', to: 'Limited government' },
      ],
    },
    quiz: [
      {
        question: 'What was the Declaration\'s main purpose?',
        options: [
          'To create a plan for the new government',
          'To explain why the colonies were separating from Britain',
          'To establish the Bill of Rights',
          'To divide power among three branches',
        ],
        answer: 1,
        why: 'The Declaration explains and justifies separation. A governing framework came later.',
      },
      {
        question: 'Which idea does the Declaration use to explain where legitimate government authority comes from?',
        options: [
          'The divine right of kings',
          'The consent of the governed',
          'The authority of Parliament',
          'The decision of the courts',
        ],
        answer: 1,
        why: 'The Declaration says governments derive their just powers from the consent of the governed.',
      },
      {
        question: 'What are natural rights in the Declaration\'s argument?',
        options: [
          'Rights granted by Parliament',
          'Rights people possess that government is supposed to protect',
          'Rights that exist only during wartime',
          'Rights held only by elected officials',
        ],
        answer: 1,
        why: 'The Declaration treats rights as belonging to people before government; government exists to secure them.',
      },
      {
        question: 'Why does the Declaration list grievances against British rule?',
        options: [
          'To ask for better trade terms',
          'To provide evidence that separation was justified',
          'To propose amendments to British law',
          'To divide territory among the colonies',
        ],
        answer: 1,
        why: 'The grievance list is the evidence for the larger argument that British rule had repeatedly violated colonial rights.',
      },
      {
        question: 'In the Declaration’s argument, what does the idea of a social contract mean?',
        options: [
          'People accept government authority in exchange for government protecting their rights',
          'Parliament may govern the colonies without their consent',
          'A king receives political power directly from God',
          'States may ignore any law they dislike',
        ],
        answer: 0,
        why: 'The social-contract idea links political authority to the people and to government’s responsibility to protect their rights.',
      },
    ],
    whatsNext: {
      body:
        'Independence created a new problem: thirteen states now had to build a government together.',
      bridge: [
        { label: 'Problem', title: 'How to unite 13 states?', note: 'The states wanted cooperation without another powerful central ruler.' },
        { label: 'First answer', title: 'Articles of Confederation', note: 'A deliberately weak national government begins the experiment.' },
      ],
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
      'The first national government was intentionally weak. It could handle diplomacy and war, but it struggled to raise money, manage trade, enforce decisions, or solve problems that crossed state lines.',
    question: 'How much power is too little?',

    deck: 'The first U.S. government had a Congress — but no separate president and no national Supreme Court.',
    intro:
      'Americans had just fought a war against a powerful central authority, so the Articles of Confederation were designed to protect state independence. The system formally took effect in 1781 after Maryland became the final state to ratify it. Congress could declare war, make treaties, borrow money, and manage western lands, but it relied heavily on the states for money and enforcement. By the mid-1780s, the central question was obvious: could a union survive if its national government could ask but often could not compel?',
    heroQuote: {
      text: 'Each state retains its sovereignty, freedom and independence…',
      source: 'Articles of Confederation, Article II',
    },
    hero: {
      src: 'assets/chapters/articles/hero-confederation-congress.jpg',
      alt: 'Delegates of the Confederation Congress bent over maps of the states and western territory',
    },

    bigPicture: {
      heading: 'Why was the first national government so weak?',
      body:
        'The weakness was partly intentional. States feared replacing British rule with another distant, powerful government. Under the Articles, each state had <strong>one vote in Congress</strong>. Congress could conduct diplomacy and war, but it could not <strong>levy direct federal taxes</strong> or <strong>regulate interstate commerce</strong>. There was <strong>no separate executive branch</strong>, <strong>no national court system</strong>, and the national government did not have exclusive control over coining money. Even changing the Articles required <strong>all thirteen states</strong> to agree.',
    },
    takeaways: [
      'Maryland became the final state to ratify the Articles on March 1, 1781, allowing the Confederation government formally to begin.',
      'Each state had one vote in Congress, whether it was large or small.',
      'Congress could make treaties and declare war, but it could not impose direct federal taxes or regulate interstate commerce, and it lacked a separate executive and national court system.',
      'The Confederation had real successes, especially the Treaty of Paris and the Northwest Ordinance, but it struggled with debt, trade disputes, and enforcement.',
      'Shays’ Rebellion in 1786–1787 increased fears that the national government was too weak to respond effectively to serious domestic problems.',
    ],
    facts: [
      {
        text:
          'Maryland was the thirteenth and final state to ratify the Articles. The Confederation government formally began on March 1, 1781.',
        name: 'Maryland finished the job',
        dates: 'March 1, 1781',
      },
      {
        text:
          'Under the Articles, tiny Delaware and populous Virginia each had exactly one vote in Congress.',
        name: 'One state, one vote',
        dates: 'Equal state voting',
      },
      {
        text:
          'George Washington resigned his military commission to Congress at the Maryland State House in Annapolis in 1783 — a dramatic example of military power returning to civilian authority.',
        name: 'A Maryland moment',
        dates: 'Annapolis · December 23, 1783',
      },
      {
        text:
          'The Northwest Ordinance of 1787 created a process for governing western territory and admitting new states — one of the Confederation Congress’s most important accomplishments.',
        name: 'A major success',
        dates: 'Northwest Ordinance · 1787',
      },
    ],
    closerLook: {
      title: 'What worked — and what broke?',
      body:
        'The Articles were not a total failure. Congress helped win recognition of American independence and created a plan for western territories. The problem was capacity: Congress often had national responsibilities without the national powers needed to carry them out. It could request money from states but not tax directly, could not create one national trade policy, and had no separate executive branch to enforce its decisions.',
      cta: 'Explore the system',
      images: [
        {
          src: 'assets/chapters/articles/closer/what-it-could-not-do.jpg',
          alt: 'The Articles of Confederation beside notes on unpaid debts and missing powers',
        },
      ],
      sections: [
        {
          label: '1781',
          note: 'Maryland becomes the 13th state to ratify; the Articles formally take effect.',
        },
        {
          label: '1783',
          note: 'Treaty of Paris recognizes U.S. independence; Washington resigns his commission in Annapolis.',
        },
        {
          label: '1786–87',
          note: 'Shays’ Rebellion exposes fears about debt, unrest, and the government’s limited ability to respond.',
        },
        {
          label: '1787',
          note: 'Northwest Ordinance succeeds — but delegates also gather in Philadelphia because deeper structural problems remain.',
        },
      ],
    },
    whyItMatters: {
      body:
        'The Constitution is easier to understand when you see it as an answer to the Articles. Federal taxing power, commerce power, an executive branch, a federal judiciary, and a more workable amendment process all respond to problems experienced during the 1780s.',
      connections: [
        { from: 'No direct federal tax', to: 'Need for national revenue' },
        { from: 'No commerce power', to: 'Interstate Commerce Clause' },
        { from: 'No separate executive or courts', to: 'A stronger federal structure' },
      ],
    },
    quiz: [
      {
        question: 'Which power did the national government lack under the Articles?',
        options: [
          'The power to declare war',
          'The power to make treaties',
          'The power to impose direct federal taxes',
          'The power to manage western territories',
        ],
        answer: 2,
        why: 'Congress could request money from states but could not levy direct federal taxes.',
      },
      {
        question: 'How was political power distributed under the Articles?',
        options: [
          'The national government held most power',
          'The states retained most power',
          'A president held final authority',
          'Federal courts controlled the states',
        ],
        answer: 1,
        why: 'The Articles created a loose confederation in which states retained broad sovereignty.',
      },
      {
        question: 'Why could Congress not create one national solution to trade disputes among states?',
        options: [
          'It had no power to regulate interstate commerce',
          'Congress met only once every five years',
          'Britain still controlled all American trade',
          'The states had no separate economies',
        ],
        answer: 0,
        why: 'The Articles did not give Congress a general power to regulate interstate commerce.',
      },
      {
        question: 'Why did Shays\' Rebellion worry supporters of a stronger national government?',
        options: [
          'It showed that Britain had retaken Massachusetts',
          'It highlighted how limited the national government was in responding to serious domestic unrest',
          'It proved the Northwest Ordinance had failed',
          'It showed that Congress was collecting too many taxes',
        ],
        answer: 1,
        why: 'The unrest strengthened arguments that the Confederation lacked enough centralized military and enforcement power to respond effectively to serious domestic disorder.',
      },
      {
        question: 'Why was changing the Articles so difficult?',
        options: [
          'Amendments required all thirteen states to agree',
          'Only a president could propose an amendment',
          'Britain had to approve every amendment',
          'There was no written amendment process',
        ],
        answer: 0,
        why: 'Unanimous state approval made structural reform extremely difficult.',
      },
    ],
    whatsNext: {
      body:
        'By 1787, the argument shifted from “Should the union have power?” to “How should that power be designed?”',
      bridge: [
        { label: 'Problem', title: 'Government too weak', note: 'National responsibilities existed without enough national power.' },
        { label: '1787', title: 'Philadelphia Convention', note: 'Delegates meet to revise the Articles and instead design a new system.' },
      ],
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
      'The delegates were solving a design problem: make the national government strong enough to act, but divide its power enough that no one institution could dominate.',
    question: 'How do you build a stronger government without creating another tyranny?',

    deck: 'One summer. Fifty-five delegates. A completely new design for government.',
    intro:
      'Delegates gathered in Philadelphia in 1787 with instructions to revise the Articles of Confederation. Instead, they designed a new Constitution. Fifty-five delegates from twelve states attended at some point; Rhode Island sent none. The major fights were about representation, national versus state power, the presidency, the courts, and slavery.',
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
        'The delegates wanted a government strong enough to tax, regulate commerce, enforce laws, and act for the whole country — but they also feared concentrated power. Their answer was to <strong>divide power twice</strong>: among legislative, executive, and judicial branches, and between the federal government and the states. Representation required another compromise: a <strong>House based on population</strong> and a <strong>Senate with equal representation for every state</strong>. Some compromises also protected slavery and increased the political power of slaveholding states.',
    },
    takeaways: [
      'The Convention met in Philadelphia from May to September 1787; 55 delegates attended at some point and George Washington presided.',
      'The Great Compromise created a House based on population and a Senate with equal representation for each state.',
      'Separation of powers gives the legislative, executive, and judicial branches different responsibilities.',
      'Checks and balances give each branch tools to limit the others, while federalism divides authority between national and state governments.',
      'The Electoral College was another compromise over how to choose the president; the Constitution also protected slavery through compromises including the Three-Fifths Clause.',
    ],
    facts: [
      {
        text:
          'Benjamin Franklin was 81, the oldest delegate at the Convention. Jonathan Dayton of New Jersey was 26, the youngest.',
        name: 'A 55-year age span',
        dates: 'Ages 26 to 81',
      },
      {
        text:
          'Fifty-five delegates attended at some point, but only thirty-nine signed the Constitution. Three of the forty-two present on the final day refused to sign.',
        name: '55 attended · 39 signed',
        dates: 'September 17, 1787',
      },
      {
        text:
          'The delegates agreed to keep their debates secret. The closed-door setting was meant to let members change positions and negotiate without constant outside pressure.',
        name: 'Secret deliberations',
        dates: 'Philadelphia · 1787',
      },
      {
        text:
          'George Mason, Elbridge Gerry, and Edmund Randolph were present on the final day but refused to sign. One major concern was the absence of a bill of rights.',
        name: 'Not everyone agreed',
        dates: '3 refused to sign',
      },
    ],
    closerLook: {
      title: 'Four problems they had to solve',
      body:
        'Think of the Constitution as a set of answers to four hard questions. How should large and small states share power? How strong should the national government be? How do you prevent one branch from taking over? And how would the new system deal with slavery? The answers were compromises — some ingenious, some deeply unjust.',
      cta: 'Explore the design',
      images: [
        {
          src: 'assets/chapters/convention/closer/we-the-people.jpg',
          alt: 'The opening of the Constitution — “We the People” and Article I — beside the flag',
        },
      ],
      sections: [
        {
          label: 'Representation',
          note: 'Great Compromise — House by population; Senate gives every state two senators.',
        },
        {
          label: 'Power',
          note: 'Federalism — national and state governments each have important powers.',
        },
        {
          label: 'Control',
          note: 'Separation of powers + checks and balances — divide the jobs and let branches restrain one another.',
        },
        {
          label: 'Slavery',
          note: 'Three-Fifths Clause — three-fifths of a state’s enslaved population was counted when apportioning House representation and direct taxes, increasing slaveholding states’ political power while enslaved people had no political rights.',
        },
      ],
    },
    whyItMatters: {
      body:
        'Most of the rest of AP Government is this design operating in real life: Congress making laws, presidents executing them, courts interpreting them, states sharing power with Washington, and institutions checking one another.',
      connections: [
        { from: 'Great Compromise', to: 'House + Senate' },
        { from: 'Separation of powers', to: 'Three branches' },
        { from: 'Federalism', to: 'National + state power' },
      ],
    },
    quiz: [
      {
        question: 'What did the Great Compromise resolve?',
        options: [
          'Whether to keep the Articles of Confederation',
          'How states would be represented in Congress',
          'Whether the president could veto legislation',
          'How federal judges would be appointed',
        ],
        answer: 1,
        why: 'It combined representation by population in the House with equal state representation in the Senate.',
      },
      {
        question: 'What problem was the Electoral College designed to address at the Convention?',
        options: [
          'How the president would be selected',
          'How Supreme Court justices would be removed',
          'How states would collect local taxes',
          'How amendments would be ratified',
        ],
        answer: 0,
        why: 'The Electoral College was the Convention’s compromise system for selecting the president through state-appointed electors rather than direct national popular vote or congressional selection.',
      },
      {
        question: 'What does separation of powers mean?',
        options: [
          'Different branches are assigned different responsibilities',
          'Each branch can restrain the others',
          'States and the national government share authority',
          'The people elect every federal official directly',
        ],
        answer: 0,
        why: 'Separation of powers divides government responsibilities among institutions.',
      },
      {
        question: 'What do checks and balances add to separation of powers?',
        options: [
          'They give each branch tools to restrain the others',
          'They divide power between states and the nation',
          'They make Congress supreme over every other branch',
          'They remove the need for elections',
        ],
        answer: 0,
        why: 'Separation divides the jobs; checks and balances give institutions ways to push back on one another.',
      },
      {
        question: 'What was the Three-Fifths Compromise about?',
        options: [
          'How enslaved people would be counted for representation and direct taxation',
          'How many states were needed to ratify',
          'How presidents would be elected',
          'How western territory would be divided',
        ],
        answer: 0,
        why: 'The clause counted enslaved people as three-fifths for representation and direct taxation, increasing representation for slaveholding states while enslaved people themselves had no political rights.',
      },
    ],
    whatsNext: {
      body:
        'Writing the Constitution was only step one. Americans still had to decide whether to accept it.',
      bridge: [
        { label: 'Debate', title: 'Federalists vs. Anti-Federalists', note: 'The fight centers on national power and protection of liberty.' },
        { label: 'Result', title: 'Ratification + Bill of Rights', note: 'The Constitution takes effect; amendments answer demands for explicit rights.' },
      ],
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
      'Ratification created a stronger federal government. The Bill of Rights then added explicit protections for individual liberty and reinforced the idea that government power has limits.',
    question: 'How can government be strong enough to work and still remain limited?',

    deck: 'The Constitution builds the system. The Bill of Rights draws important lines government should not cross.',
    intro:
      'The proposed Constitution needed nine states to ratify it. New Hampshire became the ninth in 1788, and the new federal government began operating in 1789. Federalists argued that the new structure was necessary for an effective union. Anti-Federalists warned that the national government might become too powerful and objected especially to the lack of a bill of rights. The First Congress responded by proposing amendments in 1789; ten were ratified in 1791.',
    heroQuote: {
      text: 'A bill of rights is what the people are entitled to against every government on earth.',
      source: 'Thomas Jefferson to James Madison, 1787',
    },
    hero: {
      src: 'assets/chapters/constitution-rights/hero-constitution-legacy.jpg',
      alt: 'The United States Capitol at sunset with the Constitution unfurled and Americans of many backgrounds looking on',
    },

    bigPicture: {
      heading: 'Constitution = structure. Bill of Rights = explicit protections.',
      body:
        'The Constitution limits power mainly by <strong>designing the government</strong>: three branches, checks and balances, federalism, elections, and a written list of powers and procedures. The Bill of Rights adds <strong>specific protections</strong> such as freedoms of religion, speech, press, assembly, due process, and protection from unreasonable searches. The <strong>Tenth Amendment</strong> also reinforces federalism by reserving powers not delegated to the United States — and not prohibited to the states — to the states or the people.',
    },
    takeaways: [
      'The original Constitution — not the Bill of Rights — creates the three branches: Article I Congress, Article II the presidency, and Article III the federal judiciary.',
      'Article VII required nine states to ratify the Constitution; New Hampshire became the ninth state in June 1788.',
      'Federalists supported ratification; Anti-Federalists feared excessive national power and pushed strongly for a bill of rights.',
      'Congress proposed twelve amendments in 1789; ten were ratified on December 15, 1791 and became the Bill of Rights.',
      'The Bill of Rights is the first ten amendments: it adds explicit protections for liberties and also reserves undelegated powers to the states or the people through the Tenth Amendment.',
    ],
    facts: [
      {
        text:
          'Nine states were enough to put the Constitution into effect among the ratifying states. New Hampshire became number nine in June 1788.',
        name: 'The magic number was 9',
        dates: 'New Hampshire · 1788',
      },
      {
        text:
          'Maryland was the seventh state to ratify the Constitution, joining the new framework before the required ninth state had been reached.',
        name: 'Maryland connection',
        dates: '7th state to ratify',
      },
      {
        text:
          'Congress proposed twelve amendments in 1789, but only ten were ratified in 1791. Those ten became the Bill of Rights.',
        name: '12 proposed → 10 ratified',
        dates: '1789 → 1791',
      },
      {
        text:
          'The three branches are NOT created by the Bill of Rights. They are in the original Constitution: Article I creates Congress, Article II establishes the presidency, and Article III establishes the federal judiciary.',
        name: 'Easy distinction',
        dates: 'Constitution = structure',
      },
      {
        text:
          'One of the two amendments that failed in 1791 was finally ratified more than 200 years later, in 1992, and became the Twenty-Seventh Amendment.',
        name: 'A 203-year wait',
        dates: '1789 → 1992',
      },
    ],
    closerLook: {
      title: 'Two layers: build the government, then protect rights',
      body:
        '<strong>The original Constitution (1787)</strong> builds the federal government: Articles I–III establish Congress, the presidency, and the federal judiciary; the Constitution also divides and checks political power. <strong>The Bill of Rights (1791)</strong> is the first ten amendments added afterward. It does not create the branches. It adds explicit protections for liberties and reinforces limits on government power.',
      cta: 'Explore the protections',
      images: [
        {
          src: 'assets/chapters/convention/closer/we-the-people.jpg',
          alt: 'The opening of the Constitution showing “We the People” and the beginning of Article I',
        },
      ],
      sections: [
        {
          label: 'CONSTITUTION · Articles I–III',
          note: 'Creates Congress, the presidency, and the federal judiciary. This is where the three branches come from.',
        },
        {
          label: 'CONSTITUTION · Checks & balances',
          note: 'Power is divided and shared so each branch has ways to limit the others.',
        },
        {
          label: 'BILL OF RIGHTS · First Amendment',
          note: 'Protects religion, speech, press, assembly, and petition from federal government infringement.',
        },
        {
          label: 'BILL OF RIGHTS · Tenth Amendment',
          note: 'Reserves powers not delegated to the United States, and not prohibited to the states, to the states or the people.',
        },
      ],
    },
    whyItMatters: {
      body:
        'Almost every later AP Government topic comes back to this framework: which level of government has power, how branches check each other, when government may restrict individual freedom, and how citizens use constitutional rights to participate.',
      connections: [
        { from: 'Articles I–III', to: 'Three branches' },
        { from: 'Checks + federalism', to: 'Power divided and limited' },
        { from: 'Bill of Rights', to: 'Explicit liberty protections' },
      ],
    },
    quiz: [
      {
        question: 'Why was the Bill of Rights added to the Constitution?',
        options: [
          'To give Congress more power over the states',
          'To answer demands for explicit protections of individual rights and limits on government',
          'To replace checks and balances with a list of freedoms',
          'To decide representation between large and small states',
        ],
        answer: 1,
        why: 'Anti-Federalist criticism and ratifying-state demands helped produce explicit protections for individual liberty.',
      },
      {
        question: 'Which document created the three branches of the federal government?',
        options: [
          'The Declaration of Independence',
          'The original Constitution in Articles I–III',
          'The Bill of Rights',
          'The Articles of Confederation',
        ],
        answer: 1,
        why: 'Articles I–III of the original Constitution establish Congress, the presidency, and the federal judiciary. The Bill of Rights came later as amendments.',
      },
      {
        question: 'What separated Federalists from Anti-Federalists during ratification?',
        options: [
          'Whether to declare independence from Britain',
          'Whether the proposed Constitution created too much national power and protected liberty enough',
          'Whether to keep a hereditary king',
          'Whether states should exist at all',
        ],
        answer: 1,
        why: 'Federalists defended the stronger national framework; Anti-Federalists feared concentrated power and pressed for explicit rights protections.',
      },
      {
        question: 'How many amendments did Congress propose in 1789, and how many were ratified in 1791?',
        options: [
          'Ten proposed, ten ratified',
          'Twelve proposed, ten ratified',
          'Twelve proposed, twelve ratified',
          'Fifteen proposed, ten ratified',
        ],
        answer: 1,
        why: 'Congress proposed twelve. Ten were ratified in 1791 and became the Bill of Rights.',
      },
      {
        question: 'What does the Tenth Amendment reinforce?',
        options: [
          'Freedom of speech',
          'Federalism by reserving undelegated powers to the states or the people',
          'The number of Supreme Court justices',
          'The president\'s veto power',
        ],
        answer: 1,
        why: 'The Tenth Amendment states that powers not delegated to the United States, and not prohibited to the states, are reserved to the states or the people.',
      },
    ],
    whatsNext: {
      body:
        'The founding story gives Ethan the blueprint. The rest of AP Government is about watching that blueprint operate.',
      bridge: [
        { label: 'Next', title: 'Institutions in action', note: 'Congress, presidency, courts, agencies, and federalism.' },
        { label: 'Then', title: 'Rights + participation', note: 'Civil liberties, elections, parties, beliefs, media, and citizen action.' },
      ],
    },
  }
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
