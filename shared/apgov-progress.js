/* ---------------------------------------------------------------------------
   apgov-progress.js — what Ethan has done in AP U.S. Government.

   Three things happen on that subject and only one of them was being kept:

     chapter quizzes   saved already, in ethanQuizScoresV1
     unit quick checks scored on screen and then forgotten
     practice cards    flashcards - he says the answer out loud and turns the
                       card over, so there is nothing to keep

   This holds the second one. It is a classic script, like the rest of the
   shared folder, so the module app and the two script apps can all read it,
   and it is listed in progress-merge so it syncs to the other laptops like
   everything else.

   Shape:

     { units: { "2": { best, last, total, attempts, at } } }

   `best` never goes down and `attempts` counts up - the merge rules say so,
   and that is what makes this safe to sync: two laptops can only ever add to
   what he has done.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  var KEY = 'ethan_apgov_v1';

  function read() {
    try {
      var raw = JSON.parse(global.localStorage.getItem(KEY) || '{}');
      if (!raw || typeof raw !== 'object') return { units: {} };
      if (!raw.units || typeof raw.units !== 'object') raw.units = {};
      return raw;
    } catch (e) {
      return { units: {} };
    }
  }

  function write(doc) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(doc));
      /* The same announcement the journal makes, so the sync client pushes
         it without waiting for its next poll. */
      if (global.document && global.document.dispatchEvent) {
        global.document.dispatchEvent(new CustomEvent('esh:progress-changed'));
      }
      return true;
    } catch (e) {
      /* A private window must not break the quiz. */
      return false;
    }
  }

  /** Record one run of a unit's quick check. */
  function recordUnitCheck(unit, right, total) {
    var doc = read();
    var id = String(unit);
    var was = doc.units[id] || {};
    doc.units[id] = {
      best: Math.max(Number(was.best) || 0, Number(right) || 0),
      last: Number(right) || 0,
      total: Math.max(Number(was.total) || 0, Number(total) || 0),
      attempts: (Number(was.attempts) || 0) + 1,
      at: Date.now(),
    };
    write(doc);
    return doc.units[id];
  }

  function unitCheck(unit) {
    return read().units[String(unit)] || null;
  }

  global.ApGovProgress = {
    STORAGE_KEY: KEY,
    read: read,
    recordUnitCheck: recordUnitCheck,
    unitCheck: unitCheck,
  };
}(typeof globalThis !== 'undefined' ? globalThis : this));
