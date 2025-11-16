# 📦 GUIDE DE MISE À JOUR - E-commerce Store

## 🎯 Comment mettre à jour vers la nouvelle version

### 📋 Prérequis
- Git installé sur votre machine
- Node.js et npm installés
- Accès au repository GitHub

---

## 🔄 MÉTHODE 1 : Mise à jour via Git (Recommandée)

### Étape 1 : Sauvegarder vos modifications locales
```bash
# Ouvrez PowerShell dans votre dossier projet
cd "c:\Users\Admin\Desktop\e-commerce\E-commerce_Store"

# Vérifiez l'état de vos fichiers
git status

# Si vous avez des modifications non commitées, sauvegardez-les
git stash save "Mes modifications avant update"
```

### Étape 2 : Récupérer la dernière version
```bash
# Récupérer les dernières modifications du repository
git fetch origin

# Voir les changements disponibles
git log HEAD..origin/main --oneline

# Mettre à jour vers la dernière version
git pull origin main
```

### Étape 3 : Réappliquer vos modifications (si nécessaire)
```bash
# Si vous aviez des modifications sauvegardées
git stash pop
```

### Étape 4 : Mettre à jour les dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

### Étape 5 : Redémarrer les serveurs
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd ..
npm run dev
```

---

## 🆕 MÉTHODE 2 : Installation fraîche (Si problèmes)

### Option A : Télécharger depuis GitHub
1. Allez sur : https://github.com/rayenn-ar/E-commerce_Store
2. Cliquez sur **Code** > **Download ZIP**
3. Extrayez le fichier ZIP
4. Renommez l'ancien dossier : `E-commerce_Store_OLD`
5. Placez le nouveau dossier extrait
6. Installez les dépendances :

```bash
# Backend
cd E-commerce_Store/backend
npm install

# Frontend
cd ..
npm install
```

### Option B : Cloner à nouveau
```bash
# Renommer l'ancien dossier
cd "c:\Users\Admin\Desktop\e-commerce"
Rename-Item "E-commerce_Store" "E-commerce_Store_OLD"

# Cloner la nouvelle version
git clone https://github.com/rayenn-ar/E-commerce_Store.git

# Installer les dépendances
cd E-commerce_Store/backend
npm install

cd ..
npm install
```

---

## 🔧 MÉTHODE 3 : Mise à jour manuelle des fichiers

Si vous voulez garder vos modifications et mettre à jour fichier par fichier :

### 1. Comparer les versions
```bash
# Voir les différences entre votre version et la dernière
git diff origin/main
```

### 2. Mettre à jour des fichiers spécifiques
```bash
# Mettre à jour un fichier en particulier
git checkout origin/main -- chemin/vers/fichier.js

# Exemples :
git checkout origin/main -- backend/src/routes/analytics.js
git checkout origin/main -- backend/src/routes/settings.js
```

---

## 📊 Vérifier la version installée

### Backend
```bash
cd backend
node -e "console.log(require('./package.json').version)"
```

### Frontend
```bash
node -e "console.log(require('./package.json').version)"
```

---

## 🔍 VÉRIFIER QUE LA MISE À JOUR A RÉUSSI

### Test automatique
```powershell
# Exécuter les tests complets
cd backend
PowerShell -ExecutionPolicy Bypass -File .\verify-admin-features.ps1
```

Résultat attendu : **21/21 tests réussis (100%)**

### Test manuel
1. Démarrez les serveurs
2. Ouvrez : http://localhost:3002
3. Testez la connexion admin : http://localhost:3002/admin/login
4. Vérifiez que toutes les fonctionnalités marchent

---

## ⚠️ RÉSOLUTION DES PROBLÈMES COURANTS

### Problème : "npm install" échoue
**Solution :**
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Problème : Conflits Git
**Solution :**
```bash
# Annuler tous les changements locaux
git reset --hard origin/main

# OU garder vos changements et fusionner
git merge origin/main
```

### Problème : Base de données incompatible
**Solution :**
```bash
# Sauvegarder les données importantes
# Puis réinitialiser la base de données
cd backend
node reset-database.js
```

### Problème : Port déjà utilisé
**Solution :**
```powershell
# Trouver et tuer le processus sur le port 5001
$pid = (Get-NetTCPConnection -LocalPort 5001).OwningProcess
Stop-Process -Id $pid -Force

# Pour le port 3002
$pid = (Get-NetTCPConnection -LocalPort 3002).OwningProcess
Stop-Process -Id $pid -Force
```

---

## 📝 CHANGELOG - Quoi de neuf ?

### Version 1.0.0 (14 novembre 2025)

#### ✨ Nouvelles fonctionnalités
- ✅ **Analytics produits** : Route `/api/admin/analytics/products`
  - Top 10 produits les plus vendus
  - Produits en stock bas
  - Produits en rupture
  - Répartition par catégorie

- ✅ **Settings publics** : Route `/api/settings/public`
  - Accès aux paramètres publics sans authentification
  - Informations générales du site
  - Configuration visible pour tous

- ✅ **Vérification email automatique**
  - Script `verify-user-email.js` pour vérifier les comptes
  - Correction du champ `isEmailVerified`

#### 🔧 Corrections
- ✅ Correction route analytics produits (404 → 200)
- ✅ Correction route settings publics (404 → 200)
- ✅ Fix test création produit (catégorie valide)
- ✅ Correction champ vérification email (`isVerified` → `isEmailVerified`)

#### 📚 Documentation
- ✅ Guide de mise à jour complet
- ✅ Rapport de vérification 100%
- ✅ Script de tests automatisés

---

## 🚀 DÉMARRAGE RAPIDE APRÈS UPDATE

```powershell
# 1. Naviguer vers le projet
cd "C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\frontend"

# 2. Démarrer le backend (Terminal 1)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; npm start"

# 3. Démarrer le frontend (Terminal 2)  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# 4. Attendre 10 secondes
Start-Sleep -Seconds 10

# 5. Ouvrir dans le navigateur
Start-Process "http://localhost:3002"
```

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** :
   - Backend : Regardez le terminal du backend
   - Frontend : Ouvrez la console du navigateur (F12)

2. **Réinitialisez tout** :
   ```bash
   git reset --hard origin/main
   npm install
   ```

3. **Contactez le support** :
   - GitHub Issues : https://github.com/rayenn-ar/E-commerce_Store/issues
   - Email : ayarirayen539@gmail.com

---

## ✅ CHECKLIST POST-UPDATE

- [ ] Git pull effectué avec succès
- [ ] Dépendances npm installées (backend + frontend)
- [ ] Backend démarre sans erreur (port 5001)
- [ ] Frontend démarre sans erreur (port 3002)
- [ ] Tests automatiques passent à 100%
- [ ] Connexion admin fonctionne
- [ ] Connexion client fonctionne
- [ ] Dashboard admin accessible
- [ ] Aucune erreur dans la console navigateur

---

**Dernière mise à jour :** 14 novembre 2025  
**Version actuelle :** 1.0.0  
**Auteur :** GitHub Copilot
