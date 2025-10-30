import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JwtPayload {
  id: string;
  type: string;
}

export const clientAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check if it's a client token (not admin)
    if (decoded.type !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type. Access denied.',
      });
    }

    // Attach user to request
    (req as any).user = { id: decoded.id, type: decoded.type };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Access denied.',
    });
  }
};
