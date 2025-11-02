import { useState, useEffect, useCallback } from 'react';
import { AbandonedCart, CART_ABANDONMENT_CONFIG, RECOVERY_EMAIL_TEMPLATES } from '../types/abandonedCart';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from './useCart';
import { useNotification } from './useNotification';

const ABANDONED_CARTS_KEY = 'abandoned_carts';

export const useAbandonedCart = () => {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();
  const { showInfo } = useNotification();
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [currentAbandonedCart, setCurrentAbandonedCart] = useState<AbandonedCart | null>(null);

  // Load abandoned carts from localStorage
  useEffect(() => {
    const savedCarts = localStorage.getItem(ABANDONED_CARTS_KEY);
    if (savedCarts) {
      try {
        const carts: AbandonedCart[] = JSON.parse(savedCarts);
        setAbandonedCarts(carts.map(cart => ({
          ...cart,
          abandonedAt: new Date(cart.abandonedAt),
          lastReminderSent: cart.lastReminderSent ? new Date(cart.lastReminderSent) : undefined,
          recoveredAt: cart.recoveredAt ? new Date(cart.recoveredAt) : undefined,
        })));
      } catch (e) {
        console.error('Error loading abandoned carts:', e);
      }
    }
  }, []);

  // Save abandoned carts to localStorage
  const saveAbandonedCarts = useCallback((carts: AbandonedCart[]) => {
    localStorage.setItem(ABANDONED_CARTS_KEY, JSON.stringify(carts));
    setAbandonedCarts(carts);
  }, []);

  // Check for cart abandonment
  useEffect(() => {
    if (!user || items.length === 0) return;

    const checkAbandonment = () => {
      const now = new Date();
      const userCart = abandonedCarts.find(
        cart => cart.userId === user.id && !cart.recovered
      );

      // If cart has items and hasn't been flagged as abandoned yet
      if (items.length > 0 && !userCart) {
        const newAbandonedCart: AbandonedCart = {
          id: `abandoned_${Date.now()}`,
          userId: user.id,
          items: items.map(item => ({
            productId: item.id,
            productName: item.product?.title || 'Unknown Product',
            productImage: item.product?.thumbnail || '',
            price: item.product?.price || 0,
            quantity: item.quantity,
          })),
          totalValue: totalPrice,
          abandonedAt: now,
          remindersSent: 0,
          recovered: false,
        };

        const updatedCarts = [...abandonedCarts, newAbandonedCart];
        saveAbandonedCarts(updatedCarts);
        setCurrentAbandonedCart(newAbandonedCart);
      }
    };

    // Check after abandonment threshold
    const timer = setTimeout(checkAbandonment, CART_ABANDONMENT_CONFIG.abandonmentThreshold);

    return () => clearTimeout(timer);
  }, [user, items, totalPrice, abandonedCarts, saveAbandonedCarts]);

  // Generate promo code
  const generatePromoCode = (cartId: string): string => {
    return `COMEBACK${cartId.slice(-6).toUpperCase()}`;
  };

  // Send recovery email (simulated)
  const sendRecoveryEmail = useCallback((
    cart: AbandonedCart,
    type: 'reminder-1' | 'reminder-2' | 'reminder-3',
    promoCode?: string
  ) => {
    const template = RECOVERY_EMAIL_TEMPLATES[type];
    
    console.log('📧 Recovery Email Sent:', {
      to: user?.email,
      subject: template.subject,
      message: template.message,
      promoCode,
      cartValue: cart.totalValue,
      items: cart.items.length,
    });

    // Show notification to user
    if (promoCode) {
      showInfo(`🎁 Check your email! We sent you a special 10% discount code: ${promoCode}`);
    }
  }, [user, showInfo]);

  // Check if reminders should be sent
  useEffect(() => {
    if (abandonedCarts.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      const updatedCarts = abandonedCarts.map(cart => {
        if (cart.recovered || !user || cart.userId !== user.id) return cart;

        const timeSinceAbandonment = now.getTime() - cart.abandonedAt.getTime();

        // Send reminder 1 after 24 hours
        if (
          cart.remindersSent === 0 &&
          timeSinceAbandonment >= CART_ABANDONMENT_CONFIG.reminder1Delay
        ) {
          sendRecoveryEmail(cart, 'reminder-1');
          return {
            ...cart,
            remindersSent: 1,
            lastReminderSent: now,
          };
        }

        // Send reminder 2 after 48 hours with promo code
        if (
          cart.remindersSent === 1 &&
          timeSinceAbandonment >= CART_ABANDONMENT_CONFIG.reminder2Delay
        ) {
          const promoCode = generatePromoCode(cart.id);
          sendRecoveryEmail(cart, 'reminder-2', promoCode);
          return {
            ...cart,
            remindersSent: 2,
            lastReminderSent: now,
            recoveryPromoCode: promoCode,
          };
        }

        // Send reminder 3 after 72 hours (final reminder)
        if (
          cart.remindersSent === 2 &&
          timeSinceAbandonment >= CART_ABANDONMENT_CONFIG.reminder3Delay
        ) {
          sendRecoveryEmail(cart, 'reminder-3', cart.recoveryPromoCode);
          return {
            ...cart,
            remindersSent: 3,
            lastReminderSent: now,
          };
        }

        return cart;
      });

      if (JSON.stringify(updatedCarts) !== JSON.stringify(abandonedCarts)) {
        saveAbandonedCarts(updatedCarts);
      }
    };

    // Check every hour
    const interval = setInterval(checkReminders, 60 * 60 * 1000);
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [abandonedCarts, user, saveAbandonedCarts, sendRecoveryEmail]);

  // Mark cart as recovered
  const markCartAsRecovered = useCallback((cartId: string) => {
    const updatedCarts = abandonedCarts.map(cart => {
      if (cart.id === cartId) {
        return {
          ...cart,
          recovered: true,
          recoveredAt: new Date(),
        };
      }
      return cart;
    });

    saveAbandonedCarts(updatedCarts);
    setCurrentAbandonedCart(null);
  }, [abandonedCarts, saveAbandonedCarts]);

  // Get user's abandoned carts
  const getUserAbandonedCarts = useCallback(() => {
    if (!user) return [];
    return abandonedCarts.filter(cart => cart.userId === user.id && !cart.recovered);
  }, [user, abandonedCarts]);

  // Get recovery statistics
  const getRecoveryStats = useCallback(() => {
    const total = abandonedCarts.length;
    const recovered = abandonedCarts.filter(cart => cart.recovered).length;
    const pending = total - recovered;
    const recoveryRate = total > 0 ? (recovered / total) * 100 : 0;
    const totalValue = abandonedCarts.reduce((sum, cart) => sum + cart.totalValue, 0);
    const recoveredValue = abandonedCarts
      .filter(cart => cart.recovered)
      .reduce((sum, cart) => sum + cart.totalValue, 0);

    return {
      total,
      recovered,
      pending,
      recoveryRate,
      totalValue,
      recoveredValue,
    };
  }, [abandonedCarts]);

  // Apply promo code for cart recovery
  const applyRecoveryPromoCode = useCallback((code: string): boolean => {
    const cart = abandonedCarts.find(
      cart => cart.recoveryPromoCode === code && !cart.recovered
    );

    if (cart) {
      // Promo code is valid
      showInfo(`✅ Promo code ${code} applied! You get 10% off your order.`);
      return true;
    }

    return false;
  }, [abandonedCarts, showInfo]);

  return {
    abandonedCarts,
    currentAbandonedCart,
    markCartAsRecovered,
    getUserAbandonedCarts,
    getRecoveryStats,
    applyRecoveryPromoCode,
    generatePromoCode,
  };
};
