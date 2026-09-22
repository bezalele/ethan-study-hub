/* ---------------------------------------------------------------------------
   journal.js — the Cloudflare Worker that holds Ethan's journal.

   The study site is static and its repo is public, so it has nowhere of its
   own to keep the notes. This is that somewhere. It is the only part of the
   system that outlives a browser.

   Two routes, and deliberately nothing else:

     GET  /journal   -> { entries: [...] }
     POST /journal   -> body { entries: [...] }, merged into what is stored,
                        returns the merged result

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

const KEY = 'journal-v1';

/* One instance, named below, holds the family's journal. Requests to it are
   handled one at a time, which is the whole point. */
export class Journal {
  constructor(state) {
    this.state = state;
  }

  async fetch(request) {
    const stored = (await this.state.storage.get(KEY)) || { entries: [] };
    const current = { entries: Array.isArray(stored.entries) ? stored.entries : [] };

    if (request.method === 'GET') {
      return Response.json(current);
    }

    const incoming = await request.json();
    const merged = globalThis.JournalMerge.mergeAll(current, incoming);
    await this.state.storage.put(KEY, merged);
    return Response.json(merged);
  }
}

/* The site is served from GitHub Pages, so every call here is cross-origin.
   Only the hub may call it; a browser will refuse anything else. */
const ALLOWED = [
  'https://bezalele.github.io',
  'http://127.0.0.1:8777',
  'http://localhost:8777',
];

function cors(origin) {
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    if (url.pathname !== '/journal') {
      return json({ error: 'not found' }, 404, origin);
    }

    if (!env.FAMILY_KEY) {
      return json({ error: 'server has no passphrase configured' }, 500, origin);
    }

    if (!sameSecret(presented(request), env.FAMILY_KEY)) {
      return json({ error: 'wrong passphrase' }, 401, origin);
    }

    if (request.method === 'GET') {
      const r = await object(env).fetch(new Request('https://journal/', { method: 'GET' }));
      return json(await r.json(), 200, origin);
    }

    if (request.method === 'POST') {
      let incoming;
      try {
        incoming = await request.json();
      } catch {
        return json({ error: 'body is not JSON' }, 400, origin);
      }
      if (!incoming || !Array.isArray(incoming.entries)) {
        return json({ error: 'body needs an entries array' }, 400, origin);
      }
      const r = await object(env).fetch(new Request('https://journal/', {
        method: 'POST',
        body: JSON.stringify({ entries: incoming.entries }),
      }));
      return json(await r.json(), 200, origin);
    }

    return json({ error: 'method not allowed' }, 405, origin);
  },
};
