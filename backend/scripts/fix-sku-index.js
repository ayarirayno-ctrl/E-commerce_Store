const mongoose = require('mongoose');
require('dotenv').config();

async function fixSkuIndex() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connecté à MongoDB');

    console.log('\n🔧 Réparation de l\'index SKU...');
    
    // Accéder à la collection products directement
    const db = mongoose.connection.db;
    const collection = db.collection('products');
    
    // Lister tous les index existants
    console.log('📋 Index existants :');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${index.name} - ${JSON.stringify(index.key)}`);
    });

    // Vérifier si l'index sku_1 existe
    const skuIndex = indexes.find(index => index.name === 'sku_1');
    
    if (skuIndex) {
      console.log('\n🗑️ Suppression de l\'index sku_1 problématique...');
      await collection.dropIndex('sku_1');
      console.log('✅ Index sku_1 supprimé');
    } else {
      console.log('\n✅ Aucun index sku_1 trouvé');
    }

    // Supprimer tous les produits avec des valeurs null dans sku
    console.log('\n🧹 Suppression des produits avec sku null...');
    const deleteResult = await collection.deleteMany({ sku: null });
    console.log(`✅ ${deleteResult.deletedCount} produits avec sku null supprimés`);

    const deleteResult2 = await collection.deleteMany({ sku: { $exists: false } });
    console.log(`✅ ${deleteResult2.deletedCount} produits sans champ sku supprimés`);

    console.log('\n🎉 Réparation terminée !');
    console.log('Vous pouvez maintenant relancer add-sample-products.js');

  } catch (error) {
    console.error('❌ Erreur lors de la réparation :', error);
  } finally {
    console.log('\n🔐 Fermeture de la connexion MongoDB...');
    await mongoose.disconnect();
    process.exit(0);
  }
}

console.log('🔧 SCRIPT DE RÉPARATION INDEX SKU');
console.log('=================================');
fixSkuIndex();