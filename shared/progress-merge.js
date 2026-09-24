/* ---------------------------------------------------------------------------
   progress-merge.js — combining Ethan's work from two machines.

   His lessons, practice attempts and quiz scores live in three separate
   stores, one per subject, each with a shape its own app decided on long
   before any of this synced. This file is the one place that knows how to
   put two copies of each of them together.

   THE RULE THAT MATTERS: every merge below is a union, a maximum, or a
   logical OR. Nothing here can make a store smaller.

   That is not tidiness, it is the whole safety property. Parents open this
   site on their own laptops to see how he is getting on, and their copy of
   his progress is empty. If merging could ever take something away, his
   mum opening the Biology page would delete his term's work. It cannot,
   because there is no rule here that removes anything.

   The cost of that choice is that nothing can be deleted through a sync
   either. Clearing progress has to be done deliberately, on the server.

   Classic script, so the browser loads it with a plain <script> and the
   Worker pulls in the same file. One implementation, two sides.
   --------------------------------------------------------------------------- */
(function (root) {
  'use strict';

  function num(x) { return Number(x) || 0; }
  function obj(x) { return (x && typeof x === 'object' && !Array.isArray(x)) ? x : {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }

  /* Attempts have no id. Two attempts that agree in every field are the same
     attempt as far as anyone can tell, so their own contents identify them. */
  function unionBy(a, b, signature) {
    var seen = {};
    var out = [];
    arr(a).concat(arr(b)).forEach(function (x) {
      var k = signature(x);
      if (k === null || seen[k]) return;
      seen[k] = true;
      out.push(x);
    });
    return out;
  }

  function sig(x) {
    try { return JSON.stringify(x); } catch (e) { return null; }
  }

  function unionValues(a, b) {
    var seen = {};
    var out = [];
    arr(a).concat(arr(b)).forEach(function (v) {
      var k = String(v);
      if (seen[k]) return;
      seen[k] = true;
      out.push(v);
    });
    return out;
  }

  /* --- Honors Biology -------------------------------------------------------
     { explored: [lessonId], attempts: [{...,date}], notes: {lessonId: text},
       last: lessonId }
     --------------------------------------------------------------------------- */
  function mergeBiology(a, b) {
    a = obj(a); b = obj(b);
    var notes = {};
    [obj(a.notes), obj(b.notes)].forEach(function (src) {
      Object.keys(src).forEach(function (id) {
        var mine = String(src[id] || '');
        var theirs = String(notes[id] || '');
        /* These reflection boxes carry no timestamp of their own, so there is
           nothing to compare but the text. Keeping the longer one is a guess,
           but it is the guess that loses the least: he adds to these as he
           thinks, so the longer version is almost always the later one, and
           an empty box never wins against a written one. */
        notes[id] = mine.length >= theirs.length ? mine : theirs;
      });
    });
    return {
      explored: unionValues(a.explored, b.explored),
      attempts: unionBy(a.attempts, b.attempts, sig),
      notes: notes,
      last: b.last || a.last || 'investigations'
    };
  }

  /* --- Math Quest -----------------------------------------------------------
     { version, attempts: [{id,correct,assisted,date}], lessonStarted,
       lessonComplete, ...whatever the app has added }
     --------------------------------------------------------------------------- */
  function mergeMath(a, b) {
    a = obj(a); b = obj(b);
    /* Start from both sides so a field this file has never heard of still
       survives - the app owns its own shape and may grow one at any time. */
    var out = {};
    Object.keys(a).forEach(function (k) { out[k] = a[k]; });
    Object.keys(b).forEach(function (k) { if (b[k] !== undefined && b[k] !== null) out[k] = b[k]; });

    out.version = 2;
    out.attempts = unionBy(a.attempts, b.attempts, sig);
    /* You cannot un-start a lesson. */
    out.lessonStarted = !!(a.lessonStarted || b.lessonStarted);
    out.lessonComplete = !!(a.lessonComplete || b.lessonComplete);
    return out;
  }

  /* --- AP U.S. Government ---------------------------------------------------
     { chapterId: { best, last, total, attempts } }
     --------------------------------------------------------------------------- */
  function mergeScores(a, b) {
    a = obj(a); b = obj(b);
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (ch) {
      if (out[ch]) return;
      var x = obj(a[ch]);
      var y = obj(b[ch]);
      out[ch] = {
        best: Math.max(num(x.best), num(y.best)),
        /* The higher count, not the sum. Summing would inflate every time the
           same two machines synced again. */
        attempts: Math.max(num(x.attempts), num(y.attempts)),
        last: y.last !== undefined ? y.last : x.last,
        total: num(y.total) || num(x.total)
      };
    });
    return out;
  }

  /* --- AP U.S. Government, the unit quick checks ----------------------------
     { units: { "2": { best, last, total, attempts, at } } }
     --------------------------------------------------------------------------- */
  function mergeApGov(a, b) {
    a = obj(a); b = obj(b);
    var A = obj(a.units), B = obj(b.units);
    var units = {};
    Object.keys(A).concat(Object.keys(B)).forEach(function (u) {
      if (units[u]) return;
      var x = obj(A[u]), y = obj(B[u]);
      var newer = num(y.at) >= num(x.at) ? y : x;
      units[u] = {
        best: Math.max(num(x.best), num(y.best)),
        /* The higher count, not the sum: syncing the same two laptops again
           would otherwise inflate it every time. */
        attempts: Math.max(num(x.attempts), num(y.attempts)),
        total: Math.max(num(x.total), num(y.total)),
        last: newer.last !== undefined ? newer.last : 0,
        at: Math.max(num(x.at), num(y.at)),
      };
    });
    return { units: units };
  }

  /* Which rule belongs to which store. A key nobody has taught this file
     about is kept whole from whichever side has it, rather than dropped. */
  var RULES = {
    'ethan_biology_v1': mergeBiology,
    'ethan_math_quest_v2': mergeMath,
    'ethanQuizScoresV1': mergeScores,
    'ethan_apgov_v1': mergeApGov
  };

  function keys() { return Object.keys(RULES); }

  /**
   * Combine two `{ stores: { key: value } }` documents.
   */
  function mergeAll(a, b) {
    var A = obj(obj(a).stores);
    var B = obj(obj(b).stores);
    var stores = {};
    Object.keys(A).concat(Object.keys(B)).forEach(function (k) {
      if (stores[k] !== undefined) return;
      var rule = RULES[k];
      if (rule) stores[k] = rule(A[k], B[k]);
      else stores[k] = B[k] !== undefined ? B[k] : A[k];
    });
    return { stores: stores };
  }

  root.ProgressMerge = { mergeAll: mergeAll, keys: keys, RULES: RULES };
}(typeof globalThis !== 'undefined' ? globalThis : this));
