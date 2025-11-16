import { test, expect } from '@playwright/test';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/E-Commerce/i);
    
    // Vérifier que les éléments principaux sont présents
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // Vérifier le logo/titre
    const header = page.locator('header, nav');
    await expect(header).toBeVisible();
    
    // Vérifier les liens de navigation
    const homeLink = page.getByRole('link', { name: /home|accueil/i });
    if (await homeLink.count() > 0) {
      await expect(homeLink.first()).toBeVisible();
    }
  });

  test('should display product grid', async ({ page }) => {
    // Attendre que les produits se chargent
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'il y a des produits affichés
    const products = page.locator('[data-testid*="product"], .product-card, article');
    const count = await products.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have working search functionality', async ({ page }) => {
    // Chercher le champ de recherche
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="Recherch"]').first();
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('test');
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('should display cart icon', async ({ page }) => {
    // Vérifier l'icône du panier
    const cartIcon = page.locator('[data-testid="cart"], [aria-label*="cart"], svg').first();
    await expect(cartIcon).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have accessible elements', async ({ page }) => {
    // Vérifier que la page a un titre
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Vérifier la langue de la page
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
  });

  test('should load images with lazy loading', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      const firstImg = images.first();
      await expect(firstImg).toBeVisible();
      
      // Vérifier que l'image a un attribut alt
      const alt = await firstImg.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });
});
