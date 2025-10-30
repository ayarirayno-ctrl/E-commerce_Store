import express from 'express';
import { loginAdmin, getCurrentAdmin } from '../controllers/authController';
import { protect } from '../middlewares/auth';
import { logLogin } from '../middleware/logMiddleware';

const router = express.Router();

router.post('/login', logLogin, loginAdmin);
router.get('/me', protect, getCurrentAdmin);

export default router;