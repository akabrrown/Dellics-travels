import { test, expect } from "@playwright/test";

test.describe("eSIM Global Connectivity", () => {
  test("displays international eSIM data plans and destination selector", async ({ page }) => {
    await page.goto("/esim");

    // Check heading
    const heading = page.locator("h1");
    await expect(heading.first()).toContainText(/esim|connectivity|roaming|data/i);

    // Verify country selection or plan cards exist
    const planCards = page.locator("article, .plan-card, .border, button").filter({
      hasText: /GB|day|unlimited|\$|GHS/i,
    });
    await expect(planCards.first()).toBeVisible();
  });
});
