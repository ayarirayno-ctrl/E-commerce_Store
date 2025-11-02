import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { lazy, Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import { setNotificationDispatcher } from './lib/api';
import { addNotification } from './store/slices/uiSlice';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
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
import PrivateAdminRoute from './components/admin/PrivateAdminRoute';
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
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentCancelPage = lazy(() => import('./pages/PaymentCancelPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminClientsPage = lazy(() => import('./pages/admin/AdminClientsPage'));
const AdminPromotionsPage = lazy(() => import('./pages/admin/AdminPromotionsPage'));
const AdminPromoCodesPage = lazy(() => import('./pages/admin/AdminPromoCodesPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminLogsPage = lazy(() => import('./pages/admin/AdminLogsPage'));
const AdminContentPage = lazy(() => import('./pages/admin/AdminContentPage'));
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
// Error pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const NetworkErrorPage = lazy(() => import('./pages/NetworkErrorPage'));

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
          <div className="min-h-screen flex items-center justify-center">
            <LoadingAnimation size="lg" text="Loading page..." variant="bounce" />
          </div>
        }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          
          {/* Error pages */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/network-error" element={<NetworkErrorPage />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<PrivateAdminRoute><AdminLayout /></PrivateAdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="clients" element={<AdminClientsPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="promo-codes" element={<AdminPromoCodesPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
          </Route>
          
         {/* 404 - Must be last */}
         <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
    <CartSidebar />
    <NotificationSystem />
    
    {/* PWA Components */}
    <InstallPrompt />
    {needsUpdate && <UpdateNotification onUpdate={updateServiceWorker} />}
    <OfflineIndicator />
    <OnlineIndicator />
    
    {/* Product Comparison */}
    <ProductComparator />
    <CompareFloatingBar />
    
    {/* Live Chat Support */}
    <ChatWidget />
  </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
  <HelmetProvider>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <AppContent />
              <ToastProvider />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
  </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
