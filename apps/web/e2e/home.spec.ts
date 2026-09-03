import { test, expect } from "@playwright/test";

test.describe("Home Page & Global Navigation", () => {
  test("renders home page with branding, hero and navigation elements", async ({ page }) => {
    await page.goto("/");

    // Verify document title
    await expect(page).toHaveTitle(/Dellics/i);

    // Verify main navigation links exist
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Check key nav links
    await expect(page.getByRole("link", { name: /flights/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /hotels/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /tours/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /esim/i }).first()).toBeVisible();

    // Verify Hero Section
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();

    // Verify search or CTA buttons
    const ctaButton = page.locator("a, button").filter({ hasText: /explore|book|search|discover|flights/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test("footer renders company info and legal links", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Check terms and privacy links
    const privacyLink = page.getByRole("link", { name: /privacy/i }).first();
    const termsLink = page.getByRole("link", { name: /terms/i }).first();

    await expect(privacyLink).toBeVisible();
    await expect(termsLink).toBeVisible();
  });
});
