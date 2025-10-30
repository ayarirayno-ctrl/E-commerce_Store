import express from 'express';
import { orderController } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User routes
router.post('/', createLogMiddleware('create', 'Order', 'Création d\'une commande'), orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', createLogMiddleware('update', 'Order', 'Annulation d\'une commande'), orderController.cancelOrder);

// Admin routes (these will need admin role check middleware)
router.get('/admin/all', orderController.getAllOrders);
router.put('/admin/:id/status', createLogMiddleware('update', 'Order', 'Mise à jour du statut de commande'), orderController.updateOrderStatus);
router.get('/admin/stats', orderController.getOrderStats);

export default router;