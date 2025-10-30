import express from 'express';
import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotionCode,
  getPromotionStats,
} from '../controllers/promotionController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// Public routes
router.post('/validate', validatePromotionCode);

// Protected routes (admin only)
router.get('/', authMiddleware, getAllPromotions);
router.get('/stats', authMiddleware, getPromotionStats);
router.get('/:id', authMiddleware, getPromotionById);
router.post('/', authMiddleware, createLogMiddleware('create', 'Promotion', 'Création d\'une promotion'), createPromotion);
router.put('/:id', authMiddleware, createLogMiddleware('update', 'Promotion', 'Modification d\'une promotion'), updatePromotion);
router.delete('/:id', authMiddleware, createLogMiddleware('delete', 'Promotion', 'Suppression d\'une promotion'), deletePromotion);

export default router;
