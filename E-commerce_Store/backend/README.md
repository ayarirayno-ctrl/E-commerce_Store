# E-commerce Backend API

Backend Node.js/Express pour l'application e-commerce.

## Déploiement

### Railway
1. Connectez ce repo à Railway
2. Configurez les variables d'environnement
3. Déployez automatiquement

## Variables d'environnement requises

- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI` - Votre connection string MongoDB
- `JWT_SECRET` - Secret pour les tokens JWT
- `FRONTEND_URL` - URL de votre frontend Vercel
- `EMAIL_USER` - Email Gmail pour l'envoi d'emails
- `EMAIL_PASS` - Mot de passe d'application Gmail
- `STRIPE_SECRET_KEY` - Clé secrète Stripe

## Commandes

```bash
npm install
npm start
```
