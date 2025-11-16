#!/usr/bin/env node

/**
 * Script de test de performance
 * Mesure : Temps de chargement, taille des réponses, compression
 */

import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`⚡ TEST: ${testName}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

const API_BASE = 'http://localhost:5000/api';
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  measurements: {}
};

// Test 1: Response time
async function testResponseTime() {
  logTest('API Response Time');
  
  const endpoints = [
    { url: `${API_BASE}/products`, name: 'GET /products', maxTime: 500 },
    { url: `${API_BASE}/auth/verify`, name: 'GET /auth/verify', maxTime: 300 }
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    try {
      const start = performance.now();
      const response = await fetch(endpoint.url, {
        headers: { 'Accept': 'application/json' }
      });
      const end = performance.now();
      const duration = Math.round(end - start);
      
      results.measurements[endpoint.name] = duration;
      
      if (response.ok) {
        if (duration < endpoint.maxTime) {
          logSuccess(`${endpoint.name}: ${duration}ms ✓ (< ${endpoint.maxTime}ms)`);
        } else {
          logWarning(`${endpoint.name}: ${duration}ms (target: < ${endpoint.maxTime}ms)`);
          allPassed = false;
        }
      } else {
        logError(`${endpoint.name}: HTTP ${response.status}`);
        allPassed = false;
      }
    } catch (error) {
      logError(`${endpoint.name}: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

// Test 2: Compression
async function testCompression() {
  logTest('Response Compression');
  
  try {
    // Request without compression
    const uncompressedResponse = await fetch(`${API_BASE}/products`, {
      headers: { 
        'Accept': 'application/json',
        'Accept-Encoding': 'identity' // No compression
      }
    });
    
    // Request with compression
    const compressedResponse = await fetch(`${API_BASE}/products`, {
      headers: { 
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
      }
    });
    
    const uncompressedData = await uncompressedResponse.text();
    const compressedData = await compressedResponse.text();
    
    const uncompressedSize = Buffer.byteLength(uncompressedData, 'utf8');
    const compressedSize = Buffer.byteLength(compressedData, 'utf8');
    
    const compressionRatio = ((1 - compressedSize / uncompressedSize) * 100).toFixed(1);
    
    logInfo(`Original size: ${(uncompressedSize / 1024).toFixed(2)} KB`);
    logInfo(`Compressed size: ${(compressedSize / 1024).toFixed(2)} KB`);
    
    const encoding = compressedResponse.headers.get('content-encoding');
    
    if (encoding && (encoding.includes('gzip') || encoding.includes('deflate'))) {
      logSuccess(`Compression active: ${encoding}`);
      logSuccess(`Compression ratio: ${compressionRatio}% reduction`);
      
      results.measurements['Compression Ratio'] = compressionRatio + '%';
      results.measurements['Original Size'] = (uncompressedSize / 1024).toFixed(2) + ' KB';
      results.measurements['Compressed Size'] = (compressedSize / 1024).toFixed(2) + ' KB';
      
      return parseFloat(compressionRatio) > 30; // At least 30% compression
    } else {
      logWarning('Compression not detected');
      return false;
    }
  } catch (error) {
    logError(`Compression test failed: ${error.message}`);
    return false;
  }
}

// Test 3: Cache headers
async function testCacheHeaders() {
  logTest('Cache Headers Configuration');
  
  const endpoints = [
    { url: `${API_BASE}/products`, name: 'Products list' },
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      
      const cacheControl = response.headers.get('cache-control');
      const etag = response.headers.get('etag');
      
      logInfo(`${endpoint.name}:`);
      
      if (cacheControl) {
        logSuccess(`  Cache-Control: ${cacheControl}`);
      } else {
        logWarning(`  Cache-Control: not set`);
        allPassed = false;
      }
      
      if (etag) {
        logSuccess(`  ETag: present`);
      } else {
        logWarning(`  ETag: not set`);
      }
      
      const vary = response.headers.get('vary');
      if (vary && vary.includes('Accept-Encoding')) {
        logSuccess(`  Vary: ${vary}`);
      } else {
        logWarning(`  Vary: not configured for compression`);
      }
      
    } catch (error) {
      logError(`${endpoint.name}: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

// Test 4: Payload size
async function testPayloadSize() {
  logTest('API Payload Efficiency');
  
  try {
    const response = await fetch(`${API_BASE}/products?limit=12`);
    const data = await response.json();
    const bodySize = Buffer.byteLength(JSON.stringify(data), 'utf8');
    
    logInfo(`Payload size (12 products): ${(bodySize / 1024).toFixed(2)} KB`);
    logInfo(`Products returned: ${data.products?.length || 0}`);
    
    const avgProductSize = data.products?.length > 0 
      ? (bodySize / data.products.length / 1024).toFixed(2)
      : 0;
    
    logInfo(`Average per product: ${avgProductSize} KB`);
    
    results.measurements['Payload Size'] = (bodySize / 1024).toFixed(2) + ' KB';
    results.measurements['Avg per Product'] = avgProductSize + ' KB';
    
    // Payload should be reasonable (< 50KB for 12 products)
    if (bodySize < 50 * 1024) {
      logSuccess(`✓ Payload size is efficient`);
      return true;
    } else {
      logWarning(`⚠ Payload might be too large`);
      return false;
    }
  } catch (error) {
    logError(`Payload test failed: ${error.message}`);
    return false;
  }
}

// Test 5: Concurrent requests
async function testConcurrentRequests() {
  logTest('Concurrent Request Handling');
  
  try {
    logInfo('Sending 10 concurrent requests...');
    
    const start = performance.now();
    const requests = Array(10).fill(null).map(() => 
      fetch(`${API_BASE}/products?limit=5`)
    );
    
    const responses = await Promise.all(requests);
    const end = performance.now();
    const duration = Math.round(end - start);
    
    const allSuccess = responses.every(r => r.ok);
    
    logInfo(`Total time: ${duration}ms`);
    logInfo(`Average per request: ${Math.round(duration / 10)}ms`);
    
    results.measurements['Concurrent Load'] = duration + 'ms for 10 requests';
    
    if (allSuccess && duration < 3000) {
      logSuccess(`✓ Server handled concurrent requests well`);
      return true;
    } else if (allSuccess) {
      logWarning(`⚠ All requests succeeded but took ${duration}ms`);
      return false;
    } else {
      logError(`✗ Some requests failed`);
      return false;
    }
  } catch (error) {
    logError(`Concurrent test failed: ${error.message}`);
    return false;
  }
}

// Test 6: Security headers performance impact
async function testSecurityHeaders() {
  logTest('Security Headers (Performance Impact)');
  
  try {
    const response = await fetch(`${API_BASE}/products`);
    
    const headers = {
      'X-Content-Type-Options': response.headers.get('x-content-type-options'),
      'X-Frame-Options': response.headers.get('x-frame-options'),
      'Strict-Transport-Security': response.headers.get('strict-transport-security'),
      'X-DNS-Prefetch-Control': response.headers.get('x-dns-prefetch-control')
    };
    
    let count = 0;
    for (const [name, value] of Object.entries(headers)) {
      if (value) {
        logSuccess(`✓ ${name}: ${value}`);
        count++;
      } else {
        logInfo(`  ${name}: not set`);
      }
    }
    
    results.measurements['Security Headers'] = `${count}/4 set`;
    
    return count >= 3;
  } catch (error) {
    logError(`Security headers test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runPerformanceTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          PERFORMANCE & OPTIMIZATION TESTS                  ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  // Test 1: Response time
  results.total++;
  if (await testResponseTime()) results.passed++;
  else results.failed++;
  
  // Test 2: Compression
  results.total++;
  if (await testCompression()) results.passed++;
  else results.failed++;
  
  // Test 3: Cache headers
  results.total++;
  if (await testCacheHeaders()) results.passed++;
  else results.failed++;
  
  // Test 4: Payload size
  results.total++;
  if (await testPayloadSize()) results.passed++;
  else results.failed++;
  
  // Test 5: Concurrent requests
  results.total++;
  if (await testConcurrentRequests()) results.passed++;
  else results.failed++;
  
  // Test 6: Security headers
  results.total++;
  if (await testSecurityHeaders()) results.passed++;
  else results.failed++;
  
  // Summary
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    TEST SUMMARY                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');
  
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  console.log('\n');
  
  // Performance Metrics Summary
  log('📊 KEY METRICS:', 'cyan');
  for (const [metric, value] of Object.entries(results.measurements)) {
    logInfo(`  ${metric}: ${value}`);
  }
  console.log('\n');
  
  if (results.failed === 0) {
    log(`✨ ALL PERFORMANCE TESTS PASSED! (${percentage}%)`, 'green');
    log('⚡ API is production-ready!', 'green');
  } else if (results.passed >= 4) {
    log(`👍 GOOD! ${results.passed}/${results.total} tests passed (${percentage}%)`, 'yellow');
    log('🔧 Some optimizations recommended', 'yellow');
  } else {
    log(`⚠️  ${results.failed} TESTS FAILED (${percentage}% passed)`, 'yellow');
    log('🔧 Performance needs attention', 'yellow');
  }
  console.log('\n');
}

runPerformanceTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
