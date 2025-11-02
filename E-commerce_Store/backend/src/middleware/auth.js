import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protéger les routes (utilisateur connecté)
export const protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token du header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Non autorisé - Aucun token' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    next();

  } catch (error) {
    res.status(401).json({ message: 'Non autorisé - Token invalide' });
  }
};

// Vérifier si l'utilisateur est admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }
};

// Vérifier si l'email est vérifié
export const emailVerified = (req, res, next) => {
  if (req.user && req.user.isEmailVerified) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Veuillez vérifier votre email avant d\'accéder à cette ressource' 
    });
  }
};
