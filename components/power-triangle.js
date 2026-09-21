/* A power triangle: Congress at the top, the president bottom left, the
   courts bottom right, with the checks that run between them.

   Node positions are percentages inside a fixed-ratio box. The connecting
   lines are one SVG stretched over the same box, so the diagram stays aligned
   at any width without measuring anything in JavaScript.

   Selecting a branch or a check replaces the explanation below the diagram.
   Only one is ever active. */

const TRI_POS = {
  congress:  { x: 50, y: 13 },
  president: { x: 15, y: 84 },
  courts:    { x: 85, y: 84 },
};

/* Small neutral marks. The repo has no White House or Supreme Court
   photographs, and a power diagram reads better as a diagram than as three
   building photos, so these are drawn rather than pictured. */
const TRI_ICON = {
  congress: '<path d="M2 20h24M4 20V10M9 20V10M15 20V10M20 20V10M24 20V10M14 2l11 6H3l11-6Z"/>',
  president: '<path d="M3 21h22M5 21V9h18v12M9 21v-6h4v6M16 13h4M14 3v4M9 9l5-3 5 3"/>',
  courts: '<path d="M4 21h20M6 21V11M11 21V11M17 21V11M22 21V11M14 2l11 7H3l11-7ZM2 21h24"/>',
};

export function renderTriangle(m, esc) {
  const nodes = m.nodes.map((n) => {
    const p = TRI_POS[n.id] || { x: 50, y: 50 };
    return `
      <button class="cm-tri__node cm-tri__node--${n.id}" type="button"
              data-branch="${esc(n.id)}" aria-pressed="false"
              style="left:${p.x}%; top:${p.y}%">
        <svg viewBox="0 0 28 24" aria-hidden="true">${TRI_ICON[n.id] || ''}</svg>
        <span class="cm-tri__label">${esc(n.label)}</span>
        <span class="cm-tri__article">${esc(n.article)}</span>
      </button>`;
  }).join('');

  const edge = (a, b) => {
    const p = TRI_POS[a]; const q = TRI_POS[b];
    return `<line class="cm-tri__edge" data-edge="${a}-${b}"
                  x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" />`;
  };

  const checks = m.checks.map((ch) => `
    <li>
      <button class="cm-check" type="button" data-check-id="${esc(ch.id)}"
              data-from="${esc(ch.from)}" data-to="${esc(ch.to)}"
              aria-pressed="false">
        <span class="cm-check__label">${esc(ch.label)}</span>
        <span class="cm-check__pair">${esc(shortName(m, ch.from))} <i aria-hidden="true">→</i> ${esc(shortName(m, ch.to))}</span>
      </button>
    </li>`).join('');

  const flow = m.flow ? `
    <div class="cm-flow">
      <p class="cm-flow__label">${esc(m.flow.label)}</p>
      <ol class="cm-flow__steps">
        ${m.flow.steps.map((s) => `<li>${esc(s)}</li>`).join('<li class="cm-flow__arrow" aria-hidden="true">→</li>')}
      </ol>
    </div>` : '';

  return `
    <section class="cm-sec cm-tri-sec" aria-labelledby="cm-md" data-triangle>
      <h3 class="cm-sec__label" id="cm-md">The three branches</h3>
      ${m.intro ? `<p class="cm-walk__intro">${esc(m.intro)}</p>` : ''}

      <div class="cm-tri">
        <svg class="cm-tri__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${edge('congress', 'president')}
          ${edge('congress', 'courts')}
          ${edge('president', 'courts')}
        </svg>
        ${nodes}
      </div>

      <div class="cm-tri__readout" aria-live="polite" data-readout></div>

      <p class="cm-checks__label">The checks between them</p>
      <ol class="cm-checks">${checks}</ol>

      ${flow}
    </section>`;
}

function shortName(m, id) {
  const n = m.nodes.find((x) => x.id === id);
  if (!n) return id;
  return n.id === 'courts' ? 'Courts' : n.label;
}

/** Selecting a branch or a check; never both. */
export function wireTriangle(root, model, esc) {
  const box = root.querySelector('[data-triangle]');
  if (!box) return;

  const readout = box.querySelector('[data-readout]');
  const nodeBtns = [...box.querySelectorAll('[data-branch]')];
  const checkBtns = [...box.querySelectorAll('[data-check-id]')];
  const edges = [...box.querySelectorAll('.cm-tri__edge')];

  function clear() {
    nodeBtns.forEach((b) => {
      b.setAttribute('aria-pressed', 'false');
      b.classList.remove('is-related');
    });
    checkBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    edges.forEach((e) => e.classList.remove('is-active'));
  }

  function showBranch(id) {
    const n = model.nodes.find((x) => x.id === id);
    if (!n) return;
    clear();
    nodeBtns.find((b) => b.dataset.branch === id).setAttribute('aria-pressed', 'true');
    readout.innerHTML = `
      <p class="cm-readout__kicker">${esc(n.article)} · ${esc(n.role)}</p>
      <h4 class="cm-readout__title">${esc(n.label)}</h4>
      <dl class="cm-readout__list">
        <dt>What it does</dt><dd>${esc(n.does)}</dd>
        <dt>Its main powers</dt><dd>${esc(n.powers)}</dd>
        <dt>Why it matters</dt><dd>${esc(n.why)}</dd>
      </dl>`;
  }

  function showCheck(id) {
    const c = model.checks.find((x) => x.id === id);
    if (!c) return;
    clear();
    checkBtns.find((b) => b.dataset.checkId === id).setAttribute('aria-pressed', 'true');
    // Light up the two branches this check runs between, and their edge.
    [c.from, c.to].forEach((b) => {
      const btn = nodeBtns.find((x) => x.dataset.branch === b);
      if (btn) btn.classList.add('is-related');
    });
    const match = edges.find((e) => {
      const [a, b] = e.dataset.edge.split('-');
      return (a === c.from && b === c.to) || (a === c.to && b === c.from);
    });
    if (match) match.classList.add('is-active');

    const from = model.nodes.find((x) => x.id === c.from);
    const to = model.nodes.find((x) => x.id === c.to);
    readout.innerHTML = `
      <p class="cm-readout__kicker">${esc(from ? from.label : c.from)} → ${esc(to ? to.label : c.to)}</p>
      <h4 class="cm-readout__title">${esc(c.label)}</h4>
      <p class="cm-readout__body">${esc(c.body)}</p>`;
  }

  box.addEventListener('click', (e) => {
    const n = e.target.closest('[data-branch]');
    if (n) { showBranch(n.dataset.branch); return; }
    const c = e.target.closest('[data-check-id]');
    if (c) showCheck(c.dataset.checkId);
  });

  showBranch(model.nodes[0].id);
}
