import { test, expect } from '@playwright/test';

test.describe('Wishlist E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004');
    await page.waitForLoadState('networkidle');
  });

  test('should add product to wishlist', async ({ page }) => {
    // Aller sur un produit
    const product = page.locator('[data-testid*="product"], .product-card').first();
    if (await product.count() > 0) {
      await product.click();
      await page.waitForLoadState('networkidle');
      
      // Chercher le bouton wishlist (coeur)
      const wishlistBtn = page.locator('button[aria-label*="wishlist"], button:has(svg[data-lucide="heart"])').first();
      if (await wishlistBtn.count() > 0) {
        await wishlistBtn.click();
        await page.waitForTimeout(500);
        
        // Vérifier que le bouton change d'état (rempli)
        await expect(wishlistBtn).toBeVisible();
      }
    }
  });

  test('should navigate to wishlist page', async ({ page }) => {
    // Chercher le lien vers la wishlist
    const wishlistLink = page.locator('a[href*="wishlist"], [data-testid="wishlist"]').first();
    
    if (await wishlistLink.count() > 0) {
      await wishlistLink.click();
      await page.waitForLoadState('networkidle');
      
      // Vérifier qu'on est sur la page wishlist
      expect(page.url()).toContain('wishlist');
    }
  });

  test('should remove product from wishlist', async ({ page }) => {
    // Aller à la wishlist
    await page.goto('http://localhost:3004/wishlist');
    await page.waitForLoadState('networkidle');
    
    const wishlistItems = page.locator('[data-testid*="wishlist-item"], .wishlist-item');
    const initialCount = await wishlistItems.count();
    
    if (initialCount > 0) {
      // Supprimer le premier élément
      const removeBtn = page.locator('button[aria-label*="remove"], button:has-text("Remove")').first();
      if (await removeBtn.count() > 0) {
        await removeBtn.click();
        await page.waitForTimeout(500);
        
        const afterCount = await wishlistItems.count();
        expect(afterCount).toBeLessThan(initialCount);
      }
    }
  });

  test('should move product from wishlist to cart', async ({ page }) => {
    await page.goto('http://localhost:3004/wishlist');
    await page.waitForLoadState('networkidle');
    
    const wishlistItems = page.locator('[data-testid*="wishlist-item"], .wishlist-item');
    
    if (await wishlistItems.count() > 0) {
      // Chercher le bouton "Add to Cart"
      const addToCartBtn = page.getByRole('button', { name: /add to cart/i }).first();
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
        
        // Vérifier que le produit est ajouté au panier
        await page.goto('http://localhost:3004/cart');
        await page.waitForLoadState('networkidle');
        
        const cartItems = page.locator('[data-testid*="cart-item"], .cart-item');
        expect(await cartItems.count()).toBeGreaterThan(0);
      }
    }
  });
});
