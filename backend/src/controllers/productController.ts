import { Request, Response } from 'express';
import Product from '../models/Product';
import { validateProduct } from '../validators/productValidator';

export const productController = {
  // Récupérer tous les produits avec pagination
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const query: any = { isActive: true };
      
      // Filtres
      if (req.query.category) {
        query.category = req.query.category;
      }
      
      // Recherche par nom ou description
      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { tags: { $in: [new RegExp(req.query.search as string, 'i')] } }
        ];
      }

      // Filtrage par prix
      if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) {
          query.price.$gte = parseFloat(req.query.minPrice as string);
        }
        if (req.query.maxPrice) {
          query.price.$lte = parseFloat(req.query.maxPrice as string);
        }
      }

      const products = await Product.find(query)
        .populate('category', 'name')
        .sort(req.query.sort || '-createdAt')
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(query);

      res.json({
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving products' });
    }
  },

  // Récupérer un produit par ID
  getProductById: async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id).populate('category', 'name');
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving product' });
    }
  },

  // Créer un nouveau produit
  createProduct: async (req: Request, res: Response) => {
    try {
      const validation = validateProduct(req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  },

  // Mettre à jour un produit
  updateProduct: async (req: Request, res: Response) => {
    try {
      const validation = validateProduct(req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.errors });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  },

  // Supprimer un produit
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  },

  // Récupérer les catégories distinctes
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await Product.distinct('category');
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving categories' });
    }
  },

  // Récupérer les tags distincts
  getTags: async (req: Request, res: Response) => {
    try {
      const tags = await Product.distinct('tags');
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving tags' });
    }
  }
};