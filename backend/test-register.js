const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'client' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// JWT Generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Client Register Route
app.post('/api/client-auth/register', async (req, res) => {
  console.log('🎯 POST /api/client-auth/register endpoint hit!');
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
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
      console.log('📋 Available endpoints:');
      console.log('  POST /api/client-auth/register');
      console.log('  POST /api/client-auth/login');
      console.log('  GET  /api/health');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();