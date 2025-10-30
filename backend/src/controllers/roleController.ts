import { Request, Response } from 'express';
import Role from '../models/Role';
import { User } from '../models/User';

// Obtenir tous les rôles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().sort({ level: -1 });

    res.json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des rôles',
      error: error.message,
    });
  }
};

// Obtenir un rôle par ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rôle non trouvé',
      });
    }

    // Compter les utilisateurs avec ce rôle
    const userCount = await User.countDocuments({ role: role._id });

    res.json({
      success: true,
      data: {
        ...role.toObject(),
        userCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du rôle',
      error: error.message,
    });
  }
};

// Créer un nouveau rôle
export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Rôle créé avec succès',
      data: role,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du rôle',
      error: error.message,
    });
  }
};

// Mettre à jour un rôle
export const updateRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rôle non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Rôle mis à jour avec succès',
      data: role,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du rôle',
      error: error.message,
    });
  }
};

// Supprimer un rôle
export const deleteRole = async (req: Request, res: Response) => {
  try {
    // Vérifier si des utilisateurs ont ce rôle
    const userCount = await User.countDocuments({ role: req.params.id });
    
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer: ${userCount} utilisateur(s) ont ce rôle`,
      });
    }

    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rôle non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Rôle supprimé avec succès',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du rôle',
      error: error.message,
    });
  }
};

// Obtenir les statistiques des rôles
export const getRoleStats = async (req: Request, res: Response) => {
  try {
    const [total, active, roles] = await Promise.all([
      Role.countDocuments(),
      Role.countDocuments({ isActive: true }),
      Role.find().select('name displayName level'),
    ]);

    // Compter les utilisateurs par rôle
    const usersByRole = await Promise.all(
      roles.map(async (role) => ({
        roleId: role._id,
        roleName: role.displayName,
        level: role.level,
        userCount: await User.countDocuments({ role: role._id }),
      }))
    );

    res.json({
      success: true,
      data: {
        total,
        active,
        inactive: total - active,
        usersByRole,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
};

// Assigner un rôle à un utilisateur
export const assignRoleToUser = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.body;

    // Vérifier que le rôle existe
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rôle non trouvé',
      });
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      userId,
      { role: roleId },
      { new: true }
    ).populate('role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Rôle assigné avec succès',
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'assignation du rôle',
      error: error.message,
    });
  }
};

// Obtenir toutes les permissions disponibles
export const getAvailablePermissions = async (req: Request, res: Response) => {
  try {
    const permissions = [
      // Produits
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
      
      // Catégories
      'categories.view',
      'categories.create',
      'categories.edit',
      'categories.delete',
      
      // Commandes
      'orders.view',
      'orders.edit',
      'orders.delete',
      
      // Clients
      'clients.view',
      'clients.edit',
      'clients.delete',
      'clients.block',
      
      // Promotions
      'promotions.view',
      'promotions.create',
      'promotions.edit',
      'promotions.delete',
      
      // Avis
      'reviews.view',
      'reviews.moderate',
      'reviews.delete',
      
      // Notifications
      'notifications.view',
      'notifications.create',
      'notifications.delete',
      
      // Logs
      'logs.view',
      'logs.delete',
      
      // Contenu
      'content.view',
      'content.create',
      'content.edit',
      'content.delete',
      
      // Rôles et permissions
      'roles.view',
      'roles.create',
      'roles.edit',
      'roles.delete',
      
      // Super admin (toutes permissions)
      '*',
    ];

    const categorized = {
      products: permissions.filter(p => p.startsWith('products.')),
      categories: permissions.filter(p => p.startsWith('categories.')),
      orders: permissions.filter(p => p.startsWith('orders.')),
      clients: permissions.filter(p => p.startsWith('clients.')),
      promotions: permissions.filter(p => p.startsWith('promotions.')),
      reviews: permissions.filter(p => p.startsWith('reviews.')),
      notifications: permissions.filter(p => p.startsWith('notifications.')),
      logs: permissions.filter(p => p.startsWith('logs.')),
      content: permissions.filter(p => p.startsWith('content.')),
      roles: permissions.filter(p => p.startsWith('roles.')),
      system: ['*'],
    };

    res.json({
      success: true,
      data: {
        all: permissions,
        categorized,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des permissions',
      error: error.message,
    });
  }
};
