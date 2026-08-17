import { test, expect } from '@playwright/test';

test.describe('Controlled bulls/cows outcomes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__TEST_MODE__ = true;
    });
    await page.goto('http://127.0.0.1:5500');
    await page.evaluate(() => {
      window.__testHooks.gameState.secretNumber = '1234';
    });
  });

  test('4 bulls shows a win message', async ({ page }) => {
    await page.locator('#guessInput').pressSequentially('1234');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText('🎉');
    await expect(page.locator('#result')).toContainText('You won in 1 attempts!');
  });

  test('1 bull and 3 cows shows the correct count', async ({ page }) => {
    await page.locator('#guessInput').pressSequentially('1342'); // 1 stays, 4/3/2 rotated
    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText('Bulls: 1, Cows: 3');
  });

  test('0 bulls and 4 cows shows the correct count', async ({ page }) => {
    await page.locator('#guessInput').pressSequentially('4123'); // full rotation
    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText('Bulls: 0, Cows: 4');
  });

  test('0 bulls and 0 cows shows the correct count', async ({ page }) => {
    await page.locator('#guessInput').pressSequentially('5678'); // none of these digits exist in 1234
    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText('Bulls: 0, Cows: 0');
  });
});