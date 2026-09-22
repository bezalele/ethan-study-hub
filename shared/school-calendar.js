/* ---------------------------------------------------------------------------
   school-calendar.js — the days Ethan is NOT at school.

   The journal calendar marks the school days he has not written up yet, so
   it has to know which days those are. Its default rule is the safe one:
   Monday to Friday is school, Saturday and Sunday is not. Everything else —
   holidays, closures, professional days, early releases — has to be told to
   it, because the rule cannot be guessed. A day put in here by mistake hides
   a day he really did miss; a day left out of here puts a missed day against
   a day he was never in school for.

   So: only add dates that come off the district's published academic
   calendar. Nothing inferred, nothing remembered, nothing from a sports
   fixture list.

   Format is one line per day, newest first or oldest first, it does not
   matter. The text shows on the day when it is picked, so write it the way
   you would say it:

     '2026-11-26': 'Thanksgiving',
     '2027-01-18': 'Teacher professional day',

   One file for all three subjects, so a holiday entered once is a holiday
   everywhere.

   Loaded after learning-log.js, before the apps mount anything.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  var NO_SCHOOL = {
    // Empty until the MCPS 2026–27 academic calendar is to hand. Until then
    // the calendar treats every weekday as a school day, which is right far
    // more often than it is wrong, and wrong only on the handful of days
    // below that have yet to be filled in.
  };

  if (global.LearningLog && global.LearningLog.setNoSchool) {
    global.LearningLog.setNoSchool(NO_SCHOOL);
  }

  global.SCHOOL_NO_SCHOOL = NO_SCHOOL;
}(window));
