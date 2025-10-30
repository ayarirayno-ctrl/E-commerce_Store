import express from 'express';
import {
  getAllContents,
  getContentById,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  getContentStats,
  reorderContents,
} from '../controllers/contentController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// Public routes
router.get('/public', getAllContents); // Pour frontend public
router.get('/slug/:slug', getContentBySlug);

// Admin routes (protected)
router.get('/stats', authMiddleware, getContentStats);
router.get('/', authMiddleware, getAllContents);
router.get('/:id', authMiddleware, getContentById);
router.post('/', authMiddleware, createLogMiddleware('create', 'Content', 'Création de contenu'), createContent);
router.put('/:id', authMiddleware, createLogMiddleware('update', 'Content', 'Modification de contenu'), updateContent);
router.delete('/:id', authMiddleware, createLogMiddleware('delete', 'Content', 'Suppression de contenu'), deleteContent);
router.post('/reorder', authMiddleware, createLogMiddleware('update', 'Content', 'Réorganisation du contenu'), reorderContents);

export default router;
