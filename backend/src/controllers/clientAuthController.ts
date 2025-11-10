import { Request, Response } from 'express';
import Client, { IClient } from '../models/Client';
import jwt from 'jsonwebtoken';
import { generateResetCode, sendResetPasswordEmail, sendPasswordChangedEmail } from '../utils/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (clientId: string): string => {
  return jwt.sign({ id: clientId, type: 'client' }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new client
// @route   POST /api/client-auth/register
// @access  Public
export const registerClient = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // Check if client exists
    const existingClient = await Client.findOne({ email: email.toLowerCase() });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Create client
    const client: IClient = await Client.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    // Generate token
    const token = generateToken((client._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        avatar: client.avatar,
        emailVerified: client.emailVerified,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Login client
// @route   POST /api/client-auth/login
// @access  Public
export const loginClient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find client (include password for comparison)
    const client: IClient | null = await Client.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!client) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!client.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      });
    }

    // Compare password
    const isPasswordMatch = await client.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken((client._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        avatar: client.avatar,
        emailVerified: client.emailVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get client profile
// @route   GET /api/client-auth/profile
// @access  Private (Client)
export const getClientProfile = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;

    const client: IClient | null = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    res.status(200).json({
      success: true,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        avatar: client.avatar,
        emailVerified: client.emailVerified,
        createdAt: (client as any).createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update client profile
// @route   PUT /api/client-auth/profile
// @access  Private (Client)
export const updateClientProfile = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { name, phone, address } = req.body;

    const client: IClient | null = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Update fields
    if (name) client.name = name;
    if (phone !== undefined) client.phone = phone;
    if (address) client.address = { ...(client.address || {}), ...address };

    await client.save();

    res.status(200).json({
      success: true,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        avatar: client.avatar,
        emailVerified: client.emailVerified,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Change password
// @route   PUT /api/client-auth/change-password
// @access  Private (Client)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const client: IClient | null = await Client.findById(clientId).select('+password');
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Verify current password
    const isPasswordMatch = await client.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    client.password = newPassword;
    await client.save();

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(client.email, client.name);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Request password reset (send code to email)
// @route   POST /api/client-auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email',
      });
    }

    const client: IClient | null = await Client.findOne({ 
      email: email.toLowerCase() 
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    // Generate 6-digit code
    const resetCode = generateResetCode();

    // Save code and expiration (10 minutes)
    client.resetPasswordToken = resetCode;
    client.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await client.save();

    // Send email
    try {
      await sendResetPasswordEmail(client.email, resetCode, client.name);
      
      res.status(200).json({
        success: true,
        message: 'Reset code sent to your email',
      });
    } catch (emailError) {
      // Reset the token if email fails
      client.resetPasswordToken = undefined;
      client.resetPasswordExpires = undefined;
      await client.save();

      console.error('Email error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error sending email. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Verify reset code and reset password
// @route   POST /api/client-auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, code, and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Find client with valid reset token
    const client: IClient | null = await Client.findOne({
      email: email.toLowerCase(),
    }).select('+resetPasswordToken +resetPasswordExpires +password');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email',
      });
    }

    // Check if reset code exists
    if (!client.resetPasswordToken || !client.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: 'No reset code requested. Please request a new code.',
      });
    }

    // Check if code is expired
    if (client.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired. Please request a new one.',
      });
    }

    // Verify code
    if (client.resetPasswordToken !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code',
      });
    }

    // Update password
    client.password = newPassword;
    client.resetPasswordToken = undefined;
    client.resetPasswordExpires = undefined;
    await client.save();

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(client.email, client.name);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    // Generate new token for automatic login
    const token = generateToken((client._id as any).toString());

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      token,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

