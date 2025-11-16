# 🔧 Guide Backend Complet - PARTIE 2

## 📦 Étape 8 : Modèle Order (Commandes)

### Créer `src/models/Order.js`
```javascript
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'paypal', 'cod'] // card, paypal, cash on delivery
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  promoCode: {
    code: String,
    discount: Number,
    discountType: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date
}, {
  timestamps: true
});

// Générer numéro de commande automatique
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
```

---

## 🛒 Étape 9 : Controller des Commandes

### Créer `src/controllers/orderController.js`
```javascript
import Order from '../models/Order.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promoCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Aucun article dans la commande' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promoCode
    });

    // Peupler les détails du produit
    await order.populate('items.product', 'name price image');

    // Envoyer email de confirmation
    await sendOrderConfirmationEmail(order, req.user);

    res.status(201).json({
      message: 'Commande créée avec succès',
      order
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Obtenir l'historique des commandes de l'utilisateur
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Mettre à jour le statut de la commande
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    order.status = status || order.status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      message: 'Statut mis à jour',
      order
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction helper pour email de confirmation
const sendOrderConfirmationEmail = async (order, user) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .order-item { border-bottom: 1px solid #e5e7eb; padding: 15px 0; }
        .total { font-size: 18px; font-weight: bold; color: #3b82f6; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Commande Confirmée !</h1>
        </div>
        <div class="content">
          <h2>Merci ${user.firstName} !</h2>
          <p>Votre commande <strong>${order.orderNumber}</strong> a été confirmée.</p>
          
          <h3>Détails de la commande :</h3>
          ${order.items.map(item => `
            <div class="order-item">
              <strong>${item.name}</strong><br>
              Quantité: ${item.quantity} x ${item.price}€
            </div>
          `).join('')}
          
          <p class="total">Total: ${order.totalPrice.toFixed(2)}€</p>
          
          <p><strong>Adresse de livraison :</strong><br>
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br>
          ${order.shippingAddress.country}</p>
          
          <p>Vous recevrez un email avec le numéro de suivi une fois votre commande expédiée.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: `Confirmation de commande ${order.orderNumber}`,
    html: emailHtml
  });
};
```

---

## 🔒 Étape 10 : Middleware d'Authentification

### Créer `src/middleware/auth.js`
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protéger les routes (utilisateur connecté)
export const protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token du header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Non autorisé - Aucun token' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    next();

  } catch (error) {
    res.status(401).json({ message: 'Non autorisé - Token invalide' });
  }
};

// Vérifier si l'utilisateur est admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }
};

// Vérifier si l'email est vérifié
export const emailVerified = (req, res, next) => {
  if (req.user && req.user.isEmailVerified) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Veuillez vérifier votre email avant d\'accéder à cette ressource' 
    });
  }
};
```

---

## 🛤️ Étape 11 : Routes API

### Créer `src/routes/auth.js`
```javascript
import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

export default router;
```

### Créer `src/routes/orders.js`
```javascript
import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById,
  updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, admin, emailVerified } from '../middleware/auth.js';

const router = express.Router();

// Routes utilisateur
router.post('/', protect, emailVerified, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Routes admin
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
```

### Créer `src/routes/users.js`
```javascript
import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Obtenir le profil utilisateur
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @desc    Mettre à jour le profil
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.address) {
        user.address = req.body.address;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address
      });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
```

---

## 🚀 Étape 12 : Serveur Principal

### Créer `src/server.js`
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

// Charger variables d'environnement
dotenv.config();

// Connexion base de données
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});
```

---

## 🎯 Étape 13 : Lancer le Backend

### 13.1 Démarrer MongoDB
```bash
# Windows: MongoDB se lance automatiquement
# Ou manuellement:
net start MongoDB
```

### 13.2 Lancer le serveur
```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📡 Environment: development
```

---

## 🔗 Étape 14 : Tester l'API

### Utiliser Postman ou Thunder Client

**1. Inscription :**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Rayen",
  "lastName": "Ayari",
  "email": "test@example.com",
  "password": "password123",
  "phone": "+216 94 816 735"
}
```

**2. Vérification Email :**
- Récupérer le token dans votre email
- `GET http://localhost:5000/api/auth/verify-email/{TOKEN}`

**3. Connexion :**
```
POST http://localhost:5000/api/auth/login

{
  "email": "test@example.com",
  "password": "password123"
}
```

**4. Créer une commande :**
```
POST http://localhost:5000/api/orders
Authorization: Bearer {VOTRE_TOKEN}

{
  "items": [
    {
      "product": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "Rayen",
    "lastName": "Ayari",
    "street": "123 Rue",
    "city": "Nabeul",
    "postalCode": "8000",
    "country": "Tunisia",
    "phone": "+216 94 816 735"
  },
  "paymentMethod": "card",
  "itemsPrice": 199.98,
  "shippingPrice": 10.00,
  "taxPrice": 20.00,
  "totalPrice": 229.98
}
```

**5. Historique des commandes :**
```
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer {VOTRE_TOKEN}
```

---

## 📝 **PROCHAINE ÉTAPE : Intégration Frontend**

Pour connecter votre frontend React au backend, consultez le fichier suivant que je vais créer :

**`FRONTEND_INTEGRATION_GUIDE.md`**

Voulez-vous que je crée ce guide maintenant ? 🚀
