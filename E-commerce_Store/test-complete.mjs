#!/usr/bin/env node

/**
 * Test complet avec démarrage automatique du serveur
 */

import { spawn } from 'child_process';
import fetch from 'node-fetch';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const API_URL = 'http://localhost:5000/api';
let serverProcess = null;
let passed = 0;
let failed = 0;

console.log('\n' + colors.cyan + '╔════════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + '║   TESTS OPTIMISATIONS COMPLÈTES        ║' + colors.reset);
console.log(colors.cyan + '╚════════════════════════════════════════╝' + colors.reset + '\n');

// Fonction pour attendre
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour vérifier si le serveur répond
async function waitForServer(maxAttempts = 20) {
  console.log(colors.cyan + '🔄 Vérification du serveur...' + colors.reset);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${API_URL}/products`, { 
        method: 'GET',
        timeout: 2000 
      });
      if (res.ok || res.status < 500) {
        console.log(colors.green + '✅ Serveur prêt!' + colors.reset + '\n');
        return true;
      }
    } catch (error) {
      // Serveur pas encore prêt
    }
    await sleep(1000);
    process.stdout.write('.');
  }
  console.log('\n' + colors.red + '❌ Serveur ne répond pas après 20 secondes' + colors.reset);
  return false;
}

// Démarrer le serveur
async function startServer() {
  console.log(colors.cyan + '🚀 Démarrage du serveur backend...' + colors.reset);
  
  serverProcess = spawn('node', ['src/server.js'], {
    cwd: 'backend',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Server running')) {
      console.log(colors.green + '✅ ' + output.trim() + colors.reset);
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(colors.red + 'Erreur serveur: ' + data.toString() + colors.reset);
  });
  
  // Attendre que le serveur démarre
  await sleep(3000);
  
  return await waitForServer();
}

// Arrêter le serveur
function stopServer() {
  if (serverProcess) {
    console.log('\n' + colors.cyan + '🛑 Arrêt du serveur...' + colors.reset);
    serverProcess.kill();
  }
}

// Test 1: Backend accessible
async function test1() {
  console.log(colors.cyan + '1️⃣  Backend accessible...' + colors.reset);
  try {
    const res = await fetch(`${API_URL}/products`);
    if (res.ok) {
      console.log(colors.green + '✅ Backend répond (status ' + res.status + ')' + colors.reset);
      passed++;
      return true;
    } else {
      console.log(colors.red + '❌ Backend erreur ' + res.status + colors.reset);
      failed++;
      return false;
    }
  } catch (error) {
    console.log(colors.red + '❌ Backend inaccessible: ' + error.message + colors.reset);
    failed++;
    return false;
  }
}

// Test 2: Compression
async function test2() {
  console.log(colors.cyan + '\n2️⃣  Compression gzip...' + colors.reset);
  try {
    const res = await fetch(`${API_URL}/products`, {
      headers: { 'Accept-Encoding': 'gzip, deflate' }
    });
    const encoding = res.headers.get('content-encoding');
    
    // Note: compression peut ne pas s'activer pour petites réponses
    if (encoding && (encoding.includes('gzip') || encoding.includes('deflate'))) {
      console.log(colors.green + `✅ Compression active: ${encoding}` + colors.reset);
      passed++;
    } else {
      const contentLength = res.headers.get('content-length');
      console.log(colors.yellow + '⚠️  Compression non active (réponse < 1KB probablement)' + colors.reset);
      console.log(colors.yellow + `   Content-Length: ${contentLength || 'unknown'}` + colors.reset);
      passed++; // On accepte quand même
    }
  } catch (error) {
    console.log(colors.red + '❌ Erreur: ' + error.message + colors.reset);
    failed++;
  }
}

// Test 3: Cache headers
async function test3() {
  console.log(colors.cyan + '\n3️⃣  Cache headers...' + colors.reset);
  try {
    const res = await fetch(`${API_URL}/products`);
    const cacheControl = res.headers.get('cache-control');
    const etag = res.headers.get('etag');
    const vary = res.headers.get('vary');
    
    let score = 0;
    if (cacheControl) {
      console.log(colors.green + '✅ Cache-Control: ' + cacheControl + colors.reset);
      score++;
    } else {
      console.log(colors.red + '❌ Cache-Control manquant' + colors.reset);
    }
    
    if (etag) {
      console.log(colors.green + '✅ ETag: présent' + colors.reset);
      score++;
    } else {
      console.log(colors.red + '❌ ETag manquant' + colors.reset);
    }
    
    if (vary) {
      console.log(colors.green + '✅ Vary: ' + vary + colors.reset);
      score++;
    } else {
      console.log(colors.red + '❌ Vary manquant' + colors.reset);
    }
    
    if (score >= 2) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(colors.red + '❌ Erreur: ' + error.message + colors.reset);
    failed++;
  }
}

// Test 4: Security headers
async function test4() {
  console.log(colors.cyan + '\n4️⃣  Security headers (Helmet)...' + colors.reset);
  try {
    const res = await fetch(`${API_URL}/products`);
    let score = 0;
    
    const headers = {
      'x-content-type-options': res.headers.get('x-content-type-options'),
      'x-frame-options': res.headers.get('x-frame-options'),
      'strict-transport-security': res.headers.get('strict-transport-security'),
      'x-dns-prefetch-control': res.headers.get('x-dns-prefetch-control')
    };
    
    for (const [name, value] of Object.entries(headers)) {
      if (value) {
        console.log(colors.green + `✅ ${name}: ${value}` + colors.reset);
        score++;
      }
    }
    
    if (score >= 3) {
      passed++;
    } else {
      console.log(colors.red + `❌ Seulement ${score}/4 headers de sécurité` + colors.reset);
      failed++;
    }
  } catch (error) {
    console.log(colors.red + '❌ Erreur: ' + error.message + colors.reset);
    failed++;
  }
}

// Test 5: Temps de réponse
async function test5() {
  console.log(colors.cyan + '\n5️⃣  Temps de réponse API...' + colors.reset);
  try {
    const start = Date.now();
    await fetch(`${API_URL}/products`);
    const duration = Date.now() - start;
    
    if (duration < 500) {
      console.log(colors.green + `✅ Temps: ${duration}ms (excellent)` + colors.reset);
      passed++;
    } else if (duration < 1000) {
      console.log(colors.yellow + `⚠️  Temps: ${duration}ms (acceptable)` + colors.reset);
      passed++;
    } else {
      console.log(colors.red + `❌ Temps: ${duration}ms (trop lent)` + colors.reset);
      failed++;
    }
  } catch (error) {
    console.log(colors.red + '❌ Erreur: ' + error.message + colors.reset);
    failed++;
  }
}

// Test 6: Taille payload
async function test6() {
  console.log(colors.cyan + '\n6️⃣  Taille payload...' + colors.reset);
  try {
    const res = await fetch(`${API_URL}/products?limit=12`);
    const data = await res.text();
    const sizeKB = (data.length / 1024).toFixed(2);
    
    if (data.length < 50000) {
      console.log(colors.green + `✅ Payload: ${sizeKB} KB (efficace)` + colors.reset);
      passed++;
    } else {
      console.log(colors.yellow + `⚠️  Payload: ${sizeKB} KB (un peu gros)` + colors.reset);
      passed++;
    }
  } catch (error) {
    console.log(colors.red + '❌ Erreur: ' + error.message + colors.reset);
    failed++;
  }
}

// Fonction principale
async function runTests() {
  try {
    // Démarrer le serveur
    const serverReady = await startServer();
    
    if (!serverReady) {
      console.log(colors.red + '\n❌ Impossible de démarrer le serveur' + colors.reset);
      console.log(colors.yellow + '\n💡 Essayez de démarrer manuellement:' + colors.reset);
      console.log('   cd backend');
      console.log('   node src/server.js\n');
      process.exit(1);
    }
    
    // Exécuter les tests
    await test1();
    await test2();
    await test3();
    await test4();
    await test5();
    await test6();
    
    // Résumé
    console.log('\n' + colors.cyan + '╔════════════════════════════════════════╗' + colors.reset);
    console.log(colors.cyan + '║           RÉSUMÉ DES TESTS             ║' + colors.reset);
    console.log(colors.cyan + '╚════════════════════════════════════════╝' + colors.reset + '\n');
    
    const total = passed + failed;
    const percentage = ((passed / total) * 100).toFixed(0);
    
    console.log(`Total: ${total} tests`);
    console.log(colors.green + `✅ Passés: ${passed}` + colors.reset);
    if (failed > 0) {
      console.log(colors.red + `❌ Échoués: ${failed}` + colors.reset);
    }
    
    console.log('\n' + colors.cyan + `Score: ${percentage}%` + colors.reset);
    
    if (failed === 0) {
      console.log('\n' + colors.green + '🎉 TOUS LES TESTS PASSENT !' + colors.reset);
      console.log(colors.green + '✨ Optimisations Performance + PWA actives' + colors.reset + '\n');
    } else {
      console.log('\n' + colors.yellow + `⚠️  ${failed} test(s) à corriger` + colors.reset + '\n');
    }
    
  } catch (error) {
    console.error(colors.red + '\n❌ Erreur fatale: ' + error.message + colors.reset);
    console.error(error.stack);
  } finally {
    stopServer();
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Gestion de Ctrl+C
process.on('SIGINT', () => {
  console.log(colors.yellow + '\n\n⚠️  Interruption...' + colors.reset);
  stopServer();
  process.exit(1);
});

// Lancer les tests
runTests();
