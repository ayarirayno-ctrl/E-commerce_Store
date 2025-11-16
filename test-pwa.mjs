#!/usr/bin/env node

/**
 * Script de test PWA et Performance
 * Vérifie : Service Worker, manifest, offline mode, performance metrics
 */

import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  log(`📱 TEST: ${testName}`, 'cyan');
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

const APP_URL = 'http://localhost:3004';

// Test 1: Manifest.json validation
async function testManifest() {
  logTest('PWA Manifest Validation');
  
  try {
    const manifestPath = join(process.cwd(), 'public', 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    let valid = true;
    
    for (const field of requiredFields) {
      if (manifest[field]) {
        logSuccess(`✓ ${field}: ${typeof manifest[field] === 'object' ? 'configured' : manifest[field]}`);
      } else {
        logError(`✗ Missing required field: ${field}`);
        valid = false;
      }
    }
    
    // Check icons
    if (manifest.icons && manifest.icons.length >= 2) {
      logSuccess(`✓ Icons: ${manifest.icons.length} configured`);
      manifest.icons.forEach(icon => {
        logInfo(`  - ${icon.sizes} (${icon.purpose || 'any'})`);
      });
    } else {
      logWarning('✗ Need at least 2 icons (192x192 and 512x512)');
      valid = false;
    }
    
    return valid;
  } catch (error) {
    logError(`Failed to validate manifest: ${error.message}`);
    return false;
  }
}

// Test 2: Service Worker registration
async function testServiceWorker() {
  logTest('Service Worker Registration');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    
    // Wait for service worker registration
    await page.waitForTimeout(2000);
    
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration !== undefined;
      }
      return false;
    });
    
    if (swRegistered) {
      logSuccess('Service Worker registered successfully');
      
      const swState = await page.evaluate(() => {
        return navigator.serviceWorker.controller ? 'active' : 'waiting';
      });
      logInfo(`State: ${swState}`);
      
      await browser.close();
      return true;
    } else {
      logWarning('Service Worker not registered');
      await browser.close();
      return false;
    }
  } catch (error) {
    logError(`Service Worker test failed: ${error.message}`);
    await browser.close();
    return false;
  }
}

// Test 3: Offline functionality
async function testOfflineMode() {
  logTest('Offline Mode Support');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // First visit to cache pages
    logInfo('Initial visit to cache pages...');
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Go offline
    logInfo('Going offline...');
    await context.setOffline(true);
    
    // Try to navigate
    await page.goto(APP_URL);
    await page.waitForTimeout(2000);
    
    const pageContent = await page.content();
    
    // Check if offline page is shown or cached content is displayed
    if (pageContent.includes('offline') || pageContent.includes('E-Commerce') || pageContent.includes('Modern')) {
      logSuccess('Offline mode working - page served from cache');
      await browser.close();
      return true;
    } else {
      logWarning('Offline mode not working properly');
      await browser.close();
      return false;
    }
  } catch (error) {
    // Network error is expected in offline mode
    if (error.message.includes('net::ERR')) {
      logWarning('No offline fallback - connection error shown');
      await browser.close();
      return false;
    }
    logError(`Offline test failed: ${error.message}`);
    await browser.close();
    return false;
  }
}

// Test 4: Performance metrics
async function testPerformance() {
  logTest('Performance Metrics');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    const startTime = Date.now();
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(e => e.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    logInfo(`Page Load Time: ${loadTime}ms`);
    logInfo(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    logInfo(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
    logInfo(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    
    let score = 0;
    if (loadTime < 3000) {
      logSuccess('✓ Load time < 3s');
      score++;
    } else {
      logWarning('✗ Load time > 3s');
    }
    
    if (metrics.firstContentfulPaint < 1500) {
      logSuccess('✓ FCP < 1.5s');
      score++;
    } else {
      logWarning('✗ FCP > 1.5s');
    }
    
    await browser.close();
    return score >= 2;
  } catch (error) {
    logError(`Performance test failed: ${error.message}`);
    await browser.close();
    return false;
  }
}

// Test 5: Image optimization check
async function testImageOptimization() {
  logTest('Image Optimization');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    
    const imageStats = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return {
        total: images.length,
        withLoading: images.filter(img => img.loading === 'lazy').length,
        withAlt: images.filter(img => img.alt && img.alt.trim() !== '').length
      };
    });
    
    logInfo(`Total images: ${imageStats.total}`);
    logInfo(`Lazy loading: ${imageStats.withLoading}/${imageStats.total}`);
    logInfo(`With alt text: ${imageStats.withAlt}/${imageStats.total}`);
    
    const lazyLoadingPercent = (imageStats.withLoading / imageStats.total) * 100;
    const altTextPercent = (imageStats.withAlt / imageStats.total) * 100;
    
    if (lazyLoadingPercent > 70) {
      logSuccess(`✓ ${lazyLoadingPercent.toFixed(0)}% images use lazy loading`);
    } else {
      logWarning(`✗ Only ${lazyLoadingPercent.toFixed(0)}% images use lazy loading`);
    }
    
    if (altTextPercent > 90) {
      logSuccess(`✓ ${altTextPercent.toFixed(0)}% images have alt text`);
    } else {
      logWarning(`✗ Only ${altTextPercent.toFixed(0)}% images have alt text`);
    }
    
    await browser.close();
    return lazyLoadingPercent > 50 && altTextPercent > 80;
  } catch (error) {
    logError(`Image optimization test failed: ${error.message}`);
    await browser.close();
    return false;
  }
}

// Test 6: Install prompt availability
async function testInstallability() {
  logTest('PWA Installability');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const manifestLinked = await page.evaluate(() => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      return manifestLink !== null;
    });
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    const httpsOrLocalhost = APP_URL.startsWith('https://') || APP_URL.includes('localhost');
    
    if (manifestLinked) logSuccess('✓ Manifest linked in HTML');
    else logError('✗ Manifest not linked');
    
    if (swRegistered) logSuccess('✓ Service Worker supported');
    else logError('✗ Service Worker not supported');
    
    if (httpsOrLocalhost) logSuccess('✓ HTTPS or localhost');
    else logWarning('✗ Not HTTPS (required for production)');
    
    await browser.close();
    return manifestLinked && swRegistered;
  } catch (error) {
    logError(`Installability test failed: ${error.message}`);
    await browser.close();
    return false;
  }
}

// Main test runner
async function runPWATests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║              PWA & PERFORMANCE TESTS                       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };
  
  // Test 1: Manifest
  results.total++;
  if (await testManifest()) results.passed++;
  else results.failed++;
  
  // Test 2: Service Worker
  results.total++;
  if (await testServiceWorker()) results.passed++;
  else results.failed++;
  
  // Test 3: Offline Mode
  results.total++;
  if (await testOfflineMode()) results.passed++;
  else results.failed++;
  
  // Test 4: Performance
  results.total++;
  if (await testPerformance()) results.passed++;
  else results.failed++;
  
  // Test 5: Image Optimization
  results.total++;
  if (await testImageOptimization()) results.passed++;
  else results.failed++;
  
  // Test 6: Installability
  results.total++;
  if (await testInstallability()) results.passed++;
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
  
  if (results.failed === 0) {
    log(`✨ ALL PWA TESTS PASSED! (${percentage}%)`, 'green');
    log('📱 App is ready for mobile installation!', 'green');
  } else if (results.passed >= 4) {
    log(`👍 GOOD! ${results.passed}/${results.total} tests passed (${percentage}%)`, 'yellow');
    log('🔧 Some improvements needed', 'yellow');
  } else {
    log(`⚠️  ${results.failed} TESTS FAILED (${percentage}% passed)`, 'yellow');
    log('🔧 PWA features need attention', 'yellow');
  }
  console.log('\n');
}

runPWATests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
