/* ---------------------------------------------------------------------------
   lessons.js — the study lessons that sit under each unit on the Course page.

   Two things live here:

     LESSON_INDEX   the cards shown under "What Unit 1 covers" — a picture, a
                    sentence, and a way in. The AP topic numbers are carried
                    as quiet metadata, not as the thing the student reads
                    first. Nobody ever asked to learn "topic 1.7".

     LESSONS        the lessons themselves, keyed unit → slug. A lesson is
                    data, not markup: course-map.js decides how each section
                    is drawn, so the same shapes can be reused as lessons 1-4
                    are written.

   Only Federalism is built. The other four are listed with `ready: false`,
   which renders them as a card that says so rather than as a dead link.

   Sources for every factual claim are in content/SOURCES.md. Image credits
   travel with the image, in the `credit` field beside it.
   --------------------------------------------------------------------------- */

/* --- What Unit 1 covers ---------------------------------------------------- */

export const LESSON_INDEX = {
  1: [
    {
      slug: 'why-democracy',
      n: 1,
      title: 'Why Democracy?',
      blurb: 'Why govern by consent at all — and what the founders thought the alternative was.',
      ap: 'AP 1.1',
      image: 'assets/chapters/colonies/house-of-burgesses.jpg',
      alt: 'The House of Burgesses in session in colonial Virginia',
      ready: false,
    },
    {
      slug: 'who-should-have-power',
      n: 2,
      title: 'Who Should Have Power?',
      blurb: 'Natural rights, popular sovereignty, and the argument that a people may replace their government.',
      ap: 'AP 1.2–1.3',
      image: 'assets/chapters/declaration/presentation-to-congress.jpg',
      alt: 'The drafting committee presenting the Declaration of Independence to Congress',
      ready: false,
    },
    {
      slug: 'building-a-new-government',
      n: 3,
      title: 'Building a New Government',
      blurb: 'The Articles of Confederation, what they could not do, and why Philadelphia happened.',
      ap: 'AP 1.4–1.5',
      image: 'assets/chapters/articles/hero-confederation-congress.jpg',
      alt: 'The Confederation Congress meeting in session',
      ready: false,
    },
    {
      slug: 'dividing-power',
      n: 4,
      title: 'How the Constitution Divides Power',
      blurb: 'Separation of powers and checks and balances — three branches, each able to restrain the others.',
      ap: 'AP 1.6',
      image: 'assets/chapters/convention/signing-constitution.jpg',
      alt: 'The signing of the Constitution at the Philadelphia convention',
      ready: false,
    },
    {
      slug: 'federalism',
      n: 5,
      title: 'Federalism — Federal, State, or Both?',
      blurb: 'The Constitution splits authority between Washington and the states. Here is how the line is drawn.',
      ap: 'AP 1.7–1.9',
      image: 'assets/course-map/federalism/capitol.jpg',
      alt: 'The United States Capitol seen from the West Front',
      ready: true,
    },
  ],
};

/* --- The lessons ----------------------------------------------------------- */

const FEDERALISM = {
  slug: 'federalism',
  unit: 1,
  n: 5,
  title: 'Federalism — Federal, State, or Both?',
  ap: 'AP 1.7–1.9',

  /* The lesson opens on a question, not a definition. */
  question: 'Who gets to decide — Washington, the state, or both?',
  opening: [
    'The Constitution divides governing authority between the national government and state governments.',
    'Some powers belong primarily to one level; others are exercised by both.',
  ],

  /* --- The centrepiece: three kinds of power ------------------------------- */
  /* Two real buildings, because "federal" and "state" are places a
     fourteen-year-old can point at. The Maryland State House is forty
     minutes from home, which is the point of choosing it. */
  sorter: {
    intro: 'Three kinds of power. Pick any example to see what it means in practice.',
    columns: [
      {
        key: 'federal',
        label: 'Federal',
        kind: 'Enumerated powers',
        gloss: 'Listed for the national government in the Constitution.',
        image: 'assets/course-map/federalism/capitol.jpg',
        alt: 'The United States Capitol, where Congress meets',
        credit: 'U.S. Capitol · public domain',
        items: [
          {
            title: 'Coin money',
            body: 'Only the national government issues United States currency. A state cannot print its own dollars, which is why money works the same way in every state you drive through.',
          },
          {
            title: 'Declare war',
            body: 'The power to take the country to war belongs to Congress. A governor cannot declare war on another country, however strongly a state feels about it.',
          },
          {
            title: 'Regulate interstate and foreign commerce',
            body: 'Trade that crosses state lines, or the national border, is regulated nationally. One set of rules for goods moving between states beats fifty competing sets.',
          },
        ],
      },
      {
        key: 'state',
        label: 'State',
        kind: 'Reserved powers',
        gloss: 'Not given to the nation, so they stay with the states.',
        image: 'assets/course-map/federalism/maryland-state-house.jpg',
        alt: 'The Maryland State House in Annapolis, where the state legislature meets',
        credit: 'Maryland State House, Annapolis · CC0',
        items: [
          {
            title: 'Create local governments',
            body: 'Counties, cities and towns are created under state law. The Constitution never mentions your county — Maryland does.',
          },
            {
            title: 'Administer state and local elections',
            body: 'States run the elections, including federal ones: they set the polling places, the registration rules and the ballots. This is why voting can look different from one state to the next.',
          },
          {
            title: 'Establish and operate public schools',
            body: 'Public schools are set up and run by the states and the districts they create. Your school day is decided far closer to home than Washington.',
          },
        ],
      },
      {
        key: 'both',
        label: 'Both',
        kind: 'Concurrent powers',
        gloss: 'Exercised by each level, within its own authority.',
        /* Both buildings, because "both" is the whole idea of this column.
           The Supreme Court is a federal institution and would have argued
           against the point it was standing on. */
        image: 'assets/course-map/federalism/both.jpg',
        alt: 'The United States Capitol and the Maryland State House, side by side',
        credit: 'Capitol and Maryland State House · public domain / CC0',
        items: [
          {
            title: 'Tax',
            body: 'Both levels tax. Federal income tax comes out of a paycheck; so, in most states, does a state income tax — two governments, two bills, same paycheck.',
          },
          {
            title: 'Borrow money',
            body: 'The national government borrows, and so do states, usually to build things that last longer than one budget year.',
          },
          {
            title: 'Establish courts',
            body: 'There is a federal court system and a separate court system in every state. Which one hears a case depends on what the case is about.',
          },
          {
            title: 'Make and enforce laws',
            body: 'Each government makes and enforces laws within its own constitutional authority. That last clause is the whole difficulty, and the rest of this lesson is about it.',
          },
        ],
      },
    ],
  },

  /* --- Reserved powers, given room of its own ------------------------------ */
  reserved: {
    label: 'Reserved powers',
    lead: 'Powers not delegated to the United States by the Constitution, and not prohibited to the states, are reserved to the states or the people.',
    amendment: 'Tenth Amendment',
    flow: [
      {
        step: 'Powers given to the federal government',
        body: 'The Constitution lists them — coining money, declaring war, regulating commerce between the states.',
      },
      {
        step: 'Powers not given',
        body: 'Everything the Constitution does not hand to the nation, and does not forbid the states.',
      },
      {
        step: 'Reserved to the states, or the people',
        body: 'That remainder stays where it was. It is the default setting of the whole system.',
      },
    ],
    didYouKnow: 'The Tenth Amendment is only 28 words long.',
  },

  /* --- Where the power comes from ----------------------------------------- */
  anchors: {
    lead: 'Four places in the Constitution do most of the work. Pick one.',
    items: [
      {
        key: 'enumerated',
        title: 'Article I, Section 8',
        tag: 'Enumerated powers',
        body: 'This is the list of what Congress may do — tax, borrow, coin money, declare war, regulate commerce among the states. When people say a power is "enumerated", this is usually the list they mean.',
      },
      {
        key: 'necessary',
        title: 'Necessary and Proper Clause',
        tag: 'Article I, Section 8',
        body: 'At the end of that same list, Congress may make laws "necessary and proper" for carrying out its powers. It is the reason federal authority reaches further than the list alone would suggest.',
      },
      {
        key: 'supremacy',
        title: 'Supremacy Clause',
        tag: 'Article VI',
        body: 'Where valid federal law and state law genuinely conflict, federal law prevails. It settles which rule wins; it does not, by itself, decide what the federal government may regulate in the first place.',
      },
      {
        key: 'tenth',
        title: 'Tenth Amendment',
        tag: 'Bill of Rights, 1791',
        body: 'Powers not given to the nation, and not denied to the states, are reserved to the states or the people. It is the constitutional home of reserved powers.',
      },
    ],
  },

  /* --- Two cases, drawn the same way so they can be compared -------------- */
  cases: {
    lead: 'The line between national and state power is not fixed. The Supreme Court is where it gets argued.',
    image: 'assets/course-map/federalism/supreme-court.jpg',
    alt: 'The west facade of the Supreme Court, inscribed Equal Justice Under Law',
    credit: 'Supreme Court of the United States · public domain',
    items: [
      {
        name: 'McCulloch v. Maryland',
        year: '1819',
        question: 'Could Maryland tax a bank created by Congress?',
        held: 'No. The Court upheld implied federal power under the Necessary and Proper Clause, and held that federal law prevailed over Maryland’s tax on the national bank.',
        model: 'Federal authority confirmed and extended',
        direction: 'up',
      },
      {
        name: 'United States v. Lopez',
        year: '1995',
        question: 'Could Congress ban guns near schools under its commerce power?',
        held: 'No. The Court held that the Gun-Free School Zones Act exceeded Congress’s authority under the Commerce Clause.',
        model: 'Commerce Clause power has limits',
        direction: 'down',
      },
    ],
  },

  /* --- What it looks like from the outside -------------------------------- */
  realLife: {
    lead: 'Most of the time the two levels are not arguing. They are working on the same thing from different ends.',
    flow: [
      { step: 'Federal funding', body: 'Congress appropriates money for a purpose — highways, school programmes, health coverage.' },
      { step: 'Conditions attached', body: 'The money arrives with requirements about how it may be spent and what must be reported.' },
      { step: 'State administration', body: 'States and their agencies run the actual programme, and usually add money of their own.' },
      { step: 'Shared responsibility', body: 'The road gets built. Both governments had a hand in it, and neither did it alone.' },
    ],
    note: 'This is how a great deal of American government actually runs: national money, state delivery, shared credit and shared argument.',
  },

  /* --- The three sentences worth keeping ---------------------------------- */
  remember: [
    'Federalism divides power between the national and state governments.',
    'Enumerated powers belong to the federal government; reserved powers remain with the states or the people; concurrent powers can be exercised by both.',
    'The Supreme Court helps define where the boundary between national and state power lies.',
  ],

  /* --- The sorter challenge ----------------------------------------------- */
  /* Six scenarios, one on screen at a time, answered before moving on. The
     brief's six required examples are all here. */
  challenge: {
    lead: 'One at a time. Which level of government?',
    questions: [
      {
        prompt: 'Printing and issuing United States dollars',
        answer: 'federal',
        why: 'Coining money is an enumerated federal power. A state cannot issue its own currency — that is the whole reason a dollar spends the same in Maryland as in Texas.',
      },
      {
        prompt: 'Deciding what your high school teaches and when the school year starts',
        answer: 'state',
        why: 'Public schools are a reserved power. The Constitution never mentions schools, so the authority stays with the states and the districts they create.',
      },
      {
        prompt: 'Collecting income tax from a paycheck',
        answer: 'both',
        why: 'Taxing is concurrent. The federal government taxes income, and so do most states — two separate governments, each acting under its own authority.',
      },
      {
        prompt: 'Declaring war on another country',
        answer: 'federal',
        why: 'Declaring war belongs to Congress alone. No governor and no state legislature can take the country to war.',
      },
      {
        prompt: 'Setting polling places and running the voter registration system',
        answer: 'state',
        why: 'States administer elections — even federal ones. That is why the ballot and the registration deadline can differ from one state to the next.',
      },
      {
        prompt: 'Operating a court system that hears criminal cases',
        answer: 'both',
        why: 'Courts are concurrent. There is a federal court system and a separate court system in every state; which one hears a case depends on what the case is about.',
      },
    ],
  },

  /* --- The evaluation ------------------------------------------------------ */
  /* One conceptual, one applied, one tied to a case - plus two more that
     earn their place. Feedback says why, not just whether. */
  check: [
    {
      question: 'What does federalism actually divide?',
      options: [
        'Power between the three branches of the national government',
        'Power between the national government and the state governments',
        'Power between the two houses of Congress',
        'Power between the government and private citizens',
      ],
      answer: 1,
      why: 'Federalism is the vertical division — nation and states. Dividing power among three branches is separation of powers, which is a different idea in the same Constitution.',
    },
    {
      question: 'A state wants to run its own currency alongside the dollar. Can it?',
      options: [
        'Yes, because currency is a concurrent power',
        'Yes, if the state legislature votes for it',
        'No, because coining money is an enumerated federal power',
        'No, because the Tenth Amendment forbids all state economic laws',
      ],
      answer: 2,
      why: 'Coining money is on the federal list, so it is not left over for the states. The Tenth Amendment is about what is not given away — it does not forbid state economic laws generally.',
    },
    {
      question: 'Which power is genuinely exercised by both levels?',
      options: [
        'Declaring war',
        'Establishing courts',
        'Administering state elections',
        'Regulating commerce between the states',
      ],
      answer: 1,
      why: 'Both governments run court systems. The other three sit on one side of the line: war and interstate commerce are federal, and running elections is reserved to the states.',
    },
    {
      question: 'In McCulloch v. Maryland (1819), what did the Court decide?',
      options: [
        'Maryland could tax the national bank because banking is a state matter',
        'Congress had implied power to create the bank, and Maryland could not tax it',
        'The bank was unconstitutional and had to close',
        'The question was for Congress, not the courts, to answer',
      ],
      answer: 1,
      why: 'The Court upheld implied federal power under the Necessary and Proper Clause and held that federal law prevailed over the state tax. It is the case usually cited for federal authority reaching beyond the bare list.',
    },
    {
      question: 'United States v. Lopez (1995) is remembered as the case where the Court’s answer was, in effect:',
      options: [
        'Federal commerce power has limits',
        'States may ignore federal law they disagree with',
        'Congress may regulate anything affecting the economy',
        'Schools are a federal responsibility',
      ],
      answer: 0,
      why: 'The Court held the Gun-Free School Zones Act went beyond the Commerce Clause. It did not give states a veto over federal law — it marked an outer edge on one federal power.',
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
