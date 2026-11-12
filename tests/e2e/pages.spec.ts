import { test, expect, SERVICE_SLUGS } from "./fixtures";

const pages = ["/", ...SERVICE_SLUGS.map((s) => `/services/${s}`)];

for (const path of pages) {
  test(`${path} loads cleanly`, async ({ page, errors }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1:visible")).toHaveCount(1);
    await page.waitForTimeout(600);
    expect(errors).toEqual([]);
  });
}

test("page fits the screen width (no sideways scrolling or zoom-out)", async ({ page }) => {
  for (const path of ["/", "/services/hair-patch"]) {
    await page.goto(path);
    await page.waitForTimeout(500);
    const [layout, screen] = await page.evaluate(() => [innerWidth, Math.round(visualViewport!.width)]);
    expect(layout, `layout width on ${path}`).toBe(screen);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(screen);
  }
});

test("unknown pages show the branded 404 page", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /moved on/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
});
