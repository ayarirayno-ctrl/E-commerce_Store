const http = require('http');

function testAdminLoginAPI() {
  const postData = JSON.stringify({
    email: 'ayarirayen539@gmail.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🚀 Test de l\'API Admin Login...');
  console.log('URL:', `http://localhost:5000${options.path}`);
  console.log('Payload:', postData);

  const req = http.request(options, (res) => {
    console.log(`\n📊 Status Code: ${res.statusCode}`);
    console.log('📋 Headers:', res.headers);

    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('\n📨 Response Body:', responseData);
      
      try {
        const parsedResponse = JSON.parse(responseData);
        console.log('\n📄 Parsed Response:', JSON.stringify(parsedResponse, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n✅ SUCCÈS: Admin login fonctionne !');
        } else {
          console.log('\n❌ ÉCHEC: Status', res.statusCode);
        }
      } catch (e) {
        console.log('\n⚠️ Réponse non-JSON:', responseData);
      }
    });
  });

  req.on('error', (e) => {
    console.error('\n❌ Erreur de requête:', e.message);
  });

  req.write(postData);
  req.end();
}

// Attendre un peu que le serveur démarre (si il est en train de démarrer)
console.log('⏳ Attente de 2 secondes...');
setTimeout(testAdminLoginAPI, 2000);