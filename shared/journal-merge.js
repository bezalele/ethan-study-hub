/* ---------------------------------------------------------------------------
   journal-merge.js — combining two copies of the journal.

   Three laptops write the same journal. They go offline, they write at the
   same time, they come back in any order. Whatever happens, nothing anybody
   wrote may quietly disappear. That is what this file is for, and it is the
   only place the rules are written down: the browser uses it, and the Worker
   imports this same file, so the two cannot drift apart.

   The rules:

     Entries are identified by subject and date.  Two laptops writing "the
     Biology note for 22 September" are writing the same thing.

     The note text is last-write-wins on its timestamp.  Deleting a note does
     not remove it, it writes an empty text with a fresh timestamp, so the
     delete competes on the same footing as an edit instead of being undone
     by whichever laptop still had the old text.

     Comments merge by id, never by content.  A comment typed on one laptop
     and one typed on the other are different comments even if the words
     match. Deleting keeps the id and marks `del`, so the delete travels.

     Reactions are a toggle, keyed by kind-and-person, later timestamp wins.
     Taking one off records `off: true` rather than removing the row, or the
     other laptop would put it straight back on the next sync.

   What does NOT sync: `seen` and `lastWho`. Those say what the person at
   *this* device has read and who they last posted as. Syncing `seen` would
   clear Ethan's unread badge the moment his mum opened the journal on hers.

   Classic script, so the browser can load it with a plain <script> tag and
   the Worker can pull the same file in with a side-effecting import.
   --------------------------------------------------------------------------- */
(function (root) {
  'use strict';

  function num(x) { return Number(x) || 0; }

  function keyOf(e) { return e.subject + '|' + e.date; }

  function mergeComments(a, b) {
    var byId = {};
    [].concat(a || [], b || []).forEach(function (c) {
      if (!c || !c.id) return;
      var prev = byId[c.id];
      /* A delete wins over the original even when the clocks disagree: the
         only way to mark one is deliberately, so it is never accidental. */
      if (!prev || (c.del && !prev.del) || (!(prev.del && !c.del) && num(c.ts) > num(prev.ts))) {
        byId[c.id] = c;
      }
    });
    return Object.keys(byId).map(function (k) { return byId[k]; })
      .sort(function (p, q) { return num(p.ts) - num(q.ts); });
  }

  function mergeReactions(a, b) {
    var byKey = {};
    [].concat(a || [], b || []).forEach(function (r) {
      if (!r || !r.k || !r.who) return;
      var k = r.k + '|' + r.who;
      if (!byKey[k] || num(r.ts) >= num(byKey[k].ts)) byKey[k] = r;
    });
    return Object.keys(byKey).map(function (k) { return byKey[k]; });
  }

  /* Links are not comments. A comment is written once and deleting it is
     final - there is no way to type the same comment again, so a delete can
     safely beat anything. A lesson link is a switch: the same lesson can be
     taken off a day and put back on it, and that happens. So here the CLOCK
     decides, with a delete winning a tie.

     It used to be delete-wins-always, and the consequence was quiet and
     maddening: once a lesson had been taken off a day, attaching it again
     worked on screen and was undone by the next sync, for ever. */
  function mergeLinks(a, b) {
    var byId = {};
    [].concat(a || [], b || []).forEach(function (l) {
      if (!l || !l.id) return;
      var prev = byId[l.id];
      if (!prev) { byId[l.id] = l; return; }
      var mine = num(l.ts), theirs = num(prev.ts);
      if (mine > theirs || (mine === theirs && l.del && !prev.del)) byId[l.id] = l;
    });
    return Object.keys(byId).map(function (k) { return byId[k]; })
      .sort(function (p, q) { return num(p.ts) - num(q.ts); });
  }

  function mergeEntry(a, b) {
    if (!a) return b;
    if (!b) return a;
    var newer = num(a.ts) >= num(b.ts) ? a : b;
    var out = {
      subject: newer.subject,
      date: newer.date,
      text: typeof newer.text === 'string' ? newer.text : '',
      ts: num(newer.ts),
      comments: mergeComments(a.comments, b.comments),
      reactions: mergeReactions(a.reactions, b.reactions)
    };
    /* Links merge like comments - union by id, tombstones travel - NOT like
       the note text. Tying them to the note meant an edit that did not
       re-pick them silently dropped them, which is how one disappeared. */
    out.links = mergeLinks(a.links, b.links);
    /* A day written before links were a list keeps its single `lesson`,
       unless one of the two sides has deliberately cleared it. */
    var legacy = (a.lesson && a.lesson.href ? a : null) || (b.lesson && b.lesson.href ? b : null);
    if (legacy && !(newer === a ? !a.lesson : !b.lesson)) out.lesson = legacy.lesson;
    return out;
  }

  /**
   * Combine two journals. Returns `{ entries }` only — device preferences
   * are the caller's business and are never merged.
   */
  function mergeAll(a, b) {
    var byKey = {};
    [].concat((a && a.entries) || [], (b && b.entries) || []).forEach(function (e) {
      if (!e || !e.subject || !e.date) return;
      var k = keyOf(e);
      byKey[k] = byKey[k] ? mergeEntry(byKey[k], e) : e;
    });
    var entries = Object.keys(byKey).map(function (k) { return byKey[k]; });
    entries.sort(function (p, q) {
      return p.date < q.date ? 1 : p.date > q.date ? -1 : (p.subject < q.subject ? -1 : 1);
    });
    return { entries: entries };
  }

  root.JournalMerge = {
    mergeAll: mergeAll,
    mergeLinks: mergeLinks,
    mergeEntry: mergeEntry,
    mergeComments: mergeComments,
    mergeReactions: mergeReactions
  };
}(typeof globalThis !== 'undefined' ? globalThis : this));
