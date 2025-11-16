# 🔗 Guide d'Intégration Frontend-Backend

## 📋 Vue d'ensemble

Ce guide vous montre comment connecter votre frontend React (déjà déployé sur Vercel) avec le backend Node.js pour activer l'authentification réelle avec vérification par email.

---

## 🎯 Étape 1 : Configuration de l'API dans le Frontend

### 1.1 Créer le fichier de configuration API

**Créer `src/config/api.ts`**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  
  // User
  PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  
  // Orders
  CREATE_ORDER: `${API_BASE_URL}/orders`,
  MY_ORDERS: `${API_BASE_URL}/orders/my-orders`,
  ORDER_BY_ID: (id: string) => `${API_BASE_URL}/orders/${id}`,
};

export default API_BASE_URL;
```

### 1.2 Créer le fichier `.env.local`

**À la racine du projet frontend :**
```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production (après déploiement du backend)
# VITE_API_URL=https://votre-backend.herokuapp.com/api
```

---

## 🔒 Étape 2 : Service d'Authentification

### Créer `src/services/authService.ts`
```typescript
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
}

// Configuration axios avec token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class AuthService {
  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, data);
      
      // Sauvegarder le token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  }

  // Vérification email
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await axios.get(`${API_ENDPOINTS.VERIFY_EMAIL}/${token}`);
      
      // Sauvegarder le token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification');
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Vérifier si connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
```

---

## 🛒 Étape 3 : Service des Commandes

### Créer `src/services/orderService.ts`
```typescript
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  promoCode?: {
    code: string;
    discount: number;
    discountType: string;
  };
}

class OrderService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // Créer une commande
  async createOrder(orderData: CreateOrderData) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.CREATE_ORDER,
        orderData,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la commande');
    }
  }

  // Récupérer l'historique des commandes
  async getMyOrders() {
    try {
      const response = await axios.get(
        API_ENDPOINTS.MY_ORDERS,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des commandes');
    }
  }

  // Récupérer une commande par ID
  async getOrderById(orderId: string) {
    try {
      const response = await axios.get(
        API_ENDPOINTS.ORDER_BY_ID(orderId),
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la commande');
    }
  }
}

export default new OrderService();
```

---

## 📝 Étape 4 : Modifier la Page d'Authentification

### Modifier `src/pages/AuthPage.tsx`

**Remplacer le contenu actuel par :**
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService, { RegisterData, LoginData } from '../services/authService';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Connexion
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password
        };
        
        const response = await authService.login(loginData);
        
        setMessage({
          type: 'success',
          text: `Bienvenue ${response.user?.firstName} !`
        });

        // Redirection après 1 seconde
        setTimeout(() => {
          navigate('/profile');
        }, 1000);

      } else {
        // Inscription
        const registerData: RegisterData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        };
        
        const response = await authService.register(registerData);
        
        setMessage({
          type: 'success',
          text: response.message + ' Vérifiez votre email pour activer votre compte.'
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: ''
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? 'Connectez-vous pour accéder à votre espace'
                : 'Inscrivez-vous pour commencer vos achats'}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    icon={<User className="w-5 h-5" />}
                  />
                  <Input
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    icon={<User className="w-5 h-5" />}
                  />
                </div>
                <Input
                  label="Téléphone (optionnel)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone className="w-5 h-5" />}
                  placeholder="+216 XX XXX XXX"
                />
              </>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              icon={<Mail className="w-5 h-5" />}
              placeholder="exemple@email.com"
            />

            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              icon={<Lock className="w-5 h-5" />}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Chargement...'
                : isLogin
                ? 'Se connecter'
                : 'Créer mon compte'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
```

---

## ✉️ Étape 5 : Page de Vérification Email

### Créer `src/pages/VerifyEmailPage.tsx`
```typescript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Button from '../components/ui/Button';
import authService from '../services/authService';

const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de vérification manquant');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Vérification en cours...
            </h1>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous vérifions votre email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email vérifié avec succès !
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              variant="primary"
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              Accéder à mon profil
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur de vérification
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              variant="primary"
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Retour à la connexion
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
```

---

## 🛣️ Étape 6 : Ajouter la Route de Vérification

### Modifier `src/App.tsx`

**Ajouter l'import :**
```typescript
import VerifyEmailPage from './pages/VerifyEmailPage';
```

**Ajouter la route dans le Router :**
```typescript
<Route path="/verify-email/:token" element={<VerifyEmailPage />} />
```

---

## 👤 Étape 7 : Modifier la Page de Profil

### Modifier `src/pages/ProfilePage.tsx`

**Ajouter ces imports en haut :**
```typescript
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import orderService from '../services/orderService';
```

**Ajouter au début du component :**
```typescript
const ProfilePage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Vérifier si connecté
    if (!authService.isAuthenticated()) {
      navigate('/auth');
      return;
    }

    // Charger les commandes
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        setOrders(response.orders || []);
      } catch (error) {
        console.error('Erreur chargement commandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/auth');
  };

  // ... reste du code
```

**Afficher les vraies commandes :**
```typescript
<div className="space-y-4">
  {loading ? (
    <p className="text-center text-gray-500">Chargement...</p>
  ) : orders.length === 0 ? (
    <p className="text-center text-gray-500">Aucune commande pour le moment</p>
  ) : (
    orders.map((order) => (
      <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold">Commande #{order.orderNumber}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {order.items.length} article{order.items.length > 1 ? 's' : ''}
        </p>
        <p className="font-bold text-blue-600">{order.totalPrice.toFixed(2)}€</p>
      </div>
    ))
  )}
</div>
```

---

## 🛒 Étape 8 : Modifier le Processus de Commande

### Modifier `src/pages/CheckoutPage.tsx`

**Ajouter ces imports :**
```typescript
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import orderService, { CreateOrderData } from '../services/orderService';
```

**Modifier la fonction handlePlaceOrder :**
```typescript
const handlePlaceOrder = async () => {
  // Vérifier si connecté
  if (!authService.isAuthenticated()) {
    navigate('/auth');
    return;
  }

  setIsProcessing(true);

  try {
    // Préparer les données de commande
    const orderData: CreateOrderData = {
      items: cartItems.map(item => ({
        product: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone
      },
      paymentMethod: formData.paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: shipping,
      taxPrice: tax,
      totalPrice: total
    };

    // Créer la commande
    const response = await orderService.createOrder(orderData);

    // Succès
    setOrderPlaced(true);
    dispatch(clearCart());

    // Afficher le numéro de commande
    alert(`Commande créée avec succès ! Numéro: ${response.order.orderNumber}`);

    // Rediriger vers le profil
    setTimeout(() => {
      navigate('/profile');
    }, 2000);

  } catch (error: any) {
    alert('Erreur lors de la commande: ' + error.message);
  } finally {
    setIsProcessing(false);
  }
};
```

---

## 🔐 Étape 9 : Protection des Routes

### Créer `src/components/ProtectedRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Modifier `src/App.tsx`

**Importer ProtectedRoute :**
```typescript
import ProtectedRoute from './components/ProtectedRoute';
```

**Protéger les routes :**
```typescript
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
<Route path="/checkout" element={
  <ProtectedRoute>
    <CheckoutPage />
  </ProtectedRoute>
} />
```

---

## 🚀 Étape 10 : Tester l'Intégration

### 10.1 Démarrer le Backend
```bash
cd backend
npm run dev
```

### 10.2 Démarrer le Frontend
```bash
npm run dev
```

### 10.3 Tester le Flow Complet

1. **Inscription** : `http://localhost:5173/auth`
   - Créer un compte avec un vrai email
   - Vérifier l'email reçu

2. **Vérification Email** :
   - Cliquer sur le lien dans l'email
   - Être redirigé vers `/verify-email/{token}`

3. **Connexion** :
   - Se connecter avec le compte vérifié
   - Être redirigé vers `/profile`

4. **Commander** :
   - Ajouter des produits au panier
   - Aller au checkout
   - Remplir le formulaire de livraison
   - Passer commande

5. **Historique** :
   - Voir la commande dans `/profile`
   - Vérifier l'email de confirmation

---

## 📦 Étape 11 : Déploiement

### 11.1 Backend (Railway / Heroku)

**Option A - Railway :**
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Déployer
cd backend
railway init
railway up
```

**Option B - Heroku :**
```bash
# Installer Heroku CLI
# Puis:
cd backend
heroku create votre-app-backend
git push heroku main
```

### 11.2 Variables d'environnement Production

**Sur Railway/Heroku, ajouter :**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret_jwt
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre@email.com
EMAIL_PASS=votre_app_password
FRONTEND_URL=https://e-commerce-store-cdcxghpon-rayens-projects-6420fa79.vercel.app
```

### 11.3 Frontend Vercel

**Mettre à jour `.env.local` (puis redéployer) :**
```env
VITE_API_URL=https://votre-backend.herokuapp.com/api
```

**Redéployer sur Vercel :**
```bash
vercel --prod
```

---

## ✅ Checklist Finale

- [ ] Backend déployé sur Railway/Heroku
- [ ] MongoDB Atlas configuré
- [ ] Variables d'environnement configurées
- [ ] Gmail App Password créé
- [ ] Frontend mis à jour avec VITE_API_URL
- [ ] Frontend redéployé sur Vercel
- [ ] Test inscription réelle
- [ ] Test vérification email
- [ ] Test connexion
- [ ] Test création commande
- [ ] Test historique commandes

---

## 🎉 Résultat Final

Vous avez maintenant :
- ✅ Authentification complète avec email réel
- ✅ Vérification par email (code dans l'inbox)
- ✅ Connexion sécurisée avec JWT
- ✅ Création de commandes réelles
- ✅ Historique des commandes par utilisateur
- ✅ Protection des routes sensibles
- ✅ Application full-stack déployée

**Votre e-commerce est maintenant 100% fonctionnel ! 🚀**
