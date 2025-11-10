# 🧪 Guide de Test - Edit Profile (Mise à jour du Profil Client)

## ✅ Statut du Système
- ✅ Backend : http://localhost:5000 (ACTIF)
- ✅ Frontend : http://localhost:3002 (ACTIF)
- ✅ MongoDB : Connecté
- ✅ Endpoint `PUT /api/users/profile` : Implémenté

---

## 📝 Étapes de Test

### Étape 1 : Créer un Compte Client
```
URL: http://localhost:3002
1. Cliquez sur "Register" (ou "S'inscrire")
2. Remplissez les champs :
   - Name: "Test User Edit"
   - Email: "testedit@example.com"
   - Password: "password123"
3. Cliquez sur "Sign Up"
```

### Étape 2 : Se Connecter avec ce Compte
```
URL: http://localhost:3002/login
1. Email: "testedit@example.com"
2. Password: "password123"
3. Cliquez sur "Login"
```

### Étape 3 : Accéder au Profil
```
1. Cliquez sur l'icône de profil (en haut à droite)
2. Sélectionnez "Profile" ou "Mon Profil"
3. Vous devriez voir l'onglet "Profile" actif
```

### Étape 4 : Éditer le Profil
```
1. Cliquez sur le bouton "Edit Profile" (ou l'icône d'édition)
2. Le formulaire devient editable
3. Modifiez les champs :
   - Phone: "555-1234"
   - Address Street: "123 Main St"
   - City: "Paris"
   - State: "Île-de-France"
   - Zip Code: "75001"
   - Country: "France"
4. Cliquez sur "Save Changes"
```

### Étape 5 : Vérifier le Succès
```
SUCCÈS ✅ :
- Message "Profile updated successfully!" s'affiche
- Les données sont sauvegardées
- Après rechargement, les données persistent

ERREUR ❌ :
- Message "request failed"
- Vérifier les logs du navigateur (F12 > Console)
- Vérifier les logs du backend
```

---

## 🔍 Debugging

### Vérifier les Logs du Backend
```powershell
# Les logs du backend devraient afficher :
📝 Updating profile for user: [USER_ID]
✅ Profile updated successfully
```

### Vérifier les Logs du Navigateur (F12)
```javascript
// Console > Network > put /api/users/profile
// Statut attendu: 200 OK
// Réponse:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "...",
    "name": "Test User Edit",
    "email": "testedit@example.com",
    "phone": "555-1234",
    "address": {...}
  }
}
```

### Tester l'Endpoint Directement (PowerShell)
```powershell
# 1. D'abord, authentifier l'utilisateur
$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/client-auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"testedit@example.com","password":"password123"}' `
  -UseBasicParsing | ConvertFrom-Json

$token = $loginResponse.token
$userId = $loginResponse.user.id

# 2. Ensuite, mettre à jour le profil
Invoke-WebRequest -Uri "http://localhost:5000/api/users/profile" `
  -Method Put `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body '{"phone":"555-1234","address":{"street":"123 Main St","city":"Paris","state":"Île-de-France","zipCode":"75001","country":"France"}}' `
  -UseBasicParsing | ConvertFrom-Json
```

---

## 📋 Checklist de Validation

- [ ] Créer un compte client
- [ ] Se connecter
- [ ] Accéder au profil
- [ ] Cliquer sur "Edit Profile"
- [ ] Modifier les champs (phone, address)
- [ ] Cliquer sur "Save Changes"
- [ ] Vérifier le message de succès
- [ ] Rafraîchir la page et vérifier la persistence
- [ ] Vérifier les logs du backend
- [ ] Vérifier les logs du navigateur

---

## 🚀 Résumé de l'Implémentation

### Backend (Node.js + Express)
- ✅ Endpoint: `PUT /api/users/profile`
- ✅ Authentification: JWT Token
- ✅ Mise à jour: name, phone, address
- ✅ Response: 200 OK avec user object

### Frontend (React + TypeScript)
- ✅ Component: ProfilePage.tsx
- ✅ Context: AuthContext (updateProfile)
- ✅ State: isEditing, saving, formData
- ✅ UI: Edit button, form fields, Save Changes button

---

## ✨ Prochaines Étapes

Si tout fonctionne ✅ :
1. Tester avec plusieurs utilisateurs
2. Implémenter la gestion des images de profil
3. Ajouter la validation des champs
4. Ajouter les erreurs personnalisées

Si erreur ❌ :
1. Vérifier les logs (F12 + Backend)
2. Vérifier que le token JWT est valide
3. Vérifier que MongoDB est connecté
4. Vérifier les variables d'environnement
