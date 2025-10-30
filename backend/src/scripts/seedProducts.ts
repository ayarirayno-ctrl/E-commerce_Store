import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import Category from '../models/Category';
import productsData from '../../../E-commerce_Store/src/data/products.json';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_store';

/**
 * Seed products and categories from products.json
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing products and categories...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared existing data');

    // Extract unique categories from products
    const categoriesSet = new Set<string>();
    productsData.products.forEach(product => {
      if (product.category) {
        categoriesSet.add(product.category);
      }
    });

    // Create categories
    console.log('📦 Creating categories...');
    const categoryMap = new Map<string, string>();
    
    for (const categoryName of categoriesSet) {
      const category = await Category.create({
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
        description: `Browse our ${categoryName} collection`,
        image: 'https://via.placeholder.com/400x200?text=' + categoryName,
        isActive: true,
        displayOrder: 0
      });
      categoryMap.set(categoryName, category._id.toString());
      console.log(`  ✓ Created category: ${category.name}`);
    }

    // Create products
    console.log('📱 Creating products...');
    let createdCount = 0;
    
    for (const productData of productsData.products) {
      try {
        const categoryId = categoryMap.get(productData.category);
        
        if (!categoryId) {
          console.log(`  ⚠️  Skipping product "${productData.title}" - category not found`);
          continue;
        }
        
        await Product.create({
          name: productData.title,
          description: productData.description,
          price: productData.price,
          comparePrice: productData.discountPercentage > 0 
            ? productData.price 
            : undefined,
          category: categoryId,
          stock: productData.stock,
          images: (productData.images || [productData.thumbnail]).map((url, index) => ({
            url: url,
            public_id: `product_${productData.id}_${index}`,
            isMain: index === 0
          })),
          sku: `SKU-${String(productData.id).padStart(6, '0')}`,
          isActive: true,
          tags: [productData.category, productData.brand].filter(Boolean),
          attributes: [
            { name: 'Brand', value: productData.brand },
            { name: 'Rating', value: productData.rating.toString() }
          ]
        });
        
        createdCount++;
        if (createdCount % 10 === 0) {
          console.log(`  ✓ Created ${createdCount} products...`);
        }
      } catch (error) {
        console.error(`  ✗ Error creating product "${productData.title}":`, error);
      }
    }

    console.log(`\n✅ Successfully seeded database!`);
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categoriesSet.size}`);
    console.log(`   - Products: ${createdCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
