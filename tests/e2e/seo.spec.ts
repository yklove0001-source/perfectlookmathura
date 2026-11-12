import { test, expect, SERVICE_SLUGS } from "./fixtures";

test.describe("SEO", () => {
  test.skip(({ isMobile }) => isMobile, "Same HTML on every device — check once");

  test("homepage has title, description, canonical, share image and structured data", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Hair Patch & Hair Wig in Mathura/);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc!.length).toBeGreaterThan(70);
    expect(desc!.length).toBeLessThanOrEqual(165);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((b) => JSON.parse(b)["@graph"].map((n: { "@type": unknown }) => JSON.stringify(n["@type"])));
    expect(types.join()).toContain("HairSalon");
    expect(types.join()).toContain("FAQPage");
    expect(blocks.join()).toContain("+919058028729");
  });

  test("every service page has its own title, canonical and Service data", async ({ page }) => {
    for (const slug of SERVICE_SLUGS) {
      await page.goto(`/services/${slug}`);
      await expect(page).toHaveTitle(/in Mathura \| Perfect Look Hair Wig House/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/services/${slug}$`));
      const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join();
      expect(ld).toContain('"Service"');
      expect(ld).toContain('"BreadcrumbList"');
    }
  });

  test("robots.txt, sitemap, manifest, icons and share images are served", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Sitemap:");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const slug of SERVICE_SLUGS) expect(sitemap).toContain(`/services/${slug}`);
    for (const url of ["/manifest.webmanifest", "/favicon.ico", "/icons/icon-512.png", "/apple-icon.png", "/opengraph-image", "/services/hair-wig/opengraph-image"]) {
      expect((await request.get(url)).status(), url).toBe(200);
    }
  });

  test("all images have alt text and there is one h1 per page", async ({ page }) => {
    await page.goto("/");
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
    await expect(page.locator("h1:visible")).toHaveCount(1);
  });
});
