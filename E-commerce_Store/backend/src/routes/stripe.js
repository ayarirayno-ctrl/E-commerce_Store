import express from 'express';
import {
  createCheckoutSession,
  getCheckoutSession,
  handleStripeWebhook,
  createPaymentIntent,
  refundPayment,
} from '../controllers/stripeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route - Get Stripe publishable key
router.get('/config', (req, res) => {
  res.json({
    publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_not_configured'
  });
});

// Public routes
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // IMPORTANT: raw body pour webhook
  handleStripeWebhook
);

router.get('/session/:sessionId', getCheckoutSession);

// Public routes - Permettre checkout sans authentification
router.post('/create-checkout-session', createCheckoutSession);

// Public route - Create payment intent (accessible without auth for guest checkout)
router.post('/create-payment-intent', createPaymentIntent);

// Admin routes
router.post('/refund/:paymentIntentId', protect, admin, refundPayment);

export default router;
