"use strict";
/* Progress on the course pages: what counts as finished, and how it is drawn.

   A lesson is done when he has pressed "Mark as studied" on it AND every
   question in its practice bank has a real answer — right or wrong, from
   skill practice, mixed practice or a self-check. A skip is not an answer.
   A unit is done when all its lessons are done AND its self-check has been
   finished once.

   Everything here reads the store. The only writes are the explored list
   (the button) and the tags on new attempts (`skipped`, `check`,
   `checkRun`), all made where the app already saves. Units 3–7 have no
   lessons yet, so they have no tracker. */

/* The units that have lessons, and where their pages live. */
const TRACKED = [
  { id: "foundations", lessons: () => COURSE_LESSONS.filter((t) => t.unit === "foundations"), study: (id) => "#study/" + id, practice: (id) => "#skillpractice/" + id, check: "#unitcheck/foundations", checkSize: () => COURSE_LESSONS.filter((t) => t.unit === "foundations").length * 2 },
  { id: "statistics", lessons: () => COURSE_LESSONS.filter((t) => t.unit === "statistics"), study: (id) => "#study/" + id, practice: (id) => "#skillpractice/" + id, check: "#unitcheck/statistics", checkSize: () => COURSE_LESSONS.filter((t) => t.unit === "statistics").length * 2 },
  { id: "equations", lessons: () => U2_TOPICS, study: (id) => "#u2lesson/" + id, practice: (id) => "#u2practice/" + id, check: "#u2check/exam", checkSize: () => 12 },
];
const trackedUnit = (id) => TRACKED.find((u) => u.id === id);

/* The questions a lesson's practice can serve — exactly the bank the card
   counts, so "20 practice questions" and "20 of 20" are the same twenty. */
function lessonBank(t) {
  if (COURSE_BANK[t.id]) return COURSE_BANK[t.id].slice(4).map((q) => q.id);
  return U2_BANK[t.id].filter((q, i) => !t.examples.includes(i)).map((q) => q.id);
}
const hasAnyWork = (t) => {
  const b = new Set(lessonBank(t));
  return progress.attempts.some((a) => b.has(a.id));
};
const exploredList = () => (Array.isArray(progress.explored) ? progress.explored : []);
const answeredIds = () => new Set(progress.attempts.filter((a) => !a.skipped).map((a) => a.id));

/* A self-check counts once every one of its questions was answered in one
   sitting — an abandoned check is not a finished one. Each run carries its
   own id. Checks taken before the tags existed cannot be told apart from
   practice, so they do not count. */
function checksTaken() {
  const runs = {};
  progress.attempts.forEach((a) => {
    if (!a.check || !a.checkRun) return;
    const k = a.check + "|" + a.checkRun;
    runs[k] = (runs[k] || 0) + 1;
  });
  const done = new Set();
  Object.entries(runs).forEach(([k, n]) => {
    const [unit] = k.split("|"), u = trackedUnit(unit);
    if (u && n >= u.checkSize()) done.add(unit);
  });
  return done;
}

function lessonProgress(t, ans = answeredIds()) {
  const bank = lessonBank(t),
    explored = exploredList().includes(t.id),
    answered = bank.filter((id) => ans.has(id)).length,
    total = bank.length;
  return { explored, answered, total, steps: +explored + answered, of: total + 1, done: explored && answered === total };
}
function unitProgress(u, ans = answeredIds(), checks = checksTaken()) {
  const ls = u.lessons().map((t) => ({ t, p: lessonProgress(t, ans) })),
    check = checks.has(u.id),
    /* Each lesson weighs the same in the unit bar however big its bank is,
       and the self-check weighs as much as one lesson. */
    share = ls.reduce((n, x) => n + x.p.steps / x.p.of, 0) + check,
    pct = Math.round((share / (ls.length + 1)) * 100);
  return { u, ls, lessons: ls.length, doneLessons: ls.filter((x) => x.p.done).length, check, pct, started: share > 0, done: check && ls.every((x) => x.p.done) };
}
const pctOf = (p) => Math.round((p.steps / p.of) * 100);

function trackBar(pct, label) {
  return `<div class="track" role="img" aria-label="${esc(label)}"><span style="width:${pct}%"></span></div>`;
}
function unitStatusLine(p) {
  if (p.done) return "Unit complete";
  if (!p.started) return `${p.lessons} lessons · not started`;
  /* Two phrases that wrap as wholes, so a narrow card never splits "to do". */
  return `<span class="nw">${p.doneLessons} of ${p.lessons} lessons done ·</span> <span class="nw">${p.check ? "self-check ✓" : "self-check to do"}</span>`;
}

/* On a course-page unit card. */
function unitCardTracker(id) {
  const u = trackedUnit(id);
  if (!u) return `<p class="ut-label ut-soon">Lessons coming soon</p>`;
  const p = unitProgress(u);
  return `${trackBar(p.pct, p.pct + "% of this unit done")}<p class="ut-label"><span>${unitStatusLine(p)}</span><strong>${p.pct}%</strong></p>`;
}

/* Under the course title: the units that have lessons, rolled together. */
function courseSummary() {
  const ans = answeredIds(), checks = checksTaken(),
    ps = TRACKED.map((u) => unitProgress(u, ans, checks)),
    lessons = ps.reduce((n, p) => n + p.lessons, 0),
    pct = Math.round(ps.reduce((n, p) => n + p.pct * (p.lessons + 1), 0) / ps.reduce((n, p) => n + p.lessons + 1, 0));
  return `<div class="course-track">${trackBar(pct, pct + "% of the lessons so far done")}<p><strong>${pct}%</strong> of the lessons so far · ${ps.reduce((n, p) => n + p.doneLessons, 0)} of ${lessons} lessons done · ${ps.filter((p) => p.done).length} of ${ps.length} units complete</p></div>`;
}

/* The single next thing to do in a unit: finish the lesson you are on before
   opening a new one, and leave the self-check until every lesson is done. */
function unitNext(u, p) {
  const open = p.ls.find((x) => !x.p.done);
  if (open) {
    const { t, p: lp } = open, left = lp.total - lp.answered;
    if (!lp.explored) return { text: `Study ${t.title}.`, href: u.study(t.id), label: "Open lesson" };
    return { text: `Answer the ${left} question${left === 1 ? "" : "s"} you haven’t tried yet in ${t.title}.`, href: u.practice(t.id), label: "Practice it" };
  }
  if (!p.check) return { text: "Every lesson is done. One self-check finishes the unit.", href: u.check, label: "Take the self-check" };
  return null;
}
function unitSummary(id) {
  const u = trackedUnit(id);
  if (!u) return "";
  const p = unitProgress(u), next = unitNext(u, p);
  return `<section class="card unit-track${p.done ? " is-done" : ""}"><div class="ut-head"><h2>${p.done ? "✓ Unit complete" : "Your progress"}</h2><strong>${p.pct}%</strong></div>${trackBar(p.pct, p.pct + "% of this unit done")}<p class="ut-facts"><span>${p.doneLessons} of ${p.lessons} lessons done</span><span>${p.check ? "✓ Self-check finished" : "Self-check not finished yet"}</span>${p.started ? `<a class="work-link" href="#work/${u.id}">See all work in this unit →</a>` : ""}</p>${next ? `<p class="ut-next">Next: ${esc(next.text)} <a href="${next.href}">${next.label} →</a></p>` : `<p class="ut-next">Every lesson studied, every question answered, and the self-check finished.</p>`}</section>`;
}

/* On a lesson card inside a unit page. */
function lessonCardTracker(t) {
  const p = lessonProgress(t), pct = pctOf(p);
  const tag = p.done ? '<span class="lt-tag lt-done">✓ Done</span>' : p.steps ? '<span class="lt-tag lt-going">In progress</span>' : "";
  return `<div class="lesson-track${p.done ? " is-done" : ""}">${tag}${trackBar(pct, p.done ? "Lesson done" : `${p.explored ? "Studied" : "Not studied yet"}, ${p.answered} of ${p.total} questions answered`)}<p class="lt-label"><span class="${p.explored ? "ok" : ""}">${p.explored ? "✓ Studied" : "Not studied"}</span> · ${p.answered} of ${p.total} questions${hasAnyWork(t) ? ` · <a class="work-link" href="#work/${t.id}">See work</a>` : ""}</p></div>`;
}

/* At the foot of a lesson page: what is left, and the button. */
function lessonStatusText(t) {
  const p = lessonProgress(t), left = p.total - p.answered;
  if (p.done) return `<strong>✓ Lesson done.</strong> Studied, and all ${p.total} practice questions answered.`;
  return `<strong>To finish this lesson:</strong> ${p.explored ? "✓ studied" : "mark it studied"} · ${left ? `answer ${left} more practice question${left === 1 ? "" : "s"} (${p.answered} of ${p.total} so far — any practice or self-check counts)` : `✓ all ${p.total} questions answered`}.`;
}
function lessonTrackSection(t) {
  const studied = exploredList().includes(t.id);
  return `<section class="card lesson-finish"><p id="lesson-status">${lessonStatusText(t)}</p>${hasAnyWork(t) ? `<a class="work-link" href="#work/${t.id}">See work so far</a>` : ""}<button class="${studied ? "ghost" : "primary"}" id="mark-studied"${studied ? " disabled" : ""}>${studied ? "✓ Lesson studied" : "Mark as studied"}</button></section>`;
}
function wireLessonTrack(t) {
  const b = document.getElementById("mark-studied");
  if (!b) return;
  b.onclick = () => {
    if (!Array.isArray(progress.explored)) progress.explored = [];
    if (!progress.explored.includes(t.id)) progress.explored.push(t.id);
    save();
    b.textContent = "✓ Lesson studied";
    b.disabled = true;
    b.className = "ghost";
    document.getElementById("lesson-status").innerHTML = lessonStatusText(t);
  };
}

/* The self-check in progress, so its answers can carry the unit and the run. */
let checkRun = null;
function beginCheckRun(unit) {
  checkRun = { unit, run: new Date().toISOString() };
}
function endCheckRun() {
  checkRun = null;
}

/* On the Progress page. */
function courseProgressRows() {
  const ans = answeredIds(), checks = checksTaken();
  return TRACKED.map((u) => {
    const p = unitProgress(u, ans, checks), name = units.find((x) => x.id === u.id);
    return `<div class="card" style="margin-bottom:10px"><strong><a href="#unit/${u.id}">${name ? esc(name.n + " · " + name.title) : u.id}</a></strong><p class="muted">${unitStatusLine(p)} · ${p.pct}%${p.started ? ` · <a class="work-link" href="#work/${u.id}">See work →</a>` : ""}</p>${trackBar(p.pct, p.pct + "% of this unit done")}</div>`;
  }).join("");
}

/* Work so far: every answer saved for a lesson, with the right answer and
   its worked solution beside it. For him and for a parent reading along.
   Reads the store only. Only his first try at each question is saved (it
   is the one his score counts), and what he typed is saved from 2026-10-02
   on - older answers show their result without the text. */
const fmtDay = (d) => new Date(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const findLesson = (id) => COURSE_LESSONS.find((t) => t.id === id) || U2_TOPICS.find((t) => t.id === id);
const lessonUnit = (t) => (COURSE_BANK[t.id] ? t.unit : "equations");
const unitTitle = (id) => {
  const u = units.find((x) => x.id === id);
  return u ? u.n + " · " + u.title : id;
};
function bankQuestion(lessonId, qid) {
  const bank = COURSE_BANK[lessonId] || U2_BANK[lessonId] || [];
  return bank.find((q) => q.id === qid);
}
function workChips(a) {
  const c = [a.skipped ? ["skip", "Skipped"] : a.correct ? (a.assisted ? ["hint", "Right, after help"] : ["ok", "Right"]) : ["no", a.assisted ? "Wrong, after help" : "Wrong"]];
  if (a.check) c.push(["chk", "Self-check"]);
  return c.map(([k, t]) => `<span class="wk-chip wk-${k}">${t}</span>`).join("");
}
function workTally(as) {
  const r = as.filter((a) => a.correct && !a.assisted).length,
    h = as.filter((a) => a.correct && a.assisted).length,
    w = as.filter((a) => !a.correct && !a.skipped).length,
    k = as.filter((a) => a.skipped).length;
  return as.length
    ? `<span class="wk-chip wk-ok">${r} right</span>${h ? `<span class="wk-chip wk-hint">${h} after help</span>` : ""}${w ? `<span class="wk-chip wk-no">${w} wrong</span>` : ""}${k ? `<span class="wk-chip wk-skip">${k} skipped</span>` : ""}`
    : '<span class="muted">No answers yet</span>';
}
/* Every answer he submits - the study page's "try one yourself", every try
   in practice including the re-tries after a wrong answer, and self-checks -
   goes in its own log so it can be read back. The log is separate from
   `attempts` on purpose: attempts hold the first try only and drive his
   score and progress, and a re-try must not change either. Entries are
   written once and never edited, which is what lets the sync union them. */
function logAnswer(q, typed, ok, assisted, where) {
  if (!Array.isArray(progress.answerLog)) progress.answerLog = [];
  progress.answerLog.push({
    id: q.id,
    lesson: q.topic,
    where,
    response: String(typed).trim().slice(0, 200),
    correct: !!ok,
    assisted: !!assisted,
    date: new Date().toISOString(),
  });
  save();
}
const WHERE = { study: "Study page", practice: "Practice", check: "Self-check" };
const fmtTime = (d) => new Date(d).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
function tryRow(e) {
  const result = e.skipped ? ["skip", "Skipped"] : e.correct ? (e.assisted ? ["hint", "Right, after help"] : ["ok", "Right"]) : ["no", e.assisted ? "Wrong, after help" : "Wrong"];
  const where = e.where ? WHERE[e.where] : e.check ? "Self-check" : "Practice";
  const typed = e.skipped ? "" : `<span class="wk-ans">Answered: <strong>${e.response != null && e.response !== "" ? esc(e.response) : '<span class="muted">not saved (before 2 Oct)</span>'}</strong></span>`;
  return `<li><span class="wk-date">${fmtDay(e.date)} · ${fmtTime(e.date)}</span><span class="wk-chip wk-where">${where}</span><span class="wk-chip wk-${result[0]}">${result[1]}</span>${typed}</li>`;
}
function lessonWork(t) {
  const u = trackedUnit(lessonUnit(t)),
    p = lessonProgress(t),
    all = new Set((COURSE_BANK[t.id] || U2_BANK[t.id] || []).map((q) => q.id));
  /* Newer answers are in the log. Older ones, and skips, exist only as
     first-try attempts; an attempt with a `response` is already in the log. */
  const log = (Array.isArray(progress.answerLog) ? progress.answerLog : []).filter((e) => all.has(e.id));
  const old = progress.attempts.filter((a) => all.has(a.id) && (a.skipped || a.response == null));
  const byQ = {};
  log.concat(old).forEach((e) => (byQ[e.id] = byQ[e.id] || []).push(e));
  const qs = Object.entries(byQ)
    .map(([id, es]) => [id, es.sort((x, y) => (x.date < y.date ? -1 : 1))])
    .sort((x, y) => (x[1][x[1].length - 1].date < y[1][y[1].length - 1].date ? 1 : -1));
  const firstTries = progress.attempts.filter((a) => all.has(a.id));
  const rows = qs
    .map(([id, es]) => {
      const q = bankQuestion(t.id, id) || (progress.attempts.find((a) => a.id === id) || {}).question || {};
      return `<article class="card wk-q"><h3>${esc(q.prompt || "Question")}</h3>${q.assumption ? `<p class="muted">Assume ${esc(q.assumption)}.</p>` : ""}<ul class="wk-tries">${es.map(tryRow).join("")}</ul>${q.steps ? `<details><summary>Correct answer and solution</summary>${u2Steps(q)}</details>` : ""}</article>`;
    })
    .join("");
  const left = p.total - p.answered;
  return `<a class="text-link" href="#unit/${lessonUnit(t)}">← ${esc(unitTitle(lessonUnit(t)))}</a><p class="eyebrow" style="margin-top:22px">WORK SO FAR</p><h1 class="page-title">${esc(t.title)}</h1><p class="intro">${p.done ? "✓ Lesson done · " : ""}${p.explored ? "Studied" : "Not studied yet"} · ${p.answered} of ${p.total} practice questions answered</p><div class="wk-tally wk-sum"><span class="muted">First tries:</span>${workTally(firstTries)}</div><p class="muted wk-legend">Newest first. Every try is listed, including the “Now try one yourself” question on the study page and re-tries after a wrong answer. Only the first try at a practice question counts toward the score.</p>${rows || '<div class="card empty">No answers saved for this lesson yet.</div>'}${left && qs.length ? `<p class="muted">${left} practice question${left === 1 ? "" : "s"} in this lesson ${left === 1 ? "has" : "have"} not been answered yet.</p>` : ""}<div class="controls"><a class="button light" href="${u.study(t.id)}">Open the lesson</a><a class="button" href="${u.practice(t.id)}">Practice this skill</a></div>`;
}
function unitWork(u) {
  const ans = answeredIds(),
    ls = u.lessons();
  const rows = ls
    .map((t) => {
      const p = lessonProgress(t, ans),
        bank = new Set(lessonBank(t)),
        as = progress.attempts.filter((a) => bank.has(a.id));
      return `<a class="card wk-row" href="#work/${t.id}"><span><strong>${esc(t.title)}</strong><span class="muted">${p.done ? "✓ Done" : p.explored ? "Studied" : "Not studied"} · ${p.answered} of ${p.total} answered</span></span><span class="wk-tally">${workTally(as)}</span><span class="wk-go">See work →</span></a>`;
    })
    .join("");
  const runs = {};
  progress.attempts.filter((a) => a.check === u.id && a.checkRun).forEach((a) => (runs[a.checkRun] = runs[a.checkRun] || []).push(a));
  const sits = Object.entries(runs)
    .sort((x, y) => (x[0] < y[0] ? 1 : -1))
    .map(([run, g]) => `<div class="card wk-row"><span><strong>${fmtDay(run)}</strong><span class="muted">${g.length} of ${u.checkSize()} questions${g.length < u.checkSize() ? " · not finished" : ""}</span></span><span class="wk-tally"><span class="wk-chip wk-ok">${g.filter((a) => a.correct && !a.assisted).length} of ${g.length} right</span></span></div>`)
    .join("");
  return `<a class="text-link" href="#unit/${u.id}">← ${esc(unitTitle(u.id))}</a><p class="eyebrow" style="margin-top:22px">WORK SO FAR</p><h1 class="page-title">${esc(unitTitle(u.id))}</h1><p class="intro">Every lesson in this unit, and every sitting of its self-check.</p><div class="wk-rows">${rows}</div><h2 class="wk-h">Self-check</h2>${sits || '<p class="muted">No self-check recorded yet. Self-checks taken before 2 Oct were not marked as checks, so their answers appear only inside each lesson.</p>'}`;
}
function workView(id) {
  const t = findLesson(id),
    u = trackedUnit(id);
  if (t) main.innerHTML = lessonWork(t);
  else if (u) main.innerHTML = unitWork(u);
  else course();
}
