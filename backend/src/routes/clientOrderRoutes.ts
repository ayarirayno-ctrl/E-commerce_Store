import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/clientOrderController';
import { clientAuthMiddleware } from '../middleware/clientAuthMiddleware';

const router = express.Router();

// All routes require authentication
router.use(clientAuthMiddleware);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
