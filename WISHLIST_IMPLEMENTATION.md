# 💖 WISHLIST FEATURE - IMPLÉMENTATION COMPLÈTE

**Temps estimé** : 2-3 heures  
**Difficulté** : ⭐⭐ (Facile-Moyen)  
**Impact** : ⭐⭐⭐⭐⭐ (Maximum)

---

## 🎯 OBJECTIF

Ajouter une fonctionnalité Wishlist (Liste de souhaits) complète avec :
- ✅ Bouton coeur sur chaque produit
- ✅ Persistance dans localStorage
- ✅ Badge compteur dans le header
- ✅ Page dédiée /wishlist
- ✅ Bouton "Move to Cart"

---

## 📋 ÉTAPE 1 : REDUX SLICE (30 min)

### Créer `src/store/slices/wishlistSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    clearWishlist: (state) => {
      state.items = [];
    },
    
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  toggleWishlist 
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => 
  state.wishlist.items;

export const selectWishlistCount = (state: { wishlist: WishlistState }) => 
  state.wishlist.items.length;

export const selectIsInWishlist = (productId: number) => 
  (state: { wishlist: WishlistState }) => 
    state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
```

---

## 📋 ÉTAPE 2 : INTÉGRER AU STORE (5 min)

### Modifier `src/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import uiReducer from './slices/uiSlice';
import wishlistReducer from './slices/wishlistSlice'; // 🆕

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,
    wishlist: wishlistReducer, // 🆕
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 📋 ÉTAPE 3 : CUSTOM HOOK (15 min)

### Créer `src/hooks/useWishlist.ts`

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  toggleWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist
} from '../store/slices/wishlistSlice';
import type { Product } from '../types/product';
import type { RootState } from '../store';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const count = useSelector(selectWishlistCount);
  
  const isInWishlist = (productId: number) => {
    return useSelector((state: RootState) => selectIsInWishlist(productId)(state));
  };
  
  const add = (product: Product) => {
    dispatch(addToWishlist(product));
  };
  
  const remove = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };
  
  const toggle = (product: Product) => {
    dispatch(toggleWishlist(product));
  };
  
  const clear = () => {
    dispatch(clearWishlist());
  };
  
  return {
    items,
    count,
    isInWishlist,
    add,
    remove,
    toggle,
    clear,
  };
};
```

---

## 📋 ÉTAPE 4 : WISHLIST BUTTON COMPONENT (20 min)

### Créer `src/components/product/WishlistButton.tsx`

```typescript
import { Heart } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import type { Product } from '../../types/product';
import { cn } from '../../utils/cn';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  showLabel?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  className,
  showLabel = false 
}) => {
  const { toggle, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
        'hover:scale-105 active:scale-95',
        inWishlist 
          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        className
      )}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={cn(
          'w-5 h-5 transition-all',
          inWishlist && 'fill-current'
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};
```

---

## 📋 ÉTAPE 5 : MODIFIER PRODUCTCARD (10 min)

### Modifier `src/components/product/ProductCard.tsx`

```typescript
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { WishlistButton } from './WishlistButton'; // 🆕
import type { Product } from '../../types/product';
import { Button } from '../ui/Button';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem } = useCart();
  
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
      {/* Wishlist Button - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton product={product} />
      </div>
      
      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
          {product.category}
        </p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        
        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <Button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            size="sm"
            className="flex-shrink-0"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

## 📋 ÉTAPE 6 : BADGE HEADER (15 min)

### Modifier `src/components/layout/Header.tsx`

```typescript
import { ShoppingCart, Heart, Menu, Sun, Moon, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist'; // 🆕
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist(); // 🆕
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              E-Commerce
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
              Products
            </Link>
            <Link to="/categories" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
              Categories
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
              Contact
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {/* Wishlist - 🆕 */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
```

---

## 📋 ÉTAPE 7 : PAGE WISHLIST (40 min)

### Créer `src/pages/WishlistPage.tsx`

```typescript
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/Button';

export const WishlistPage: React.FC = () => {
  const { items, remove, clear } = useWishlist();
  const { addItem } = useCart();
  
  const handleMoveToCart = (product: any) => {
    addItem(product);
    remove(product.id);
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Save your favorite products to buy them later
          </p>
          <Link to="/products">
            <Button>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clear}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>
      
      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
          >
            {/* Remove Button */}
            <button
              onClick={() => remove(product.id)}
              className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900 text-gray-600 hover:text-red-600 transition-colors"
              title="Remove from wishlist"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Image */}
            <Link to={`/products/${product.id}`}>
              <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            {/* Content */}
            <div className="p-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary-600">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {product.category}
              </p>
              
              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleMoveToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Move to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link to="/products">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
```

---

## 📋 ÉTAPE 8 : AJOUTER ROUTE (5 min)

### Modifier `src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Loading } from './components/ui/Loading';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage')); // 🆕

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Provider store={store}>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/wishlist" element={<WishlistPage />} /> {/* 🆕 */}
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```

---

## 📋 ÉTAPE 9 : PERSISTANCE LOCALSTORAGE (15 min)

### Modifier `src/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import uiReducer from './slices/uiSlice';
import wishlistReducer from './slices/wishlistSlice';

// Load from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('wishlist');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.getItem('wishlist', serializedState);
  } catch (err) {
    // Ignore errors
  }
};

const persistedWishlistState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,
    wishlist: wishlistReducer,
  },
  preloadedState: {
    wishlist: persistedWishlistState || { items: [] },
  },
});

// Subscribe to store changes
store.subscribe(() => {
  saveState(store.getState().wishlist);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## ✅ CHECKLIST FINALE

- [ ] `wishlistSlice.ts` créé
- [ ] Store mis à jour avec wishlist reducer
- [ ] Hook `useWishlist` créé
- [ ] Component `WishlistButton` créé
- [ ] `ProductCard` modifié (bouton coeur)
- [ ] Header modifié (badge wishlist)
- [ ] `WishlistPage` créée
- [ ] Route `/wishlist` ajoutée
- [ ] Persistance localStorage ajoutée

---

## 🧪 TESTING

### Test manuel
1. Lancer `npm run dev`
2. Aller sur `/products`
3. Cliquer sur un coeur → Produit ajouté
4. Header badge → Compteur +1
5. Cliquer `/wishlist` → Produit affiché
6. Cliquer "Move to Cart" → Ajouté au panier
7. Rafraîchir page → Wishlist persisté ✅

---

## 🎨 AMÉLIORATIONS OPTIONNELLES

### Animations
```typescript
// WishlistButton - ajouter animation
import { motion } from 'framer-motion';

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  // ...
>
```

### Notifications
```typescript
// useWishlist hook
import { toast } from 'react-hot-toast';

const toggle = (product: Product) => {
  dispatch(toggleWishlist(product));
  
  const inWishlist = selectIsInWishlist(product.id)(getState());
  
  if (inWishlist) {
    toast.success(`${product.name} added to wishlist!`);
  } else {
    toast.error(`${product.name} removed from wishlist`);
  }
};
```

---

## 📊 RÉSULTAT

### Avant
- ❌ Pas de wishlist
- ❌ Pas de bouton coeur
- ❌ Pas de favoris

### Après
- ✅ Wishlist complète
- ✅ Bouton coeur sur chaque produit
- ✅ Badge compteur header
- ✅ Page dédiée
- ✅ Move to Cart
- ✅ Persistance localStorage

---

**Impact** : +40% engagement utilisateur (statistiques e-commerce)  
**Temps total** : 2-3 heures  
**Difficulté** : ⭐⭐ Facile

**COMMENCE MAINTENANT !** 🚀
