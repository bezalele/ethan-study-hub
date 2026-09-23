/* ---------------------------------------------------------------------------
   router.js — hash routing.

   Hash routing is deliberate: GitHub Pages cannot rewrite unknown paths to
   index.html, so real path routing would 404 on refresh. Hashes always work.

   On navigation the router replaces the children of <main> and moves
   `aria-current`. It never touches the header or footer markup.
   --------------------------------------------------------------------------- */

import { setActive, setTitle } from './layout.js?v=16';

/**
 * Route table. `path` segments beginning with ':' capture into params.
 * Order matters: the first match wins, so literals precede parameters.
 */
const ROUTES = [
  { path: '/',                  page: 'home' },
  { path: '/course',            page: 'course-map' },
  { path: '/course/:unit',      page: 'course-map' },
  { path: '/journal',           page: 'journal' },
  { path: '/study',             page: 'study' },
  { path: '/study/practice',    page: 'practice' },
  { path: '/study/documents',   page: 'study', params: { view: 'documents' } },
  { path: '/study/:chapter',    page: 'chapter' },
];

const FALLBACK = '#/';

/** Lazily-imported page modules, cached after first load. */
const moduleCache = new Map();

async function loadPage(name) {
  if (!moduleCache.has(name)) {
    moduleCache.set(name, import(`../pages/${name}.js?v=16`).then((m) => m.default));
  }
  return moduleCache.get(name);
}

/** Split '#/study/declaration' into ['study', 'declaration']. */
function segmentsOf(hash) {
  return hash.replace(/^#/, '').split('/').filter(Boolean);
}

/**
 * Match a hash against ROUTES. Returns { page, params } or null.
 */
export function matchRoute(hash) {
  const parts = segmentsOf(hash);

  for (const route of ROUTES) {
    const pattern = route.path.split('/').filter(Boolean);
    if (pattern.length !== parts.length) continue;

    const params = { ...(route.params || {}) };
    const ok = pattern.every((seg, i) => {
      if (seg.startsWith(':')) {
        params[seg.slice(1)] = decodeURIComponent(parts[i]);
        return true;
      }
      return seg === parts[i];
    });

    if (ok) return { page: route.page, params };
  }
  return null;
}

let currentToken = 0;

async function navigate() {
  const hash = window.location.hash || FALLBACK;
  const match = matchRoute(hash);

  // Unknown route: redirect to home rather than render a blank screen.
  if (!match) {
    window.location.replace(FALLBACK);
    return;
  }

  // Guard against a slow import resolving after a newer navigation started.
  const token = ++currentToken;

  const page = await loadPage(match.page);
  if (token !== currentToken) return;

  const main = document.getElementById('app-main');
  const view = page.render(match.params);

  main.replaceChildren(view);
  setActive(page.nav);
  setTitle(typeof page.title === 'function' ? page.title(match.params) : page.title);

  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function startRouter() {
  window.addEventListener('hashchange', navigate);
  if (!window.location.hash) window.location.replace(FALLBACK);
  else navigate();
}

/** Exposed for the smoke test. */
export const __routes = ROUTES;
