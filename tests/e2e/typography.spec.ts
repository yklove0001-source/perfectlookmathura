import { test, expect, scrollThrough } from "./fixtures";

test.describe("animated typography", () => {
  test("headings keep correct accessible names and their text appears only once", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Confidence begins with a perfect look." })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2, name: "Real people. Real change." })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2, name: "Your new look starts here." })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 3, name: "Hair Patch", exact: true })).toHaveCount(1);
    expect(await page.locator("h1").textContent()).toBe("Confidence begins with a perfect look.");
    const statement = await page.evaluate(() => (document.body.textContent!.match(/Every transformation begins with/g) || []).length);
    expect(statement).toBe(1);
  });

  test("every split heading finishes revealing after scrolling", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(600);
    await scrollThrough(page);
    // the longest entrance (final CTA letters) takes ~2.5s to settle
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              [...document.querySelectorAll('[data-split]:not([data-split="scrub"])')].filter(
                (e) => !e.classList.contains("is-in"),
              ).length,
          ),
        { timeout: 6000 },
      )
      .toBe(0);
    await expect(page.locator(".emph.is-lit")).toHaveCount(2);
  });

  test("reduced motion: all letters and words are visible and still", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.route(/google\.com\/maps/, (r) => r.fulfill({ status: 200, body: "" }));
    await page.goto("/");
    await page.waitForTimeout(400);
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll(".split-wi, .split-c")].filter((e) => {
          const s = getComputedStyle(e);
          return Number(s.opacity) < 0.99 || s.filter !== "none";
        }).length,
    );
    expect(hidden).toBe(0);
    await ctx.close();
  });
});
