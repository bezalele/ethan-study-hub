const assert = require("node:assert/strict");
const { U2_TOPICS: topics, U2_BANK: bank } = require("../unit2-content.js");
const math = require("../unit2-math.js");
let count = 0;
for (const t of topics) {
  assert.equal(t.examples.length, 4);
  assert(bank[t.id].length >= 24);
  for (const q of bank[t.id]) {
    assert(math.check(q.answer, q).ok, q.id + " rejects own answer");
    assert(!math.check("wrong", q).ok, q.id + " accepts wrong");
    assert(q.steps.length >= 2);
    assert(q.hint);
    count++;
  }
}
// Independently substitute numerical and literal answers into original equations.
for (const t of [
  "one-step",
  "two-step",
  "distribution",
  "three-step",
  "both-sides",
])
  for (const q of bank[t].filter((q) => q.kind === "expression")) {
    const [l, r] = q.prompt.split("=");
    const plug = (s) => s.replace(/x/g, `(${q.answer})`);
    assert(math.equal(math.parse(plug(l)), math.parse(plug(r))), q.id);
  }
for (const t of ["literal-one", "literal-multi"])
  for (const q of bank[t]) {
    const [l, r] = q.equation.split("=");
    const plug = (s) => s.split(q.target).join(`(${q.answer})`);
    assert(math.equal(math.parse(plug(l)), math.parse(plug(r))), q.id);
  }
for (const q of bank.systems.filter((q) => q.kind === "pair")) {
  const [x, y] = q.answer.split(",").map(Number);
  if (q.id === "u2-systems-26") {
    assert.equal(y, x + 2);
    assert.equal(2 * x + y, 11);
  } else {
    const nums = q.prompt.match(/= (-?\d+)/g).map((s) => Number(s.slice(2)));
    assert.equal(x + y, nums[0]);
    assert.equal(x - y, nums[1]);
  }
}
const lit = bank["literal-multi"][0];
for (const a of ["(y-b)/m", "y/m-b/m", "(-b+y)/m", "x=(y-b)/m"])
  assert(math.check(a, lit).ok, a);
for (const a of [
  "y-b/m",
  "(y+b)/m",
  "(y-b)*m",
  "(Y-b)/m",
  "x",
  "alert(1)",
  "1/0",
  "(y-b)/m + 1",
])
  assert(!math.check(a, lit).ok, a);
const first = bank["literal-one"][0];
assert(math.check("y+n", first).ok);
assert(!math.check("n-y", first).ok);
assert(math.check("1.75", bank["two-step"][24]).ok);
assert(math.check("7/4", bank["two-step"][24]).ok);
assert(!math.check("z/z", { kind: "expression", answer: "1", target: "x" }).ok);
assert(math.check("3 >= x", { kind: "inequality", answer: "x<=3" }).ok);
assert(!math.check("x<3", { kind: "inequality", answer: "x<=3" }).ok);
console.log(
  `PASS: ${topics.length} topics, ${topics.length * 4} examples, ${count} questions; substitution, literal equivalence, incorrect-answer rejection.`,
);
