import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  sendInvoiceEmail
} from '../controllers/orderController.js';
import { protect, admin, emailVerified } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Routes utilisateur
router.post('/', protect, emailVerified, orderLimiter, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Routes admin
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/send-invoice', protect, admin, sendInvoiceEmail);

export default router;
