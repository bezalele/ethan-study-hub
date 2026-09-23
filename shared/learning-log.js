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
                   nothing. Mounted by shared/subject-header.js as part of
                   the top-right cluster rather than called directly.
     mountHistory  the full record — every note by date, each with its own
                   comment thread, so notes can be talked about rather than
                   only written. This is what the "Ethan's Journal" chip in
                   that cluster leads to, and where unread replies are shown.

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

  /* Anything that changes the store announces it, so surfaces that are not
     part of this component can redraw. The header cluster listens: without
     this it depends on being mounted after whatever changed the data, and
     each app mounts in a different order. Ordering bugs of that kind are
     invisible until the badge sticks. */
  function notify() {
    try {
      document.dispatchEvent(new Event('esh:log-changed'));
    } catch (e) { /* No Event constructor: the UI simply redraws on the next load. */ }
  }

  /** Returns false when storage is unavailable, so the UI can say so. */
  function writeAll(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      notify();
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Raw rows, tombstones and all. Only merging and writing want these. */
  function rawComments(e) { return Array.isArray(e.comments) ? e.comments : []; }
  function rawReactions(e) { return Array.isArray(e.reactions) ? e.reactions : []; }
  function rawLinks(e) { return Array.isArray(e.links) ? e.links : []; }

  /* What to show. Days written before links were a list carry a single
     `lesson` instead; it reads as one link so nothing already saved is lost
     or needs migrating. */
  function links(e) {
    if (!e) return [];
    var rows = rawLinks(e).filter(function (l) { return !l.del && l.href; });
    if (rows.length) return rows;
    if (e.lesson && e.lesson.href) {
      return [{ id: 'legacy', title: e.lesson.title, href: e.lesson.href }];
    }
    return [];
  }

  /* What to show. A deleted comment keeps its id and carries `del`; a
     reaction taken off keeps its row and carries `off`. Both have to stay in
     the store so the removal survives a merge with a laptop that still has
     the original — see shared/journal-merge.js. Neither is ever displayed. */
  function comments(e) {
    return rawComments(e).filter(function (c) { return !c.del; });
  }

  function reactions(e) {
    return rawReactions(e).filter(function (r) { return !r.off; });
  }

  /* A short, fixed set. Six is enough to say something real in one tap and
     few enough that picking one is not a decision. They are worded for a
     parent reading a school note, not for a social feed — "tell me more" is
     a better thing for his mum to leave than a thumbs up. */
  var REACTIONS = [
    { k: 'proud',   e: '\ud83d\udc4f', label: 'Proud of you' },
    { k: 'nice',    e: '\ud83c\udf89', label: 'Nice work' },
    { k: 'idea',    e: '\ud83d\udca1', label: 'Good thinking' },
    { k: 'more',    e: '\ud83e\udd14', label: 'Tell me more' },
    { k: 'love',    e: '\u2764\ufe0f', label: 'Love this' },
    { k: 'tricky',  e: '\ud83d\udcaa', label: 'That was a hard one' }
  ];

  /** Add or remove one person's reaction of one kind. Tapping twice undoes it. */
  function toggleReaction(subject, date, kind, who) {
    var data = readAll();
    var e = data.entries.filter(function (x) {
      return x && x.subject === subject && x.date === date;
    })[0];
    if (!e) return false;
    who = who === 'ethan' ? 'ethan' : 'parent';
    var had = reactions(e).some(function (r) { return r.k === kind && r.who === who; });
    e.reactions = rawReactions(e).filter(function (r) {
      return !(r.k === kind && r.who === who);
    });
    e.reactions.push({ k: kind, who: who, ts: Date.now(), off: had });
    data.lastWho = who;
    return writeAll(data);
  }

  /** Who is using the page right now. Remembered between visits. */
  function who() { return readAll().lastWho; }

  function setWho(w) {
    var data = readAll();
    data.lastWho = w === 'ethan' ? 'ethan' : 'parent';
    return writeAll(data);
  }

  /* Days with something written on them. A day whose text is empty is a
     deleted day, kept only so the deletion survives the next merge. */
  function forSubject(subject) {
    return readAll().entries
      .filter(function (e) { return e && e.subject === subject && e.text; })
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }

  function entryFor(subject, date) {
    return forSubject(subject).filter(function (e) { return e.date === date; })[0] || null;
  }

  /** One entry per subject per day. Editing keeps that day's comments.
      `lesson` is optional: { title, href } pointing at the course material
      the day was about. It travels with the note text, so editing the note
      can change or clear it. */
  function put(subject, date, text) {
    var data = readAll();
    var existing = data.entries.filter(function (e) {
      return e && e.subject === subject && e.date === date;
    })[0];
    data.entries = data.entries.filter(function (e) {
      return !(e && e.subject === subject && e.date === date);
    });
    var row = {
      subject: subject, date: date, text: text.trim(), ts: Date.now(),
      comments: existing ? rawComments(existing) : [],
      reactions: existing ? rawReactions(existing) : [],
      /* Carried across untouched: a note edit must never drop a link. That
         is exactly how one went missing when links lived on the note. */
      links: existing ? rawLinks(existing) : [],
    };
    if (existing && existing.lesson) row.lesson = existing.lesson;
    return writeAll((data.entries.push(row), data));
  }

  /* Not a deletion — an empty day, stamped now. It has to outrank whatever
     the other laptops still hold, and a row that simply vanished would lose
     that argument on the next sync. */
  /** Attach a lesson to a day. Ignores one that is already there. */
  function addLink(subject, date, link) {
    if (!link || !link.href) return false;
    var data = readAll();
    var e = data.entries.filter(function (x) {
      return x && x.subject === subject && x.date === date;
    })[0];
    if (!e) return false;
    var rows = rawLinks(e);
    var already = rows.filter(function (l) { return l.href === link.href; })[0];
    if (already && !already.del) return true;
    if (already) {
      already.del = false;
      already.ts = Date.now();
    } else {
      rows.push({
        id: 'l' + Date.now() + Math.random().toString(36).slice(2, 6),
        title: String(link.title || link.href),
        href: String(link.href),
        ts: Date.now(),
      });
    }
    e.links = rows;
    return writeAll(data);
  }

  /* Marked, not removed: a row that simply vanished would be put back by the
     next laptop that still had it. */
  function removeLink(subject, date, href) {
    var data = readAll();
    var e = data.entries.filter(function (x) {
      return x && x.subject === subject && x.date === date;
    })[0];
    if (!e) return false;
    e.links = rawLinks(e).map(function (l) {
      return l.href === href ? { id: l.id, title: l.title, href: l.href, ts: Date.now(), del: true } : l;
    });
    /* A day written before links were a list keeps its single `lesson`, so
       removing that one has to clear the old field too. */
    if (e.lesson && e.lesson.href === href) delete e.lesson;
    return writeAll(data);
  }

  function remove(subject, date) {
    return put(subject, date, '');
  }

  function addComment(subject, date, who, text) {
    if (!text.trim()) return true;
    var data = readAll();
    var e = data.entries.filter(function (x) {
      return x && x.subject === subject && x.date === date;
    })[0];
    if (!e) return false;
    e.comments = rawComments(e).concat([{
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
    e.comments = rawComments(e).map(function (c) {
      return c.id === id ? { id: c.id, who: c.who, text: '', ts: Date.now(), del: true } : c;
    });
    return writeAll(data);
  }

  /** What Ethan has not looked at yet, for the badge on the journal chip.
      A reaction counts: a row of hands clapping on last Tuesday is exactly
      the kind of thing worth coming back for. */
  function newCount(subject) {
    var data = readAll();
    var since = Number(data.seen[subject] || 0);
    return data.entries.filter(function (e) { return e && e.subject === subject; })
      .reduce(function (n, e) {
        var fresh = function (x) { return x.who === 'parent' && Number(x.ts) > since; };
        return n + comments(e).filter(fresh).length + reactions(e).filter(fresh).length;
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
        return comments(e).concat(reactions(e)).reduce(function (m, x) {
          return Math.max(m, Number(x.ts) || 0);
        }, max);
      }, 0);
    data.seen[subject] = Math.max(Date.now(), newest);
    return writeAll(data);
  }

  /* The lessons this subject can offer, as [{ id, title, group, href }].
     Each app hands its own list in at mount time; nothing here knows what a
     lesson is. Empty means no picker is shown at all. */
  /** Make the day's links match what was picked, and nothing more. */
  function applyLinks(subject, date, wanted) {
    var now = links(entryFor(subject, date));
    now.forEach(function (l) {
      if (!wanted.some(function (x) { return x.href === l.href; })) {
        removeLink(subject, date, l.href);
      }
    });
    wanted.forEach(function (l) {
      if (!now.some(function (x) { return x.href === l.href; })) {
        addLink(subject, date, l);
      }
    });
  }

  /* --- What was this about? ------------------------------------------------
     He is fourteen and he is writing this at the end of a school day. A list
     of twenty-seven lessons is where he closes the tab, so nothing here is
     ever long and nothing here needs typing.

       Lately   the lessons he has actually opened. Most days the right
                answer is already sitting here and it costs one tap.
       Units    otherwise, the handful of units. Opening one shows only its
                lessons - and walking unit then lesson is itself worth
                something: after a fortnight he knows the shape of his own
                course without being taught it.

     It manages its own DOM rather than being redrawn by the editor around
     it, because the editor redraw would throw away whatever he had typed.
     --------------------------------------------------------------------------- */

  function mountPicker(host, opts) {
    if (!host) return { links: function () { return []; } };
    var lessons = opts.lessons || [];
    /* opts.recent - the lessons he has opened lately - is deliberately not
       shown yet. One way in is easier to learn than two, and the units are
       the way in that teaches him where things live. Held for later. */
    var chosen = (opts.initial || []).map(function (l) {
      return { title: l.title, href: l.href };
    });
    var open = null;   // which unit is expanded

    if (!lessons.length) { host.innerHTML = ''; return { links: function () { return chosen; } }; }

    var groups = [];
    var byGroup = {};
    lessons.forEach(function (l) {
      var g = l.group || 'Lessons';
      if (!byGroup[g]) { byGroup[g] = []; groups.push(g); }
      byGroup[g].push(l);
    });

    function has(href) {
      return chosen.some(function (c) { return c.href === href; });
    }

    /* A unit's badge: its number where it has one, else its initial. Small
       and quiet - it is there to give the eye a left edge to run down. */
    function badge(g) {
      var n = /(\d+)/.exec(g);
      return n ? n[1] : g.trim().charAt(0).toUpperCase();
    }

    function row(cls, attr, ic, title, tail) {
      return '<button type="button" class="ll-row ' + cls + '" ' + attr + '>' +
        '<span class="ll-row__ic" aria-hidden="true">' + ic + '</span>' +
        '<span class="ll-row__t">' + esc(title) + '</span>' +
        (tail || '') +
      '</button>';
    }

    function draw() {
      var chosenRows = chosen.map(function (c) {
        return '<div class="ll-row ll-lk">' +
          '<span class="ll-row__ic ll-row__ic--on" aria-hidden="true">\ud83d\udcd6</span>' +
          '<span class="ll-row__t">' + esc(c.title) + '</span>' +
          '<button type="button" class="ll-lk__x" data-drop="' + esc(c.href) + '" ' +
            'aria-label="Remove ' + esc(c.title) + '">&times;</button>' +
        '</div>';
      }).join('');

      host.className = 'll-pick';
      host.innerHTML =
        '<span class="ll-pick__l">What was this about?</span>' +
        '<div class="ll-pick__list">' +
          (chosenRows ? '<div class="ll-pick__chosen">' + chosenRows + '</div>' : '') +
          '<p class="ll-pick__cap">All lessons</p>' +
          groups.map(function (g) {
            var isOpen = open === g;
            var items = byGroup[g].filter(function (l) { return !has(l.href); });
            return '<div class="ll-unit' + (isOpen ? ' is-open' : '') + '">' +
              '<button type="button" class="ll-row ll-unit__b" data-group="' + esc(g) + '" ' +
                'aria-expanded="' + isOpen + '">' +
                '<span class="ll-row__ic ll-unit__ic" aria-hidden="true">' + esc(badge(g)) + '</span>' +
                '<span class="ll-row__t">' + esc(g) + '</span>' +
                '<span class="ll-row__go ll-unit__caret" aria-hidden="true"></span>' +
              '</button>' +
              (isOpen
                ? '<div class="ll-unit__list">' +
                    (items.length
                      ? items.map(function (l) {
                          return row('ll-opt', 'data-add="' + esc(l.href) + '"',
                            '', l.title, '<span class="ll-row__go" aria-hidden="true"></span>');
                        }).join('')
                      : '<span class="ll-unit__done">All of these are already linked.</span>') +
                  '</div>'
                : '') +
            '</div>';
          }).join('') +
        '</div>';

      host.querySelectorAll('[data-group]').forEach(function (b) {
        b.onclick = function (ev) {
          ev.preventDefault();
          open = (open === b.dataset.group) ? null : b.dataset.group;
          draw();
          /* Bring the unit he just opened to the top of the list, so its
             lessons are what he is looking at and not what he scrolls for. */
          var o = host.querySelector('.ll-unit.is-open');
          var box = host.querySelector('.ll-pick__list');
          if (o && box) box.scrollTop += o.getBoundingClientRect().top - box.getBoundingClientRect().top - 4;
        };
      });
      host.querySelectorAll('[data-add]').forEach(function (b) {
        b.onclick = function (ev) {
          ev.preventDefault();
          var l = lessons.filter(function (x) { return x.href === b.dataset.add; })[0];
          if (l && !has(l.href)) chosen.push({ title: l.title, href: l.href });
          open = null;
          draw();
        };
      });
      host.querySelectorAll('[data-drop]').forEach(function (b) {
        b.onclick = function (ev) {
          ev.preventDefault();
          chosen = chosen.filter(function (c) { return c.href !== b.dataset.drop; });
          draw();
        };
      });
    }

    draw();
    return { links: function () { return chosen.slice(); } };
  }

  /** Every lesson a day points at, as links you can actually follow. */
  function lessonChips(e) {
    var rows = links(e);
    if (!rows.length) return '';
    return '<div class="ll-note__links">' + rows.map(function (l) {
      return '<a class="ll-note__lesson" href="' + esc(l.href) + '">' +
        '<span aria-hidden="true">\ud83d\udcd6</span>' + esc(l.title) + '</a>';
    }).join('') + '</div>';
  }

  var PENCIL = '<svg class="sh-chip__ico" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0-3-3L5.2 17 4 20Z"/><path d="M14.8 7.4 16.6 9.2"/></svg>';

  function firstLine(text, max) {
    var t = String(text).split('\n')[0];
    return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
  }

  /* --- header trigger + modal editor --------------------------------------
     A button rather than a panel: writing one line a day should not cost the
     home page a permanent block, and nothing on the page moves when it opens.
     It lives in the app header, so the note can be written from any page.

     The trigger wears the shared header's chip classes (shared/subject-header.css)
     rather than a look of its own, because it sits shoulder to shoulder with
     the journal and hub chips and has to match them exactly. Behaviour is
     this file's business; the shape is the header's.

     No badge here. Unread replies are shown on the journal chip next door,
     which is where you go to read them.
     --------------------------------------------------------------------------- */

  function mountButton(root, opts) {
    if (!root) return;
    var subject = opts.subject;
    var label = opts.label || 'this subject';
    var learner = opts.learner || '';
    var historyHref = opts.historyHref || '';
    var lessons = opts.lessons || [];
    var dlg = null;

    function prompt() {
      return 'What did you learn today' + (learner ? ', ' + learner : '') + '?';
    }

    function drawTrigger() {
      var has = !!entryFor(subject, today());
      root.innerHTML =
        '<button type="button" class="sh-chip sh-chip--write" data-open ' +
          'title="' + esc(prompt()) + '" aria-label="' + esc(prompt()) + '">' +
          PENCIL +
          '<span class="sh-chip__txt">Today’s Note</span>' +
          (has ? '<span class="sh-chip__tick" aria-hidden="true">✓</span>' : '') +
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
          '<textarea id="ll-m" class="ll__text" rows="4" placeholder="In class today we&hellip;">' +
            esc(entry ? entry.text : '') + '</textarea>' +
          '<div data-picker></div>' +
          '<div class="ll__row ll-modal__row">' +
            '<button type="button" class="ll__save" data-save>Save</button>' +
            '<button type="button" class="ll__quiet" data-cancel>Cancel</button>' +
            (historyHref ? '<a class="ll__link ll-modal__all" href="' + esc(historyHref) + '" data-all>All notes &amp; replies &rarr;</a>' : '') +
            '<span class="ll__status" role="status" data-status></span>' +
          '</div>' +
        '</div>';

      var picker = mountPicker(dlg.querySelector('[data-picker]'), {
        lessons: lessons, recent: opts.recent || [], initial: links(entry),
      });

      dlg.querySelector('[data-x]').onclick = function () { dlg.close(); };
      dlg.querySelector('[data-cancel]').onclick = function () { dlg.close(); };
      var all = dlg.querySelector('[data-all]');
      if (all) all.onclick = function () { dlg.close(); };
      dlg.querySelector('[data-save]').onclick = function () {
        var text = dlg.querySelector('#ll-m').value;
        /* A day is its note: an empty box clears it. So saving a lesson with
           nothing written would throw the lesson away on the spot - which is
           exactly what it looked like when a pick "did not save". Ask for the
           line instead, and keep everything he has picked. */
        if (!text.trim() && picker.links().length) {
          var ask = dlg.querySelector('[data-status]');
          ask.className = 'll__status ll__status--ask';
          ask.textContent = 'Write a line about it first \u2014 then the lesson saves with it.';
          dlg.querySelector('#ll-m').focus();
          return;
        }
        var okay = text.trim() ? put(subject, day, text) : remove(subject, day);
        /* Links are their own list, applied after the note exists. */
        if (okay && text.trim()) applyLinks(subject, day, picker.links());
        if (okay) dlg.close();
        else dlg.querySelector('[data-status]').textContent =
          'This browser will not let the note save right now.';
      };

      dlg.showModal();
      dlg.querySelector('#ll-m').focus();
    }

    drawTrigger();
  }

  /* --- school days ---------------------------------------------------------
     Weekdays are school days, weekends are not, and anything in NO_SCHOOL
     overrides both: holidays, closures, professional days.

     NO_SCHOOL starts empty on purpose. The calendar marks the school days he
     has not written up, so a guessed holiday would put a missed day against
     a day he was never in school. Fill it from the district's academic
     calendar and nothing else:

       LearningLog.setNoSchool({ '2026-11-26': 'Thanksgiving' });

     Call it before the page mounts - the host app's own script is the place.
     --------------------------------------------------------------------------- */

  var NO_SCHOOL = {};

  function setNoSchool(map) {
    NO_SCHOOL = (map && typeof map === 'object') ? map : {};
  }

  function dateOf(iso) {
    var p = String(iso).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function isoOf(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function isWeekend(iso) {
    var w = dateOf(iso).getDay();
    return w === 0 || w === 6;
  }

  function isSchoolDay(iso) {
    return !isWeekend(iso) && !NO_SCHOOL[iso];
  }

  /** What kind of day this is, in words, for the label beside the date. */
  function dayKind(iso) {
    if (NO_SCHOOL[iso]) return NO_SCHOOL[iso];
    return isWeekend(iso) ? 'Weekend' : 'School day';
  }

  /* School days in a row, counting back from today. Today not being written
     yet does not break it — the day is not over. Weekends and holidays are
     stepped over rather than counted, so a Friday note and a Monday note are
     two days in a row. */
  function streak(subject) {
    var notes = {};
    forSubject(subject).forEach(function (e) { notes[e.date] = e; });
    var todayIso = today();
    var d = dateOf(todayIso);
    var n = 0;
    for (var i = 0; i < 400; i++) {
      var iso = isoOf(d);
      if (isSchoolDay(iso)) {
        if (notes[iso]) n += 1;
        else if (iso !== todayIso) break;
      }
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  /* --- is this laptop connected? ------------------------------------------
     One line under the month. It is the only place the sync is visible, and
     most of the time it says four words and gets out of the way.

     It redraws on its own rather than through the calendar's draw(), so a
     sync landing while Ethan is halfway through typing a note does not throw
     the box away underneath him.
     --------------------------------------------------------------------------- */

  var stripEl = null;

  /* The calendar currently on screen, so a sync landing after the page has
     drawn can put the new days on it. Without this, opening the journal shows
     whatever this laptop knew a moment before the sync arrived - which is
     exactly the moment someone else's note is most likely to be waiting. */
  var liveRedraw = null;

  document.addEventListener('esh:log-changed', function () {
    if (liveRedraw) liveRedraw();
  });

  function ago(ts) {
    var s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.round(s / 60) + ' min ago';
    if (s < 86400) return Math.round(s / 3600) + ' hr ago';
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function drawStrip(el, detail) {
    if (!el) return;
    stripEl = el;
    var sync = global.JournalSync;
    if (!sync) { el.innerHTML = ''; return; }
    var state = (detail && detail.state) || (sync.isConnected() ? 'idle' : 'off');

    if (state === 'asking') {
      el.className = 'll-sync is-asking';
      el.innerHTML =
        '<label class="sr" for="ll-key">Family passphrase</label>' +
        '<input id="ll-key" class="ll-sync__in" type="password" autocomplete="off"' +
        ' placeholder="Family passphrase">' +
        '<button type="button" class="ll__save ll-sync__go" data-go>Connect</button>' +
        '<button type="button" class="ll__quiet ll-sync__go" data-cancelkey>Cancel</button>';
      var input = el.querySelector('#ll-key');
      input.focus();
      var go = function () {
        el.querySelector('[data-go]').disabled = true;
        sync.connect(input.value).catch(function () { /* announced already */ });
      };
      el.querySelector('[data-go]').onclick = go;
      input.onkeydown = function (ev) { if (ev.key === 'Enter') go(); };
      el.querySelector('[data-cancelkey]').onclick = function () { drawStrip(el, null); };
      return;
    }

    var auto = !!(sync.isAutomatic && sync.isAutomatic());

    var body;
    if (state === 'off' || state === 'disconnected') {
      body = '<span class="ll-sync__dot ll-sync__dot--off"></span>' +
        '<span>Saved on this laptop only.</span>' +
        '<button type="button" class="ll-sync__link" data-connect>Connect this laptop</button>';
    } else if (state === 'syncing') {
      body = '<span class="ll-sync__dot ll-sync__dot--busy"></span><span>Syncing\u2026</span>';
    } else if (state === 'error') {
      body = '<span class="ll-sync__dot ll-sync__dot--bad"></span>' +
        '<span>' + esc(detail && detail.message ? detail.message : 'Could not reach the journal.') + '</span>' +
        '<button type="button" class="ll-sync__link" data-connect>Try again</button>';
    } else {
      var when = sync.lastSynced();
      body = '<span class="ll-sync__dot ll-sync__dot--ok"></span>' +
        '<span>Shared with your family' + (when ? ' \u00b7 synced ' + esc(ago(when)) : '') + '.</span>' +
        /* Nothing to disconnect from when connecting is automatic: the
           next page load would simply connect again. */
        (auto ? '' : '<button type="button" class="ll-sync__link" data-forget>Disconnect</button>');
    }
    el.className = 'll-sync';
    el.innerHTML = body;

    var c = el.querySelector('[data-connect]');
    if (c) c.onclick = function () { drawStrip(el, { state: 'asking' }); };
    var f = el.querySelector('[data-forget]');
    if (f) f.onclick = function () { sync.disconnect(); };
  }

  /* Registered once, at load, not per mount: mountHistory runs again on every
     navigation in two of the three apps, and a listener added there would
     stack up one deep per page visited. */
  document.addEventListener('esh:sync', function (e) { drawStrip(stripEl, e.detail); });

  /* --- the record, a month at a time ---------------------------------------
     A calendar rather than a list, because what this page is for is the
     habit, and a habit has a shape you can only see on a grid: the school
     days he wrote up, the school days he did not, and the weekends that were
     never his to fill. A list of the days he did write hides exactly the
     days he did not.

     Picking a day opens that day underneath. Days still to come cannot be
     picked: there is nothing to remember yet.
     --------------------------------------------------------------------------- */

  function mountHistory(root, opts) {
    if (!root) return;
    var subject = opts.subject;
    var label = opts.label || 'this subject';
    var learner = opts.learner || '';
    var lessons = opts.lessons || [];
    var todayIso = today();
    var selected = todayIso;
    var cursor = dateOf(todayIso);   // any date inside the month on show
    var editing = null;              // date whose note is being written
    var pagePicker = null;           // the lesson picker, while an editor is open
    var replying = null;             // date whose reply box is open

    markSeen(subject);

    /** Every entry for this subject, by date. One read per draw. */
    function byDate() {
      var map = {};
      forSubject(subject).forEach(function (e) { map[e.date] = e; });
      return map;
    }

    /** The cells of the month on show: ISO dates, padded with nulls. */
    function cells() {
      var y = cursor.getFullYear();
      var m = cursor.getMonth();
      var out = [];
      var i;
      for (i = 0; i < new Date(y, m, 1).getDay(); i++) out.push(null);
      for (i = 1; i <= new Date(y, m + 1, 0).getDate(); i++) out.push(isoOf(new Date(y, m, i)));
      while (out.length % 7) out.push(null);
      return out;
    }

    function dayCell(iso, notes) {
      if (!iso) return '<span class="ll-day ll-day--pad" aria-hidden="true"></span>';
      var has = !!notes[iso];
      var ahead = iso > todayIso;
      var school = isSchoolDay(iso);
      var cls = ['ll-day'];
      if (!school) cls.push('is-off');
      if (iso === todayIso) cls.push('is-today');
      if (iso === selected) cls.push('is-selected');
      if (has) cls.push('has-note');
      if (ahead) cls.push('is-ahead');

      var what = has ? 'note written'
        : ahead ? 'still to come'
        : school ? 'nothing written yet'
        : dayKind(iso).toLowerCase();

      return '<button type="button" class="' + cls.join(' ') + '" data-day="' + iso + '"' +
        (ahead ? ' disabled' : '') +
        ' aria-pressed="' + (iso === selected) + '"' +
        ' title="' + esc(prettyDate(iso) + ' \u00b7 ' + what) + '"' +
        ' aria-label="' + esc(prettyDate(iso) + ', ' + what) + '">' +
        '<span class="ll-day__n">' + Number(iso.slice(8)) + '</span>' +
        '<span class="ll-day__mark" aria-hidden="true"></span>' +
        '</button>';
    }

    /** School days this month that have happened, and how many he wrote up. */
    function tally(notes) {
      var done = 0, due = 0;
      cells().forEach(function (iso) {
        if (!iso || iso > todayIso || !isSchoolDay(iso)) return;
        due += 1;
        if (notes[iso]) done += 1;
      });
      return { done: done, due: due };
    }

    function tallyLine(t) {
      var run = streak(subject);
      var tail = run >= 2 ? ' <span class="ll-cal__run">' + run + ' school days in a row.</span>' : '';
      if (!t.due) return 'No school days in this month yet.';
      if (t.done === t.due) {
        return 'Every school day this month' + (learner ? ', ' + esc(learner) : '') +
          ' \u2014 ' + t.done + ' of ' + t.due + '.' + tail;
      }
      return '<strong>' + t.done + ' of ' + t.due + '</strong> school days written up this month.' + tail;
    }

    /* One row of taps. Each shows how many people left it and lights up if
       the person at the keyboard is one of them. Only on days that have a
       note: there is nothing to react to otherwise. */
    function reactionRow(e, date) {
      if (!e) return '';
      var mine = who();
      var all = reactions(e);
      return '<div class="ll-react" role="group" aria-label="React to this note">' +
        REACTIONS.map(function (r) {
          var these = all.filter(function (x) { return x.k === r.k; });
          var on = these.some(function (x) { return x.who === mine; });
          return '<button type="button" class="ll-react__b' + (on ? ' is-on' : '') +
            '" data-react="' + r.k + '" data-rdate="' + esc(date) + '"' +
            ' aria-pressed="' + on + '" title="' + esc(r.label) + '">' +
            '<span class="ll-react__e" aria-hidden="true">' + r.e + '</span>' +
            '<span class="sr">' + esc(r.label) + '</span>' +
            (these.length ? '<span class="ll-react__n">' + these.length + '</span>' : '') +
            '</button>';
        }).join('') +
        '</div>';
    }

    function noteBlock(e, date) {
      var cs = e ? comments(e) : [];
      var writing = editing === date;
      var school = isSchoolDay(date);
      var empty = school
        ? 'Nothing written for this day yet.'
        : 'No school this day \u2014 nothing to write up.';

      return '<li class="ll-note' + (date === todayIso ? ' ll-note--today' : '') +
          '" data-date="' + esc(date) + '">' +
        '<div class="ll-note__head">' +
          '<h3 class="ll-note__when">' + esc(prettyDate(date)) + '</h3>' +
          '<span class="ll-note__kind' + (school ? '' : ' is-off') + '">' + esc(dayKind(date)) + '</span>' +
          '<span class="ll-note__meta">' + esc(date) + '</span>' +
          (cs.length ? '<span class="ll-note__count">' + cs.length +
            ' comment' + (cs.length === 1 ? '' : 's') + '</span>' : '') +
        '</div>' +
        (writing
          ? '<label class="sr" for="ll-e">Note for ' + esc(prettyDate(date)) + '</label>' +
            '<textarea id="ll-e" class="ll__text" rows="4" placeholder="In class today we&hellip;">' +
              esc(e ? e.text : '') + '</textarea>' +
            '<div data-picker></div>' +
            '<div class="ll__row">' +
              '<button type="button" class="ll__save" data-savenote>Save</button>' +
              '<button type="button" class="ll__quiet" data-cancelnote>Cancel</button>' +
              '<span class="ll__status" data-pagestatus>' +
                (e ? 'Clearing the box deletes this day.' : '') + '</span>' +
            '</div>'
          : e
            ? '<p class="ll-note__text">' + esc(e.text) + '</p>'
            : '<p class="ll-note__text ll-note__text--empty">' + empty + '</p>') +
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
        /* Under the conversation, not wedged between the note and the replies
           to it: the link is where you go after reading, not part of the note. */
        lessonChips(e) +
        (replying === date
          ? '<div class="ll-note__reply">' +
              '<label class="sr" for="ll-r">Your comment</label>' +
              '<textarea id="ll-r" class="ll__text" rows="2" placeholder="Nice work &mdash; can you explain why?"></textarea>' +
              '<div class="ll__row">' +
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
        reactionRow(e, date) +
        '</li>';
    }

    var drawing = false;

    /* Redraw on someone else's writing, but never out from under Ethan's
       hands: if a box is open, the new material waits until he closes it. */
    liveRedraw = function () {
      if (drawing || editing || replying) return;
      draw();
    };

    function draw() {
      drawing = true;
      var notes = byDate();
      var t = tally(notes);
      var here = dateOf(todayIso);
      var atThisMonth = cursor.getFullYear() === here.getFullYear()
        && cursor.getMonth() === here.getMonth();

      root.className = 'll-history';
      root.innerHTML =
        '<section class="ll-cal" aria-label="Pick a day">' +
          '<div class="ll-cal__top">' +
            '<button type="button" class="ll-cal__nav" data-prev aria-label="Previous month">&lsaquo;</button>' +
            '<h2 class="ll-cal__month">' + MONTHS[cursor.getMonth()] + ' ' + cursor.getFullYear() + '</h2>' +
            '<button type="button" class="ll-cal__nav" data-next aria-label="Next month"' +
              (atThisMonth ? ' disabled' : '') + '>&rsaquo;</button>' +
            (atThisMonth && selected === todayIso ? ''
              : '<button type="button" class="ll-cal__today" data-jump>Today</button>') +
          '</div>' +
          '<div class="ll-cal__grid">' +
            DOW.map(function (d) { return '<span class="ll-cal__dow">' + d + '</span>'; }).join('') +
            cells().map(function (iso) { return dayCell(iso, notes); }).join('') +
          '</div>' +
          '<ul class="ll-cal__key">' +
            '<li><span class="ll-k ll-k--school"></span>School day</li>' +
            '<li><span class="ll-k ll-k--off"></span>No school</li>' +
            '<li><span class="ll-k ll-k--note"></span>Written up</li>' +
          '</ul>' +
          '<p class="ll-cal__tally">' + tallyLine(t) + '</p>' +
          '<div class="ll-sync" data-sync></div>' +
        '</section>' +
        '<section class="ll-pane" aria-label="The day you picked">' +
          '<div class="ll-me">' +
            '<span class="ll-me__l">You are</span>' +
            '<button type="button" class="ll-me__b' + (who() === 'ethan' ? ' is-on' : '') +
              '" data-me="ethan" aria-pressed="' + (who() === 'ethan') + '">' +
              esc(learner || 'Ethan') + '</button>' +
            '<button type="button" class="ll-me__b' + (who() === 'parent' ? ' is-on' : '') +
              '" data-me="parent" aria-pressed="' + (who() === 'parent') + '">Parent</button>' +
          '</div>' +
          '<ol class="ll-history__list">' + noteBlock(notes[selected], selected) + '</ol>' +
        '</section>';

      drawStrip(root.querySelector('[data-sync]'), null);

      /* Mounted after the editor exists, and only while one is open. */
      pagePicker = null;
      var slot = root.querySelector('[data-picker]');
      if (slot) {
        pagePicker = mountPicker(slot, {
          lessons: lessons, recent: opts.recent || [],
          initial: links(notes[editing]),
        });
      }
      root.querySelectorAll('[data-day]').forEach(function (b) {
        b.onclick = function () {
          selected = b.dataset.day;
          editing = null;
          replying = null;
          draw();
        };
      });
      var prev = root.querySelector('[data-prev]');
      if (prev) prev.onclick = function () { cursor.setMonth(cursor.getMonth() - 1, 1); draw(); };
      var next = root.querySelector('[data-next]');
      if (next) next.onclick = function () { cursor.setMonth(cursor.getMonth() + 1, 1); draw(); };
      var jump = root.querySelector('[data-jump]');
      if (jump) jump.onclick = function () {
        cursor = dateOf(todayIso);
        selected = todayIso;
        editing = null;
        replying = null;
        draw();
      };

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
          var d = note.dataset.date;
          var wanted = pagePicker ? pagePicker.links() : null;
          /* Same as the modal: don't throw a pick away because the box is
             still empty. */
          if (!text.trim() && wanted && wanted.length) {
            var ask = note.querySelector('[data-pagestatus]');
            if (ask) {
              ask.className = 'll__status ll__status--ask';
              ask.textContent = 'Write a line about it first \u2014 then the lesson saves with it.';
            }
            note.querySelector('#ll-e').focus();
            return;
          }
          if (text.trim()) {
            put(subject, d, text);
            if (wanted) applyLinks(subject, d, wanted);
          } else {
            remove(subject, d);
          }
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
          addComment(subject, note.dataset.date, who(), note.querySelector('#ll-r').value);
          replying = null;
          markSeen(subject);
          draw();
        };
      });
      root.querySelectorAll('[data-react]').forEach(function (b) {
        b.onclick = function () {
          toggleReaction(subject, b.dataset.rdate, b.dataset.react, who());
          markSeen(subject);
          draw();
        };
      });
      root.querySelectorAll('[data-me]').forEach(function (b) {
        b.onclick = function () { setWho(b.dataset.me); draw(); };
      });
      root.querySelectorAll('[data-del]').forEach(function (b) {
        b.onclick = function () {
          deleteComment(subject, b.closest('.ll-note').dataset.date, b.dataset.del);
          draw();
        };
      });
      drawing = false;
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
    setNoSchool: setNoSchool,
    isSchoolDay: isSchoolDay,
    toggleReaction: toggleReaction,
    addLink: addLink,
    removeLink: removeLink,
    links: links,
    streak: streak,
    REACTIONS: REACTIONS,
    STORAGE_KEY: KEY,
  };
}(window));
