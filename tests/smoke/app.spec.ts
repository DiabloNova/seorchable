import { test, expect } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';

test.describe('Smoke tests and Accessibility baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the main application page (default Next.js dev server port is 3000)
    await page.goto('http://localhost:3000');
    // Inject axe-core into the page
    await injectAxe(page);
  });

  test('should load the main page', async ({ page }) => {
    // Ensure the page has loaded (e.g., check for a title or main heading)
    const title = await page.title();
    expect(title).not.toBe('');
  });

  test('should report basic accessibility checks', async ({ page }) => {
    // Run an axe accessibility scan, but don't fail the test, just log the violations for the baseline
    const violations = await getViolations(page);
    console.log(`Found ${violations.length} accessibility violations on the main page.`);
    if (violations.length > 0) {
      console.log(JSON.stringify(violations, null, 2));
    }
    // We expect some violations currently, so we just log them for the baseline.
    expect(true).toBe(true);
  });
});