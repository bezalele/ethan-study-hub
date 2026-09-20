/* Restricted symbolic arithmetic. No eval, Function, or execution of input. */
"use strict";
const U2Math = (() => {
  const poly = (n) => (n ? new Map([["", n]]) : new Map());
  const add = (a, b, scale = 1) => {
    const out = new Map(a);
    for (const [k, v] of b) {
      const n = (out.get(k) || 0) + v * scale;
      if (Math.abs(n) < 1e-10) out.delete(k);
      else out.set(k, n);
    }
    return out;
  };
  const mul = (a, b) => {
    const out = new Map();
    for (const [k, v] of a)
      for (const [l, w] of b) {
        const key = (k + l).split("").sort().join("");
        out.set(key, (out.get(key) || 0) + v * w);
      }
    if (out.size > 150) throw Error("Too complex");
    return add(out, poly(0));
  };
  const rat = (n) => ({ n: poly(n), d: poly(1) });
  function combine(a, b, op) {
    if (op === "+")
      return { n: add(mul(a.n, b.d), mul(b.n, a.d)), d: mul(a.d, b.d) };
    if (op === "-")
      return { n: add(mul(a.n, b.d), mul(b.n, a.d), -1), d: mul(a.d, b.d) };
    if (op === "*") return { n: mul(a.n, b.n), d: mul(a.d, b.d) };
    if (!b.n.size) throw Error("Division by zero");
    return { n: mul(a.n, b.d), d: mul(a.d, b.n) };
  }
  function parse(raw) {
    let s = String(raw)
      .replace(/\s/g, "")
      .replace(/[−–]/g, "-")
      .replace(/[×·]/g, "*")
      .replace(/÷/g, "/");
    if (!s || s.length > 120 || /[^a-zA-Z0-9.+*/()\-]/.test(s))
      throw Error("Use numbers, letters, parentheses, +, -, * and /.");
    const tok = s.match(/(?:\d+(?:\.\d*)?|\.\d+)|[a-zA-Z()+*/-]/g) || [];
    if (tok.join("") !== s) throw Error("Invalid expression");
    let p = 0;
    function atom() {
      const t = tok[p++];
      if (t === "+" || t === "-") {
        const a = atom();
        return t === "-" ? combine(rat(-1), a, "*") : a;
      }
      if (t === "(") {
        const a = sum();
        if (tok[p++] !== ")") throw Error("Close parentheses");
        return a;
      }
      if (/^[a-zA-Z]$/.test(t || ""))
        return { n: new Map([[t, 1]]), d: poly(1) };
      if (t !== undefined && !Number.isNaN(Number(t))) return rat(Number(t));
      throw Error("Expected a number, letter, or parenthesis");
    }
    function product() {
      let a = atom();
      while (p < tok.length) {
        const t = tok[p];
        if (t === "*" || t === "/") {
          p++;
          a = combine(a, atom(), t);
        } else if (t === "(" || /^[a-zA-Z]$/.test(t)) {
          a = combine(a, atom(), "*");
        } else break;
      }
      return a;
    }
    function sum() {
      let a = product();
      while (tok[p] === "+" || tok[p] === "-") {
        const op = tok[p++];
        a = combine(a, product(), op);
      }
      return a;
    }
    const r = sum();
    if (p !== tok.length || !r.d.size) throw Error("Invalid expression");
    return r;
  }
  function equal(a, b) {
    const diff = add(mul(a.n, b.d), mul(b.n, a.d), -1);
    return !diff.size;
  }
  function check(raw, q) {
    try {
      let s = String(raw).trim();
      if (!s) return { ok: false, message: "Enter an answer first." };
      if (q.kind === "choice")
        return { ok: s.toLowerCase() === q.answer.toLowerCase() };
      if (q.kind === "pair") {
        s = s.replace(/^\(/, "").replace(/\)$/, "");
        const a = s.split(","),
          b = q.answer.split(",");
        return {
          ok: a.length === 2 && a.every((v, i) => equal(parse(v), parse(b[i]))),
        };
      }
      if (q.kind === "inequality") {
        const norm = (s) =>
          s
            .replace(/\s/g, "")
            .replace(/≤/g, "<=")
            .replace(/≥/g, ">=")
            .replace(/−/g, "-");
        const a = norm(s).match(/^(.+?)(<=|>=|<|>)(.+)$/),
          b = norm(q.answer).match(/^x(<=|>=|<|>)(.+)$/);
        if (!a)
          return {
            ok: false,
            message: "Include x and the inequality, for example x <= 3.",
          };
        let op = a[2],
          value;
        if (a[1] === "x") value = a[3];
        else if (a[3] === "x") {
          value = a[1];
          op = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" }[op];
        } else
          return {
            ok: false,
            message: "Isolate x on one side of the inequality.",
          };
        return { ok: op === b[1] && equal(parse(value), parse(b[2])) };
      }
      if (s.includes("=")) {
        const parts = s.split("=");
        if (parts.length !== 2 || parts[0].trim() !== q.target)
          return {
            ok: false,
            message: `Write only the expression, or begin with ${q.target} =.`,
          };
        s = parts[1];
      }
      const allowed = new Set(q.answer.match(/[a-zA-Z]/g) || []);
      if ((s.match(/[a-zA-Z]/g) || []).some((v) => !allowed.has(v)))
        return {
          ok: false,
          message: `Isolate ${q.target}. Use only the letters needed in the answer, with matching capitalization.`,
        };
      const parsed = parse(s),
        expected = parse(q.answer);
      return { ok: equal(parsed, expected) };
    } catch (e) {
      return {
        ok: false,
        message:
          "Use parentheses and / for fractions, such as (y-b)/m. Check that every parenthesis is closed.",
      };
    }
  }
  return { parse, equal, check };
})();
if (typeof module !== "undefined") module.exports = U2Math;
