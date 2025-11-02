import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/categories - Get all unique categories from products
router.get('/', async (req, res) => {
  try {
    // Get unique categories from products collection
    const categories = await Product.distinct('category');
    
    // Count products per category
    const categoriesWithCount = await Promise.all(
      categories.filter(cat => cat).map(async (category) => {
        const count = await Product.countDocuments({ category, stock: { $gt: 0 } });
        return {
          name: category,
          slug: String(category).toLowerCase().replace(/\s+/g, '-'),
          count
        };
      })
    );

    // Filter out categories with 0 products
    const activeCategories = categoriesWithCount.filter(cat => cat.count > 0);

    res.json({
      success: true,
      count: activeCategories.length,
      categories: activeCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// GET /api/categories/:slug - Get products by category
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Convert slug back to category name
    const category = slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Find products in this category
    const products = await Product.find({ 
      category: new RegExp(category, 'i'),
      stock: { $gt: 0 }
    })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments({ 
      category: new RegExp(category, 'i'),
      stock: { $gt: 0 }
    });

    res.json({
      success: true,
      category,
      products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
      }
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category products',
      error: error.message
    });
  }
});

export default router;
