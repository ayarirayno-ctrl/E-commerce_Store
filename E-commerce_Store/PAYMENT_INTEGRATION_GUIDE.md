# 💳 PAYMENT INTEGRATION - IMPLEMENTATION GUIDE

## 📋 Vue d'ensemble

Intégration d'un système de paiement sécurisé (Stripe ou PayPal) dans l'e-commerce store.

**Status** : 🟡 Optionnel (Futur Enhancement)  
**Priorité** : Basse  
**Estimé** : 1-2 semaines  
**Complexité** : Moyenne

---

## 🎯 Objectifs

### Fonctionnalités Core
1. **Checkout sécurisé** : Formulaire de paiement
2. **Multi-moyens de paiement** : Carte bancaire, PayPal, etc.
3. **Gestion des erreurs** : Paiement refusé, timeout, etc.
4. **Confirmation** : Email + page de confirmation
5. **Sécurité** : PCI DSS compliant

---

## 🏗️ OPTION 1 : STRIPE (Recommandé)

### Pourquoi Stripe ?
- ✅ **Developer-friendly** : Excellent API, documentation claire
- ✅ **Sécurité** : PCI DSS Level 1 compliant
- ✅ **UX moderne** : Checkout UI élégante
- ✅ **Fees compétitifs** : 1.5% + 0.25€ par transaction (Europe)
- ✅ **Support** : Cartes, Apple Pay, Google Pay, etc.

### Setup

#### 1. Installation
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install stripe  # Backend
```

#### 2. Configuration
```typescript
// .env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### 3. Backend - Create Payment Intent
```typescript
// server/routes/payment.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency = 'eur' } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // En centimes
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 4. Frontend - Checkout Form
```typescript
// components/payment/StripeCheckout.tsx
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const StripeCheckout: React.FC<{ amount: number }> = ({ amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
};

const CheckoutForm: React.FC<{ amount: number }> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Créer Payment Intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      const { clientSecret } = await response.json();
      
      // 2. Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );
      
      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Paiement réussi !
        navigate('/order-confirmation');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Pay €${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};
```

#### 5. Styling avec Tailwind
```typescript
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};
```

---

## 🏗️ OPTION 2 : PAYPAL

### Pourquoi PayPal ?
- ✅ **Trust** : Marque reconnue
- ✅ **Simple** : Moins de setup
- ✅ **Sans compte** : Paiement invité
- ❌ **Fees** : Plus élevés (2.9% + 0.35€)

### Setup

#### 1. Installation
```bash
npm install @paypal/react-paypal-js
```

#### 2. Configuration
```typescript
// .env
VITE_PAYPAL_CLIENT_ID=AXX...
```

#### 3. Frontend - PayPal Button
```typescript
// components/payment/PayPalCheckout.tsx
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export const PayPalCheckout: React.FC<{ amount: number }> = ({ amount }) => {
  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: amount.toFixed(2),
          currency_code: 'EUR',
        },
      }],
    });
  };
  
  const onApprove = async (data: any, actions: any) => {
    const order = await actions.order.capture();
    
    // Paiement réussi !
    console.log('Order:', order);
    navigate('/order-confirmation');
  };
  
  const onError = (err: any) => {
    console.error('PayPal error:', err);
    alert('Payment failed. Please try again.');
  };
  
  return (
    <PayPalScriptProvider options={{ 
      'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
      currency: 'EUR'
    }}>
      <PayPalButtons 
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{ 
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }}
      />
    </PayPalScriptProvider>
  );
};
```

---

## 🎨 CHECKOUT PAGE DESIGN

### Layout Proposé
```typescript
// pages/CheckoutPage.tsx
export const CheckoutPage: React.FC = () => {
  const { items, total } = useSelector(selectCart);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Forms */}
        <div className="space-y-8">
          {/* 1. Shipping Address */}
          <Card title="Shipping Address">
            <ShippingForm />
          </Card>
          
          {/* 2. Payment Method Selection */}
          <Card title="Payment Method">
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard className="w-5 h-5" />
                <span>Credit Card (Stripe)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img src="/paypal-logo.svg" className="w-5 h-5" />
                <span>PayPal</span>
              </label>
            </div>
          </Card>
          
          {/* 3. Payment Form */}
          <Card title="Payment Details">
            {paymentMethod === 'stripe' ? (
              <StripeCheckout amount={total} />
            ) : (
              <PayPalCheckout amount={total} />
            )}
          </Card>
        </div>
        
        {/* Right Column - Order Summary */}
        <div>
          <Card title="Order Summary" sticky>
            <OrderSummary items={items} total={total} />
          </Card>
        </div>
      </div>
    </div>
  );
};
```

---

## 📦 ORDER CONFIRMATION PAGE

```typescript
// pages/OrderConfirmationPage.tsx
export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams();
  const { data: order } = useGetOrderQuery(orderId);
  
  return (
    <div className="container mx-auto py-12 text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
      </div>
      
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        Thank You for Your Order!
      </h1>
      
      {/* Order Number */}
      <p className="text-xl text-gray-600 mb-8">
        Order #{order.orderNumber}
      </p>
      
      {/* Confirmation Email */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8 inline-block">
        <Mail className="w-6 h-6 text-blue-500 mb-2 mx-auto" />
        <p>A confirmation email has been sent to:</p>
        <p className="font-semibold">{order.customer.email}</p>
      </div>
      
      {/* Order Details */}
      <Card className="max-w-2xl mx-auto">
        <OrderDetails order={order} />
      </Card>
      
      {/* Actions */}
      <div className="mt-8 space-x-4">
        <Button onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
        <Button variant="outline" onClick={() => navigate('/orders')}>
          View Orders
        </Button>
      </div>
    </div>
  );
};
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Never Store Card Data
```typescript
// ❌ MAUVAIS - Ne JAMAIS faire ça
const cardData = {
  number: '4242424242424242',
  cvv: '123',
  expiry: '12/25'
};
localStorage.setItem('card', JSON.stringify(cardData));

// ✅ BON - Laisser Stripe/PayPal gérer
// Utiliser CardElement ou PayPal SDK
```

### 2. Use HTTPS
```typescript
// vercel.json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      {
        "key": "Strict-Transport-Security",
        "value": "max-age=63072000; includeSubDomains; preload"
      }
    ]
  }]
}
```

### 3. Validate on Backend
```typescript
// ❌ MAUVAIS - Validation frontend only
const total = calculateTotal(items); // Client peut modifier

// ✅ BON - Recalculer sur backend
app.post('/api/create-payment-intent', async (req, res) => {
  const { items } = req.body;
  
  // Recalculer le total server-side
  const total = items.reduce((sum, item) => {
    const product = await Product.findById(item.id);
    return sum + (product.price * item.quantity);
  }, 0);
  
  // Créer payment intent avec le vrai total
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'eur',
  });
  
  res.json({ clientSecret: paymentIntent.client_secret });
});
```

### 4. Handle Webhooks (Advanced)
```typescript
// server/routes/stripe-webhook.ts
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Marquer la commande comme payée
      await Order.updateOne(
        { paymentIntentId: paymentIntent.id },
        { status: 'paid' }
      );
      break;
      
    case 'payment_intent.payment_failed':
      // Gérer l'échec
      break;
  }
  
  res.json({ received: true });
});
```

---

## 🧪 TESTING

### Test Mode (Stripe)
```typescript
// Cartes de test
const testCards = {
  success: '4242424242424242',
  decline: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expired: '4000000000000069',
};

// Test dans Stripe Dashboard
// https://dashboard.stripe.com/test/payments
```

### Test Mode (PayPal)
```typescript
// PayPal Sandbox
// https://developer.paypal.com/developer/accounts/

// Test accounts
const testAccounts = {
  buyer: 'buyer@example.com',
  seller: 'seller@example.com',
};
```

---

## 💰 PRICING COMPARISON

### Stripe
- **Standard** : 1.5% + 0.25€ par transaction (Europe)
- **International** : +1.5% pour cartes non-européennes
- **Setup fee** : 0€
- **Monthly fee** : 0€

### PayPal
- **Standard** : 2.9% + 0.35€ par transaction
- **International** : +1.5% pour devises étrangères
- **Setup fee** : 0€
- **Monthly fee** : 0€

### Exemple (Panier de 100€)
- **Stripe** : 100€ - (1.50€ + 0.25€) = **98.25€ net**
- **PayPal** : 100€ - (2.90€ + 0.35€) = **96.75€ net**

**Différence** : 1.50€ par transaction → **Stripe plus avantageux**

---

## 📊 USER FLOW

```
1. Cart Page
   ↓ Click "Checkout"
   
2. Checkout Page
   ├─ Enter shipping address
   ├─ Select payment method (Stripe/PayPal)
   └─ Enter payment details
   ↓ Click "Pay"
   
3. Payment Processing
   ├─ Create Payment Intent (backend)
   ├─ Confirm payment (Stripe/PayPal)
   └─ Handle response
   ↓
   
4. Order Confirmation
   ├─ Create order in database
   ├─ Send confirmation email
   └─ Show confirmation page
   ↓
   
5. Order Complete
   └─ Redirect to order history
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1 : Setup (2-3 jours)
- [ ] Create Stripe account (or PayPal)
- [ ] Install dependencies
- [ ] Setup environment variables
- [ ] Test with test keys

### Phase 2 : Checkout Page (3-4 jours)
- [ ] Build checkout form
- [ ] Add shipping address form
- [ ] Add payment method selection
- [ ] Integrate Stripe/PayPal component
- [ ] Add validation

### Phase 3 : Backend (2-3 jours)
- [ ] Create payment intent endpoint
- [ ] Add amount validation
- [ ] Create order in database
- [ ] Send confirmation email
- [ ] Handle webhooks (advanced)

### Phase 4 : Testing (1-2 jours)
- [ ] Test with test cards
- [ ] Test error scenarios
- [ ] Test confirmation flow
- [ ] Test email delivery

**Total : 8-12 jours (1-2 semaines)**

---

## ✅ CHECKLIST AVANT PRODUCTION

### Stripe
- [ ] Mode Production activé
- [ ] Clés API production configurées
- [ ] Webhook endpoint configuré
- [ ] Email confirmations testées
- [ ] Gestion d'erreurs implémentée

### PayPal
- [ ] Compte Business créé
- [ ] Mode Live activé
- [ ] Client ID production configuré
- [ ] IPN (Instant Payment Notification) configuré

### Security
- [ ] HTTPS activé (obligatoire)
- [ ] Validation backend implémentée
- [ ] Pas de données sensibles en localStorage
- [ ] CORS configuré correctement
- [ ] Rate limiting ajouté

---

## 📚 RESSOURCES

### Documentation
- **Stripe Docs** : https://stripe.com/docs
- **Stripe React** : https://stripe.com/docs/stripe-js/react
- **PayPal Docs** : https://developer.paypal.com/docs/

### Tutorials
- Stripe + React : https://www.youtube.com/watch?v=1r-F3FIONl8
- PayPal + React : https://www.youtube.com/watch?v=ILmHt1VFm9Y

### Testing
- Stripe Test Cards : https://stripe.com/docs/testing
- PayPal Sandbox : https://developer.paypal.com/tools/sandbox/

---

## 🎯 PRIORITÉS

### Must-Have (MVP)
1. ✅ Checkout avec Stripe
2. ✅ Shipping address form
3. ✅ Order confirmation page
4. ✅ Basic error handling

### Should-Have
5. ⭐ PayPal alternative
6. ⭐ Email confirmations
7. ⭐ Order history

### Nice-to-Have
8. 💡 Apple Pay / Google Pay
9. 💡 Promo codes
10. 💡 Multiple shipping options
11. 💡 Save payment methods
12. 💡 Subscription payments

---

**Date** : 30 Octobre 2025  
**Status** : 📋 Guide complet - Prêt à implémenter  
**Priorité** : 🟡 Basse (optionnel)  
**Effort** : 🟡 Moyen (1-2 semaines)  
**Recommandation** : Stripe > PayPal (fees + UX)
