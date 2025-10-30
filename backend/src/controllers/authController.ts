import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

// Générer le token JWT
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: '30d'
  });
};

// @desc    Login admin
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Vérifier email et mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Trouver l'admin et inclure le mot de passe
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Vérifier si le compte est actif
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Mettre à jour la dernière connexion
    admin.lastLogin = new Date();
    await admin.save();

    // Créer le token
    const token = generateToken(admin._id.toString(), admin.role);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/auth/me
// @access  Private
export const getCurrentAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.body.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};