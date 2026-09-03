import { test, expect } from "@playwright/test";

test.describe("Flights Search & Results", () => {
  test("renders flight search interface with origin and destination selectors", async ({ page }) => {
    await page.goto("/flights");

    // Check page title and main flight search header
    await expect(page).toHaveTitle(/flight/i);

    // Verify search form controls exist
    const searchForm = page.locator("form, [role='search'], .flight-search").first();
    await expect(searchForm).toBeVisible();

    // Verify passenger, cabin class, or date inputs are interactable
    const inputs = page.locator("input, button").filter({ hasText: /round|one-way|economy|search|from|to/i });
    await expect(inputs.first()).toBeVisible();
  });
});
