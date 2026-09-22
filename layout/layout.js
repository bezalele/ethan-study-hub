/* ---------------------------------------------------------------------------
   layout.js — the master page.

   Renders the header and footer exactly once, at boot. Navigation never
   re-runs this. That is what guarantees the chrome is byte-identical on
   every route: there is no code path that can produce a different header.

   The only per-route change is `aria-current` moving between nav links,
   which `setActive` below is solely responsible for.
   --------------------------------------------------------------------------- */

/** The navigation. One array, one source of truth.

    Subject navigation only. Study Hub and the notes are not here: they live
    in the shared cluster on the right, in the same place and the same order
    as on Biology and Math Quest. */
export const NAV = [
  { id: 'home',   label: 'Home',       href: '#/' },
  { id: 'course', label: 'Course Map', href: '#/course' },
  { id: 'study',  label: 'Study',      href: '#/study' },
];

/* Inline so it can never 404 the way assets/home/10-book-logo.png did. */
const BOOK_MARK = `
<svg class="brand__mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M3 4.8A1.8 1.8 0 0 1 4.8 3H10a2.5 2.5 0 0 1 2 1v15a2.5 2.5 0 0 0-2-1H4.8A1.8 1.8 0 0 1 3 16.2V4.8Z"
        stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M21 4.8A1.8 1.8 0 0 0 19.2 3H14a2.5 2.5 0 0 0-2 1v15a2.5 2.5 0 0 1 2-1h5.2a1.8 1.8 0 0 0 1.8-1.8V4.8Z"
        stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
</svg>`;

/**
 * Write the chrome into the page. Call once.
 */
export function renderLayout() {
  const header = document.getElementById('app-header');
  const footer = document.getElementById('app-footer');

  header.innerHTML = `
    <a class="brand" href="./" aria-label="Ethan Study Hub — all subjects">
      ${BOOK_MARK}
      <span>
        <span class="brand__name">Ethan Study Hub</span>
      </span>
      <span class="brand__sub">AP U.S. Government &amp; Politics &middot; 2026&ndash;27</span>
    </a>
    <div class="hdr-end">
      <nav id="app-nav" aria-label="Main">
        ${NAV.map((item) => `<a class="nav__link" data-nav="${item.id}" href="${item.href}">${item.label}</a>`).join('')}
      </nav>
      <div id="sh-mount"></div>
    </div>`;

  footer.innerHTML = `
    <span>Ethan Study Hub &middot; AP U.S. Government &amp; Politics</span>
    <span>Progress is saved on this device.</span>`;

  mountCluster();
}

/**
 * Draw the shared right-hand cluster: Today’s Note, Ethan’s Journal,
 * Study Hub, and his initial — the same four controls, in the same order,
 * as Biology and Math Quest.
 *
 * Called once, from renderLayout. The chrome here is rendered at boot and
 * never again, but the cluster keeps itself current: it listens for the
 * learning log announcing a change and redraws itself.
 *
 * `onDark` because this header is the forest-green banner — the cluster
 * keeps its shapes and swaps its colours for translucent white.
 */
function mountCluster() {
  const mount = document.getElementById('sh-mount');
  if (mount && window.SubjectHeader) {
    window.SubjectHeader.mount(mount, {
      subject: 'apgov',
      label: 'AP U.S. Government',
      learner: 'Ethan',
      journalHref: '#/journal',
      hubHref: './',
      onDark: true,
    });
  }
}

/**
 * Move `aria-current` to the nav item for `navId`. This is the complete set of
 * changes the chrome undergoes on navigation.
 */
export function setActive(navId) {
  document.querySelectorAll('#app-nav .nav__link').forEach((link) => {
    if (link.dataset.nav === navId) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/**
 * Set the document title for a route.
 */
export function setTitle(pageTitle) {
  document.title = pageTitle
    ? `${pageTitle} · Ethan Study Hub`
    : 'Ethan Study Hub · AP U.S. Government';
}
