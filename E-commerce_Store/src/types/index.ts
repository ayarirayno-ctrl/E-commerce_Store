/**
 * Central type exports
 */

export * from './product';
export * from './cart';
export * from './api';
export * from './promoCode';
export * from './analytics';

// Common types
export interface User {
  id: number;
  name: string;
  email: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: number;
  items: import('./cart').CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: Address;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  requestId?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UIState {
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: boolean;
}

// Redux store types
export interface RootState {
  products: import('./product').ProductState;
  cart: import('./cart').CartState;
  ui: UIState;
  wishlist: { items: import('./product').Product[] };
  reviews: {
    items: import('./product').Review[];
    stats: Record<number, import('./product').ReviewStats>;
    filters: import('./product').ReviewFilters;
    loading: boolean;
    error: string | null;
  };
  promoCodes: import('./promoCode').PromoCodeState;
  analytics: import('./analytics').AnalyticsState;
}
