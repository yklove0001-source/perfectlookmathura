import { test, expect } from "./fixtures";

test("before/after slider responds to keyboard", async ({ page }) => {
  await page.goto("/#transformations");
  const slider = page.getByRole("slider").first();
  await slider.focus();
  await page.keyboard.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "10");
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
});

test("before/after slider responds to dragging", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mouse drag on desktop");
  await page.goto("/#transformations");
  await page.waitForTimeout(2600); // let the intro hint finish
  const box = (await page.locator("#transformations [style*='--pos']").first().boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(page.getByRole("slider").first()).toHaveAttribute("aria-valuenow", "25");
});

test("FAQ opens one answer at a time", async ({ page }) => {
  await page.goto("/#faq");
  await page.waitForTimeout(1500);
  const items = page.locator("#faq details");
  await items.nth(3).locator("summary").click();
  await expect(items.nth(3)).toHaveAttribute("open", "");
  await expect(page.locator("#faq details[open]")).toHaveCount(1);
});

test("gallery filters and full-screen viewer (when photos exist)", async ({ page }) => {
  await page.goto("/#gallery");
  await page.waitForTimeout(1500);
  const photos = page.locator("#gallery ul button");
  test.skip((await photos.count()) === 0, "No gallery photos yet — placeholders only");

  await photos.first().click();
  const viewer = page.locator("dialog[open]");
  await expect(viewer).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});
