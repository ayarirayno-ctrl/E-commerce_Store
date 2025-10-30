import express from 'express';
import {
  registerClient,
  loginClient,
  getClientProfile,
  updateClientProfile,
  changePassword,
} from '../controllers/clientAuthController';
import { clientAuthMiddleware } from '../middleware/clientAuthMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerClient);
router.post('/login', loginClient);

// Protected routes (require authentication)
router.get('/profile', clientAuthMiddleware, getClientProfile);
router.put('/profile', clientAuthMiddleware, updateClientProfile);
router.put('/change-password', clientAuthMiddleware, changePassword);

export default router;
