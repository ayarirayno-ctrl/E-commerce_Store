# 🧪 Guide de Test Complet - Réinitialisation de Mot de Passe

## ✅ Prérequis

Avant de commencer, assurez-vous que :
1. ✅ MongoDB est démarré
2. ✅ Backend tourne sur http://localhost:5000
3. ✅ Frontend tourne sur http://localhost:3002
4. ⚠️ **EMAIL_USER et EMAIL_PASSWORD sont configurés dans backend/.env**

---

## 📝 Test 1 : Créer un Nouveau Compte Client

### Via l'Interface Web

1. **Ouvrez** http://localhost:3002/
2. **Cliquez** sur le bouton "Login" dans le header (ou allez sur http://localhost:3002/login)
3. **Vérifiez** que "Client" est sélectionné
4. **Cliquez** sur "Créer un compte" (en bas)
5. **Remplissez** le formulaire :
   - Nom : Test User
   - Email : **votre-vrai-email@gmail.com** (utilisez VOTRE email pour recevoir le code)
   - Mot de passe : test123
   - Confirmer mot de passe : test123
6. **Cliquez** sur "Créer un compte"
7. **Résultat attendu** : Vous êtes connecté automatiquement et redirigé vers la page d'accueil

### Via API (Alternative avec curl)

```bash
curl -X POST http://localhost:5000/api/client-auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "votre-email@gmail.com",
    "password": "test123"
  }'
```

**Résultat attendu** :
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "...",
    "name": "Test User",
    "email": "votre-email@gmail.com",
    ...
  }
}
```

---

## 🔄 Test 2 : Vérifier que le Compte est dans MongoDB

```bash
# Se connecter à MongoDB
mongosh

# Utiliser la base de données
use ecommerce_store

# Afficher le client créé
db.clients.findOne({ email: "votre-email@gmail.com" })
```

**Résultat attendu** :
```javascript
{
  _id: ObjectId("..."),
  name: 'Test User',
  email: 'votre-email@gmail.com',
  password: '$2a$10$...', // Mot de passe haché
  isActive: true,
  emailVerified: false,
  blocked: false,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 🔑 Test 3 : Déconnexion

1. **Cliquez** sur votre nom ou l'icône utilisateur dans le header
2. **Cliquez** sur "Déconnexion" (ou Logout)
3. **Résultat attendu** : Vous êtes redirigé vers la page de login

---

## 🔐 Test 4 : Réinitialisation de Mot de Passe - Étape 1 (Demander le Code)

### Via l'Interface Web

1. **Allez sur** http://localhost:3002/login
2. **Assurez-vous** que "Client" est sélectionné
3. **Cliquez** sur "Mot de passe oublié ?"
4. **Vous serez redirigé** vers http://localhost:3002/forgot-password
5. **Entrez** l'email du compte créé : votre-email@gmail.com
6. **Cliquez** sur "Envoyer le code"
7. **Résultat attendu** :
   - Message de succès : "Reset code sent to your email"
   - Passage à l'étape 2 (saisie du code)

### Via API (Pour voir les détails)

```bash
curl -X POST http://localhost:5000/api/client-auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-email@gmail.com"
  }'
```

**Résultat attendu** :
```json
{
  "success": true,
  "message": "Reset code sent to your email"
}
```

---

## 📧 Test 5 : Vérifier l'Email Reçu

1. **Ouvrez** votre boîte email (Gmail)
2. **Cherchez** un email de "E-commerce Store"
3. **Vérifiez** le contenu :
   - Objet : "Code de réinitialisation de mot de passe"
   - Un code à 6 chiffres (ex: 123456)
   - Validité : 10 minutes
4. **Notez** le code à 6 chiffres

### Vérifier dans MongoDB

```bash
mongosh
use ecommerce_store

# Voir le code stocké (pour vérification)
db.clients.findOne(
  { email: "votre-email@gmail.com" },
  { resetPasswordToken: 1, resetPasswordExpires: 1 }
)
```

**Résultat attendu** :
```javascript
{
  _id: ObjectId("..."),
  resetPasswordToken: '123456', // Le code à 6 chiffres
  resetPasswordExpires: ISODate("...") // Date d'expiration (dans 10 minutes)
}
```

---

## 🔑 Test 6 : Réinitialisation - Étape 2 (Utiliser le Code)

### Via l'Interface Web

1. **Vous êtes déjà** sur la page de saisie du code
2. **Entrez** le code à 6 chiffres reçu par email
3. **Entrez** un nouveau mot de passe : newpass123
4. **Confirmez** le nouveau mot de passe : newpass123
5. **Cliquez** sur "Réinitialiser le mot de passe"
6. **Résultat attendu** :
   - Message de succès
   - Connexion automatique
   - Redirection vers la page d'accueil

### Via API (Alternative)

```bash
curl -X POST http://localhost:5000/api/client-auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-email@gmail.com",
    "code": "123456",
    "newPassword": "newpass123"
  }'
```

**Résultat attendu** :
```json
{
  "success": true,
  "message": "Password reset successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "...",
    "name": "Test User",
    "email": "votre-email@gmail.com"
  }
}
```

---

## 📧 Test 7 : Vérifier l'Email de Confirmation

1. **Ouvrez** votre boîte email
2. **Cherchez** un nouvel email de confirmation
3. **Vérifiez** le contenu :
   - Objet : "Mot de passe modifié"
   - Message : Votre mot de passe a été modifié avec succès

---

## ✅ Test 8 : Vérifier dans MongoDB

```bash
mongosh
use ecommerce_store

# Vérifier que les champs de reset sont supprimés
db.clients.findOne(
  { email: "votre-email@gmail.com" },
  { password: 1, resetPasswordToken: 1, resetPasswordExpires: 1 }
)
```

**Résultat attendu** :
```javascript
{
  _id: ObjectId("..."),
  password: '$2a$10$...', // NOUVEAU mot de passe haché (différent)
  // resetPasswordToken et resetPasswordExpires doivent être absents ou null
}
```

---

## 🔐 Test 9 : Se Connecter avec le Nouveau Mot de Passe

### Via l'Interface Web

1. **Si vous n'êtes pas déjà connecté**, allez sur http://localhost:3002/login
2. **Entrez** :
   - Email : votre-email@gmail.com
   - Mot de passe : **newpass123** (le nouveau)
3. **Cliquez** sur "Se connecter"
4. **Résultat attendu** : Connexion réussie

### Via API

```bash
curl -X POST http://localhost:5000/api/client-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-email@gmail.com",
    "password": "newpass123"
  }'
```

**Résultat attendu** :
```json
{
  "success": true,
  "token": "...",
  "client": { ... }
}
```

---

## ❌ Test 10 : Tester les Cas d'Erreur

### Test 10.1 : Code Invalide

```bash
curl -X POST http://localhost:5000/api/client-auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-email@gmail.com",
    "code": "999999",
    "newPassword": "testpass"
  }'
```

**Résultat attendu** :
```json
{
  "success": false,
  "message": "Invalid reset code"
}
```

### Test 10.2 : Code Expiré (après 10 minutes)

Attendez 10 minutes puis essayez avec un ancien code.

**Résultat attendu** :
```json
{
  "success": false,
  "message": "Reset code has expired. Please request a new one."
}
```

### Test 10.3 : Email Inexistant

```bash
curl -X POST http://localhost:5000/api/client-auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "inexistant@example.com"
  }'
```

**Résultat attendu** :
```json
{
  "success": false,
  "message": "No account found with this email"
}
```

---

## 📊 Checklist Complète

### Configuration
- [ ] MongoDB est démarré et accessible
- [ ] Backend tourne sur http://localhost:5000
- [ ] Frontend tourne sur http://localhost:3002
- [ ] EMAIL_USER configuré dans backend/.env
- [ ] EMAIL_PASSWORD configuré dans backend/.env

### Création de Compte
- [ ] Peut créer un nouveau compte client
- [ ] Le compte est enregistré dans MongoDB
- [ ] Le mot de passe est haché (bcrypt)
- [ ] Connexion automatique après création

### Réinitialisation de Mot de Passe
- [ ] Peut demander un code de réinitialisation
- [ ] L'email est reçu avec le code à 6 chiffres
- [ ] Le code est stocké dans MongoDB
- [ ] Le code expire après 10 minutes
- [ ] Peut réinitialiser avec le bon code
- [ ] Email de confirmation reçu
- [ ] Les champs de reset sont supprimés de MongoDB
- [ ] Le nouveau mot de passe est haché
- [ ] Peut se connecter avec le nouveau mot de passe

### Cas d'Erreur
- [ ] Code invalide rejeté
- [ ] Code expiré rejeté
- [ ] Email inexistant rejeté
- [ ] Messages d'erreur clairs

---

## 🎯 Commandes Rapides

### Voir tous les clients
```bash
mongosh
use ecommerce_store
db.clients.find().pretty()
```

### Supprimer le compte de test
```bash
mongosh
use ecommerce_store
db.clients.deleteOne({ email: "votre-email@gmail.com" })
```

### Voir les logs backend en temps réel
Les logs s'affichent automatiquement dans le terminal où le backend tourne.
Cherchez :
- `Email sent successfully to:` → Email envoyé
- `Error sending email:` → Erreur d'envoi

---

## 🚨 Problèmes Courants

### "Failed to send reset email"
- Vérifiez EMAIL_USER et EMAIL_PASSWORD dans .env
- Utilisez un mot de passe d'application Gmail, pas votre mot de passe normal
- Activez la validation en 2 étapes sur votre compte Google

### "Reset code has expired"
- Le code expire après 10 minutes
- Demandez un nouveau code

### "Invalid reset code"
- Vérifiez que vous copiez bien tous les 6 chiffres
- Vérifiez que vous utilisez le bon email

### "CORS policy error"
- Le port 3002 doit être dans la liste allowedOrigins du backend
- Redémarrez le backend si vous venez de modifier server.ts

---

## ✅ Conclusion

Si tous les tests passent, votre système de réinitialisation de mot de passe fonctionne parfaitement ! 🎉

**Prochaine étape** : Tester avec un compte admin (même processus sur `/admin/forgot-password`)
