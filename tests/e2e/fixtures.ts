import { test as base, expect, type Page } from "@playwright/test";

/**
 * Shared setup for every test:
 * - skip the intro loader (it's tested separately)
 * - keep the 3D scene off (test machines have no GPU)
 * - never contact Google Maps from tests
 * - collect page errors so each test can assert there were none
 */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !/google|maps|favicon/i.test(m.text())) errors.push(m.text());
    });
    await provide(errors);
  },
  page: async ({ page }, provide) => {
    await page.addInitScript(() => {
      if (window.top !== window) return;
      try {
        localStorage.setItem("pl-intro", String(Date.now()));
      } catch {}
    });
    await page.route(/google\.com\/maps/, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<html></html>" }));
    await provide(page);
  },
});

export { expect };

/** Scroll the whole page in steps (like a finger or mouse wheel) so scroll-triggered content reveals. */
export async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(1800);
}

export const SERVICE_SLUGS = [
  "hair-patch",
  "hair-wig",
  "hair-fixing",
  "hair-weaving",
  "hair-replacement",
  "hair-care-products",
];
