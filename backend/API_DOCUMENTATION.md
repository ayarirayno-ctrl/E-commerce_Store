# Documentation API - E-commerce Store

## 🌐 Base URL
- **Développement**: `http://localhost:5000/api`
- **Production**: `https://votre-domaine.com/api`

## 🔐 Authentification

La plupart des endpoints requièrent un token d'authentification JWT. Le token doit être inclus dans le header `Authorization` de chaque requête :

```
Authorization: Bearer <votre_token>
```

---

## 📋 Routes Système

### GET /api
Obtenir les informations de l'API et les routes disponibles.

**Réponse:**
```json
{
  "status": "ok",
  "message": "E-commerce API",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2025-10-29T18:01:56.000Z",
  "requestId": "abc-123-def-456",
  "availableRoutes": [
    "GET /api",
    "GET /api/health",
    "GET /api/products",
    "POST /api/auth/login",
    ...
  ]
}
```

### GET /api/health
Vérifier le statut de santé du serveur et de la base de données.

**Réponse:**
```json
{
  "status": "ok",
  "environment": "development",
  "uptime": 123.45,
  "timestamp": "2025-10-29T18:01:56.000Z",
  "requestId": "abc-123-def-456",
  "process": {
    "pid": 12345,
    "memory": {
      "heapUsed": 50000000,
      "heapTotal": 80000000,
      "external": 1500000
    },
    "node": "v22.19.0"
  },
  "database": {
    "version": "8.19.2",
    "state": "connected",
    "host": "localhost",
    "name": "ecommerce"
  }
}
```

---

## 🔑 Authentification & Utilisateurs

### POST /api/auth/register
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "MotDePasse123!",
  "phone": "0612345678"
}
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "customer",
    "isActive": true
  }
}
```

### POST /api/auth/login
Se connecter avec email et mot de passe.

**Body:**
```json
{
  "email": "jean@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse:** (identique à /register)

### GET /api/auth/me
Obtenir les informations de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "customer",
    "phone": "0612345678",
    "addresses": [],
    "wishlist": [],
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### PUT /api/auth/profile
Mettre à jour le profil utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Jean Pierre Dupont",
  "phone": "0698765432",
  "addresses": [
    {
      "street": "123 Rue de la Paix",
      "city": "Paris",
      "state": "Île-de-France",
      "zipCode": "75001",
      "country": "France",
      "isDefault": true
    }
  ]
}
```

### POST /api/auth/change-password
Changer le mot de passe.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "AncienMotDePasse123!",
  "newPassword": "NouveauMotDePasse456!"
}
```

---

## 📦 Produits

### GET /api/products
Obtenir la liste des produits avec filtres et pagination.

**Query Parameters:**
- `page` (number, défaut: 1) - Numéro de page
- `limit` (number, défaut: 20) - Nombre d'éléments par page
- `category` (string) - Filtrer par catégorie
- `minPrice` (number) - Prix minimum
- `maxPrice` (number) - Prix maximum
- `search` (string) - Recherche textuelle
- `sort` (string) - Tri (price, -price, name, -name, createdAt, -createdAt)
- `inStock` (boolean) - Filtrer les produits en stock

**Exemple:** `GET /api/products?category=electronics&minPrice=100&maxPrice=500&page=1&limit=10`

**Réponse:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "description": "Dernier modèle Apple avec titanium",
      "price": 1199.99,
      "originalPrice": 1299.99,
      "discount": 7.69,
      "category": {
        "_id": "507f191e810c19729de860ea",
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "images": [
        {
          "url": "https://example.com/iphone.jpg",
          "isMain": true
        }
      ],
      "stock": 50,
      "inStock": true,
      "rating": 4.8,
      "reviewCount": 245,
      "tags": ["apple", "smartphone", "5g"],
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 74,
    "pages": 8
  }
}
```

### GET /api/products/:id
Obtenir les détails d'un produit spécifique.

**Réponse:**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "description": "Description complète...",
    "longDescription": "Description détaillée...",
    "price": 1199.99,
    "originalPrice": 1299.99,
    "discount": 7.69,
    "category": { ... },
    "images": [ ... ],
    "stock": 50,
    "inStock": true,
    "rating": 4.8,
    "reviewCount": 245,
    "specifications": {
      "screen": "6.7 pouces",
      "processor": "A17 Pro",
      "memory": "128GB"
    },
    "tags": ["apple", "smartphone", "5g"],
    "relatedProducts": [ ... ]
  }
}
```

---

## 🗂️ Catégories

### GET /api/categories
Obtenir toutes les catégories.

**Réponse:**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "507f191e810c19729de860ea",
      "name": "Électronique",
      "slug": "electronique",
      "description": "Tous les produits électroniques",
      "image": "https://example.com/electronics.jpg",
      "productCount": 156,
      "isActive": true,
      "createdAt": "2025-01-10T08:00:00.000Z"
    }
  ]
}
```

### GET /api/categories/:slug
Obtenir une catégorie spécifique avec ses produits.

**Query Parameters:**
- `page`, `limit`, `sort` - Identiques à /products

**Réponse:**
```json
{
  "success": true,
  "category": {
    "_id": "507f191e810c19729de860ea",
    "name": "Électronique",
    "slug": "electronique",
    "description": "...",
    "image": "...",
    "productCount": 156
  },
  "products": [ ... ],
  "pagination": { ... }
}
```

---

## 🛒 Panier

### GET /api/cart
Obtenir le panier de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "success": true,
  "cart": {
    "_id": "507f1f77bcf86cd799439011",
    "user": "507f191e810c19729de860ea",
    "items": [
      {
        "product": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "iPhone 15 Pro",
          "price": 1199.99,
          "images": [ ... ]
        },
        "quantity": 2,
        "price": 1199.99,
        "total": 2399.98
      }
    ],
    "subtotal": 2399.98,
    "tax": 479.99,
    "shippingCost": 0,
    "total": 2879.97,
    "itemCount": 2
  }
}
```

### POST /api/cart/items
Ajouter un produit au panier.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "productId": "507f1f77bcf86cd799439012",
  "quantity": 2
}
```

### PUT /api/cart/items/:productId
Mettre à jour la quantité d'un produit.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "quantity": 3
}
```

### DELETE /api/cart/items/:productId
Retirer un produit du panier.

**Headers:** `Authorization: Bearer <token>`

### DELETE /api/cart
Vider le panier.

**Headers:** `Authorization: Bearer <token>`

---

## 📝 Commandes

### GET /api/client-orders
Obtenir toutes les commandes de l'utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number, défaut: 1)
- `limit` (number, défaut: 10)
- `status` (string) - Filtrer par statut

**Réponse:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-20250129-001",
      "items": [ ... ],
      "shippingAddress": {
        "street": "123 Rue de la Paix",
        "city": "Paris",
        "zipCode": "75001",
        "country": "France"
      },
      "paymentMethod": "card",
      "paymentStatus": "paid",
      "orderStatus": "delivered",
      "subtotal": 2399.98,
      "tax": 479.99,
      "shippingCost": 0,
      "total": 2879.97,
      "createdAt": "2025-01-25T10:30:00.000Z",
      "deliveredAt": "2025-01-28T14:22:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### POST /api/client-orders
Créer une nouvelle commande.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "shippingAddress": {
    "street": "123 Rue de la Paix",
    "city": "Paris",
    "state": "Île-de-France",
    "zipCode": "75001",
    "country": "France"
  },
  "billingAddress": {
    "street": "123 Rue de la Paix",
    "city": "Paris",
    "state": "Île-de-France",
    "zipCode": "75001",
    "country": "France"
  },
  "paymentMethod": "card",
  "notes": "Livraison entre 14h et 18h"
}
```

**Réponse:**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-20250129-002",
    "items": [ ... ],
    "total": 2879.97,
    "paymentStatus": "pending",
    "orderStatus": "pending",
    ...
  },
  "message": "Commande créée avec succès"
}
```

### GET /api/client-orders/:id
Obtenir les détails d'une commande.

**Headers:** `Authorization: Bearer <token>`

### PUT /api/client-orders/:id/cancel
Annuler une commande.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "reason": "Changement d'avis"
}
```

---

## ⭐ Avis (Reviews)

### GET /api/reviews/product/:productId
Obtenir tous les avis d'un produit.

**Réponse:**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": {
        "_id": "507f191e810c19729de860ea",
        "name": "Jean Dupont"
      },
      "product": "507f1f77bcf86cd799439012",
      "rating": 5,
      "comment": "Excellent produit !",
      "createdAt": "2025-01-20T15:30:00.000Z"
    }
  ],
  "stats": {
    "averageRating": 4.8,
    "totalReviews": 245,
    "ratingDistribution": {
      "5": 180,
      "4": 45,
      "3": 15,
      "2": 3,
      "1": 2
    }
  }
}
```

### POST /api/reviews
Créer un avis.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "product": "507f1f77bcf86cd799439012",
  "rating": 5,
  "comment": "Excellent produit, très satisfait !"
}
```

### PUT /api/reviews/:id
Mettre à jour un avis.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "rating": 4,
  "comment": "Bon produit après quelques semaines d'utilisation"
}
```

### DELETE /api/reviews/:id
Supprimer un avis.

**Headers:** `Authorization: Bearer <token>`

---

## 🔔 Gestion des Erreurs

Toutes les erreurs suivent le schéma standardisé suivant :

### Erreur 4xx (Client)
```json
{
  "status": "fail",
  "statusCode": 404,
  "code": "NOT_FOUND",
  "message": "Produit non trouvé",
  "path": "/api/products/invalid-id",
  "method": "GET",
  "requestId": "abc-123-def-456"
}
```

### Erreur 5xx (Serveur)
```json
{
  "status": "error",
  "statusCode": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Une erreur s'est produite",
  "path": "/api/orders",
  "method": "POST",
  "requestId": "abc-123-def-456",
  "stack": "Error: ...\n    at ..." // uniquement en développement
}
```

### Codes d'erreur communs
- `400` - Requête invalide
- `401` - Non authentifié (UNAUTHORIZED)
- `403` - Non autorisé (FORBIDDEN)
- `404` - Ressource non trouvée (NOT_FOUND)
- `409` - Conflit (ex: email déjà utilisé)
- `422` - Données de validation incorrectes
- `500` - Erreur serveur (INTERNAL_SERVER_ERROR)
- `503` - Service indisponible

---

## 📊 Headers de Réponse

### X-Request-Id
Chaque réponse inclut un header `X-Request-Id` unique pour le traçage :

```
X-Request-Id: abc-123-def-456
```

Ce `requestId` est également inclus dans toutes les réponses JSON et peut être utilisé pour le support technique.

---

## 🔄 Retry & Timeout

- **Timeout par défaut**: 15 secondes
- **Retry automatique**: Jusqu'à 3 tentatives avec backoff exponentiel (1s, 2s, 4s)
- **Conditions de retry**: Erreurs réseau ou erreurs serveur 5xx

---

## 💡 Bonnes Pratiques

1. **Toujours inclure le token** dans les requêtes authentifiées
2. **Vérifier le `requestId`** pour le debugging
3. **Gérer les erreurs** selon le code HTTP et le champ `status`
4. **Utiliser la pagination** pour les listes longues
5. **Filtrer et trier** les résultats côté serveur quand possible

---

## 🎯 Exemples d'utilisation

### JavaScript/Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token à chaque requête
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Exemple: récupérer les produits
const products = await api.get('/products', {
  params: { category: 'electronics', page: 1, limit: 10 }
});

// Exemple: créer une commande
const order = await api.post('/client-orders', {
  shippingAddress: { /* ... */ },
  paymentMethod: 'card'
});
```

### cURL
```bash
# Récupérer les produits
curl http://localhost:5000/api/products?page=1&limit=10

# Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean@example.com","password":"MotDePasse123!"}'

# Ajouter au panier (avec token)
curl -X POST http://localhost:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"productId":"507f1f77bcf86cd799439012","quantity":2}'
```

---

## 📞 Support

En cas de problème, veuillez fournir le `requestId` visible dans:
- Les headers de réponse (`X-Request-Id`)
- Le corps des réponses d'erreur
- Les notifications frontend

---

**Version**: 1.0.0  
**Dernière mise à jour**: 29 octobre 2025
