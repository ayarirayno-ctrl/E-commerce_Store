import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('🗑️ Suppression des produits et utilisateurs de test...');

    // Supprimer tous les produits
    const productsDeleted = await mongoose.connection.db.collection('products').deleteMany({});
    console.log(`✅ ${productsDeleted.deletedCount} produits supprimés`);

    // Supprimer tous les utilisateurs de test (garder les admins)
    const usersDeleted = await mongoose.connection.db.collection('users').deleteMany({
      role: { $ne: 'admin' }
    });
    console.log(`✅ ${usersDeleted.deletedCount} utilisateurs de test supprimés`);

    // Supprimer les paniers
    const cartsDeleted = await mongoose.connection.db.collection('carts').deleteMany({});
    console.log(`✅ ${cartsDeleted.deletedCount} paniers supprimés`);

    // Supprimer les commandes de test
    const ordersDeleted = await mongoose.connection.db.collection('orders').deleteMany({});
    console.log(`✅ ${ordersDeleted.deletedCount} commandes supprimées`);

    console.log('🎉 Base de données nettoyée avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    process.exit(0);
  }
}

clearDatabase();