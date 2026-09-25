"use strict";
const KEY = "ethan_math_quest_v2";
const fresh = () => ({
  version: 2,
  attempts: [],
  lessonStarted: false,
  lessonComplete: false,
});
function valid(p) {
  return (
    p &&
    p.version === 2 &&
    Array.isArray(p.attempts) &&
    p.attempts.every(
      (a) =>
        a &&
        typeof a.id === "string" &&
        typeof a.correct === "boolean" &&
        typeof a.assisted === "boolean" &&
        typeof a.date === "string",
    )
  );
}
let progress;
try {
  const p = JSON.parse(localStorage.getItem(KEY));
  progress = valid(p) ? p : fresh();
} catch {
  progress = fresh();
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    document.getElementById("save-warning")?.remove();
    document
      .querySelector("footer")
      .insertAdjacentHTML(
        "beforeend",
        '<span id="save-warning" role="status">Storage unavailable. Export progress before leaving.</span>',
      );
  }
}
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const units = [
  {
    id: "foundations",
    n: "Start here",
    title: "Foundations",
    desc: "Build your algebra toolkit.",
    icon: "✧",
    tint: "#e3eef0",
    skills: [
      "Negative numbers",
      "Fractions and decimals",
      "Order of operations",
      "Distributive property",
      "Combining like terms",
    ],
    topic: null,
  },
  {
    id: "statistics",
    n: "Unit 1",
    title: "One-variable statistics",
    desc: "Make sense of data.",
    icon: "▥",
    tint: "#f5e8cf",
    skills: [
      "Data displays",
      "Mean and median",
      "Spread and outliers",
      "Comparing distributions",
    ],
    topic: "statistics",
  },
  {
    id: "equations",
    n: "Unit 2",
    title: "Equations & systems",
    desc: "Solve and reason with equations.",
    icon: "=",
    tint: "#d6ece7",
    skills: [
      "Writing equations",
      "One- and two-step equations",
      "Equations with variables on both sides",
      "Rearranging formulas: solve for y",
      "Single-step literal equations",
      "Multistep literal equations",
      "Distribution",
      "Three-step equations",
      "Slope and graphing lines",
      "Systems of equations",
      "Linear inequalities",
    ],
    topic: "equations",
  },
  {
    id: "two-variable",
    n: "Unit 3",
    title: "Two-variable statistics",
    desc: "Find patterns and make predictions.",
    icon: "↗",
    tint: "#f8dfcb",
    skills: [
      "Two-way tables",
      "Scatter plots",
      "Lines of best fit",
      "Residuals",
      "Correlation and causation",
    ],
    topic: null,
  },
  {
    id: "functions",
    n: "Unit 4",
    title: "Functions",
    desc: "Explore relationships.",
    icon: "ƒ",
    tint: "#d8ebe5",
    skills: [
      "Function notation",
      "Tables and graphs",
      "Domain and range",
      "Piecewise functions",
      "Inverse relationships",
    ],
    topic: "functions",
  },
  {
    id: "exponents",
    n: "Unit 5",
    title: "Exponential functions",
    desc: "Model change.",
    icon: "aⁿ",
    tint: "#dceef4",
    skills: [
      "Exponent rules",
      "Growth and decay",
      "Percent change",
      "Linear versus exponential models",
    ],
    topic: "exponents",
  },
  {
    id: "quadratics",
    n: "Unit 6",
    title: "Quadratic functions",
    desc: "Discover parabolas.",
    icon: "∪",
    tint: "#ebdfe9",
    skills: [
      "Quadratic patterns",
      "Multiplying expressions",
      "Factoring",
      "Vertices and intercepts",
    ],
    topic: "quadratics",
  },
  {
    id: "quadratic-equations",
    n: "Unit 7",
    title: "Quadratic equations",
    desc: "Solve and apply.",
    icon: "x²",
    tint: "#f8e5bd",
    skills: [
      "Solving by factoring",
      "Square roots",
      "Completing the square",
      "Quadratic formula",
      "Applications",
    ],
    topic: "quadratics",
  },
  {
    id: "review",
    n: "Review",
    title: "Course review",
    desc: "Bring it all together.",
    icon: "✓",
    tint: "#e0e7d2",
    skills: ["Mixed practice", "Review mistakes", "Check your understanding"],
    topic: null,
  },
];
const paths = {
  journal: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 3v18M12 8h4M12 12h4",
  home: "M3 10 12 3l9 7v11h-6v-7H9v7H3z",
  course:
    "M12 5v16M12 5C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-4-1-7-1-10 1z",
  practice: "m4 17-1 4 4-1L21 6l-3-3zM15 6l3 3",
  review: "M3 4v6h6M3 10a9 9 0 1 1 0 5",
  progress: "M4 21V12h3v9M11 21V7h3v14M18 21V2h3v19",
  parent:
    "M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M1 22v-5a7 7 0 0 1 14 0v5M17 4a4 4 0 0 1 0 8M18 15a5 5 0 0 1 5 5v2",
};
const icon = (id) =>
  `<span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[id]}"/></svg></span>`;
const nav = [
  ["home", "Home"],
  ["course", "Course"],
  ["practice", "Practice"],
  ["review", "Review mistakes"],
  ["progress", "Progress"],
  ["parent", "Parent guide"],
];
const main = document.getElementById("main");
let session = null;
function unitIcon(id) {
  const drawings = {
    foundations: "M12 2v20M2 12h20M12 7l5 5-5 5-5-5z",
    statistics: "M4 21V13h3v8M10 21V8h3v13M16 21V3h3v18",
    equations: "M5 9h14M5 15h14",
    "two-variable": "m2 19 6-9 6 4 8-11",
    functions: "M5 2v20M2 18h20M5 18c8 0 11-5 14-14",
    exponents: "M2 21h20M3 19c11 0 15-5 17-17",
    quadratics: "M3 3c3 21 15 21 18 0",
    "quadratic-equations": "m5 9 10 12M15 9 5 21M16 3c5-4 8 2 3 4l-3 2h6",
    review: "m4 12 5 5 11-12",
  };
  return `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${drawings[id]}"/></svg>`;
}
function unitCards(list = units) {
  return `<div class="course-grid">${list.map((u) => `<a class="unit ${u.id === "equations" ? "current" : ""}" href="#unit/${u.id}"><span class="round" style="--tint:${u.tint}">${unitIcon(u.id)}</span><div><small>${u.n}</small><h3>${u.title}</h3>${u.id === "equations" ? '<span class="badge">Current unit · Exam prep</span>' : ""}<p>${u.desc}</p></div><span class="chevron">›</span></a>`).join("")}</div>`;
}
function home() {
  main.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">ONE STEP AT A TIME</p><h1>Make sense of math.</h1><p>Understand the ideas. Practice with purpose. Build confidence.</p><a class="button" href="${esc(progress.lastLessonRoute || "#u2lesson/" + (progress.u2Last || "one-step"))}">${progress.lessonStarted ? "Continue learning" : "Start learning"} <span>→</span></a><a class="text-link" href="#course">Explore the course</a></div></section><div class="resume-row"><section class="card"><p class="eyebrow">${progress.lessonStarted ? "PICK UP WHERE YOU LEFT OFF" : "YOUR FIRST STEP"}</p><div class="resume-body"><span class="round">x =</span><div><h2>Get ready for your Unit 2 exam</h2><p class="muted">Six skills · Worked examples & practice</p><p class="muted">Pick up your latest skill, or start with the basics.</p><a class="button" href="#u2lesson/${progress.u2Last || "one-step"}">${progress.lessonStarted ? "Resume lesson" : "Open lesson"} <span>→</span></a></div></div></section><section class="card practice-card"><span class="round">${icon("practice")}</span><div><h2>A little practice, every day</h2><p>10 questions · About 15 minutes</p><a class="button light" href="#practice">Start practice</a></div></section></div><div class="section-heading"><div><h2>Your Algebra 1 course</h2><p>A clear path from foundations to quadratics.</p></div><a class="text-link" href="#course">View course →</a></div>${unitCards()}`;
}
function course(query = "") {
  const list = units.filter((u) =>
    (u.title + " " + u.skills.join(" ") + " " + courseGroup(u.id).map(t => t.title + " " + t.summary).join(" "))
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  main.innerHTML = `<h1 class="page-title">${query ? "Find your next step" : "Your Algebra 1 course"}</h1><p class="intro">Explore the whole course. Choose the topic you’re learning at school, or revisit an earlier idea.</p>${query ? `<p>Results for “${esc(query)}”</p>` : ""}${list.length ? unitCards(list) : '<div class="card empty">No matches yet. Try “equations”, “graphs”, or “factoring”.</div>'}<div class="notice">Foundations, Unit 1, and Unit 2 now have worked examples, practice by skill, and self-checks. Units 3–7 and cumulative review are the next course expansion.</div><p class="muted">Course structure follows <a class="text-link" href="https://www.montgomeryschoolsmd.org/curriculum/math/high/algebra1/" target="_blank" rel="noopener">MCPS Algebra 1</a>. Your teacher’s pacing may differ.</p>`;
}
function unit(id) {
  if (id === "equations") return u2Overview();
  if (["foundations", "statistics"].includes(id)) return courseOverview(id);
  const u = units.find((u) => u.id === id);
  if (!u) {
    course();
    return;
  }
  const t = originalTopics.find((t) => t.id === u.topic);
  main.innerHTML = `<a class="text-link" href="#course">← All units</a><p class="eyebrow" style="margin-top:25px">${u.n}</p><h1 class="page-title">${u.title}</h1><p class="intro">${t ? t.bigPicture : u.desc}</p><div class="lesson-list">${u.skills.map((s) => (s === "Equations with variables on both sides" ? `<a href="#lesson/equations"><strong>${s}</strong><span class="badge">Full lesson →</span></a>` : `<div><span>${s}</span><span class="badge">Course outline</span></div>`)).join("")}</div>${t ? `<section class="card"><h2>Topic introduction</h2><p>${t.realLife}</p><ul>${t.studyPoints.map((p) => `<li>${p}</li>`).join("")}</ul><a class="button" href="#practice/${t.id}">Practice this topic →</a></section>` : `<div class="notice">Detailed lessons for this unit are planned. You can practice available topics now.</div><a class="button" href="#practice">Open practice →</a>`}${id === "equations" ? '<div class="controls"><a class="text-link" href="#practice/linear">Practice linear relationships →</a><a class="text-link" href="#practice/systems">Practice systems →</a></div>' : ""}`;
}
function lesson() {
  progress.lessonStarted = true;
  save();
  main.innerHTML = `<a class="text-link" href="#unit/equations">← Equations & systems</a><h1 class="page-title">Variables on both sides</h1><p class="intro">Gather the variable terms, undo the remaining operations, and check that both sides agree.</p><div class="lesson-layout"><article class="card"><p class="eyebrow">01 · UNDERSTAND</p><h2>Keep the equation balanced.</h2><p>An equation says two expressions have the same value. You can subtract the same expression from both sides without changing which value of <i>x</i> makes it true.</p><div class="math">5x + 2 = 3x + 14</div><p>Our goal is to get <i>x</i> by itself. Start by subtracting 3x from <strong>both</strong> sides.</p><p class="eyebrow" style="margin-top:30px">02 · WORK THROUGH AN EXAMPLE</p><div id="steps"><div class="step"><strong>Start with the equation</strong>5x + 2 = 3x + 14</div></div><button class="primary" id="next-step">Reveal next step →</button><p class="eyebrow" style="margin-top:35px">03 · EXPLORE</p><h2>What makes both sides equal?</h2><p>Change x and compare the two sides. Equal values mean you’ve found a solution.</p><label for="x-slider">Value of x: <strong id="x-value">0</strong></label><input class="slider" id="x-slider" type="range" min="-5" max="12" value="0"><div class="balance"><div><small>LEFT · 5x + 2</small><span id="left-value">2</span></div><div><small>RIGHT · 3x + 14</small><span id="right-value">14</span></div></div><p id="balance-status" role="status">The sides are not equal yet.</p><p class="eyebrow" style="margin-top:35px">04 · YOUR TURN</p><p>Ready to try? Practice starts with support. Use a hint when you need it, then try a fresh question on your own.</p><a class="button" href="#practice/equations">Practice equations →</a><div class="controls"><button id="lesson-done" class="ghost">${progress.lessonComplete ? "Lesson marked as explored ✓" : "Mark lesson as explored"}</button></div><p class="muted">Exploring a lesson is a starting point. Independent practice shows what you understand.</p></article><aside class="card"><p class="eyebrow">YOUR LEARNING GOAL</p><h3>I can solve an equation with x on both sides.</h3><ul><li>Subtract variable terms from both sides.</li><li>Undo addition or subtraction.</li><li>Divide by the coefficient.</li><li>Substitute to check.</li></ul><hr><h3>Watch out</h3><p>Subtracting 3x from 5x gives 2x. It does not give 2.</p><p>Keep negative signs attached to their terms.</p><a class="text-link" href="#parent">Studying together? →</a></aside></div>`;
  let step = 0;
  const steps = [
    ["Subtract 3x from both sides", "5x − 3x + 2 = 3x − 3x + 14 → 2x + 2 = 14"],
    ["Subtract 2 from both sides", "2x + 2 − 2 = 14 − 2 → 2x = 12"],
    ["Divide both sides by 2", "2x ÷ 2 = 12 ÷ 2 → x = 6"],
    [
      "Check in the original equation",
      "Left: 5(6) + 2 = 32. Right: 3(6) + 14 = 32. Both sides agree!",
    ],
  ];
  document.getElementById("next-step").onclick = (e) => {
    const s = steps[step++];
    document
      .getElementById("steps")
      .insertAdjacentHTML(
        "beforeend",
        `<div class="step"><strong>${s[0]}</strong>${s[1]}</div>`,
      );
    if (step === steps.length) {
      e.target.disabled = true;
      e.target.textContent = "Example complete ✓";
    }
  };
  document.getElementById("x-slider").oninput = (e) => {
    const x = Number(e.target.value);
    document.getElementById("x-value").textContent = x;
    document.getElementById("left-value").textContent = 5 * x + 2;
    document.getElementById("right-value").textContent = 3 * x + 14;
    document.getElementById("balance-status").textContent =
      x === 6
        ? "Both sides equal 32. x = 6 is the solution!"
        : "The sides are not equal yet.";
  };
  document.getElementById("lesson-done").onclick = (e) => {
    progress.lessonComplete = true;
    save();
    e.target.textContent = "Lesson marked as explored ✓";
  };
}
function equationQuestion(i, level) {
  const x = level === "challenge" ? (i % 13) - 6 : (i % 9) + 1;
  const a = (i % 4) + 4,
    b = (i % 7) + 2,
    c = (i % 3) + 1;
  let prompt, steps, hint;
  if (level === "foundation") {
    prompt = `${a}x + ${b} = ${a * x + b}`;
    hint = `Start by subtracting ${b} from both sides.`;
    steps = `Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}. Check: ${a}(${x}) + ${b} = ${a * x + b}.`;
  } else if (level === "challenge") {
    prompt = `${a}(x + ${b}) = ${c}x + ${(a - c) * x + a * b}`;
    if (a === c) return equationQuestion(i + 1, level);
    hint =
      "Distribute first, then collect the x terms. Negative solutions are possible.";
    steps = `Distribute: ${a}x + ${a * b} = ${c}x + ${(a - c) * x + a * b}. Subtract ${c}x and ${a * b}: ${a - c}x = ${(a - c) * x}. Divide by ${a - c}: x = ${x}.`;
  } else {
    prompt = `${a + c}x + ${b} = ${c}x + ${a * x + b}`;
    hint = `Subtract ${c}x from both sides first.`;
    steps = `Subtract ${c}x: ${a}x + ${b} = ${a * x + b}. Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}. Check both sides: ${(a + c) * x + b}.`;
  }
  return {
    id: `eq-${level}-${i}`,
    topic: "equations",
    title: "Find the value of x",
    prompt,
    answer: String(x),
    hint,
    solution: steps,
  };
}
const baseQuestions = originalTopics.flatMap((t) =>
  t.exercises.map((q, i) => ({ ...q, id: `base-${t.id}-${i}`, topic: t.id })),
);
function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/−/g, "-")
    .replace(/×/g, "*")
    .replace(/[.$]/g, (m) => (m === "$" ? "" : m));
}
function numeric(s) {
  s = normalize(s).replace(/^x=/, "");
  if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return Number(s);
  const m = s.match(/^([+-]?\d+)\/([+-]?\d+)$/);
  return m && Number(m[2]) !== 0 ? Number(m[1]) / Number(m[2]) : NaN;
}
function correct(given, q) {
  const a = normalize(given),
    b = normalize(q.answer);
  if (a === b) return true;
  const n = numeric(b);
  if (Number.isFinite(n) && Number.isFinite(numeric(a)))
    return Math.abs(numeric(a) - n) < 1e-9;
  const alternatives = {
    "y=2x+5": ["y=5+2x", "y=2*x+5", "2x+5=y"],
    "d=4x": ["d=4*x", "4x=d"],
    "f(q)=15q+40": ["f(q)=40+15q", "f(q)=15*q+40"],
    "v(d)=50*2^d": ["v(d)=50(2)^d", "v(d)=50(2^d)", "v(d)=2^d*50"],
    "(x+3)(x+4)": ["(x+4)(x+3)", "(x+3)*(x+4)", "(x+4)*(x+3)"],
    "-3,3": ["3,-3", "x=-3,3", "x=3,-3", "±3", "x=±3"],
    "team a": ["a"],
  };
  return (alternatives[b] || []).includes(a);
}
function practice(topic = "") {
  if (!topic) return coursePracticeHub();
  if (["foundations", "statistics"].includes(topic)) return coursePractice(topic);
  if (topic === "equations") return u2Practice("exam");
  session = null;
  main.innerHTML = `<h1 class="page-title">A little practice, every day.</h1><p class="intro">Choose a focus. Take your time. Every mistake gives you something useful to learn.</p><section class="card"><div class="controls"><label>Topic <select id="practice-topic"><option value="equations">Equations · fresh variations</option><option value="mixed">Mixed topic review</option>${originalTopics
    .filter((t) => t.id !== "equations")
    .map((t) => `<option value="${t.id}">${t.title}</option>`)
    .join(
      "",
    )}</select></label><label id="difficulty-label">Level <select id="difficulty"><option value="foundation">Foundation</option><option value="standard" selected>Standard</option><option value="challenge">Challenge</option></select></label><label>Questions <select id="count"><option>5</option><option selected>10</option><option>15</option></select></label></div><p id="practice-note" class="muted">Foundation: two-step equations. Standard: x on both sides. Challenge: brackets and negative solutions.</p><button class="primary" id="start-session">Start practice →</button></section><div id="question-area"></div>`;
  const select = document.getElementById("practice-topic");
  if ([...select.options].some((o) => o.value === topic)) select.value = topic;
  function update() {
    const equations = select.value === "equations";
    document.getElementById("difficulty-label").hidden = !equations;
    document.getElementById("practice-note").textContent = equations
      ? "Foundation: two-step equations. Standard: x on both sides. Challenge: brackets and negative solutions."
      : "Original topic practice. Session length is limited to available questions; mixed review includes fresh equations.";
  }
  select.onchange = update;
  update();
  document.getElementById("start-session").onclick = () => {
    const t = select.value,
      count = Number(document.getElementById("count").value),
      level = document.getElementById("difficulty").value,
      seed = Math.floor(Math.random() * 1000);
    let questions =
      t === "equations"
        ? Array.from({ length: count }, (_, i) =>
            equationQuestion(seed + i, level),
          )
        : t === "mixed"
          ? [...baseQuestions].sort(() => Math.random() - 0.5).slice(0, count)
          : baseQuestions.filter((q) => q.topic === t).slice(0, count);
    if (t === "mixed" && questions.length < count)
      questions.push(
        ...Array.from({ length: count - questions.length }, (_, i) =>
          equationQuestion(seed + i, level),
        ),
      );
    session = { questions, index: 0, results: [] };
    showQuestion();
  };
}
function showQuestion() {
  const area = document.getElementById("question-area");
  if (session.index >= session.questions.length) {
    const independent = session.results.filter(
      (r) => r.correct && !r.assisted,
    ).length;
    area.innerHTML = `<section class="card question-card"><p class="eyebrow">SESSION COMPLETE</p><h2>You showed up. That matters.</h2><p>${independent} of ${session.questions.length} questions answered correctly on the first try without help.</p><p>Review what was tricky, then try again with fresh questions.</p><div class="controls"><a class="button" href="#review">Review mistakes →</a><button class="ghost" id="again">Practice again</button></div></section>`;
    document.getElementById("again").onclick = () => practice("equations");
    return;
  }
  const q = session.questions[session.index];
  let assisted = false,
    first = true,
    finished = false;
  area.innerHTML = `<section class="card question-card"><p class="eyebrow">QUESTION ${session.index + 1} OF ${session.questions.length}</p><h2>${esc(q.title)}</h2>${q.story ? `<p>${esc(q.story)}</p>` : ""}<div class="math">${esc(q.prompt)}</div><form id="answer-form"><label for="answer">Your answer</label><input id="answer" class="answer-input" autocomplete="off" placeholder="Type your answer" required><button class="primary" type="submit">Check answer</button></form><div id="feedback" class="feedback" role="status" aria-live="polite"></div><div class="controls"><button class="ghost" id="hint">Give me a hint</button><button class="ghost" id="solution">Show worked solution</button><button class="ghost" id="next-question">Skip for now →</button></div><div id="help"></div></section>`;
  const input = document.getElementById("answer");
  input.focus({ preventScroll: true });
  function record(ok) {
    const entry = {
      id: q.id,
      topic: q.topic,
      correct: ok,
      assisted,
      date: new Date().toISOString(),
      question: q,
    };
    progress.attempts.push(entry);
    session.results.push(entry);
    save();
    first = false;
  }
  document.getElementById("answer-form").onsubmit = (e) => {
    e.preventDefault();
    if (finished) return;
    const ok = correct(input.value, q);
    if (first) record(ok);
    const f = document.getElementById("feedback");
    f.className = "feedback" + (ok ? "" : " error");
    f.textContent = ok
      ? "That’s correct. Check the reasoning, then move on."
      : q.topic === "equations"
        ? "Not quite. Check your signs and apply the same operation to both sides. Try a hint if you need one."
        : "Not quite. Check the required answer format, then use a hint and try again.";
    if (ok) {
      finished = true;
      document.querySelector("#answer-form button").disabled = true;
      document.getElementById("next-question").textContent = "Next question →";
    }
  };
  document.getElementById("hint").onclick = () => {
    assisted = true;
    document.getElementById("help").innerHTML =
      `<div class="hint">${esc(q.hint)}</div>`;
  };
  document.getElementById("solution").onclick = () => {
    assisted = true;
    document.getElementById("help").innerHTML =
      `<div class="hint"><strong>Worked solution</strong><p>${esc(q.solution)}</p><p>Try a fresh question next to check your understanding.</p></div>`;
  };
  document.getElementById("next-question").onclick = () => {
    if (first) record(false);
    session.index++;
    showQuestion();
  };
}
function review() {
  const missed = progress.attempts.filter((a) => !a.correct || a.assisted);
  const unique = [...new Map(missed.map((a) => [a.id, a])).values()];
  main.innerHTML = `<h1 class="page-title">Mistakes are part of learning.</h1><p class="intro">Revisit questions that needed another try or a little help. Then practice a fresh example.</p>${
    unique.length
      ? unique
          .slice(-30)
          .reverse()
          .map(
            (a) =>
              `<section class="card" style="margin:12px 0"><h3>${esc(a.question?.prompt || "Equation practice")}</h3><details><summary>See the reasoning</summary><p>${esc(a.question?.solution || "Open practice to work through another example.")}</p></details><a class="text-link" href="${a.courseUnit ? "#skillpractice/" + esc(a.skill) : a.unit2 ? "#u2practice/" + esc(a.skill) : "#practice/" + esc(a.topic)}">Practice this topic →</a></section>`,
          )
          .join("")
      : '<section class="card empty"><h2>A fresh start.</h2><p>Questions needing review will appear here after you practice.</p><a class="button" href="#practice">Start practice →</a></section>'
  }`;
}
function stats() {
  const a = progress.attempts,
    ind = a.filter((x) => x.correct && !x.assisted).length;
  main.innerHTML = `<h1 class="page-title">Your progress</h1><p class="intro">A record of practice, not a prediction of your school grade.</p><div class="stats"><div class="card"><strong>${a.length}</strong>Questions attempted</div><div class="card"><strong>${a.length ? Math.round((ind / a.length) * 100) + "%" : "—"}</strong>First-try accuracy without help</div><div class="card"><strong>${new Set(a.map((x) => x.date.slice(0, 10))).size}</strong>Days practiced (UTC)</div></div><div class="section-heading"><h2>Practice by topic</h2></div>${[{id:"foundations",title:"Foundations"}, ...originalTopics]
    .map((t) => {
      const list = a.filter((x) => x.topic === t.id),
        ok = list.filter((x) => x.correct && !x.assisted).length;
      return `<div class="card" style="margin-bottom:10px"><strong>${t.title}</strong><p class="muted">${list.length ? `${ok} of ${list.length} independent first-try answers` : "Not practiced yet"}</p>${list.length ? `<div class="bar"><span style="width:${(ok / list.length) * 100}%"></span></div>` : ""}</div>`;
    })
    .join(
      "",
    )}<p class="notice">Correct answers after hints or solutions are supported practice. Completing a lesson does not automatically mean a skill is mastered.</p>`;
}
function parent() {
  main.innerHTML = `<h1 class="page-title">Learn together, one step at a time.</h1><p class="intro">You don’t need to remember every rule. Help Ethan explain his thinking, check his answer, and try again.</p><article class="card parent-notes"><h2>A simple 15-minute routine</h2><ol><li><strong>3 minutes:</strong> Ask what he is learning at school and open the matching topic.</li><li><strong>5 minutes:</strong> Work through one example together. Ask why each step is allowed.</li><li><strong>5 minutes:</strong> Let him try two or three questions independently.</li><li><strong>2 minutes:</strong> Review one mistake and let him describe what he learned.</li></ol><h2>For the equations lesson</h2><p>The goal is to isolate x while keeping both sides equal.</p><div class="math">4x + 3 = 2x + 13</div><p>Subtract 2x from both sides: <strong>2x + 3 = 13</strong>.<br>Subtract 3: <strong>2x = 10</strong>.<br>Divide by 2: <strong>x = 5</strong>.<br>Check: both sides equal <strong>23</strong>.</p><h2>Questions that help</h2><ul><li>“What are we trying to find?”</li><li>“What did you do to both sides?”</li><li>“Why does that operation help?”</li><li>“Can you check it in the original equation?”</li></ul><h2>When he gets stuck</h2><p>Ask him to point to the last step he understands. Offer one hint, then let him do the next step. If the arithmetic is the obstacle, practice that separately.</p><h2>Watch for these mistakes</h2><ul><li>Doing an operation on only one side.</li><li>Losing the x when combining terms: 5x − 3x is 2x.</li><li>Dropping a negative sign.</li><li>Checking in a changed equation instead of the original.</li></ul><a class="button" href="#lesson/equations">Open the lesson together →</a></article>`;
}
function settings() {
  main.innerHTML = `<h1 class="page-title">Your saved progress</h1><p class="intro">Progress stays in this browser on this device. Export a backup to move it to another device.</p><section class="card"><div class="controls"><button class="primary" id="export">Export progress</button><label class="button light" for="import">Import progress</label><input type="file" id="import" accept="application/json" class="visually-hidden"></div><p id="import-status" role="status"></p><hr><h3>Original study guide</h3><p>Your original guide and its saved progress are preserved separately.</p><a class="text-link" href="classic.html">Open original guide →</a><hr><h3>Start over</h3><p>This clears only progress in the new math guide.</p><button class="ghost" id="reset">Reset new guide progress</button></section>`;
  document.getElementById("export").onclick = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "ethan-math-progress.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  document.getElementById("import").onchange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5000000) throw Error();
      const p = JSON.parse(await file.text());
      if (!valid(p)) throw Error();
      if (
        !confirm("Replace this browser’s new-guide progress with this backup?")
      )
        return;
      progress = p;
      save();
      document.getElementById("import-status").textContent =
        "Progress imported.";
    } catch {
      document.getElementById("import-status").textContent =
        "That file is not a valid progress backup.";
    }
  };
  document.getElementById("reset").onclick = () => {
    if (
      confirm(
        "Clear new-guide math progress on this device? Export a backup first if you want to keep it.",
      )
    ) {
      progress = fresh();
      save();
      location.hash = "home";
    }
  };
}
function journal() {
  main.innerHTML = `<section class="hero hero--journal"><div class="hero-copy">
    <p class="eyebrow">AFTER SCHOOL</p>
    <h1>What you learned, Ethan</h1>
    <p>One short note a day. Your mum and dad can react or comment, and you can reply.</p>
  </div></section><div data-learning-history></div>`;
  if (window.LearningLog) {
    LearningLog.mountHistory(main.querySelector("[data-learning-history]"), {
      subject: "math", label: "Algebra 1", learner: "Ethan", lessons: lessonChoices(), recent: recentLessons(),
      status: journalStatus,
    });
  }
}
/* Everything he could have been studying, for the "what was this about?"
   picker on the daily note. Two sets, because two parts of the course build
   their lessons differently. */
function lessonChoices() {
  /* Walk the course map itself, so the picker lists the units in the order
     the course teaches them - and lists ALL of them. Foundations, Unit 1 and
     Unit 2 have written lessons, so they open. The rest are real pages with
     an outline and practice but no lessons yet, so each is a row of its own
     that links straight to the unit. He should be able to write down what
     his class covered whether or not we have built the lesson for it. */
  const byUnit = {};
  const add = (unit, lesson) => (byUnit[unit] = byUnit[unit] || []).push(lesson);
  if (typeof U2_TOPICS !== "undefined") {
    U2_TOPICS.forEach((t) => add("equations", { id: t.id, title: t.title, href: "#u2lesson/" + t.id }));
  }
  if (typeof COURSE_LESSONS !== "undefined") {
    COURSE_LESSONS.forEach((l) => add(l.unit, { id: l.id, title: l.title, href: "#study/" + l.id }));
  }
  const out = [];
  units.forEach((u) => {
    /* "Unit 2 · Equations & systems", but plain "Foundations" - its own
       label is "Start here", which says nothing about the maths. */
    const name = /^Unit/.test(u.n) ? u.n + " · " + u.title : u.title;
    const mine = byUnit[u.id] || [];
    if (mine.length) mine.forEach((l) => out.push({ id: l.id, title: l.title, group: name, href: l.href }));
    else out.push({ id: "unit-" + u.id, title: name, href: "#unit/" + u.id });
  });
  return out;
}
/* How Algebra is going, for the panel under the journal's calendar. Same
   shape as Biology's, in this subject's terms: practice attempts rather than
   lessons explored, because that is what this course is made of. */
function journalStatus() {
  const done = [];
  const a = progress.attempts || [];
  const solo = a.filter((x) => x.correct && !x.assisted).length;
  const skills = new Set(a.map((x) => x.skill || x.topic).filter(Boolean));
  const days = new Set(a.map((x) => String(x.date || "").slice(0, 10)).filter(Boolean));
  if (a.length) done.push(`${a.length} practice question${a.length === 1 ? "" : "s"} answered` +
    (a.length >= 5 ? ` \u00b7 ${Math.round(solo / a.length * 100)}% first try on your own` : ""));
  if (skills.size) done.push(`${skills.size} skill${skills.size === 1 ? "" : "s"} practised`);
  if (days.size > 1) done.push(`${days.size} days of practice`);

  let nudge = null;
  if (!a.length) {
    nudge = { text: "No practice yet \u2014 ten questions is about five minutes.",
      href: "#practice", label: "Try some" };
  } else if (typeof U2_TOPICS !== "undefined") {
    const untouched = U2_TOPICS.filter((t) => !skills.has(t.id))[0];
    if (untouched) {
      nudge = { text: `${untouched.title} is waiting whenever you want it.`,
        href: `#u2lesson/${untouched.id}`, label: "Open it" };
    }
  }
  return { done, nudge };
}
/* The ones he has actually been in, newest first: whatever he last opened,
   then the skills his recent practice attempts belong to. */
function recentLessons() {
  const out = [];
  const push = (h) => { if (h && out.indexOf(h) === -1) out.push(h); };
  if (progress.lastLessonRoute) push("#" + String(progress.lastLessonRoute).replace(/^#/, ""));
  if (progress.u2Last) push("#u2lesson/" + progress.u2Last);
  (progress.attempts || []).slice().reverse().forEach((a) => {
    if (!a || !a.skill) return;
    push(a.unit2 ? "#u2lesson/" + a.skill : "#study/" + a.skill);
  });
  const known = lessonChoices().map((l) => l.href);
  return out.filter((h) => known.indexOf(h) > -1).slice(0, 3);
}

function route() {
  const [page = "home", arg = ""] = (location.hash.slice(1) || "home").split(
    "/",
  );
  document.body.classList.remove("nav-open");
  document.getElementById("menu").setAttribute("aria-expanded", "false");
  document.querySelector("nav").innerHTML = nav
    .map(
      ([id, label]) =>
        `<a href="#${id}" ${page === id || (id === "course" && ["unit", "lesson", "u2lesson", "u2practice", "u2check", "study", "skillpractice", "unitpractice", "unitcheck"].includes(page)) ? 'class="active" aria-current="page"' : ""}>${icon(id)}${label}</a>`,
    )
    .join("");
  const crumbs = [["Algebra 1", "#home"]];
  const unit2Page = ["lesson", "u2lesson", "u2practice", "u2check"].includes(page);
  const courseTopic = COURSE_LESSONS.find(t => t.id === arg);
  if (["study", "skillpractice", "unitpractice", "unitcheck"].includes(page)) {
    const group = courseTopic?.unit || arg;
    crumbs.push(["Course", "#course"], [courseName(group), "#unit/" + group], [page === "study" ? "Study" : page === "unitcheck" ? "Self-check" : "Practice"]);
  } else if (unit2Page || page === "unit") {
    crumbs.push(["Course", "#course"]);
    if (unit2Page) {
      crumbs.push(["Unit 2", "#unit/equations"]);
      crumbs.push([{ lesson: "Study", u2lesson: "Study", u2practice: "Practice", u2check: "Self-check" }[page]]);
    } else {
      crumbs.push([units.find((u) => u.id === arg)?.title || "Unit"]);
    }
  } else {
    crumbs.push([nav.find((n) => n[0] === page)?.[1] || { settings: "Settings", search: "Search" }[page] || "Home"]);
  }
  const breadcrumb = document.getElementById("breadcrumb");
  breadcrumb.setAttribute("role", "navigation");
  breadcrumb.setAttribute("aria-label", "Breadcrumb");
  breadcrumb.innerHTML = crumbs.map(([label, href], index) =>
    href ? `<a class="text-link" href="${href}">${esc(label)}</a>`
      : `<a aria-current="page" href="${esc(location.hash || "#home")}">${esc(label)}</a>`
  ).join(' <span aria-hidden="true">/</span> ');
  (
    ({
      home,
      course,
      unit: () => unit(arg),
      study: () => courseStudy(arg),
      skillpractice: () => coursePractice(arg),
      unitpractice: () => coursePractice(arg),
      unitcheck: () => coursePractice(arg, true),
      lesson: () => u2Lesson("both-sides"),
      u2lesson: () => u2Lesson(arg),
      u2practice: () => u2Practice(arg),
      u2check: () => u2Practice("exam", true),
      practice: () => practice(arg),
      review,
      progress: stats,
      parent,
      journal,
      settings,
      search: () => {
        let q;
        try {
          q = decodeURIComponent(arg);
        } catch {
          q = arg;
        }
        course(q);
      },
    })[page] || home
  )();
  /* The home page is sized to fit one screen, as Biology's and AP Gov's are.
     Only the home page: every other page is meant to scroll. */
  document.body.classList.toggle("home-page", page === "home");
  const cluster = document.getElementById("hdr-cluster");
  if (cluster && window.SubjectHeader) {
    SubjectHeader.mount(cluster, {
      subject: "math", label: "Algebra 1", learner: "Ethan",
      journalHref: "#journal", hubHref: "../", lessons: lessonChoices(), recent: recentLessons(),
    });
  }
  window.scrollTo(0, 0);
}
document.getElementById("menu").onclick = () => {
  const open = document.body.classList.toggle("nav-open");
  document.getElementById("menu").setAttribute("aria-expanded", String(open));
};
/* One fact a day in the corner of the sidebar, chosen by the date so it does
   not flicker as he moves between pages. Facts, not encouragement: he reads
   this spot a hundred times a term and a slogan goes invisible by the third
   day. Swap any of these out — they are only here because they are true and
   they touch what he is studying. */
const FACTS = [
  "The word algebra comes from al-jabr, in the title of a book written in Baghdad around the year 820.",
  "The equals sign was invented in 1557 by Robert Recorde, who was tired of writing “is equal to”.",
  "Algorithm comes from the name of the mathematician who gave us algebra: al-Khwārizmī.",
  "x became the letter for the unknown thanks to Descartes, who used the end of the alphabet for things he did not know yet.",
  "Negative numbers were dismissed as absurd by European mathematicians well into the 1700s.",
  "Zero only arrived in Europe as a number of its own in the 1200s, through Arabic mathematics.",
];
function dailyFact(list) {
  const d = new Date();
  const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
  return list[day % list.length];
}
function drawSideFact() {
  const el = document.getElementById("side-fact");
  if (el) {
    el.innerHTML =
      '<p class="side-fact__label">Did you know?</p>' +
      '<p class="side-fact__text">' + dailyFact(FACTS) + "</p>";
  }
}
drawSideFact();
window.addEventListener("hashchange", route);
route();
