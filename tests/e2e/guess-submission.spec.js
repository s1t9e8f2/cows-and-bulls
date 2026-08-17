import { test, expect } from '@playwright/test';

test('player can make a guess and see bulls/cows result', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500');

  const guessInput = page.locator('#guessInput');
  await guessInput.pressSequentially('1234');

  await page.locator('#submitBtn').click();

  await expect(page.locator('#result')).toContainText(/Bulls: \d, Cows: \d/);
});

test.describe('Advanced mode validation', () => {
  test('rejects a guess with repeated digits', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#advancedToggle').check();

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1123');

    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText('Advanced mode requires unique digits!');
  });

  test('accepts a guess with unique digits', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#advancedToggle').check();

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');

    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText(/Bulls: \d, Cows: \d/);
  });
});