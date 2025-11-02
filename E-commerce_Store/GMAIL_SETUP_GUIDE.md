# 📧 Guide Configuration Gmail pour l'Envoi d'Emails

## 🎯 Étape 1 : Créer un App Password Gmail

### 1.1 Prérequis
- Avoir un compte Gmail (ayarirayen539@gmail.com)
- Activer la validation en 2 étapes

### 1.2 Procédure complète

**A. Activer la validation en 2 étapes**

1. Allez sur : https://myaccount.google.com/security
2. Dans la section "Se connecter à Google", cliquez sur **"Validation en 2 étapes"**
3. Cliquez sur **"Commencer"**
4. Suivez les étapes pour configurer :
   - Entrez votre mot de passe
   - Choisissez votre méthode (SMS ou application Authenticator)
   - Validez avec le code reçu

**B. Créer un mot de passe d'application**

1. Retournez sur : https://myaccount.google.com/apppasswords
2. Dans "Sélectionner l'application", choisissez **"Autre (nom personnalisé)"**
3. Tapez : **"E-commerce Backend"**
4. Cliquez sur **"Générer"**
5. **COPIEZ** le mot de passe généré (16 caractères, format : xxxx xxxx xxxx xxxx)

⚠️ **IMPORTANT** : Ce mot de passe ne s'affichera qu'une seule fois !

---

## 🔧 Étape 2 : Configurer le Backend

### 2.1 Modifier le fichier `.env`

Ouvrez `backend/.env` et remplacez cette ligne :
```env
EMAIL_PASS=your_gmail_app_password_here
```

Par :
```env
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

*(Remplacez `xxxx xxxx xxxx xxxx` par votre vrai App Password)*

### 2.2 Vérifier les autres paramètres

Votre fichier `.env` devrait ressembler à ceci :
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
EMAIL_PASS=xxxx xxxx xxxx xxxx  ← VOTRE APP PASSWORD ICI

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Étape 3 : Tester l'API avec Thunder Client / Postman

### 3.1 Installer Thunder Client (Recommandé - Extension VS Code)

1. Dans VS Code, allez dans Extensions (Ctrl+Shift+X)
2. Recherchez **"Thunder Client"**
3. Installez l'extension
4. Cliquez sur l'icône Thunder Client dans la barre latérale

### 3.2 OU Installer Postman

1. Téléchargez : https://www.postman.com/downloads/
2. Installez et ouvrez Postman

---

## 🧪 Étape 4 : Tests API

### Test 1 : Health Check (Vérifier que le serveur tourne)

**Méthode :** GET  
**URL :** `http://localhost:5000/api/health`

**Résultat attendu :**
```json
{
  "message": "API is running...",
  "environment": "development",
  "timestamp": "2025-10-30T..."
}
```

---

### Test 2 : Inscription (Register)

**Méthode :** POST  
**URL :** `http://localhost:5000/api/auth/register`  
**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "firstName": "Rayen",
  "lastName": "Ayari",
  "email": "ayarirayen539@gmail.com",
  "password": "password123",
  "phone": "+216 94 816 735"
}
```

**Résultat attendu :**
```json
{
  "message": "Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.",
  "userId": "67..."
}
```

**📧 Vérifiez votre boîte mail !** Vous devriez recevoir un email avec :
- Sujet : "Vérification de votre compte E-commerce Store"
- Bouton "Vérifier mon email"
- Lien de vérification

---

### Test 3 : Vérification Email

**ATTENTION :** Copiez le token depuis l'URL de l'email reçu !

L'URL dans l'email ressemble à :
```
http://localhost:5173/verify-email/abc123def456...
```

Copiez uniquement le token (la partie après `/verify-email/`)

**Méthode :** GET  
**URL :** `http://localhost:5000/api/auth/verify-email/VOTRE_TOKEN_ICI`

**Résultat attendu :**
```json
{
  "message": "Email vérifié avec succès !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67...",
    "firstName": "Rayen",
    "lastName": "Ayari",
    "email": "ayarirayen539@gmail.com",
    "role": "user",
    "isEmailVerified": true
  }
}
```

**📧 Vous recevrez un 2ème email de bienvenue !**

---

### Test 4 : Connexion (Login)

**Méthode :** POST  
**URL :** `http://localhost:5000/api/auth/login`  
**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "email": "ayarirayen539@gmail.com",
  "password": "password123"
}
```

**Résultat attendu :**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67...",
    "firstName": "Rayen",
    "lastName": "Ayari",
    "email": "ayarirayen539@gmail.com",
    "role": "user",
    "isEmailVerified": true
  }
}
```

**⚠️ IMPORTANT :** Copiez le `token` pour les prochains tests !

---

### Test 5 : Obtenir le Profil (Route Protégée)

**Méthode :** GET  
**URL :** `http://localhost:5000/api/users/profile`  
**Headers :**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

*(Remplacez `VOTRE_TOKEN_ICI` par le token reçu lors du login)*

**Résultat attendu :**
```json
{
  "_id": "67...",
  "firstName": "Rayen",
  "lastName": "Ayari",
  "email": "ayarirayen539@gmail.com",
  "phone": "+216 94 816 735",
  "role": "user",
  "isEmailVerified": true,
  "wishlist": [],
  "cart": [],
  "createdAt": "2025-10-30T...",
  "updatedAt": "2025-10-30T..."
}
```

---

## 🐛 Résolution des Problèmes

### Problème 1 : Erreur "Invalid credentials" lors de l'envoi d'email

**Solution :**
- Vérifiez que vous avez bien activé la validation en 2 étapes
- Vérifiez que l'App Password est correct (16 caractères)
- Pas d'espaces dans le fichier `.env`

### Problème 2 : "Connection refused" à MongoDB

**Solution :**
```bash
# Windows - Démarrer MongoDB
net start MongoDB

# Vérifier si MongoDB tourne
mongod --version
```

### Problème 3 : Email non reçu

**Solutions :**
1. Vérifiez le dossier **Spam/Courrier indésirable**
2. Vérifiez que `EMAIL_USER` est correct dans `.env`
3. Vérifiez les logs du serveur backend
4. Testez avec un autre email temporaire : https://temp-mail.org/

### Problème 4 : Token expiré

**Solution :**
- Les tokens de vérification expirent après 24h
- Réinscrivez-vous avec un nouvel email
- Ou ajoutez une route pour renvoyer l'email de vérification

---

## 📊 Résumé du Flow Complet

```
1. Inscription (POST /api/auth/register)
   ↓
2. 📧 Email de vérification envoyé
   ↓
3. Clic sur le lien dans l'email
   ↓
4. Vérification (GET /api/auth/verify-email/:token)
   ↓
5. 📧 Email de bienvenue envoyé
   ↓
6. Compte activé ✅
   ↓
7. Connexion (POST /api/auth/login)
   ↓
8. Réception du JWT token
   ↓
9. Accès aux routes protégées (avec le token dans Authorization)
```

---

## 🎯 Prochaines Étapes

Une fois les tests API réussis :

1. ✅ Créer le modèle Order (commandes)
2. ✅ Créer le controller Order
3. ✅ Créer les routes Order
4. ✅ Intégrer le frontend React
5. ✅ Déployer sur Railway/Heroku

---

## 📝 Checklist de Test

- [ ] Health check fonctionne
- [ ] Inscription réussie
- [ ] Email de vérification reçu
- [ ] Vérification email réussie
- [ ] Email de bienvenue reçu
- [ ] Connexion réussie
- [ ] Token JWT reçu
- [ ] Profil accessible avec token

---

**Besoin d'aide ?** Suivez ce guide étape par étape et vérifiez chaque point ! 🚀
