import { Request, Response } from 'express';
import Notification from '../models/Notification';

// Récupérer toutes les notifications
export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const { type, isRead, priority } = req.query;
    const filter: any = {};

    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (priority) filter.priority = priority;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      notifications,
      total: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error });
  }
};

// Créer une notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { type, title, message, priority, relatedId, relatedModel, actionUrl, adminId } = req.body;

    const notification = new Notification({
      type,
      title,
      message,
      priority: priority || 'medium',
      relatedId,
      relatedModel,
      actionUrl,
      adminId,
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification créée avec succès',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la notification', error });
  }
};

// Marquer une notification comme lue
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { 
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({
      message: 'Notification marquée comme lue',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification', error });
  }
};

// Marquer toutes les notifications comme lues
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { 
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des notifications', error });
  }
};

// Supprimer une notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la notification', error });
  }
};

// Supprimer toutes les notifications lues
export const deleteReadNotifications = async (req: Request, res: Response) => {
  try {
    const result = await Notification.deleteMany({ isRead: true });

    res.json({ 
      message: 'Notifications lues supprimées avec succès',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression des notifications', error });
  }
};

// Obtenir le nombre de notifications non lues
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du comptage des notifications', error });
  }
};

// Obtenir les statistiques des notifications
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const total = await Notification.countDocuments();
    const unread = await Notification.countDocuments({ isRead: false });
    const byType = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);
    const byPriority = await Notification.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      unread,
      read: total - unread,
      byType,
      byPriority,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error });
  }
};
