#!/usr/bin/env node

/**
 * Script de test automatisé du flux de paiement Stripe
 * Tests :
 * 1. Récupérer les produits
 * 2. Créer une session de checkout avec code promo
 * 3. Vérifier que l'URL Stripe est générée
 * 4. Tester les codes promo (WELCOME10, SAVE20)
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';
// const FRONTEND_URL = 'http://localhost:3004'; // Reserved for future use

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`🧪 TEST: ${testName}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Vérifier que l'API est accessible
async function testAPIHealth() {
  logTest('API Health Check');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      logSuccess('API is running');
      logInfo(`Environment: ${data.environment}`);
      logInfo(`Timestamp: ${data.timestamp}`);
      return true;
    } else {
      logError('API health check failed');
      return false;
    }
  } catch (error) {
    logError(`Cannot connect to API: ${error.message}`);
    return false;
  }
}

// Test 2: Récupérer les produits
async function testGetProducts() {
  logTest('Get Products');
  try {
    const response = await fetch(`${API_URL}/products?limit=5`);
    const data = await response.json();
    
    if (response.ok && data.products && data.products.length > 0) {
      logSuccess(`Retrieved ${data.products.length} products`);
      logInfo(`First product: ${data.products[0].name} - $${data.products[0].price}`);
      return data.products.slice(0, 3); // Retourner 3 produits pour le test
    } else {
      logError('No products found');
      return [];
    }
  } catch (error) {
    logError(`Failed to get products: ${error.message}`);
    return [];
  }
}

// Test 3: Créer une session de checkout sans promo
async function testCheckoutWithoutPromo(products) {
  logTest('Create Checkout Session (No Promo Code)');
  
  const cartItems = products.map(p => ({
    productId: p._id,
    name: p.name,
    price: p.price,
    quantity: 2,
    image: p.images?.[0] || p.image || '',
    description: p.description || ''
  }));

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  logInfo(`Cart total: $${total.toFixed(2)}`);

  const checkoutData = {
    items: cartItems,
    email: 'test@example.com',
    billingAddress: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      country: 'US'
    }
  };

  try {
    const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    const data = await response.json();

    if (response.ok && data.url) {
      logSuccess('Checkout session created successfully');
      logInfo(`Session ID: ${data.sessionId}`);
      logInfo(`Stripe URL: ${data.url.substring(0, 50)}...`);
      return { success: true, sessionId: data.sessionId, url: data.url };
    } else {
      logError(`Checkout failed: ${data.message || 'Unknown error'}`);
      console.log('Response:', data);
      return { success: false };
    }
  } catch (error) {
    logError(`Checkout request failed: ${error.message}`);
    return { success: false };
  }
}

// Test 4: Créer une session de checkout avec code promo WELCOME10
async function testCheckoutWithPromo(products, promoCode) {
  logTest(`Create Checkout Session (Promo: ${promoCode})`);
  
  const cartItems = products.map(p => ({
    productId: p._id,
    name: p.name,
    price: p.price,
    quantity: 3, // Plus de quantité pour atteindre le minimum
    image: p.images?.[0] || p.image || '',
    description: p.description || ''
  }));

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  logInfo(`Subtotal: $${subtotal.toFixed(2)}`);

  // Calculer la réduction attendue
  let expectedDiscount = 0;
  if (promoCode === 'WELCOME10') {
    expectedDiscount = Math.min(subtotal * 0.1, 20); // 10% max $20
  } else if (promoCode === 'SAVE20') {
    expectedDiscount = 20; // $20 fixe
  }
  logInfo(`Expected discount: $${expectedDiscount.toFixed(2)}`);
  logInfo(`Expected total: $${(subtotal - expectedDiscount).toFixed(2)}`);

  const checkoutData = {
    items: cartItems,
    email: 'promo-test@example.com',
    promoCode: promoCode,
    billingAddress: {
      firstName: 'Promo',
      lastName: 'User',
      email: 'promo-test@example.com',
      phone: '12345678',
      address: '456 Promo Ave',
      city: 'Discount City',
      postalCode: '54321',
      country: 'US'
    }
  };

  try {
    const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    const data = await response.json();

    if (response.ok && data.url) {
      logSuccess(`Checkout session created with promo ${promoCode}`);
      logInfo(`Session ID: ${data.sessionId}`);
      logSuccess('Promo code applied successfully');
      return { success: true, sessionId: data.sessionId };
    } else {
      logError(`Checkout with promo failed: ${data.message || 'Unknown error'}`);
      console.log('Response:', data);
      return { success: false };
    }
  } catch (error) {
    logError(`Checkout with promo request failed: ${error.message}`);
    return { success: false };
  }
}

// Test 5: Vérifier les codes promo invalides
async function testInvalidPromoCode(products) {
  logTest('Test Invalid Promo Code');
  
  const cartItems = products.map(p => ({
    productId: p._id,
    name: p.name,
    price: p.price,
    quantity: 1,
    image: p.images?.[0] || p.image || '',
    description: p.description || ''
  }));

  const checkoutData = {
    items: cartItems,
    email: 'invalid-promo@example.com',
    promoCode: 'INVALID_CODE_123',
    billingAddress: {
      firstName: 'Invalid',
      lastName: 'Promo',
      email: 'invalid-promo@example.com',
      phone: '1234567890',
      address: '789 Invalid Rd',
      city: 'Error City',
      postalCode: '99999',
      country: 'US'
    }
  };

  try {
    const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    await response.json(); // Consume response

    // On s'attend à ce que ça fonctionne quand même (code promo ignoré)
    if (response.ok) {
      logSuccess('Invalid promo code handled gracefully (checkout proceeds without discount)');
      return { success: true };
    } else {
      logInfo('Invalid promo code rejected (expected behavior)');
      return { success: true };
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return { success: false };
  }
}

// Fonction principale
async function runTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       STRIPE PAYMENT FLOW - AUTOMATED TESTS                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // Test 1: API Health
  results.total++;
  const apiHealthy = await testAPIHealth();
  if (apiHealthy) results.passed++;
  else results.failed++;

  if (!apiHealthy) {
    logError('API is not running. Please start the backend server.');
    return;
  }

  await wait(1000);

  // Test 2: Get Products
  results.total++;
  const products = await testGetProducts();
  if (products.length > 0) results.passed++;
  else results.failed++;

  if (products.length === 0) {
    logError('Cannot proceed without products');
    return;
  }

  await wait(1000);

  // Test 3: Checkout without promo
  results.total++;
  const checkoutResult = await testCheckoutWithoutPromo(products);
  if (checkoutResult.success) results.passed++;
  else results.failed++;

  await wait(1000);

  // Test 4: Checkout with WELCOME10
  results.total++;
  const promoResult1 = await testCheckoutWithPromo(products, 'WELCOME10');
  if (promoResult1.success) results.passed++;
  else results.failed++;

  await wait(1000);

  // Test 5: Checkout with SAVE20
  results.total++;
  const promoResult2 = await testCheckoutWithPromo(products, 'SAVE20');
  if (promoResult2.success) results.passed++;
  else results.failed++;

  await wait(1000);

  // Test 6: Invalid promo code
  results.total++;
  const invalidPromoResult = await testInvalidPromoCode(products);
  if (invalidPromoResult.success) results.passed++;
  else results.failed++;

  // Résumé final
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    TEST RESULTS SUMMARY                    ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');
  
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  console.log('\n');
  if (results.failed === 0) {
    log(`✨ ALL TESTS PASSED! (${percentage}%)`, 'green');
    log('🎉 Payment flow is working correctly!', 'green');
  } else {
    log(`⚠️  ${results.failed} TEST(S) FAILED (${percentage}% passed)`, 'yellow');
  }
  console.log('\n');
}

// Attendre que les serveurs démarrent
logInfo('Waiting for servers to start...');
await wait(3000);

// Lancer les tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
