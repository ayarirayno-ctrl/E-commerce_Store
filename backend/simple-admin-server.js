const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ⚠️ MIDDLEWARE : Désactiver le cache pour tous les fichiers
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// Product Schema (pour l'affichage dans le dashboard)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// User Schema (pour compter les utilisateurs)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  billingAddress: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  trackingNumber: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  shippedAt: { type: Date },
  deliveredAt: { type: Date }
});

const Order = mongoose.model('Order', orderSchema);

// JWT Generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Admin Login Route
app.post('/api/admin/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    console.log('👤 Admin found:', !!admin);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    console.log('🔑 Checking password...');
    const isMatch = await admin.comparePassword(password);
    console.log('✅ Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

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
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all users (clients) - Admin only
app.get('/api/admin/users', async (req, res) => {
  try {
    console.log('📋 Fetching all users...');
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${users.length} users`);
    
    res.status(200).json({
      success: true,
      total: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        status: user.lastLogin ? 'Actif' : 'Inactif'
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️  Deleting user: ${id}`);
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log(`✅ User deleted: ${deletedUser.email}`);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// Update user
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    console.log(`✏️  Updating user: ${id}`);
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    // Check if email already exists (excluding current user)
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log(`✅ User updated: ${updatedUser.email}`);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// Client Register Route
app.post('/api/client-auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('📝 Register attempt:', { name, email, passwordLength: password?.length });

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'client',
      createdAt: new Date()
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id.toString(), newUser.role);

    const responseData = {
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };

    console.log('✅ User registration successful:', responseData);

    res.status(201).json(responseData);
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Client Login Route
app.post('/api/client-auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Client login attempt:', { email, passwordLength: password?.length });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    console.log('👤 User found:', !!user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('🔑 Checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('✅ Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    console.log('✅ Client login successful, sending response:', responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error('❌ Client login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// UPDATE CLIENT PROFILE
app.put('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.id;

    const { phone, address, name } = req.body;

    console.log('📝 Updating profile for user:', userId);

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ Profile updated successfully');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Products API Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({
      success: true,
      products: products,
      total: products.length
    });
  } catch (error) {
    console.error('❌ Products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits'
    });
  }
});

// ========== ORDER MANAGEMENT ENDPOINTS ==========

// GET all orders (admin)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    res.json({
      success: true,
      total: orders.length,
      orders
    });
  } catch (error) {
    console.error('❌ Orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    });
  }
});

// GET single order by ID
app.get('/api/admin/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Order fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    });
  }
});

// UPDATE order status (admin)
app.put('/api/admin/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber, notes } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    if (status) {
      order.status = status;
      if (status === 'Shipped' && !order.shippedAt) {
        order.shippedAt = new Date();
      }
      if (status === 'Delivered' && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }
    }
    
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;
    
    order.updatedAt = new Date();
    await order.save();
    
    res.json({
      success: true,
      message: 'Commande mise à jour avec succès',
      order
    });
  } catch (error) {
    console.error('❌ Order update error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la commande'
    });
  }
});

// DELETE order
app.delete('/api/admin/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Commande supprimée avec succès',
      order: {
        id: order._id,
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    console.error('❌ Order delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la commande'
    });
  }
});

// CREATE order (for client)
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, userName, userEmail, items, shippingAddress, billingAddress, totalAmount } = req.body;
    
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Données de commande invalides'
      });
    }
    
    const orderNumber = `ORD-${Date.now()}`;
    
    const order = new Order({
      orderNumber,
      userId,
      userName,
      userEmail,
      items,
      shippingAddress,
      billingAddress,
      totalAmount,
      status: 'Pending',
      paymentStatus: 'Completed'
    });
    
    await order.save();
    
    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order
    });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    });
  }
});

// Get user's orders
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      total: orders.length,
      orders
    });
  } catch (error) {
    console.error('❌ User orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    });
  }
});

// Admin Stats API
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount, totalRevenue] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'Delivered', paymentStatus: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
    res.json({
      success: true,
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      revenue: revenue
    });
  } catch (error) {
    console.error('❌ Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Stripe configuration endpoint
app.get('/api/stripe/config', (req, res) => {
  res.json({
    publicKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_not_configured'
  });
});

// Create checkout session for Stripe
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    console.log('📦 Checkout request received:', JSON.stringify(req.body, null, 2));
    
    const { items, shippingAddress, billingAddress, email } = req.body;

    if (!items || items.length === 0) {
      console.error('❌ Cart is empty');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log(`✅ Processing ${items.length} items for ${email}`);

    // Simple response for now - in production, integrate with real Stripe
    const mockSession = {
      id: 'cs_test_' + Date.now(),
      url: `http://localhost:3002/payment-success?session_id=cs_test_${Date.now()}`,
      amount_total: items.reduce((total, item) => total + (item.price * item.quantity * 100), 0)
    };

    console.log('✅ Mock checkout session created:', mockSession);

    res.json({
      success: true,
      sessionId: mockSession.id,
      url: mockSession.url
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session'
    });
  }
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Test server running on http://localhost:${PORT}`);
      console.log('📋 Test admin login at: POST http://localhost:5000/api/admin/auth/login');
      console.log('📧 Email: ayarirayen539@gmail.com');
      console.log('🔑 Password: admin123');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();