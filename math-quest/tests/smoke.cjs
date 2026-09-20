const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const BASE = process.env.MATH_BASE_URL || "http://localhost:8080/math-quest/";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.MATH_BROWSER_EXECUTABLE
      ? { executablePath: process.env.MATH_BROWSER_EXECUTABLE }
      : {}),
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 1448, height: 1086 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + "");
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator(".unit").count(), 9);
  await page.locator(".hero .button").click();
  await page.getByRole("button", { name: "Reveal next step" }).click();
  assert.equal(await page.locator("#steps .step").count(), 2);
  await page.locator("#x-slider").fill("6");
  assert.match(
    await page.locator("#balance-status").textContent(),
    /Both sides equal 32/,
  );
  await page.getByRole("button", { name: "Mark lesson as explored" }).click();
  await page.getByRole("link", { name: "Practice equations" }).click();
  await page.getByRole("button", { name: "Start practice" }).click();
  await page.locator("#answer").fill("99999");
  await page.getByRole("button", { name: "Check answer" }).click();
  assert.match(await page.locator("#feedback").textContent(), /Not quite/);
  await page.getByRole("button", { name: "Give me a hint" }).click();
  await page.getByRole("button", { name: "Show worked solution" }).click();
  const answer = await page.evaluate(() => session.questions[0].answer);
  await page.locator("#answer").fill("x = " + answer);
  await page.getByRole("button", { name: "Check answer" }).click();
  assert.match(await page.locator("#feedback").textContent(), /correct/);
  assert.equal(await page.evaluate(() => progress.attempts[0].correct), false);
  await page.getByRole("button", { name: "Next question" }).click();
  const a2 = await page.evaluate(() => session.questions[1].answer);
  await page.locator("#answer").fill(a2);
  await page.getByRole("button", { name: "Check answer" }).click();
  assert.equal(await page.evaluate(() => progress.attempts[1].correct), true);
  await page.reload();
  assert.equal(await page.evaluate(() => progress.attempts.length), 2);
  await page
    .locator("nav")
    .getByRole("link", { name: "Review mistakes" })
    .click();
  await page.locator("details").first().waitFor();
  assert.equal(await page.locator("details").count(), 1);
  await page.locator("#search").fill("factoring");
  await page.locator("#search").press("Enter");
  await page.waitForURL("**/#search/factoring");
  await page.locator(".unit").first().waitFor();
  assert.equal(await page.locator(".unit").count(), 2);
  const checks = await page.evaluate(() => {
    let n = 0;
    for (const level of ["foundation", "standard", "challenge"])
      for (let i = 0; i < 1000; i++) {
        const q = equationQuestion(i, level);
        const x = Number(q.answer);
        const [left, right] = q.prompt.split("=");
        const evalSide = (s) =>
          Function(
            "x",
            "return " + s.replace(/(\d)x/g, "$1*x").replace(/(\d)\(/g, "$1*("),
          )(x);
        if (evalSide(left) !== evalSide(right)) throw Error(q.prompt);
        if (
          !correct("x=" + x, q) ||
          !correct(`${x * 2}/2`, q) ||
          correct("999999", q)
        )
          throw Error("Answer mismatch");
        n++;
      }
    return n;
  });
  assert.equal(checks, 3000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + "#home");
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.locator("#menu").click();
  assert.equal(
    await page.locator("#menu").getAttribute("aria-expanded"),
    "true",
  );
  await page.locator("nav").getByRole("link", { name: "Parent guide" }).click();
  await page
    .getByRole("heading", { name: "Learn together, one step at a time." })
    .waitFor();
  assert.equal(
    await page.locator("#menu").getAttribute("aria-expanded"),
    "false",
  );
  await page.goto(BASE + "#home");
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 3,000 generated equations; answer checks; lesson interaction; retry tracking; persistence; search; navigation; mobile width; zero browser errors.",
  );
  await browser.close();
})();
