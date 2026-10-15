import { test, expect } from '@playwright/test';

test.describe('Dellics Education Consult - Student Portal & Registration Suite', () => {
  const CONSULT_URL = 'http://localhost:3003';

  test.beforeEach(async ({ page }) => {
    // Clear storage before each test for clean baseline
    await page.goto(CONSULT_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('1. Unauthenticated state displays Log in and Apply Now buttons', async ({ page }) => {
    await page.goto(CONSULT_URL);

    // Verify desktop header shows Log in and Apply Now
    const loginLink = page.locator('header').getByRole('link', { name: 'Log in' });
    const applyLink = page.locator('header').getByRole('link', { name: 'Apply Now' });

    await expect(loginLink.first()).toBeVisible();
    await expect(applyLink.first()).toBeVisible();

    // Verify Student Hub link is NOT visible when logged out
    const studentHub = page.locator('header').getByRole('link', { name: 'Student Hub' });
    await expect(studentHub).not.toBeVisible();
  });

  test('2. Authentication state toggles header immediately to Hi, Sam and Student Hub', async ({ page }) => {
    // Simulate login via localStorage
    await page.goto(`${CONSULT_URL}/login`);
    await page.fill('#login-email', 'samgotnothingonme@gmail.com');
    await page.fill('#login-password', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect to onboarding or portal
    await page.waitForURL(/.*portal.*/);

    // Verify header now shows "Student Hub" and user greeting
    await expect(page.locator('header').getByText('Hi, Sam')).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: 'Student Hub' })).toBeVisible();

    // Crucially verify "Log in" and "Apply Now" buttons are no longer present
    const loginLink = page.locator('header').getByRole('link', { name: 'Log in' });
    const applyLink = page.locator('header').getByRole('link', { name: 'Apply Now' });
    await expect(loginLink).not.toBeVisible();
    await expect(applyLink).not.toBeVisible();
  });

  test('3. 6-Step Registration Form with School Autocomplete & 6-digit Code Verification', async ({ page }) => {
    await page.goto(`${CONSULT_URL}/portal/onboarding`);

    // Step 1: General Information
    await expect(page.getByRole('heading', { name: /1\. General Information/ })).toBeVisible();
    await page.fill('input[placeholder="e.g. Samuel"]', 'Sam');
    await page.fill('input[placeholder="e.g. Mensah"]', 'Nothing');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2: Educational Background & School Autocomplete
    await expect(page.getByRole('heading', { name: /2\. Educational Background/ })).toBeVisible();
    
    // Type in the school autocomplete input
    const schoolInput = page.getByPlaceholder(/Start typing school name/);
    await schoolInput.fill('Achimota');
    
    // Autocomplete dropdown should appear
    const schoolOption = page.getByRole('button', { name: /Achimota School/ });
    await expect(schoolOption).toBeVisible();
    await schoolOption.click();

    // Verify selected address displays
    await expect(page.getByText(/Achimota Forest Rd/)).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: Personal Information
    await expect(page.getByRole('heading', { name: /3\. Personal Information/ })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 4: Study Abroad Preferences
    await expect(page.getByRole('heading', { name: /4\. Study Abroad Preferences/ })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 5: Stay Connected & Parent/Guardian
    await expect(page.getByRole('heading', { name: /5\. Stay Connected/ })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 6: Additional Information, Review & Verification
    await expect(page.getByRole('heading', { name: /6\. Additional Information/ })).toBeVisible();
    await expect(page.getByText('Confirm Your Information')).toBeVisible();

    // Click "Didn't get the email? (Click to simulate code: 729148)"
    await page.getByText(/Didn't get the email/).click();

    // Code input fields should be populated with 729148
    await page.getByRole('button', { name: 'Verify Code' }).click();
    await expect(page.getByText('Code Verified!')).toBeVisible();

    // Submit registration form
    await page.getByRole('button', { name: 'Submit Registration' }).click();

    // Verify Animated Success Screen
    await expect(page.getByText('Account Created Successfully!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Proceed to Student Portal' })).toBeVisible();

    // Click Proceed to Student Portal
    await page.getByRole('button', { name: 'Proceed to Student Portal' }).click();
    await page.waitForURL(`${CONSULT_URL}/portal`);
  });

  test('4. Student Portal Hero, College Board Links, and BigFuture Search', async ({ page }) => {
    // Seed logged-in user
    await page.goto(CONSULT_URL);
    await page.evaluate(() => {
      localStorage.setItem('dellics_user_email', 'samgotnothingonme@gmail.com');
      localStorage.setItem('dellics_user_name', 'Sam Nothing');
    });

    await page.goto(`${CONSULT_URL}/portal`);

    // Verify Hero
    await expect(page.getByRole('heading', { name: 'Hi, Sam' })).toBeVisible();
    await expect(page.getByText('We’re here to guide you on the road to college and beyond.')).toBeVisible();

    // Verify Announcement cards
    await expect(page.getByText('Register by 10/23 for the November SAT')).toBeVisible();
    await expect(page.getByText('The AP shaped by leading companies. Meet AP Cybersecurity.')).toBeVisible();
    await expect(page.getByText('Your Free SAT Study Plan is Ready to Download')).toBeVisible();

    // Verify BigFuture Search Banner
    await expect(page.getByText('Find your dream college for you.')).toBeVisible();

    // Test Navigation: My SAT Hub
    await page.getByRole('link', { name: /My SAT/ }).first().click();
    await page.waitForURL(`${CONSULT_URL}/portal/sat`);
    await expect(page.getByRole('heading', { name: 'Hello, Sam' })).toBeVisible();
    await expect(page.getByText('Got a Code?')).toBeVisible();
    await expect(page.getByText('My Upcoming Tests')).toBeVisible();

    // Test Navigation: SAT Question of the Day
    await page.goto(`${CONSULT_URL}/portal`);
    await page.getByRole('link', { name: 'SAT Question of the Day' }).first().click();
    await page.waitForURL(`${CONSULT_URL}/portal/sat/question-of-the-day`);
    await expect(page.getByRole('heading', { name: 'Question of the Day' })).toBeVisible();
    await expect(page.getByText(/SELECT A SUBJECT TO CONTINUE/)).toBeVisible();
    await expect(page.getByText('Your Streak Calendar')).toBeVisible();

    // Test interactive answer selection in Question of the Day
    await page.getByRole('button', { name: /Physical ability to hold or contain/ }).click();
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(page.getByText(/Correct! Great Job!/)).toBeVisible();

    // Test Navigation: BigFuture Dashboard
    await page.goto(`${CONSULT_URL}/portal`);
    await page.getByRole('link', { name: /BigFuture Dashboard/ }).first().click();
    await page.waitForURL(`${CONSULT_URL}/portal/bigfuture`);
    await expect(page.getByRole('heading', { name: 'Find the Right College For you' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Do Now' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Do Later' })).toBeVisible();

    // Test Navigation: Student Search Service
    await page.goto(`${CONSULT_URL}/portal`);
    await page.getByRole('link', { name: 'Student Search Service' }).click();
    await page.waitForURL(`${CONSULT_URL}/portal/student-search`);
    await expect(page.getByText('Help Colleges Find You')).toBeVisible();
    await page.getByRole('button', { name: 'Yes, definitely!' }).click();
    await expect(page.getByText('Your preference has been saved!')).toBeVisible();

    // Test Navigation: Account Settings & Profile
    await page.goto(`${CONSULT_URL}/portal`);
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.waitForURL(`${CONSULT_URL}/portal/profile`);
    await expect(page.getByRole('heading', { name: 'Sam Nothing' })).toBeVisible();
    await expect(page.getByText('Class of 2028')).toBeVisible();
    await expect(page.getByText('Personal Information')).toBeVisible();
    await expect(page.getByText('Security and Password')).toBeVisible();
    await expect(page.getByText('Dellics Education Consult ID')).toBeVisible();

    // Test Navigation: Scores
    await page.goto(`${CONSULT_URL}/portal`);
    await page.getByRole('link', { name: /PSAT\/NMSQT, PSAT 10/ }).click();
    await page.waitForURL(`${CONSULT_URL}/portal/scores`);
    await expect(page.getByRole('heading', { name: /PSAT\/NMSQT/ })).toBeVisible();

    // Test Navigation: AP Classroom
    await page.goto(`${CONSULT_URL}/portal`);
    await page.getByRole('link', { name: 'My AP Classroom' }).click();
    await page.waitForURL(`${CONSULT_URL}/portal/ap-classroom`);
    await expect(page.getByRole('heading', { name: 'My AP Classroom' })).toBeVisible();
    await expect(page.getByText(/AP Cybersecurity/)).toBeVisible();
  });

  test('5. Mobile responsiveness & menu drawer toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(CONSULT_URL);

    // Open mobile menu
    const menuBtn = page.getByRole('button', { name: 'Toggle menu' });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Check mobile drawer shows links
    await expect(page.locator('nav').getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: 'Apply Now' })).toBeVisible();
  });

  test('6. Homepage Hero Banner Slider displays 3 official Dellics banners in slide view', async ({ page }) => {
    await page.goto(CONSULT_URL);

    // Verify Carousel Region exists
    const carousel = page.getByRole('region', { name: 'Dellics Education Consult Featured Highlights' });
    await expect(carousel).toBeVisible();

    // Check first slide image is present
    const firstSlideImg = carousel.locator('img[src*="5940703325818917439_121.jpg"]');
    await expect(firstSlideImg).toBeVisible();

    // Check slide counter shows 01 / 03
    await expect(carousel.getByText('01 / 03')).toBeVisible();

    // Click Next button to advance to SAT slide
    const nextBtn = carousel.getByRole('button', { name: 'Next slide' });
    await nextBtn.click();

    // Check second slide image and counter 02 / 03
    const secondSlideImg = carousel.locator('img[src*="5940703325818917438_121.jpg"]');
    await expect(secondSlideImg).toBeVisible();
    await expect(carousel.getByText('02 / 03')).toBeVisible();

    // Click Next button to advance to Dream University slide
    await nextBtn.click();
    const thirdSlideImg = carousel.locator('img[src*="5940703325818917440_121.jpg"]');
    await expect(thirdSlideImg).toBeVisible();
    await expect(carousel.getByText('03 / 03')).toBeVisible();

    // Click Previous button to go back
    const prevBtn = carousel.getByRole('button', { name: 'Previous slide' });
    await prevBtn.click();
    await expect(carousel.getByText('02 / 03')).toBeVisible();
  });
});
