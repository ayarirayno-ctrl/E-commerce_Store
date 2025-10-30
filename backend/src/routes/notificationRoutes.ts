import express from 'express';
import {
  getAllNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadCount,
  getNotificationStats,
} from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Toutes les routes nécessitent une authentification admin
router.use(authMiddleware);

// Stats et compteurs (avant les routes paramétrées)
router.get('/stats', getNotificationStats);
router.get('/unread-count', getUnreadCount);

// Routes CRUD
router.get('/', getAllNotifications);
router.post('/', createNotification);

// Actions sur toutes les notifications
router.patch('/read-all', markAllAsRead);
router.delete('/read', deleteReadNotifications);

// Actions sur une notification spécifique
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
