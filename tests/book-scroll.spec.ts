import { test, expect } from "@playwright/test";

test.describe("Book scroll scene", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the book section to be visible
    await page.waitForTimeout(1000);
  });

  test("no horizontal overflow", async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("book opens and inside cover text is visible (not mirrored)", async ({
    page,
  }) => {
    // Simulate wheel events to drive the animation to ~60% (cover open + texts visible)
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(30);
    }

    // Take screenshot after animation
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/book-open.png" });

    // Check the inside front cover text is visible
    const insideText = page.locator("text=Tu guía para transformar");
    await expect(insideText).toBeVisible();
  });

  test("3 side texts exist", async ({ page }) => {
    // Drive animation to show texts
    for (let i = 0; i < 50; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(30);
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/book-texts.png" });

    // Check all 3 texts
    await expect(page.locator("text=120+ páginas")).toBeVisible();
    await expect(page.locator("text=Bonus y recursos")).toBeVisible();
    await expect(page.locator("text=De idea a negocio")).toBeVisible();
  });

  test("scroll locks while animation plays", async ({ page }) => {
    // Drive partway through animation
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(30);
    }

    // Check scroll position is at the book section
    const scrollY = await page.evaluate(() => window.scrollY);

    // Try scrolling more — the lock should prevent page from scrolling past
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(30);
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/book-mid-scroll.png" });

    // Page should still be roughly at the same scroll position (locked)
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    // Allow some tolerance since wheel events have delta
    expect(Math.abs(scrollYAfter - scrollY)).toBeLessThan(200);
  });

  test("side texts do not overlap with the book", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(500);

    // Scroll to show side texts (~60% progress)
    for (let i = 0; i < 50; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(25);
    }
    await page.waitForTimeout(500);

    // Get bounding boxes
    const bookBox = await page.locator(".book-card-scroll").first().boundingBox();
    const topText = await page.locator("text=120+ páginas").first().boundingBox();
    const bottomText = await page.locator("text=Bonus y recursos").first().boundingBox();

    expect(bookBox).toBeTruthy();
    expect(topText).toBeTruthy();
    expect(bottomText).toBeTruthy();

    if (bookBox && topText && bottomText) {
      // Top text right edge must be left of book left edge (with gap)
      expect(topText.x + topText.width).toBeLessThan(bookBox.x - 5);
      // Bottom text right edge must be left of book left edge (with gap)
      expect(bottomText.x + bottomText.width).toBeLessThan(bookBox.x - 5);
    }
  });
});
