import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  admin?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Récupérer l'admin
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Your account has been deactivated' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.admin.role} is not authorized to access this route`
      });
    }
    next();
  };
};