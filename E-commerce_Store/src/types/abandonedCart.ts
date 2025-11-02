export interface AbandonedCart {
  id: string;
  userId: string;
  items: AbandonedCartItem[];
  totalValue: number;
  abandonedAt: Date;
  lastReminderSent?: Date;
  remindersSent: number;
  recovered: boolean;
  recoveredAt?: Date;
  recoveryPromoCode?: string;
}

export interface AbandonedCartItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CartRecoveryEmail {
  id: string;
  cartId: string;
  sentAt: Date;
  type: 'reminder-1' | 'reminder-2' | 'reminder-3';
  promoCode?: string;
  opened: boolean;
  clicked: boolean;
}

export const CART_ABANDONMENT_CONFIG = {
  abandonmentThreshold: 30 * 60 * 1000, // 30 minutes in milliseconds
  reminder1Delay: 24 * 60 * 60 * 1000, // 24 hours
  reminder2Delay: 48 * 60 * 60 * 1000, // 48 hours
  reminder3Delay: 72 * 60 * 60 * 1000, // 72 hours
  promoCodeDiscount: 10, // 10% discount
  promoCodeExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const RECOVERY_EMAIL_TEMPLATES = {
  'reminder-1': {
    subject: '🛒 You left something behind!',
    message: "Hey! We noticed you left some items in your cart. Don't miss out on these great products!",
  },
  'reminder-2': {
    subject: '⏰ Your cart is waiting - Special offer inside!',
    message: "We're holding your items for you. Complete your order now and get 10% off with code COMEBACK10!",
  },
  'reminder-3': {
    subject: '🎁 Last chance - Your 10% discount expires soon!',
    message: "This is your final reminder! Your cart items and exclusive 10% discount code expire in 24 hours. Don't miss out!",
  },
};
