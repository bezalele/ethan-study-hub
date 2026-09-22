/* ---------------------------------------------------------------------------
   progress-sync.js — Ethan's lessons, practice and quiz scores, shared.

   The journal was the conversation. This is the work itself: which lessons
   he has been through, every practice attempt, every quiz score. Until now
   all of it sat in whichever browser he happened to use, which meant his
   parents could not see any of it and a dead laptop took the term with it.

   Same Worker, same passphrase, same "connect this laptop" as the journal -
   a laptop that is connected for one is connected for both. The difference
   is what gets merged, and that lives in shared/progress-merge.js.

   THE IMPORTANT PART: a parent's laptop has no progress on it. Every merge
   rule is a union, a maximum or an OR, so a laptop with nothing cannot take
   anything away from a laptop with something. His mum opening the Biology
   page can only ever add to the picture.

   All three subjects are synced together, on any page, because they share an
   origin and therefore share storage. Opening Math Quest brings his Biology
   quiz scores down too, which costs one request and means a parent sees
   everything from wherever they happen to land.

   Writes are picked up by polling rather than by an event: the three apps
   save progress with plain localStorage.setItem and none of them announce
   it. Polling a few keys every couple of seconds costs nothing measurable
   and needs no changes to any of them.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  var POLL_MS = 2500;      // how often to notice he has done something
  var SETTLE_MS = 1500;    // how long to let a burst of saving finish
  var PULL_MS = 45000;     // how often to look for someone else's work

  var last = {};           // key -> the JSON we last saw locally
  var timer = null;
  var busy = false;
  var writingBack = false;

  function keys() {
    return global.ProgressMerge ? global.ProgressMerge.keys() : [];
  }

  function readStore(k) {
    try {
      var raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : undefined;
    } catch (e) { return undefined; }
  }

  /** Everything this laptop knows, as the Worker wants it. */
  function localStores() {
    var out = {};
    keys().forEach(function (k) {
      var v = readStore(k);
      if (v !== undefined) out[k] = v;
    });
    return out;
  }

  function snapshot() {
    var out = {};
    keys().forEach(function (k) {
      try { out[k] = localStorage.getItem(k); } catch (e) { out[k] = null; }
    });
    return out;
  }

  function changedLocally() {
    var now = snapshot();
    var changed = keys().some(function (k) { return now[k] !== last[k]; });
    last = now;
    return changed;
  }

  /** Put merged progress back, and remember it so it does not look like news. */
  function writeStores(stores) {
    writingBack = true;
    try {
      Object.keys(stores || {}).forEach(function (k) {
        try { localStorage.setItem(k, JSON.stringify(stores[k])); } catch (e) { /* full or blocked */ }
      });
      last = snapshot();
      /* The page is showing progress read at load. Tell it to look again. */
      try { document.dispatchEvent(new Event('esh:progress-changed')); } catch (e) { /* fine */ }
    } finally {
      writingBack = false;
    }
  }

  function sync() {
    var js = global.JournalSync;
    if (!js || !js.isConnected() || busy) return Promise.resolve(false);
    busy = true;
    return js.request('POST', '/progress', { stores: localStores() })
      .then(function (merged) {
        writeStores(merged && merged.stores);
        return true;
      })
      .catch(function () { return false; })
      .then(function (r) { busy = false; return r; });
  }

  function tick() {
    if (writingBack) return;
    if (!changedLocally()) return;
    clearTimeout(timer);
    timer = setTimeout(sync, SETTLE_MS);
  }

  function start() {
    if (!global.ProgressMerge || !global.JournalSync) return;
    last = snapshot();
    sync();
    setInterval(tick, POLL_MS);

    /* Pushing on a local change is not enough on its own: a parent watching
       the progress page has nothing of their own to change, so without this
       the page they are looking at would never update. */
    setInterval(function () { if (!document.hidden) sync(); }, PULL_MS);

    /* These apps route by hash, so moving between pages is not a page load
       and start() does not run again. */
    global.addEventListener('hashchange', sync);

    /* Coming back to the page is when another laptop's work is most likely
       to be waiting. */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) sync();
    });
    global.addEventListener('online', sync);
    /* Connecting a laptop should bring his work down, not just his notes. */
    document.addEventListener('esh:sync', function (e) {
      if (e.detail && e.detail.state === 'connected') sync();
    });
  }

  global.ProgressSync = { sync: sync, start: start, localStores: localStores };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}(window));
