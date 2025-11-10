import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { generateResetCode, sendResetPasswordEmail, sendPasswordChangedEmail } from '../utils/emailService';

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

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    // Vérifier email et mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Trouver l'admin et inclure le mot de passe
    const admin = await Admin.findOne({ email }).select('+password');

    console.log('👤 Admin found:', !!admin);

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
    console.log('🔑 Checking password...');
    const isMatch = await admin.comparePassword(password);
    console.log('✅ Password match:', isMatch);

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

    const responseData = {
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };

    console.log('✅ Admin login successful, sending response:', responseData);

    res.status(200).json(responseData);
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

// @desc    Change admin password
// @route   PUT /api/admin/auth/change-password
// @access  Private
export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
    const adminId = req.body.admin?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }

    const admin = await Admin.findById(adminId).select('+password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isPasswordMatch = await admin.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(admin.email, admin.name);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Request password reset (send code to email)
// @route   POST /api/admin/auth/forgot-password
// @access  Public
export const forgotAdminPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email'
      });
    }

    const admin = await Admin.findOne({ 
      email: email.toLowerCase() 
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'No admin account found with this email'
      });
    }

    // Generate 6-digit code
    const resetCode = generateResetCode();

    // Save code and expiration (10 minutes)
    admin.resetPasswordToken = resetCode;
    admin.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    // Send email
    try {
      await sendResetPasswordEmail(admin.email, resetCode, admin.name);
      
      res.status(200).json({
        success: true,
        message: 'Reset code sent to your email'
      });
    } catch (emailError) {
      // Reset the token if email fails
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();

      console.error('Email error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error sending email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify reset code and reset password
// @route   POST /api/admin/auth/reset-password
// @access  Public
export const resetAdminPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, code, and new password'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }

    // Find admin with valid reset token
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    }).select('+resetPasswordToken +resetPasswordExpires +password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email'
      });
    }

    // Check if reset code exists
    if (!admin.resetPasswordToken || !admin.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: 'No reset code requested. Please request a new code.'
      });
    }

    // Check if code is expired
    if (admin.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired. Please request a new one.'
      });
    }

    // Verify code
    if (admin.resetPasswordToken !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }

    // Update password
    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(admin.email, admin.name);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    // Generate new token for automatic login
    const token = generateToken(admin._id.toString(), admin.role);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};