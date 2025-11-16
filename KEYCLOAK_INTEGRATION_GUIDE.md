# 🔐 GUIDE COMPLET D'INTÉGRATION KEYCLOAK

## 📋 Table des matières
1. [Prérequis](#prérequis)
2. [Démarrage de Keycloak](#démarrage-de-keycloak)
3. [Configuration initiale](#configuration-initiale)
4. [Migration des utilisateurs](#migration-des-utilisateurs)
5. [Activation Backend](#activation-backend)
6. [Activation Frontend](#activation-frontend)
7. [Tests](#tests)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Prérequis

### Installations requises
- [x] Docker et Docker Compose installés
- [x] Node.js 18+ et npm installés
- [x] MongoDB en cours d'exécution (port 27017)

### Packages installés
**Backend:**
- keycloak-connect
- @keycloak/keycloak-admin-client

**Frontend:**
- @react-keycloak/web
- keycloak-js

---

## 🚀 Étape 1: Démarrage de Keycloak

### 1.1 Démarrer Keycloak avec Docker

```powershell
cd C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\keycloak
docker-compose up -d
```

**Vérification:**
```powershell
docker-compose ps
```

Vous devriez voir:
```
NAME                    STATUS
ecommerce-keycloak      Up
ecommerce-keycloak-db   Up
```

### 1.2 Vérifier que Keycloak est prêt

**Health Check:**
```powershell
curl http://localhost:8080/health/ready
```

**Réponse attendue:**
```json
{"status":"UP","checks":[]}
```

**Attendre environ 30-60 secondes** pour que Keycloak démarre complètement.

---

## ⚙️ Étape 2: Configuration initiale de Keycloak

### 2.1 Accéder à la console admin

1. Ouvrir le navigateur: **http://localhost:8080**
2. Cliquer sur "Administration Console"
3. Se connecter:
   - **Username:** admin
   - **Password:** admin123

### 2.2 Importer le realm pré-configuré

**Option A: Import via UI**
1. Hover sur "master" en haut à gauche
2. Cliquer sur "Create Realm"
3. Cliquer sur "Browse" et sélectionner `keycloak/realm-ecommerce.json`
4. Cliquer sur "Create"

**Option B: Import via CLI**
```powershell
docker exec -it ecommerce-keycloak /opt/keycloak/bin/kc.sh import --file /opt/keycloak/data/realm-ecommerce.json
```

### 2.3 Récupérer le Client Secret

1. Dans la console admin, sélectionner le realm "ecommerce"
2. Aller dans **Clients** > **backend-api**
3. Onglet **Credentials**
4. Copier le **Secret**

### 2.4 Configurer le Backend .env

Éditer `backend/src/.env`:
```env
# Keycloak Configuration
KEYCLOAK_SERVER_URL=http://localhost:8080
KEYCLOAK_REALM=ecommerce
KEYCLOAK_CLIENT_ID=backend-api
KEYCLOAK_CLIENT_SECRET=<VOTRE_SECRET_ICI>  # ← Coller le secret copié
KEYCLOAK_SESSION_SECRET=ecommerce-session-secret-change-in-production
```

### 2.5 Vérifier le frontend .env

Vérifier `E-commerce_Store/.env.development`:
```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=ecommerce
VITE_KEYCLOAK_CLIENT_ID=frontend-app
```

---

## 👥 Étape 3: Migration des utilisateurs MongoDB vers Keycloak

### 3.1 Compiler le script TypeScript

```powershell
cd C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend
npx ts-node src/scripts/migrate-users-to-keycloak.ts
```

### 3.2 Résultat attendu

```
🚀 Démarrage de la migration des utilisateurs...
✅ Connecté à MongoDB
✅ Authentifié à Keycloak
📊 5 utilisateurs trouvés dans MongoDB

👤 Migration de l'utilisateur: user1@example.com
✅ Utilisateur créé dans Keycloak: abc-123-def
🔑 Mot de passe temporaire défini
👤 Rôle assigné: user
✅ Migration réussie pour user1@example.com

...

🎉 Migration terminée!
📊 Résumé:
  ✅ Succès: 5
  ❌ Erreurs: 0
  📝 Total: 5

⚠️  IMPORTANT:
  • Tous les utilisateurs ont un mot de passe temporaire: "ChangeMe123!"
  • Ils devront le changer à la première connexion
```

### 3.3 Vérifier les utilisateurs dans Keycloak

1. Console admin > Realm "ecommerce"
2. Aller dans **Users**
3. Vérifier que tous les utilisateurs sont présents
4. Vérifier leurs rôles (user/admin)

---

## 🔧 Étape 4: Activation Backend

### 4.1 Arrêter le serveur backend actuel

Si le backend tourne déjà:
```powershell
# Trouver le processus Node.js
Get-Process node | Stop-Process -Force
```

### 4.2 Démarrer le backend avec Keycloak

```powershell
cd C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend
npm run dev
```

**Vérification dans les logs:**
```
✅ Keycloak initialisé
🔗 Connecting to MongoDB...
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### 4.3 Tester l'endpoint Keycloak

**Test 1: Vérifier le protection middleware**
```powershell
curl http://localhost:5000/api/users -H "Authorization: Bearer invalid-token"
```

**Réponse attendue:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 🎨 Étape 5: Activation Frontend

### 5.1 Modifier App.tsx

**Renommer les fichiers:**
```powershell
cd C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\frontend\src

# Backup ancien App
Move-Item App.tsx App.OLD.tsx

# Activer nouveau App avec Keycloak
Move-Item AppWithKeycloak.tsx App.tsx
```

### 5.2 Démarrer le frontend

```powershell
cd C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\frontend
npm run dev
```

**Vérification dans la console navigateur:**
- Ouvrir http://localhost:3002
- Ouvrir DevTools (F12) > Console
- Chercher: `Keycloak initialized`

---

## ✅ Étape 6: Tests

### 6.1 Test Login

1. Aller sur http://localhost:3002
2. Cliquer sur "Se connecter" (ou l'application redirigera automatiquement)
3. Vous serez redirigé vers Keycloak
4. Se connecter avec:
   - **Username:** ayarirayen539@gmail.com
   - **Password:** admin123

**Résultat attendu:**
- Redirection vers l'application
- Nom de l'utilisateur affiché dans le header
- Token Keycloak stocké

### 6.2 Test Admin

1. Se connecter comme admin (ayarirayen539@gmail.com)
2. Aller sur http://localhost:3002/admin/dashboard
3. Vérifier l'accès

### 6.3 Test Logout

1. Cliquer sur le bouton de déconnexion
2. Vérifier la redirection vers la page d'accueil
3. Vérifier que l'utilisateur est bien déconnecté

### 6.4 Test Token Refresh

1. Se connecter
2. Attendre 5 minutes
3. Vérifier dans la console: `Token refreshed`

### 6.5 Test API avec Token

```powershell
# 1. Se connecter et copier le token depuis DevTools > Application > Local Storage

# 2. Tester un endpoint protégé
$token = "VOTRE_TOKEN_ICI"
curl http://localhost:5000/api/users -H "Authorization: Bearer $token"
```

---

## 🐛 Troubleshooting

### Problème 1: Keycloak ne démarre pas

**Vérification:**
```powershell
docker-compose logs keycloak
```

**Solutions:**
- Vérifier que le port 8080 n'est pas utilisé
- Redémarrer Docker
- Supprimer les volumes: `docker-compose down -v`

### Problème 2: CORS Error

**Symptôme:** Erreur CORS dans la console navigateur

**Solution:**
1. Keycloak Admin Console
2. Clients > frontend-app
3. Vérifier "Web Origins": `http://localhost:3002`
4. Save

### Problème 3: Token invalide

**Symptôme:** "Invalid or expired token"

**Solutions:**
- Vérifier que KEYCLOAK_CLIENT_SECRET est correct dans backend/.env
- Vérifier que le realm est "ecommerce"
- Vérifier la configuration du client backend-api

### Problème 4: Migration échoue

**Symptôme:** Erreurs lors de migrate-users-to-keycloak.ts

**Solutions:**
- Vérifier MongoDB en cours d'exécution
- Vérifier Keycloak accessible sur port 8080
- Vérifier les credentials admin (admin/admin123)
- Relancer: `npx ts-node src/scripts/migrate-users-to-keycloak.ts`

### Problème 5: Frontend ne redirige pas vers Keycloak

**Vérifications:**
1. DevTools > Console: Chercher erreurs Keycloak
2. Vérifier .env.development contient VITE_KEYCLOAK_URL
3. Redémarrer Vite: `npm run dev`

---

## 📊 Vérification finale

### Checklist complète

- [ ] Keycloak démarré (docker-compose ps)
- [ ] Realm "ecommerce" créé et configuré
- [ ] Client secret backend-api récupéré et dans .env
- [ ] Utilisateurs migrés avec succès
- [ ] Backend démarré sans erreurs
- [ ] Frontend démarré sans erreurs
- [ ] Login fonctionne (redirection Keycloak)
- [ ] Admin dashboard accessible
- [ ] Logout fonctionne
- [ ] Token refresh automatique fonctionne
- [ ] API protégées requièrent un token valide

---

## 🎉 Fonctionnalités Keycloak activées

### Authentification
- ✅ Login/Logout via Keycloak
- ✅ Single Sign-On (SSO)
- ✅ Token JWT sécurisé
- ✅ Refresh token automatique
- ✅ Protection des routes frontend
- ✅ Protection des endpoints API backend

### Gestion des utilisateurs
- ✅ Tous les utilisateurs MongoDB importés
- ✅ Rôles (user/admin) assignés
- ✅ Mot de passe temporaire défini
- ✅ Vérification email supportée
- ✅ Réinitialisation mot de passe via Keycloak

### Avantages
- ✅ Authentification centralisée
- ✅ OAuth2 / OpenID Connect
- ✅ Prêt pour login social (Google, Facebook, etc.)
- ✅ 2FA ready
- ✅ Session management avancé
- ✅ Admin console complète

---

## 📝 Prochaines étapes (Optionnel)

### 1. Activer le login social

1. Keycloak Admin > Identity Providers
2. Ajouter Google, Facebook, GitHub
3. Configurer OAuth credentials

### 2. Activer 2FA

1. Keycloak Admin > Authentication
2. Required Actions > Configure OTP
3. Activer pour les utilisateurs

### 3. Personnaliser le thème

1. Créer un thème personnalisé
2. Ajouter logo et couleurs
3. Déployer dans Keycloak

### 4. Production

1. Utiliser PostgreSQL au lieu de dev-file
2. Activer HTTPS
3. Configurer email SMTP
4. Backup automatique realm

---

## 🔗 Liens utiles

- **Keycloak Admin:** http://localhost:8080/admin
- **Account Console:** http://localhost:8080/realms/ecommerce/account
- **OpenID Config:** http://localhost:8080/realms/ecommerce/.well-known/openid-configuration
- **Documentation:** https://www.keycloak.org/documentation

---

## ✅ Migration terminée !

Votre application e-commerce utilise maintenant **Keycloak** pour l'authentification complète ! 🎉

**Utilisateurs par défaut:**
- **Admin:** ayarirayen539@gmail.com / admin123
- **Autres utilisateurs:** Email depuis MongoDB / ChangeMe123! (temporaire)

Les utilisateurs devront changer leur mot de passe à la première connexion ou utiliser "Mot de passe oublié".
