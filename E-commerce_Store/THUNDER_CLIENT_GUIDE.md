# 🧪 Guide d'Utilisation Thunder Client - Tests API

## 📥 Collection Pré-configurée Créée !

J'ai créé une collection Thunder Client avec tous les tests nécessaires dans :
`backend/thunder-tests/thunderclient.json`

---

## 🚀 Étape 1 : Installer Thunder Client

1. **Ouvrir Extensions** (Ctrl+Shift+X)
2. **Rechercher** : "Thunder Client"
3. **Installer** l'extension (6M+ téléchargements)
4. **Cliquer** sur l'icône ⚡ dans la barre latérale gauche

---

## 📋 Étape 2 : Importer la Collection

1. **Dans Thunder Client**, cliquez sur **"Collections"** (onglet du haut)
2. Cliquez sur le menu **"..."** → **"Import"**
3. Sélectionnez le fichier : `backend/thunder-tests/thunderclient.json`
4. ✅ La collection **"E-commerce API Tests"** apparaît !

---

## 🧪 Étape 3 : Exécuter les Tests dans l'Ordre

### ✅ Test 0 : Health Check

**Objectif** : Vérifier que le serveur tourne

1. Ouvrez **"E-commerce API Tests"** → **"🔐 Authentication"**
2. Cliquez sur **"Health Check"**
3. Cliquez **"Send"**

**Résultat attendu :** 200 OK
```json
{
  "message": "API is running...",
  "environment": "development"
}
```

---

### 1️⃣ Test 1 : Register User (Inscription)

**Objectif** : Créer un compte utilisateur

1. Cliquez sur **"1️⃣ Register User"**
2. Vérifiez le Body JSON (déjà pré-rempli)
3. ⚠️ **IMPORTANT** : Changez l'email si vous testez plusieurs fois !
4. Cliquez **"Send"**

**Résultat attendu :** 201 Created
```json
{
  "message": "Inscription réussie ! Veuillez vérifier votre email...",
  "userId": "672..."
}
```

**📧 Action requise :**
- Consultez votre boîte mail (ayarirayen539@gmail.com)
- Ouvrez l'email "Vérification de votre compte"
- **NE CLIQUEZ PAS sur le bouton** (pas encore)
- **Copiez le token** depuis l'URL du bouton

**Exemple d'URL dans l'email :**
```
http://localhost:5173/verify-email/abc123def456ghi789...
                                    ↑
                        COPIEZ CETTE PARTIE
```

---

### 2️⃣ Test 2 : Verify Email (Vérification)

**Objectif** : Activer le compte avec le token email

1. Cliquez sur **"2️⃣ Verify Email"**
2. Dans l'URL, **remplacez** `PASTE_TOKEN_HERE` par votre vrai token
3. Cliquez **"Send"**

**Résultat attendu :** 200 OK
```json
{
  "message": "Email vérifié avec succès !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "672...",
    "firstName": "Rayen",
    "isEmailVerified": true
  }
}
```

**💾 Action importante :**
- **COPIEZ le token JWT** (le long texte dans "token")
- Vous en aurez besoin pour les tests suivants !

**📧 Bonus :**
- Vérifiez votre boîte mail
- Vous avez reçu un email de **bienvenue** ! 🎉

---

### 3️⃣ Test 3 : Login (Connexion)

**Objectif** : Se connecter avec email/password

1. Cliquez sur **"3️⃣ Login"**
2. Le Body est déjà pré-rempli
3. Cliquez **"Send"**

**Résultat attendu :** 200 OK
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "672...",
    "firstName": "Rayen",
    "email": "ayarirayen539@gmail.com",
    "isEmailVerified": true
  }
}
```

**💾 COPIEZ aussi ce token** (pour avoir une alternative)

---

### 4️⃣ Test 4 : Get Profile (Route Protégée)

**Objectif** : Récupérer les infos du profil utilisateur

1. Cliquez sur **"4️⃣ Get Profile"**
2. Allez dans l'onglet **"Headers"**
3. Trouvez la ligne `Authorization: Bearer PASTE_YOUR_TOKEN_HERE`
4. **Remplacez** `PASTE_YOUR_TOKEN_HERE` par votre token JWT
5. Cliquez **"Send"**

**Résultat attendu :** 200 OK
```json
{
  "_id": "672...",
  "firstName": "Rayen",
  "lastName": "Ayari",
  "email": "ayarirayen539@gmail.com",
  "phone": "+216 94 816 735",
  "isEmailVerified": true,
  "wishlist": [],
  "cart": []
}
```

---

### 5️⃣ Test 5 : Update Profile

**Objectif** : Modifier les informations du profil

1. Cliquez sur **"5️⃣ Update Profile"**
2. Mettez à jour le **Header Authorization** avec votre token
3. Modifiez le Body JSON si vous voulez
4. Cliquez **"Send"**

**Résultat attendu :** 200 OK (avec les données mises à jour)

---

## 🎯 Ordre d'Exécution Recommandé

```
Health Check → Register → Verify Email → Login → Get Profile → Update Profile
     ✅           1️⃣          2️⃣         3️⃣        4️⃣           5️⃣
```

---

## 💡 Astuces Thunder Client

### Sauvegarder le Token Automatiquement

1. **Après le Login** (Test 3), cliquez sur l'onglet **"Tests"**
2. Ajoutez ce code :
```javascript
if (json.token) {
  tc.setVar("authToken", json.token);
}
```
3. Dans les autres requêtes, utilisez : `Bearer {{authToken}}`

### Variables d'Environnement

1. Cliquez sur **"Env"** (onglet du haut)
2. Créez un environnement "Development"
3. Ajoutez :
```json
{
  "baseUrl": "http://localhost:5000/api",
  "authToken": ""
}
```
4. Utilisez dans les URLs : `{{baseUrl}}/users/profile`

---

## 🐛 Erreurs Courantes

### Erreur 401 "Non autorisé"
**Cause** : Token manquant ou expiré  
**Solution** : Refaites le Login (Test 3) et copiez le nouveau token

### Erreur 403 "Veuillez vérifier votre email"
**Cause** : Email pas encore vérifié  
**Solution** : Faites le Test 2 (Verify Email)

### Erreur 400 "Cet email est déjà utilisé"
**Cause** : Vous essayez de créer un compte avec un email existant  
**Solution** : Changez l'email dans le Test 1 ou utilisez le Login

### Erreur 500 "Invalid credentials" (email)
**Cause** : Gmail App Password incorrect  
**Solution** : Vérifiez votre `.env` et régénérez l'App Password

---

## ✅ Checklist de Validation

- [ ] Thunder Client installé
- [ ] Collection importée
- [ ] Health Check réussi (✅ serveur tourne)
- [ ] Register réussi (📧 email reçu)
- [ ] Token copié depuis l'email
- [ ] Verify Email réussi (✅ compte activé, 📧 email bienvenue reçu)
- [ ] JWT token copié
- [ ] Login réussi (✅ nouveau token reçu)
- [ ] Get Profile réussi (✅ données utilisateur récupérées)
- [ ] Update Profile réussi (✅ données modifiées)

---

## 🎉 Résultat Final

Vous avez maintenant :
- ✅ Backend fonctionnel avec authentification complète
- ✅ Envoi d'emails de vérification et bienvenue
- ✅ Protection des routes avec JWT
- ✅ CRUD utilisateur opérationnel

**Prochaine étape : Créer le système de commandes (Orders) !** 🛒

---

## 📚 Ressources

- Thunder Client Doc : https://www.thunderclient.com/docs
- Collection JSON : `backend/thunder-tests/thunderclient.json`
- Gmail Setup Guide : `GMAIL_SETUP_GUIDE.md`
- Backend Guide : `BACKEND_GUIDE.md` + `BACKEND_GUIDE_PART2.md`
