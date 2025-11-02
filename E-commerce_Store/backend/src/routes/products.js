import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { category, search, minPrice, maxPrice, inStock } = req.query;

    // Build filter
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    // Add cache headers for performance
    // Cache product list for 5 minutes on client, 10 minutes on CDN
    res.set({
      'Cache-Control': 'public, max-age=300, s-maxage=600',
      'ETag': `products-${Date.now()}-${page}`,
      'Vary': 'Accept-Encoding'
    });

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Cache individual product for 10 minutes on client, 30 minutes on CDN
    res.set({
      'Cache-Control': 'public, max-age=600, s-maxage=1800',
      'ETag': `product-${req.params.id}-${product.updatedAt?.getTime() || Date.now()}`,
      'Vary': 'Accept-Encoding'
    });

    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Error retrieving product' });
  }
});

export default router;
