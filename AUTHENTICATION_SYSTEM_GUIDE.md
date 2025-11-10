# 🔐 Guide de Configuration et Test - Système d'Authentification

## ✅ Implémentations Complètes

### Backend

#### 1. Service Email (`backend/src/utils/emailService.ts`)
- ✅ Génération de codes à 6 chiffres
- ✅ Envoi d'emails de réinitialisation
- ✅ Envoi d'emails de confirmation

#### 2. Modèles mis à jour
- ✅ **Client** : Ajout de `resetPasswordToken` et `resetPasswordExpires`
- ✅ **Admin** : Ajout de `resetPasswordToken` et `resetPasswordExpires`

#### 3. Controllers
- ✅ **clientAuthController.ts** :
  - `forgotPassword` - Demande de code de réinitialisation
  - `resetPassword` - Vérification du code et réinitialisation
  - `changePassword` - Changement de mot de passe (corrigé)

- ✅ **authController.ts** (Admin) :
  - `forgotAdminPassword` - Demande de code de réinitialisation
  - `resetAdminPassword` - Vérification du code et réinitialisation
  - `changeAdminPassword` - Changement de mot de passe

#### 4. Routes
- ✅ **Client** (`/api/client-auth`) :
  - `POST /forgot-password` - Demander un code
  - `POST /reset-password` - Réinitialiser avec le code
  - `PUT /change-password` - Changer mot de passe (protégé)

- ✅ **Admin** (`/api/admin/auth`) :
  - `POST /forgot-password` - Demander un code
  - `POST /reset-password` - Réinitialiser avec le code
  - `PUT /change-password` - Changer mot de passe (protégé)

#### 5. Protection des Routes
- ✅ Routes de panier : Déjà protégées par `clientAuthMiddleware`
- ✅ Routes de commandes client : Déjà protégées par `clientAuthMiddleware`
- ✅ Routes admin : Déjà protégées par `authMiddleware`

### Frontend

#### 1. Pages créées
- ✅ **UnifiedLoginPage** (`/`) : Page d'accueil avec choix Client/Admin
- ✅ **ForgotPasswordClientPage** : Gestion de la réinitialisation pour Client et Admin
  - Étape 1 : Saisie de l'email
  - Étape 2 : Saisie du code + nouveau mot de passe
  - Étape 3 : Confirmation de succès

#### 2. Routes configurées
- ✅ `/` - Login unifié (client ou admin)
- ✅ `/login` - Login unifié
- ✅ `/forgot-password` - Réinitialisation client
- ✅ `/admin/forgot-password` - Réinitialisation admin
- ✅ `/checkout` - Protégé (nécessite login client)
- ✅ Toutes les routes admin - Protégées (nécessite login admin)

## 📧 Configuration Email

### Étape 1 : Configurer Gmail

1. **Activer la validation en 2 étapes** sur votre compte Google
   - Allez sur https://myaccount.google.com/security
   - Activez la validation en 2 étapes

2. **Créer un mot de passe d'application**
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "Autre" comme application
   - Nommez-le "E-commerce App"
   - Copiez le mot de passe généré (16 caractères)

### Étape 2 : Configurer backend/.env

```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Le mot de passe d'application de 16 caractères
```

## 🧪 Tests à Effectuer

### Test 1 : Réinitialisation de Mot de Passe Client

```bash
# 1. Démarrer le backend
cd backend
npm run dev

# 2. Démarrer le frontend (dans un autre terminal)
cd E-commerce_Store
npm run dev
```

**Étapes de test :**
1. Ouvrir http://localhost:3000/
2. Cliquer sur "Mot de passe oublié ?"
3. Entrer un email de client existant
4. Vérifier l'email reçu avec le code à 6 chiffres
5. Copier le code et le coller dans l'application
6. Entrer un nouveau mot de passe
7. Vérifier que vous êtes automatiquement connecté

### Test 2 : Réinitialisation de Mot de Passe Admin

**Étapes de test :**
1. Ouvrir http://localhost:3000/
2. Cliquer sur "Admin" dans le sélecteur de mode
3. Cliquer sur "Mot de passe oublié ?"
4. Entrer un email d'admin existant (admin@ecommerce.com)
5. Vérifier l'email reçu avec le code à 6 chiffres
6. Copier le code et le coller dans l'application
7. Entrer un nouveau mot de passe (minimum 8 caractères)
8. Vérifier que vous êtes automatiquement connecté au dashboard admin

### Test 3 : Changement de Mot de Passe (Client)

**Étapes de test :**
1. Se connecter en tant que client
2. Aller sur la page de profil
3. Chercher l'option "Changer le mot de passe"
4. Entrer : ancien mot de passe, nouveau mot de passe, confirmation
5. Vérifier l'email de confirmation
6. Tester la connexion avec le nouveau mot de passe

### Test 4 : Protection des Routes

**Test Client :**
1. Se déconnecter
2. Essayer d'accéder à `/checkout`
3. Vérifier la redirection vers la page de login
4. Se connecter
5. Vérifier l'accès à `/checkout`

**Test Admin :**
1. Se déconnecter
2. Essayer d'accéder à `/admin`
3. Vérifier la redirection vers la page de login admin
4. Se connecter en tant qu'admin
5. Vérifier l'accès au dashboard admin

## 🔍 API Tests avec curl

### Client - Demander un code de réinitialisation
```bash
curl -X POST http://localhost:5000/api/client-auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com"}'
```

### Client - Réinitialiser le mot de passe
```bash
curl -X POST http://localhost:5000/api/client-auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"client@example.com",
    "code":"123456",
    "newPassword":"newpass123"
  }'
```

### Admin - Demander un code de réinitialisation
```bash
curl -X POST http://localhost:5000/api/admin/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com"}'
```

### Admin - Réinitialiser le mot de passe
```bash
curl -X POST http://localhost:5000/api/admin/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@ecommerce.com",
    "code":"123456",
    "newPassword":"Admin@1234"
  }'
```

## 🚨 Problèmes Communs et Solutions

### Erreur : "Failed to send reset email"
- Vérifier que EMAIL_USER et EMAIL_PASSWORD sont correctement configurés dans .env
- Vérifier que le mot de passe d'application Gmail est valide
- Vérifier que la validation en 2 étapes est activée sur Gmail

### Erreur : "Reset code has expired"
- Le code expire après 10 minutes
- Demander un nouveau code

### Erreur : "Invalid reset code"
- Vérifier que le code saisi est correct (6 chiffres)
- Vérifier que vous utilisez le bon email
- Le code est sensible à la casse

### Erreur : "No reset code requested"
- Vous devez d'abord demander un code avant de pouvoir réinitialiser
- Utiliser d'abord `/forgot-password` puis `/reset-password`

## 📝 Notes Importantes

1. **Sécurité** :
   - Les codes de réinitialisation expirent après 10 minutes
   - Les mots de passe sont hachés avec bcrypt
   - Les tokens JWT expirent après 30 jours

2. **Validation** :
   - Client : minimum 6 caractères pour le mot de passe
   - Admin : minimum 8 caractères pour le mot de passe

3. **Emails** :
   - Les emails sont envoyés de manière asynchrone
   - En cas d'erreur d'envoi, le code est supprimé de la base de données

4. **Expérience Utilisateur** :
   - Après réinitialisation réussie, l'utilisateur est automatiquement connecté
   - Les messages d'erreur sont clairs et informatifs
   - Le processus est guidé étape par étape

## 🎯 Prochaines Étapes

1. Configurer vos identifiants Gmail dans `backend/.env`
2. Tester le flux complet de réinitialisation
3. Créer un compte client de test
4. Tester tous les scénarios (succès et erreurs)
5. Vérifier les emails reçus

Bonne chance avec les tests ! 🚀
