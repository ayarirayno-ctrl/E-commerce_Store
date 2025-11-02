# Guide des Tests E2E (Playwright)

## 🎯 Tests Créés

### 1. **homepage.spec.ts** (8 tests)
- ✅ Chargement de la homepage
- ✅ Navigation menu visible
- ✅ Grille de produits affichée
- ✅ Fonctionnalité de recherche
- ✅ Icône panier visible
- ✅ Design responsive (mobile + desktop)
- ✅ Accessibilité (title, lang)
- ✅ Images avec lazy loading

### 2. **navigation.spec.ts** (Existant - 2 tests)
- ✅ Footer visible
- ✅ Navigation vers catégories

### 3. **checkout-flow.spec.ts** (6 tests)
- ✅ Checkout invité complet
- ✅ Ajouter plusieurs produits au panier
- ✅ Modifier la quantité dans le panier
- ✅ Supprimer un produit du panier
- ✅ Appliquer un code promo
- ✅ Redirection vers Stripe checkout

### 4. **wishlist.spec.ts** (4 tests)
- ✅ Ajouter un produit à la wishlist
- ✅ Naviguer vers la page wishlist
- ✅ Supprimer un produit de la wishlist
- ✅ Déplacer un produit wishlist → panier

### 5. **admin-panel.spec.ts** (8 tests)
- ✅ Connexion admin
- ✅ Accès au dashboard admin
- ✅ Liste des produits (admin)
- ✅ Liste des commandes (admin)
- ✅ Liste des utilisateurs (admin)
- ✅ Formulaire ajout produit
- ✅ Mise à jour statut commande
- ✅ Recherche d'utilisateurs

---

## 🚀 Lancer les Tests

### Prérequis
```powershell
# 1. Backend doit tourner
cd backend
node src/server.js

# 2. Frontend doit tourner (autre terminal)
npm run dev

# 3. Playwright doit être installé
npm install --save-dev @playwright/test
npx playwright install
```

### Commandes de Test

```powershell
# Tous les tests
npx playwright test

# Tests d'un fichier spécifique
npx playwright test homepage.spec.ts
npx playwright test checkout-flow.spec.ts
npx playwright test wishlist.spec.ts
npx playwright test admin-panel.spec.ts

# Mode UI (interface graphique)
npx playwright test --ui

# Mode headed (voir le navigateur)
npx playwright test --headed

# Mode debug
npx playwright test --debug

# Tests en parallèle
npx playwright test --workers=4

# Tests sur un navigateur spécifique
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Générer un Rapport

```powershell
# Lancer les tests et générer le rapport
npx playwright test --reporter=html

# Ouvrir le rapport
npx playwright show-report
```

---

## 📊 Résultat Attendu

| Fichier | Tests | Status |
|---------|-------|--------|
| homepage.spec.ts | 8 | ⏳ À tester |
| navigation.spec.ts | 2 | ⏳ À tester |
| checkout-flow.spec.ts | 6 | ⏳ À tester |
| wishlist.spec.ts | 4 | ⏳ À tester |
| admin-panel.spec.ts | 8 | ⏳ À tester |
| **TOTAL** | **28 tests** | **⏳** |

---

## 🔧 Configuration

Le fichier `playwright.config.ts` est déjà configuré avec:
- ✅ Navigateurs: Chromium, Firefox, WebKit
- ✅ URL de base: http://localhost:3004
- ✅ Screenshots en cas d'échec
- ✅ Traces pour debugging
- ✅ Timeout: 30s par test

---

## 🐛 Troubleshooting

### Tests échouent : "page.goto: net::ERR_CONNECTION_REFUSED"
```
Solution: Frontend pas démarré
→ npm run dev
```

### Tests échouent : "Timeout 30000ms exceeded"
```
Solution: Backend/Frontend trop lent ou pas démarré
→ Vérifier que les deux serveurs tournent
→ Augmenter le timeout dans playwright.config.ts
```

### Tests échouent : "locator.click: Target closed"
```
Solution: Page redirige avant la fin du test
→ Ajouter await page.waitForLoadState('networkidle')
```

### Admin tests échouent : "Login failed"
```
Solution: Mauvais credentials ou compte non vérifié
→ Vérifier adminEmail et adminPassword dans admin-panel.spec.ts
→ Utiliser le vrai mot de passe admin
```

---

## 📝 Prochaines Étapes

Après les tests E2E:
1. **SEO Optimization** - Meta tags, sitemap, analytics
2. **Production Deployment** - Netlify + Railway
3. **Documentation finale** - README complet
4. **Performance monitoring** - Lighthouse CI

---

## ✅ Checklist de Validation

Avant de considérer les tests E2E complets:
- [ ] Tous les tests homepage passent (8/8)
- [ ] Tous les tests navigation passent (2/2)
- [ ] Tous les tests checkout passent (6/6)
- [ ] Tous les tests wishlist passent (4/4)
- [ ] Tous les tests admin passent (8/8)
- [ ] Rapport HTML généré
- [ ] Screenshots des tests passés
- [ ] 0 tests flaky (instables)

**Objectif**: **28/28 tests passent** ✅

---

## 🎯 Commandes Rapides

```powershell
# Test rapide (seulement Chrome)
npx playwright test --project=chromium

# Test avec vidéo
npx playwright test --video=on

# Test d'un seul test
npx playwright test -g "should load homepage successfully"

# Mettre à jour les screenshots de référence
npx playwright test --update-snapshots
```

---

**Créé le**: 1 Novembre 2025  
**Tests E2E**: 28 tests dans 5 fichiers  
**Status**: ✅ Prêts à tester
