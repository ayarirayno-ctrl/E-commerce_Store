# 🧪 Guide de Test Visuel - Interface Unifiée

## 🌐 URL de Test
**http://localhost:3002**

---

## ✅ Scénario 1 : Connexion Client

### Étapes:
1. Ouvrez http://localhost:3002
2. Vérifiez que le bouton **"Client"** est sélectionné (fond bleu)
3. Entrez:
   - **Email**: `ayarirayen539@gmail.com`
   - **Mot de passe**: `nouveaumotdepasse123`
4. Cliquez sur **"Se connecter"**

### Résultat Attendu:
✅ Notification de succès "Connexion réussie !"
✅ Redirection automatique vers la page d'accueil (`/`)
✅ Votre nom/avatar apparaît dans le header
✅ Vous pouvez maintenant ajouter des produits au panier et acheter

---

## ✅ Scénario 2 : Inscription Nouveau Client

### Étapes:
1. Sur la page de login, cliquez sur **"Créer un compte"** (en bas)
2. Entrez:
   - **Nom**: `Test User 2`
   - **Email**: `nouveauclient@test.com`
   - **Mot de passe**: `test123456`
   - **Confirmer**: `test123456`
3. Cliquez sur **"Créer un compte"**

### Résultat Attendu:
✅ Notification "Inscription réussie !"
✅ **Auto-connexion automatique**
✅ Redirection vers la page d'accueil
✅ Compte créé dans MongoDB

---

## ✅ Scénario 3 : Mot de Passe Oublié (Client)

### Étapes:
1. Sur la page de login (mode Client)
2. Cliquez sur **"Mot de passe oublié ?"**
3. **Étape 1 - Email**:
   - Entrez: `ayarirayen539@gmail.com`
   - Cliquez "Envoyer le code"
4. **Étape 2 - Vérifiez votre email**:
   - Ouvrez Gmail
   - Cherchez l'email "Code de réinitialisation"
   - Copiez le code à 6 chiffres
5. **Étape 3 - Entrez le code**:
   - Collez le code dans l'interface
   - Entrez un nouveau mot de passe (min 6 caractères)
   - Cliquez "Réinitialiser"

### Résultat Attendu:
✅ Email reçu avec le code
✅ Code accepté
✅ Mot de passe changé
✅ **Auto-connexion automatique**
✅ Redirection vers la page d'accueil
✅ Email de confirmation envoyé

---

## ✅ Scénario 4 : Connexion Admin

### Étapes:
1. Sur la page de login, cliquez sur le bouton **"Admin"** (à droite)
2. L'interface change (icône Shield au lieu de User)
3. Entrez:
   - **Email**: `admin@ecommerce.com`
   - **Mot de passe**: `Admin@123` (min 8 caractères)
4. Cliquez sur **"Connexion Admin"**

### Résultat Attendu:
✅ Notification "Connexion admin réussie !"
✅ Redirection automatique vers **`/admin/dashboard`**
✅ Interface admin complète accessible
✅ Toutes les fonctionnalités admin disponibles

---

## ✅ Scénario 5 : Protection des Routes

### Test A - Tenter d'acheter sans connexion:
1. Déconnectez-vous si connecté
2. Allez sur http://localhost:3002/products
3. Ajoutez un produit au panier
4. Cliquez sur le panier
5. Cliquez sur "Passer la commande"

**Résultat Attendu**:
✅ Redirection automatique vers `/login`
✅ Message indiquant qu'il faut se connecter

### Test B - Tenter d'accéder à l'admin sans connexion:
1. Déconnectez-vous
2. Allez sur http://localhost:3002/admin/dashboard

**Résultat Attendu**:
✅ Redirection automatique vers `/admin/login`
✅ Impossible d'accéder sans authentification

---

## 🎨 Éléments Visuels à Vérifier

### Page de Login Unifiée:
- [ ] Icône circulaire en haut (User pour client, Shield pour admin)
- [ ] Titre change selon le mode
- [ ] 2 boutons de sélection: "Client" et "Admin"
- [ ] Champs de formulaire adaptés au mode
- [ ] Lien "Mot de passe oublié ?" visible
- [ ] Toggle "Créer un compte" / "Se connecter" pour les clients

### Page de Réinitialisation:
- [ ] 3 étapes clairement indiquées
- [ ] Étape 1: Champ email + bouton "Envoyer"
- [ ] Étape 2: Champ code + champ nouveau mot de passe
- [ ] Étape 3: Message de succès avec lien retour

---

## 🐛 Cas d'Erreur à Tester

### Erreur 1 : Email invalide
- Entrez: `test@invalid`
- **Attendu**: Message "Veuillez entrer une adresse email valide"

### Erreur 2 : Mot de passe trop court
- Client: Entrez moins de 6 caractères
- **Attendu**: Message d'erreur

- Admin: Entrez moins de 8 caractères
- **Attendu**: Message "Le mot de passe admin doit contenir au moins 8 caractères"

### Erreur 3 : Code de réinitialisation incorrect
- Entrez un mauvais code: `000000`
- **Attendu**: Message "Code invalide ou expiré"

### Erreur 4 : Code expiré (après 10 minutes)
- Attendez 10 minutes après réception du code
- **Attendu**: Message "Code expiré, veuillez en demander un nouveau"

---

## 📊 Vérifications MongoDB

### Après inscription d'un nouveau client:
```javascript
// MongoDB Compass ou mongo shell
use ecommerce
db.clients.find({ email: "nouveauclient@test.com" })
```

**Vérifiez**:
- [ ] Client existe dans la collection `clients`
- [ ] Mot de passe est hashé (bcrypt)
- [ ] Email en minuscules
- [ ] Champs `resetPasswordToken` et `resetPasswordExpires` absents

### Après demande de réinitialisation:
```javascript
db.clients.find({ 
  email: "ayarirayen539@gmail.com" 
}).select({ resetPasswordToken: 1, resetPasswordExpires: 1 })
```

**Vérifiez**:
- [ ] `resetPasswordToken` contient le code (hashé)
- [ ] `resetPasswordExpires` est dans 10 minutes
- [ ] Ces champs ne sont PAS visibles dans l'API (select: false)

### Après réinitialisation réussie:
```javascript
db.clients.find({ email: "ayarirayen539@gmail.com" })
```

**Vérifiez**:
- [ ] `resetPasswordToken` est supprimé
- [ ] `resetPasswordExpires` est supprimé
- [ ] `password` a changé (nouveau hash)

---

## 🎯 Checklist Finale

- [ ] ✅ Client peut se connecter
- [ ] ✅ Client peut s'inscrire (auto-connexion)
- [ ] ✅ Client peut réinitialiser son mot de passe
- [ ] ✅ Admin peut se connecter
- [ ] ✅ Admin peut réinitialiser son mot de passe
- [ ] ✅ Protection checkout (client requis)
- [ ] ✅ Protection admin (admin requis)
- [ ] ✅ Emails envoyés correctement
- [ ] ✅ Redirection automatique après connexion
- [ ] ✅ Interface unifiée fonctionne
- [ ] ✅ Validation des formulaires
- [ ] ✅ Gestion des erreurs

---

## 🚀 Tout Fonctionne ?

Si tous les tests passent, vous avez une **authentification complète et sécurisée** ! 🎉

### Identifiants de Test:

**Client existant**:
- Email: `ayarirayen539@gmail.com`
- Mot de passe: `nouveaumotdepasse123`

**Admin par défaut**:
- Email: `admin@ecommerce.com`
- Mot de passe: `Admin@123`

---

**Note**: Les serveurs doivent être démarrés:
- Backend: http://localhost:5000 ✅
- Frontend: http://localhost:3002 ✅
