import { test, expect } from '@playwright/test';

test.describe('Restart button', () => {
  test('resets the attempts counter', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#attemptsCount')).toContainText('1');

    await page.locator('#restartBtn').click();

    await expect(page.locator('#attemptsCount')).toHaveText('');
  });

  test('resets any revealed hints', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#hintBtn').click();
    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(1);

    await page.locator('#restartBtn').click();

    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(0);
    await expect(page.locator('#inputOverlay .placeholder-digit')).toHaveCount(4);
  });
});

test.describe('Switching mode mid-game', () => {
  test('checking Advanced mode resets history and attempts', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#historyBody tr')).toHaveCount(1);
    await expect(page.locator('#attemptsCount')).toContainText('1');

    await page.locator('#advancedToggle').check();

    await expect(page.locator('#historyBody tr')).toHaveCount(0);
    await expect(page.locator('#attemptsCount')).toHaveText('');
  });

  test('unchecking Advanced mode also resets the round', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#advancedToggle').check();

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#historyBody tr')).toHaveCount(1);

    await page.locator('#advancedToggle').uncheck();

    await expect(page.locator('#historyBody tr')).toHaveCount(0);
  });

  test('switching mode clears any revealed hints', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#hintBtn').click();
    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(1);

    await page.locator('#advancedToggle').check();

    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(0);
  });
});