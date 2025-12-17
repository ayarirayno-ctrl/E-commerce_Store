import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  fetchWishlist,
  addToWishlistAsync,
  removeFromWishlistAsync,
  clearWishlistAsync,
  moveToCartAsync,
  selectWishlistItems,
  selectWishlistCount,
} from '../store/slices/wishlistSlice';
import type { Product } from '../types/product';
import { useAuth } from '../contexts/AuthContext';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);
  const loading = useAppSelector(state => state.wishlist.loading);
  const error = useAppSelector(state => state.wishlist.error);
  const synced = useAppSelector(state => state.wishlist.synced);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist from backend when authenticated
  useEffect(() => {
    if (isAuthenticated && !synced && !loading) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, synced, loading, dispatch]);

  // Add item to wishlist (backend if authenticated, local otherwise)
  const addItem = useCallback((product: Product) => {
    if (isAuthenticated) {
      dispatch(addToWishlistAsync(product.id.toString()));
    } else {
      dispatch(addToWishlist(product));
    }
  }, [dispatch, isAuthenticated]);

  // Remove item from wishlist
  const removeItem = useCallback((productId: number) => {
    if (isAuthenticated) {
      dispatch(removeFromWishlistAsync(productId.toString()));
    } else {
      dispatch(removeFromWishlist(productId));
    }
  }, [dispatch, isAuthenticated]);

  // Toggle item in wishlist
  const toggleItem = useCallback((product: Product) => {
    if (isAuthenticated) {
      const isInList = items.some(item => item.id === product.id);
      if (isInList) {
        dispatch(removeFromWishlistAsync(product.id.toString()));
      } else {
        dispatch(addToWishlistAsync(product.id.toString()));
      }
    } else {
      dispatch(toggleWishlist(product));
    }
  }, [dispatch, isAuthenticated, items]);

  // Clear all wishlist items
  const clearAll = useCallback(() => {
    if (isAuthenticated) {
      dispatch(clearWishlistAsync());
    } else {
      dispatch(clearWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Move item to cart
  const moveToCart = useCallback((productId: number, quantity: number = 1) => {
    if (isAuthenticated) {
      dispatch(moveToCartAsync({ productId: productId.toString(), quantity }));
    } else {
      // For non-authenticated users, just remove from wishlist
      dispatch(removeFromWishlist(productId));
    }
  }, [dispatch, isAuthenticated]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: number) => {
    return items.some(item => item.id === productId);
  }, [items]);

  // Refresh wishlist from backend
  const refresh = useCallback(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return {
    items,
    count,
    loading,
    error,
    synced,
    addItem,
    removeItem,
    toggleItem,
    clearAll,
    moveToCart,
    isInWishlist,
    refresh,
  };
};
