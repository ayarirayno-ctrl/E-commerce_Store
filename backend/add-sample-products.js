const { MongoClient } = require('mongodb');

// URI de connexion MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    price: 1299,
    description: 'Le dernier iPhone avec puce A17 Pro et appareil photo professionnel',
    category: 'Smartphones',
    imageUrl: '/images/iphone-15-pro.jpg',
    sku: 'IPHONE15PRO-001',
    stock: 50,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 1199,
    description: 'Smartphone Android haut de gamme avec S Pen intégré',
    category: 'Smartphones',
    imageUrl: '/images/galaxy-s24-ultra.jpg',
    sku: 'GALAXY-S24-001',
    stock: 30,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'MacBook Air M3',
    price: 1299,
    description: 'Ordinateur portable ultra-fin avec puce M3 et autonomie exceptionnelle',
    category: 'Ordinateurs',
    imageUrl: '/images/macbook-air-m3.jpg',
    sku: 'MACBOOKM3-001',
    stock: 25,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'iPad Pro 12.9"',
    price: 999,
    description: 'Tablette professionnelle avec écran Liquid Retina XDR',
    category: 'Tablettes',
    imageUrl: '/images/ipad-pro-12.jpg',
    sku: 'IPADPRO-129-001',
    stock: 40,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'AirPods Pro 2',
    price: 279,
    description: 'Écouteurs sans fil avec réduction de bruit active',
    category: 'Audio',
    imageUrl: '/images/airpods-pro-2.jpg',
    sku: 'AIRPODSPRO2-001',
    stock: 100,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Apple Watch Series 9',
    price: 449,
    description: 'Montre connectée avec écran Retina Always-On',
    category: 'Wearables',
    imageUrl: '/images/apple-watch-s9.jpg',
    sku: 'APPLEWATCH-S9-001',
    stock: 75,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Sony WH-1000XM5',
    price: 399,
    description: 'Casque audio premium avec réduction de bruit leader du marché',
    category: 'Audio',
    imageUrl: '/images/sony-wh1000xm5.jpg',
    sku: 'SONYWH-1000XM5-001',
    stock: 60,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Dell XPS 13',
    price: 1099,
    description: 'Ultrabook Windows avec écran InfinityEdge et performances élevées',
    category: 'Ordinateurs',
    imageUrl: '/images/dell-xps-13.jpg',
    sku: 'DELLXPS13-001',
    stock: 35,
    isActive: true,
    createdAt: new Date()
  }
];

async function addSampleProducts() {
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db('ecommerce_store');
    const productsCollection = db.collection('products');

    // Supprimer tous les produits existants
    await productsCollection.deleteMany({});
    console.log('🗑️  Anciens produits supprimés');

    // Ajouter les nouveaux produits d'exemple
    const result = await productsCollection.insertMany(sampleProducts);
    console.log(`✅ ${result.insertedCount} produits d'exemple ajoutés avec succès`);

    // Afficher les produits ajoutés
    console.log('\n📦 Produits ajoutés:');
    sampleProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - €${product.price}`);
    });

    console.log('\n🎉 Base de données mise à jour avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('🔌 Connexion fermée');
  }
}

addSampleProducts();