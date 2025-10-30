import express from 'express';
import { clientController } from '../controllers/clientController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// All routes require authentication (Admin only)
router.get('/', authMiddleware, clientController.getAllClients);
router.get('/:id', authMiddleware, clientController.getClientById);
router.get('/:id/orders', authMiddleware, clientController.getClientOrders);
router.post('/', clientController.createClient); // Public for registration
router.put('/:id', authMiddleware, createLogMiddleware('update', 'Client', 'Modification d\'un client'), clientController.updateClient);
router.put('/:id/block', authMiddleware, createLogMiddleware('update', 'Client', 'Blocage/Déblocage d\'un client'), clientController.toggleBlockClient);
router.delete('/:id', authMiddleware, createLogMiddleware('delete', 'Client', 'Suppression d\'un client'), clientController.deleteClient);

export default router;
