# 🧪 Guide de Test - Système de Variantes

## 🎯 Comment tester les variantes produits

### 1. Démarrer l'application
```bash
npm run dev
```
L'application sera accessible sur : `http://localhost:3002/`

---

## 📱 Produits avec Variantes à Tester

### Vêtements (25 variantes - 5 couleurs × 5 tailles)

#### T-Shirt Cotton (ID: 24)
- **URL :** `http://localhost:3002/products/24`
- **Couleurs :** Black, White, Navy, Gray, Red
- **Tailles :** XS, S, M, L, XL
- **Variantes :** 25 combinaisons possibles
- **Tests :**
  - ✅ Sélectionner différentes couleurs
  - ✅ Sélectionner différentes tailles
  - ✅ Vérifier changement de prix
  - ✅ Vérifier stock par variante
  - ✅ Tester variantes en rupture (stock = 0)

#### Summer Dress (ID: 27)
- **URL :** `http://localhost:3002/products/27`
- **Type :** Robe d'été
- **Variantes :** 25 combinaisons

---

### Chaussures (21 variantes - 3 couleurs × 7 pointures)

#### Running Shoes (ID: 30)
- **URL :** `http://localhost:3002/products/30`
- **Couleurs :** Black, White, Navy
- **Pointures :** 6, 7, 8, 9, 10, 11, 12
- **Variantes :** 21 combinaisons

---

### Smartphones (4 variantes - couleurs uniquement)

#### iPhone 15 Pro (ID: 1)
- **URL :** `http://localhost:3002/products/1`
- **Couleurs :** Black, White, Blue, Purple
- **Variantes :** 4 couleurs
- **Tests :**
  - ✅ Sélectionner couleur
  - ✅ Prix peut varier légèrement (±5%)
  - ✅ Stock affiché par couleur

#### Samsung Galaxy S24 (ID: 2)
- **URL :** `http://localhost:3002/products/2`
- **Couleurs :** 4 options

---

### Laptops (3 variantes - couleurs uniquement)

#### MacBook Pro 16-inch (ID: 5)
- **URL :** `http://localhost:3002/products/5`
- **Couleurs :** Silver, Space Gray, Black
- **Variantes :** 3 couleurs

---

## 🧪 Scénarios de Test

### Test 1 : Sélection Couleur
1. Aller sur un produit avec variantes
2. Cliquer sur une couleur
3. **Vérifier :**
   - ✅ Pastille colorée avec bordure highlight
   - ✅ Icône ✓ visible sur la pastille
   - ✅ Nom de la couleur affiché
   - ✅ Prix peut changer
   - ✅ Stock mis à jour

### Test 2 : Sélection Taille
1. Sur un vêtement (ID: 24, 27, 28, etc.)
2. Cliquer sur une taille
3. **Vérifier :**
   - ✅ Bouton taille surligné
   - ✅ Fond coloré (primary)
   - ✅ Taille affichée à côté du label
   - ✅ Stock mis à jour

### Test 3 : Combinaison Couleur + Taille
1. Sur un vêtement
2. Sélectionner une couleur
3. Sélectionner une taille
4. **Vérifier :**
   - ✅ Message de stock affiché
   - ✅ Prix de la variante exacte
   - ✅ Stock de cette combinaison
   - ✅ Messages possibles :
     - Vert : "In stock (X available)" si stock > 10
     - Orange : "Only X left in stock!" si stock < 10
     - Rouge : "Out of stock" si stock = 0
     - Rouge : "This combination is not available"

### Test 4 : Variante en Rupture
1. Chercher une variante avec stock = 0
2. **Vérifier :**
   - ✅ Couleur : Barre diagonale rouge
   - ✅ Taille : Texte barré + opacity 40%
   - ✅ Non cliquable (cursor-not-allowed)
   - ✅ Message "Out of stock"

### Test 5 : Ajout au Panier avec Variante
1. Sélectionner couleur + taille
2. Cliquer "Add to Cart"
3. **Vérifier :**
   - ✅ Produit ajouté avec la variante sélectionnée
   - ⚠️ (À implémenter : inclure variant info dans cart item)

### Test 6 : Quantité Maximum
1. Sélectionner une variante avec stock faible (ex: 5)
2. Essayer d'augmenter quantité
3. **Vérifier :**
   - ✅ Quantité limitée au stock de la variante
   - ✅ Bouton "+" désactivé à la limite

---

## 🎨 Éléments UI à Vérifier

### Sélecteur de Couleurs
- **Pastilles rondes :** 40px × 40px
- **Couleur réelle :** Hex code appliqué en background
- **Sélection :**
  - Bordure primary-600
  - Ring effet (ring-2)
  - Icône Check au centre
- **Non disponible :**
  - Opacity 40%
  - Barre rouge diagonale
  - cursor-not-allowed

### Sélecteur de Tailles
- **Boutons rectangulaires :** px-6 py-3
- **Sélection :**
  - Fond primary-50 (light mode)
  - Bordure primary-600
  - Texte primary-700
- **Non disponible :**
  - Opacity 40%
  - Line-through
  - cursor-not-allowed

### Messages Stock
- **Vert :** In stock (>10)
- **Orange :** Only X left! (<10)
- **Rouge :** Out of stock (0)
- **Rouge :** Combination not available

---

## 🐛 Bugs Potentiels à Surveiller

### ❌ Problèmes connus (à fixer si rencontrés)
1. **Prix non mis à jour :** Vérifier `selectedVariant?.price`
2. **Stock incorrect :** Vérifier `selectedVariant?.stock`
3. **Variante non trouvée :** Vérifier logique find dans selector
4. **Images non lazy loaded :** Vérifier OptimizedImage component
5. **WebP non appliqué :** Vérifier détection support navigateur

---

## 📊 Statistiques à Vérifier

### Dans la Console du Navigateur
```javascript
// Vérifier un produit avec variantes
fetch('/src/data/products.json')
  .then(r => r.json())
  .then(data => {
    const product = data.products.find(p => p.id === 24);
    console.log('Variants:', product.variants.length);
    console.log('Colors:', product.availableColors);
    console.log('Sizes:', product.availableSizes);
    console.log('Sample variant:', product.variants[0]);
  });
```

### Résultats Attendus (ID: 24)
```json
{
  "variants": 25,
  "colors": ["Black", "White", "Navy", "Gray", "Red"],
  "sizes": ["XS", "S", "M", "L", "XL"],
  "sampleVariant": {
    "id": "24-Black-XS",
    "color": "Black",
    "colorHex": "#000000",
    "size": "XS",
    "stock": 20,
    "price": 25.28,
    "sku": "P24-BLA-XS"
  }
}
```

---

## ✅ Checklist de Test Complète

### Fonctionnalités Core
- [ ] Les variantes s'affichent pour les produits compatibles
- [ ] La sélection de couleur fonctionne
- [ ] La sélection de taille fonctionne
- [ ] Le prix change selon la variante
- [ ] Le stock change selon la variante
- [ ] Les messages de stock sont corrects
- [ ] Les variantes en rupture sont visuellement désactivées
- [ ] La quantité max respecte le stock de la variante

### Performance
- [ ] Images en lazy loading
- [ ] Format WebP détecté et utilisé
- [ ] Pas de lag lors du changement de variante
- [ ] Animations fluides (Framer Motion)

### Responsive
- [ ] Sélecteurs visibles sur mobile
- [ ] Pastilles couleurs cliquables sur tactile
- [ ] Boutons tailles accessibles
- [ ] Messages stock lisibles

### Accessibilité
- [ ] Titres de couleurs (title attribute)
- [ ] États désactivés clairs
- [ ] Contrast suffisant
- [ ] Navigation clavier possible

---

## 🚀 Tests Avancés

### Test de Performance
1. Ouvrir DevTools > Network
2. Throttling : Fast 3G
3. Charger page produit
4. **Vérifier :**
   - Images hors viewport non chargées
   - Format WebP utilisé si supporté
   - Chargement progressif avec blur

### Test Mobile
1. DevTools > Toggle device toolbar
2. iPhone 12 Pro
3. **Vérifier :**
   - Sélecteurs tactiles fonctionnent
   - Pastilles assez grandes (44px touch target)
   - Pas de débordement horizontal

### Test Dark Mode
1. Activer dark mode
2. **Vérifier :**
   - Couleurs visibles sur fond sombre
   - Textes contrastés
   - Bordures visibles

---

## 📝 Rapport de Test

### Template
```markdown
## Test du [DATE]

### Produit testé : [NOM] (ID: [X])
- URL : http://localhost:3002/products/[X]
- Variantes : [X] couleurs × [X] tailles = [X] total

### Résultats
✅ Sélection couleur
✅ Sélection taille
✅ Prix dynamique
✅ Stock dynamique
✅ Messages stock
✅ Variantes désactivées
✅ Lazy loading
✅ WebP support

### Bugs trouvés
- Aucun / [Description]

### Suggestions
- [Amélioration possible]
```

---

## 🎯 Produits Recommandés pour Demo

### Demo Complète
1. **T-Shirt (ID: 24)** - Vêtement avec 25 variantes
2. **iPhone 15 Pro (ID: 1)** - Smartphone avec couleurs
3. **Running Shoes (ID: 30)** - Chaussures avec pointures

### Demo Rapide
- **MacBook Pro (ID: 5)** - Simple, 3 couleurs seulement

---

## 🔗 Liens Utiles

- **Localhost :** http://localhost:3002/
- **Tous les produits :** http://localhost:3002/products
- **Documentation :** PRODUCT_IMPROVEMENTS_COMPLETE.md

---

**Bon testing ! 🚀**
