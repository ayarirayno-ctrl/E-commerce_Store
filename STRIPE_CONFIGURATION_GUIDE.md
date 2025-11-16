# 🔐 Guide de Configuration Stripe

## ✅ Configuration Complète

Les fichiers `.env` ont été créés avec des placeholders. Suivez ces étapes pour obtenir vos clés Stripe réelles.

---

## 📋 Étapes de Configuration

### 1️⃣ Créer un Compte Stripe (Gratuit)

1. Aller sur **https://stripe.com**
2. Cliquer sur **Sign up** (ou **Se connecter** si vous avez déjà un compte)
3. Remplir les informations:
   - Email
   - Nom complet
   - Pays
   - Mot de passe
4. Vérifier votre email
5. Vous serez automatiquement en **mode test** (parfait pour développement)

---

### 2️⃣ Obtenir les Clés API

1. **Se connecter au Dashboard Stripe**: https://dashboard.stripe.com
2. **Aller dans Developers → API keys**
3. Vous verrez 2 clés en mode test:

#### 📌 Publishable Key (Clé Publique)
- Format: `pk_test_51QMXpB...`
- **Utilisation**: Frontend (visible dans le code)
- **Copier cette clé** et la mettre dans `.env` (racine du projet):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QMXpBRuBWmIdZy0Uf...
```

#### 🔒 Secret Key (Clé Secrète)
- Format: `sk_test_51QMXpB...`
- **Utilisation**: Backend (NE JAMAIS la mettre dans le frontend)
- **Copier cette clé** et la mettre dans `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_51QMXpBRuBWmIdZy0Uf...
```

---

### 3️⃣ Configurer les Webhooks

Les webhooks permettent à Stripe de notifier votre backend des événements de paiement.

#### Création du Webhook Endpoint

1. **Dashboard Stripe → Developers → Webhooks**
2. Cliquer sur **Add endpoint**
3. Remplir le formulaire:

   **Endpoint URL**:
   ```
   http://localhost:5000/api/stripe/webhook
   ```

   **Description** (optionnel):
   ```
   E-commerce Development Webhooks
   ```

   **Events to send**:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

4. Cliquer sur **Add endpoint**

#### Récupérer le Webhook Secret

1. Après création, cliquer sur votre webhook
2. Copier le **Signing secret** (format: `whsec_...`)
3. Le mettre dans `backend/.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_abcdef123456...
```

---

## 📂 Fichiers de Configuration

### Frontend `.env`
```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000
VITE_USE_BACKEND=true

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QMXpBRuBWmIdZy0Uf...
```

### Backend `.env`
```env
# Environment
NODE_ENV=development

# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=e-commerce-jwt-secret-key-2025-super-secure

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ayarirayen539@gmail.com
EMAIL_PASS=axsy lvdn mhsi bkbs

# Frontend URL
FRONTEND_URL=http://localhost:3002

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51QMXpBRuBWmIdZy0Uf...
STRIPE_WEBHOOK_SECRET=whsec_abcdef123456...
```

---

## 🧪 Tester le Paiement

### 1. Démarrer les Serveurs

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

### 2. Ajouter des Produits au Panier

1. Ouvrir **http://localhost:3002**
2. Parcourir les produits
3. Cliquer sur **Add to Cart**
4. Aller dans le panier (icône en haut à droite)

### 3. Procéder au Checkout

1. Cliquer sur **Proceed to Checkout**
2. Remplir les informations de livraison
3. Vous serez redirigé vers **Stripe Checkout** (page hébergée par Stripe)

### 4. Utiliser une Carte de Test

**Carte de test réussie**:
- Numéro: `4242 4242 4242 4242`
- Date d'expiration: N'importe quelle date future (ex: `12/34`)
- CVC: N'importe quel 3 chiffres (ex: `123`)
- Code postal: N'importe quoi (ex: `12345`)

**Autres cartes de test**:
- **Paiement refusé**: `4000 0000 0000 0002`
- **Authentification 3D Secure**: `4000 0025 0000 3155`
- **Carte expirée**: `4000 0000 0000 0069`

### 5. Vérifier le Succès

Après paiement réussi:
- ✅ Redirection vers `/payment/success?session_id=cs_test_...`
- ✅ Affichage du montant payé
- ✅ Création de la commande dans MongoDB
- ✅ Email de confirmation envoyé
- ✅ Webhook reçu dans les logs backend

---

## 🔍 Vérification

### Dashboard Stripe

1. **Payments**: https://dashboard.stripe.com/test/payments
   - Voir tous les paiements de test
   - Statut: Succeeded, Canceled, Failed

2. **Customers**: https://dashboard.stripe.com/test/customers
   - Voir les clients créés

3. **Webhooks**: https://dashboard.stripe.com/test/webhooks
   - Voir les événements envoyés
   - Vérifier si les webhooks sont livrés

### Logs Backend

```
✅ Stripe checkout session created: cs_test_abc123
✅ Webhook received: checkout.session.completed
✅ Order created: 60f7b3c4e5d6a7b8c9d0e1f2
✅ Confirmation email sent to: user@example.com
```

---

## ⚠️ Sécurité

### ❌ NE JAMAIS FAIRE:

1. **Commiter les clés Stripe dans Git**:
   - `.env` est dans `.gitignore`
   - Ne jamais hardcoder les clés dans le code

2. **Exposer les clés secrètes**:
   - `STRIPE_SECRET_KEY` uniquement dans backend
   - Ne jamais l'envoyer au frontend

3. **Utiliser les clés de test en production**:
   - Clés de test: `pk_test_...`, `sk_test_...`
   - Clés de production: `pk_live_...`, `sk_live_...`

### ✅ Bonnes Pratiques:

1. **Variables d'environnement**:
   - Toujours utiliser `.env`
   - Différents fichiers pour dev/staging/prod

2. **Validation des Webhooks**:
   - Toujours vérifier la signature
   - Code déjà implémenté dans `stripeController.js`

3. **HTTPS en Production**:
   - Stripe exige HTTPS pour les webhooks en production
   - Utilisez Vercel/Render/Railway (HTTPS automatique)

---

## 🚀 Mode Production

### Activer les Clés Live

1. **Dashboard Stripe → Developers → API keys**
2. Basculer vers **Live mode** (toggle en haut à droite)
3. Copier les nouvelles clés:
   - `pk_live_...` → Frontend `.env`
   - `sk_live_...` → Backend `.env`

### Configurer Webhooks Production

1. **Dashboard Stripe → Webhooks** (mode Live)
2. **Add endpoint** avec l'URL de production:
   ```
   https://votredomaine.com/api/stripe/webhook
   ```
3. Copier le nouveau `whsec_...` → Backend `.env`

### Variables Production

**Frontend `.env.production`**:
```env
VITE_API_URL=https://votredomaine.com
VITE_USE_BACKEND=true
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Backend `.env.production`**:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://votredomaine.com
```

---

## 📚 Ressources

- **Documentation Stripe**: https://stripe.com/docs
- **API Reference**: https://stripe.com/docs/api
- **Webhooks Guide**: https://stripe.com/docs/webhooks
- **Testing Guide**: https://stripe.com/docs/testing
- **Security Best Practices**: https://stripe.com/docs/security/guide

---

## 🎉 Félicitations !

Votre système de paiement Stripe est maintenant configuré ! 🚀

**Prochaines étapes**:
1. ✅ Tester avec des cartes de test
2. ✅ Vérifier les webhooks
3. ✅ Consulter les paiements dans le Dashboard
4. 🔜 Implémenter Order Management System
5. 🔜 Ajouter Multi-langue FR/EN
