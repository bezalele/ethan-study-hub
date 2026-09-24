/* ---------------------------------------------------------------------------
   journal.js — the Cloudflare Worker that holds Ethan's journal.

   The study site is static and its repo is public, so it has nowhere of its
   own to keep the notes. This is that somewhere. It is the only part of the
   system that outlives a browser.

   Four routes, and deliberately nothing else:

     GET  /journal    -> { entries: [...] }          the daily notes
     POST /journal    -> merged in, returns the result

     GET  /progress   -> { stores: {...} }           lessons, practice, quizzes
     POST /progress   -> merged in, returns the result

   Both live in the same object under different keys, with the same auth and
   the same merge-never-replace discipline. Their rules differ because their
   shapes do: shared/journal-merge.js and shared/progress-merge.js.

   POST merges rather than replaces. That is the whole design: three laptops
   can write the same day while offline and come back in any order, and the
   server settles it with the same rules the browsers use. There is no "last
   one wins on the whole document", which is how you lose an afternoon's
   writing to a stale tab.

   The merge is not implemented here. It is imported from the very file the
   browsers load, so the two can never drift apart:
   shared/journal-merge.js.

   Auth is one shared passphrase in an Authorization header, over HTTPS. It
   is set with `wrangler secret put FAMILY_KEY` and lives only in Cloudflare
   and in each laptop's browser storage. It is NOT in this repo, which is
   public.

   Storage is a Durable Object, and it has to be.

   This was KV first, and KV was wrong. Every write here is a read, a merge
   and a write back, and KV caches reads at the edge with no read-after-write
   guarantee. A laptop syncing while the cache was stale read an empty
   journal, merged its own nothing into it, and wrote that back over the top.
   A two-browser test caught it destroying a note that had already reached
   the server. A Durable Object serialises every request through one instance
   with strongly consistent storage, so the read a merge is based on is
   always the real one.

   The journal is one small JSON document - a year of daily notes across
   three subjects is tens of kilobytes - so it lives under a single key
   inside that object.
   --------------------------------------------------------------------------- */

import '../shared/journal-merge.js';
import '../shared/progress-merge.js';

const KEY = 'journal-v1';
const PROGRESS_KEY = 'progress-v1';

/* One instance, named below, holds the family's journal. Requests to it are
   handled one at a time, which is the whole point. */
export class Journal {
  constructor(state) {
    this.state = state;
  }

  /* Every change keeps the version before it. Nothing here should ever need
     somebody to retype a note from a screenshot: if a write turns out to be
     wrong - a bad merge, a stray script, a mistake - the previous state is
     still sitting here and /history and /restore put it back.

     What is kept is generous on purpose: storage is measured in kilobytes
     and the cost of one missing snapshot is somebody's work. The recent
     ones answer "undo what just happened"; the daily ones answer "this has
     been wrong since last week". */
  async snapshot(key, value) {
    const id = 'snap:' + key + ':' + Date.now();
    await this.state.storage.put(id, value);
    const all = await this.state.storage.list({ prefix: 'snap:' + key + ':' });
    const ids = [...all.keys()].sort();

    /* Two rules, not one.
     *
     *   RECENT  the last 60, which covers an evening of editing and is what
     *           you want when something has just gone wrong.
     *   DAILY   the first snapshot of each of the last 40 days, which is what
     *           you want when something went wrong a week ago and nobody
     *           noticed. Fifty snapshots covered nineteen hours once he
     *           started using it properly; without this rule, a busy week
     *           would push last Tuesday off the end.
     */
    const RECENT = 60;
    const DAYS = 40;
    const keep = new Set(ids.slice(-RECENT));
    const firstOfDay = new Map();
    const cutoff = Date.now() - DAYS * 86400000;
    for (const one of ids) {
      const at = Number(one.slice(one.lastIndexOf(':') + 1));
      if (!at || at < cutoff) continue;
      const day = new Date(at).toISOString().slice(0, 10);
      if (!firstOfDay.has(day)) firstOfDay.set(day, one);
    }
    for (const one of firstOfDay.values()) keep.add(one);

    const drop = ids.filter((one) => !keep.has(one));
    if (drop.length) await this.state.storage.delete(drop);
  }

  async fetch(request) {
    const url = new URL(request.url);
    const progress = url.pathname.indexOf('progress') > -1;
    const key = progress ? PROGRESS_KEY : KEY;
    const merger = progress ? globalThis.ProgressMerge : globalThis.JournalMerge;
    const empty = progress ? { stores: {} } : { entries: [] };

    const current = (await this.state.storage.get(key)) || empty;

    /* What is available to go back to, newest first. */
    if (url.pathname.indexOf('/history') > -1) {
      const all = await this.state.storage.list({ prefix: 'snap:' + key + ':' });
      const rows = [...all.entries()].map(function (row) {
        const at = Number(row[0].split(':').pop());
        const v = row[1] || {};
        return {
          id: row[0],
          at: at,
          when: new Date(at).toISOString(),
          notes: (v.entries || []).filter(function (e) { return e && e.text; }).length,
          stores: v.stores ? Object.keys(v.stores).length : undefined,
        };
      }).sort(function (a, b) { return b.at - a.at; });
      return Response.json({ snapshots: rows });
    }

    /* Put one back. The state being replaced is snapshotted first, so even
       an unwanted restore is itself reversible. */
    if (url.pathname.indexOf('/restore') > -1) {
      const body = await request.json();
      const want = await this.state.storage.get(String(body.id || ''));
      if (!want) return Response.json({ error: 'no such snapshot' }, { status: 404 });
      await this.snapshot(key, current);
      await this.state.storage.put(key, want);
      return Response.json(want);
    }

    if (request.method === 'GET') {
      return Response.json(current);
    }

    if (request.method === 'DELETE') {
      await this.snapshot(key, current);
      await this.state.storage.put(key, empty);
      return Response.json(empty);
    }

    const incoming = await request.json();
    const merged = merger.mergeAll(current, incoming);
    /* Only when something actually changed, so a laptop polling every
       45 seconds does not fill the history with identical copies. */
    if (JSON.stringify(merged) !== JSON.stringify(current)) {
      await this.snapshot(key, current);
    }
    await this.state.storage.put(key, merged);
    return Response.json(merged);
  }
}

/* The site is served from GitHub Pages, so every call here is cross-origin.

   The live site, plus any local server while the site is being worked on -
   the port changes depending on what started it, and pinning one guarantees
   a confusing CORS failure the first time somebody uses a different one.
   Allowing any localhost port costs nothing: the passphrase is what protects
   the journal, and a page on a stranger's machine does not have it. */
const SITE = 'https://bezalele.github.io';
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function allowed(origin) {
  return origin === SITE || LOCAL.test(origin);
}

function cors(origin) {
  const allow = allowed(origin) ? origin : SITE;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });
}

/* Compared character by character to the end regardless of where it first
   differs, so the time taken does not reveal how much of a guess was right. */
function sameSecret(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function presented(request) {
  const h = request.headers.get('Authorization') || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
}

/* Every request goes to the same instance. The name is fixed because there
   is one journal, shared by one family. */
function object(env) {
  return env.JOURNAL_DO.get(env.JOURNAL_DO.idFromName('family'));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    /* /journal is the daily notes and the conversation about them.
       /progress is his lessons, practice and quiz scores - the same auth and
       the same object, a different document and a different set of rules. */
    const ROUTES = ['/journal', '/progress',
                    '/journal/history', '/progress/history',
                    '/journal/restore', '/progress/restore'];
    if (ROUTES.indexOf(url.pathname) === -1) {
      return json({ error: 'not found' }, 404, origin);
    }

    if (!env.FAMILY_KEY) {
      return json({ error: 'server has no passphrase configured' }, 500, origin);
    }

    if (!sameSecret(presented(request), env.FAMILY_KEY)) {
      return json({ error: 'wrong passphrase' }, 401, origin);
    }

    const inner = 'https://journal' + url.pathname;
    const progress = url.pathname.indexOf('progress') > -1;

    /* History and restore go straight through: the object does the work and
       the checks, because only it can see what it has kept. */
    if (url.pathname.indexOf('/history') > -1 || url.pathname.indexOf('/restore') > -1) {
      const r = await object(env).fetch(new Request(inner, {
        method: request.method === 'GET' ? 'GET' : 'POST',
        body: request.method === 'GET' ? undefined : await request.text(),
      }));
      return json(await r.json(), r.status, origin);
    }

    if (request.method === 'GET') {
      const r = await object(env).fetch(new Request(inner, { method: 'GET' }));
      return json(await r.json(), 200, origin);
    }

    /* Nothing in the merge rules can take anything away - that is what makes
       a parent's empty laptop harmless. The price is that there has to be one
       deliberate way to clear a document: a new school year, or a test that
       needs to start from nothing. It is not reachable by accident; no page
       on the site ever sends DELETE. */
    if (request.method === 'DELETE') {
      const r = await object(env).fetch(new Request(inner, { method: 'DELETE' }));
      return json(await r.json(), 200, origin);
    }

    if (request.method === 'POST') {
      let incoming;
      try {
        incoming = await request.json();
      } catch {
        return json({ error: 'body is not JSON' }, 400, origin);
      }
      const body = progress
        ? (incoming && typeof incoming.stores === 'object' && incoming.stores
            ? { stores: incoming.stores } : null)
        : (incoming && Array.isArray(incoming.entries)
            ? { entries: incoming.entries } : null);
      if (!body) {
        return json({ error: progress ? 'body needs a stores object' : 'body needs an entries array' }, 400, origin);
      }
      const r = await object(env).fetch(new Request(inner, {
        method: 'POST',
        body: JSON.stringify(body),
      }));
      return json(await r.json(), 200, origin);
    }

    return json({ error: 'method not allowed' }, 405, origin);
  },
};
