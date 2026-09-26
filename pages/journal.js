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

import { el, html } from '../layout/dom.js?v=20';
import { courseLessons } from '../layout/layout.js?v=20';

/* How AP Gov is going, for the panel under the journal's calendar.
   Two things count on this subject: the chapter quizzes, and the quick check
   at the end of each unit. Both are kept; both sync. */
function journalStatus() {
  const done = [];
  let scores = {};
  try { scores = JSON.parse(localStorage.getItem('ethanQuizScoresV1') || '{}') || {}; } catch (e) { /* private window */ }
  const chapters = Object.keys(scores);
  const best = chapters.reduce((n, c) => n + (Number(scores[c].best) || 0), 0);
  const outOf = chapters.reduce((n, c) => n + (Number(scores[c].total) || 0), 0);
  if (chapters.length) {
    done.push(`${chapters.length} chapter quiz${chapters.length === 1 ? '' : 'zes'} taken` +
      (outOf ? ` \u00b7 best ${best} of ${outOf}` : ''));
  }

  const units = (window.ApGovProgress ? window.ApGovProgress.read().units : {}) || {};
  const checked = Object.keys(units);
  if (checked.length) {
    const right = checked.reduce((n, u) => n + (Number(units[u].best) || 0), 0);
    const all = checked.reduce((n, u) => n + (Number(units[u].total) || 0), 0);
    done.push(`${checked.length} unit quick check${checked.length === 1 ? '' : 's'} done` +
      (all ? ` \u00b7 best ${right} of ${all}` : ''));
  }

  let nudge = null;
  const areas = (window.EthanStudyHubContent && window.EthanStudyHubContent.units) || [];
  const next = areas.filter((u) => !checked.includes(String(u.id)))[0];
  if (!chapters.length && !checked.length) {
    nudge = { text: 'The founding story is five short chapters \u2014 start anywhere.',
      href: '#/study/colonies', label: 'Open it' };
  } else if (next) {
    nudge = { text: `Unit ${next.id} has a quick check you have not tried.`,
      href: `#/course/${next.id}`, label: 'Try it' };
  }
  return { done, nudge };
}

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
            One short note a day. Your mum and dad can react or comment,
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
        /* The same list the header's note button offers, from the same
           place: two lists would drift. */
        lessons: courseLessons(),
        status: journalStatus,
      });
    } else {
      slot.textContent = 'Notes are unavailable in this browser.';
    }
    return page;
  },
};
