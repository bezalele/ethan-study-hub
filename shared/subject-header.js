/* ---------------------------------------------------------------------------
   subject-header.js — builds the shared top-right cluster.

   One function so the three subjects cannot drift apart again. Each app keeps
   its own header on the left (breadcrumb, menu button, brand, nav); it hands
   this an empty element on the right and gets the same four controls in the
   same order every time.

     SubjectHeader.mount(el, {
       subject: 'biology',            // which list of notes
       label:   'Honors Biology',     // shown inside the note editor
       learner: 'Ethan',              // the name the page speaks to
       journalHref: '#log',           // where the full record lives
       hubHref: '../',                // back to the three subjects
       onDark: false,                 // true on AP Gov's green banner
     });

   Two doors to the same notes, on purpose:

     Today's Note      writes. Opens the editor over the page Ethan is on, so
                       a one-line note costs him no navigation.
     Ethan's Journal   reads. Goes to the record, which is where his mum is
                       told to look and where replies are answered.

   There is no unread badge. A red count on the chip made the site look like
   something with a task outstanding rather than somewhere to write a line
   about his day, which is the opposite of the point. LearningLog.newCount is
   still there if a quieter cue is ever wanted.

   Classic script, like learning-log.js, so the two classic-script apps and
   the module-based one all use it the same way. Requires learning-log.js to
   have loaded first.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  var ICON = {
    note: '<svg class="sh-chip__ico" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0-3-3L5.2 17 4 20Z"/>' +
      '<path d="M14.8 7.4 16.6 9.2"/></svg>',
    journal: '<svg class="sh-chip__ico" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19.5v-15Z"/>' +
      '<path d="M5 17h14M9 7h6M9 11h6"/></svg>',
    hub: '<svg class="sh-chip__ico" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M4 5h6v6H4zM14 5h6v6h-6zM4 13h6v6H4zM14 13h6v6h-6z"/></svg>',
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Remembered so the AP Gov router — which renders its chrome once at boot
     and never again — can ask for a redraw when the badge should change. */
  var last = null;

  function mount(root, opts) {
    if (!root) return;
    last = { root: root, opts: opts };

    var learner = opts.learner || '';
    var possessive = learner ? learner + '’s' : 'Your';
    var journal = possessive + ' Journal';

    root.className = 'sh-cluster' + (opts.onDark ? ' sh-on-dark' : '');
    root.innerHTML =
      '<span data-sh-note></span>' +
      '<a class="sh-chip sh-chip--read" href="' + esc(opts.journalHref) + '" data-sh-journal ' +
        'title="Every day ' + esc(learner || 'you') + ' has written, and the replies">' +
        ICON.journal +
        '<span class="sh-chip__txt">' + esc(journal) + '</span>' +
      '</a>' +
      '<a class="sh-chip sh-chip--quiet" href="' + esc(opts.hubHref || '../') + '" title="All subjects">' +
        ICON.hub + '<span class="sh-chip__txt">Study Hub</span>' +
      '</a>' +
      '<span class="sh-avatar" aria-label="' + esc(learner || 'Learner') + '">' +
        esc((learner || 'E').charAt(0)) + '</span>';

    if (global.LearningLog) {
      global.LearningLog.mountButton(root.querySelector('[data-sh-note]'), {
        subject: opts.subject,
        label: opts.label,
        learner: learner,
        historyHref: opts.journalHref,
        /* The note written from the header can name the lesson it was about,
           the same as the one written on the journal page. The list is the
           host app's - nothing here knows what a lesson is. */
        lessons: opts.lessons || [],
        /* And the ones he has opened lately, so the note written from here
           offers the same one-tap shortcut the journal page does. */
        recent: opts.recent || [],
      });
    }
  }

  /** Redraw with the arguments of the last mount. Safe to call at any time. */
  function refresh() {
    if (last) mount(last.root, last.opts);
  }

  /* The badge and the tick both read the store, so the cluster has to redraw
     whenever the store moves — a note saved from the modal, a reply posted,
     or the journal page marking replies as read. Listening beats calling
     refresh() from each app at the right moment, because "the right moment"
     is a different line of code in all three. */
  document.addEventListener('esh:log-changed', refresh);

  global.SubjectHeader = { mount: mount, refresh: refresh, ICON: ICON };
}(window));
