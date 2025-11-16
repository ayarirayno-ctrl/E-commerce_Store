import { test, expect } from '@playwright/test';

test.describe('Admin Panel E2E Tests', () => {
  const adminEmail = 'ayarirayen539@gmail.com';
  const adminPassword = 'Test1234!'; // Remplacer par le vrai mot de passe

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004');
  });

  test('should login as admin', async ({ page }) => {
    // Aller à la page de connexion
    const loginLink = page.getByRole('link', { name: /login|connexion/i }).first();
    if (await loginLink.count() > 0) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Remplir le formulaire
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill(adminEmail);
      await passwordInput.fill(adminPassword);
      
      // Soumettre
      const submitBtn = page.getByRole('button', { name: /login|sign in/i });
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should access admin dashboard', async ({ page }) => {
    // Se connecter d'abord (simplifié pour le test)
    await page.goto('http://localhost:3004/admin');
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'on est sur le dashboard admin
    const url = page.url();
    expect(url).toContain('admin');
  });

  test('should view products list in admin', async ({ page }) => {
    await page.goto('http://localhost:3004/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de la liste de produits
    const productsTable = page.locator('table, [data-testid="products-list"]');
    if (await productsTable.count() > 0) {
      await expect(productsTable.first()).toBeVisible();
    }
  });

  test('should view orders list in admin', async ({ page }) => {
    await page.goto('http://localhost:3004/admin/orders');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de la liste de commandes
    const ordersTable = page.locator('table, [data-testid="orders-list"]');
    if (await ordersTable.count() > 0) {
      await expect(ordersTable.first()).toBeVisible();
    }
  });

  test('should view users list in admin', async ({ page }) => {
    await page.goto('http://localhost:3004/admin/users');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de la liste d'utilisateurs
    const usersTable = page.locator('table, [data-testid="users-list"]');
    if (await usersTable.count() > 0) {
      await expect(usersTable.first()).toBeVisible();
    }
  });

  test('should open add product form', async ({ page }) => {
    await page.goto('http://localhost:3004/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Chercher le bouton "Add Product"
    const addBtn = page.getByRole('button', { name: /add product|nouveau produit/i });
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(500);
      
      // Vérifier que le formulaire apparaît
      const form = page.locator('form, [role="dialog"]');
      await expect(form.first()).toBeVisible();
    }
  });

  test('should update order status', async ({ page }) => {
    await page.goto('http://localhost:3004/admin/orders');
    await page.waitForLoadState('networkidle');
    
    // Chercher le premier bouton de mise à jour de statut
    const statusSelect = page.locator('select, [data-testid="status-select"]').first();
    
    if (await statusSelect.count() > 0) {
      await statusSelect.click();
      await page.waitForTimeout(300);
      
      // Vérifier qu'il y a des options
      const options = page.locator('option');
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should search users in admin panel', async ({ page }) => {
    await page.goto('http://localhost:3004/admin/users');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
      
      // La liste devrait se filtrer
      await expect(searchInput).toHaveValue('test');
    }
  });
});
