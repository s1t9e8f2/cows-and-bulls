import { test, expect } from '@playwright/test';

test.describe('Scoring UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Enable test mode before page scripts execute
    await page.addInitScript(() => {
      window.__TEST_MODE__ = true;
    });

    await page.goto('http://127.0.0.1:5500');

    // Force a fixed secret number for deterministic testing
    await page.evaluate(() => {
      window.__testHooks.gameState.secretNumber = '1234';
    });
  });

  test('displays calculated score in win message', async ({ page }) => {
    await page.locator('#guessInput').pressSequentially('1234');
    await page.locator('#submitBtn').click();

    // Verify that score details appear in the result paragraph
    await expect(page.locator('#result')).toContainText('Score:');
    await expect(page.locator('#result')).toContainText('pts');
  });
});