import { test, expect } from '@playwright/test';

test.describe('Guess history', () => {
  test('a submitted guess appears as a row in history', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');
    await page.locator('#submitBtn').click();

    const row = page.locator('#historyBody tr');
    await expect(row).toHaveCount(1);

    const cells = row.locator('td');
    await expect(cells.nth(0)).toHaveText('1234');
    await expect(cells.nth(1)).toHaveText(/\dB \/ \dC/);
  });

  test('multiple guesses accumulate in order', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    const submitBtn = page.locator('#submitBtn');

    await guessInput.pressSequentially('1111');
    await submitBtn.click();

    await guessInput.pressSequentially('2222');
    await submitBtn.click();

    await guessInput.pressSequentially('3333');
    await submitBtn.click();

    const rows = page.locator('#historyBody tr');
    await expect(rows).toHaveCount(3);

    await expect(rows.nth(0).locator('td').nth(0)).toHaveText('1111');
    await expect(rows.nth(1).locator('td').nth(0)).toHaveText('2222');
    await expect(rows.nth(2).locator('td').nth(0)).toHaveText('3333');
  });

  test('restarting the game clears history', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1234');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#historyBody tr')).toHaveCount(1);

    await page.locator('#restartBtn').click();

    await expect(page.locator('#historyBody tr')).toHaveCount(0);
  });
});