import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Vérifier si l'utilisateur a une permission spécifique
export const checkPermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié',
        });
      }

      // Récupérer l'utilisateur avec son rôle
      const user = await User.findById(req.user.id).populate('role');
      
      if (!user || !user.role) {
        return res.status(403).json({
          success: false,
          message: 'Aucun rôle assigné',
        });
      }

      const role = user.role as any;

      // Vérifier si le rôle a la permission requise
      if (!role.permissions.includes(requiredPermission) && !role.permissions.includes('*')) {
        return res.status(403).json({
          success: false,
          message: `Permission refusée: ${requiredPermission} requise`,
        });
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des permissions',
        error: error.message,
      });
    }
  };
};

// Vérifier si l'utilisateur a un niveau de rôle minimum
export const checkRoleLevel = (minLevel: number) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié',
        });
      }

      const user = await User.findById(req.user.id).populate('role');
      
      if (!user || !user.role) {
        return res.status(403).json({
          success: false,
          message: 'Aucun rôle assigné',
        });
      }

      const role = user.role as any;

      if (role.level < minLevel) {
        return res.status(403).json({
          success: false,
          message: `Niveau de rôle insuffisant (requis: ${minLevel}, actuel: ${role.level})`,
        });
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du niveau de rôle',
        error: error.message,
      });
    }
  };
};
