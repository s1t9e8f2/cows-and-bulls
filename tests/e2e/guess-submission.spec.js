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

test.describe('Input validation for short and invalid guesses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');
  });

  test('shows error message when submitting an empty input', async ({ page }) => {
    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText('Please enter 4 digits!');
  });

  test('shows error message when submitting fewer than 4 digits', async ({ page }) => {
    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('123');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#result')).toContainText('Please enter 4 digits!');
  });

  test('shows error message when submitting short guess using Enter key', async ({ page }) => {
    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('12');
    await guessInput.press('Enter');

    await expect(page.locator('#result')).toContainText('Please enter 4 digits!');
  });

  test('does not add invalid/short guesses to history', async ({ page }) => {
    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('123');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#historyBody tr')).toHaveCount(0);
  });

  test('does not increment attempts count on short guess', async ({ page }) => {
    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('1');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#attemptsCount')).toHaveText('');
  });
});