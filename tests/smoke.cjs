/* ---------------------------------------------------------------------------
   smoke.cjs — structural invariants for the study hub.

   These are the rules from docs/superpowers/specs/2026-09-20-structure-rebuild-design.md,
   enforced mechanically so they cannot quietly rot.

   Run:  node tests/smoke.cjs
   --------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

let failures = 0;
let checks = 0;

function check(name, condition, detail) {
  checks += 1;
  if (condition) {
    console.log(`  ok    ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${name}`);
    if (detail) console.log(`        ${detail}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

/** Files owned by this site (math-quest is a separate sub-app). */
const PAGE_CSS = [
  'pages/home.css', 'pages/course-map.css', 'pages/study.css',
  'pages/practice.css', 'pages/chapter.css',
];
/* Shared components own a .c-NAME namespace instead of a .page--NAME one. */
const COMPONENT_CSS = ['components/timeline.css'];
const ALL_CSS = [
  'styles/tokens.css', 'styles/base.css', 'layout/layout.css',
  ...COMPONENT_CSS, ...PAGE_CSS,
];
const ALL_JS = [
  'layout/layout.js', 'layout/router.js', 'layout/dom.js',
  'components/timeline.js',
  'content/assets.js', 'content/chapters.js', 'content/course.js',
  'pages/home.js', 'pages/course-map.js', 'pages/study.js',
  'pages/practice.js', 'pages/chapter.js',
];

/* --- 1. Every expected file is present ------------------------------------ */

section('Files present');
['index.html', ...ALL_CSS, ...ALL_JS, 'content/contentData.js'].forEach((f) => {
  check(f, exists(f));
});

/* --- 2. The old monolith is gone ------------------------------------------ */

section('Old shell removed');
['app.js', 'style.css', 'home-override.css', 'home-assets.css'].forEach((f) => {
  check(`${f} deleted`, !exists(f));
});

/* --- 3. Zero !important --------------------------------------------------- */

section('No !important (was 441 on main)');
ALL_CSS.forEach((f) => {
  const hits = (read(f).match(/!important/g) || []).length;
  check(`${f}`, hits === 0, `${hits} occurrence(s)`);
});

/* --- 4. Page CSS is scoped ------------------------------------------------ */

section('Stylesheets are scoped to their own root');
[...PAGE_CSS, ...COMPONENT_CSS].forEach((f) => {
  const base = path.basename(f, '.css');
  const root = f.startsWith('components/') ? '.c-' + base : '.page--' + base;
  const css = read(f)
    .replace(/\/\*[\s\S]*?\*\//g, '')            // strip comments
    .replace(/@media[^{]+\{/g, '')               // unwrap media queries
    .replace(/\}\s*\}/g, '}');

  const selectors = (css.match(/(^|\})\s*([^{}@]+)\{/g) || [])
    .map((m) => m.replace(/^[}\s]*/, '').replace(/\s*\{$/, '').trim())
    .flatMap((s) => s.split(','))
    .map((s) => s.trim())
    .filter(Boolean);

  const stray = selectors.filter((s) => !s.startsWith(root));
  check(`${f} — all selectors start with ${root}`, stray.length === 0,
    stray.slice(0, 5).join(' | '));
});

/* --- 5. Only layout.css may style the chrome ------------------------------ */

section('Only layout.css styles header/footer/body');
[...PAGE_CSS, ...COMPONENT_CSS].forEach((f) => {
  const css = read(f).replace(/\/\*[\s\S]*?\*\//g, '');
  const bad = /(^|[\s,{])(header|footer|body|#app-header|#app-footer|#app-main)\b/m.test(css);
  check(`${f} leaves the chrome alone`, !bad);
});

/* --- 6. No inline event handlers ------------------------------------------ */

section('No inline on* handlers');
['index.html', ...ALL_JS].forEach((f) => {
  const hits = (read(f).match(/\son(click|mouse\w+|focus|blur|change)\s*=/g) || []).length;
  check(`${f}`, hits === 0, `${hits} occurrence(s)`);
});

/* --- 7. Every referenced asset exists and is a real image ------------------ */

section('Referenced images exist and are valid');

function imageKind(abs) {
  const b = fs.readFileSync(abs);
  if (b.length > 8 && b.slice(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[b.length - 2] === 0xff && b[b.length - 1] === 0xd9) return 'jpeg';
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') return 'webp';
  if (b.slice(0, 5).toString().trim().startsWith('<svg') || b.slice(0, 5).toString() === '<?xml') return 'svg';
  return null;
}

/* Strip comments first: a path named in a comment is documentation, not a
   reference, and must not be treated as one. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

const referenced = new Set();
[...ALL_CSS, ...ALL_JS, 'index.html', 'content/contentData.js'].forEach((f) => {
  for (const m of stripComments(read(f)).matchAll(/assets\/[A-Za-z0-9/_.-]+\.(?:jpg|jpeg|png|webp|svg)/g)) {
    referenced.add(m[0]);
  }
});

check('at least one image is referenced', referenced.size > 0);
[...referenced].sort().forEach((rel) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    check(rel, false, 'file does not exist');
    return;
  }
  const kind = imageKind(abs);
  check(`${rel} (${kind || 'UNRECOGNISED'})`, kind !== null,
    'not a valid PNG/JPEG/WebP/SVG — file is corrupt');
});

/* --- 8. No duplicate image files ------------------------------------------ */

section('No duplicate image files');
const crypto = require('crypto');
const seen = new Map();
const dupes = [];
function walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(rel);
    else if (/\.(jpg|jpeg|png|webp)$/i.test(e.name)) {
      const hash = crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');
      if (seen.has(hash)) dupes.push(`${rel} == ${seen.get(hash)}`);
      else seen.set(hash, rel);
    }
  }
}
walk('assets');
check('assets contains no byte-identical duplicates', dupes.length === 0, dupes.join(' | '));

/* --- 9. Routes resolve ----------------------------------------------------- */

section('Routes');
const router = read('layout/router.js');
const routePaths = [...router.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
const routePages = new Set([...router.matchAll(/page:\s*'([^']+)'/g)].map((m) => m[1]));

check('route table is non-empty', routePaths.length > 0);
check('home route "/" exists', routePaths.includes('/'));
routePages.forEach((p) => check(`page module pages/${p}.js exists`, exists(`pages/${p}.js`)));

/* Every nav href must match a route. */
const layout = read('layout/layout.js');
const navHrefs = [...layout.matchAll(/href:\s*'#([^']*)'/g)].map((m) => m[1] || '/');
check('nav has links', navHrefs.length > 0);
navHrefs.forEach((href) => {
  const parts = href.split('/').filter(Boolean);
  const matched = routePaths.some((rp) => {
    const pat = rp.split('/').filter(Boolean);
    return pat.length === parts.length
      && pat.every((seg, i) => seg.startsWith(':') || seg === parts[i]);
  });
  check(`nav href #${href} resolves to a route`, matched);
});

/* --- 10. Every internal link in a page module points at a real route ------- */

section('Internal links resolve');
const pageModules = ALL_JS.filter((f) => f.startsWith('pages/'));
const badLinks = [];
pageModules.forEach((f) => {
  for (const m of read(f).matchAll(/href="#([^"$]*)"/g)) {
    const parts = (m[1] || '/').split('/').filter(Boolean);
    const matched = routePaths.some((rp) => {
      const pat = rp.split('/').filter(Boolean);
      return pat.length === parts.length
        && pat.every((seg, i) => seg.startsWith(':') || seg === parts[i]);
    });
    if (!matched) badLinks.push(`${f}: #${m[1]}`);
  }
});
check('all static internal links resolve', badLinks.length === 0, badLinks.join(' | '));

/* --- 11. index.html links every stylesheet --------------------------------- */

section('index.html wiring');
const indexHtml = read('index.html');
ALL_CSS.forEach((f) => check(`links ${f}`, indexHtml.includes(f)));
check('renders the layout once', (indexHtml.match(/renderLayout\(\)/g) || []).length === 1);
check('starts the router', indexHtml.includes('startRouter()'));
check('has the three mount points',
  indexHtml.includes('id="app-header"')
  && indexHtml.includes('id="app-main"')
  && indexHtml.includes('id="app-footer"'));

/* --- Result ---------------------------------------------------------------- */

console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures) {
  console.log(`${failures} FAILED`);
  process.exit(1);
}
console.log('All structural invariants hold.');
