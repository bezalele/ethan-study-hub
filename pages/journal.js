/* ---------------------------------------------------------------------------
   journal.js — Ethan's daily notes for this subject.

   Reached from "Ethan's Journal" in the shared header cluster — the same
   chip, in the same place, on all three subjects, so there is one address to
   give his mum. Writing the day's note has its own chip next to it, which
   opens an editor in place; this page is the record, and it is also where
   replies are read and answered.

   The list, the editing and the comment threads all come from
   shared/learning-log.js, which Biology and Math Quest mount the same way.
   It is a classic script, so it is already on window by the time this
   deferred module runs.
   --------------------------------------------------------------------------- */

import { el, html } from '../layout/dom.js?v=17';
import { courseLessons } from '../layout/layout.js?v=17';

export default {
  id: 'journal',
  nav: 'journal',
  title: 'Your notes',
  render() {
    const page = el('div', 'page page--journal');
    page.append(html(`
      <div class="shell jr-shell">
        <header class="jr-head jr-hero">
          <p class="eyebrow">After school</p>
          <h1 class="jr-title">What you learned, Ethan</h1>
          <p class="jr-intro">
            Write one short note a day. Pick any day on the calendar. Your mum
            and dad can react or comment, and you can reply.
          </p>
        </header>
        <div data-learning-history></div>
      </div>`));

    const slot = page.querySelector('[data-learning-history]');
    if (window.LearningLog) {
      window.LearningLog.mountHistory(slot, {
        subject: 'apgov',
        label: 'AP U.S. Government',
        learner: 'Ethan',
        /* The same list the header's note button offers, from the same
           place: two lists would drift. */
        lessons: courseLessons(),
      });
    } else {
      slot.textContent = 'Notes are unavailable in this browser.';
    }
    return page;
  },
};
