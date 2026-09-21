/* ---------------------------------------------------------------------------
   learning-sync.js — keeps the learning log in step across two laptops.

   The site is a static page on a public repo, so it has nowhere of its own
   to keep data. This stores one small JSON file in a *separate private*
   repo and reads and writes it through the GitHub contents API. Nothing new
   to host, the data stays private, and the file can be opened and read
   directly on github.com at any time.

   Each person connects their own laptop once with a fine-grained token
   scoped to Contents: read and write on that one private repo. The token is
   kept in that browser only and never travels anywhere except to
   api.github.com. Anyone with access to that browser profile can read it,
   so it should be scoped to the single data repo and given an expiry.

   Merging. Both laptops write the same file, so a plain overwrite would let
   whoever saved last wipe the other. Instead each day is keyed by subject
   and date and the two sides are merged:

     - a day only one side has is kept
     - a day both have takes the note with the later timestamp
     - comments are unioned by id, so a reply written on one laptop is never
       lost to an edit made on the other

   Deleting a day writes an empty note rather than dropping the record, so
   the deletion has a timestamp and can win a merge. Without that a deleted
   day would come back from the other laptop.

   The log works perfectly well with no token at all — it simply stays on
   the device it was written on.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  var CFG_KEY = 'esh-sync-cfg-v1';
  var FILE = 'learning-log.json';
  var API = 'https://api.github.com';

  function cfg() {
    try {
      var c = JSON.parse(localStorage.getItem(CFG_KEY) || '{}');
      return (c && c.token && c.repo) ? c : null;
    } catch (e) { return null; }
  }

  function setCfg(repo, token) {
    try {
      localStorage.setItem(CFG_KEY, JSON.stringify({
        repo: String(repo).trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, ''),
        token: String(token).trim(),
      }));
      return true;
    } catch (e) { return false; }
  }

  function clearCfg() {
    try { localStorage.removeItem(CFG_KEY); } catch (e) {}
  }

  function headers(c) {
    return {
      Authorization: 'Bearer ' + c.token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  /* --- merge ---------------------------------------------------------------
     Exported so it can be tested on its own; it is the part that decides
     whether anyone loses a note. */

  function key(e) { return e.subject + '|' + e.date; }

  function mergeEntries(a, b) {
    var out = {};
    function take(list) {
      (list || []).forEach(function (e) {
        if (!e || !e.subject || !e.date) return;
        var k = key(e);
        var have = out[k];
        if (!have) { out[k] = { subject: e.subject, date: e.date, text: e.text || '', ts: Number(e.ts) || 0, comments: [] }; have = out[k]; }
        // Later edit wins the note itself.
        if ((Number(e.ts) || 0) >= have.ts) { have.text = e.text || ''; have.ts = Number(e.ts) || 0; }
        // Comments are additive: union by id, so nothing is lost either way.
        (Array.isArray(e.comments) ? e.comments : []).forEach(function (c) {
          if (c && c.id && !have.comments.some(function (x) { return x.id === c.id; })) have.comments.push(c);
        });
      });
    }
    take(a);
    take(b);
    return Object.keys(out).map(function (k) {
      out[k].comments.sort(function (x, y) { return (Number(x.ts) || 0) - (Number(y.ts) || 0); });
      return out[k];
    }).sort(function (x, y) { return x.date < y.date ? 1 : x.date > y.date ? -1 : 0; });
  }

  /* --- remote --------------------------------------------------------------- */

  function decode(b64) {
    try {
      var bin = atob(String(b64).replace(/\n/g, ''));
      var bytes = Uint8Array.from(bin, function (ch) { return ch.charCodeAt(0); });
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) { return null; }
  }

  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj, null, 2));
    var bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin);
  }

  /** Reads the remote file. Returns { entries, sha } — sha null if absent. */
  async function pull() {
    var c = cfg();
    if (!c) throw new Error('not connected');
    var res = await fetch(API + '/repos/' + c.repo + '/contents/' + FILE, { headers: headers(c) });
    if (res.status === 404) return { entries: [], sha: null };
    if (res.status === 401 || res.status === 403) throw new Error('token rejected');
    if (!res.ok) throw new Error('GitHub returned ' + res.status);
    var body = await res.json();
    var data = decode(body.content) || {};
    return { entries: Array.isArray(data.entries) ? data.entries : [], sha: body.sha };
  }

  /** Merges local into remote and writes it back. Retries once on a clash. */
  async function push(localEntries, attempt) {
    var c = cfg();
    if (!c) throw new Error('not connected');
    var remote = await pull();
    var merged = mergeEntries(remote.entries, localEntries);

    var res = await fetch(API + '/repos/' + c.repo + '/contents/' + FILE, {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers(c)),
      body: JSON.stringify({
        message: 'Update learning log',
        content: encode({ entries: merged }),
        sha: remote.sha || undefined,
      }),
    });
    // Someone else wrote between our read and our write: read again and redo.
    if (res.status === 409 && !attempt) return push(localEntries, 1);
    if (!res.ok) throw new Error('GitHub returned ' + res.status);
    return merged;
  }

  /** Quick check that the token and repo actually work, before saving them. */
  async function test(repo, token) {
    var clean = String(repo).trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
    var res = await fetch(API + '/repos/' + clean, {
      headers: { Authorization: 'Bearer ' + String(token).trim(), Accept: 'application/vnd.github+json' },
    });
    if (res.status === 401) throw new Error('That token was rejected.');
    if (res.status === 404) throw new Error('No such repo, or the token cannot see it.');
    if (!res.ok) throw new Error('GitHub returned ' + res.status + '.');
    var body = await res.json();
    if (!body.private) throw new Error('That repo is public. Use a private one — these are school notes.');
    if (!body.permissions || !body.permissions.push) throw new Error('That token cannot write to the repo.');
    return true;
  }

  global.LearningSync = {
    isConnected: function () { return !!cfg(); },
    repo: function () { var c = cfg(); return c ? c.repo : ''; },
    connect: setCfg,
    disconnect: clearCfg,
    test: test,
    pull: pull,
    push: push,
    mergeEntries: mergeEntries,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = global.LearningSync;
}(typeof window !== 'undefined' ? window : globalThis));
