import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDatabase } from '../src/config/database';
import Product from '../src/models/Product';
import Category from '../src/models/Category';
import Client from '../src/models/Client';
import Admin from '../src/models/Admin';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connexion à MongoDB
    await connectDatabase();

    // Nettoyer les collections existantes
    console.log('🗑️  Cleaning existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Client.deleteMany({});
    // Ne pas supprimer les admins pour garder celui créé

    // Créer des catégories
    console.log('📁 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        isActive: true,
        order: 1
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        isActive: true,
        order: 2
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        isActive: true,
        order: 3
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and accessories',
        isActive: true,
        order: 4
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Books and educational materials',
        isActive: true,
        order: 5
      }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Créer des produits
    console.log('\n📦 Creating products...');
    const products = await Product.insertMany([
      // Electronics
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30h battery life',
        price: 199.99,
        comparePrice: 249.99,
        category: categories[0]._id,
        stock: 50,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=Headphones',
          public_id: 'headphones-1',
          isMain: true
        }],
        sku: 'ELEC-WH-001',
        isActive: true,
        tags: ['wireless', 'audio', 'premium'],
        attributes: [
          { name: 'Battery Life', value: '30 hours' },
          { name: 'Bluetooth', value: '5.0' }
        ]
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracker with heart rate monitor and GPS',
        price: 299.99,
        category: categories[0]._id,
        stock: 30,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=SmartWatch',
          public_id: 'watch-1',
          isMain: true
        }],
        sku: 'ELEC-SW-002',
        isActive: true,
        tags: ['fitness', 'wearable', 'smart'],
        attributes: [
          { name: 'Display', value: 'AMOLED' },
          { name: 'Water Resistance', value: 'IP68' }
        ]
      },
      {
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand',
        price: 49.99,
        category: categories[0]._id,
        stock: 100,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=LaptopStand',
          public_id: 'stand-1',
          isMain: true
        }],
        sku: 'ELEC-LS-003',
        isActive: true,
        tags: ['accessories', 'ergonomic'],
        attributes: [
          { name: 'Material', value: 'Aluminum' },
          { name: 'Compatible', value: 'All laptops' }
        ]
      },

      // Clothing
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% organic cotton t-shirt',
        price: 24.99,
        category: categories[1]._id,
        stock: 200,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=TShirt',
          public_id: 'tshirt-1',
          isMain: true
        }],
        sku: 'CLO-TS-001',
        isActive: true,
        tags: ['casual', 'cotton', 'organic'],
        attributes: [
          { name: 'Material', value: '100% Cotton' },
          { name: 'Sizes', value: 'S, M, L, XL' }
        ]
      },
      {
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans',
        price: 59.99,
        comparePrice: 79.99,
        category: categories[1]._id,
        stock: 150,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=Jeans',
          public_id: 'jeans-1',
          isMain: true
        }],
        sku: 'CLO-JE-002',
        isActive: true,
        tags: ['denim', 'casual'],
        attributes: [
          { name: 'Fit', value: 'Classic' },
          { name: 'Sizes', value: '28-40' }
        ]
      },

      // Home & Garden
      {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with USB charging',
        price: 39.99,
        category: categories[2]._id,
        stock: 80,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=DeskLamp',
          public_id: 'lamp-1',
          isMain: true
        }],
        sku: 'HOME-DL-001',
        isActive: true,
        tags: ['lighting', 'office'],
        attributes: [
          { name: 'Power', value: '10W' },
          { name: 'Features', value: 'Dimmable, USB charging' }
        ]
      },
      {
        name: 'Garden Tools Set',
        description: 'Complete 5-piece garden tools set',
        price: 79.99,
        category: categories[2]._id,
        stock: 40,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=GardenTools',
          public_id: 'tools-1',
          isMain: true
        }],
        sku: 'HOME-GT-002',
        isActive: true,
        tags: ['gardening', 'tools'],
        attributes: [
          { name: 'Pieces', value: '5' },
          { name: 'Material', value: 'Stainless Steel' }
        ]
      },

      // Sports
      {
        name: 'Yoga Mat',
        description: 'Non-slip eco-friendly yoga mat',
        price: 34.99,
        category: categories[3]._id,
        stock: 120,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=YogaMat',
          public_id: 'yoga-1',
          isMain: true
        }],
        sku: 'SPO-YM-001',
        isActive: true,
        tags: ['yoga', 'fitness', 'eco-friendly'],
        attributes: [
          { name: 'Thickness', value: '6mm' },
          { name: 'Material', value: 'TPE' }
        ]
      },
      {
        name: 'Dumbbell Set',
        description: 'Adjustable dumbbell set 5-25kg',
        price: 149.99,
        category: categories[3]._id,
        stock: 25,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=Dumbbells',
          public_id: 'dumbbell-1',
          isMain: true
        }],
        sku: 'SPO-DB-002',
        isActive: true,
        tags: ['fitness', 'weights'],
        attributes: [
          { name: 'Weight Range', value: '5-25kg' },
          { name: 'Adjustable', value: 'Yes' }
        ]
      },

      // Books
      {
        name: 'Web Development Guide',
        description: 'Complete guide to modern web development',
        price: 44.99,
        category: categories[4]._id,
        stock: 60,
        images: [{
          url: 'https://via.placeholder.com/400x400?text=WebDevBook',
          public_id: 'book-1',
          isMain: true
        }],
        sku: 'BOOK-WD-001',
        isActive: true,
        tags: ['programming', 'education', 'web'],
        attributes: [
          { name: 'Pages', value: '450' },
          { name: 'Format', value: 'Paperback' }
        ]
      }
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Créer des clients de test
    console.log('\n👥 Creating test clients...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const clients = await Client.insertMany([
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        address: '123 Main St, New York, NY 10001',
        phone: '+1 234 567 8900',
        blocked: false
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        address: '456 Oak Ave, Los Angeles, CA 90001',
        phone: '+1 234 567 8901',
        blocked: false
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        password: hashedPassword,
        address: '789 Pine Rd, Chicago, IL 60601',
        phone: '+1 234 567 8902',
        blocked: false
      }
    ]);
    console.log(`✅ Created ${clients.length} test clients`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Clients: ${clients.length}`);
    console.log('\n🔑 Test client credentials:');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
