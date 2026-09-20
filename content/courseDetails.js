/* ---------------------------------------------------------------------------
   courseDetails.js — the Course page's per-unit summary content.

   Scope: the Course Map (#/course) only. See
   docs/COURSE_PAGE_IMPLEMENTATION_SPEC.md section 7.

   This is the content layer. pages/course-map.js renders the same component
   structure for all five units, so course material can be revised here
   without touching the UI.

   ===========================================================================
   STATUS: Checkpoint A — shell only
   ===========================================================================
   Every field below is intentionally empty. The renderer draws a neutral,
   labelled placeholder wherever a field is missing, so the layout can be
   reviewed before any content lands. Checkpoint B fills Unit 1; Checkpoint C
   fills Units 2–5.

   Fields per unit (all optional):

     hook          One line. The human question the unit answers.
     summary       2–3 plain-English sentences.
     bigQuestion   One sentence. The question the unit is trying to answer.
     visual        { src, alt, caption, credit } — one strong anchor image,
                   stored in assets/course-map/. No external hotlinks.
     model         { type, intro, nodes: [{ id, label, body }] }
                   The interactive concept model. Clicking a node reveals its
                   body; one node open at a time.
     coreIdeas     [{ title, note }] — 4 to 6 orientation items.
     remember      [string] — exactly 3 statements for "If you remember only
                   this…".
     quickCheck    { question, options: [string], answer: <index>, why }
     fullGuideRoute  A route such as '#/course/unit/1', or null. When null the
                   renderer shows a non-clickable "next phase" note rather
                   than a dead link.

   The unit number, official title and exam weighting are not repeated here —
   they come from content/course.js, which stays the single source for them.
   --------------------------------------------------------------------------- */

const EMPTY = {
  hook: null,
  summary: null,
  bigQuestion: null,
  visual: null,
  model: null,
  coreIdeas: [],
  remember: [],
  quickCheck: null,
  fullGuideRoute: null,
};

/** Keyed by unit number, matching content/course.js. */
export const COURSE_DETAILS = {
  1: { ...EMPTY },
  2: { ...EMPTY },
  3: { ...EMPTY },
  4: { ...EMPTY },
  5: { ...EMPTY },
};

/** Detail for a unit. Always returns an object, never undefined. */
export function getDetail(n) {
  return COURSE_DETAILS[Number(n)] || { ...EMPTY };
}
