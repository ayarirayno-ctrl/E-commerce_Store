import express from 'express';
import { categoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/subcategories', categoryController.getSubcategories);

// Protected routes (Admin only)
router.post('/', authMiddleware, createLogMiddleware('create', 'Category', 'Création d\'une catégorie'), categoryController.createCategory);
router.put('/:id', authMiddleware, createLogMiddleware('update', 'Category', 'Modification d\'une catégorie'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, createLogMiddleware('delete', 'Category', 'Suppression d\'une catégorie'), categoryController.deleteCategory);

export default router;
