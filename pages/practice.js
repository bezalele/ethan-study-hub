/* ---------------------------------------------------------------------------
   practice.js — recall questions.

   Reads content/contentData.js, which is loaded as a classic script and so is
   already on window by the time this deferred module runs.

   The old version used inline onclick to reveal answers. This uses a real
   listener and <details>, so it works with the keyboard and a screen reader.
   --------------------------------------------------------------------------- */

import { el, html, esc } from '../layout/dom.js?v=8';

function questions() {
  const data = window.EthanStudyHubContent;
  return (data && data.practiceQuestions) || [];
}

export default {
  id: 'practice',
  nav: 'study',
  title: 'Practice',
  render() {
    const page = el('div', 'page page--practice');
    const list = questions();

    const cards = list.map(([q, a], i) => `
      <li>
        <details class="pr-card">
          <summary class="pr-card__q">
            <span class="pr-card__n">${String(i + 1).padStart(2, '0')}</span>
            <span>${esc(q)}</span>
          </summary>
          <p class="pr-card__a">${esc(a)}</p>
        </details>
      </li>`).join('');

    page.append(html(`
      <div>
        <section class="pr-banner">
          <div class="pr-banner__inner shell">
            <p class="eyebrow eyebrow--on-dark">Practice after understanding</p>
            <h1>Can you explain it?</h1>
            <p class="pr-banner__deck">
              Say your answer out loud first, then open the card. If you cannot
              explain it without the notes, go back to the chapter.
            </p>
          </div>
        </section>

        <div class="pr-body shell">
          ${list.length
            ? `<ol class="pr-list">${cards}</ol>`
            : '<p class="pr-empty">No practice questions are loaded.</p>'}

          <aside class="pr-plan">
            <p class="eyebrow">Tonight&rsquo;s first session</p>
            <ol class="pr-plan__steps">
              <li>Walk the founding story together.</li>
              <li>Ethan explains &ldquo;too strong &rarr; too weak &rarr; balance&rdquo; without notes.</li>
              <li>Zoom into the Constitution.</li>
              <li>Work through the questions here.</li>
            </ol>
            <a class="btn btn--ghost" href="#/study">Back to the story →</a>
          </aside>
        </div>
      </div>`));

    return page;
  },
};
