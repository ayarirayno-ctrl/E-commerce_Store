import api from '../lib/api';
import { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiError {
  message?: string;
}

export interface CartItem {
  product: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface BackendCartItem {
  product: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface CartResponse {
  success: boolean;
  cart: {
    items: BackendCartItem[];
    totalPrice: number;
  };
  message?: string;
}

class CartService {
  // Get user cart
  async getCart(): Promise<CartResponse> {
    try {
      const response = await api.get<CartResponse>(`${API_URL}/cart`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch cart');
    }
  }

  // Add item to cart
  async addToCart(productId: string, quantity: number = 1): Promise<CartResponse> {
    try {
      const response = await api.post<CartResponse>(`${API_URL}/cart/items`, {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to add item to cart');
    }
  }

  // Update cart item quantity
  async updateCartItem(productId: string, quantity: number): Promise<CartResponse> {
    try {
      const response = await api.put<CartResponse>(`${API_URL}/cart/items/${productId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to update cart item');
    }
  }

  // Remove item from cart
  async removeFromCart(productId: string): Promise<CartResponse> {
    try {
      const response = await api.delete<CartResponse>(`${API_URL}/cart/items/${productId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to remove item from cart');
    }
  }

  // Clear cart
  async clearCart(): Promise<CartResponse> {
    try {
      const response = await api.delete<CartResponse>(`${API_URL}/cart`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to clear cart');
    }
  }
}

export default new CartService();
