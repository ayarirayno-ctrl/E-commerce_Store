const { MongoClient } = require('mongodb'); 
 
async function cleanDatabase() { 
  const client = new MongoClient('mongodb://localhost:27017'); 
  try { 
    await client.connect(); 
    console.log('Connexion MongoDB reussie'); 
    const db = client.db('ecommerce'); 
    const productsResult = await db.collection('products').deleteMany({}); 
    console.log('Produits supprimes:', productsResult.deletedCount); 
    const usersResult = await db.collection('users').deleteMany({ email: { $ne: 'admin@example.com' } }); 
    console.log('Utilisateurs supprimes:', usersResult.deletedCount); 
    const ordersResult = await db.collection('orders').deleteMany({}); 
    console.log('Commandes supprimees:', ordersResult.deletedCount); 
    console.log('Base de donnees nettoyee'); 
  } catch (error) { 
    console.error('Erreur:', error.message); 
  } finally { 
    await client.close(); 
  } 
} 
 
cleanDatabase(); 
