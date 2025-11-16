# 🎯 Option A : Tests Complets avec Thunder Client

## ✅ Collection Mise à Jour !

La collection Thunder Client a été enrichie avec **4 nouveaux tests de commandes** !

---

## 📋 Checklist de Tests - Étape par Étape

### 🔧 Prérequis

1. **Installer Thunder Client**
   - Ouvrir Extensions (Ctrl+Shift+X)
   - Rechercher "Thunder Client"
   - Installer l'extension

2. **Importer la collection**
   - Ouvrir Thunder Client (icône ⚡)
   - Cliquer sur "Collections"
   - Menu "..." → "Import"
   - Sélectionner `backend/thunder-tests/thunderclient.json`

3. **Configurer Gmail App Password**
   - Aller sur : https://myaccount.google.com/security
   - Activer validation 2 étapes
   - Créer App Password : https://myaccount.google.com/apppasswords
   - Mettre à jour `backend/.env` avec le password

4. **Vérifier que le serveur tourne**
   - Terminal : `cd backend` → `npm run dev`
   - Voir : ✅ MongoDB Connected + 🚀 Server running

---

## 🧪 Tests à Exécuter dans l'Ordre

### ✅ Test 0 : Health Check

**Action :** Ouvrir "Health Check" → Cliquer "Send"

**Résultat attendu :** 200 OK
```json
{
  "message": "API is running...",
  "environment": "development"
}
```

---

### 1️⃣ Test 1 : Register User

**Action :** 
- Ouvrir "1️⃣ Register User"
- ⚠️ Changer l'email si vous testez plusieurs fois (ex: `ayarirayen539+test1@gmail.com`)
- Cliquer "Send"

**Résultat attendu :** 201 Created
```json
{
  "message": "Inscription réussie ! Veuillez vérifier votre email...",
  "userId": "672..."
}
```

**📧 Action requise :**
- Ouvrir votre boîte mail
- Chercher email "Vérification de votre compte E-commerce Store"
- **NE PAS cliquer sur le bouton encore**
- Copier le TOKEN depuis l'URL du bouton

**Exemple :** 
```
http://localhost:5173/verify-email/abc123def456ghi789jkl012mno345pqr678stu901
                                    ↑ COPIEZ CETTE PARTIE
```

---

### 2️⃣ Test 2 : Verify Email

**Action :**
- Ouvrir "2️⃣ Verify Email"
- Dans l'URL, remplacer `PASTE_TOKEN_HERE` par votre token
- Cliquer "Send"

**Résultat attendu :** 200 OK
```json
{
  "message": "Email vérifié avec succès !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M...",
  "user": {
    "id": "672...",
    "firstName": "Rayen",
    "isEmailVerified": true
  }
}
```

**💾 IMPORTANT :**
- **COPIEZ le token JWT** (le long texte)
- Vous en aurez besoin pour tous les tests suivants !

**📧 Bonus :**
- Vérifiez votre boîte mail
- Email de bienvenue reçu ! 🎉

---

### 3️⃣ Test 3 : Login

**Action :**
- Ouvrir "3️⃣ Login"
- Vérifier email/password dans le Body
- Cliquer "Send"

**Résultat attendu :** 200 OK
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "firstName": "Rayen",
    "isEmailVerified": true
  }
}
```

**💾 Alternative :** Vous pouvez aussi utiliser ce token

---

### 4️⃣ Test 4 : Get Profile

**Action :**
- Ouvrir "4️⃣ Get Profile"
- Aller dans l'onglet "Headers"
- Remplacer `PASTE_YOUR_TOKEN_HERE` par votre token JWT
- Cliquer "Send"

**Résultat attendu :** 200 OK
```json
{
  "_id": "672...",
  "firstName": "Rayen",
  "lastName": "Ayari",
  "email": "ayarirayen539@gmail.com",
  "isEmailVerified": true,
  "wishlist": [],
  "cart": []
}
```

---

### 5️⃣ Test 5 : Update Profile

**Action :**
- Ouvrir "5️⃣ Update Profile"
- Mettre à jour le Header Authorization avec votre token
- Modifier le Body si vous voulez (changez la ville, le téléphone, etc.)
- Cliquer "Send"

**Résultat attendu :** 200 OK (profil mis à jour)

---

### 🛒 **NOUVEAUX TESTS - COMMANDES**

---

### 6️⃣ Test 6 : Create Order

**Action :**
- Ouvrir "6️⃣ Create Order"
- Mettre à jour le Header Authorization avec votre token
- Le Body contient déjà une commande exemple :
  - 2x Wireless Headphones (99.99€)
  - 1x Smart Watch (299.99€)
  - Adresse à Nabeul
  - Paiement carte
  - Total : 566.47€
- Cliquer "Send"

**Résultat attendu :** 201 Created
```json
{
  "message": "Commande créée avec succès",
  "order": {
    "id": "673...",
    "orderNumber": "ORD-1730300000000-00001",
    "totalPrice": 566.47,
    "status": "pending",
    "createdAt": "2025-10-30T..."
  }
}
```

**📧 IMPORTANT :**
- Vérifiez votre boîte mail !
- Vous devriez recevoir un email de **confirmation de commande**
- Design professionnel avec tous les détails

**💾 Action :**
- **COPIEZ l'orderNumber** (ex: ORD-1730300000000-00001)
- Vous en aurez besoin pour les tests suivants

---

### 7️⃣ Test 7 : Get My Orders

**Action :**
- Ouvrir "7️⃣ Get My Orders"
- Mettre à jour le Header Authorization avec votre token
- Cliquer "Send"

**Résultat attendu :** 200 OK
```json
{
  "count": 1,
  "orders": [
    {
      "_id": "673...",
      "orderNumber": "ORD-1730300000000-00001",
      "user": "672...",
      "items": [...],
      "shippingAddress": {...},
      "totalPrice": 566.47,
      "status": "pending",
      "createdAt": "2025-10-30T..."
    }
  ]
}
```

**Vérification :** Vous devriez voir la commande créée au test 6 !

---

### 8️⃣ Test 8 : Get Order Details

**Action :**
- Ouvrir "8️⃣ Get Order Details"
- Dans l'URL, remplacer `PASTE_ORDER_ID_HERE` par l'ID de votre commande
  - Exemple : `http://localhost:5000/api/orders/673abc123def456...`
- Mettre à jour le Header Authorization
- Cliquer "Send"

**Résultat attendu :** 200 OK (détails complets de la commande)

---

### 9️⃣ Test 9 : Update Order Status (Admin)

**⚠️ Prérequis :** Créer un compte admin

**Option 1 - Via MongoDB Compass :**
1. Ouvrir MongoDB Compass
2. Se connecter à `mongodb://localhost:27017`
3. Database `ecommerce` → Collection `users`
4. Trouver votre utilisateur
5. Modifier le champ `role` de `"user"` à `"admin"`
6. Refaire le login (Test 3) pour obtenir un nouveau token admin

**Option 2 - Via MongoDB Shell :**
```bash
mongosh
use ecommerce
db.users.updateOne(
  { email: "ayarirayen539@gmail.com" },
  { $set: { role: "admin" } }
)
```

**Action :**
- Ouvrir "9️⃣ Update Order Status (Admin)"
- Dans l'URL, remplacer `PASTE_ORDER_ID_HERE` par l'ID de la commande
- Mettre à jour le Header Authorization avec le **token admin**
- Le Body contient :
  - `status: "shipped"` (expédiée)
  - `trackingNumber: "TN123456789TUN"`
- Cliquer "Send"

**Résultat attendu :** 200 OK
```json
{
  "message": "Statut mis à jour",
  "order": {
    "status": "shipped",
    "trackingNumber": "TN123456789TUN"
  }
}
```

**📧 BONUS :**
- Un email de tracking est envoyé automatiquement !
- Vérifiez votre boîte mail pour l'email d'expédition

---

## ✅ Checklist Complète

**Authentification :**
- [ ] Health Check OK
- [ ] Register User OK + Email reçu
- [ ] Verify Email OK + Email bienvenue reçu
- [ ] Login OK + Token reçu
- [ ] Get Profile OK
- [ ] Update Profile OK

**Commandes :**
- [ ] Create Order OK + Email confirmation reçu
- [ ] Get My Orders OK (liste visible)
- [ ] Get Order Details OK (détails complets)
- [ ] Update Order Status OK + Email tracking reçu (admin)

---

## 🎯 Résumé des Emails Reçus

Si tout fonctionne, vous devriez avoir reçu **4 emails** :

1. 📧 **Vérification de compte** (inscription)
2. 📧 **Bienvenue** (email vérifié)
3. 📧 **Confirmation de commande** (commande créée)
4. 📧 **Expédition** (statut mis à jour - si admin)

---

## 🐛 Problèmes Courants

### Erreur 401 "Non autorisé"
**Cause :** Token manquant ou expiré  
**Solution :** Refaire le Login (Test 3)

### Erreur 403 "Veuillez vérifier votre email"
**Cause :** Email pas vérifié  
**Solution :** Faire le Test 2 (Verify Email)

### Erreur 403 "Accès refusé - Admin uniquement"
**Cause :** Votre compte n'est pas admin  
**Solution :** Modifier le role dans MongoDB (voir Test 9)

### Email non reçu
**Solutions :**
1. Vérifier le dossier Spam
2. Vérifier `EMAIL_PASS` dans `.env`
3. Vérifier les logs du serveur
4. Tester avec un email temporaire : https://temp-mail.org/

---

## 🎉 Félicitations !

Si tous les tests passent, vous avez :

✅ Backend 100% fonctionnel  
✅ Authentification avec email verification  
✅ Système de commandes opérationnel  
✅ 4 types d'emails automatiques  
✅ Protection JWT + Admin  
✅ API complètement testée  

**Prêt pour l'Option B - Intégration Frontend ! 🚀**

---

## 📝 Notes

- Gardez votre token JWT à portée de main
- Les tokens expirent après 7 jours
- Les tokens de vérification expirent après 24h
- Chaque commande reçoit un numéro unique
- Les emails sont envoyés en temps réel

---

**Temps estimé pour tous les tests :** 15-20 minutes  
**Emails attendus :** 4 (vérification, bienvenue, confirmation, tracking)
