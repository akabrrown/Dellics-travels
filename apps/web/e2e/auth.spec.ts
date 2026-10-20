import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("signin page validates empty inputs and shows required error", async ({ page }) => {
    await page.goto("/signin");

    // Verify form elements exist
    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    const submitBtn = page.getByRole("button", { name: /sign in|continue|log in/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Attempt submission with empty fields
    await submitBtn.click();

    // Verify error banner is displayed
    const errorAlert = page.locator(".text-red-400, .bg-red-500\\/10, [role='alert'], p").filter({
      hasText: /provide both email|required|valid/i,
    });
    await expect(errorAlert.first()).toBeVisible();
  });

  test("signup page validates password mismatch and terms acceptance", async ({ page }) => {
    await page.goto("/signup");

    const fullNameInput = page.locator("input[type='text']").first();
    const emailInput = page.locator("input[type='email']");
    const passwordInputs = page.locator("input[type='password']");
    const submitBtn = page.getByRole("button", { name: /create account|sign up/i });

    await expect(fullNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();

    // Fill mismatched passwords
    await fullNameInput.fill("Test Traveler");
    await emailInput.fill("traveler@example.com");
    await passwordInputs.nth(0).fill("Password123!");
    await passwordInputs.nth(1).fill("MismatchPassword999!");

    await submitBtn.click();

    // Expect password mismatch error or terms error
    const errorAlert = page.locator(".text-red-400, .bg-red-500\\/10, [role='alert'], p").filter({
      hasText: /passwords do not match|terms|required/i,
    });
    await expect(errorAlert.first()).toBeVisible();
  });
});
