// Test End-to-End Fonctionnel
// Vérifie les flux principaux de l'application e-commerce

const TEST_CONFIG = {
  FRONTEND_URL: 'http://localhost:3002',
  BACKEND_URL: 'http://localhost:5001',
  TIMEOUT: 10000
};

class E2ETestSuite {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
  }

  async runTest(testName, testFunction) {
    this.totalTests++;
    console.log(`\n🧪 Test: ${testName}`);
    
    try {
      const startTime = Date.now();
      await testFunction();
      const duration = Date.now() - startTime;
      
      this.passedTests++;
      this.testResults.push({
        name: testName,
        status: 'PASS',
        duration: `${duration}ms`
      });
      console.log(`   ✅ PASS (${duration}ms)`);
    } catch (error) {
      this.testResults.push({
        name: testName,
        status: 'FAIL',
        error: error.message
      });
      console.log(`   ❌ FAIL: ${error.message}`);
    }
  }

  async testFrontendLoad() {
    const response = await fetch(TEST_CONFIG.FRONTEND_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(TEST_CONFIG.TIMEOUT)
    });
    
    if (!response.ok) {
      throw new Error(`Frontend HTTP ${response.status}`);
    }
    
    const content = await response.text();
    if (!content.includes('<!DOCTYPE html>') && !content.includes('<html')) {
      throw new Error('Réponse frontend invalide');
    }
  }

  async testBackendHealth() {
    const response = await fetch(`${TEST_CONFIG.BACKEND_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(TEST_CONFIG.TIMEOUT)
    });
    
    if (!response.ok) {
      throw new Error(`Backend HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.message || !data.environment) {
      throw new Error('Réponse backend health invalide');
    }
  }

  async testBackendRootRoute() {
    const response = await fetch(`${TEST_CONFIG.BACKEND_URL}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(TEST_CONFIG.TIMEOUT)
    });
    
    if (!response.ok) {
      throw new Error(`Backend root HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.message || !data.status) {
      throw new Error('Réponse backend root invalide');
    }
  }

  async testProductsAPI() {
    const response = await fetch(`${TEST_CONFIG.BACKEND_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(TEST_CONFIG.TIMEOUT)
    });
    
    if (!response.ok) {
      throw new Error(`Products API HTTP ${response.status}`);
    }
    
    const data = await response.json();
    // L'API retourne un objet avec products array, pas directement un array
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Réponse products API invalide - doit contenir un array products');
    }
    
    console.log(`     📦 ${data.products.length} produits trouvés`);
  }

  async testAuthEndpoints() {
    // Test registration endpoint structure
    const regResponse = await fetch(`${TEST_CONFIG.BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Données invalides intentionnelles pour tester la validation
        email: 'test-invalid',
        password: '123'
      }),
      signal: AbortSignal.timeout(TEST_CONFIG.TIMEOUT)
    });
    
    // On s'attend à une erreur de validation (400-499), pas une erreur serveur (500+)
    if (regResponse.status >= 500) {
      throw new Error(`Erreur serveur sur endpoint auth/register: ${regResponse.status}`);
    }
    
    // Vérifier que l'erreur de validation est bien structurée
    if (regResponse.status >= 400 && regResponse.status < 500) {
      try {
        const errorData = await regResponse.json();
        if (!errorData.message && !errorData.error) {
          throw new Error('Réponse d\'erreur mal structurée');
        }
      } catch (e) {
        if (e.message !== 'Réponse d\'erreur mal structurée') {
          throw new Error('Réponse d\'erreur non-JSON valide');
        }
        throw e;
      }
    }
    
    console.log(`     🔐 Endpoint auth/register répond correctement (${regResponse.status})`);
  }

  async testCategoriesAPI() {
    const response = await fetch(`${TEST_CONFIG.BACKEND_URL}/api/categories`, {
      method: 'GET',
      signal: AbortSignal.timeout(TEST_CONFIG.TIMEOUT)
    });
    
    if (!response.ok) {
      throw new Error(`Categories API HTTP ${response.status}`);
    }
    
    const data = await response.json();
    // L'API retourne un objet avec categories array, pas directement un array
    if (!data.categories || !Array.isArray(data.categories)) {
      throw new Error('Réponse categories API invalide - doit contenir un array categories');
    }
    
    console.log(`     📁 ${data.categories.length} catégories trouvées`);
  }

  async testCORSHeaders() {
    const response = await fetch(`${TEST_CONFIG.BACKEND_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(TEST_CONFIG.TIMEOUT)
    });
    
    // En mode développement, CORS peut être configuré différemment
    // Vérifier plusieurs headers CORS possibles
    const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
    const corsCredentials = response.headers.get('Access-Control-Allow-Credentials');
    const corsMethods = response.headers.get('Access-Control-Allow-Methods');
    
    if (!corsOrigin && !corsCredentials && !corsMethods) {
      throw new Error('Aucun header CORS détecté');
    }
    
    console.log(`     🌐 CORS configuré: Origin=${corsOrigin || 'default'}, Credentials=${corsCredentials || 'default'}`);
  }

  async runAllTests() {
    console.log('🚀 Démarrage des tests E2E fonctionnels...\n');
    
    await this.runTest('Frontend - Chargement de la page', () => this.testFrontendLoad());
    await this.runTest('Backend - Health check', () => this.testBackendHealth());
    await this.runTest('Backend - Route racine', () => this.testBackendRootRoute());
    await this.runTest('API - Endpoints produits', () => this.testProductsAPI());
    await this.runTest('API - Endpoints authentification', () => this.testAuthEndpoints());
    await this.runTest('API - Endpoints catégories', () => this.testCategoriesAPI());
    await this.runTest('Backend - Headers CORS', () => this.testCORSHeaders());
    
    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DES TESTS E2E');
    console.log('='.repeat(60));
    
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      const duration = result.duration || 'N/A';
      const error = result.error ? ` - ${result.error}` : '';
      console.log(`${status} ${result.name} (${duration})${error}`);
    });
    
    console.log('\n' + '-'.repeat(60));
    console.log(`📈 Résultats: ${this.passedTests}/${this.totalTests} tests réussis`);
    
    if (this.passedTests === this.totalTests) {
      console.log('🎉 TOUS LES TESTS PASSENT ! Application fonctionnelle.');
    } else {
      console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    }
    
    console.log(`📊 Taux de réussite: ${Math.round((this.passedTests/this.totalTests)*100)}%`);
  }
}

// Exécution automatique si ce fichier est lancé directement
if (typeof window === 'undefined') {
  const testSuite = new E2ETestSuite();
  testSuite.runAllTests().catch(console.error);
}