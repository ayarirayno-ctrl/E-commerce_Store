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

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  zipCode?: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber?: string;
  userId: number;
  user?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod?: string;
  paymentStatus?: string;
  total: number;
  totalPrice?: number;
  subtotal?: number;
  itemsPrice?: number;
  shippingCost?: number;
  shippingPrice?: number;
  tax?: number;
  taxPrice?: number;
  discount?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderStatus?: string;
  trackingNumber?: string;
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
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
