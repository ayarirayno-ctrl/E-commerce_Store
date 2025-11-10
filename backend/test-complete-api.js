const http = require('http');

async function testAPI(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 TESTING E-COMMERCE API...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const health = await testAPI('/api/health');
    console.log(`✅ Health: ${health.status} - ${health.data.message}\n`);
  } catch (e) {
    console.log(`❌ Health check failed: ${e.message}\n`);
  }

  // Test 2: Admin Login
  console.log('2️⃣ Testing Admin Login...');
  try {
    const login = await testAPI('/api/admin/auth/login', 'POST', {
      email: 'ayarirayen539@gmail.com',
      password: 'admin123'
    });
    
    if (login.status === 200) {
      console.log(`✅ Admin Login: SUCCESS`);
      console.log(`📊 Admin: ${login.data.admin?.name} (${login.data.admin?.email})`);
      console.log(`🔑 Token: ${login.data.token ? 'Generated' : 'Missing'}\n`);
    } else {
      console.log(`❌ Admin Login: FAILED (${login.status})`);
      console.log(`📊 Error: ${login.data.message}\n`);
    }
  } catch (e) {
    console.log(`❌ Admin login test failed: ${e.message}\n`);
  }

  // Test 3: Stripe Config
  console.log('3️⃣ Testing Stripe Configuration...');
  try {
    const stripe = await testAPI('/api/stripe/config');
    console.log(`✅ Stripe Config: ${stripe.status}`);
    console.log(`🔑 Public Key: ${stripe.data.publicKey ? 'Configured' : 'Missing'}\n`);
  } catch (e) {
    console.log(`❌ Stripe config test failed: ${e.message}\n`);
  }

  // Test 4: Mock Checkout
  console.log('4️⃣ Testing Checkout Session...');
  try {
    const checkout = await testAPI('/api/stripe/create-checkout-session', 'POST', {
      items: [
        { id: 1, name: 'Test Product', price: 29.99, quantity: 1 }
      ],
      email: 'test@example.com',
      shippingAddress: { fullName: 'Test User' }
    });
    
    if (checkout.status === 200) {
      console.log(`✅ Checkout: SUCCESS`);
      console.log(`📊 Session ID: ${checkout.data.sessionId}`);
      console.log(`🔗 URL: ${checkout.data.url}\n`);
    } else {
      console.log(`❌ Checkout: FAILED (${checkout.status})`);
      console.log(`📊 Error: ${checkout.data.message}\n`);
    }
  } catch (e) {
    console.log(`❌ Checkout test failed: ${e.message}\n`);
  }

  console.log('🎉 ALL TESTS COMPLETED!\n');
  console.log('📋 NEXT STEPS:');
  console.log('1. Open http://localhost:3002 in browser');
  console.log('2. Test admin login with: ayarirayen539@gmail.com / admin123');
  console.log('3. Test payment flow with checkout');
  console.log('4. Verify email notifications');
}

runTests().catch(console.error);