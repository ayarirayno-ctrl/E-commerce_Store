const mongoose = require('mongoose');
require('dotenv').config();

// Schéma de produit (adapté à votre structure)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 100 },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  tags: [String],
  specifications: {
    brand: String,
    model: String,
    color: String,
    warranty: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Produits d'exemple à ajouter
const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    sku: "APPLE-IPHONE15PM-256",
    description: "Le smartphone le plus avancé d'Apple avec un appareil photo révolutionnaire et un design en titane.",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500",
    category: "smartphones",
    stock: 50,
    featured: true,
    rating: 4.8,
    reviews: 127,
    tags: ["apple", "premium", "5g", "pro"],
    specifications: {
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      color: "Titane Naturel",
      warranty: "2 ans"
    }
  },
  {
    name: "MacBook Air M3",
    sku: "APPLE-MBA-M3-512",
    description: "Ordinateur portable ultra-fin avec la puissante puce M3 d'Apple. Performance exceptionnelle et autonomie incroyable.",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    category: "ordinateurs",
    stock: 30,
    featured: true,
    rating: 4.9,
    reviews: 89,
    tags: ["apple", "laptop", "m3", "portable"],
    specifications: {
      brand: "Apple",
      model: "MacBook Air 13\"",
      color: "Gris Sidéral",
      warranty: "2 ans"
    }
  },
  {
    name: "AirPods Pro 2",
    sku: "APPLE-AIRPODS-PRO2",
    description: "Écouteurs sans fil avec réduction de bruit adaptative et son spatial personnalisé.",
    price: 279.99,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500",
    category: "audio",
    stock: 100,
    featured: false,
    rating: 4.7,
    reviews: 256,
    tags: ["apple", "airpods", "noise-cancelling", "wireless"],
    specifications: {
      brand: "Apple",
      model: "AirPods Pro 2ème génération",
      color: "Blanc",
      warranty: "1 an"
    }
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    sku: "SAMSUNG-GS24U-512",
    description: "Smartphone Android haut de gamme avec S Pen intégré et appareil photo 200MP.",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
    category: "smartphones",
    stock: 40,
    featured: true,
    rating: 4.6,
    reviews: 178,
    tags: ["samsung", "android", "s-pen", "camera"],
    specifications: {
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      color: "Noir Titanium",
      warranty: "2 ans"
    }
  },
  {
    name: "Sony WH-1000XM5",
    sku: "SONY-WH1000XM5-BLK",
    description: "Casque sans fil premium avec la meilleure réduction de bruit du marché.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
    category: "audio",
    stock: 75,
    featured: false,
    rating: 4.8,
    reviews: 145,
    tags: ["sony", "headphones", "noise-cancelling", "premium"],
    specifications: {
      brand: "Sony",
      model: "WH-1000XM5",
      color: "Noir",
      warranty: "2 ans"
    }
  },
  {
    name: "Dell XPS 13",
    sku: "DELL-XPS13-9320-I7",
    description: "Ultrabook Windows élégant avec écran InfinityEdge et performances exceptionnelles.",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    category: "ordinateurs",
    stock: 25,
    featured: false,
    rating: 4.5,
    reviews: 92,
    tags: ["dell", "windows", "ultrabook", "business"],
    specifications: {
      brand: "Dell",
      model: "XPS 13 9320",
      color: "Argent Platine",
      warranty: "3 ans"
    }
  },
  {
    name: "iPad Pro 12.9\"",
    sku: "APPLE-IPADPRO-129-M2",
    description: "Tablette professionnelle avec puce M2 et écran Liquid Retina XDR.",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    category: "tablettes",
    stock: 60,
    featured: true,
    rating: 4.7,
    reviews: 134,
    tags: ["apple", "ipad", "m2", "professional"],
    specifications: {
      brand: "Apple",
      model: "iPad Pro 12.9\" 6ème génération",
      color: "Gris Sidéral",
      warranty: "2 ans"
    }
  },
  {
    name: "Apple Watch Series 9",
    sku: "APPLE-WATCH-S9-45MM",
    description: "Montre connectée la plus avancée avec mesure d'oxygène dans le sang et ECG.",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500",
    category: "wearables",
    stock: 80,
    featured: false,
    rating: 4.6,
    reviews: 198,
    tags: ["apple", "smartwatch", "health", "fitness"],
    specifications: {
      brand: "Apple",
      model: "Apple Watch Series 9 45mm",
      color: "Minuit",
      warranty: "1 an"
    }
  }
];

async function addSampleProducts() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connecté à MongoDB');

    console.log('\n📦 Ajout des produits d\'exemple...');

    // Vérifier s'il y a déjà des produits
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`⚠️  Il y a déjà ${existingProducts} produits dans la base.`);
      console.log('   Utilisez d\'abord le script clean-database.js pour nettoyer.');
      return;
    }

    // Ajouter les produits d'exemple
    console.log(`🛒 Ajout de ${sampleProducts.length} produits...`);
    
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];
      await Product.create(product);
      console.log(`✅ ${i + 1}/${sampleProducts.length} - ${product.name} ajouté`);
    }

    // Afficher un résumé
    const totalProducts = await Product.countDocuments();
    const categories = await Product.distinct('category');
    
    console.log('\n🎉 Produits d\'exemple ajoutés avec succès !');
    console.log(`📊 Total de produits : ${totalProducts}`);
    console.log(`🏷️  Catégories : ${categories.join(', ')}`);
    
    console.log('\n🌟 Produits phares ajoutés :');
    const featuredProducts = await Product.find({ featured: true }).select('name price category');
    featuredProducts.forEach(product => {
      console.log(`   • ${product.name} - €${product.price} (${product.category})`);
    });

    console.log('\n🚀 Vous pouvez maintenant :');
    console.log('   1. Voir les produits sur votre site : http://localhost:3002');
    console.log('   2. Gérer les produits via l\'admin : http://localhost:3002/admin');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des produits :', error);
  } finally {
    console.log('\n🔐 Fermeture de la connexion MongoDB...');
    await mongoose.disconnect();
    process.exit(0);
  }
}

console.log('📦 SCRIPT D\'AJOUT DE PRODUITS D\'EXEMPLE');
console.log('========================================');
console.log('Ce script va ajouter 8 produits d\'exemple dans votre base de données.');

addSampleProducts();