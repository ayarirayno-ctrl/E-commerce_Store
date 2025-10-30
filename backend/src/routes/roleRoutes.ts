import express from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRoleStats,
  assignRoleToUser,
  getAvailablePermissions,
} from '../controllers/roleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkRoleLevel } from '../middleware/roleMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// Toutes les routes nécessitent authentification et niveau admin élevé
router.use(authMiddleware);

// Routes des permissions
router.get('/permissions', getAvailablePermissions);

// Routes des rôles
router.get('/stats', getRoleStats);
router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.post('/', checkRoleLevel(100), createLogMiddleware('create', 'Role', 'Création d\'un rôle'), createRole);
router.put('/:id', checkRoleLevel(100), createLogMiddleware('update', 'Role', 'Modification d\'un rôle'), updateRole);
router.delete('/:id', checkRoleLevel(100), createLogMiddleware('delete', 'Role', 'Suppression d\'un rôle'), deleteRole);

// Assignation de rôle
router.post('/assign', checkRoleLevel(90), createLogMiddleware('update', 'User', 'Assignation de rôle'), assignRoleToUser);

export default router;
