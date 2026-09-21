/* ---------------------------------------------------------------------------
   learning-log.js — "What did you learn today?", plus the history of it.

   Shared across every subject in the hub. Biology, Math Quest and AP U.S.
   Government each mount the same component and each keep their own list:
   entries are tagged with a subject and only that subject's entries are ever
   shown. One store rather than three, because all three apps are served from
   the same origin — so a combined view on the Study Hub landing page stays
   possible later without moving anyone's data.

   Plain script, not a module, so the two classic-script apps and the
   module-based one can all use it the same way:

     <script src="../shared/learning-log.js"></script>
     LearningLog.mountButton(el,  { subject: 'biology', label: 'Honors Biology',
                                    learner: 'Ethan' });
     LearningLog.mountHistory(el, { subject: 'biology', label: 'Honors Biology',
                                    learner: 'Ethan' });

   `learner` is the name the page speaks to. Passing it makes the prompt
   read "What did you learn today, Ethan?"; leaving it out keeps the wording
   neutral, so the component stays usable by anyone.

   Two surfaces, deliberately:
     mountButton   a small trigger for the app header. Opens a modal editor,
                   so writing the day's note costs no page space and moves
                   nothing. Carries a badge when there are unseen replies.
     mountHistory  the full record — every note by date, each with its own
                   comment thread, so notes can be talked about rather than
                   only written.

   Dates are local, not UTC — "today" has to mean the day it is where Ethan
   is sitting, or an evening entry lands on tomorrow.

   Storage is this browser only. Notes written on a phone are not visible on
   a laptop, and a comment left on one device does not reach the other. The
   host app's backup/restore is the only bridge today.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  var KEY = 'esh-learning-log-v1';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** Local calendar day as YYYY-MM-DD. */
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function prettyDate(iso) {
    var p = String(iso).split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    if (isNaN(d)) return iso;
    var t = today();
    if (iso === t) return 'Today';
    var y = new Date();
    y.setDate(y.getDate() - 1);
    var yIso = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' +
      String(y.getDate()).padStart(2, '0');
    if (iso === yIso) return 'Yesterday';
    var out = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    if (d.getFullYear() !== new Date().getFullYear()) out += ', ' + d.getFullYear();
    return out;
  }

  function timeOf(ts) {
    try {
      return new Date(ts).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      });
    } catch (e) { return ''; }
  }

  function readAll() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        entries: Array.isArray(raw.entries) ? raw.entries : [],
        seen: raw.seen && typeof raw.seen === 'object' ? raw.seen : {},
        lastWho: raw.lastWho === 'ethan' ? 'ethan' : 'parent',
      };
    } catch (e) {
      return { entries: [], seen: {}, lastWho: 'parent' };
    }
  }

  /** Returns false when storage is unavailable, so the UI can say so. */
  function writeAll(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function comments(e) { return Array.isArray(e.comments) ? e.comments : []; }

  function forSubject(subject) {
    return readAll().entries
      .filter(function (e) { return e && e.subject === subject; })
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }

  function entryFor(subject, date) {
    return forSubject(subject).filter(function (e) { return e.date === date; })[0] || null;
  }

  /** One entry per subject per day. Editing keeps that day's comments. */
  function put(subject, date, text) {
    var data = readAll();
    var existing = data.entries.filter(function (e) {
      return e && e.subject === subject && e.date === date;
    })[0];
    data.entries = data.entries.filter(function (e) {
      return !(e && e.subject === subject && e.date === date);
    });
    if (text.trim()) {
      data.entries.push({
        subject: subject, date: date, text: text.trim(), ts: Date.now(),
        comments: existing ? comments(existing) : [],
      });
    }
    return writeAll(data);
  }

  function remove(subject, date) {
    var data = readAll();
    data.entries = data.entries.filter(function (e) {
      return !(e && e.subject === subject && e.date === date);
    });
    return writeAll(data);
  }

  function addComment(subject, date, who, text) {
    if (!text.trim()) return true;
    var data = readAll();
    var e = data.entries.filter(function (x) {
      return x && x.subject === subject && x.date === date;
    })[0];
    if (!e) return false;
    e.comments = comments(e).concat([{
      id: 'c' + Date.now() + Math.random().toString(36).slice(2, 6),
      who: who === 'ethan' ? 'ethan' : 'parent',
      text: text.trim(),
      ts: Date.now(),
    }]);
    data.lastWho = who === 'ethan' ? 'ethan' : 'parent';
    return writeAll(data);
  }

  function deleteComment(subject, date, id) {
    var data = readAll();
    var e = data.entries.filter(function (x) {
      return x && x.subject === subject && x.date === date;
    })[0];
    if (!e) return false;
    e.comments = comments(e).filter(function (c) { return c.id !== id; });
    return writeAll(data);
  }

  /** Replies Ethan has not looked at yet, for the badge on the home strip. */
  function newCount(subject) {
    var data = readAll();
    var since = Number(data.seen[subject] || 0);
    return data.entries.filter(function (e) { return e && e.subject === subject; })
      .reduce(function (n, e) {
        return n + comments(e).filter(function (c) {
          return c.who === 'parent' && Number(c.ts) > since;
        }).length;
      }, 0);
  }

  /* Seen means "you have looked at everything that is there", so it clamps
     to the newest comment rather than to the clock. A comment stamped in the
     future — a skewed device clock, or a restored backup — would otherwise
     leave the badge stuck on forever. */
  function markSeen(subject) {
    var data = readAll();
    var newest = data.entries
      .filter(function (e) { return e && e.subject === subject; })
      .reduce(function (max, e) {
        return comments(e).reduce(function (m, c) {
          return Math.max(m, Number(c.ts) || 0);
        }, max);
      }, 0);
    data.seen[subject] = Math.max(Date.now(), newest);
    return writeAll(data);
  }

  var PENCIL = '<svg class="ll__ico" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0-3-3L5.2 17 4 20Z"/><path d="M14.8 7.4 16.6 9.2"/></svg>';

  function firstLine(text, max) {
    var t = String(text).split('\n')[0];
    return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
  }

  /* --- header trigger + modal editor --------------------------------------
     A button rather than a panel: writing one line a day should not cost the
     home page a permanent block, and nothing on the page moves when it opens.
     It lives in the app header, so the note can be written from any page.
     --------------------------------------------------------------------------- */

  function mountButton(root, opts) {
    if (!root) return;
    var subject = opts.subject;
    var label = opts.label || 'this subject';
    var learner = opts.learner || '';
    var historyHref = opts.historyHref || '';
    var dlg = null;

    function prompt() {
      return 'What did you learn today' + (learner ? ', ' + learner : '') + '?';
    }

    function drawTrigger() {
      var has = !!entryFor(subject, today());
      var fresh = newCount(subject);
      root.innerHTML =
        '<button type="button" class="ll-trigger' + (has ? ' is-done' : '') + '" data-open ' +
          'title="' + esc(prompt()) + '" aria-label="' + esc(prompt()) + '">' +
          PENCIL +
          '<span class="ll-trigger__txt">Today’s note</span>' +
          (fresh ? '<span class="ll-trigger__dot" aria-label="' + fresh + ' new replies">' + fresh + '</span>'
                 : (has ? '<span class="ll-trigger__tick" aria-hidden="true">✓</span>' : '')) +
        '</button>';
      root.querySelector('[data-open]').onclick = open;
    }

    function open() {
      var day = today();
      var entry = entryFor(subject, day);

      if (!dlg) {
        dlg = document.createElement('dialog');
        dlg.className = 'll-modal';
        document.body.appendChild(dlg);
        // Clicking the backdrop closes it; clicking the card must not.
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
        dlg.addEventListener('close', drawTrigger);
      }

      dlg.innerHTML =
        '<div class="ll-modal__card">' +
          '<button type="button" class="ll-modal__x" data-x aria-label="Close">&times;</button>' +
          '<h2 class="ll-modal__title">' + esc(prompt()) + '</h2>' +
          '<p class="ll-modal__day">' + esc(prettyDate(day)) + ' &middot; ' + esc(label) + '</p>' +
          '<label class="sr" for="ll-m">Today’s note</label>' +
          '<textarea id="ll-m" class="ll__text" rows="5" placeholder="In class today we&hellip;">' +
            esc(entry ? entry.text : '') + '</textarea>' +
          '<div class="ll__row ll-modal__row">' +
            '<button type="button" class="ll__save" data-save>Save</button>' +
            '<button type="button" class="ll__quiet" data-cancel>Cancel</button>' +
            (historyHref ? '<a class="ll__link ll-modal__all" href="' + esc(historyHref) + '" data-all>All notes &amp; replies &rarr;</a>' : '') +
            '<span class="ll__status" role="status" data-status></span>' +
          '</div>' +
        '</div>';

      dlg.querySelector('[data-x]').onclick = function () { dlg.close(); };
      dlg.querySelector('[data-cancel]').onclick = function () { dlg.close(); };
      var all = dlg.querySelector('[data-all]');
      if (all) all.onclick = function () { dlg.close(); };
      dlg.querySelector('[data-save]').onclick = function () {
        var text = dlg.querySelector('#ll-m').value;
        var okay = text.trim() ? put(subject, day, text) : remove(subject, day);
        if (okay) dlg.close();
        else dlg.querySelector('[data-status]').textContent =
          'This browser will not let the note save right now.';
      };

      dlg.showModal();
      dlg.querySelector('#ll-m').focus();
    }

    drawTrigger();
  }

  /* --- the full record, with comment threads ------------------------------ */

  function mountHistory(root, opts) {
    if (!root) return;
    var subject = opts.subject;
    var label = opts.label || 'this subject';
    var learner = opts.learner || '';
    var editing = null;   // date whose note is being written
    var replying = null;  // date whose reply box is open

    markSeen(subject);

    function noteBlock(e, date, isToday) {
      var cs = e ? comments(e) : [];
      var writing = editing === date;
      return '<li class="ll-note' + (isToday ? ' ll-note--today' : '') + '" data-date="' + esc(date) + '">' +
        '<div class="ll-note__head">' +
          '<h3 class="ll-note__when">' + esc(prettyDate(date)) + '</h3>' +
          '<span class="ll-note__meta">' + esc(date) + '</span>' +
          (cs.length ? '<span class="ll-note__count">' + cs.length +
            ' comment' + (cs.length === 1 ? '' : 's') + '</span>' : '') +
        '</div>' +
        (writing
          ? '<label class="sr" for="ll-e">Note for ' + esc(prettyDate(date)) + '</label>' +
            '<textarea id="ll-e" class="ll__text" rows="3" placeholder="In class today we&hellip;">' +
              esc(e ? e.text : '') + '</textarea>' +
            '<div class="ll__row">' +
              '<button type="button" class="ll__save" data-savenote>Save</button>' +
              '<button type="button" class="ll__quiet" data-cancelnote>Cancel</button>' +
              (e ? '<span class="ll__status">Clearing the box deletes this day.</span>' : '') +
            '</div>'
          : e
            ? '<p class="ll-note__text">' + esc(e.text) + '</p>'
            : '<p class="ll-note__text ll-note__text--empty">Nothing written for this day yet.</p>') +
        (cs.length
          ? '<ol class="ll-note__thread">' + cs.map(function (c) {
              return '<li class="ll-c ll-c--' + esc(c.who) + '">' +
                '<span class="ll-c__who">' + (c.who === 'ethan' ? 'Ethan' : 'Parent') + '</span>' +
                '<span class="ll-c__text">' + esc(c.text) + '</span>' +
                '<span class="ll-c__ts">' + esc(timeOf(c.ts)) + '</span>' +
                '<button type="button" class="ll-c__x" data-del="' + esc(c.id) + '" ' +
                  'aria-label="Delete this comment">&times;</button>' +
                '</li>';
            }).join('') + '</ol>'
          : '') +
        (replying === date
          ? '<div class="ll-note__reply">' +
              '<label class="sr" for="ll-r">Your comment</label>' +
              '<textarea id="ll-r" class="ll__text" rows="2" placeholder="Nice work &mdash; can you explain why?"></textarea>' +
              '<div class="ll__row">' +
                '<span class="ll-who">Reply as' +
                  '<select data-who>' +
                    '<option value="parent"' + (readAll().lastWho === 'parent' ? ' selected' : '') + '>Parent</option>' +
                    '<option value="ethan"' + (readAll().lastWho === 'ethan' ? ' selected' : '') + '>Ethan</option>' +
                  '</select>' +
                '</span>' +
                '<button type="button" class="ll__save" data-post>Post comment</button>' +
                '<button type="button" class="ll__quiet" data-closereply>Cancel</button>' +
              '</div>' +
            '</div>'
          : '<div class="ll__row ll-note__acts">' +
              (writing ? '' : '<button type="button" class="ll__quiet ll-note__add" data-edit>' +
                (e ? 'Edit note' : 'Write this day') + '</button>') +
              (e ? '<button type="button" class="ll__quiet ll-note__add" data-openreply>' +
                (cs.length ? 'Add a comment' : 'Comment on this') + '</button>' : '') +
            '</div>') +
        '</li>';
    }

    function draw() {
      var day = today();
      var list = forSubject(subject);
      var earlier = list.filter(function (e) { return e.date !== day; });

      root.className = 'll-history';
      root.innerHTML =
        '<ol class="ll-history__list">' + noteBlock(entryFor(subject, day), day, true) + '</ol>' +
        '<h2 class="ll-history__h">Earlier days</h2>' +
        (earlier.length
          ? '<ol class="ll-history__list">' + earlier.map(function (e) {
              return noteBlock(e, e.date, false);
            }).join('') + '</ol>'
          : '<p class="ll-history__empty">Nothing earlier yet' +
            (learner ? ', ' + esc(learner) : '') + '. Every day you write here stays, ' +
            'so the record builds up over the term.</p>');

      root.querySelectorAll('[data-edit]').forEach(function (b) {
        b.onclick = function () { editing = b.closest('.ll-note').dataset.date; replying = null; draw(); };
      });
      root.querySelectorAll('[data-cancelnote]').forEach(function (b) {
        b.onclick = function () { editing = null; draw(); };
      });
      root.querySelectorAll('[data-savenote]').forEach(function (b) {
        b.onclick = function () {
          var note = b.closest('.ll-note');
          var text = note.querySelector('#ll-e').value;
          if (text.trim()) put(subject, note.dataset.date, text);
          else remove(subject, note.dataset.date);
          editing = null;
          draw();
        };
      });
      root.querySelectorAll('[data-openreply]').forEach(function (b) {
        b.onclick = function () { replying = b.closest('.ll-note').dataset.date; editing = null; draw(); };
      });
      root.querySelectorAll('[data-closereply]').forEach(function (b) {
        b.onclick = function () { replying = null; draw(); };
      });
      root.querySelectorAll('[data-post]').forEach(function (b) {
        b.onclick = function () {
          var note = b.closest('.ll-note');
          addComment(subject, note.dataset.date,
            note.querySelector('[data-who]').value,
            note.querySelector('#ll-r').value);
          replying = null;
          markSeen(subject);
          draw();
        };
      });
      root.querySelectorAll('[data-del]').forEach(function (b) {
        b.onclick = function () {
          deleteComment(subject, b.closest('.ll-note').dataset.date, b.dataset.del);
          draw();
        };
      });
    }

    draw();
  }

  global.LearningLog = {
    mountButton: mountButton,
    mountHistory: mountHistory,
    today: today,
    forSubject: forSubject,
    entryFor: entryFor,
    addComment: addComment,
    newCount: newCount,
    markSeen: markSeen,
    STORAGE_KEY: KEY,
  };
}(window));
