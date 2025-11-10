# 🧹 Guide de Nettoyage et Gestion de la Base de Données

Ce guide vous explique comment nettoyer votre base de données et la remplir avec des produits d'exemple pour votre e-commerce.

## 🎯 Objectif

Garder votre travail de développement tout en nettoyant les données pour repartir à zéro avec de nouveaux produits que vous ajouterez en tant qu'administrateur.

## 📁 Fichiers Créés

### Scripts Backend (`backend/scripts/`)
- `clean-database.js` - Nettoie la base de données (préserve les admins)
- `add-sample-products.js` - Ajoute 8 produits d'exemple
- `manage-database.bat` - Interface de menu pour Windows
- `DATABASE_MANAGEMENT_GUIDE.md` - Ce guide

## 🚀 Utilisation

### Option 1 : Interface Menu (Recommandé pour Windows)

1. **Ouvrir PowerShell** dans le dossier backend :
```bash
cd "C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend\scripts"
```

2. **Lancer le menu interactif :**
```bash
.\manage-database.bat
```

3. **Choisir l'option 3** (Nettoyer ET ajouter des exemples)

### Option 2 : Scripts Individuels

#### Nettoyer la base de données
```bash
cd "C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend\scripts"
node clean-database.js
```

#### Ajouter des produits d'exemple
```bash
cd "C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend\scripts"
node add-sample-products.js
```

## 📦 Produits d'Exemple Inclus

Les scripts ajoutent 8 produits variés :

### 📱 **Smartphones**
- **iPhone 15 Pro Max** - €1,299.99 (Premium, 5G)
- **Samsung Galaxy S24 Ultra** - €1,199.99 (S-Pen, Caméra 200MP)

### 💻 **Ordinateurs**
- **MacBook Air M3** - €1,499.99 (Puce M3, Ultra-portable)
- **Dell XPS 13** - €1,099.99 (Windows, Business)

### 🎧 **Audio**
- **AirPods Pro 2** - €279.99 (Réduction de bruit)
- **Sony WH-1000XM5** - €399.99 (Premium, Noise-cancelling)

### 📱 **Tablettes & Wearables**
- **iPad Pro 12.9"** - €1,199.99 (Puce M2, Pro)
- **Apple Watch Series 9** - €449.99 (Santé, Fitness)

## ⚠️ Important à Savoir

### ✅ **Ce qui est PRÉSERVÉ :**
- Votre compte administrateur (ayarirayen539@gmail.com)
- Votre code source et interface
- Configuration du serveur

### ❌ **Ce qui est SUPPRIMÉ :**
- Tous les clients/utilisateurs existants
- Tous les produits existants
- Toutes les commandes existantes
- Tous les paniers existants

## 🔧 Après le Nettoyage

1. **Connectez-vous en admin :**
   - URL : http://localhost:3002/admin/login
   - Email : ayarirayen539@gmail.com
   - Mot de passe : admin123

2. **Gérez vos produits :**
   - Allez dans la section "Produits" du dashboard admin
   - Modifiez les produits d'exemple
   - Ajoutez vos propres produits

3. **Testez votre site :**
   - Visitez : http://localhost:3002
   - Vérifiez que les nouveaux produits s'affichent
   - Testez les fonctionnalités de votre e-commerce

## 🛠️ Dépannage

### Problème : "Cannot find module"
**Solution :** Vérifiez que vous êtes dans le bon dossier :
```bash
cd "C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend\scripts"
pwd  # Doit afficher le chemin des scripts
```

### Problème : Erreur de connexion MongoDB
**Solution :** Vérifiez que votre backend fonctionne :
```bash
cd "C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend"
node simple-admin-server.js
```

### Problème : "Admin account not found"
**Solution :** Le script préserve automatiquement les comptes admin. Si problème, reconnectez-vous avec vos identifiants habituels.

## 📊 Vérification du Succès

Après exécution des scripts, vous devriez voir :

1. **8 nouveaux produits** sur votre site
2. **0 clients** dans la base
3. **Admin toujours fonctionnel** pour la connexion
4. **Catégories créées :** smartphones, ordinateurs, audio, tablettes, wearables

## 🎉 Résultat Final

Vous aurez une base de données propre avec :
- ✅ Votre interface admin fonctionnelle
- ✅ Des produits d'exemple professionnels
- ✅ Une base vide prête pour vos vrais clients
- ✅ Possibilité d'ajouter vos propres produits facilement

---

**💡 Conseil :** Utilisez l'option 3 du menu batch pour faire tout en une fois !