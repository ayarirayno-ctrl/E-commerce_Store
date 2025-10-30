import { Request, Response } from 'express';
import AdminLog from '../models/AdminLog';

// Récupérer tous les logs avec filtres
export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const { action, targetModel, adminId, startDate, endDate, limit = '100' } = req.query;
    const filter: any = {};

    if (action) filter.action = action;
    if (targetModel) filter.targetModel = targetModel;
    if (adminId) filter.adminId = adminId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const logs = await AdminLog.find(filter)
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    const total = await AdminLog.countDocuments(filter);

    res.json({
      logs,
      total,
      count: logs.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs', error });
  }
};

// Créer un log
export const createLog = async (req: Request, res: Response) => {
  try {
    const { action, adminId, adminEmail, targetModel, targetId, changes, description, ipAddress, userAgent } = req.body;

    const log = new AdminLog({
      action,
      adminId,
      adminEmail,
      targetModel,
      targetId,
      changes,
      description,
      ipAddress,
      userAgent,
    });

    await log.save();

    res.status(201).json({
      message: 'Log créé avec succès',
      log,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du log', error });
  }
};

// Récupérer les logs par admin
export const getLogsByAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const { limit = '50' } = req.query;

    const logs = await AdminLog.find({ adminId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json({
      logs,
      total: logs.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs', error });
  }
};

// Récupérer les logs par modèle
export const getLogsByModel = async (req: Request, res: Response) => {
  try {
    const { model } = req.params;
    const { targetId, limit = '50' } = req.query;

    const filter: any = { targetModel: model };
    if (targetId) filter.targetId = targetId;

    const logs = await AdminLog.find(filter)
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json({
      logs,
      total: logs.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs', error });
  }
};

// Supprimer un log
export const deleteLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const log = await AdminLog.findByIdAndDelete(id);

    if (!log) {
      return res.status(404).json({ message: 'Log non trouvé' });
    }

    res.json({ message: 'Log supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du log', error });
  }
};

// Supprimer les anciens logs
export const deleteOldLogs = async (req: Request, res: Response) => {
  try {
    const { days = '90' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const result = await AdminLog.deleteMany({ createdAt: { $lt: daysAgo } });

    res.json({
      message: `Logs de plus de ${days} jours supprimés avec succès`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression des logs', error });
  }
};

// Obtenir les statistiques des logs
export const getLogStats = async (req: Request, res: Response) => {
  try {
    const total = await AdminLog.countDocuments();
    
    const byAction = await AdminLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
    ]);

    const byModel = await AdminLog.aggregate([
      {
        $group: {
          _id: '$targetModel',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const byAdmin = await AdminLog.aggregate([
      {
        $group: {
          _id: '$adminId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Logs des 24 dernières heures
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const recentCount = await AdminLog.countDocuments({ createdAt: { $gte: last24Hours } });

    // Logs des 7 derniers jours
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const weekCount = await AdminLog.countDocuments({ createdAt: { $gte: last7Days } });

    res.json({
      total,
      last24Hours: recentCount,
      last7Days: weekCount,
      byAction,
      byModel,
      byAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error });
  }
};

// Obtenir l'historique d'un élément spécifique
export const getItemHistory = async (req: Request, res: Response) => {
  try {
    const { model, id } = req.params;

    const logs = await AdminLog.find({
      targetModel: model,
      targetId: id,
    })
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      logs,
      total: logs.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique', error });
  }
};
