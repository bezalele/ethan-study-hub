/* ---------------------------------------------------------------------------
   journal.js — Ethan's daily notes for this subject.

   Reached from "Today's note" in the main nav. Writing the day's note and
   reading the record are the same page rather than a modal over whatever
   page you happened to be on: one place to go, and the history is in front
   of you while you write.

   The list, the editing and the comment threads all come from
   shared/learning-log.js, which Biology and Math Quest mount the same way.
   It is a classic script, so it is already on window by the time this
   deferred module runs.
   --------------------------------------------------------------------------- */

import { el, html } from '../layout/dom.js?v=9';

export default {
  id: 'journal',
  nav: 'journal',
  title: 'Your notes',
  render() {
    const page = el('div', 'page page--journal');
    page.append(html(`
      <div class="shell jr-shell">
        <header class="jr-head">
          <p class="eyebrow">After school</p>
          <h1 class="jr-title">What you learned, Ethan</h1>
          <p class="jr-intro">
            Write one short note a day. Your dad can comment on any of them,
            and you can reply.
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
      });
    } else {
      slot.textContent = 'Notes are unavailable in this browser.';
    }
    return page;
  },
};
