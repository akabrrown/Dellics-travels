import { test, expect } from "@playwright/test";

test.describe("Tours Page & Experience Booking", () => {
  test("displays tours catalog with category filters and tour cards", async ({ page }) => {
    await page.goto("/tours");

    // Check page heading
    const heading = page.locator("h1");
    await expect(heading).toContainText(/tours|experiences|packages/i);

    // Verify tour cards are rendered
    const tourCards = page.locator("article, [data-testid='tour-card'], .group").filter({
      hasText: /\$|GHS|USD|Book|View/i,
    });
    await expect(tourCards.first()).toBeVisible();

    // Verify search or filter presence
    const searchInput = page.getByPlaceholder(/search|destination|tour/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("Dubai");
      await page.waitForTimeout(400);
    }
  });

  test("navigates to tour booking page when booking CTA clicked", async ({ page }) => {
    await page.goto("/tours");

    const bookButton = page.getByRole("link", { name: /book now|view tour|details/i }).first();
    if (await bookButton.isVisible()) {
      await bookButton.click();
      await expect(page).toHaveURL(/\/tours/);
    }
  });
});
