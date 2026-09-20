"use strict";
let u2session = null;
function u2Attempts(id) {
  return progress.attempts.filter((a) => a.unit2 && (!id || a.skill === id));
}
function u2Header() {
  return `<section class="u2-banner"><div><p class="eyebrow">YOUR CURRENT UNIT · EXAM PREPARATION</p><h2>Unit 2: Equations & systems</h2><p>Learn the method. See several examples. Then try it yourself.</p></div><a class="button" href="#unit/equations">Open Unit 2 →</a></section>`;
}
function u2Tile(t) {
  const a = u2Attempts(t.id),
    n = a.filter((x) => x.correct && !x.assisted).length;
  return `<article class="card skill-card"><p class="eyebrow">${t.exam ? "EXAM FOCUS" : "MORE UNIT 2"}</p><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p><p class="muted">4 worked examples · ${U2_BANK[t.id].length - t.examples.length} practice questions</p>${a.length ? `<p class="skill-progress">${n}/${a.length} correct first tries without help</p>` : ""}<div class="controls"><a class="button" href="#u2lesson/${t.id}">Study examples</a><a class="button light" href="#u2practice/${t.id}">Practice</a></div></article>`;
}
function u2Overview() {
  main.innerHTML = `<a class="text-link" href="#course">← All units</a><section class="u2-heading"><p class="eyebrow">CURRENT UNIT</p><h1 class="page-title">Equations & systems</h1><p class="intro">Your study and practice center for Unit 2.</p><div class="controls"><a class="button" href="#u2lesson/one-step">Start with the basics</a><a class="button light" href="#u2practice/exam">Mixed exam practice</a><a class="button light" href="#u2check/exam">12-question self-check</a></div></section><div class="section-heading"><div><h2>Prepare for your upcoming exam</h2><p>These six topics match your class practice assignment. Work through them in order, or choose one to review.</p></div></div><div class="u2-grid">${U2_TOPICS.filter(
    (t) => t.exam,
  )
    .map(u2Tile)
    .join(
      "",
    )}</div><section class="card study-routine"><strong>A simple way to study</strong><p>Read the method → study two examples → solve 5 questions on paper → review any mistakes. Finish with a mixed self-check. Your teacher’s review sheet determines the final exam scope.</p></section><div class="section-heading"><div><h2>The rest of Unit 2</h2><p>Additional study and practice for the wider unit.</p></div></div><div class="u2-grid">${U2_TOPICS.filter(
    (t) => !t.exam,
  )
    .map(u2Tile)
    .join("")}</div>`;
}
function u2Steps(q) {
  return `<ol class="worked-steps">${q.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><div class="answer-box"><strong>Answer:</strong> ${q.kind === "expression" && q.target !== "expression" ? esc(q.target) + " = " : ""}${esc(q.answer)}</div>`;
}
function u2Lesson(id) {
  const t = U2_TOPICS.find((t) => t.id === id);
  if (!t) {
    u2Overview();
    return;
  }
  progress.u2Last = id;
  progress.lastLessonRoute = "#u2lesson/" + id;
  progress.lessonStarted = true;
  save();
  const next = U2_TOPICS[U2_TOPICS.indexOf(t) + 1];
  main.innerHTML = `<a class="text-link" href="#unit/equations">← Unit 2 study center</a><p class="eyebrow" style="margin-top:22px">${t.exam ? "EXAM FOCUS" : "UNIT 2"}</p><h1 class="page-title">${esc(t.title)}</h1><p class="intro">${esc(t.summary)}</p><div class="lesson-tabs"><a href="#" data-scroll="u2-understand">Understand</a><a href="#" data-scroll="u2-examples">4 worked examples</a><a href="#" data-scroll="u2-try">Try one</a><a href="#u2practice/${t.id}" class="button">Practice this skill</a></div><section class="card" id="u2-understand"><h2>Understand the idea</h2>${t.ideas.map((p) => `<p>${esc(p)}</p>`).join("")}<div class="method-box"><h3>Your method</h3><ol>${t.method.map((p) => `<li>${esc(p)}</li>`).join("")}</ol></div><p class="hint"><strong>Common mistake:</strong> ${esc(t.mistake)}</p></section>${t.id === "linear" ? u2Graph() : ""}<section id="u2-examples"><div class="section-heading"><div><h2>Four worked examples</h2><p>Every step is shown. Read why it works, then cover the steps and try it again.</p></div><button class="ghost" id="toggle-examples">Hide all solutions</button></div><div class="worked-grid">${t.examples
    .map((i, n) => {
      const q = U2_BANK[id][i];
      return `<article class="card worked-example"><p class="eyebrow">EXAMPLE ${n + 1}</p><h3>${esc(q.prompt)}</h3>${q.assumption ? `<p class="muted">Assume ${esc(q.assumption)}.</p>` : ""}<details open><summary>Step-by-step solution</summary>${u2Steps(q)}</details></article>`;
    })
    .join(
      "",
    )}</div></section><section class="card" id="u2-try"><h2>Now try one yourself</h2><p>Work on paper first. This is supported practice, so it won’t change your independent-practice score.</p><div id="guided-question"></div></section><section class="card study-routine"><h2>Ready for more?</h2><div class="controls"><a class="button" href="#u2practice/${t.id}">Practice ${esc(t.title.toLowerCase())}</a>${next ? `<a class="text-link" href="#u2lesson/${next.id}">Next: ${esc(next.title)} →</a>` : '<a class="text-link" href="#u2practice/exam">Mixed review →</a>'}</div><a class="text-link" href="#unit/equations">Back to all Unit 2 topics</a></section>`;
  document.querySelectorAll("[data-scroll]").forEach(
    (a) =>
      (a.onclick = (e) => {
        e.preventDefault();
        document
          .getElementById(a.dataset.scroll)
          .scrollIntoView({ behavior: "smooth", block: "start" });
      }),
  );
  document.getElementById("toggle-examples").onclick = (e) => {
    const open = e.target.textContent.startsWith("Show");
    document
      .querySelectorAll(".worked-example details")
      .forEach((d) => (d.open = open));
    e.target.textContent = open ? "Hide all solutions" : "Show all solutions";
  };
  const q = U2_BANK[id][6];
  u2QuestionUI(q, document.getElementById("guided-question"), null);
  if (id === "linear") u2WireGraph();
}
function u2Graph() {
  return `<section class="card study-routine"><h2>Explore a line</h2><p>Change the slope and intercept. The dot shows (0, b); the line follows y = mx + b.</p><div class="controls"><label>Slope m <input type="range" id="slope" min="-3" max="3" value="1"></label><label>Intercept b <input type="range" id="intercept" min="-3" max="3" value="1"></label></div><p id="graph-label" role="status"></p><svg id="line-explorer" viewBox="0 0 320 240" aria-label="Coordinate graph" role="img"></svg></section>`;
}
function u2WireGraph() {
  const draw = () => {
    const m = +document.getElementById("slope").value,
      b = +document.getElementById("intercept").value;
    document.getElementById("graph-label").textContent =
      `y = ${m}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}. Slope ${m}; y-intercept (0, ${b}).`;
    document.getElementById("line-explorer").innerHTML =
      `<defs><clipPath id="plot-clip"><rect width="320" height="240"/></clipPath></defs>${Array.from({ length: 15 }, (_, i) => `<path d="M${20 + i * 20} 0V240" stroke="#e2e9e2"/>`).join("")}${Array.from({ length: 11 }, (_, i) => `<path d="M0 ${20 + i * 20}H320" stroke="#e2e9e2"/>`).join("")}<path d="M0 120H320M160 0V240" stroke="#5c7379"/><text x="302" y="113">x</text><text x="168" y="14">y</text><text x="165" y="135">0</text><text x="254" y="135">5</text><text x="45" y="135">−5</text><text x="167" y="24">5</text><text x="165" y="224">−5</text><g clip-path="url(#plot-clip)"><path d="M0 ${120 - 20 * (m * -8 + b)}L320 ${120 - 20 * (m * 8 + b)}" stroke="#24696b" stroke-width="3"/><circle cx="160" cy="${120 - 20 * b}" r="5" fill="#bc7d3d"/></g>`;
  };
  document.getElementById("slope").oninput = draw;
  document.getElementById("intercept").oninput = draw;
  draw();
}
function shuffle(a) {
  const copy = [...a];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function u2Practice(id = "exam", check = false) {
  const t = U2_TOPICS.find((t) => t.id === id);
  if (!t && id !== "exam" && id !== "all") {
    u2Overview();
    return;
  }
  u2session = null;
  main.innerHTML = `<a class="text-link" href="#unit/equations">← Unit 2 study center</a><h1 class="page-title">${check ? "Exam self-check" : t ? esc(t.title) + " practice" : id === "all" ? "Whole-unit mixed practice" : "Mixed exam practice"}</h1><p class="intro">${check ? "12 questions across all six exam-focus skills. Work independently; answers and explanations appear after you finish." : "Work on paper, enter your answer, then check. Hints and full solutions are always available."}</p><section class="card"><div class="controls">${check ? "" : `<label>Session length <select id="u2-count"><option value="5">5 questions</option><option value="10" selected>10 questions</option><option value="20">20 questions</option></select></label>`}<button class="primary" id="u2-start">${check ? "Start self-check" : "Start practice"}</button>${t ? `<a class="text-link" href="#u2lesson/${id}">Study examples first</a>` : ""}</div><p class="muted">${t ? "Questions are drawn from this skill’s bank." : check ? "Two questions per exam-focus topic. This is a practice check, not your school exam." : "Sessions include all six exam-focus topics (choose 10 or 20 questions); 5 questions rotate across five topics."}</p></section><div id="u2-session"></div>`;
  document.getElementById("u2-start").onclick = () => {
    const count = check
      ? 12
      : Number(document.getElementById("u2-count").value);
    let questions;
    if (t) {
      questions = shuffle(
        U2_BANK[id].filter((q, i) => !t.examples.includes(i)),
      ).slice(0, count);
    } else {
      const groups = shuffle(
        U2_TOPICS.filter((t) => id === "all" || t.exam),
      ).map((t) =>
        shuffle(U2_BANK[t.id].filter((q, i) => !t.examples.includes(i))),
      );
      questions = Array.from(
        { length: count },
        (_, i) => groups[i % groups.length][Math.floor(i / groups.length)],
      );
    }
    u2session = { questions, index: 0, results: [], check };
    document.getElementById("u2-start").disabled = true;
    u2ShowQuestion();
  };
}
function u2QuestionUI(q, container, onNext, check = false) {
  let first = true,
    assisted = false,
    done = false,
    result = null;
  container.innerHTML = `<h3>${esc(q.prompt)}</h3>${q.assumption ? `<p class="muted">Assume ${esc(q.assumption)}.</p>` : ""}<form class="u2-answer-form"><label>${q.kind === "pair" ? "Your ordered pair (x, y)" : q.kind === "inequality" ? "Your inequality (for example, x <= 3)" : q.kind === "choice" ? "Choose your answer" : q.unit ? "Your answer" : `Your answer: ${esc(q.target)} =`}${q.kind === "choice" ? `<select class="answer-input" required><option value="">Choose…</option>${q.choices.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("")}</select>` : '<input class="answer-input" autocomplete="off" spellcheck="false" required>'}</label>${q.kind === "expression" ? '<p class="input-help">Use / for fractions. Write multiplication as 2x or 2*x. Letters are case-sensitive.</p>' : ""}<button class="primary" type="submit">${check ? "Save answer" : "Check answer"}</button></form><div class="feedback" role="status" aria-live="polite"></div><div class="controls">${check ? "" : '<button class="ghost" data-help="hint">Hint</button><button class="ghost" data-help="solution">Show solution</button>'}${onNext ? '<button class="ghost" data-next>Skip for now →</button>' : ""}</div><div class="u2-help"></div>`;
  const input = container.querySelector(".answer-input"),
    feedback = container.querySelector(".feedback");
  const record = (ok) => {
    result = {
      id: q.id,
      topic: q.unit || "equations",
      unit2: !q.unit,
      ...(q.unit ? {courseUnit:q.unit} : {}),
      skill: q.topic,
      correct: ok,
      assisted,
      date: new Date().toISOString(),
      question: { ...q, solution: q.steps.join(" ") },
    };
    if (onNext) {
      progress.attempts.push(result);
      save();
    }
    first = false;
  };
  container.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    if (done) return;
    const judged = q.unit && q.topic === "distribute" && q.kind === "expression" && /[()]/.test(input.value)
      ? {ok:false, message:"Expand the expression: multiply through and write your answer without parentheses."}
      : U2Math.check(input.value, q);
    if (judged.message) {
      feedback.className = "feedback error";
      feedback.textContent = judged.message;
      return;
    }
    if (first) record(judged.ok);
    feedback.className = "feedback" + (judged.ok || check ? "" : " error");
    feedback.textContent = check
      ? "Answer saved. Continue to the next question."
      : judged.ok
        ? "Correct. Your answer is equivalent to the expected result."
        : "Not quite. Recheck the question and your steps. Use a hint or study the worked solution, then try again.";
    if (judged.ok || check) {
      done = true;
      container.querySelector("form button").disabled = true;
      input.disabled = true;
      if (onNext)
        container.querySelector("[data-next]").textContent = "Next question →";
    }
  };
  container.querySelectorAll("[data-help]").forEach(
    (btn) =>
      (btn.onclick = () => {
        assisted = true;
        container.querySelector(".u2-help").innerHTML =
          btn.dataset.help === "hint"
            ? `<p class="hint">${esc(q.hint)}</p>`
            : u2Steps(q);
      }),
  );
  if (onNext)
    container.querySelector("[data-next]").onclick = () => {
      if (first) record(false);
      onNext(result);
    };
}
function u2ShowQuestion() {
  const el = document.getElementById("u2-session");
  if (u2session.index === u2session.questions.length) {
    u2Summary(el);
    return;
  }
  const q = u2session.questions[u2session.index];
  el.innerHTML = `<section class="card question-card"><p class="eyebrow">QUESTION ${u2session.index + 1} OF ${u2session.questions.length} · ${esc(q.title)}</p><div id="u2-question"></div></section>`;
  u2QuestionUI(
    q,
    document.getElementById("u2-question"),
    (r) => {
      u2session.results.push(r);
      u2session.index++;
      u2ShowQuestion();
    },
    u2session.check,
  );
  el.scrollIntoView({ block: "start", behavior: "smooth" });
}
function u2Summary(el) {
  const r = u2session.results,
    ok = r.filter((a) => a.correct && !a.assisted).length;
  el.innerHTML = `<section class="card question-card"><p class="eyebrow">SESSION COMPLETE</p><h2>${ok} of ${r.length} independent correct answers</h2><p>This shows what happened in this session, not a guarantee of exam readiness. Revisit any skill that needed help.</p>${[
    ...new Set(r.map((a) => a.skill)),
  ]
    .map((id) => {
      const t = U2_TOPICS.find((t) => t.id === id),
        a = r.filter((a) => a.skill === id);
      return `<p><strong>${esc(t.title)}:</strong> ${a.filter((a) => a.correct && !a.assisted).length}/${a.length} <a class="text-link" href="#u2lesson/${id}">Review examples →</a></p>`;
    })
    .join(
      "",
    )}<div class="controls"><a class="button" href="#unit/equations">Back to Unit 2</a><a class="button light" href="#review">Review mistakes</a></div><h3>Answers and explanations</h3>${r.map((a, i) => `<details><summary>${i + 1}. ${esc(a.question.prompt)} — ${a.correct && !a.assisted ? "Correct independently" : "Review"}</summary>${u2Steps(a.question)}</details>`).join("")}</section>`;
}
