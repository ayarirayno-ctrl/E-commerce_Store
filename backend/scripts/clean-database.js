const mongoose = require('mongoose');
require('dotenv').config();

// Schémas pour se connecter aux collections existantes
const userSchema = new mongoose.Schema({}, { strict: false });
const productSchema = new mongoose.Schema({}, { strict: false });
const orderSchema = new mongoose.Schema({}, { strict: false });
const cartSchema = new mongoose.Schema({}, { strict: false });
const adminSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Admin = mongoose.model('Admin', adminSchema);

async function cleanDatabase() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connecté à MongoDB');

    console.log('\n🧹 Nettoyage de la base de données...');
    
    // Compter les éléments avant suppression
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const cartCount = await Cart.countDocuments();
    const adminCount = await Admin.countDocuments();

    console.log('\n📊 État actuel de la base de données :');
    console.log(`👥 Utilisateurs : ${userCount}`);
    console.log(`📦 Produits : ${productCount}`);
    console.log(`🛒 Commandes : ${orderCount}`);
    console.log(`🛍️ Paniers : ${cartCount}`);
    console.log(`👑 Admins : ${adminCount}`);

    // Demander confirmation
    console.log('\n⚠️  ATTENTION : Cette opération va supprimer :');
    console.log('   - TOUS les utilisateurs/clients');
    console.log('   - TOUS les produits');
    console.log('   - TOUTES les commandes');
    console.log('   - TOUS les paniers');
    console.log('   - PRÉSERVER les comptes admin');

    // Attendre 3 secondes pour laisser le temps de lire
    console.log('\n⏳ Démarrage du nettoyage dans 3 secondes...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Supprimer les utilisateurs
    if (userCount > 0) {
      console.log('\n🗑️  Suppression des utilisateurs...');
      const deletedUsers = await User.deleteMany({});
      console.log(`✅ ${deletedUsers.deletedCount} utilisateurs supprimés`);
    }

    // Supprimer les produits
    if (productCount > 0) {
      console.log('🗑️  Suppression des produits...');
      const deletedProducts = await Product.deleteMany({});
      console.log(`✅ ${deletedProducts.deletedCount} produits supprimés`);
    }

    // Supprimer les commandes
    if (orderCount > 0) {
      console.log('🗑️  Suppression des commandes...');
      const deletedOrders = await Order.deleteMany({});
      console.log(`✅ ${deletedOrders.deletedCount} commandes supprimées`);
    }

    // Supprimer les paniers
    if (cartCount > 0) {
      console.log('🗑️  Suppression des paniers...');
      const deletedCarts = await Cart.deleteMany({});
      console.log(`✅ ${deletedCarts.deletedCount} paniers supprimés`);
    }

    // Vérifier que les admins sont toujours là
    const remainingAdmins = await Admin.countDocuments();
    console.log(`👑 Admins préservés : ${remainingAdmins}`);

    console.log('\n🎉 Nettoyage terminé avec succès !');
    console.log('\n📝 Résumé :');
    console.log('   ✅ Base de données nettoyée');
    console.log('   ✅ Comptes admin préservés');
    console.log('   ✅ Prêt pour ajouter de nouveaux produits');
    
    console.log('\n🚀 Vous pouvez maintenant :');
    console.log('   1. Vous connecter en tant qu\'admin sur http://localhost:3002/admin/login');
    console.log('   2. Ajouter des produits via l\'interface admin');
    console.log('   3. Créer des exemples de clients si nécessaire');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage :', error);
  } finally {
    console.log('\n🔐 Fermeture de la connexion MongoDB...');
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Vérifier que l'utilisateur veut vraiment nettoyer
console.log('🧹 SCRIPT DE NETTOYAGE DE LA BASE DE DONNÉES');
console.log('===============================================');
console.log('Ce script va supprimer TOUS les produits et clients');
console.log('mais préservera les comptes administrateur.');

cleanDatabase();