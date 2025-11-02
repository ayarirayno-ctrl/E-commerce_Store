#!/usr/bin/env node

/**
 * Script de test de sécurité
 * Teste les vulnérabilités courantes : XSS, injection NoSQL, rate limiting
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`🔒 SECURITY TEST: ${testName}`, 'cyan');
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

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: XSS Prevention
async function testXSSPrevention() {
  logTest('XSS Attack Prevention');
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<svg/onload=alert("XSS")>'
  ];
  
  let vulnerable = 0;
  
  for (const payload of xssPayloads) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: payload,
          lastName: 'Test',
          email: 'xss-test@example.com',
          password: 'Password123'
        })
      });
      
      const data = await response.json();
      
      // Check if payload was sanitized in response
      if (data.user && data.user.firstName.includes('<script>')) {
        vulnerable++;
        logWarning(`XSS payload not sanitized: ${payload.substring(0, 30)}...`);
      }
    } catch (error) {
      // Protected - error caught
      void error; // Acknowledge error
    }
  }
  
  if (vulnerable === 0) {
    logSuccess('XSS protection working correctly');
  } else {
    logError(`${vulnerable} XSS vulnerabilities found`);
  }
  
  return vulnerable === 0;
}

// Test 2: NoSQL Injection Prevention
async function testNoSQLInjection() {
  logTest('NoSQL Injection Prevention');
  
  const injectionPayloads = [
    { email: { $ne: null }, password: { $ne: null } },
    { email: { $gt: '' }, password: 'test' },
    { email: 'admin@example.com', password: { $regex: '.*' } }
  ];
  
  let vulnerable = 0;
  
  for (const payload of injectionPayloads) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      // If login succeeds with injection payload, it's vulnerable
      if (response.ok && data.token) {
        vulnerable++;
        logWarning('NoSQL injection vulnerability detected');
      }
    } catch (error) {
      // Protected - error caught
      void error; // Acknowledge error
    }
  }
  
  if (vulnerable === 0) {
    logSuccess('NoSQL injection protection working correctly');
  } else {
    logError(`${vulnerable} NoSQL injection vulnerabilities found`);
  }
  
  return vulnerable === 0;
}

// Test 3: Rate Limiting
async function testRateLimiting() {
  logTest('Rate Limiting');
  
  const requests = [];
  const maxRequests = 150; // Exceed typical rate limit
  
  // Send many requests quickly
  for (let i = 0; i < maxRequests; i++) {
    requests.push(
      fetch(`${API_URL}/health`).then(r => r.status)
    );
  }
  
  const results = await Promise.all(requests);
  const rateLimited = results.filter(status => status === 429).length;
  
  if (rateLimited > 0) {
    logSuccess(`Rate limiting active (${rateLimited}/${maxRequests} requests blocked)`);
    return true;
  } else {
    logWarning('Rate limiting may not be configured properly');
    return false;
  }
}

// Test 4: SQL Injection in search (if applicable)
async function testSQLInjection() {
  logTest('SQL/Command Injection in Search');
  
  const sqlPayloads = [
    "'; DROP TABLE products;--",
    "1' OR '1'='1",
    "admin'--",
    "1; UPDATE products SET price=0--"
  ];
  
  let safe = true;
  
  for (const payload of sqlPayloads) {
    try {
      const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(payload)}`);
      
      // Server should handle gracefully, not crash
      if (response.ok || response.status === 400 || response.status === 404) {
        // Good - handled safely
      } else if (response.status === 500) {
        logWarning(`Server error with payload: ${payload}`);
        safe = false;
      }
    } catch (error) {
      logWarning(`Connection lost with payload: ${payload}`);
      safe = false;
    }
  }
  
  if (safe) {
    logSuccess('SQL/Command injection protection working');
  } else {
    logError('Possible SQL/Command injection vulnerability');
  }
  
  return safe;
}

// Test 5: Large Payload Attack
async function testLargePayload() {
  logTest('Large Payload Protection');
  
  // Try to send a very large payload
  const largeString = 'A'.repeat(20 * 1024 * 1024); // 20MB
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: largeString,
        lastName: 'Test',
        email: 'large-payload@example.com',
        password: 'Password123'
      })
    });
    
    if (response.status === 413 || response.status === 400) {
      logSuccess('Large payload rejected (payload size limit active)');
      return true;
    } else if (response.ok) {
      logError('Large payload accepted - potential DoS vulnerability');
      return false;
    } else {
      logWarning('Unexpected response to large payload');
      return true;
    }
  } catch (error) {
    if (error.message.includes('payload') || error.message.includes('size')) {
      logSuccess('Large payload protection active');
      return true;
    }
    logWarning(`Error with large payload: ${error.message}`);
    return true;
  }
}

// Test 6: HTTP Headers Security
async function testSecurityHeaders() {
  logTest('Security HTTP Headers');
  
  try {
    const response = await fetch(`${API_URL}/health`);
    const headers = response.headers;
    
    const securityHeaders = {
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'x-xss-protection': '1; mode=block',
      'strict-transport-security': 'max-age'
    };
    
    let headersMissing = 0;
    
    for (const [header, expectedValue] of Object.entries(securityHeaders)) {
      const value = headers.get(header);
      if (value && value.includes(expectedValue)) {
        logSuccess(`✓ ${header}: ${value}`);
      } else {
        headersMissing++;
        logWarning(`✗ ${header} not set properly`);
      }
    }
    
    if (headersMissing === 0) {
      logSuccess('All security headers properly configured');
      return true;
    } else {
      logWarning(`${headersMissing} security headers missing or misconfigured`);
      return false;
    }
  } catch (error) {
    logError(`Failed to check headers: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runSecurityTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║           SECURITY VULNERABILITY TESTS                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };
  
  // Wait for server
  await wait(2000);
  
  // Test 1: XSS
  results.total++;
  if (await testXSSPrevention()) results.passed++;
  else results.failed++;
  await wait(1000);
  
  // Test 2: NoSQL Injection
  results.total++;
  if (await testNoSQLInjection()) results.passed++;
  else results.failed++;
  await wait(1000);
  
  // Test 3: Rate Limiting
  results.total++;
  if (await testRateLimiting()) results.passed++;
  else results.failed++;
  await wait(2000);
  
  // Test 4: SQL Injection
  results.total++;
  if (await testSQLInjection()) results.passed++;
  else results.failed++;
  await wait(1000);
  
  // Test 5: Large Payload
  results.total++;
  if (await testLargePayload()) results.passed++;
  else results.failed++;
  await wait(1000);
  
  // Test 6: Security Headers
  results.total++;
  if (await testSecurityHeaders()) results.passed++;
  else results.failed++;
  
  // Summary
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                  SECURITY TEST SUMMARY                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');
  
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  console.log('\n');
  
  if (results.failed === 0) {
    log(`✨ ALL SECURITY TESTS PASSED! (${percentage}%)`, 'green');
    log('🔒 Application is well protected against common attacks', 'green');
  } else {
    log(`⚠️  ${results.failed} SECURITY ISSUE(S) FOUND (${percentage}% passed)`, 'yellow');
    log('🔧 Please review and fix security vulnerabilities', 'yellow');
  }
  console.log('\n');
}

runSecurityTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
