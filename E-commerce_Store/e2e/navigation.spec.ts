import { test, expect } from '@playwright/test';

test('footer visible on home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('navigation to categories works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /categories/i }).first().click();
  await expect(page).toHaveURL(/\/categories/);
});

test('contact page accessible', async ({ page }) => {
  await page.goto('/contact');
  await expect(page).toHaveURL(/\/contact/);
});
