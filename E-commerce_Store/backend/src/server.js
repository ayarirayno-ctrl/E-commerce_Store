import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
// import mongoSanitize from 'express-mongo-sanitize'; // Temporarily disabled - Express 5 incompatibility
import hpp from 'hpp';
import compression from 'compression';
import connectDB from './config/database.js';
import abandonedCartEmailJob from './jobs/abandonedCartJob.js';
import lowStockAlertJob from './jobs/lowStockAlertJob.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Charger variables d'environnement
dotenv.config();

// Connexion base de données
connectDB();

// Initialiser les tâches CRON
abandonedCartEmailJob();
lowStockAlertJob();

const app = express();

// Security middlewares
// Helmet helps secure Express apps by setting HTTP response headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// Middleware CORS - Plus permissif en développement
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : true, // Accepte toutes les origines en développement (y compris file://)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser MUST come before mongoSanitize for Express 5.x
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection (after body parser)
// TEMPORARILY DISABLED: Incompatible with Express 5.x
// app.use(mongoSanitize());
// TODO: Update to express-mongo-sanitize@3.x when available or downgrade to Express 4.x

// Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['price', 'rating', 'category'] // Allow duplicate parameters for filters
}));

// Compression middleware - Compress all responses
app.use(compression({
  level: 6, // Compression level (0-9, 6 is default)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't accept encoding
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter
    return compression.filter(req, res);
  }
}));

// Apply general rate limiter to all API routes
app.use('/api/', apiLimiter);

// Servir les fichiers statiques pour la page de test
app.use(express.static('public'));

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import cartRoutes from './routes/cart.js';
import stripeRoutes from './routes/stripe.js';
import productRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';

// IMPORTANT: Stripe webhook doit être AVANT express.json() pour recevoir raw body
app.use('/api/stripe/webhook', stripeRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoriesRoutes);

// Alias routes for payment endpoints
app.use('/api/payments', stripeRoutes);

// Route de base pour éviter "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ E-commerce Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      api: '/api/*'
    },
    timestamp: new Date().toISOString()
  });
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API is running...',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handler
// Express requires 4 parameters for error handling middleware
app.use((err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

// Gestion des erreurs non catchées
// TEMPORAIREMENT DÉSACTIVÉ POUR DEBUG
/*
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', error);
  process.exit(1);
});
*/

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});
