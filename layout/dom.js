/* ---------------------------------------------------------------------------
   dom.js — two tiny helpers so page modules build real DOM nodes rather than
   pushing innerHTML strings around.
   --------------------------------------------------------------------------- */

/** Create an element with an optional class list. */
export function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * Parse a markup string into a single element.
 * The markup is authored here in the repo, never user input.
 */
export function html(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

/** Parse markup containing several siblings into a DocumentFragment. */
export function fragment(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content;
}

/** Escape a string for safe interpolation into markup. */
export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
