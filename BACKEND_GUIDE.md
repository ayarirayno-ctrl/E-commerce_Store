# 🔧 Guide Backend Complet - E-Commerce Store

## 📋 Vue d'ensemble

Ce guide vous aidera à créer un backend Node.js complet pour votre e-commerce avec :
- ✅ Authentification avec vérification email
- ✅ Espace client personnel
- ✅ Historique des achats
- ✅ Gestion des commandes
- ✅ API REST complète

---

## 🛠️ Stack Technique Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Tokens d'authentification
- **Nodemailer** - Envoi d'emails
- **Bcrypt** - Hashage des mots de passe
- **Dotenv** - Variables d'environnement

---

## 📦 Étape 1 : Créer le Projet Backend

### 1.1 Créer le dossier
```bash
cd C:\Users\Admin\Desktop\e-commerce\E-commerce_Store
mkdir backend
cd backend
```

### 1.2 Initialiser le projet
```bash
npm init -y
```

### 1.3 Installer les dépendances
```bash
npm install express mongoose bcryptjs jsonwebtoken nodemailer dotenv cors cookie-parser express-validator
npm install -D nodemon
```

---

## 📁 Étape 2 : Structure du Projet

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── email.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── generateToken.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

---

## 🔐 Étape 3 : Configuration de Base

### 3.1 Créer `.env`
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=votre_secret_super_securise_ici_123456
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_app
EMAIL_FROM=noreply@ecommerce.com

# Frontend URL
FRONTEND_URL=http://localhost:3002
```

### 3.2 Créer `.gitignore`
```
node_modules/
.env
*.log
.DS_Store
```

### 3.3 Mettre à jour `package.json`
```json
{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "description": "Backend API pour E-Commerce Store",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "type": "module"
}
```

---

## 🗄️ Étape 4 : Configuration MongoDB

### 4.1 Installer MongoDB
- Télécharger : https://www.mongodb.com/try/download/community
- Installer avec les options par défaut
- MongoDB Compass sera installé (interface graphique)

### 4.2 Créer `src/config/database.js`
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 👤 Étape 5 : Modèle User avec Vérification Email

### Créer `src/models/User.js`
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
}, {
  timestamps: true
});

// Hash password avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Générer token de vérification email
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
  
  return verificationToken;
};

// Générer token de réinitialisation mot de passe
userSchema.methods.generateResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
};

export default mongoose.model('User', userSchema);
```

---

## 📧 Étape 6 : Configuration Email

### Créer `src/utils/sendEmail.js`
```javascript
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Créer transporteur
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Options du message
  const mailOptions = {
    from: `E-Commerce Store <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  // Envoyer l'email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
```

### Templates Email
Créer `src/utils/emailTemplates.js`
```javascript
export const verificationEmailTemplate = (verificationUrl, firstName) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
      .content { padding: 30px; background: #f9fafb; }
      .button { 
        display: inline-block; 
        padding: 12px 30px; 
        background: #3b82f6; 
        color: white; 
        text-decoration: none; 
        border-radius: 5px; 
        margin: 20px 0;
      }
      .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🛍️ E-Commerce Store</h1>
      </div>
      <div class="content">
        <h2>Bonjour ${firstName} !</h2>
        <p>Merci de vous être inscrit sur E-Commerce Store !</p>
        <p>Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        <center>
          <a href="${verificationUrl}" class="button">Vérifier mon email</a>
        </center>
        <p>Ou copiez ce lien dans votre navigateur :</p>
        <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
        <p><strong>Ce lien expire dans 24 heures.</strong></p>
        <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
      </div>
      <div class="footer">
        <p>© 2025 E-Commerce Store. Tous droits réservés.</p>
        <p>Nabeul, Tunisia | +216 94 816 735</p>
      </div>
    </div>
  </body>
  </html>
`;

export const welcomeEmailTemplate = (firstName) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #10b981; color: white; padding: 20px; text-align: center; }
      .content { padding: 30px; background: #f9fafb; }
      .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✅ Compte Vérifié !</h1>
      </div>
      <div class="content">
        <h2>Bienvenue ${firstName} ! 🎉</h2>
        <p>Votre compte a été vérifié avec succès !</p>
        <p>Vous pouvez maintenant :</p>
        <ul>
          <li>✅ Parcourir notre catalogue de produits</li>
          <li>✅ Ajouter des articles à votre panier</li>
          <li>✅ Créer une wishlist</li>
          <li>✅ Laisser des avis</li>
          <li>✅ Passer des commandes</li>
        </ul>
        <p>Profitez de votre shopping ! 🛍️</p>
      </div>
      <div class="footer">
        <p>© 2025 E-Commerce Store</p>
      </div>
    </div>
  </body>
  </html>
`;
```

---

## 🔑 Étape 7 : Controller d'Authentification

### Créer `src/utils/generateToken.js`
```javascript
import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
```

### Créer `src/controllers/authController.js`
```javascript
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { generateToken } from '../utils/generateToken.js';
import { verificationEmailTemplate, welcomeEmailTemplate } from '../utils/emailTemplates.js';
import crypto from 'crypto';

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    // Générer token de vérification
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // URL de vérification
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // Envoyer email de vérification
    await sendEmail({
      email: user.email,
      subject: 'Vérifiez votre email - E-Commerce Store',
      html: verificationEmailTemplate(verificationUrl, user.firstName)
    });

    res.status(201).json({
      message: 'Inscription réussie ! Veuillez vérifier votre email.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Vérifier email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Envoyer email de bienvenue
    await sendEmail({
      email: user.email,
      subject: 'Bienvenue sur E-Commerce Store ! 🎉',
      html: welcomeEmailTemplate(user.firstName)
    });

    // Générer JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Email vérifié avec succès !',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si l'email est vérifié
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Veuillez vérifier votre email avant de vous connecter' 
      });
    }

    // Générer token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

---

## ⚡ **À Suivre dans les prochains fichiers...**

Ce guide complet comprendra :
- ✅ Modèles (Order, Product, Review)
- ✅ Routes API
- ✅ Middleware d'authentification
- ✅ Controller pour historique d'achats
- ✅ Intégration frontend
- ✅ Déploiement backend

**Voulez-vous que je continue avec les prochaines étapes ?** 😊
