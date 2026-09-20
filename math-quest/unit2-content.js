/* Original Unit 2 teaching content and deterministic exercise bank. */
"use strict";
const U2_TOPICS = [
  {
    id: "one-step",
    title: "One-step equations",
    exam: true,
    summary: "Undo one operation while keeping both sides equal.",
    ideas: [
      "The variable stands for an unknown number. Isolate it by doing the same operation to both sides.",
      "Addition and subtraction undo each other. Multiplication and division undo each other.",
      "A negative coefficient is still multiplication: to undo −3x, divide both sides by −3.",
    ],
    method: [
      "Identify the operation attached to x.",
      "Apply the inverse operation to both sides.",
      "Substitute your answer into the original equation.",
    ],
    mistake:
      "Do not change a sign just because a term “moves.” Name the operation you apply to both sides.",
  },
  {
    id: "two-step",
    title: "Two-step equations",
    exam: true,
    summary: "Undo addition or subtraction, then multiplication or division.",
    ideas: [
      "In 3x + 4 = 19, multiplication happens before addition. Undo those operations in reverse order.",
      "Keep the sign with its term. In 5x − 8 = 12, add 8 to both sides first.",
      "A fraction is an exact answer. Do not round unless the question asks you to.",
    ],
    method: [
      "Undo the added or subtracted constant.",
      "Divide by the coefficient (or multiply to undo division).",
      "Check the answer using the original equation.",
    ],
    mistake:
      "Dividing only the x term while leaving the constant unchanged does not preserve the equation.",
  },
  {
    id: "distribution",
    title: "Equations with distribution",
    exam: true,
    summary: "Multiply every term inside the parentheses, then solve.",
    ideas: [
      "a(x + b) means ax + ab. The outside number multiplies both terms.",
      "A negative outside parentheses affects every sign: −2(x − 3) = −2x + 6.",
      "You can sometimes divide both sides first, but distributing always lets you see the separate terms.",
    ],
    method: [
      "Distribute to every term inside parentheses.",
      "Combine like terms on each side.",
      "Undo the constant, then the coefficient.",
    ],
    mistake: "3(x + 4) is 3x + 12, not 3x + 4.",
  },
  {
    id: "three-step",
    title: "Three-step linear equations",
    exam: true,
    summary: "Simplify like terms before isolating the variable.",
    ideas: [
      "Like terms have the same variable part: 3x + 2x = 5x. A plain number cannot be combined with an x term.",
      "Combining like terms rewrites one side without changing its value. Then use inverse operations on both sides.",
      "Fractions and negative coefficients follow the same balance rule.",
    ],
    method: [
      "Combine like terms.",
      "Remove the constant from the variable side.",
      "Divide by the remaining coefficient and check.",
    ],
    mistake: "3x + 4 + 2x becomes 5x + 4, not 9x.",
  },
  {
    id: "literal-one",
    title: "Single-step literal equations",
    exam: true,
    summary: "Isolate one letter; the other letters stay in the answer.",
    ideas: [
      "A literal equation contains several letters. “Solve for F” means make F the subject: F = an expression without F.",
      "Other letters represent quantities, not extra unknowns you must calculate. You usually cannot get a numerical answer.",
      "Division by a letter requires it to be nonzero. Each question states this when needed.",
    ],
    method: [
      "Circle the letter you must isolate.",
      "Identify what is being done to that letter.",
      "Undo that operation on both sides. Write the target letter alone.",
    ],
    mistake: "For n = F − y, add y to BOTH sides. F = n + y, not n − y.",
  },
  {
    id: "literal-multi",
    title: "Multistep literal equations",
    exam: true,
    summary: "Rearrange formulas one operation at a time.",
    ideas: [
      "Treat letters just as you treat numbers: y = mx + b is a two-step equation when solving for x.",
      "Undo addition before dividing: y − b = mx, then x = (y − b)/m, assuming m is not zero.",
      "Use parentheses in a typed answer. (y-b)/m divides the entire difference; y-b/m does not.",
    ],
    method: [
      "Identify the target letter and its coefficient.",
      "Remove terms that do not contain the target.",
      "Divide by the full coefficient. Keep grouped expressions in parentheses.",
    ],
    mistake:
      "In A = h(b + c)/2, multiply the whole equation by 2 before dividing by b + c.",
  },
  {
    id: "both-sides",
    title: "Variables on both sides",
    summary: "Collect variable terms and recognize special cases.",
    ideas: [
      "Subtract a variable term from both sides to collect all x terms on one side.",
      "After simplifying, a true statement like 0 = 0 means every real x is a solution.",
      "A false statement like 0 = 5 means there is no solution. Never divide by zero to try to find x.",
    ],
    method: [
      "Simplify each side.",
      "Subtract variable terms from both sides.",
      "Solve, or recognize no solution / infinitely many solutions.",
    ],
    mistake:
      "If x disappears, inspect the remaining statement rather than guessing x = 0.",
  },
  {
    id: "modeling",
    title: "Writing equations & word problems",
    summary: "Translate a situation into an equation with clear units.",
    ideas: [
      "Define the variable before writing an equation. State what it measures.",
      "A fixed fee plus a cost per item is modeled by total = fee + rate × quantity.",
      "Your algebraic answer must make sense in the story. A count of whole items cannot be a negative fraction.",
    ],
    method: [
      "Choose and define the unknown.",
      "Translate the relationships into an equation.",
      "Solve and interpret the result with units.",
    ],
    mistake: "Do not multiply a one-time fee by the number of items.",
  },
  {
    id: "linear",
    title: "Slope & graphing lines",
    summary: "Connect a line’s equation, table, and graph.",
    ideas: [
      "Slope measures change in y divided by change in x: m = (y₂ − y₁)/(x₂ − x₁). Use the same point order in both differences.",
      "In y = mx + b, b is the y-intercept: the value of y when x = 0.",
      "To graph, plot (0,b), then use rise/run for another point. Horizontal lines have slope 0; vertical lines have undefined slope.",
    ],
    method: [
      "Find the intercept and slope.",
      "Plot the intercept, then a second point using the slope.",
      "Check both points in the equation.",
    ],
    mistake:
      "Rise/run is change in y divided by change in x, not the other way around.",
  },
  {
    id: "systems",
    title: "Systems of equations",
    summary: "Find a pair that satisfies both equations.",
    ideas: [
      "A system’s solution is an ordered pair (x,y) that makes every equation true. On a graph it is an intersection.",
      "Substitution replaces a variable with an equal expression. Elimination adds or subtracts equations to cancel a variable.",
      "Parallel distinct lines have no solution. Two equations for the same line have infinitely many solutions.",
    ],
    method: [
      "Choose substitution or elimination.",
      "Find one variable, then substitute to find the other.",
      "Check the ordered pair in both original equations.",
    ],
    mistake:
      "Finding x alone is not enough when the question asks for the ordered pair.",
  },
  {
    id: "inequalities",
    title: "Linear inequalities",
    summary: "Describe a range of solutions, including boundary rules.",
    ideas: [
      "Solve much like an equation, but reverse the inequality when multiplying or dividing BOTH sides by a negative number.",
      "Use an open endpoint for < or > and a closed endpoint for ≤ or ≥ on a number line.",
      "In two variables, a boundary line divides the plane. Use a dashed line for strict inequalities, a solid line for inclusive ones, then test a point to choose the shaded side. A system uses the overlapping region.",
    ],
    method: [
      "Simplify and isolate the variable.",
      "Reverse the sign only when multiplying or dividing by a negative.",
      "Check a value inside the solution range and describe the boundary.",
    ],
    mistake:
      "Subtracting a negative number does not by itself reverse the inequality. Dividing by a negative does.",
  },
];
const U2_BANK = {};
const sign = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);
function u2q(topic, i, prompt, answer, steps, extra = {}) {
  return {
    id: `u2-${topic}-${i}`,
    topic,
    title: U2_TOPICS.find((t) => t.id === topic).title,
    prompt,
    answer: String(answer),
    steps,
    hint: steps[0],
    kind: "expression",
    target: "x",
    ...extra,
  };
}
for (const t of U2_TOPICS) U2_BANK[t.id] = [];
function put(t, i, p, a, s, e) {
  U2_BANK[t].push(u2q(t, i, p, a, s, e));
}
for (let i = 0; i < 24; i++) {
  const x = i % 2 === 0 ? i + 2 : -(i + 1),
    a = (i % 5) + 2,
    b = (i % 7) + 3,
    k = i % 4;
  let p, s;
  if (k === 0) {
    p = `x + ${b} = ${x + b}`;
    s = [
      `Subtract ${b} from both sides.`,
      `x = ${x + b} − ${b} = ${x}.`,
      `Check: ${x} + ${b} = ${x + b}.`,
    ];
  }
  if (k === 1) {
    p = `x − ${b} = ${x - b}`;
    s = [
      `Add ${b} to both sides.`,
      `x = ${x - b} + ${b} = ${x}.`,
      `Check: ${x} − ${b} = ${x - b}.`,
    ];
  }
  if (k === 2) {
    p = `−${a}x = ${-a * x}`;
    s = [
      `Divide both sides by −${a}.`,
      `x = ${-a * x}/(−${a}) = ${x}.`,
      `Check: −${a} × (${x}) = ${-a * x}.`,
    ];
  }
  if (k === 3) {
    p = `x/${a} = ${x}`;
    s = [
      `Multiply both sides by ${a}.`,
      `x = ${x} × ${a} = ${a * x}.`,
      `Check: ${a * x}/${a} = ${x}.`,
    ];
  }
  put("one-step", i, p, k === 3 ? a * x : x, s);
  const c = i % 2 ? -a : a,
    d = i % 3 ? b : -b,
    r = c * x + d;
  put("two-step", i, `${c}x ${sign(d)} = ${r}`, x, [
    `Subtract ${d} from both sides (adding ${-d} has the same effect).`,
    `${c}x = ${r} − (${d}) = ${c * x}.`,
    `Divide both sides by ${c}: x = ${x}.`,
    `Check: ${c} × (${x}) + (${d}) = ${r}.`,
  ]);
  put("distribution", i, `${c}(x ${sign(d)}) = ${c * (x + d)}`, x, [
    `Multiply both terms inside parentheses by ${c}.`,
    `${c}x ${sign(c * d)} = ${c * (x + d)}.`,
    `Subtract ${c * d}: ${c}x = ${c * x}.`,
    `Divide by ${c}: x = ${x}.`,
    `Check inside parentheses first: ${c} × (${x + d}) = ${c * (x + d)}.`,
  ]);
  put(
    "three-step",
    i,
    `${a}x ${sign(b)} + ${a + 1}x = ${(2 * a + 1) * x + b}`,
    x,
    [
      `Combine like terms: ${a}x + ${a + 1}x = ${2 * a + 1}x.`,
      `${2 * a + 1}x + ${b} = ${(2 * a + 1) * x + b}.`,
      `Subtract ${b}: ${2 * a + 1}x = ${(2 * a + 1) * x}.`,
      `Divide by ${2 * a + 1}: x = ${x}.`,
      `Check: ${a * x} + ${b} + ${(a + 1) * x} = ${(2 * a + 1) * x + b}.`,
    ],
  );
  put("both-sides", i, `${a + 2}x + ${b} = 2x ${sign(a * x + b)}`, x, [
    `Subtract 2x from both sides: ${a}x + ${b} = ${a * x + b}.`,
    `Subtract ${b}: ${a}x = ${a * x}.`,
    `Divide by ${a}: x = ${x}.`,
    `Check: both original sides equal ${(a + 2) * x + b}.`,
  ]);
  put(
    "modeling",
    i,
    `A club charges a $${b} registration fee and $${a} for each session. You paid $${b + a * (i + 2)}. How many sessions did you attend?`,
    i + 2,
    [
      `Let x be the number of sessions. Write ${b} + ${a}x = ${b + a * (i + 2)}.`,
      `Subtract the one-time fee: ${a}x = ${a * (i + 2)}.`,
      `Divide by the cost per session: x = ${i + 2}.`,
      `You attended ${i + 2} sessions.`,
    ],
  );
  const m = i % 2 ? -a : a,
    yy = m * 2 + b;
  if (k === 0)
    put(
      "linear",
      i,
      `Find the slope of the line through (0, ${b}) and (2, ${yy}).`,
      m,
      [
        `Use m = (y₂ − y₁)/(x₂ − x₁).`,
        `m = (${yy} − ${b})/(2 − 0) = ${2 * m}/2 = ${m}.`,
      ],
    );
  if (k === 1)
    put("linear", i, `Find the y-intercept b of y = ${m}x + ${b}.`, b, [
      `At the y-intercept, x = 0.`,
      `y = ${m}(0) + ${b} = ${b}. The intercept point is (0, ${b}).`,
    ]);
  if (k === 2)
    put(
      "linear",
      i,
      `For y = ${m}x + ${b}, find y when x = 2.`,
      yy,
      [`Substitute 2 for x.`, `y = ${m} × 2 + ${b} = ${yy}.`],
      { target: "y" },
    );
  if (k === 3)
    put(
      "linear",
      i,
      `Write the equation of a line with slope ${m} and y-intercept ${b}. Enter only the expression after y =.`,
      `${m}x+${b}`,
      [
        `Use y = mx + b.`,
        `Replace m with ${m} and b with ${b}: y = ${m}x + ${b}.`,
      ],
      { target: "y" },
    );
  const y = (i % 7) - 3;
  put(
    "systems",
    i,
    `Solve the system: x + y = ${x + y}; x − y = ${x - y}. Give (x, y).`,
    `${x},${y}`,
    [
      `Add the equations to eliminate y: 2x = ${2 * x}.`,
      `Divide by 2: x = ${x}.`,
      `Substitute into x + y = ${x + y}: y = ${y}.`,
      `Check: ${x} + (${y}) = ${x + y}; ${x} − (${y}) = ${x - y}.`,
    ],
    { kind: "pair" },
  );
  const op = i % 2 ? "<=" : ">",
    flip = { "<=": ">=", ">": "<" };
  put(
    "inequalities",
    i,
    `${c}x + ${b} ${op} ${c * x + b}. Solve for x.`,
    `x${c < 0 ? flip[op] : op}${x}`,
    [
      `Subtract ${b}: ${c}x ${op} ${c * x}.`,
      `Divide by ${c}.${c < 0 ? " Since it is negative, reverse the inequality." : " Since it is positive, keep the inequality direction."}`,
      `x ${c < 0 ? flip[op] : op} ${x}.`,
      `${op === ">" ? "Use an open endpoint." : "Use a closed endpoint."} Shade ${(c < 0 ? flip[op] : op).startsWith(">") ? "right" : "left"} on the number line.`,
    ],
    { kind: "inequality" },
  );
}
const letters = [
  ["F", "n", "y"],
  ["a", "b", "c"],
  ["p", "q", "r"],
  ["h", "s", "t"],
  ["v", "d", "t"],
  ["W", "P", "L"],
];
letters.forEach(([z, u, v], j) => {
  const forms = [
    [
      `${u} = ${z} − ${v}`,
      `${u}+${v}`,
      [
        `Add ${v} to both sides.`,
        `${u} + ${v} = ${z}.`,
        `Write the target first: ${z} = ${u} + ${v}.`,
      ],
    ],
    [
      `${u} = ${z} + ${v}`,
      `${u}-${v}`,
      [
        `Subtract ${v} from both sides.`,
        `${u} − ${v} = ${z}.`,
        `So ${z} = ${u} − ${v}.`,
      ],
    ],
    [
      `${u} = ${v}${z}`,
      `${u}/${v}`,
      [
        `Divide both sides by ${v}.`,
        `${z} = ${u}/${v}.`,
        `This requires ${v} ≠ 0.`,
      ],
      `${v} ≠ 0`,
    ],
    [
      `${u} = ${z}/${v}`,
      `${u}*${v}`,
      [
        `Multiply both sides by ${v}.`,
        `${z} = ${u}${v}.`,
        `Check by dividing ${u}${v} by ${v}; the result is ${u}.`,
      ],
      `${v} ≠ 0`,
    ],
  ];
  forms.forEach(([p, a, s, assumption], k) =>
    put("literal-one", j * 4 + k, `Solve ${p} for ${z}.`, a, s, {
      target: z,
      assumption: assumption || "",
      equation: p,
    }),
  );
});
const multi = [
  [
    "y = mx + b",
    "x",
    "(y-b)/m",
    [
      "Subtract b: y − b = mx.",
      "Divide the entire difference by m: x = (y − b)/m.",
      "Parentheses keep y − b together.",
    ],
    "m ≠ 0",
  ],
  [
    "y = mx + b",
    "b",
    "y-m*x",
    ["Subtract mx from both sides.", "b = y − mx."],
    "",
  ],
  [
    "P = 2L + 2W",
    "W",
    "(P-2*L)/2",
    [
      "Subtract 2L: P − 2L = 2W.",
      "Divide both sides by 2: W = (P − 2L)/2.",
      "P/2 − L is an equivalent answer.",
    ],
    "",
  ],
  [
    "A = bh/2",
    "h",
    "2*A/b",
    ["Multiply both sides by 2: 2A = bh.", "Divide both sides by b: h = 2A/b."],
    "b ≠ 0",
  ],
  [
    "d = vt + s",
    "t",
    "(d-s)/v",
    ["Subtract s: d − s = vt.", "Divide by v: t = (d − s)/v."],
    "v ≠ 0",
  ],
  [
    "C = ar + b",
    "r",
    "(C-b)/a",
    ["Subtract b: C − b = ar.", "Divide by a: r = (C − b)/a."],
    "a ≠ 0",
  ],
  [
    "q = (p + r)/s",
    "p",
    "q*s-r",
    ["Multiply by s: qs = p + r.", "Subtract r: p = qs − r."],
    "s ≠ 0",
  ],
  [
    "k = a(b − c)",
    "b",
    "k/a+c",
    ["Divide by a: k/a = b − c.", "Add c: b = k/a + c."],
    "a ≠ 0",
  ],
  [
    "k = a(b − c)",
    "c",
    "b-k/a",
    ["Divide by a: k/a = b − c.", "Add c and subtract k/a: c = b − k/a."],
    "a ≠ 0",
  ],
  [
    "V = LWh",
    "h",
    "V/(L*W)",
    [
      "LWh means (L × W) × h.",
      "Divide by the entire coefficient LW: h = V/(LW).",
    ],
    "L ≠ 0 and W ≠ 0",
  ],
  [
    "a = (v − u)/t",
    "v",
    "a*t+u",
    ["Multiply by t: at = v − u.", "Add u: v = at + u."],
    "t ≠ 0",
  ],
  [
    "a = (v − u)/t",
    "u",
    "v-a*t",
    [
      "Multiply by t: at = v − u.",
      "Add u to both sides, then subtract at: u = v − at.",
    ],
    "t ≠ 0",
  ],
  [
    "F = 9C/5 + 32",
    "C",
    "5*(F-32)/9",
    [
      "Subtract 32: F − 32 = 9C/5.",
      "Multiply by 5: 5(F − 32) = 9C.",
      "Divide by 9: C = 5(F − 32)/9.",
    ],
    "",
  ],
  [
    "S = n(a + b)/2",
    "a",
    "2*S/n-b",
    [
      "Multiply by 2: 2S = n(a + b).",
      "Divide by n: 2S/n = a + b.",
      "Subtract b: a = 2S/n − b.",
    ],
    "n ≠ 0",
  ],
  [
    "P = 2(L + W)",
    "L",
    "P/2-W",
    ["Divide both sides by 2: P/2 = L + W.", "Subtract W: L = P/2 − W."],
    "",
  ],
  [
    "E = mc + d",
    "m",
    "(E-d)/c",
    ["Subtract d: E − d = mc.", "Divide both sides by c: m = (E − d)/c."],
    "c ≠ 0",
  ],
  [
    "z = ax − b",
    "x",
    "(z+b)/a",
    ["Add b: z + b = ax.", "Divide by a: x = (z + b)/a."],
    "a ≠ 0",
  ],
  [
    "w = (x − y)/z",
    "x",
    "w*z+y",
    ["Multiply by z: wz = x − y.", "Add y: x = wz + y."],
    "z ≠ 0",
  ],
  [
    "w = (x − y)/z",
    "y",
    "x-w*z",
    ["Multiply by z: wz = x − y.", "Add y, then subtract wz: y = x − wz."],
    "z ≠ 0",
  ],
  [
    "A = h(b + c)/2",
    "h",
    "2*A/(b+c)",
    [
      "Multiply by 2: 2A = h(b + c).",
      "Divide by the entire coefficient b + c: h = 2A/(b + c).",
    ],
    "b + c ≠ 0",
  ],
  [
    "T = p + qr",
    "q",
    "(T-p)/r",
    ["Subtract p: T − p = qr.", "Divide by r: q = (T − p)/r."],
    "r ≠ 0",
  ],
  [
    "z = 3(x + y)",
    "y",
    "z/3-x",
    ["Divide by 3: z/3 = x + y.", "Subtract x: y = z/3 − x."],
    "",
  ],
  [
    "R = (a + b)c",
    "b",
    "R/c-a",
    ["Divide by c: R/c = a + b.", "Subtract a: b = R/c − a."],
    "c ≠ 0",
  ],
  [
    "K = 2r + 3s",
    "s",
    "(K-2*r)/3",
    ["Subtract 2r: K − 2r = 3s.", "Divide by 3: s = (K − 2r)/3."],
    "",
  ],
];
multi.forEach(([equation, target, answer, steps, assumption], i) =>
  put("literal-multi", i, `Solve ${equation} for ${target}.`, answer, steps, {
    target,
    assumption,
    equation,
  }),
);
put(
  "both-sides",
  24,
  "Solve 3(x + 2) = 3x + 6.",
  "all real numbers",
  [
    "Distribute: 3x + 6 = 3x + 6.",
    "Subtract 3x and 6 from both sides: 0 = 0.",
    "This is always true, so all real numbers are solutions.",
  ],
  { kind: "choice", choices: ["x = 0", "no solution", "all real numbers"] },
);
put(
  "both-sides",
  25,
  "Solve 2(x + 3) = 2x + 9.",
  "no solution",
  [
    "Distribute: 2x + 6 = 2x + 9.",
    "Subtract 2x: 6 = 9 is false.",
    "No value of x can make this true.",
  ],
  { kind: "choice", choices: ["x = 3", "no solution", "all real numbers"] },
);
put(
  "systems",
  24,
  "Solve y = 2x + 1 and y = 2x + 4.",
  "no solution",
  [
    "The lines have the same slope but different intercepts.",
    "Setting the right sides equal gives 1 = 4.",
    "The lines never intersect.",
  ],
  {
    kind: "choice",
    choices: ["(0, 1)", "no solution", "infinitely many solutions"],
  },
);
put(
  "systems",
  25,
  "Solve y = 2x + 1 and 2y = 4x + 2.",
  "infinitely many solutions",
  [
    "Divide the second equation by 2: y = 2x + 1.",
    "Both equations describe the same line.",
    "Every point on that line solves the system.",
  ],
  {
    kind: "choice",
    choices: ["(0, 0)", "no solution", "infinitely many solutions"],
  },
);
put(
  "linear",
  24,
  "What is the slope of the vertical line x = 4?",
  "undefined",
  [
    "Every point has x = 4.",
    "The change in x is zero; slope would divide by zero.",
    "Its slope is undefined.",
  ],
  { kind: "choice", choices: ["0", "4", "undefined"] },
);
put("linear", 25, "What is the slope of y = 6?", "0", [
  "Every point has the same y-coordinate.",
  "Change in y is zero, so the slope is zero.",
]);
put(
  "inequalities",
  24,
  "For y > 2x + 1, how should the boundary and shading look?",
  "dashed line; shade above",
  [
    "Use the boundary y = 2x + 1.",
    "The strict > symbol means the line is dashed.",
    "Greater y-values are above the line.",
  ],
  {
    kind: "choice",
    choices: [
      "solid line; shade above",
      "dashed line; shade above",
      "dashed line; shade below",
    ],
  },
);
put(
  "inequalities",
  25,
  "Does (2, 3) satisfy BOTH y >= x and y <= 4?",
  "yes",
  [
    "Check 3 >= 2: true.",
    "Check 3 <= 4: true.",
    "Both inequalities hold, so the point is in the solution region.",
  ],
  { kind: "choice", choices: ["yes", "no"] },
);
put(
  "modeling",
  24,
  "A taxi charges $4 plus $3 per mile. Write total cost C in terms of miles m. Enter the expression after C =.",
  "4+3*m",
  ["The fixed fee is 4.", "The per-mile cost is 3m.", "C = 4 + 3m."],
  { target: "C" },
);
put(
  "systems",
  26,
  "Solve y = x + 2 and 2x + y = 11. Give (x, y).",
  "3,5",
  [
    "Substitute x + 2 for y: 2x + x + 2 = 11.",
    "Combine and solve: 3x = 9, so x = 3.",
    "y = 3 + 2 = 5.",
    "Check: 2(3) + 5 = 11.",
  ],
  { kind: "pair" },
);
// Deliberately varied examples, separate from the randomized practice session.
U2_TOPICS.forEach((t) => {
  t.examples =
    t.id === "both-sides"
      ? [0, 1, 24, 25]
      : t.id === "systems"
        ? [0, 26, 24, 25]
        : t.id === "linear"
          ? [0, 1, 3, 24]
          : t.id === "inequalities"
            ? [0, 1, 24, 25]
            : t.id === "literal-multi"
              ? [0, 2, 3, 12]
              : [0, 1, 2, 3];
});
if (typeof module !== "undefined") module.exports = { U2_TOPICS, U2_BANK };
// Fractional answers and additional representations extend the core integer sets.
put("one-step", 24, "4x = 7", "7/4", [
  "Divide both sides by 4.",
  "x = 7/4 = 1.75.",
  "Check: 4 × (7/4) = 7.",
]);
put("two-step", 24, "4x + 3 = 10", "7/4", [
  "Subtract 3: 4x = 7.",
  "Divide by 4: x = 7/4.",
  "Check: 4 × (7/4) + 3 = 10.",
]);
put("two-step", 25, "x/3 + 2 = 7", "15", [
  "Subtract 2: x/3 = 5.",
  "Multiply both sides by 3: x = 15.",
  "Check: 15/3 + 2 = 7.",
]);
put("three-step", 24, "7 − 3x + x = 15", "-4", [
  "Combine −3x + x = −2x.",
  "Subtract 7: −2x = 8.",
  "Divide by −2: x = −4.",
  "Check: 7 − 3(−4) + (−4) = 15.",
]);
put("distribution", 24, "2(x + 1) = 5", "3/2", [
  "Distribute: 2x + 2 = 5.",
  "Subtract 2: 2x = 3.",
  "Divide by 2: x = 3/2.",
  "Check: 2(3/2 + 1) = 5.",
]);
U2_TOPICS.find((t) => t.id === "two-step").examples = [0, 1, 24, 25];
U2_TOPICS.find((t) => t.id === "three-step").examples = [0, 1, 2, 24];
U2_TOPICS.find((t) => t.id === "distribution").examples = [0, 1, 2, 24];
