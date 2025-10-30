import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } from '../store/slices/cartSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Product } from '../types';

/**
 * Custom hook for cart operations
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);

  const addItemToCart = useCallback((product: Product, quantity: number = 1) => {
    dispatch(addToCart({ product, quantity }));
    dispatch(addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.title} has been added to your cart.`,
      duration: 3000,
    }));
  }, [dispatch]);

  const removeItemFromCart = useCallback((productId: number) => {
    dispatch(removeFromCart(productId));
  }, [dispatch]);

  const updateItemQuantity = useCallback((productId: number, quantity: number) => {
    dispatch(updateQuantity({ id: productId, quantity }));
  }, [dispatch]);

  const clearCartItems = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const toggleCartOpen = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const closeCart = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const isInCart = useCallback((productId: number) => {
    return cart.items.some(item => item.id === productId);
  }, [cart.items]);

  const getItemQuantity = useCallback((productId: number) => {
    const item = cart.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cart.items]);

  return {
    // State
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    isOpen: cart.isOpen,
    
    // Actions
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCartItems,
    toggleCartOpen,
    closeCart,
    
    // Helpers
    isInCart,
    getItemQuantity,
  };
};
