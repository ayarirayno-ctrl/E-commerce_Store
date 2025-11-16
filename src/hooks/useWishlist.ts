import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
} from '../store/slices/wishlistSlice';
import type { Product } from '../types/product';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  const addItem = useCallback((product: Product) => {
    dispatch(addToWishlist(product));
  }, [dispatch]);

  const removeItem = useCallback((productId: number) => {
    dispatch(removeFromWishlist(productId));
  }, [dispatch]);

  const toggleItem = useCallback((product: Product) => {
    dispatch(toggleWishlist(product));
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch(clearWishlist());
  }, [dispatch]);

  const isInWishlist = useCallback((productId: number) => {
    return items.some(item => item.id === productId);
  }, [items]);

  return {
    items,
    count,
    addItem,
    removeItem,
    toggleItem,
    clearAll,
    isInWishlist,
  };
};
