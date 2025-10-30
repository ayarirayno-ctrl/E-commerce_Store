const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/client-auth';

async function testClientAuth() {
  try {
    console.log('\n📝 Testing Client Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123'
    });
    console.log('✅ Registration successful:', registerResponse.data);
    
    const token = registerResponse.data.token;
    const userEmail = registerResponse.data.client.email;
    
    console.log('\n🔐 Testing Client Login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: userEmail,
      password: 'test123'
    });
    console.log('✅ Login successful:', loginResponse.data);
    
    console.log('\n👤 Testing Get Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data);
    
    console.log('\n✏️ Testing Update Profile...');
    const updateResponse = await axios.put(`${BASE_URL}/profile`, {
      name: 'Updated User',
      phone: '123-456-7890',
      address: { city: 'New York', country: 'USA' }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile updated:', updateResponse.data);
    
    console.log('\n🔒 Testing Change Password...');
    const passwordResponse = await axios.put(`${BASE_URL}/change-password`, {
      currentPassword: 'test123',
      newPassword: 'newpass123'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Password changed:', passwordResponse.data);
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testClientAuth();
