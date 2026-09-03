import { test, expect } from "@playwright/test";

test.describe("Admin Dispatch Portal", () => {
  test("displays administrative gateway with correct console destination", async ({ page }) => {
    await page.goto("/admin");

    // Verify restricted portal message
    const heading = page.locator("h1");
    await expect(heading).toContainText(/administrative portal|control|operations/i);

    // Verify console launch link
    const launchLink = page.getByRole("link", { name: /launch admin console/i });
    await expect(launchLink).toBeVisible();

    const href = await launchLink.getAttribute("href");
    expect(href).toMatch(/:3002|dellics-admin/i);
  });
});
