import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import sendEmail from '../utils/sendEmail.js';
import { orderConfirmationEmailTemplate } from '../utils/emailTemplates.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Créer une session Stripe Checkout
 * @route   POST /api/stripe/create-checkout-session
 * @access  Private
 */
export const createCheckoutSession = async (req, res) => {
  try {
    console.log('📦 Checkout request received:', JSON.stringify(req.body, null, 2));
    
    const { items, shippingAddress, billingAddress, email } = req.body;

    if (!items || items.length === 0) {
      console.error('❌ Cart is empty');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log(`✅ Processing ${items.length} items for ${email}`);

    // Créer les line items pour Stripe
    const lineItems = items.map(item => {
      const productData = {
        name: item.name || 'Product',
        images: item.image ? [item.image] : [],
      };
      
      // Only add description if it's not empty
      if (item.description && item.description.trim().length > 0) {
        productData.description = item.description.substring(0, 100);
      }
      
      return {
        price_data: {
          currency: 'eur',
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      };
    });

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      customer_email: email,
      metadata: {
        userId: req.user?._id?.toString() || 'guest',
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        items: JSON.stringify(items),
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'DE', 'ES', 'IT', 'GB', 'US'],
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      message: 'Error creating checkout session',
      error: error.message,
    });
  }
};

/**
 * @desc    Vérifier le statut du paiement
 * @route   GET /api/stripe/session/:sessionId
 * @access  Public
 */
export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total / 100,
      currency: session.currency,
    });
  } catch (error) {
    console.error('Stripe session retrieval error:', error);
    res.status(500).json({
      message: 'Error retrieving session',
      error: error.message,
    });
  }
};

/**
 * @desc    Webhook Stripe pour événements de paiement
 * @route   POST /api/stripe/webhook
 * @access  Public (mais vérifié par signature)
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les événements
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded:', event.data.object.id);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

/**
 * Gérer la complétion du checkout
 */
const handleCheckoutSessionCompleted = async (session) => {
  try {
    const metadata = session.metadata;
    const items = JSON.parse(metadata.items);
    const shippingAddress = JSON.parse(metadata.shippingAddress);
    const billingAddress = JSON.parse(metadata.billingAddress);

    // Créer la commande dans la base de données
    const order = await Order.create({
      user: metadata.userId !== 'guest' ? metadata.userId : null,
      orderNumber: `ORD-${Date.now()}`,
      items: items.map(item => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalPrice: session.amount_total / 100,
      shippingAddress,
      billingAddress,
      paymentMethod: 'Stripe',
      paymentStatus: 'paid',
      paymentId: session.payment_intent,
      status: 'processing',
      paidAt: new Date(),
    });

    // Envoyer l'email de confirmation
    if (session.customer_email) {
      await sendEmail({
        to: session.customer_email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: orderConfirmationEmailTemplate(order, {
          email: session.customer_email,
          name: shippingAddress.fullName || 'Customer',
        }),
      });
    }

    console.log('Order created successfully:', order.orderNumber);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
};

/**
 * Gérer l'échec du paiement
 */
const handlePaymentFailed = async (paymentIntent) => {
  console.error('Payment failed:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    last_payment_error: paymentIntent.last_payment_error?.message,
  });

  // TODO: Envoyer un email à l'utilisateur pour l'informer de l'échec
  // TODO: Logger dans la base de données
};

/**
 * @desc    Créer un Payment Intent (pour custom checkout)
 * @route   POST /api/stripe/create-payment-intent
 * @access  Private
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user?._id?.toString() || 'guest',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      message: 'Error creating payment intent',
      error: error.message,
    });
  }
};

/**
 * @desc    Rembourser un paiement
 * @route   POST /api/stripe/refund/:paymentIntentId
 * @access  Admin
 */
export const refundPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const { amount, reason } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Remboursement partiel si montant spécifié
      reason: reason || 'requested_by_customer',
    });

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      message: 'Error processing refund',
      error: error.message,
    });
  }
};
