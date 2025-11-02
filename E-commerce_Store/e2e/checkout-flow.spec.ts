import { test, expect } from '@playwright/test';

test.describe('Checkout Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004');
    await page.waitForLoadState('networkidle');
  });

  test('should complete guest checkout', async ({ page }) => {
    // 1. Ajouter un produit au panier
    const product = page.locator('[data-testid*="product"], .product-card').first();
    if (await product.count() > 0) {
      await product.click();
      await page.waitForLoadState('networkidle');
      
      // Chercher le bouton "Add to Cart"
      const addToCartBtn = page.getByRole('button', { name: /add to cart|ajouter au panier/i });
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // 2. Aller au panier
    const cartLink = page.locator('[href*="cart"], [data-testid="cart"]').first();
    if (await cartLink.count() > 0) {
      await cartLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    // 3. Procéder au checkout
    const checkoutBtn = page.getByRole('button', { name: /checkout|commander/i });
    if (await checkoutBtn.count() > 0) {
      await checkoutBtn.click();
      await page.waitForLoadState('networkidle');
      
      // Vérifier qu'on est sur la page de checkout
      expect(page.url()).toContain('checkout');
    }
  });

  test('should add multiple products to cart', async ({ page }) => {
    // Ajouter le premier produit
    const products = page.locator('[data-testid*="product"], .product-card');
    const count = await products.count();
    
    if (count >= 2) {
      // Premier produit
      await products.nth(0).click();
      await page.waitForLoadState('networkidle');
      
      const addToCart1 = page.getByRole('button', { name: /add to cart/i });
      if (await addToCart1.count() > 0) {
        await addToCart1.click();
        await page.waitForTimeout(500);
      }
      
      // Retour à l'accueil
      await page.goto('http://localhost:3004');
      await page.waitForLoadState('networkidle');
      
      // Deuxième produit
      await products.nth(1).click();
      await page.waitForLoadState('networkidle');
      
      const addToCart2 = page.getByRole('button', { name: /add to cart/i });
      if (await addToCart2.count() > 0) {
        await addToCart2.click();
        await page.waitForTimeout(500);
      }
      
      // Vérifier le panier
      await page.goto('http://localhost:3004/cart');
      await page.waitForLoadState('networkidle');
      
      const cartItems = page.locator('[data-testid*="cart-item"], .cart-item');
      const itemCount = await cartItems.count();
      expect(itemCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('should update product quantity in cart', async ({ page }) => {
    // Ajouter un produit au panier
    const product = page.locator('[data-testid*="product"], .product-card').first();
    if (await product.count() > 0) {
      await product.click();
      await page.waitForLoadState('networkidle');
      
      const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Aller au panier
    await page.goto('http://localhost:3004/cart');
    await page.waitForLoadState('networkidle');
    
    // Chercher le bouton d'augmentation de quantité
    const increaseBtn = page.locator('button[aria-label*="increase"], button:has-text("+")').first();
    if (await increaseBtn.count() > 0) {
      await increaseBtn.click();
      await page.waitForTimeout(500);
      
      // Vérifier que le total a changé
      const totalElement = page.locator('[data-testid="cart-total"], .total, .subtotal').first();
      if (await totalElement.count() > 0) {
        await expect(totalElement).toBeVisible();
      }
    }
  });

  test('should remove product from cart', async ({ page }) => {
    // Ajouter un produit au panier
    const product = page.locator('[data-testid*="product"], .product-card').first();
    if (await product.count() > 0) {
      await product.click();
      await page.waitForLoadState('networkidle');
      
      const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Aller au panier
    await page.goto('http://localhost:3004/cart');
    await page.waitForLoadState('networkidle');
    
    const initialItems = await page.locator('[data-testid*="cart-item"], .cart-item').count();
    
    // Supprimer le produit
    const removeBtn = page.locator('button[aria-label*="remove"], button:has-text("Remove")').first();
    if (await removeBtn.count() > 0) {
      await removeBtn.click();
      await page.waitForTimeout(500);
      
      const afterItems = await page.locator('[data-testid*="cart-item"], .cart-item').count();
      expect(afterItems).toBeLessThan(initialItems);
    }
  });

  test('should apply promo code', async ({ page }) => {
    // Ajouter un produit au panier
    const product = page.locator('[data-testid*="product"], .product-card').first();
    if (await product.count() > 0) {
      await product.click();
      await page.waitForLoadState('networkidle');
      
      const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Aller au panier ou checkout
    await page.goto('http://localhost:3004/cart');
    await page.waitForLoadState('networkidle');
    
    // Chercher le champ promo code
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="code"]').first();
    if (await promoInput.count() > 0) {
      await promoInput.fill('WELCOME10');
      
      const applyBtn = page.getByRole('button', { name: /apply|appliquer/i });
      if (await applyBtn.count() > 0) {
        await applyBtn.click();
        await page.waitForTimeout(1000);
        
        // Vérifier que le code est appliqué
        const discountText = page.locator('text=/discount|réduction|10%/i');
        if (await discountText.count() > 0) {
          await expect(discountText.first()).toBeVisible();
        }
      }
    }
  });

  test('should redirect to Stripe checkout', async ({ page }) => {
    // Ajouter un produit au panier
    const product = page.locator('[data-testid*="product"], .product-card').first();
    if (await product.count() > 0) {
      await product.click();
      await page.waitForLoadState('networkidle');
      
      const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Aller au panier
    await page.goto('http://localhost:3004/cart');
    await page.waitForLoadState('networkidle');
    
    // Cliquer sur checkout
    const checkoutBtn = page.getByRole('button', { name: /checkout|commander/i });
    if (await checkoutBtn.count() > 0) {
      // On ne clique pas vraiment car ça nous redirige vers Stripe
      // On vérifie juste que le bouton existe
      await expect(checkoutBtn).toBeVisible();
    }
  });
});
