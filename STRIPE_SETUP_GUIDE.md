# Configuration Stripe pour E-commerce

## 🔑 Variables d'environnement requises

Ajouter dans `backend/.env` :

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL pour redirection
FRONTEND_URL=http://localhost:3000
```

## 📦 Installation

### Backend :
```bash
cd backend
npm install stripe
```

### Frontend :
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## 🚀 Obtenir les clés Stripe

1. Créer un compte sur https://stripe.com
2. Aller dans **Developers** → **API keys**
3. Copier :
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)
4. Pour le webhook :
   - Aller dans **Developers** → **Webhooks**
   - Ajouter un endpoint : `http://localhost:5000/api/stripe/webhook`
   - Sélectionner les événements :
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copier le **Signing secret** (whsec_...)

## 📝 Configuration complète

Les fichiers suivants ont été créés :

### Backend :
- `backend/src/controllers/stripeController.js` - Logique Stripe
- `backend/src/routes/stripe.js` - Routes API Stripe
- `backend/src/middleware/stripeWebhook.js` - Middleware webhook

### Frontend :
- `src/components/checkout/StripeCheckout.tsx` - Composant Stripe
- `src/pages/PaymentSuccessPage.tsx` - Page succès
- `src/pages/PaymentCancelPage.tsx` - Page annulation

## 🧪 Test en mode développement

### 1. Cartes de test Stripe :
```
Succès : 4242 4242 4242 4242
Échec : 4000 0000 0000 0002
3D Secure : 4000 0027 6000 3184

CVC : n'importe quel 3 chiffres
Date : n'importe quelle date future
```

### 2. Tester les webhooks localement :
```bash
# Installer Stripe CLI
# Puis lancer :
stripe listen --forward-to localhost:5000/api/stripe/webhook

# Cela donnera un webhook secret à utiliser dans .env
```

## ✅ Vérification

Une fois configuré :

1. Aller sur `/checkout`
2. Remplir le formulaire de paiement Stripe
3. Utiliser une carte de test
4. Vérifier :
   - Redirection vers `/payment/success`
   - Email de confirmation envoyé
   - Commande créée dans la base de données
   - Statut de paiement = "paid"

## 🔒 Sécurité

- ✅ Les clés secrètes sont dans .env (jamais dans le code)
- ✅ Webhook signé avec secret pour validation
- ✅ Vérification du montant côté serveur
- ✅ Protection CSRF sur les endpoints
- ✅ Rate limiting sur les routes de paiement

## 🌍 Production

Pour passer en production :

1. Remplacer les clés de test par les clés live :
   - `sk_live_...` au lieu de `sk_test_...`
   - `pk_live_...` au lieu de `pk_test_...`
2. Configurer le webhook sur l'URL de production
3. Activer HTTPS obligatoire
4. Vérifier la conformité PCI DSS

## 📧 Support

Docs Stripe : https://stripe.com/docs
Dashboard : https://dashboard.stripe.com
