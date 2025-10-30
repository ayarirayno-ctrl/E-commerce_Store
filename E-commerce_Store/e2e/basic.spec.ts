import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Modern Store/i);
});

test('products page loads', async ({ page }) => {
  await page.goto('/products');
  await expect(page).toHaveURL(/\/products/);
});

test('cart page loads', async ({ page }) => {
  await page.goto('/cart');
  await expect(page).toHaveURL(/\/cart/);
});
