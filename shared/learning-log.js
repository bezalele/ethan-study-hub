/* ---------------------------------------------------------------------------
   learning-log.js — "What did you learn today?"

   Shared across every subject in the hub. Biology, Math Quest and AP U.S.
   Government each mount the same component and each keep their own list:
   entries are tagged with a subject and only that subject's entries are ever
   shown. One store rather than three, because all three apps are served from
   the same origin — so a combined view on the Study Hub landing page stays
   possible later without moving anyone's data.

   Plain script, not a module, so the two classic-script apps and the
   module-based one can all use it the same way:

     <script src="../shared/learning-log.js"></script>
     LearningLog.mount(el, { subject: 'biology', label: 'Honors Biology' });

   Dates are local, not UTC — "today" has to mean the day it is where Ethan
   is sitting, or an evening entry lands on tomorrow.
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
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function prettyDate(iso) {
    var parts = String(iso).split('-');
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d)) return iso;
    var out = d.toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    if (d.getFullYear() !== new Date().getFullYear()) {
      out += ', ' + d.getFullYear();
    }
    return out;
  }

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return Array.isArray(raw.entries) ? raw.entries : [];
    } catch (e) {
      return [];
    }
  }

  /** Returns false when storage is unavailable, so the UI can say so. */
  function write(entries) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ entries: entries }));
      return true;
    } catch (e) {
      return false;
    }
  }

  function forSubject(subject) {
    return read()
      .filter(function (e) { return e && e.subject === subject; })
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }

  function entryFor(subject, date) {
    return forSubject(subject).filter(function (e) { return e.date === date; })[0] || null;
  }

  /** One entry per subject per day: writing again replaces that day's note. */
  function put(subject, date, text) {
    var all = read().filter(function (e) {
      return !(e && e.subject === subject && e.date === date);
    });
    if (text.trim()) {
      all.push({ subject: subject, date: date, text: text.trim(), ts: Date.now() });
    }
    return write(all);
  }

  function remove(subject, date) {
    return write(read().filter(function (e) {
      return !(e && e.subject === subject && e.date === date);
    }));
  }

  var PENCIL = '<svg class="ll__ico" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0-3-3L5.2 17 4 20Z"/><path d="M14.8 7.4 16.6 9.2"/></svg>';

  function mount(root, opts) {
    if (!root) return;
    var subject = opts.subject;
    var label = opts.label || 'this subject';
    var editing = false;

    function draw() {
      var day = today();
      var entry = entryFor(subject, day);
      var earlier = forSubject(subject).filter(function (e) { return e.date !== day; });
      var open = editing || !entry;

      root.className = 'll';
      root.innerHTML =
        '<div class="ll__head">' +
          '<span class="ll__badge" aria-hidden="true">' + PENCIL + '</span>' +
          '<div>' +
            '<h2 class="ll__title">What did you learn today?</h2>' +
            '<p class="ll__sub">' + esc(prettyDate(day)) + ' &middot; ' + esc(label) + '</p>' +
          '</div>' +
        '</div>' +
        (open
          ? '<label class="sr" for="ll-text">Today\'s note</label>' +
            '<textarea id="ll-text" class="ll__text" rows="3" ' +
              'placeholder="In class today we&hellip;">' + esc(entry ? entry.text : '') + '</textarea>' +
            '<div class="ll__row">' +
              '<button type="button" class="ll__save" data-save>Save today\'s note</button>' +
              (entry ? '<button type="button" class="ll__quiet" data-cancel>Cancel</button>' : '') +
              '<span class="ll__status" role="status" data-status></span>' +
            '</div>'
          : '<p class="ll__entry">' + esc(entry.text) + '</p>' +
            '<div class="ll__row">' +
              '<button type="button" class="ll__quiet" data-edit>Edit</button>' +
              '<span class="ll__status" role="status" data-status>Saved</span>' +
            '</div>') +
        (earlier.length
          ? '<details class="ll__past"><summary>Earlier notes (' + earlier.length + ')</summary>' +
              '<ol class="ll__list">' + earlier.map(function (e) {
                return '<li><span class="ll__when">' + esc(prettyDate(e.date)) + '</span>' +
                       '<span class="ll__what">' + esc(e.text) + '</span></li>';
              }).join('') + '</ol></details>'
          : '');

      var status = root.querySelector('[data-status]');
      var save = root.querySelector('[data-save]');
      var edit = root.querySelector('[data-edit]');
      var cancel = root.querySelector('[data-cancel]');

      if (save) {
        save.onclick = function () {
          var text = root.querySelector('#ll-text').value;
          if (!text.trim()) {
            // Clearing the box is how you delete the day's note.
            remove(subject, day);
            editing = false;
            draw();
            return;
          }
          if (put(subject, day, text)) {
            editing = false;
            draw();
          } else {
            status.textContent = 'This browser will not let the note save right now.';
          }
        };
      }
      if (edit) edit.onclick = function () { editing = true; draw(); };
      if (cancel) cancel.onclick = function () { editing = false; draw(); };
    }

    draw();
  }

  global.LearningLog = {
    mount: mount,
    today: today,
    forSubject: forSubject,
    entryFor: entryFor,
    STORAGE_KEY: KEY,
  };
}(window));
