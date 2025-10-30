// Script de test end-to-end automatisé
// À exécuter dans la console DevTools du navigateur sur http://localhost:3011

const E2E_TEST = {
    baseURL: 'http://localhost:5000/api',
    results: [],
    
    log(step, status, details) {
        const result = { step, status, details, timestamp: new Date().toISOString() };
        this.results.push(result);
        console.log(`%c${status === 'SUCCESS' ? '✅' : status === 'ERROR' ? '❌' : '⏳'} ${step}`, 
            `color: ${status === 'SUCCESS' ? 'green' : status === 'ERROR' ? 'red' : 'blue'}; font-weight: bold`);
        if (details) console.log(details);
        return result;
    },

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async testSecurityHeaders() {
        this.log('Test 1: Headers de sécurité Helmet', 'RUNNING');
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                credentials: 'include'
            });
            
            const headers = {
                'X-Content-Type-Options': response.headers.get('x-content-type-options'),
                'X-Frame-Options': response.headers.get('x-frame-options'),
                'Strict-Transport-Security': response.headers.get('strict-transport-security'),
                'X-Request-Id': response.headers.get('x-request-id')
            };

            const hasSecurityHeaders = headers['X-Content-Type-Options'] && headers['X-Frame-Options'];
            
            return this.log('Test 1: Headers de sécurité Helmet', 
                hasSecurityHeaders ? 'SUCCESS' : 'ERROR', 
                { headers, hasSecurityHeaders });
        } catch (error) {
            return this.log('Test 1: Headers de sécurité Helmet', 'ERROR', error.message);
        }
    },

    async testRequestId() {
        this.log('Test 2: X-Request-Id unique', 'RUNNING');
        try {
            const requestIds = new Set();
            for (let i = 0; i < 5; i++) {
                const response = await fetch(`${this.baseURL}/health`);
                const requestId = response.headers.get('x-request-id');
                requestIds.add(requestId);
            }
            
            const allUnique = requestIds.size === 5;
            return this.log('Test 2: X-Request-Id unique', 
                allUnique ? 'SUCCESS' : 'ERROR',
                { requestIds: Array.from(requestIds), allUnique });
        } catch (error) {
            return this.log('Test 2: X-Request-Id unique', 'ERROR', error.message);
        }
    },

    async testErrorSchema() {
        this.log('Test 3: Schéma d\'erreur standardisé', 'RUNNING');
        try {
            const response = await fetch(`${this.baseURL}/nonexistent-test-endpoint`);
            const data = await response.json();
            const requestId = response.headers.get('x-request-id');
            
            const hasStandardSchema = 
                data.hasOwnProperty('status') &&
                data.hasOwnProperty('statusCode') &&
                data.hasOwnProperty('code') &&
                data.hasOwnProperty('message') &&
                data.hasOwnProperty('requestId');

            return this.log('Test 3: Schéma d\'erreur standardisé', 
                hasStandardSchema ? 'SUCCESS' : 'ERROR',
                { response: data, requestId, hasStandardSchema });
        } catch (error) {
            return this.log('Test 3: Schéma d\'erreur standardisé', 'ERROR', error.message);
        }
    },

    async testUserRegistration() {
        this.log('Test 4: Inscription utilisateur', 'RUNNING');
        try {
            const timestamp = Date.now();
            const testUser = {
                username: `testuser_${timestamp}`,
                email: `test_${timestamp}@example.com`,
                password: 'Test123!@#',
                firstName: 'Test',
                lastName: 'User'
            };

            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(testUser)
            });

            const data = await response.json();
            const requestId = response.headers.get('x-request-id');

            if (response.ok && data.user && data.token) {
                this.testUser = testUser;
                this.testToken = data.token;
                return this.log('Test 4: Inscription utilisateur', 'SUCCESS', 
                    { user: data.user, requestId, hasToken: !!data.token });
            } else {
                return this.log('Test 4: Inscription utilisateur', 'ERROR', 
                    { response: data, status: response.status, requestId });
            }
        } catch (error) {
            return this.log('Test 4: Inscription utilisateur', 'ERROR', error.message);
        }
    },

    async testUserLogin() {
        this.log('Test 5: Connexion utilisateur', 'RUNNING');
        try {
            if (!this.testUser) {
                return this.log('Test 5: Connexion utilisateur', 'ERROR', 
                    'Utilisateur de test non créé - exécutez testUserRegistration() d\'abord');
            }

            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: this.testUser.email,
                    password: this.testUser.password
                })
            });

            const data = await response.json();
            const requestId = response.headers.get('x-request-id');

            if (response.ok && data.user && data.token) {
                this.testToken = data.token;
                return this.log('Test 5: Connexion utilisateur', 'SUCCESS', 
                    { user: data.user, requestId, hasToken: !!data.token });
            } else {
                return this.log('Test 5: Connexion utilisateur', 'ERROR', 
                    { response: data, status: response.status, requestId });
            }
        } catch (error) {
            return this.log('Test 5: Connexion utilisateur', 'ERROR', error.message);
        }
    },

    async testAddToCart() {
        this.log('Test 6: Ajout au panier', 'RUNNING');
        try {
            if (!this.testToken) {
                return this.log('Test 6: Ajout au panier', 'ERROR', 
                    'Token non disponible - connectez-vous d\'abord');
            }

            // Récupérer un produit
            const productsResponse = await fetch(`${this.baseURL}/products?limit=1`);
            const productsData = await productsResponse.json();
            
            if (!productsData.products || productsData.products.length === 0) {
                return this.log('Test 6: Ajout au panier', 'ERROR', 'Aucun produit disponible');
            }

            const product = productsData.products[0];

            // Ajouter au panier
            const response = await fetch(`${this.baseURL}/cart/add`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.testToken}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId: product._id,
                    quantity: 2
                })
            });

            const data = await response.json();
            const requestId = response.headers.get('x-request-id');

            if (response.ok && data.cart) {
                this.testCart = data.cart;
                return this.log('Test 6: Ajout au panier', 'SUCCESS', 
                    { cart: data.cart, product: product.name, requestId });
            } else {
                return this.log('Test 6: Ajout au panier', 'ERROR', 
                    { response: data, status: response.status, requestId });
            }
        } catch (error) {
            return this.log('Test 6: Ajout au panier', 'ERROR', error.message);
        }
    },

    async testCreateOrder() {
        this.log('Test 7: Création commande', 'RUNNING');
        try {
            if (!this.testToken) {
                return this.log('Test 7: Création commande', 'ERROR', 
                    'Token non disponible - connectez-vous d\'abord');
            }

            const response = await fetch(`${this.baseURL}/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.testToken}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    shippingAddress: {
                        street: '123 Test Street',
                        city: 'Test City',
                        state: 'Test State',
                        zipCode: '12345',
                        country: 'Test Country'
                    },
                    paymentMethod: 'card'
                })
            });

            const data = await response.json();
            const requestId = response.headers.get('x-request-id');

            if (response.ok && data.order) {
                this.testOrder = data.order;
                return this.log('Test 7: Création commande', 'SUCCESS', 
                    { order: data.order, orderNumber: data.order.orderNumber, requestId });
            } else {
                return this.log('Test 7: Création commande', 'ERROR', 
                    { response: data, status: response.status, requestId });
            }
        } catch (error) {
            return this.log('Test 7: Création commande', 'ERROR', error.message);
        }
    },

    async testCancelOrder() {
        this.log('Test 8: Annulation commande', 'RUNNING');
        try {
            if (!this.testToken || !this.testOrder) {
                return this.log('Test 8: Annulation commande', 'ERROR', 
                    'Commande non créée - créez une commande d\'abord');
            }

            const response = await fetch(`${this.baseURL}/orders/${this.testOrder._id}/cancel`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${this.testToken}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            const requestId = response.headers.get('x-request-id');

            if (response.ok && data.order) {
                return this.log('Test 8: Annulation commande', 'SUCCESS', 
                    { order: data.order, status: data.order.status, requestId });
            } else {
                return this.log('Test 8: Annulation commande', 'ERROR', 
                    { response: data, status: response.status, requestId });
            }
        } catch (error) {
            return this.log('Test 8: Annulation commande', 'ERROR', error.message);
        }
    },

    async runFullTest() {
        console.log('%c🧪 DÉBUT DES TESTS E2E COMPLETS', 'font-size: 20px; font-weight: bold; color: blue');
        console.log('Backend:', this.baseURL);
        console.log('---\n');

        await this.testSecurityHeaders();
        await this.sleep(500);
        
        await this.testRequestId();
        await this.sleep(500);
        
        await this.testErrorSchema();
        await this.sleep(500);
        
        await this.testUserRegistration();
        await this.sleep(1000);
        
        await this.testUserLogin();
        await this.sleep(1000);
        
        await this.testAddToCart();
        await this.sleep(1000);
        
        await this.testCreateOrder();
        await this.sleep(1000);
        
        await this.testCancelOrder();
        
        console.log('\n---');
        console.log('%c✅ TESTS E2E TERMINÉS', 'font-size: 20px; font-weight: bold; color: green');
        
        const summary = {
            total: this.results.length,
            success: this.results.filter(r => r.status === 'SUCCESS').length,
            errors: this.results.filter(r => r.status === 'ERROR').length,
            results: this.results
        };
        
        console.log('\n📊 RÉSUMÉ:');
        console.table({
            'Total': summary.total,
            'Succès': summary.success,
            'Erreurs': summary.errors,
            'Taux de réussite': `${(summary.success / summary.total * 100).toFixed(1)}%`
        });
        
        return summary;
    }
};

// Instructions d'utilisation
console.log('%c📋 TESTS E2E - INSTRUCTIONS', 'font-size: 16px; font-weight: bold; color: purple');
console.log('1. Assurez-vous que le backend (port 5000) et frontend (port 3011) sont démarrés');
console.log('2. Exécutez: await E2E_TEST.runFullTest()');
console.log('3. Ou tests individuels: await E2E_TEST.testUserRegistration()');
console.log('\n✨ Prêt pour les tests!');
