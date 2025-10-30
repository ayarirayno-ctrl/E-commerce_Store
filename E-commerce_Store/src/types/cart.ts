/**
 * Cart type definitions
 */

export interface CartItem {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    brand: string;
  };
  quantity: number;
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  loading?: boolean;
  error?: string | null;
}

export interface CartAction {
  type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_QUANTITY' | 'CLEAR_CART' | 'TOGGLE_CART';
  payload?: unknown;
}

