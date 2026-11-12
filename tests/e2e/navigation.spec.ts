import { test, expect, scrollThrough } from "./fixtures";

const topOf = (id: string) => `document.getElementById("${id}").getBoundingClientRect().top`;

test("menu links glide to the right section, just below the header", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.waitForTimeout(800);
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: /Process/ }).click();
  } else {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Process" }).click();
  }
  await expect.poll(() => page.evaluate(topOf("process")), { timeout: 5000 }).toBeGreaterThan(70);
  await expect.poll(() => page.evaluate(topOf("process")), { timeout: 5000 }).toBeLessThan(92);
  expect(page.url()).toContain("#process");
});

test("mobile menu: focus moves in, Escape closes and returns focus, page scroll unlocks", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile menu only");
  await page.goto("/");
  await page.waitForTimeout(500);
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await expect(page.locator("#mobile-menu a").first()).toBeFocused();
  await expect(page.locator("#main")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  await expect(page.locator("#main")).not.toHaveAttribute("inert", "");
});

test("'Book Consultation' from a service page opens the form with that service chosen", async ({ page }) => {
  await page.goto("/services/hair-weaving");
  await page.waitForTimeout(600);
  await page.locator('a[href="/?service=hair-weaving#book"]').click();
  await expect(page.locator("#book select[name=service]")).toHaveValue("Hair Weaving", { timeout: 8000 });
  await expect.poll(() => page.evaluate(topOf("book")), { timeout: 6000 }).toBeLessThan(140);
});

test("no content stays hidden after scrolling the whole page", async ({ page, errors }) => {
  await page.goto("/");
  await page.waitForTimeout(600);
  await scrollThrough(page);
  const stuck = await page.evaluate(
    () => [...document.querySelectorAll("[data-reveal]")].filter((e) => !e.classList.contains("is-in")).length,
  );
  expect(stuck).toBe(0);
  expect(errors).toEqual([]);
});

test("visitors who prefer reduced motion see everything immediately, without the loader", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.route(/google\.com\/maps/, (r) => r.fulfill({ status: 200, body: "" }));
  await page.goto("/");
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.documentElement.dataset.loader)).toBeUndefined();
  const hidden = await page.evaluate(
    () => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length,
  );
  expect(hidden).toBe(0);
  await ctx.close();
});

test("intro loader shows on a first visit and removes itself", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.route(/google\.com\/maps/, (r) => r.fulfill({ status: 200, body: "" }));
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.dataset.loader)).toBe("show");
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.querySelector(".pl-loader")!).visibility), { timeout: 5000 })
    .toBe("hidden");
  await ctx.close();
});

test("skip link and keyboard focus work from the top of the page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard test on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe("none");
});

test("sections skipped by a menu jump still appear when scrolling back up", async ({ page }) => {
  await page.goto("/#contact");
  await page.waitForTimeout(2000);
  const start = await page.evaluate(() => window.scrollY);
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy(0, -500));
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(1800);
  // Everything above where the visitor started must now be visible
  const stuck = await page.evaluate(
    (startY) =>
      [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
        (e) => !e.classList.contains("is-in") && e.getBoundingClientRect().top + window.scrollY < startY,
      ).length,
    start,
  );
  expect(stuck).toBe(0);
});
