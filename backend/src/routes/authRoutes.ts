import express from 'express';
import { 
  loginAdmin, 
  getCurrentAdmin, 
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword 
} from '../controllers/authController';
import { protect } from '../middlewares/auth';
import { logLogin } from '../middleware/logMiddleware';

const router = express.Router();

// Public routes
router.post('/login', logLogin, loginAdmin);
router.post('/forgot-password', forgotAdminPassword);
router.post('/reset-password', resetAdminPassword);

// Protected routes
router.get('/me', protect, getCurrentAdmin);
router.put('/change-password', protect, changeAdminPassword);

export default router;