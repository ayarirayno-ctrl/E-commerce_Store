import express from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authLimiter, passwordResetLimiter, emailVerificationLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/verify-email/:token', emailVerificationLimiter, verifyEmail);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, resetPassword);

// Check auth status
router.get('/check', protect, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
});

export default router;
