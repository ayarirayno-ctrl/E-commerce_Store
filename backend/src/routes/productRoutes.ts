import express from 'express';
import { productController } from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// Routes publiques
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/tags', productController.getTags);
router.get('/:id', productController.getProductById);

// Routes protégées (nécessitent une authentification)
router.post('/', authMiddleware, createLogMiddleware('create', 'Product', 'Création d\'un produit'), productController.createProduct);
router.put('/:id', authMiddleware, createLogMiddleware('update', 'Product', 'Modification d\'un produit'), productController.updateProduct);
router.delete('/:id', authMiddleware, createLogMiddleware('delete', 'Product', 'Suppression d\'un produit'), productController.deleteProduct);

export default router;