import { test, expect } from '@playwright/test';

test.describe('Keyboard shortcuts', () => {
  test('Enter submits the guess', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');
    await guessInput.press('Enter');

    await expect(page.locator('#result')).toContainText(/Bulls: \d, Cows: \d/);
  });

  test('Escape clears typed digits but keeps the hinted digit', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#hintBtn').click();

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('11'); // types into two of the remaining slots

    await guessInput.press('Escape');

    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(1);
    await expect(page.locator('#inputOverlay .placeholder-digit')).toHaveCount(3);
  });

  test('Ctrl+Enter restarts the game', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#historyBody tr')).toHaveCount(1);
    await expect(page.locator('#attemptsCount')).toContainText('1');

    await page.keyboard.press('Control+Enter');

    await expect(page.locator('#historyBody tr')).toHaveCount(0);
    await expect(page.locator('#attemptsCount')).toHaveText('');
  });

  test('letters and symbols are not entered into the guess field', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('ab!1');

    const overlayText = await page.locator('#inputOverlay span').allTextContents();
    expect(overlayText.join('')).toBe('1???');
  });
});

test.describe('Backspace behavior', () => {
  test('Backspace removes the last typed (non-hinted) digit', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('123');
    await guessInput.press('Backspace');

    const overlayText = await page.locator('#inputOverlay span').allTextContents();
    expect(overlayText.join('')).toBe('12??');
  });

  test('Backspace never removes a hinted digit, even after all typed digits are cleared', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#hintBtn').click();

    const hintSpan = page.locator('#inputOverlay .hint-digit');
    const hintDigit = await hintSpan.textContent();

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('111'); // fills the remaining 3 slots

    // Press Backspace 4 times - only 3 typed digits exist, so the 4th press is a no-op
    for (let i = 0; i < 4; i++) {
      await guessInput.press('Backspace');
    }

    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(1);
    await expect(page.locator('#inputOverlay .hint-digit')).toHaveText(hintDigit);
    await expect(page.locator('#inputOverlay .placeholder-digit')).toHaveCount(3);
  });
});