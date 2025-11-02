import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Middleware
 * Protection against brute force and spam attacks
 */

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for authentication routes - 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register attempts per windowMs
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    retryAfter: '15 minutes',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiter - 3 attempts per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    error: 'Trop de demandes de réinitialisation. Veuillez réessayer dans 1 heure.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email verification rate limiter - 3 attempts per 15 minutes
const emailVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    error: 'Trop de demandes de vérification. Veuillez réessayer plus tard.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Order creation rate limiter - 10 orders per hour
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'Vous avez atteint la limite de commandes par heure. Veuillez réessayer plus tard.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form rate limiter - 5 submissions per hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    error: 'Trop de messages envoyés. Veuillez réessayer dans 1 heure.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Review submission rate limiter - 10 reviews per hour
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'Vous avez atteint la limite d\'avis par heure.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin routes rate limiter - More lenient for admin users
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for admin operations
  message: {
    error: 'Trop de requêtes admin. Veuillez réessayer plus tard.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter - 20 uploads per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    error: 'Trop d\'uploads. Limite de 20 fichiers par heure.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search rate limiter - 50 searches per minute
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: {
    error: 'Trop de recherches. Veuillez ralentir.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  orderLimiter,
  contactLimiter,
  reviewLimiter,
  adminLimiter,
  uploadLimiter,
  searchLimiter,
};
