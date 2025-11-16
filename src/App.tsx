import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { lazy, Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { keycloakInitOptions, setupTokenRefresh } from './config/keycloak';
import { store } from './store';
import { setNotificationDispatcher } from './lib/api';
import { addNotification } from './store/slices/uiSlice';
import { ThemeProvider } from './contexts/ThemeContext';
import { KeycloakAuthProvider } from './contexts/KeycloakAuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';
import ChatWidget from './components/chat/ChatWidget';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationSystem from './components/common/NotificationSystem';
import SkipToContent from './components/common/SkipToContent';
import { AriaLiveRegion } from './components/common/AriaLiveRegion';

// Import mobile & responsive styles
import './styles/mobile-responsive.css';
import ToastProvider from './components/common/ToastProvider';
import { LoadingAnimation } from './components/common/LoadingAnimation';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/admin/AdminRoute';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { UpdateNotification } from './components/pwa/UpdateNotification';
import { OfflineIndicator, OnlineIndicator } from './components/pwa/OfflineIndicator';
import { useServiceWorker } from './hooks/useServiceWorker';
import { ProductComparator, CompareFloatingBar } from './components/compare/ProductComparator';
import './styles/globals.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ForgotPasswordClientPage = lazy(() => import('./pages/ForgotPasswordClientPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentCancelPage = lazy(() => import('./pages/PaymentCancelPage'));
const EmergencyResetPage = lazy(() => import('./pages/EmergencyResetPage'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Utility pages
const ClearCachePage = lazy(() => import('./pages/ClearCachePage'));

// Error pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const NetworkErrorPage = lazy(() => import('./pages/NetworkErrorPage'));

// Keycloak event handler
const keycloakEventHandler = (event: unknown, error: unknown) => {
  console.log('Keycloak event:', event, error);
  
  if (event === 'onAuthSuccess') {
    setupTokenRefresh();
    console.log('✅ Authentication successful');
  } else if (event === 'onAuthError') {
    console.error('❌ Authentication error:', error);
  } else if (event === 'onAuthRefreshError') {
    console.error('❌ Token refresh error:', error);
  } else if (event === 'onAuthLogout') {
    console.log('👋 User logged out');
  }
};

// Keycloak loading component
const KeycloakLoadingComponent = (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingAnimation />
    <p className="ml-4 text-gray-600">Chargement de l'authentification...</p>
  </div>
);

// AppContent component with dispatch access
function AppContent() {
  const dispatch = useDispatch();
  const { needsUpdate, updateServiceWorker } = useServiceWorker();

  // Set up notification dispatcher and load promo codes once on mount
  useEffect(() => {
    setNotificationDispatcher((notification) => {
      dispatch(addNotification(notification));
    });

    // Load promo codes
    import('./data/promoCodes.json').then((data) => {
      dispatch({ type: 'promoCodes/setPromoCodes', payload: data.promoCodes });
    });

    // Load applied promo code from localStorage
    const savedPromoCode = localStorage.getItem('appliedPromoCode');
    if (savedPromoCode) {
      try {
        const parsed = JSON.parse(savedPromoCode);
        dispatch({ type: 'promoCodes/applyPromoCode', payload: parsed });
      } catch (err) {
        // Ignore invalid data
      }
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <SkipToContent />
      <AriaLiveRegion />
      <Header />
      <main className="flex-1" id="main-content">
        <Suspense fallback={
          <div className="flex justify-center items-center h-96">
            <LoadingAnimation />
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordClientPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/emergency-reset" element={<EmergencyResetPage />} />
            <Route path="/clear-cache" element={<ClearCachePage />} />
            
            {/* Protected client routes */}
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
            <Route path="/payment-success" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />
            <Route path="/payment-cancel" element={<PrivateRoute><PaymentCancelPage /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Error routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/network-error" element={<NetworkErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CartSidebar />
      <ChatWidget />
      <ProductComparator />
      <CompareFloatingBar />
      <InstallPrompt />
      {needsUpdate && <UpdateNotification onUpdate={updateServiceWorker} />}
      <OfflineIndicator />
      <OnlineIndicator />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={keycloakInitOptions}
        LoadingComponent={KeycloakLoadingComponent}
        onEvent={keycloakEventHandler}
      >
        <HelmetProvider>
          <Provider store={store}>
            <Router>
              <ThemeProvider>
                <KeycloakAuthProvider>
                  <ToastProvider>
                    <NotificationSystem />
                    <AppContent />
                  </ToastProvider>
                </KeycloakAuthProvider>
              </ThemeProvider>
            </Router>
          </Provider>
        </HelmetProvider>
      </ReactKeycloakProvider>
    </ErrorBoundary>
  );
}

export default App;
