import { test, expect } from '@playwright/test';

async function getHintedPairs(page) {
  const spans = page.locator('#inputOverlay span');
  const count = await spans.count();
  const pairs = [];

  for (let i = 0; i < count; i++) {
    const span = spans.nth(i);
    const classAttr = await span.getAttribute('class');

    if (classAttr && classAttr.includes('hint-digit')) {
      const text = await span.textContent();
      pairs.push({ position: i, digit: text });
    }
  }

  return pairs;
}

test.describe('Hinted positions remain correct after different actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const hintBtn = page.locator('#hintBtn');
    await hintBtn.click();
    await hintBtn.click();
  });

  test('stay correct when no action is taken', async ({ page }) => {
    const hintedBefore = await getHintedPairs(page);
    expect(hintedBefore.length).toBe(2);

    const hintedAfter = await getHintedPairs(page);
    expect(hintedAfter).toEqual(hintedBefore);
  });

  test('stay correct after pressing Escape', async ({ page }) => {
    const hintedBefore = await getHintedPairs(page);

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('11');
    await guessInput.press('Escape');

    const hintedAfter = await getHintedPairs(page);
    expect(hintedAfter).toEqual(hintedBefore);
  });

  test('stay correct after submitting with Enter', async ({ page }) => {
    const hintedBefore = await getHintedPairs(page);

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('11'); // fills the two remaining slots
    await guessInput.press('Enter');

    const hintedAfter = await getHintedPairs(page);
    expect(hintedAfter).toEqual(hintedBefore);
  });
});

test.describe('Hint mechanism', () => {
  test('clicking hint reveals exactly one colored digit in the overlay', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(0);

    await page.locator('#hintBtn').click();

    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(1);
  });

  test('hint persists across guesses within the same round', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#hintBtn').click();

    const hintSpan = page.locator('#inputOverlay .hint-digit');
    const hintDigit = await hintSpan.textContent();
    const hintIndex = await hintSpan.evaluate(
      (el) => Array.from(el.parentElement.children).indexOf(el)
    );

    const guessInput = page.locator('#guessInput');
    await guessInput.pressSequentially('111'); // fills the remaining 3 slots

    await page.locator('#submitBtn').click();

    const hintSpanAfter = page.locator('#inputOverlay .hint-digit');
    await expect(hintSpanAfter).toHaveCount(1);
    await expect(hintSpanAfter).toHaveText(hintDigit);

    const hintIndexAfter = await hintSpanAfter.evaluate(
      (el) => Array.from(el.parentElement.children).indexOf(el)
    );
    expect(hintIndexAfter).toBe(hintIndex);
  });

  test('hint button stops revealing new positions once all are hinted', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const hintBtn = page.locator('#hintBtn');
    for (let i = 0; i < 5; i++) {
      await hintBtn.click();
    }

    await expect(page.locator('#inputOverlay .hint-digit')).toHaveCount(4);
  });
});