/* ---------------------------------------------------------------------------
   journal-sync.js — keeping three laptops holding the same journal.

   The browser stays the source of truth for reading. Every page draws from
   localStorage and never waits on the network, so the journal is instant and
   works on a train. This file's whole job is to make sure that local copy and
   the Worker's copy agree, in the background, without anybody thinking about
   it.

   How a sync goes:

     1. POST everything this laptop has to the Worker.
     2. The Worker merges it into what it holds and sends back the result.
     3. That result is merged into this laptop's copy.

   Merging in both directions, with the same rules on both sides
   (shared/journal-merge.js), is what makes the order of events stop
   mattering. Two laptops can write the same day offline and both writes
   survive.

   The passphrase lives in this browser only, under its own key, and is put
   there once by the person using the laptop. It is never in the repo, which
   is public. Losing it costs nothing: type it again.

   What is not synced: `seen` and `lastWho`. Those belong to the person at
   this device - see shared/journal-merge.js.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  /* Public. The passphrase is what protects the journal, not this address. */
  var ENDPOINT = 'https://ethan-journal.bezuwm.workers.dev/journal';

  var KEY_PASS = 'esh-journal-key';
  var KEY_LAST = 'esh-journal-last';

  var busy = false;       // a sync is in flight
  var writingBack = false; // merging the server's reply into local storage
  var timer = null;

  function log() { return global.LearningLog; }

  /* The built-in key first, so every browser is connected the moment it
     loads the page and nobody ever writes a note that quietly goes nowhere.
     The stored one remains as an override, for a per-device key later.
     See shared/family-key.js for why the built-in one is not a secret. */
  function pass() {
    if (global.ESH_FAMILY_KEY) return global.ESH_FAMILY_KEY;
    try { return localStorage.getItem(KEY_PASS) || ''; } catch (e) { return ''; }
  }

  function isConnected() { return !!pass(); }

  /** True when connecting is automatic, so the UI offers no button for it. */
  function isAutomatic() { return !!global.ESH_FAMILY_KEY; }

  function lastSynced() {
    try { return Number(localStorage.getItem(KEY_LAST)) || 0; } catch (e) { return 0; }
  }

  function announce(detail) {
    try {
      document.dispatchEvent(new CustomEvent('esh:sync', { detail: detail }));
    } catch (e) { /* nothing listening is fine */ }
  }

  /** Everything this laptop holds, in the shape the Worker expects. */
  function localEntries() {
    try {
      var raw = JSON.parse(localStorage.getItem(log().STORAGE_KEY) || '{}');
      return Array.isArray(raw.entries) ? raw.entries : [];
    } catch (e) { return []; }
  }

  /** Put the server's answer back, leaving this device's own preferences alone. */
  function writeEntries(entries) {
    var raw;
    try {
      raw = JSON.parse(localStorage.getItem(log().STORAGE_KEY) || '{}');
    } catch (e) { raw = {}; }

    /* Merged against whatever is in storage *now*, not against the snapshot
       that was sent. A note saved while the request was in flight is not in
       the server's answer, and assigning the answer straight over the top
       would throw it away. */
    raw.entries = global.JournalMerge
      ? global.JournalMerge.mergeAll({ entries: raw.entries || [] }, { entries: entries }).entries
      : entries;

    if (!raw.seen || typeof raw.seen !== 'object') raw.seen = {};
    if (raw.lastWho !== 'ethan') raw.lastWho = 'parent';
    writingBack = true;
    try {
      localStorage.setItem(log().STORAGE_KEY, JSON.stringify(raw));
      document.dispatchEvent(new Event('esh:log-changed'));
    } finally {
      writingBack = false;
    }
  }

  /* One authenticated call. Exposed as `request` so progress-sync.js can
     reach its own route without keeping a second copy of the passphrase
     handling, the endpoint, or the error wrapping. */
  function request(method, path, body) {
    return fetch(ENDPOINT.replace(/\/journal$/, path), {
      method: method,
      headers: {
        Authorization: 'Bearer ' + pass(),
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || ('HTTP ' + r.status));
        return j;
      });
    });
  }

  function call(method, body) { return request(method, '/journal', body); }

  /**
   * Check a passphrase against the Worker and remember it if it is right.
   * Resolves true on success; rejects with a readable message otherwise.
   */
  function connect(phrase) {
    phrase = String(phrase || '').trim();
    if (!phrase) return Promise.reject(new Error('Type the passphrase first.'));
    var previous = pass();
    try { localStorage.setItem(KEY_PASS, phrase); } catch (e) {
      return Promise.reject(new Error('This browser will not let the passphrase be saved.'));
    }
    return call('GET').then(function () {
      announce({ state: 'connected' });
      return sync();
    }).catch(function (err) {
      /* Put back whatever was there, so a mistyped passphrase does not
         disconnect a laptop that was working a moment ago. */
      try {
        if (previous) localStorage.setItem(KEY_PASS, previous);
        else localStorage.removeItem(KEY_PASS);
      } catch (e) { /* nothing more to do */ }
      announce({ state: 'error', message: err.message });
      throw err;
    });
  }

  function disconnect() {
    try {
      localStorage.removeItem(KEY_PASS);
      localStorage.removeItem(KEY_LAST);
    } catch (e) { /* already gone */ }
    announce({ state: 'disconnected' });
  }

  /** Push what we have, merge back what comes home. */
  function sync() {
    if (!isConnected()) return Promise.resolve(false);
    if (busy) return Promise.resolve(false);
    busy = true;
    announce({ state: 'syncing' });
    return call('POST', { entries: localEntries() }).then(function (merged) {
      writeEntries(Array.isArray(merged.entries) ? merged.entries : []);
      try { localStorage.setItem(KEY_LAST, String(Date.now())); } catch (e) { /* fine */ }
      announce({ state: 'synced', at: Date.now() });
      return true;
    }).catch(function (err) {
      announce({ state: 'error', message: err.message });
      return false;
    }).then(function (r) {
      busy = false;
      return r;
    });
  }

  /* A write here is usually one keystroke's worth of consequence - a saved
     note, a tapped reaction - so they are gathered up rather than each one
     going down the wire. */
  function nudge() {
    if (writingBack || !isConnected()) return;
    clearTimeout(timer);
    timer = setTimeout(sync, 1200);
  }

  /* A link that connects this browser in one click:
       .../biology/?connect=the-passphrase#log

     Typing a passphrase on every browser someone uses is the kind of small
     friction that quietly kills a family habit. This is the same secret, sent
     the same way people already send each other links - and it is stripped
     out of the address bar the moment it is used, so it does not sit in
     history or get copied out of the URL by accident. */
  function fromLink() {
    var m = /[?&]connect=([^&#]+)/.exec(global.location.search);
    if (!m) return;
    var phrase;
    try { phrase = decodeURIComponent(m[1]); } catch (e) { phrase = m[1]; }
    var clean = global.location.pathname +
      global.location.search.replace(/([?&])connect=[^&#]*(&|$)/, '$1').replace(/[?&]$/, '') +
      global.location.hash;
    try { history.replaceState(null, '', clean); } catch (e) { /* older browser */ }
    connect(phrase).catch(function () { /* the strip reports it */ });
  }

  function start() {
    if (!log()) return;
    fromLink();
    document.addEventListener('esh:log-changed', nudge);
    /* Another tab on this laptop wrote something. */
    global.addEventListener('storage', function (e) {
      if (e.key === log().STORAGE_KEY) nudge();
    });
    /* Coming back to the page is the moment another laptop's writing is most
       likely to be waiting. */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) sync();
    });
    global.addEventListener('online', sync);

    /* The same gap the progress client has: someone reading the journal with
       the page open has nothing of their own to change, so a reply left on
       another laptop would not appear until they navigated. */
    setInterval(function () { if (!document.hidden) sync(); }, 45000);
    global.addEventListener('hashchange', sync);

    if (isConnected()) sync();
  }

  global.JournalSync = {
    ENDPOINT: ENDPOINT,
    request: request,
    isAutomatic: isAutomatic,
    isConnected: isConnected,
    lastSynced: lastSynced,
    connect: connect,
    disconnect: disconnect,
    sync: sync,
    start: start
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}(window));
