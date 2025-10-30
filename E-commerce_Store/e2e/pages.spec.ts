import { test, expect } from '@playwright/test';

test('about page loads', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveURL(/\/about/);
});

test('categories page loads', async ({ page }) => {
  await page.goto('/categories');
  await expect(page).toHaveURL(/\/categories/);
});

test('header visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
});
