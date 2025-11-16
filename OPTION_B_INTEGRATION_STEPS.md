# 🔗 Option B - Frontend-Backend Integration Guide

## ✅ Services Layer Complete!

### Files Created:
1. ✅ `src/services/authService.ts` - Authentication service (Fixed TypeScript errors)
2. ✅ `src/services/orderService.ts` - Order management service (Updated to match backend)
3. ✅ `.env.local` - Frontend environment configuration

---

## 📋 Next Steps - Component Integration

### Step 1: Create VerifyEmailPage Component

Create `src/pages/VerifyEmailPage.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

export default function VerifyEmailPage() {
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
        setMessage(response.message || 'Email vérifié avec succès!');
        
        // Redirection après 3 secondes
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Erreur lors de la vérification');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loading size="large" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Vérification en cours...
            </h2>
            <p className="mt-2 text-gray-600">
              Veuillez patienter pendant que nous vérifions votre email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-green-600">
              Email Vérifié!
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500">
              Vous allez être redirigé dans quelques secondes...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-red-600">
              Erreur de Vérification
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-6"
            >
              Retour à l'accueil
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
```

---

### Step 2: Create ProtectedRoute Component

Create `src/components/common/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si non authentifié
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

---

### Step 3: Update App.tsx - Add Routes

Add these routes to your `src/App.tsx`:

```typescript
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Dans votre Routes:
<Routes>
  {/* ... existing routes */}
  
  {/* Vérification Email */}
  <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
  
  {/* Routes Protégées */}
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />
  
  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

### Step 4: Update CheckoutPage - Create Real Order

Modify `src/pages/CheckoutPage.tsx` to use the orderService:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService, { CreateOrderData } from '../services/orderService';
import { useAppSelector } from '../store';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (formData: any) => {
    setLoading(true);
    setError('');

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
        itemsPrice: calculateItemsPrice(),
        shippingPrice: 10, // Frais de livraison fixes
        taxPrice: calculateTax(),
        totalPrice: calculateTotal()
      };

      // Créer la commande via API
      const order = await orderService.createOrder(orderData);
      
      // Afficher succès et rediriger
      alert(`Commande créée avec succès! Numéro: ${order.orderNumber}`);
      navigate('/profile'); // Rediriger vers le profil pour voir la commande
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const calculateItemsPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateItemsPrice() * 0.19; // TVA 19%
  };

  const calculateTotal = () => {
    return calculateItemsPrice() + 10 + calculateTax();
  };

  // ... rest of your checkout UI
}
```

---

### Step 5: Update ProfilePage - Show Real Orders

Modify `src/pages/ProfilePage.tsx` to fetch real orders:

```typescript
import { useEffect, useState } from 'react';
import orderService, { Order } from '../services/orderService';
import authService from '../services/authService';
import { Loading } from '../components/ui/Loading';

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await orderService.getMyOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Loading size="large" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      
      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Informations Personnelles</h2>
        <p><strong>Nom:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Téléphone:</strong> {user?.phone || 'Non renseigné'}</p>
      </div>

      {/* Orders History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Mes Commandes</h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">Aucune commande pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Commande #{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'pending' ? 'En attente' :
                     order.status === 'processing' ? 'En cours' :
                     order.status === 'shipped' ? 'Expédiée' :
                     order.status === 'delivered' ? 'Livrée' :
                     order.status === 'cancelled' ? 'Annulée' : order.status}
                  </span>
                </div>
                
                <div className="text-sm">
                  <p className="text-gray-600">
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </p>
                  <p className="font-semibold text-lg mt-2">
                    Total: {order.totalPrice.toFixed(2)}€
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-600 mt-1">
                      Suivi: {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Checklist

### 1. Registration Flow
- [ ] Register new user with valid data
- [ ] Check for email verification message
- [ ] Check backend terminal for email log (since Gmail not configured yet)
- [ ] Copy verification token from backend logs
- [ ] Visit `/verify-email/{token}` manually
- [ ] Verify redirection to homepage after success

### 2. Login Flow
- [ ] Try login before email verification → Should fail
- [ ] After verification, login with credentials
- [ ] Check localStorage for `token` and `user`
- [ ] Verify automatic redirect to homepage

### 3. Protected Routes
- [ ] Try accessing `/profile` without login → Should redirect to home
- [ ] Try accessing `/checkout` without login → Should redirect to home
- [ ] Login and access both pages → Should work

### 4. Order Creation
- [ ] Add items to cart
- [ ] Go to checkout
- [ ] Fill shipping form
- [ ] Submit order
- [ ] Check backend logs for order confirmation email
- [ ] Verify order appears in profile page

### 5. Profile Orders Display
- [ ] Login and go to profile
- [ ] Verify orders list displays
- [ ] Check order numbers, status, dates
- [ ] Verify order details are correct

---

## 🐛 Troubleshooting

### CORS Error
If you get CORS errors:
1. Verify backend is running: `http://localhost:5000/api/health`
2. Check `.env` in backend: `FRONTEND_URL=http://localhost:5173`
3. Restart backend server

### 401 Unauthorized
1. Check if token exists: `localStorage.getItem('token')`
2. Verify email is verified in MongoDB
3. Check JWT_SECRET in backend `.env`

### Email Verification Token Not Working
1. Check token expiration (24h)
2. Verify token format in URL
3. Check backend logs for errors

### Orders Not Showing
1. Verify user is logged in
2. Check browser console for errors
3. Verify backend `/api/orders/my-orders` returns data
4. Check if orders exist in MongoDB

---

## 📝 Summary of Changes

### Services Created:
1. ✅ **authService.ts** - Complete authentication (register, login, verify, profile)
2. ✅ **orderService.ts** - Order management (create, getMyOrders, getOrderById)

### Configuration:
3. ✅ **.env.local** - `VITE_API_URL=http://localhost:5000/api`

### Components to Create:
4. ⏳ **VerifyEmailPage.tsx** - Email verification page
5. ⏳ **ProtectedRoute.tsx** - Route protection component

### Components to Update:
6. ⏳ **App.tsx** - Add verify-email route + protect routes
7. ⏳ **CheckoutPage.tsx** - Use orderService.createOrder()
8. ⏳ **ProfilePage.tsx** - Fetch and display real orders

---

## 🚀 Next Action

**Create the VerifyEmailPage component and ProtectedRoute, then update the existing components!**

Would you like me to:
1. Create these files automatically for you?
2. Guide you step-by-step through the updates?
3. Skip to testing after you create them?

Choose your preferred approach! 🎯
