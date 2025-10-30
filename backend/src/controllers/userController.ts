import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const userController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password, phone } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone
      });

      // Generate token
      const token = generateToken(user._id.toString());

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error creating user' });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
      }

      // Find user and include password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id.toString());

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          isEmailVerified: user.isEmailVerified
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error logging in' });
    }
  },

  // Get current user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching profile' });
    }
  },

  // Update user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { firstName, lastName, phone, avatar } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, phone, avatar },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error updating profile' });
    }
  },

  // Add address
  addAddress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { street, city, state, zipCode, country, isDefault } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If this is default, unset other defaults
      if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }

      user.addresses.push({ street, city, state, zipCode, country, isDefault });
      await user.save();

      res.status(201).json({ success: true, addresses: user.addresses });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error adding address' });
    }
  },

  // Update address
  updateAddress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const addressId = req.params.addressId;
      const { street, city, state, zipCode, country, isDefault } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      // If setting as default, unset others
      if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }

      address.street = street || address.street;
      address.city = city || address.city;
      address.state = state || address.state;
      address.zipCode = zipCode || address.zipCode;
      address.country = country || address.country;
      address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

      await user.save();

      res.json({ success: true, addresses: user.addresses });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error updating address' });
    }
  },

  // Delete address
  deleteAddress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const addressId = req.params.addressId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.addresses = user.addresses.filter(
        (addr: any) => addr._id.toString() !== addressId
      );
      await user.save();

      res.json({ success: true, addresses: user.addresses });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error deleting address' });
    }
  },

  // Change password
  changePassword: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error changing password' });
    }
  }
};