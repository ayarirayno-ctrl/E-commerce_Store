import express from 'express';
import {
  getAllLogs,
  createLog,
  getLogsByAdmin,
  getLogsByModel,
  deleteLog,
  deleteOldLogs,
  getLogStats,
  getItemHistory,
} from '../controllers/adminLogController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Toutes les routes nécessitent une authentification admin
router.use(authMiddleware);

// Stats et historique (avant les routes paramétrées)
router.get('/stats', getLogStats);
router.get('/history/:model/:id', getItemHistory);

// Routes CRUD
router.get('/', getAllLogs);
router.post('/', createLog);

// Actions de nettoyage
router.delete('/old', deleteOldLogs);

// Routes par admin et par modèle
router.get('/admin/:adminId', getLogsByAdmin);
router.get('/model/:model', getLogsByModel);

// Supprimer un log spécifique
router.delete('/:id', deleteLog);

export default router;
