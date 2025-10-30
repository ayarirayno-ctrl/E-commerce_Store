import { Request, Response } from 'express';
import Category from '../models/Category';

export const categoryController = {
  // GET /api/categories - Get all categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find({ isActive: true })
        .populate('parent', 'name slug')
        .sort({ order: 1 });
      
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving categories' });
    }
  },

  // GET /api/categories/:id - Get category by ID
  async getCategoryById(req: Request, res: Response) {
    try {
      const category = await Category.findById(req.params.id).populate('parent', 'name slug');
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving category' });
    }
  },

  // POST /api/categories - Create new category (Admin only)
  async createCategory(req: Request, res: Response) {
    try {
      const { name, slug, description, parent, image, isActive, order } = req.body;

      // Check if category with same slug already exists
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this slug already exists' });
      }

      const category = new Category({
        name,
        slug,
        description,
        parent,
        image,
        isActive,
        order
      });

      await category.save();
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error creating category' });
    }
  },

  // PUT /api/categories/:id - Update category (Admin only)
  async updateCategory(req: Request, res: Response) {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error updating category' });
    }
  },

  // DELETE /api/categories/:id - Delete category (Admin only)
  async deleteCategory(req: Request, res: Response) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error deleting category' });
    }
  },

  // GET /api/categories/:id/subcategories - Get subcategories
  async getSubcategories(req: Request, res: Response) {
    try {
      const subcategories = await Category.find({ 
        parent: req.params.id,
        isActive: true 
      }).sort({ order: 1 });
      
      res.json(subcategories);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving subcategories' });
    }
  }
};
