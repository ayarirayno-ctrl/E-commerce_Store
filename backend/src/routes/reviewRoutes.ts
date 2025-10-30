import express from 'express';
import { reviewController } from '../controllers/reviewController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authMiddleware, createLogMiddleware('create', 'Review', 'Création d\'un avis'), reviewController.createReview);
router.get('/my-reviews', authMiddleware, reviewController.getUserReviews);

// Admin routes (must be before parameterized routes)
router.get('/admin/all', authMiddleware, reviewController.getAllReviews);
router.get('/stats', authMiddleware, reviewController.getReviewStats);

// Parameterized routes
router.get('/product/:productId', reviewController.getProductReviews);
router.put('/:id', authMiddleware, createLogMiddleware('update', 'Review', 'Modification d\'un avis'), reviewController.updateReview);
router.delete('/:id', authMiddleware, createLogMiddleware('delete', 'Review', 'Suppression d\'un avis'), reviewController.deleteReview);
router.post('/:id/helpful', reviewController.markHelpful);
router.post('/:id/report', reviewController.reportReview);
router.patch('/:id/approve', authMiddleware, createLogMiddleware('update', 'Review', 'Approbation d\'un avis'), reviewController.approveReview);
router.patch('/:id/reject', authMiddleware, createLogMiddleware('update', 'Review', 'Rejet d\'un avis'), reviewController.rejectReview);
router.put('/admin/:id/moderate', authMiddleware, createLogMiddleware('update', 'Review', 'Modération d\'un avis'), reviewController.moderateReview);
router.post('/:id/response', authMiddleware, createLogMiddleware('create', 'Review', 'Réponse à un avis'), reviewController.respondToReview);
router.post('/admin/:id/respond', authMiddleware, createLogMiddleware('create', 'Review', 'Réponse admin à un avis'), reviewController.respondToReview);

export default router;