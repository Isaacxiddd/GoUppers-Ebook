import { test, expect } from "@playwright/test";

test.describe("Book scroll — mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(1000);
  });

  test("no horizontal overflow", async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("scroll opens book fully", async ({ page }) => {
    // Native scroll: ~300vh of travel until the book is fully open
    for (let i = 0; i < 55; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(25);
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/mobile-open.png" });

    const status = await page.evaluate(() =>
      document.querySelector("[data-book]")?.getAttribute("data-book")
    );
    expect(status).toBe("open");
  });

  test("scroll back closes book", async ({ page }) => {
    // Open
    for (let i = 0; i < 55; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(25);
    }
    await page.waitForTimeout(500);

    const openStatus = await page.evaluate(() =>
      document.querySelector("[data-book]")?.getAttribute("data-book")
    );
    expect(openStatus).toBe("open");

    // Close — scroll up enough to reach p < 0.02
    for (let i = 0; i < 60; i++) {
      await page.mouse.wheel(0, -120);
      await page.waitForTimeout(25);
    }
    await page.waitForTimeout(800);
    await page.screenshot({ path: "tests/screenshots/mobile-closed.png" });

    const closedStatus = await page.evaluate(() =>
      document.querySelector("[data-book]")?.getAttribute("data-book")
    );
    expect(closedStatus).toBe("closed");
  });

  test("scroll drives the animation natively", async ({ page }) => {
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(25);
    }

    const status = await page.evaluate(() =>
      document.querySelector("[data-book]")?.getAttribute("data-book")
    );
    expect(status).toBe("opening");

    // Native scroll: the page actually moves instead of locking
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Keep scrolling → the animation follows the scroll to fully open
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(25);
    }
    const openedStatus = await page.evaluate(() =>
      document.querySelector("[data-book]")?.getAttribute("data-book")
    );
    expect(openedStatus).toBe("open");
  });
});
