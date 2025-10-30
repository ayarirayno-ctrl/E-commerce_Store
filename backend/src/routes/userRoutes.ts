import express from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import createLogMiddleware from '../middleware/logMiddleware';

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, createLogMiddleware('update', 'User', 'Modification du profil'), userController.updateProfile);
router.post('/profile/address', authMiddleware, createLogMiddleware('create', 'User', 'Ajout d\'une adresse'), userController.addAddress);
router.put('/profile/address/:addressId', authMiddleware, createLogMiddleware('update', 'User', 'Modification d\'une adresse'), userController.updateAddress);
router.delete('/profile/address/:addressId', authMiddleware, createLogMiddleware('delete', 'User', 'Suppression d\'une adresse'), userController.deleteAddress);
router.put('/change-password', authMiddleware, createLogMiddleware('update', 'User', 'Changement de mot de passe'), userController.changePassword);

export default router;