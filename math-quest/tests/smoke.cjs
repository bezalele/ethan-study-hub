const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.MATH_BROWSER_EXECUTABLE
      ? { executablePath: process.env.MATH_BROWSER_EXECUTABLE }
      : {}),
    args: process.env.MATH_BROWSER_ARGS
      ? JSON.parse(process.env.MATH_BROWSER_ARGS)
      : [],
  });
  const page = await browser.newPage({
    viewport: { width: 1448, height: 1086 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const base = process.env.MATH_BASE_URL || "http://localhost:8080/math-quest/";
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator(".unit.current").count(), 1);
  await page.locator(".u2-banner .button").click();
  await page
    .getByRole("heading", { name: "Prepare for your upcoming exam" })
    .waitFor();
  assert.equal(await page.locator(".skill-card").count(), 11);
  const ids = await page.evaluate(() => U2_TOPICS.map((t) => t.id));
  for (const id of ids) {
    await page.goto(base + "#u2lesson/" + id);
    await page.locator(".worked-example").first().waitFor();
    assert.equal(
      await page.locator(".worked-example details[open]").count(),
      4,
    );
    assert.equal(
      await page
        .locator("#guided-question input, #guided-question select")
        .count(),
      1,
    );
  }
  await page.goto(base + "#u2lesson/literal-multi");
  await page
    .getByRole("heading", { name: "Multistep literal equations", exact: true })
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#toggle-examples").click();
  assert.equal(await page.locator(".worked-example details[open]").count(), 0);
  await page.locator("#toggle-examples").click();
  assert.equal(await page.locator(".worked-example details[open]").count(), 4);
  await page.goto(base + "#u2practice/literal-one");
  await page.locator("#u2-start").click();
  await page.locator("#u2-question").waitFor();
  await page.locator("#u2-question input").fill("999");
  await page.locator("#u2-question form button").click();
  assert.match(
    await page.locator("#u2-question .feedback").textContent(),
    /Not quite/,
  );
  await page.locator('[data-help="hint"]').click();
  const answer = await page.evaluate(() => u2session.questions[0].answer);
  await page.locator("#u2-question input").fill(answer);
  await page.locator("#u2-question form button").click();
  assert.match(
    await page.locator("#u2-question .feedback").textContent(),
    /Correct/,
  );
  assert.equal(
    await page.evaluate(() => progress.attempts.at(-1).correct),
    false,
  );
  await page.locator("[data-next]").click();
  assert.equal(await page.evaluate(() => u2session.index), 1);
  await page.goto(base + "#review");
  await page.locator("details").first().waitFor();
  assert.equal(
    await page.locator('a[href="#u2practice/literal-one"]').count(),
    1,
  );
  await page.goto(base + "#u2check/exam");
  await page.locator("#u2-start").click();
  await page.locator("#u2-question").waitFor();
  assert.equal(await page.locator("[data-help]").count(), 0);
  const distribution = await page.evaluate(() =>
    u2session.questions.reduce(
      (o, q) => ((o[q.topic] = (o[q.topic] || 0) + 1), o),
      {},
    ),
  );
  assert.equal(Object.keys(distribution).length, 6);
  assert(Object.values(distribution).every((n) => n === 2));
  for (let i = 0; i < 12; i++) {
    const a = await page.evaluate(
      () => u2session.questions[u2session.index].answer,
    );
    await page.locator("#u2-question input").fill(a);
    await page.locator("#u2-question form button").click();
    assert.equal(
      await page.locator("#u2-question .feedback").textContent(),
      "Answer saved. Continue to the next question.",
    );
    await page.locator("[data-next]").click();
  }
  await page
    .getByRole("heading", { name: "12 of 12 independent correct answers" })
    .waitFor();
  assert.equal(await page.locator("#u2-session details").count(), 12);
  await page.reload();
  assert.equal(
    await page.evaluate(() => progress.attempts.filter((a) => a.unit2).length),
    13,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "#unit/equations");
  await page.locator(".skill-card").first().waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.evaluate(() => document.fonts.ready);
  await page.goto(base + "#u2lesson/literal-multi");
  await page.locator(".worked-example").first().waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.locator("#menu").click();
  await page
    .locator("nav")
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await page.locator(".u2-banner").waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS browser: all 11 lesson routes, 44 expanded examples, literal practice, retry tracking, review routes, balanced self-check, no answer leaks, persistence, mobile width/navigation; zero errors.",
  );
  await browser.close();
})();
