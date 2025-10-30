import { Request, Response, NextFunction } from 'express';
import AdminLog from '../models/AdminLog';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware pour logger automatiquement les actions admin
export const createLogMiddleware = (
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'other',
  targetModel: string,
  description?: string
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Capturer la réponse d'origine
      const originalJson = res.json.bind(res);

      res.json = function (data: any) {
        // Logger uniquement si l'opération a réussi (status 200-299)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Enregistrer le log de manière asynchrone (ne pas bloquer la réponse)
          setImmediate(async () => {
            try {
              const logData: any = {
                action,
                targetModel,
                description: description || `${action} ${targetModel}`,
                ipAddress: req.ip || req.socket.remoteAddress,
                userAgent: req.get('user-agent'),
              };

              // Ajouter les infos de l'admin si disponibles
              if (req.user) {
                logData.adminId = req.user.id;
                logData.adminEmail = req.user.email;
              }

              // Ajouter l'ID de l'entité ciblée si disponible
              if (req.params.id) {
                logData.targetId = req.params.id;
              } else if (data?.data?._id) {
                logData.targetId = data.data._id;
              } else if (data?._id) {
                logData.targetId = data._id;
              }

              // Pour les updates, capturer les changements
              if (action === 'update' && req.body) {
                const changes = [];
                for (const [field, newValue] of Object.entries(req.body)) {
                  // Ignorer les champs système
                  if (!['password', 'token', '__v'].includes(field)) {
                    changes.push({
                      field,
                      oldValue: null, // On ne peut pas facilement obtenir l'ancienne valeur ici
                      newValue,
                    });
                  }
                }
                if (changes.length > 0) {
                  logData.changes = changes;
                }
              }

              await AdminLog.create(logData);
            } catch (error) {
              console.error('Erreur lors de la création du log:', error);
            }
          });
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware spécifique pour logger les logins
export const logLogin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const originalJson = res.json.bind(res);

    res.json = function (data: any) {
      if (res.statusCode === 200 && data.user) {
        setImmediate(async () => {
          try {
            await AdminLog.create({
              action: 'login',
              adminId: data.user._id,
              adminEmail: data.user.email,
              targetModel: 'User',
              targetId: data.user._id,
              description: `Connexion admin: ${data.user.email}`,
              ipAddress: req.ip || req.socket.remoteAddress,
              userAgent: req.get('user-agent'),
            });
          } catch (error) {
            console.error('Erreur lors de la création du log de connexion:', error);
          }
        });
      }

      return originalJson(data);
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware pour logger les actions manuellement avec plus de détails
export const logAction = async (
  adminId: string,
  adminEmail: string,
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'other',
  targetModel: string,
  targetId?: string,
  description?: string,
  changes?: { field: string; oldValue: any; newValue: any }[],
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await AdminLog.create({
      action,
      adminId,
      adminEmail,
      targetModel,
      targetId,
      description: description || `${action} ${targetModel}`,
      changes,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Erreur lors de la création du log:', error);
  }
};

export default createLogMiddleware;
