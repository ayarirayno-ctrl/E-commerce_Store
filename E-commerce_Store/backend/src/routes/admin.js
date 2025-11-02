import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { sendStockAlert } from '../controllers/stockController.js';

const router = express.Router();

// @desc    Obtenir tous les clients (utilisateurs non-admin)
// @route   GET /api/admin/clients
// @access  Private/Admin
router.get('/clients', protect, admin, async (req, res) => {
  try {
    const clients = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    // Enrichir avec le nombre de commandes et total dépensé
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const orders = await Order.find({ user: client._id });
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        return {
          _id: client._id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          isEmailVerified: client.isEmailVerified,
          role: client.role,
          createdAt: client.createdAt,
          lastLogin: client.lastLogin,
          totalOrders,
          totalSpent: parseFloat(totalSpent.toFixed(2)),
        };
      })
    );

    res.json({
      success: true,
      count: clientsWithStats.length,
      clients: clientsWithStats,
    });
  } catch (error) {
    console.error('Erreur récupération clients:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des clients' 
    });
  }
});

// @desc    Obtenir les clients bloqués
// @route   GET /api/admin/clients/blocked
// @access  Private/Admin
router.get('/clients/blocked', protect, admin, async (req, res) => {
  try {
    const blockedClients = await User.find({ 
      role: { $ne: 'admin' },
      isBlocked: true 
    })
      .select('-password')
      .sort({ createdAt: -1 });

    // Enrichir avec le nombre de commandes et total dépensé
    const clientsWithStats = await Promise.all(
      blockedClients.map(async (client) => {
        const orders = await Order.find({ user: client._id });
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        return {
          _id: client._id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          isEmailVerified: client.isEmailVerified,
          isBlocked: client.isBlocked,
          role: client.role,
          createdAt: client.createdAt,
          lastLogin: client.lastLogin,
          totalOrders,
          totalSpent: parseFloat(totalSpent.toFixed(2)),
        };
      })
    );

    res.json({
      success: true,
      count: clientsWithStats.length,
      clients: clientsWithStats,
    });
  } catch (error) {
    console.error('Erreur récupération clients bloqués:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des clients bloqués' 
    });
  }
});

// @desc    Obtenir un client par ID
// @route   GET /api/admin/clients/:id
// @access  Private/Admin
router.get('/clients/:id', protect, admin, async (req, res) => {
  try {
    const client = await User.findById(req.params.id).select('-password');
    
    if (!client) {
      return res.status(404).json({ 
        success: false,
        message: 'Client non trouvé' 
      });
    }

    // Récupérer les commandes du client
    const orders = await Order.find({ user: client._id }).sort({ createdAt: -1 });
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      success: true,
      client: {
        ...client.toObject(),
        totalOrders,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        orders,
      },
    });
  } catch (error) {
    console.error('Erreur récupération client:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération du client' 
    });
  }
});

// @desc    Bloquer/Débloquer un client
// @route   PATCH /api/admin/clients/:id/block
// @access  Private/Admin
router.patch('/clients/:id/block', protect, admin, async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ 
        success: false,
        message: 'Client non trouvé' 
      });
    }

    if (client.role === 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Impossible de bloquer un administrateur' 
      });
    }

    client.isBlocked = req.body.isBlocked;
    await client.save();

    res.json({
      success: true,
      message: client.isBlocked ? 'Client bloqué avec succès' : 'Client débloqué avec succès',
      client: {
        _id: client._id,
        email: client.email,
        isBlocked: client.isBlocked,
      },
    });
  } catch (error) {
    console.error('Erreur blocage client:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors du blocage/déblocage du client' 
    });
  }
});

// @desc    Supprimer un client
// @route   DELETE /api/admin/clients/:id
// @access  Private/Admin
router.delete('/clients/:id', protect, admin, async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ 
        success: false,
        message: 'Client non trouvé' 
      });
    }

    if (client.role === 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Impossible de supprimer un administrateur' 
      });
    }

    await client.deleteOne();

    res.json({
      success: true,
      message: 'Client supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur suppression client:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la suppression du client' 
    });
  }
});

// @desc    Obtenir les statistiques des clients
// @route   GET /api/admin/clients/stats
// @access  Private/Admin
router.get('/stats/clients', protect, admin, async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: { $ne: 'admin' } });
    const verifiedClients = await User.countDocuments({ 
      role: { $ne: 'admin' }, 
      isEmailVerified: true 
    });
    const blockedClients = await User.countDocuments({ 
      role: { $ne: 'admin' }, 
      isBlocked: true 
    });

    // Nouveaux clients ce mois
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newClientsThisMonth = await User.countDocuments({
      role: { $ne: 'admin' },
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      success: true,
      stats: {
        total: totalClients,
        verified: verifiedClients,
        blocked: blockedClients,
        newThisMonth: newClientsThisMonth,
      },
    });
  } catch (error) {
    console.error('Erreur statistiques clients:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
});

// @desc    Envoyer alerte stock bas manuellement
// @route   POST /api/admin/send-stock-alert
// @access  Private/Admin
router.post('/send-stock-alert', protect, admin, sendStockAlert);

export default router;
