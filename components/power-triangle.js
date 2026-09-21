/* ---------------------------------------------------------------------------
   power-triangle.js — Unit 2's system map.

   Three branch cards in a triangle, joined by the checks that run between
   them, with a plain-English note under each branch and the longer read
   appearing only for whatever is selected.

   Three layers, deliberately: the diagram says who does what, the notes say
   what each branch actually is without anyone having to click, and the
   readout carries the detail for the one thing selected. The reference
   poster for this puts all three on the page at once, which is the part not
   copied.

   Geometry. The diagram box has a fixed aspect ratio and the SVG viewBox
   matches it, so one SVG unit is the same length horizontally and
   vertically. That is what makes perpendicular offsets and arrowheads come
   out square. Cards and labels are HTML positioned in percentages over the
   same box, carried as custom properties rather than inline left/top so the
   narrow-screen list can drop the positioning without !important.

   Each direction gets its own arrow, not a shared double-headed one: a
   double head cannot say that impeachment runs only one way. A pair with
   checks both ways gets two parallel single-headed arrows, and selecting a
   check lights only the one it travels along. Labels are grouped by
   direction for the same reason, and because Congress and the president
   have four checks between them — four labels strung along one short
   diagonal overlap however they are spread.
   --------------------------------------------------------------------------- */

/* The box is 11:5, so the viewBox is 220 x 100 and units are square. */
const VB_W = 220;
const VB_H = 100;

const POS = {
  congress:  { x: 110, y: 22 },
  president: { x: 31,  y: 78 },
  courts:    { x: 189, y: 78 },
};

/* Half a branch card, in SVG units, used to stop each arrow at the card edge
   instead of running under it. */
const CARD_HALF = { w: 21, h: 21 };

/* How far the two directions of one pair sit either side of the centreline. */
const LINE_OFFSET = 2.4;

/* How far a label cluster sits off its arrow, and how far along the arrow it
   slides toward the branch it belongs to. */
const CLUSTER_OFFSET = 15;
const CLUSTER_STAGGER = 0.15;

const PAIRS = [
  ['congress', 'president'],
  ['congress', 'courts'],
  ['president', 'courts'],
];

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
      : '';
    return `
      <button class="cm-br" type="button" data-branch="${esc(n.id)}"
              aria-pressed="false" style="--x:${p.left}%; --y:${p.top}%">
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

  /* --- each pair, with its directions ordered and a side assigned -------- */
  const pairs = PAIRS.map(([a, b]) => {
    const dirs = [byDir[`${a}>${b}`], byDir[`${b}>${a}`]].filter(Boolean);
    // The busier direction takes the outward side, where there is more room.
    dirs.sort((x, y) => y.list.length - x.list.length);
    const mid = lerp(POS[a], POS[b], 0.5);
    let nx = mid.x - centroid.x;
    let ny = mid.y - centroid.y;
    const len = Math.hypot(nx, ny) || 1;
    return { a, b, dirs, nx: nx / len, ny: ny / len };
  }).filter((p) => p.dirs.length);

  /* --- one single-headed arrow per direction ----------------------------- */
  const lines = pairs.flatMap(({ dirs, nx, ny }) => {
    // A pair with only one direction keeps the centreline; two directions
    // part either side of it so each arrowhead belongs to one of them.
    const apart = dirs.length > 1 ? LINE_OFFSET : 0;
    return dirs.map((dir, i) => {
      const sign = i === 0 ? 1 : -1;
      const p = POS[dir.from]; const q = POS[dir.to];
      const s0 = lerp(p, q, cardInset(p, q));
      const e0 = lerp(p, q, 1 - cardInset(q, p));
      const dx = nx * apart * sign; const dy = ny * apart * sign;
      return `<line class="cm-edge" data-dir="${esc(dir.from)}>${esc(dir.to)}"
                    x1="${s0.x + dx}" y1="${s0.y + dy}"
                    x2="${e0.x + dx}" y2="${e0.y + dy}"
                    marker-end="url(#cm-arrow)" />`;
    });
  }).join('');

  /* --- a label cluster per direction, set off beside its own arrow ------- */
  const clusters = pairs.flatMap(({ a, b, dirs, nx, ny }) => {
    const tallest = Math.max(...dirs.map((d) => d.list.length));
    const off = CLUSTER_OFFSET + (tallest - 1) * 4;
    // Two directions sharing one pair have to slide apart along it as well
    // as across it, or both land on the middle of the same line.
    const slide = dirs.length > 1 ? CLUSTER_STAGGER : 0;

    return dirs.map((dir, i) => {
      // Same side as this direction's arrow, and nearer the branch whose
      // powers it lists.
      const sign = i === 0 ? 1 : -1;
      const base = lerp(POS[a], POS[b], 0.5 - slide * (dir.from === a ? 1 : -1));
      const p = pct({ x: base.x + nx * off * sign, y: base.y + ny * off * sign });
      const label = `${shortName(m.nodes, dir.from)} → ${shortName(m.nodes, dir.to)}`;
      const pills = dir.list.map((c) => `
        <button class="cm-arrowchip" type="button" data-check-id="${esc(c.id)}"
                aria-pressed="false" aria-label="${esc(label)}: ${esc(c.label)}">
          ${esc(c.label)}
        </button>`).join('');
      return `
        <div class="cm-cluster" style="--x:${p.left}%; --y:${p.top}%">
          <p class="cm-cluster__dir">${esc(label)}</p>
          ${pills}
        </div>`;
    });
  }).join('');

  /* --- what each branch actually is, ordered across the diagram ---------- */
  const notes = [...m.nodes]
    .filter((n) => n.note)
    .sort((x, y) => ((POS[x.id] || {}).x || 0) - ((POS[y.id] || {}).x || 0))
    .map((n) => `
      <li>
        <button class="cm-note" type="button" data-branch="${esc(n.id)}"
                aria-pressed="false">
          <span class="cm-note__name">${esc(n.label)}</span>
          <span class="cm-note__body">${esc(n.note)}</span>
          <span class="cm-note__more">Read more</span>
        </button>
      </li>`).join('');

  const flow = m.flow ? `
    <section class="cm-sec cm-flow-sec" aria-labelledby="cm-fl">
      <h3 class="cm-sec__label" id="cm-fl">${esc(m.flow.label)}</h3>
      <ol class="cm-flow">
        ${m.flow.steps.map((st, i) => `
          <li class="cm-flow__step">
            <span class="cm-flow__n">${i + 1}</span>
            <span class="cm-flow__text">${esc(st)}</span>
          </li>`).join('')}
      </ol>
    </section>` : '';

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

      ${notes ? `<ul class="cm-notes">${notes}</ul>` : ''}
      <div class="cm-map__readout" aria-live="polite" data-readout></div>
    </section>
    ${flow}`;
}

/** Selecting a branch or a check; never both. */
export function wireTriangle(root, model, esc) {
  const box = root.querySelector('[data-triangle]');
  if (!box) return;

  const readout = box.querySelector('[data-readout]');
  // A branch has two buttons now — its card and its note — and both light up.
  const branches = [...box.querySelectorAll('[data-branch]')];
  const chips = [...box.querySelectorAll('[data-check-id]')];
  const edges = [...box.querySelectorAll('.cm-edge')];

  function clear() {
    branches.forEach((b) => {
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
    branches.filter((b) => b.dataset.branch === id)
      .forEach((b) => b.setAttribute('aria-pressed', 'true'));
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
      branches.filter((x) => x.dataset.branch === b)
        .forEach((x) => x.classList.add('is-related'));
    });
    const match = edges.find((e) => e.dataset.dir === `${c.from}>${c.to}`);
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
