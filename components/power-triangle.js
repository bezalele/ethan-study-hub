/* ---------------------------------------------------------------------------
   power-triangle.js — Unit 2's system map.

   An infographic-style diagram: three branch cards arranged as a triangle,
   each with civic imagery and one short role line, joined by arrows that
   carry the checks running between them.

   The reference poster for this shows every explanation at once. This does
   not: the diagram states who does what, and the detail appears only for the
   one thing you select — a branch card or a single check. That is the whole
   difference between a study diagram and a classroom poster.

   Geometry. The diagram box has a fixed aspect ratio and the SVG viewBox
   matches it, so one SVG unit is the same length horizontally and vertically.
   That is what makes perpendicular offsets and arrowheads come out square;
   an earlier version stretched a square viewBox with preserveAspectRatio
   ="none" and every angle in it was a lie. Cards and labels are HTML
   positioned in percentages over the same box.

   Checks are grouped by direction rather than shown one per arrow: Congress
   and the president have four checks between them, and four labels strung
   along one short diagonal overlap no matter how they are spread. Each
   direction gets one small cluster beside its arrow, and every label in it
   is still individually clickable.
   --------------------------------------------------------------------------- */

/* The box is 11:5, so the viewBox is 220 x 100 and units are square. */
const VB_W = 220;
const VB_H = 100;

const POS = {
  congress:  { x: 110, y: 21 },
  president: { x: 31,  y: 79 },
  courts:    { x: 189, y: 79 },
};

/* Half a branch card, in SVG units, used to stop each arrow at the card edge
   instead of running under it. */
const CARD_HALF = { w: 19, h: 18 };

/* How far a label cluster sits off its arrow, and how far along the arrow it
   slides toward the branch it belongs to. Both grow with the number of
   labels, because a taller cluster needs more clearance. */
const CLUSTER_OFFSET = 13;
const CLUSTER_STAGGER = 0.15;

/* Drawn stand-ins, used only for a branch whose `image` is null.

   The repo has photographs of the Capitol and of the Supreme Court, but none
   of the White House. Rather than leave that card empty — or borrow a
   building that is not the right one — the executive branch gets a drawn
   silhouette in the same warm palette and the same band size as the photos,
   so the three cards read as one set. Supplying a photograph later replaces
   it and needs no change here. */
const SKETCH = {
  president: `
    <svg class="cm-br__sketch" viewBox="0 0 160 70" preserveAspectRatio="xMidYMax slice"
         role="img" aria-label="Illustration of the White House">
      <defs>
        <linearGradient id="cm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f7dcb0"/>
          <stop offset="1" stop-color="#e2a171"/>
        </linearGradient>
      </defs>
      <rect width="160" height="70" fill="url(#cm-sky)"/>
      <g fill="#fffaf2">
        <rect x="6" y="45" width="42" height="18"/>
        <rect x="112" y="45" width="42" height="18"/>
        <rect x="46" y="35" width="68" height="28"/>
        <rect x="44" y="31" width="72" height="4"/>
        <rect x="62" y="24" width="36" height="3"/>
        <polygon points="80,14 100,25 60,25"/>
        <rect x="64" y="27" width="4" height="36"/>
        <rect x="74" y="27" width="4" height="36"/>
        <rect x="84" y="27" width="4" height="36"/>
        <rect x="94" y="27" width="4" height="36"/>
      </g>
      <rect y="63" width="160" height="7" fill="#c98b5e"/>
    </svg>`,
};

const PAIRS = [
  ['congress', 'president'],
  ['congress', 'courts'],
  ['president', 'courts'],
];

function edgeKey(a, b) {
  return [a, b].sort().join('|');
}

function lerp(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Where the line from a to b leaves a's card, as a fraction of the edge. */
function cardInset(a, b) {
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);
  const tx = dx ? CARD_HALF.w / dx : Infinity;
  const ty = dy ? CARD_HALF.h / dy : Infinity;
  return Math.min(tx, ty) + 0.03;
}

/** Percentages for positioning an HTML overlay at an SVG-unit point. */
function pct(p) {
  return { left: (p.x / VB_W) * 100, top: (p.y / VB_H) * 100 };
}

function shortName(nodes, id) {
  const n = nodes.find((x) => x.id === id);
  if (!n) return id;
  return n.id === 'courts' ? 'Courts' : n.label;
}

export function renderTriangle(m, esc) {
  const centroid = {
    x: (POS.congress.x + POS.president.x + POS.courts.x) / 3,
    y: (POS.congress.y + POS.president.y + POS.courts.y) / 3,
  };

  /* --- branch cards ------------------------------------------------------ */
  const cards = m.nodes.map((n) => {
    const p = pct(POS[n.id] || { x: VB_W / 2, y: VB_H / 2 });
    const art = n.image && n.image.src
      ? `<img src="${esc(n.image.src)}" alt="${esc(n.image.alt || '')}" loading="lazy">`
      : (SKETCH[n.id] || '');
    return `
      <button class="cm-br" type="button" data-branch="${esc(n.id)}"
              aria-pressed="false" style="left:${p.left}%; top:${p.top}%">
        <span class="cm-br__art">${art}</span>
        <span class="cm-br__name">${esc(n.label)}</span>
        <span class="cm-br__article">${esc(n.article)}</span>
        <span class="cm-br__role">${esc(n.role)}</span>
      </button>`;
  }).join('');

  /* --- checks, grouped by the direction they run in ---------------------- */
  const byDir = {};
  m.checks.forEach((c) => {
    const k = `${c.from}>${c.to}`;
    (byDir[k] = byDir[k] || { from: c.from, to: c.to, list: [] }).list.push(c);
  });

  /* --- one arrow per pair; a head on each end that has checks ------------ */
  const lines = PAIRS.map(([a, b]) => {
    const p = POS[a]; const q = POS[b];
    const s = lerp(p, q, cardInset(p, q));
    const e = lerp(p, q, 1 - cardInset(q, p));
    const toA = byDir[`${b}>${a}`] ? ' marker-start="url(#cm-arrow)"' : '';
    const toB = byDir[`${a}>${b}`] ? ' marker-end="url(#cm-arrow)"' : '';
    return `<line class="cm-edge" data-edge="${edgeKey(a, b)}"
                  x1="${s.x}" y1="${s.y}" x2="${e.x}" y2="${e.y}"${toA}${toB} />`;
  }).join('');

  /* --- a label cluster per direction, set off to one side of its arrow --- */
  const clusters = PAIRS.flatMap(([a, b]) => {
    const ab = byDir[`${a}>${b}`];
    const ba = byDir[`${b}>${a}`];
    const present = [ab, ba].filter(Boolean);
    if (!present.length) return [];

    const mid = lerp(POS[a], POS[b], 0.5);
    let nx = mid.x - centroid.x;
    let ny = mid.y - centroid.y;
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;

    const tallest = Math.max(...present.map((d) => d.list.length));
    const off = CLUSTER_OFFSET + (tallest - 1) * 4;
    // Two directions sharing one arrow have to slide apart along it as well
    // as across it, or both land on the middle of the same line.
    const slide = present.length > 1 ? CLUSTER_STAGGER : 0;

    present.sort((x, y) => y.list.length - x.list.length);
    return present.map((dir, i) => {
      // The busier direction takes the outward side; each sits nearer the
      // branch whose powers it lists.
      const sign = i === 0 ? 1 : -1;
      const base = lerp(POS[a], POS[b], 0.5 - slide * (dir.from === a ? 1 : -1));
      const at = {
        x: base.x + nx * off * sign,
        y: base.y + ny * off * sign,
      };
      const p = pct(at);
      const label = `${shortName(m.nodes, dir.from)} → ${shortName(m.nodes, dir.to)}`;
      const pills = dir.list.map((c) => `
        <button class="cm-arrowchip" type="button" data-check-id="${esc(c.id)}"
                aria-pressed="false" aria-label="${esc(label)}: ${esc(c.label)}">
          ${esc(c.label)}
        </button>`).join('');
      return `
        <div class="cm-cluster" style="left:${p.left}%; top:${p.top}%">
          <p class="cm-cluster__dir">${esc(label)}</p>
          ${pills}
        </div>`;
    });
  }).join('');

  const flow = m.flow ? `
    <div class="cm-flow">
      <p class="cm-flow__label">${esc(m.flow.label)}</p>
      <ol class="cm-flow__steps">
        ${m.flow.steps.map((s) => `<li>${esc(s)}</li>`).join('<li class="cm-flow__arrow" aria-hidden="true">&#8594;</li>')}
      </ol>
    </div>` : '';

  return `
    <section class="cm-sec cm-tri-sec" aria-labelledby="cm-md" data-triangle>
      <h3 class="cm-sec__label" id="cm-md">How the branches hold each other</h3>
      ${m.intro ? `<p class="cm-walk__intro">${esc(m.intro)}</p>` : ''}

      <div class="cm-map">
        <svg class="cm-map__lines" viewBox="0 0 ${VB_W} ${VB_H}" aria-hidden="true">
          <defs>
            <marker id="cm-arrow" viewBox="0 0 10 10" refX="8" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" />
            </marker>
          </defs>
          ${lines}
        </svg>
        ${cards}
        ${clusters}
      </div>

      <div class="cm-map__readout" aria-live="polite" data-readout></div>
      ${flow}
    </section>`;
}

/** Selecting a branch or a check; never both. */
export function wireTriangle(root, model, esc) {
  const box = root.querySelector('[data-triangle]');
  if (!box) return;

  const readout = box.querySelector('[data-readout]');
  const cards = [...box.querySelectorAll('[data-branch]')];
  const chips = [...box.querySelectorAll('[data-check-id]')];
  const edges = [...box.querySelectorAll('.cm-edge')];

  function clear() {
    cards.forEach((b) => {
      b.setAttribute('aria-pressed', 'false');
      b.classList.remove('is-related');
    });
    chips.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    edges.forEach((e) => e.classList.remove('is-active'));
  }

  function showBranch(id) {
    const n = model.nodes.find((x) => x.id === id);
    if (!n) return;
    clear();
    const card = cards.find((b) => b.dataset.branch === id);
    if (card) card.setAttribute('aria-pressed', 'true');
    readout.innerHTML = `
      <p class="cm-readout__kicker">${esc(n.article)} &middot; ${esc(n.role)}</p>
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
    const chip = chips.find((b) => b.dataset.checkId === id);
    if (chip) chip.setAttribute('aria-pressed', 'true');
    [c.from, c.to].forEach((b) => {
      const card = cards.find((x) => x.dataset.branch === b);
      if (card) card.classList.add('is-related');
    });
    const match = edges.find((e) => e.dataset.edge === edgeKey(c.from, c.to));
    if (match) match.classList.add('is-active');

    const from = model.nodes.find((x) => x.id === c.from);
    const to = model.nodes.find((x) => x.id === c.to);
    readout.innerHTML = `
      <p class="cm-readout__kicker">${esc(from ? from.label : c.from)} &#8594; ${esc(to ? to.label : c.to)}</p>
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
