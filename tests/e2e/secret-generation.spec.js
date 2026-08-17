import { test, expect } from '@playwright/test';

test('beginner mode can generate secret numbers with repeated digits', async ({ page }) => {
  test.setTimeout(60000);

  const secretNumbers = [];

  for (let i = 0; i < 15; i++) {
    await page.goto('http://127.0.0.1:5500'); // beginner mode is unchecked by default

    const hintBtn = page.locator('#hintBtn');
    for (let j = 0; j < 4; j++) {
      await hintBtn.click();
    }

    const overlaySpans = page.locator('#inputOverlay span');
    const digits = await overlaySpans.allTextContents();
    secretNumbers.push(digits.join(''));
  }

  const hasAtLeastOneRepeat = secretNumbers.some(
    (num) => new Set(num).size !== num.length
  );

  expect(hasAtLeastOneRepeat).toBe(true);
});