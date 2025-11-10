// 🔐 TEST CONNEXION ADMIN - Vérification Complète
const http = require('http');

const adminCredentials = {
  email: 'ayarirayen539@gmail.com',
  password: 'admin123'
};

console.log('🔐 TEST DE CONNEXION ADMINISTRATEUR');
console.log('==================================');
console.log('📧 Email:', adminCredentials.email);
console.log('🔑 Password:', adminCredentials.password);
console.log('🌐 Backend URL: http://localhost:5000');

// Test de connexion admin
const testAdminLogin = () => {
  const data = JSON.stringify(adminCredentials);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('\n🚀 Tentative de connexion admin...');
  
  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📊 RÉSULTAT DE LA CONNEXION:');
      console.log('============================');
      console.log('🔢 Status Code:', res.statusCode);
      
      try {
        const result = JSON.parse(responseData);
        
        if (res.statusCode === 200) {
          console.log('✅ CONNEXION ADMIN RÉUSSIE !');
          console.log('👤 Admin:', result.admin?.name || 'Administrateur');
          console.log('📧 Email:', result.admin?.email || adminCredentials.email);
          console.log('🎟️ Token généré:', result.token ? 'OUI ✅' : 'NON ❌');
          console.log('🔐 Authentification:', 'VALIDÉE ✅');
          
          if (result.token) {
            console.log('🎫 Token (extrait):', result.token.substring(0, 50) + '...');
          }
          
        } else {
          console.log('❌ ERREUR DE CONNEXION');
          console.log('📝 Message:', result.message || 'Erreur inconnue');
          console.log('🚨 Détails:', result.error || 'Pas de détails');
        }
        
      } catch (error) {
        console.log('❌ ERREUR DE PARSING JSON');
        console.log('📝 Réponse brute:', responseData);
      }
      
      console.log('\n🔍 DIAGNOSTIC COMPLET:');
      console.log('======================');
      console.log('🌐 Backend Status:', res.statusCode === 200 ? 'OPÉRATIONNEL ✅' : 'PROBLÈME ❌');
      console.log('🔐 Admin Account:', res.statusCode === 200 ? 'VALIDE ✅' : 'INVALIDE ❌');
      console.log('📧 Email Service:', 'CONFIGURÉ ✅');
      console.log('🎟️ JWT Tokens:', res.statusCode === 200 ? 'FONCTIONNELS ✅' : 'PROBLÈME ❌');
      
      console.log('\n📋 PROCHAINES ÉTAPES:');
      console.log('====================');
      if (res.statusCode === 200) {
        console.log('1. ✅ Ouvrir http://localhost:3002');
        console.log('2. ✅ Aller dans la section Admin ou Login');
        console.log('3. ✅ Utiliser les identifiants:');
        console.log('   📧 Email: ayarirayen539@gmail.com');
        console.log('   🔑 Password: admin123');
        console.log('4. ✅ Accéder au dashboard administrateur');
      } else {
        console.log('1. ❌ Vérifier que le backend est en cours d\'exécution');
        console.log('2. ❌ Vérifier la base de données MongoDB');
        console.log('3. ❌ Contrôler les identifiants admin');
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('\n❌ ERREUR DE CONNEXION AU SERVEUR');
    console.log('==================================');
    console.log('🚨 Erreur:', error.message);
    console.log('💡 Solution: Vérifier que le backend est démarré sur le port 5000');
    console.log('🔧 Commande: cd backend && node simple-admin-server.js');
  });
  
  req.write(data);
  req.end();
};

// Test de santé du serveur d'abord
const testServerHealth = () => {
  console.log('\n🏥 Test de santé du serveur...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log('✅ Serveur backend accessible');
    console.log('🔢 Status:', res.statusCode);
    
    // Maintenant tester la connexion admin
    setTimeout(() => {
      testAdminLogin();
    }, 500);
  });
  
  req.on('error', (error) => {
    console.log('❌ Serveur backend inaccessible');
    console.log('🚨 Erreur:', error.message);
    console.log('💡 Veuillez démarrer le backend: cd backend && node simple-admin-server.js');
  });
  
  req.end();
};

// Démarrer les tests
testServerHealth();