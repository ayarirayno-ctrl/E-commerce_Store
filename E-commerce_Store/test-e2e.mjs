/**
 * Script de test E2E automatisé - Backend E-commerce
 * Teste: Sécurité → Inscription → Connexion → Panier → Commande → Annulation
 */

const API_BASE = 'http://localhost:5000/api';
let testToken = '';
let testUser = null;
let testOrder = null;

// Fonction utilitaire pour les requêtes HTTP
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(testToken && { 'Authorization': `Bearer ${testToken}` }),
                ...options.headers
            }
        });

        const requestId = response.headers.get('x-request-id');
        const data = await response.json().catch(() => null);

        return {
            ok: response.ok,
            status: response.status,
            data,
            requestId,
            headers: Object.fromEntries(response.headers.entries())
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message
        };
    }
}

// Test 1: Headers de sécurité Helmet
async function testSecurityHeaders() {
    console.log('\n🔒 Test 1: Headers de sécurité Helmet...');
    
    const result = await apiRequest('/health');
    
    if (!result.ok) {
        console.log('❌ Échec:', result.error);
        return false;
    }

    const securityHeaders = {
        'X-Content-Type-Options': result.headers['x-content-type-options'],
        'X-Frame-Options': result.headers['x-frame-options'],
        'X-DNS-Prefetch-Control': result.headers['x-dns-prefetch-control'],
        'Strict-Transport-Security': result.headers['strict-transport-security']
    };

    const hasHelmetHeaders = securityHeaders['X-Content-Type-Options'] === 'nosniff';
    
    console.log('  Headers Helmet:', JSON.stringify(securityHeaders, null, 2));
    console.log(hasHelmetHeaders ? '  ✅ Headers de sécurité présents' : '  ❌ Headers manquants');
    
    return hasHelmetHeaders;
}

// Test 2: X-Request-Id unique
async function testRequestId() {
    console.log('\n🆔 Test 2: X-Request-Id unique...');
    
    const requestIds = new Set();
    
    for (let i = 0; i < 5; i++) {
        const result = await apiRequest('/health');
        if (result.requestId) {
            requestIds.add(result.requestId);
        }
    }

    const allUnique = requestIds.size === 5;
    console.log(`  Requêtes: 5, Request IDs uniques: ${requestIds.size}`);
    console.log(allUnique ? '  ✅ Tous les Request ID sont uniques' : '  ❌ Doublons détectés');
    
    return allUnique;
}

// Test 3: Schéma d'erreur standardisé
async function testErrorSchema() {
    console.log('\n⚠️  Test 3: Schéma d\'erreur standardisé...');
    
    const result = await apiRequest('/nonexistent-endpoint-test');
    
    if (!result.data) {
        console.log('  ❌ Aucune donnée dans la réponse');
        return false;
    }

    const hasStandardSchema = 
        result.data.hasOwnProperty('status') &&
        result.data.hasOwnProperty('statusCode') &&
        result.data.hasOwnProperty('code') &&
        result.data.hasOwnProperty('message') &&
        result.data.hasOwnProperty('requestId');

    console.log('  Schéma erreur:', JSON.stringify(result.data, null, 2));
    console.log(hasStandardSchema ? '  ✅ Schéma d\'erreur standardisé' : '  ❌ Schéma non conforme');
    
    return hasStandardSchema;
}

// Test 4: Inscription utilisateur
async function testUserRegistration() {
    console.log('\n👤 Test 4: Inscription utilisateur...');
    
    const timestamp = Date.now();
    testUser = {
        name: `Test User ${timestamp}`,
        email: `test_${timestamp}@example.com`,
        password: 'Test123!@#'
    };

    const result = await apiRequest('/client-auth/register', {
        method: 'POST',
        body: JSON.stringify(testUser)
    });

    if (result.ok && result.data.client && result.data.token) {
        testToken = result.data.token;
        console.log('  User:', result.data.client.name);
        console.log('  Email:', result.data.client.email);
        console.log('  Token:', testToken.substring(0, 20) + '...');
        console.log('  RequestId:', result.requestId);
        console.log('  ✅ Inscription réussie');
        return true;
    } else {
        console.log('  ❌ Échec:', result.data?.message || result.error);
        console.log('  Debug:', JSON.stringify(result.data, null, 2));
        return false;
    }
}

// Test 5: Connexion utilisateur
async function testUserLogin() {
    console.log('\n🔑 Test 5: Connexion utilisateur...');
    
    if (!testUser) {
        console.log('  ❌ Utilisateur non créé');
        return false;
    }

    const result = await apiRequest('/client-auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: testUser.email,
            password: testUser.password
        })
    });

    if (result.ok && result.data.client && result.data.token) {
        testToken = result.data.token;
        console.log('  User:', result.data.client.name);
        console.log('  Token:', testToken.substring(0, 20) + '...');
        console.log('  RequestId:', result.requestId);
        console.log('  ✅ Connexion réussie');
        return true;
    } else {
        console.log('  ❌ Échec:', result.data?.message || result.error);
        console.log('  Debug:', JSON.stringify(result.data, null, 2));
        return false;
    }
}

// Test 6: Ajout au panier
async function testAddToCart() {
    console.log('\n🛒 Test 6: Ajout au panier...');
    
    if (!testToken) {
        console.log('  ❌ Non connecté');
        return false;
    }

    // Récupérer un produit
    const productsResult = await apiRequest('/products?limit=1');
    
    if (!productsResult.ok || !productsResult.data.products || productsResult.data.products.length === 0) {
        console.log('  ❌ Aucun produit disponible');
        return false;
    }

    const product = productsResult.data.products[0];
    console.log('  Produit:', product.name);

    // Ajouter au panier
    const result = await apiRequest('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
            productId: product._id,
            quantity: 2
        })
    });

    if (result.ok && result.data.cart) {
        console.log('  Items panier:', result.data.cart.items?.length || 0);
        console.log('  Total:', result.data.cart.total);
        console.log('  RequestId:', result.requestId);
        console.log('  ✅ Ajout au panier réussi');
        return true;
    } else {
        console.log('  ❌ Échec:', result.data?.message || result.error);
        return false;
    }
}

// Test 7: Création de commande
async function testCreateOrder() {
    console.log('\n📦 Test 7: Création de commande...');
    
    if (!testToken) {
        console.log('  ❌ Non connecté');
        return false;
    }

    const result = await apiRequest('/client-orders', {
        method: 'POST',
        body: JSON.stringify({
            shippingAddress: {
                street: '123 Test Street',
                city: 'Test City',
                state: 'Test State',
                zipCode: '12345',
                country: 'Test Country'
            },
            paymentMethod: 'credit_card'
        })
    });

    if (result.ok && result.data.order) {
        testOrder = result.data.order;
        console.log('  Order Number:', testOrder.orderNumber);
        console.log('  Status:', testOrder.status);
        console.log('  Total:', testOrder.total);
        console.log('  RequestId:', result.requestId);
        console.log('  ✅ Commande créée');
        return true;
    } else {
        console.log('  ❌ Échec:', result.data?.message || result.error);
        console.log('  Debug Response:', JSON.stringify(result.data, null, 2));
        console.log('  Status:', result.status);
        return false;
    }
}

// Test 8: Annulation de commande
async function testCancelOrder() {
    console.log('\n❌ Test 8: Annulation de commande...');
    
    if (!testToken || !testOrder) {
        console.log('  ❌ Commande non créée');
        console.log('  Debug testOrder:', testOrder);
        return false;
    }

    console.log('  Order ID:', testOrder.id);
    
    const result = await apiRequest(`/client-orders/${testOrder.id}/cancel`, {
        method: 'PUT'
    });

    if (result.ok && result.data.order) {
        console.log('  Order Number:', result.data.order.orderNumber);
        console.log('  Nouveau statut:', result.data.order.status || result.data.order.orderStatus);
        console.log('  RequestId:', result.requestId);
        console.log('  ✅ Commande annulée');
        return true;
    } else {
        console.log('  ❌ Échec:', result.data?.message || result.error);
        console.log('  Debug Response:', JSON.stringify(result.data, null, 2));
        console.log('  Status:', result.status);
        return false;
    }
}

// Exécution complète
async function runAllTests() {
    console.log('═══════════════════════════════════════════════');
    console.log('🧪 TESTS E2E BACKEND E-COMMERCE');
    console.log('═══════════════════════════════════════════════');
    console.log('Backend:', API_BASE);

    const results = {
        total: 8,
        passed: 0,
        failed: 0
    };

    const tests = [
        testSecurityHeaders,
        testRequestId,
        testErrorSchema,
        testUserRegistration,
        testUserLogin,
        testAddToCart,
        testCreateOrder,
        testCancelOrder
    ];

    for (const test of tests) {
        try {
            const success = await test();
            if (success) results.passed++;
            else results.failed++;
        } catch (error) {
            console.log('  ❌ Erreur inattendue:', error.message);
            results.failed++;
        }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 RÉSULTATS FINAUX');
    console.log('═══════════════════════════════════════════════');
    console.log(`Total tests: ${results.total}`);
    console.log(`✅ Réussis: ${results.passed}`);
    console.log(`❌ Échoués: ${results.failed}`);
    console.log(`Taux de réussite: ${(results.passed / results.total * 100).toFixed(1)}%`);
    console.log('═══════════════════════════════════════════════\n');

    return results;
}

// Lancement
runAllTests().catch(console.error);
