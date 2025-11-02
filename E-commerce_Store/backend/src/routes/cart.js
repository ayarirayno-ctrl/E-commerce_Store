import express from 'express';
import { 
  saveAbandonedCart, 
  markCartAsConverted,
  getAbandonedCarts,
  sendAbandonedCartEmails
} from '../controllers/cartController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Routes utilisateur
router.post('/save', protect, saveAbandonedCart);
router.post('/converted', protect, markCartAsConverted);

// Routes admin
router.get('/abandoned', protect, admin, getAbandonedCarts);
router.post('/send-abandoned-emails', protect, admin, sendAbandonedCartEmails);

export default router;
