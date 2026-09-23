/* ---------------------------------------------------------------------------
   course.js — the five AP U.S. Government course areas.

   Carried over from the old app.js courseAreas array plus its parallel
   "hooks" array, merged into one record per area so the two can no longer
   drift out of alignment. Exam weights are College Board multiple-choice
   weightings.

   `detail` is the route to that unit's full study content. Only Unit 1 has
   one so far — the founding story. Set the others as their pages are built
   and the Course Map picks them up automatically; until then the panel says
   so rather than offering a link that goes nowhere.
   --------------------------------------------------------------------------- */

export const AREAS = [
  {
    n: 1,
    short: 'Foundations',
    title: 'Foundations of American Democracy',
    weight: '15–22%',
    question: 'Why was American government designed this way?',
    summary:
      'The Constitution, why government was designed this way, checks and balances, and federal versus state powers.',
    why: 'This is the origin story of the American system.',
    know: 'You learn why the Constitution was created, what problem it was trying to solve, and why power was divided and limited.',
    matters: 'Every later unit makes more sense once you understand this foundation.',
    lens: 'Start with the founding story, then connect each event to a principle of government.',
    detail: '#/study',
    chain: ['Declaration', 'Articles', 'Constitution', 'Bill of Rights'],
    topics: [
      'Ideals of democracy',
      'Declaration → Articles → Constitution',
      'Checks and balances',
      'Federalism',
    ],
  },
  {
    n: 2,
    short: 'Branches',
    title: 'Interactions Among Branches of Government',
    weight: '25–36%',
    question: 'Who has power — and how can the branches influence one another?',
    summary:
      'What Congress, the president, courts, and federal agencies do — and how they influence each other.',
    why: 'This is the machinery of the U.S. government.',
    know: 'You learn who makes the rules, who carries them out, who interprets them, and how each branch can stop the others from becoming too powerful.',
    matters:
      'When you hear “Congress,” “the White House,” or “the Supreme Court” in the news, this unit tells you who can actually do what.',
    lens: 'Think of this unit as a system: institutions have different jobs, but none works completely alone.',
    detail: null,
    chain: ['Congress makes laws', 'President executes', 'Agencies implement', 'Courts interpret'],
    topics: ['Congress', 'Presidency', 'Courts', 'Federal bureaucracy', 'Checks and balances'],
  },
  {
    n: 3,
    short: 'Rights',
    title: 'Civil Liberties and Civil Rights',
    weight: '13–18%',
    question: 'What freedoms are protected, and how has equal protection developed?',
    summary:
      'Individual freedoms, equal protection, the Bill of Rights, and important Supreme Court decisions.',
    why: 'This is where government power meets your freedom.',
    know: 'You learn what the Constitution protects, how the Bill of Rights works, and how courts have applied equality and liberty.',
    matters:
      'Speech, religion, privacy, due process, and equal protection are not abstract ideas — they affect real people.',
    lens: 'Keep two ideas separate: civil liberties protect freedoms; civil rights focus on equal treatment.',
    detail: null,
    chain: ['Bill of Rights', 'Fourteenth Amendment', 'Incorporation', 'Equal protection'],
    topics: [
      'Bill of Rights',
      'First Amendment',
      'Due process',
      'Equal protection',
      'Supreme Court cases',
    ],
  },
  {
    n: 4,
    short: 'Beliefs',
    title: 'American Political Ideologies and Beliefs',
    weight: '10–15%',
    question: 'Where do political beliefs come from, and how do we measure them?',
    summary:
      'How people develop political opinions, differences in political ideologies, and how public opinion is measured.',
    why: 'Politics begins before anyone enters a voting booth.',
    know: 'You learn how family, community, ideology, events, and information shape political beliefs — and how polls try to measure them.',
    matters:
      'It helps you separate what people believe from how we know what the public actually thinks.',
    lens: 'This unit asks both what people believe and how political scientists can measure those beliefs.',
    detail: null,
    chain: ['Experiences', 'Beliefs', 'Public opinion', 'Polling'],
    topics: [
      'Political socialization',
      'Public opinion',
      'Polling',
      'Ideology',
      'Policy views',
    ],
  },
  {
    n: 5,
    short: 'Participation',
    title: 'Political Participation',
    weight: '20–27%',
    question: 'How do people influence government and elections?',
    summary:
      'Voting, elections, political parties, interest groups, campaign financing, and the media.',
    why: 'This is how citizens turn beliefs into political action.',
    know: 'You learn how voting, parties, interest groups, campaigns, money, and media connect people to government.',
    matters:
      'It explains how ordinary people try to influence who governs and what government does.',
    lens: 'Participation is broader than voting: parties, groups, campaigns, media, and civic activity all connect people to government.',
    detail: null,
    chain: ['Citizens', 'Parties & groups', 'Campaigns & media', 'Government'],
    topics: [
      'Voting',
      'Elections',
      'Political parties',
      'Interest groups',
      'Campaign finance',
      'Media',
    ],
  },
];

/** Look up an area by its number. Returns undefined if out of range. */
export function getArea(n) {
  return AREAS.find((a) => a.n === Number(n));
}

/**
 * A topic's address inside its unit: 'Checks and balances' -> 'checks-and-balances'.
 *
 * The daily note links a topic as #/course/2/checks-and-balances, and the
 * Course Map uses the same slug as the id it scrolls to, so the two cannot
 * disagree about what a topic is called.
 */
export function topicSlug(topic) {
  return String(topic)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** The topic a slug names, or undefined. */
export function getTopic(n, slug) {
  const area = getArea(n);
  return area && area.topics.find((t) => topicSlug(t) === slug);
}
