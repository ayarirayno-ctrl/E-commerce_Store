# 🧪 Test API MongoDB - E-commerce Store

## ✅ Base de données peuplée avec succès !

### 📊 Données créées :
- **5 Catégories** : Electronics, Clothing, Home & Garden, Sports, Books
- **10 Produits** : Répartis dans différentes catégories
- **3 Clients de test** : Avec comptes actifs

---

## 🔑 Identifiants de test

### Client Test
```
Email: john.doe@example.com
Password: password123
```

### Admin (créé précédemment)
```
Email: admin@ecommerce.com
Password: admin123
```

---

## 🧪 Tester les API

### 1. Produits

**Récupérer tous les produits**
```powershell
curl http://localhost:5000/api/products
```

**Récupérer un produit par ID**
```powershell
# Remplacer {id} par un ID réel
curl http://localhost:5000/api/products/{id}
```

**Rechercher des produits**
```powershell
curl "http://localhost:5000/api/products?search=headphones"
```

**Filtrer par catégorie**
```powershell
curl "http://localhost:5000/api/products?category=electronics"
```

---

### 2. Catégories

**Récupérer toutes les catégories**
```powershell
curl http://localhost:5000/api/categories
```

**Récupérer une catégorie par ID**
```powershell
curl http://localhost:5000/api/categories/{id}
```

---

### 3. Clients (Admin uniquement)

**Récupérer tous les clients** *(nécessite authentification)*
```powershell
curl http://localhost:5000/api/clients -H "Authorization: Bearer {token}"
```

---

### 4. Commandes

**Créer une commande de test**
```powershell
curl -X POST http://localhost:5000/api/orders `
  -H "Content-Type: application/json" `
  -d '{
    "user": "{client_id}",
    "items": [{
      "product": "{product_id}",
      "name": "Test Product",
      "price": 99.99,
      "quantity": 2,
      "image": "test.jpg"
    }],
    "shippingAddress": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "TS",
      "zipCode": "12345",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "subtotal": 199.98,
    "tax": 20,
    "shippingCost": 10,
    "discount": 0,
    "total": 229.98
  }'
```

---

## 📦 Produits disponibles

1. **Electronics**
   - Wireless Headphones - $199.99
   - Smart Watch - $299.99
   - Laptop Stand - $49.99

2. **Clothing**
   - Cotton T-Shirt - $24.99
   - Denim Jeans - $59.99

3. **Home & Garden**
   - LED Desk Lamp - $39.99
   - Garden Tools Set - $79.99

4. **Sports**
   - Yoga Mat - $34.99
   - Dumbbell Set - $149.99

5. **Books**
   - Web Development Guide - $44.99

---

## 🚀 Prochaines étapes

1. **Tester toutes les routes API** avec Postman ou Insomnia
2. **Se connecter en tant qu'admin** pour tester les routes protégées
3. **Créer des commandes de test**
4. **Développer l'interface Admin** pour gérer tout ça visuellement

---

## 📝 Commandes utiles

**Repeupler la base de données**
```powershell
cd backend
npm run seed
```

**Démarrer le serveur backend**
```powershell
cd backend
npm run dev
```

**Créer un nouvel admin**
```powershell
cd backend
npm run create-admin
```

---

✅ **MongoDB est maintenant complètement configuré et opérationnel avec des données de test !**
