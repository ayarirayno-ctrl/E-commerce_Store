import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import categoryRoutes from './routes/categoryRoutes';
import clientRoutes from './routes/clientRoutes';
import clientAuthRoutes from './routes/clientAuthRoutes';
import cartRoutes from './routes/cartRoutes';
import clientOrderRoutes from './routes/clientOrderRoutes';
import promotionRoutes from './routes/promotionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminLogRoutes from './routes/adminLogRoutes';
import contentRoutes from './routes/contentRoutes';
import roleRoutes from './routes/roleRoutes';

// Configuration des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();

// Security headers with Helmet
app.use(helmet());

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'fail',
    statusCode: 429,
    code: 'TOO_MANY_REQUESTS',
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

app.use('/api/', limiter);

// CORS configuration - restrict to known origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3010',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  // Expose X-Request-Id so frontend can read it
  exposedHeaders: ['X-Request-Id']
}));
app.use(compression()); // Ajouter la compression pour améliorer les performances
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Support for URL-encoded bodies
// Attach a requestId to each request and expose via X-Request-Id header
app.use((req, res, next) => {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  (req as any).requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
});

// Add request id to logs
morgan.token('id', (req) => (req as any).requestId || '-');
app.use(morgan(':id :method :url :status - :response-time ms'));

// Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/client-auth', clientAuthRoutes); // Client authentication routes
app.use('/api/cart', cartRoutes); // Client cart routes
app.use('/api/client-orders', clientOrderRoutes); // Client orders routes
app.use('/api/promotions', promotionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/logs', adminLogRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/roles', roleRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Route racine de l'API (page d'accueil API)
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    name: 'E-commerce Store API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId,
    availableRoutes: [
      '/api/test',
      '/api/health',
      '/api/products',
      '/api/categories',
      '/api/reviews',
      '/api/orders',
      '/api/cart',
      '/api/clients',
      '/api/client-orders',
      '/api/client-auth',
      '/api/admin/auth',
      '/api/admin/logs',
      '/api/content',
      '/api/notifications',
      '/api/promotions',
      '/api/roles',
      '/api/users'
    ]
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const readyState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const memory = process.memoryUsage();

  res.json({
    status: readyState === 1 ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.round(process.uptime()),
    requestId: (req as any).requestId,
    process: {
      pid: process.pid,
      node: process.version,
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
      },
    },
    database: {
      driver: 'mongoose',
      version: mongoose.version,
      state: stateMap[readyState] || 'unknown',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    },
  });
});

// Dev-only route to simulate a server error for testing error handler
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/error', () => {
    const err = new Error('Simulated server error');
    // @ts-ignore - adding status property for demo purposes
    err.status = 500;
    throw err;
  });
}

// 404 handler for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      status: 'fail',
      statusCode: 404,
      code: 'NOT_FOUND',
      message: 'Not Found',
      method: req.method,
      path: req.originalUrl,
      requestId: (req as any).requestId,
    });
  }
  next();
});

// Generic error handler returning JSON for API routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  const statusCode = err.status || 500;
  if (req.path.startsWith('/api')) {
    const isClientError = statusCode >= 400 && statusCode < 500;
    const payload: any = {
      status: isClientError ? 'fail' : 'error',
      statusCode,
      code: err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST'),
      message: err.message || (statusCode >= 500 ? 'Internal Server Error' : 'Request failed'),
      path: req.originalUrl,
      requestId: (req as any).requestId,
    };
    if (process.env.NODE_ENV !== 'production' && err.stack) {
      payload.stack = err.stack;
    }
    res.status(statusCode).json(payload);
  } else {
    res.status(statusCode).send('Internal Server Error');
  }
});

// Port
const PORT = parseInt(process.env.PORT || '5000', 10);

// Connexion à la base de données et démarrage du serveur
const startServer = async () => {
  try {
    console.log('Connecting to database...');
    await connectDatabase();
    console.log('Database connected successfully');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      const address = server.address();
      if (typeof address === 'string') {
        console.log(`Server is running on ${address}`);
      } else if (address) {
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        console.log(`Server is running on:`);
        console.log(`- Local:   ${protocol}://localhost:${address.port}`);
        console.log(`- Network: ${protocol}://127.0.0.1:${address.port}`);
      }
      console.log(`Server is running on port ${PORT}`);
    });

    // Gérer la fermeture propre
    const gracefulShutdown = async () => {
      console.log('\nInitiating graceful shutdown...');
      server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close().then(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();