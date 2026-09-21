/* ---------------------------------------------------------------------------
   journal.js — Ethan's daily notes for this subject.

   The record behind the "Today's note" button in the header. There is no nav
   item for it, because this page's nav is three items and adding a fourth
   would change the chrome on every page; the way in is the header button and
   the link inside its editor.

   The list, the editing and the comment threads all come from
   shared/learning-log.js, which Biology and Math Quest mount the same way.
   It is a classic script, so it is already on window by the time this
   deferred module runs.
   --------------------------------------------------------------------------- */

import { el, html } from '../layout/dom.js?v=8';

export default {
  id: 'journal',
  nav: '',
  title: 'Your notes',
  render() {
    const page = el('div', 'page page--journal');
    page.append(html(`
      <div class="shell jr-shell">
        <header class="jr-head">
          <p class="eyebrow">After school</p>
          <h1 class="jr-title">What you learned, Ethan</h1>
          <p class="jr-intro">
            One short note a day. Your dad can comment on any of them, and you
            can reply.
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
