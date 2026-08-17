import { test, expect } from '@playwright/test';

test.describe('Side panels', () => {
  test('history panel toggles visibility', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const historyPanel = page.locator('#historyPanel');
    await expect(historyPanel).toBeHidden();

    await page.locator('#historyToggle').check();
    await expect(historyPanel).toBeVisible();

    await page.locator('#historyToggle').uncheck();
    await expect(historyPanel).toBeHidden();
  });

  test('help panel toggles visibility', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    const helpPanel = page.locator('#helpPanel');
    await expect(helpPanel).toBeHidden();

    await page.locator('#helpToggle').check();
    await expect(helpPanel).toBeVisible();

    await page.locator('#helpToggle').uncheck();
    await expect(helpPanel).toBeHidden();
  });

  test('history and help panels can be open at the same time', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500');

    await page.locator('#historyToggle').check();
    await page.locator('#helpToggle').check();

    await expect(page.locator('#historyPanel')).toBeVisible();
    await expect(page.locator('#helpPanel')).toBeVisible();
  });
});