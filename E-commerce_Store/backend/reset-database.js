const { MongoClient } = require('mongodb');

async function resetDatabase() {
  try {
    console.log('🔄 Réinitialisation base de données...');
    
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    console.log('✅ Connexion MongoDB établie');
    
    const db = client.db('ecommerce');
    
    // Suppression complète
    await db.collection('products').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('reviews').deleteMany({});
    console.log('✅ Base de données nettoyée');
    
    // Création utilisateur admin
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await db.collection('users').insertOne({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      name: 'Administrateur',
      createdAt: new Date(),
      isActive: true
    });
    
    console.log('✅ Admin créé: admin@example.com / admin123');
    
    // Création utilisateur demo
    const demoPassword = await bcrypt.hash('demo123', 12);
    await db.collection('users').insertOne({
      email: 'demo@example.com',
      password: demoPassword,
      role: 'user',
      name: 'Utilisateur Demo',
      createdAt: new Date(),
      isActive: true
    });
    
    console.log('✅ User demo créé: demo@example.com / demo123');
    
    await client.close();
    console.log('🎯 Reset terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur reset DB:', error);
  }
}

resetDatabase();
