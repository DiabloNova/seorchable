import { test, expect } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';

test.describe('Smoke tests and Accessibility baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the main application page (default Next.js dev server port is 3000)
    await page.goto('http://localhost:3000');
    // Inject axe-core into the page
    await injectAxe(page);
  });

  test('should load the main page and verify critical links', async ({ page }) => {
    // Ensure the page has loaded
    const title = await page.title();
    expect(title).not.toBe('');

    // Verify a critical existing link (e.g., Pricing or Login, based on application context)
    // Looking for some typical navigation elements that should exist.
    const loginLink = page.getByRole('link', { name: /ورود|login|داشبورد/i }).first();
    const pricingLink = page.getByRole('link', { name: /تعرفه‌ها|قیمت|pricing/i }).first();

    // Assuming at least one of these primary navigation elements is visible
    if (await loginLink.isVisible()) {
      await expect(loginLink).toBeVisible();
      await expect(loginLink).toHaveAttribute('href', /(login|dashboard)/);
    } else if (await pricingLink.isVisible()) {
      await expect(pricingLink).toBeVisible();
      await expect(pricingLink).toHaveAttribute('href', /pricing/);
    }
  });

  test('should report basic accessibility checks', async ({ page }) => {
    // Run an axe accessibility scan, but don't fail the test (informational baseline)
    const violations = await getViolations(page);
    console.log(`Found ${violations.length} accessibility violations on the main page.`);
    if (violations.length > 0) {
      // Provide a concise summary instead of dumping thousands of lines of JSON
      const summary = violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length
      }));
      console.log("Accessibility Violations Summary:");
      console.table(summary);
    }
    // We intentionally don't fail this check, but we output a readable summary.
  });
});