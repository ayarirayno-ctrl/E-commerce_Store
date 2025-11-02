// Quick SEO validation script
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3002';

async function validateSEO() {
  console.log('\n🔍 SEO VALIDATION REPORT\n');
  console.log('=' .repeat(60));

  const tests = [];

  // Test 1: Check if OG images exist
  console.log('\n1️⃣ Checking Open Graph Images...');
  try {
    const ogImageRes = await fetch(`${BASE_URL}/og-image.png`);
    const twitterImageRes = await fetch(`${BASE_URL}/twitter-image.png`);
    
    if (ogImageRes.ok && twitterImageRes.ok) {
      console.log('   ✅ OG images accessible');
      tests.push({ name: 'OG Images', status: 'PASS' });
    } else {
      console.log('   ❌ OG images missing');
      tests.push({ name: 'OG Images', status: 'FAIL' });
    }
  } catch (error) {
    console.log('   ❌ Error checking images:', error.message);
    tests.push({ name: 'OG Images', status: 'FAIL' });
  }

  // Test 2: Check sitemap.xml
  console.log('\n2️⃣ Checking Sitemap...');
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    if (sitemapRes.ok) {
      const content = await sitemapRes.text();
      const urlCount = (content.match(/<loc>/g) || []).length;
      console.log(`   ✅ Sitemap accessible (${urlCount} URLs)`);
      tests.push({ name: 'Sitemap', status: 'PASS', details: `${urlCount} URLs` });
    } else {
      console.log('   ❌ Sitemap not accessible');
      tests.push({ name: 'Sitemap', status: 'FAIL' });
    }
  } catch (error) {
    console.log('   ❌ Error checking sitemap:', error.message);
    tests.push({ name: 'Sitemap', status: 'FAIL' });
  }

  // Test 3: Check robots.txt
  console.log('\n3️⃣ Checking Robots.txt...');
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    if (robotsRes.ok) {
      const content = await robotsRes.text();
      const hasSitemap = content.includes('Sitemap:');
      const hasUserAgent = content.includes('User-agent:');
      
      if (hasSitemap && hasUserAgent) {
        console.log('   ✅ Robots.txt properly configured');
        tests.push({ name: 'Robots.txt', status: 'PASS' });
      } else {
        console.log('   ⚠️  Robots.txt missing required directives');
        tests.push({ name: 'Robots.txt', status: 'WARN' });
      }
    } else {
      console.log('   ❌ Robots.txt not accessible');
      tests.push({ name: 'Robots.txt', status: 'FAIL' });
    }
  } catch (error) {
    console.log('   ❌ Error checking robots.txt:', error.message);
    tests.push({ name: 'Robots.txt', status: 'FAIL' });
  }

  // Test 4: Check homepage meta tags
  console.log('\n4️⃣ Checking Homepage Meta Tags...');
  try {
    const homeRes = await fetch(BASE_URL);
    if (homeRes.ok) {
      const html = await homeRes.text();
      
      const checks = {
        'Title tag': html.includes('<title>'),
        'Meta description': html.includes('meta name="description"'),
        'Meta keywords': html.includes('meta name="keywords"'),
        'Canonical URL': html.includes('rel="canonical"'),
        'OG tags': html.includes('og:title'),
        'Twitter Cards': html.includes('twitter:card'),
        'Robots meta': html.includes('meta name="robots"'),
        'Language': html.includes('lang="')
      };

      let passed = 0;
      let total = Object.keys(checks).length;

      for (const [check, result] of Object.entries(checks)) {
        if (result) {
          console.log(`   ✅ ${check}`);
          passed++;
        } else {
          console.log(`   ❌ ${check} missing`);
        }
      }

      if (passed === total) {
        console.log(`   ✅ All meta tags present (${passed}/${total})`);
        tests.push({ name: 'Meta Tags', status: 'PASS', details: `${passed}/${total}` });
      } else {
        console.log(`   ⚠️  Some meta tags missing (${passed}/${total})`);
        tests.push({ name: 'Meta Tags', status: 'WARN', details: `${passed}/${total}` });
      }
    }
  } catch (error) {
    console.log('   ❌ Error checking homepage:', error.message);
    tests.push({ name: 'Meta Tags', status: 'FAIL' });
  }

  // Test 5: Check PWA manifest
  console.log('\n5️⃣ Checking PWA Manifest...');
  try {
    const manifestRes = await fetch(`${BASE_URL}/manifest.json`);
    if (manifestRes.ok) {
      const manifest = await manifestRes.json();
      const hasIcons = manifest.icons && manifest.icons.length > 0;
      const hasName = manifest.name && manifest.short_name;
      
      if (hasIcons && hasName) {
        console.log(`   ✅ Manifest valid (${manifest.icons.length} icons)`);
        tests.push({ name: 'PWA Manifest', status: 'PASS', details: `${manifest.icons.length} icons` });
      } else {
        console.log('   ⚠️  Manifest incomplete');
        tests.push({ name: 'PWA Manifest', status: 'WARN' });
      }
    } else {
      console.log('   ❌ Manifest not accessible');
      tests.push({ name: 'PWA Manifest', status: 'FAIL' });
    }
  } catch (error) {
    console.log('   ❌ Error checking manifest:', error.message);
    tests.push({ name: 'PWA Manifest', status: 'FAIL' });
  }

  // Test 6: Check structured data (homepage should load schema)
  console.log('\n6️⃣ Checking Structured Data...');
  try {
    const homeRes = await fetch(BASE_URL);
    if (homeRes.ok) {
      const html = await homeRes.text();
      const hasJsonLd = html.includes('application/ld+json');
      
      if (hasJsonLd) {
        console.log('   ✅ JSON-LD structured data present');
        tests.push({ name: 'Structured Data', status: 'PASS' });
      } else {
        console.log('   ⚠️  No JSON-LD found (may be added dynamically)');
        tests.push({ name: 'Structured Data', status: 'WARN' });
      }
    }
  } catch (error) {
    console.log('   ❌ Error checking structured data:', error.message);
    tests.push({ name: 'Structured Data', status: 'FAIL' });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY\n');

  const passed = tests.filter(t => t.status === 'PASS').length;
  const warned = tests.filter(t => t.status === 'WARN').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  const total = tests.length;

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warned}`);
  console.log(`❌ Failed: ${failed}`);

  const score = Math.round((passed / total) * 100);
  console.log(`\n🎯 SEO Score: ${score}%`);

  if (score === 100) {
    console.log('\n🎉 PERFECT! All SEO elements validated.\n');
  } else if (score >= 80) {
    console.log('\n✅ GOOD! Most SEO elements are in place.\n');
  } else if (score >= 60) {
    console.log('\n⚠️  NEEDS IMPROVEMENT. Review failed tests.\n');
  } else {
    console.log('\n❌ CRITICAL ISSUES. SEO setup incomplete.\n');
  }

  console.log('='.repeat(60) + '\n');

  // Return results for programmatic use
  return { tests, score, passed, warned, failed };
}

// Run validation
validateSEO().catch(console.error);
