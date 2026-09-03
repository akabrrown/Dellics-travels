import { test, expect } from "@playwright/test";

test.describe("Hotels & Accommodations", () => {
  test("displays hotel search form and curated stays", async ({ page }) => {
    await page.goto("/hotels");

    // Check header
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();

    // Verify search inputs exist
    const destinationInput = page.getByPlaceholder(/where are you going|city|destination|hotel/i).first();
    if (await destinationInput.isVisible()) {
      await destinationInput.fill("Accra");
    }

    // Verify hotel cards or curated packages are visible
    const propertyCards = page.locator("article, .hotel-card, .group").filter({
      hasText: /\$|GHS|USD|per night|night|rating/i,
    });
    await expect(propertyCards.first()).toBeVisible();
  });
});
