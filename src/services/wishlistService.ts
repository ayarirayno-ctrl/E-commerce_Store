import api from '../lib/api';
import { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiError {
  message?: string;
}

export interface WishlistProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: { url: string; isMain: boolean }[];
  stock: number;
  isActive: boolean;
  category?: {
    _id: string;
    name: string;
  };
}

export interface WishlistItem {
  product: WishlistProduct;
  addedAt: string;
  _id: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  success?: boolean;
  wishlist?: Wishlist;
  message?: string;
  _id?: string;
  user?: string;
  items?: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MoveToCartResponse {
  message: string;
  cart: {
    _id: string;
    user: string;
    items: Array<{
      product: WishlistProduct;
      quantity: number;
    }>;
  };
}

class WishlistService {
  // Get user wishlist
  async getWishlist(): Promise<Wishlist> {
    try {
      const response = await api.get<WishlistResponse>(`${API_URL}/wishlist`);
      
      // Handle both response formats
      const data = response.data;
      if (data.wishlist) {
        return data.wishlist;
      }
      
      // Direct response format
      return {
        _id: data._id || '',
        user: data.user || '',
        items: data.items || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch wishlist');
    }
  }

  // Add item to wishlist
  async addToWishlist(productId: string): Promise<Wishlist> {
    try {
      const response = await api.post<WishlistResponse>(`${API_URL}/wishlist/items`, {
        productId,
      });
      
      const data = response.data;
      if (data.wishlist) {
        return data.wishlist;
      }
      
      return {
        _id: data._id || '',
        user: data.user || '',
        items: data.items || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to add to wishlist');
    }
  }

  // Remove item from wishlist
  async removeFromWishlist(productId: string): Promise<Wishlist> {
    try {
      const response = await api.delete<WishlistResponse>(`${API_URL}/wishlist/items/${productId}`);
      
      const data = response.data;
      if (data.wishlist) {
        return data.wishlist;
      }
      
      return {
        _id: data._id || '',
        user: data.user || '',
        items: data.items || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to remove from wishlist');
    }
  }

  // Clear entire wishlist
  async clearWishlist(): Promise<{ message: string; wishlist: Wishlist }> {
    try {
      const response = await api.delete<{ message: string; wishlist: Wishlist }>(`${API_URL}/wishlist`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to clear wishlist');
    }
  }

  // Move item from wishlist to cart
  async moveToCart(productId: string, quantity: number = 1): Promise<MoveToCartResponse> {
    try {
      const response = await api.post<MoveToCartResponse>(`${API_URL}/wishlist/move-to-cart/${productId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Failed to move to cart');
    }
  }

  // Check if product is in wishlist
  async isInWishlist(productId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.items.some(item => item.product._id === productId);
    } catch (error) {
      return false;
    }
  }
}

export default new WishlistService();
