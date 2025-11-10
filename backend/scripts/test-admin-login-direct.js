const https = require('https');
const http = require('http');

function testAdminLogin() {
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

  console.log('🚀 Test de connexion admin...');
  console.log('📧 Email: ayarirayen539@gmail.com');
  console.log('🌐 Endpoint: http://localhost:5000/api/admin/auth/login\n');

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📦 RÉPONSE DU SERVEUR:');
      console.log('='.repeat(50));
      
      try {
        const response = JSON.parse(data);
        console.log('✅ Réponse JSON valide:');
        console.log(JSON.stringify(response, null, 2));
        
        if (response.admin) {
          console.log('\n🔍 ANALYSE DE L\'OBJET ADMIN:');
          console.log(`   ID: ${response.admin.id}`);
          console.log(`   Nom: ${response.admin.name}`);
          console.log(`   Email: ${response.admin.email}`);
          console.log(`   Rôle: ${response.admin.role} ${response.admin.role === 'admin' ? '✅' : '❌'}`);
        }
        
        if (response.token) {
          console.log(`\n🎟️ Token JWT: ${response.token.substring(0, 50)}...`);
        }
        
      } catch (error) {
        console.error('❌ Erreur parsing JSON:', error);
        console.log('📄 Réponse brute:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de requête:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Le backend n\'est probablement pas démarré sur le port 5000');
    }
  });

  req.write(postData);
  req.end();
}

// Attendre un peu pour que le backend se connecte
setTimeout(testAdminLogin, 2000);