# 🚀 CHECKLIST DE DÉPLOIEMENT

Date de début: ___________  
Complété par: ___________

---

## ☁️ Phase 1: MongoDB Atlas

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster gratuit (M0) créé
- [ ] Région sélectionnée: _____________
- [ ] Utilisateur base de données créé
  - Username: `ecommerce-admin`
  - Password sauvegardé: ✅
- [ ] IP Whitelist configurée (0.0.0.0/0 ou IP Railway)
- [ ] Connection string obtenue et sauvegardée
- [ ] Test de connexion réussi
- [ ] Données migrées (si applicable)

**Connection String:**
```
mongodb+srv://ecommerce-admin:_______________@ecommerce-cluster.xxxxx.mongodb.net/ecommerce
```

---

## 🚂 Phase 2: Railway (Backend)

- [ ] Compte Railway créé
- [ ] Repository GitHub préparé et push
- [ ] Nouveau projet Railway créé
- [ ] Repository connecté
- [ ] Root directory configuré: `/backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### Variables d'Environnement Railway:

- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI=_______________`
- [ ] `JWT_SECRET=_______________` (généré avec generate-jwt-secret.js)
- [ ] `JWT_EXPIRE=7d`
- [ ] `STRIPE_SECRET_KEY=sk_live_______________`
- [ ] `STRIPE_PUBLIC_KEY=pk_live_______________`
- [ ] `STRIPE_WEBHOOK_SECRET=whsec_______________`
- [ ] `FRONTEND_URL=https://_______________`
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER=_______________`
- [ ] `EMAIL_PASSWORD=_______________`

### Vérifications Railway:

- [ ] Build réussi (vert)
- [ ] Déploiement actif
- [ ] URL obtenue: `https://_______________`
- [ ] Test health check: `curl https://[URL]/api/health`
- [ ] Logs sans erreurs

---

## 🎨 Phase 3: Netlify (Frontend)

- [ ] Compte Netlify créé
- [ ] Nouveau site créé
- [ ] Repository GitHub connecté
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Base directory: `/` (root)

### Variables d'Environnement Netlify:

- [ ] `VITE_API_URL=https://_______________` (URL Railway)
- [ ] `VITE_STRIPE_PUBLIC_KEY=pk_live_______________`

### Vérifications Netlify:

- [ ] Build réussi
- [ ] Site publié
- [ ] URL obtenue: `https://_______________`
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] HTTPS actif (automatique)
- [ ] Test d'accès au site

---

## 💳 Phase 4: Stripe Production

- [ ] Compte Stripe en mode Live
- [ ] Clés de production obtenues:
  - [ ] `pk_live________________`
  - [ ] `sk_live________________`
- [ ] Webhook configuré
  - URL: `https://[RAILWAY_URL]/api/stripe/webhook`
  - Events: payment_intent.succeeded, payment_intent.payment_failed, checkout.session.completed
  - Secret: `whsec________________`
- [ ] Variables mises à jour dans Railway et Netlify
- [ ] Redéploiement effectué

---

## ✅ Phase 5: Tests de Production

### Tests Backend:

- [ ] Health check: `GET /api/health`
- [ ] Products: `GET /api/products`
- [ ] Categories: `GET /api/categories`
- [ ] Stripe config: `GET /api/payments/config`

### Tests Frontend:

- [ ] Page d'accueil charge
- [ ] Pas d'erreurs CORS dans la console
- [ ] Navigation fonctionne
- [ ] Images chargent

### Tests PWA:

- [ ] Lighthouse audit > 90
- [ ] Service worker enregistré
- [ ] Manifest valide
- [ ] Installable sur mobile

### Tests SEO:

- [ ] Mobile-friendly test: https://search.google.com/test/mobile-friendly
- [ ] Open Graph validator: https://www.opengraph.xyz/
- [ ] Sitemap accessible: /sitemap.xml
- [ ] Robots.txt accessible: /robots.txt

### Tests Performance:

- [ ] PageSpeed Insights > 90
- [ ] Response time < 500ms
- [ ] Compression active

### Test Checkout Complet:

- [ ] Ajouter produit au panier
- [ ] Accéder au checkout
- [ ] Remplir informations
- [ ] Paiement test (4242 4242 4242 4242)
- [ ] Confirmation reçue
- [ ] Commande créée dans MongoDB
- [ ] Email de confirmation (si configuré)

---

## 📊 Monitoring Post-Déploiement

### Jour 1-7:

- [ ] Vérifier logs Railway quotidiennement
- [ ] Surveiller erreurs Netlify
- [ ] Monitorer connexions MongoDB Atlas
- [ ] Tester checkout au moins 1x/jour

### Semaine 2-4:

- [ ] Performance stable
- [ ] Pas de pics d'erreurs
- [ ] Usage MongoDB acceptable
- [ ] Stripe transactions OK

---

## 🎉 DÉPLOIEMENT COMPLET

- [ ] Tous les tests passent
- [ ] Monitoring configuré
- [ ] Documentation mise à jour
- [ ] Équipe informée (si applicable)
- [ ] Backup strategy en place

**Date de déploiement final:** ___________  
**URL Production:** https://_______________  
**Statut:** 🟢 EN LIGNE

---

## 📞 Contacts Urgence

- **Railway Support:** https://railway.app/help
- **Netlify Support:** https://www.netlify.com/support/
- **MongoDB Atlas:** https://support.mongodb.com/
- **Stripe Support:** https://support.stripe.com/

---

**Notes supplémentaires:**

_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________
