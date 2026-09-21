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
   Units 1 and 2 are complete. Units 3–5 are empty and render neutral
   labelled placeholders until the next checkpoint.

   Fields per unit (all optional):

     hook          One line. The human question the unit answers.
     summary       2–3 plain-English sentences.
     bigQuestion   One sentence. The question the unit is trying to answer.
     model         The interactive centrepiece. Two types so far:

                   `type: 'documents'` — a sequence the student clicks through:
                     { type, intro, nodes: [{ id, step, label, thumb, image,
                       alt, credit, did, next }] }
                   `did`  — what this document actually did.
                   `next` — why the following step became necessary. Omit on
                            the last node.

                   `type: 'triangle'` — three branches and the checks between
                   them:
                     { type, intro, nodes: [{ id, label, article, role, note,
                       image: { src, alt, credit } | null, does, powers, why }],
                       checks: [{ id, from, to, label, body }],
                       flow: { label, steps: [string] } }
                   `note` is the plain-English "what this actually is", shown
                   in a framed card under the diagram without anyone having to
                   click. `does`/`powers`/`why` are the longer read that
                   appears when the branch is selected.
                   Branch art is a 16:9 band across the top of the card, so
                   the image wants its subject clear of the very bottom.
                   A check names the two branches it runs between, so
                   selecting it can highlight that edge. `flow` is an optional
                   secondary strip and stays subordinate to the triangle.
     coreIdeas     [{ title, note }] — 4 to 6 orientation items.
     remember      [string] — exactly 3 statements.
     quickCheck    [{ question, options: [string], answer: <index>, why }]
                   Three or more. They are paged one at a time and scored out
                   of the total.
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
  quickCheck: [],
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

    quickCheck: [
      {
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
      {
        question: 'Which weakness of the Articles of Confederation pushed the states toward a convention?',
        options: [
          'The national government could not tax directly or regulate trade between the states',
          'The national government had grown too powerful for the states to control',
          'The Articles gave the president too much authority',
          'The Articles created a national court that overruled the states',
        ],
        answer: 0,
        why:
          'Under the Articles there was no executive and no national court, and Congress had to ask the states for money. Without the power to tax or to settle trade disputes, it could not pay debts or hold commerce together.',
      },
      {
        question: 'What was the Bill of Rights added to do?',
        options: [
          'Set out how Congress elects the president',
          'Give the federal government powers the Constitution had left out',
          'Write down specific protections, answering the fear that the new federal government was too strong',
          'Replace the Articles of Confederation',
        ],
        answer: 2,
        why:
          'Anti-Federalists argued that structure alone would not protect liberty. The first ten amendments name particular protections, and the Tenth reserves undelegated powers to the states and the people.',
      },
    ],

    fullGuideRoute: null,
  },

  2: {
    hook: 'Who does what in Washington — and who can stop whom?',
    summary:
      'Congress, the president, the federal courts, and the bureaucracy have different jobs. Government policy emerges from how those institutions share power, compete, cooperate, and check one another.',
    bigQuestion: 'How do the branches use power and influence one another?',

    model: {
      type: 'triangle',
      intro:
        'Three branches, joined by the checks that run between them. Click a branch card, or click a check on one of the arrows — one at a time.',
      nodes: [
        {
          id: 'congress',
          label: 'Congress',
          article: 'Article I',
          role: 'Makes federal law',
          note:
            'Two chambers: the House of Representatives and the Senate. Members are elected, and both chambers have to pass the same bill before it can become law. Congress also controls federal taxing and spending.',
          image: {
            src: 'assets/course-map/branch-congress.jpg',
            alt: 'The dome of the United States Capitol at sunset',
            credit: 'United States Capitol',
          },
          does:
            'Writes and passes federal legislation. The House and Senate must both agree on a bill before it can become law.',
          powers:
            'Taxing and spending, regulating commerce, declaring war, confirming appointments (Senate), and impeachment.',
          why:
            'Control of money and law-making makes Congress central to almost any major federal policy.',
        },
        {
          id: 'president',
          label: 'President',
          article: 'Article II',
          role: 'Carries out the law',
          note:
            'One elected president, heading the executive branch — the departments and agencies that actually run federal programmes. The president does not write statutes; the job is to enforce the ones Congress passes.',
          // NEEDS-ART: the other two cards are crops of the constitution
          // chapter's painted sunset. Nothing in the repo shows the White
          // House, so this one is a flat illustration set against a stretch
          // of that same sky — close enough in palette to sit beside them,
          // but not the painting the others are. Replace the file when a
          // proper illustration exists; nothing else has to change.
          image: {
            src: 'assets/course-map/branch-president.jpg',
            alt: 'Illustration of the White House at sunset',
            credit: 'The White House',
          },
          does:
            'Heads the executive branch and is responsible for enforcing the laws Congress passes, directing federal agencies and foreign policy.',
          powers:
            'Veto, appointments, commander in chief, executive orders directing how the executive branch operates.',
          why:
            'The president acts faster than Congress can, which is why so much conflict is about the limits of executive power.',
        },
        {
          id: 'courts',
          label: 'Federal Courts',
          article: 'Article III',
          role: 'Interprets the law',
          note:
            'The Supreme Court and the lower federal courts. Judges are appointed, not elected, and serve for life on good behaviour. They only act on cases people actually bring to them.',
          image: {
            src: 'assets/course-map/branch-courts.jpg',
            alt: 'Columns of the Supreme Court beside the Contemplation of Justice statue',
            credit: 'Supreme Court of the United States',
          },
          does:
            'Decides cases brought before them, including whether a law or an executive action conflicts with the Constitution.',
          powers:
            'Judicial review, lifetime appointments on good behaviour, and final say on constitutional meaning in the cases they hear.',
          why:
            'Courts do not act on their own — someone has to bring a case — but when they rule, the ruling binds the other branches.',
        },
      ],
      checks: [
        {
          id: 'veto', from: 'president', to: 'congress', label: 'Veto',
          body: 'The president can refuse to sign a bill Congress has passed, which stops it from becoming law.',
        },
        {
          id: 'override', from: 'congress', to: 'president', label: 'Override',
          body: 'Congress can pass a vetoed bill anyway with a two-thirds vote in both chambers. It is difficult, which is why most vetoes hold.',
        },
        {
          id: 'appoint', from: 'president', to: 'courts', label: 'Appoints judges',
          body: 'The president nominates federal judges and justices — a lasting influence, because those appointments are for life on good behaviour.',
        },
        {
          id: 'confirm', from: 'congress', to: 'president', label: 'Senate confirms',
          body: 'The Senate votes on judicial nominees and major executive appointments. No confirmation, no appointment.',
        },
        {
          id: 'review-law', from: 'courts', to: 'congress', label: 'Strikes down laws',
          body: 'In a case before them, the courts can rule that a law passed by Congress conflicts with the Constitution and cannot be enforced.',
        },
        {
          id: 'review-exec', from: 'courts', to: 'president', label: 'Strikes down actions',
          body: 'The courts can also rule that an executive action exceeds the president’s constitutional or statutory authority.',
        },
        {
          id: 'impeach', from: 'congress', to: 'president', label: 'Impeachment',
          body: 'The House can impeach a president, other officials, or federal judges; the Senate then holds the trial and can remove them.',
        },
      ],
      flow: {
        label: 'How one law actually moves',
        steps: [
          'Congress passes a bill',
          'President signs or vetoes',
          'Agencies carry it out',
          'Courts review disputes',
        ],
      },
    },

    coreIdeas: [
      { title: 'House and Senate', note: 'Two chambers, different rules and terms.' },
      { title: 'Presidential powers', note: 'Enforcement, veto, appointments, foreign policy.' },
      { title: 'Federal courts', note: 'Decide cases and interpret the Constitution.' },
      { title: 'Checks and balances', note: 'Each branch holds tools against the others.' },
      { title: 'Federal bureaucracy', note: 'Agencies turn law into day-to-day rules.' },
      { title: 'Policymaking', note: 'Major action usually needs more than one branch.' },
    ],

    remember: [
      'The branches have different constitutional roles.',
      'Their powers overlap enough that major action often requires interaction.',
      'Checks and balances make concentrated power harder, and can also create conflict or delay.',
    ],

    quickCheck: [
      {
        question: 'Which idea best explains why a president cannot normally make a federal statute alone?',
        options: [
          'The president may only act during a declared emergency',
          'Federal lawmaking ordinarily runs through Congress, with the president signing or vetoing',
          'Only the Supreme Court may write federal law',
          'Statutes must first be approved by the states',
        ],
        answer: 1,
        why:
          'Making a statute is Congress’s job. The president takes part by signing or vetoing, and can direct the executive branch — but that is not the same as writing law.',
      },
      {
        question: 'Congress has passed a bill and the president has vetoed it. What can Congress still do?',
        options: [
          'Nothing; a veto ends the bill',
          'Send the bill to the Supreme Court to be signed instead',
          'Pass it over the veto with a two-thirds vote in both chambers',
          'Pass it over the veto with a simple majority in the Senate',
        ],
        answer: 2,
        why:
          'An override needs two thirds of both the House and the Senate. That is a high bar, which is why most vetoes hold — the check exists, but it is hard to use.',
      },
      {
        question: 'Why is appointing a federal judge one of a president’s most lasting powers?',
        options: [
          'Judges serve for life on good behaviour, so they outlast the president who appointed them',
          'Judges may veto bills the president dislikes',
          'The president can remove a judge who rules the wrong way',
          'Judges must follow the instructions of the president who appointed them',
        ],
        answer: 0,
        why:
          'The Senate has to confirm the nominee, but once confirmed a judge stays. A president serves at most eight years; an appointment can shape rulings for decades.',
      },
    ],

    fullGuideRoute: null,
  },
  3: { ...EMPTY },
  4: { ...EMPTY },
  5: { ...EMPTY },
};

/** Detail for a unit. Always returns an object, never undefined. */
export function getDetail(n) {
  return COURSE_DETAILS[Number(n)] || { ...EMPTY };
}
