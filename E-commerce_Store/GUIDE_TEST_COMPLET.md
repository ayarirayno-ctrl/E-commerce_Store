# 🎯 GUIDE COMPLET - TESTER VOTRE E-COMMERCE

## ✅ Statut Actuel

### ✅ Backend (100% Prêt)
- Serveur Node.js : **http://localhost:5000** ✅ DÉMARRÉ
- MongoDB : ✅ CONNECTÉ
- Compte Admin créé : `ayarirayen539@gmail.com` / `admin123` ✅

### ✅ Frontend (100% Prêt)
- Serveur React : **http://localhost:3002** ✅ DÉMARRÉ
- AuthContext mis à jour pour utiliser l'API réelle ✅
- Services authService et orderService créés ✅

### ⚠️ EN ATTENTE
- **Gmail App Password** - OBLIGATOIRE pour l'envoi d'emails

---

## 🚨 ACTION URGENTE : Configurer Gmail

### Pourquoi c'est bloquant ?
Sans Gmail App Password, les clients **NE PEUVENT PAS** :
- Recevoir leur code de vérification par email
- Activer leur compte
- Se connecter

### Comment faire (2 minutes) :

**Étape 1 : Générer l'App Password**

1. Ouvrez : **https://myaccount.google.com/apppasswords**
2. Si validation en 2 étapes pas active :
   - Allez d'abord sur : https://myaccount.google.com/security
   - Activez "Validation en 2 étapes"
   - Revenez à l'étape 1
3. Créez un App Password :
   - Nom : `E-commerce Backend`
   - Copiez le code de 16 caractères : `xxxx xxxx xxxx xxxx`

**Étape 2 : Le configurer**

Donnez-moi le code et je le mets immédiatement dans `backend/.env` !

**OU faites-le vous-même :**

1. Ouvrez : `backend/.env`
2. Remplacez :
   ```env
   EMAIL_PASS=your_gmail_app_password_here
   ```
   Par :
   ```env
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```
3. Sauvegardez le fichier
4. Redémarrez le backend (dans le terminal backend, appuyez sur `rs` + Entrée)

---

## 🧪 TEST COMPLET - Inscription d'un Client

### Scénario : Un nouveau client s'inscrit sur votre site

**1. Ouvrir le site en local**

Allez sur : **http://localhost:3002**

**2. Aller sur la page d'inscription**

- Cliquez sur "Sign In" ou "Login" dans le header
- Ou allez directement sur : http://localhost:3002/auth

**3. Créer un compte**

- Cliquez sur "Create Account" (si vous êtes sur Sign In)
- Remplissez le formulaire :
  ```
  Name: Jean Dupont
  Email: VOTRE_VRAI_EMAIL@gmail.com  ← Utilisez un vrai email !
  Password: password123
  Confirm Password: password123
  ```
- Cliquez sur **"Create Account"**

**4. Résultats attendus**

✅ **Message de succès apparaît** :
```
"Inscription réussie ! Vérifiez votre email pour activer votre compte."
```

✅ **Dans votre boîte mail, vous recevez un email** :
- Expéditeur : ayarirayen539@gmail.com
- Sujet : "Vérification de votre compte E-commerce Store"
- Contenu : Email HTML professionnel avec bouton "Vérifier mon email"

**5. Vérifier l'email**

- Ouvrez l'email reçu
- Cliquez sur **"Vérifier mon email"**
- OU copiez le lien et ouvrez-le dans votre navigateur

**6. Résultats attendus après vérification**

✅ **Page de vérification s'affiche** :
- Icône de succès verte
- Message : "Email Vérifié!"
- Redirection automatique après 3 secondes

✅ **2ème email reçu** :
- Sujet : "Bienvenue dans E-commerce Store"
- Email de bienvenue avec vos avantages

**7. Se connecter**

- Retournez sur : http://localhost:3002/auth
- Remplissez :
  ```
  Email: VOTRE_EMAIL@gmail.com
  Password: password123
  ```
- Cliquez sur **"Sign In"**

**8. Résultats attendus**

✅ Connexion réussie
✅ Redirection vers la page d'accueil
✅ Votre nom apparaît dans le header
✅ Vous avez accès à votre espace client

---

## 🛒 TEST - Passer une Commande

**Une fois connecté :**

1. **Ajoutez des produits au panier**
   - Parcourez les produits
   - Cliquez sur "Add to Cart"
   - Vérifiez le panier

2. **Procéder au checkout**
   - Cliquez sur le panier
   - Cliquez sur "Checkout" ou "Commander"

3. **Remplir l'adresse de livraison**
   ```
   Prénom: Jean
   Nom: Dupont
   Adresse: 123 Avenue Habib Bourguiba
   Ville: Tunis
   Code Postal: 1000
   Pays: Tunisia
   Téléphone: +216 94 816 735
   ```

4. **Choisir le mode de paiement**
   - Carte bancaire
   - PayPal
   - Paiement à la livraison

5. **Valider la commande**

**Résultats attendus :**

✅ **Commande créée avec succès**
✅ **Numéro de commande affiché** : `ORD-1730308800-001`
✅ **Email de confirmation reçu** avec :
- Détails de la commande
- Liste des produits
- Prix total
- Adresse de livraison

✅ **Commande visible dans votre profil**
- Allez dans "Mon Compte" ou "Profil"
- Section "Mes Commandes"
- Voir le statut : "En attente"

---

## 👨‍💼 TEST ADMIN - Gérer les Clients

### Connexion Admin

1. **Déconnectez-vous** du compte client
2. **Allez sur** : http://localhost:3002/admin/login
3. **Connectez-vous** :
   ```
   Email: ayarirayen539@gmail.com
   Password: admin123
   ```

### Fonctionnalités Admin

✅ **Dashboard**
- Statistiques générales
- Nombre de clients
- Nombre de commandes
- Revenus

✅ **Gestion des Clients**
- Voir tous les clients enregistrés
- Email vérifié ou non
- Date d'inscription
- Bloquer/Débloquer un client (si implémenté)

✅ **Gestion des Commandes**
- Voir toutes les commandes
- Changer le statut : En cours → Expédiée → Livrée
- Ajouter un numéro de suivi
- Annuler une commande

✅ **Emails automatiques**
- Quand admin change statut en "Expédiée"
- Client reçoit email avec numéro de suivi

---

## 📊 Base de Données MongoDB

### Voir les données dans MongoDB

**Option 1 : MongoDB Compass (Interface graphique)**

1. Téléchargez : https://www.mongodb.com/try/download/compass
2. Connectez-vous à : `mongodb://localhost:27017`
3. Ouvrez la base de données : `ecommerce`
4. Collections :
   - `users` : Voir tous les clients et admin
   - `orders` : Voir toutes les commandes

**Option 2 : Ligne de commande**

```bash
# Ouvrir MongoDB Shell
mongosh

# Utiliser la base de données
use ecommerce

# Voir tous les users
db.users.find().pretty()

# Voir tous les orders
db.orders.find().pretty()

# Compter les users
db.users.countDocuments()

# Trouver l'admin
db.users.findOne({ role: "admin" })

# Voir les clients non vérifiés
db.users.find({ isEmailVerified: false })
```

---

## 🐛 Dépannage

### Erreur : "Network Error" ou "Failed to fetch"

**Causes possibles** :
1. Backend non démarré
2. Frontend essaie de se connecter au mauvais port

**Solutions** :
1. Vérifiez que le backend tourne : http://localhost:5000/api/health
2. Vérifiez `.env.local` dans le frontend : `VITE_API_URL=http://localhost:5000/api`
3. Redémarrez le frontend : `npm run dev`

### Erreur : "Email non reçu"

**Solutions** :
1. Vérifiez le dossier Spam
2. Vérifiez que Gmail App Password est configuré
3. Regardez les logs du backend pour voir l'URL de vérification
4. Utilisez cette URL manuellement

### Erreur : "CORS Policy"

**Solution** :
1. Dans `backend/.env`, vérifiez : `FRONTEND_URL=http://localhost:3002`
2. Redémarrez le backend
3. Rafraîchissez la page frontend

### Erreur : "Email ou mot de passe invalide"

**Solutions** :
1. Vérifiez que l'email est bien vérifié (cliquez sur le lien de l'email)
2. Les nouveaux comptes DOIVENT vérifier leur email avant de se connecter
3. Pour l'admin : `ayarirayen539@gmail.com` / `admin123` (déjà vérifié)

---

## 📝 Checklist Finale

### Configuration
- [ ] Gmail App Password généré et configuré
- [ ] Backend démarré (http://localhost:5000)
- [ ] Frontend démarré (http://localhost:3002)
- [ ] MongoDB connecté

### Tests Client
- [ ] Inscription d'un nouveau client
- [ ] Email de vérification reçu
- [ ] Vérification email réussie
- [ ] Email de bienvenue reçu
- [ ] Connexion réussie
- [ ] Ajout produits au panier
- [ ] Création d'une commande
- [ ] Email de confirmation de commande reçu
- [ ] Commande visible dans le profil

### Tests Admin
- [ ] Connexion admin réussie
- [ ] Voir tous les clients dans le dashboard
- [ ] Voir toutes les commandes
- [ ] Changer le statut d'une commande
- [ ] Client reçoit email de suivi

### Base de Données
- [ ] Clients enregistrés visibles dans MongoDB
- [ ] Commandes enregistrées dans MongoDB
- [ ] Email vérifié = `true` après vérification

---

## 🚀 Prochaines Étapes

### Option A ✅ (Tests Backend) - EN COURS
- ⏳ Configurer Gmail App Password
- ⏳ Tester le flow complet inscription → commande
- ⏳ Vérifier que tout fonctionne

### Option B ⏳ (Intégration Frontend)
- Déployer sur Vercel avec la vraie API
- Mettre à jour les variables d'environnement

### Option C ⏳ (Déploiement Production)
- MongoDB Atlas (base de données cloud)
- Déployer backend sur Railway/Heroku
- Connecter frontend Vercel au backend cloud

---

## ❓ Actions Immédiates

**DONNEZ-MOI VOTRE GMAIL APP PASSWORD ET JE CONFIGURE TOUT !**

Format : `xxxx xxxx xxxx xxxx` (16 caractères)

Dès que c'est fait, vous pourrez tester immédiatement :
1. Ouvrir http://localhost:3002
2. Créer un compte
3. Recevoir l'email de vérification
4. Activer votre compte
5. Se connecter
6. Passer une commande
7. Voir l'historique

**Tout est prêt, il manque juste le Gmail App Password ! 🎯**
