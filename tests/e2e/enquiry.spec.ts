import { test, expect } from "./fixtures";
import { buildEnquiryMessage, normalizeIndianMobile, validateEnquiry, type Enquiry } from "../../src/lib/enquiry";

const valid: Enquiry = {
  name: "Rahul Sharma",
  phone: "98765 43210",
  service: "Hair Patch",
  date: "2030-01-15",
  time: "Evening",
  message: "Thinning at the crown",
};

test.describe("enquiry logic", () => {
  test.skip(({ isMobile }) => isMobile, "Pure logic — run once");

  test("Indian mobile numbers are normalised or rejected", () => {
    expect(normalizeIndianMobile("9876543210")).toBe("+91 98765 43210");
    expect(normalizeIndianMobile("+91 98765-43210")).toBe("+91 98765 43210");
    expect(normalizeIndianMobile("098765 43210")).toBe("+91 98765 43210");
    expect(normalizeIndianMobile("5876543210")).toBeNull();
    expect(normalizeIndianMobile("12345")).toBeNull();
  });

  test("validation catches missing and invalid fields", () => {
    expect(validateEnquiry(valid, "2026-01-01")).toEqual({});
    const e = validateEnquiry({ ...valid, name: "", phone: "123", service: "", date: "2020-01-01" }, "2026-01-01");
    expect(Object.keys(e).sort()).toEqual(["date", "name", "phone", "service"]);
  });

  test("WhatsApp message is clear and complete", () => {
    const m = buildEnquiryMessage(valid);
    expect(m).toContain("Name: Rahul Sharma");
    expect(m).toContain("Phone: +91 98765 43210");
    expect(m).toContain("Service: Hair Patch");
    expect(m).toContain("Preferred date: 15 Jan 2030 (evening)");
    expect(m).toContain("Message: Thinning at the crown");
  });
});

test("enquiry form validates, then opens WhatsApp with the message", async ({ page, errors }) => {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((u: string) => {
      (window as unknown as { __opened: string[] }).__opened.push(u);
      return null;
    }) as typeof window.open;
  });
  await page.goto("/#book");
  const form = page.locator("#book form");
  const submit = form.getByRole("button", { name: /Send enquiry/ });

  await submit.click();
  await expect(form.getByRole("alert")).toHaveCount(3);
  await expect(form.locator("input[name=name]")).toBeFocused();
  expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);

  await form.getByLabel("Your name").fill("Rahul Sharma");
  await form.getByLabel("Mobile number").fill("98765 43210");
  await form.getByLabel("Service").selectOption("Hair Wig");
  await submit.click();

  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);
  expect(opened[0]).toMatch(/^https:\/\/wa\.me\/919058028729\?text=/);
  expect(decodeURIComponent(opened[0])).toContain("Service: Hair Wig");
  await expect(page.getByRole("status")).toContainText("tap Send");
  expect(errors).toEqual([]);
});

test("call, WhatsApp and directions links are correct", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator('a[href="tel:+919058028729"]').count()).toBeGreaterThan(1);
  expect(await page.locator('a[href^="https://wa.me/919058028729"]').count()).toBeGreaterThan(1);
  await expect(page.locator('a[href^="https://www.google.com/maps/dir/"]').first()).toBeAttached();
  await expect(page.locator("#contact iframe")).toHaveAttribute("loading", "lazy");
});
