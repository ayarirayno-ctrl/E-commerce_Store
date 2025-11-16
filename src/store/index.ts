import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import productsReducer from './slices/productsSlice';
import cartReducer, { saveCartToStorage } from './slices/cartSlice';
import uiReducer from './slices/uiSlice';
import wishlistReducer from './slices/wishlistSlice';
import reviewsReducer from './slices/reviewsSlice';
import promoCodesReducer from './slices/promoCodesSlice';
import analyticsReducer from './slices/analyticsSlice';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    ui: uiReducer,
    wishlist: wishlistReducer,
    reviews: reviewsReducer,
    promoCodes: promoCodesReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Subscribe to store changes to save cart to localStorage
store.subscribe(() => {
  const state = store.getState();
  if (state.cart) {
    saveCartToStorage(state.cart);
  }
  // Save wishlist to localStorage
  if (state.wishlist) {
    try {
      const serializedState = JSON.stringify(state.wishlist);
      localStorage.setItem('wishlist', serializedState);
    } catch (err) {
      // Ignore errors
    }
  }
  // Save reviews to localStorage
  if (state.reviews) {
    try {
      const serializedState = JSON.stringify(state.reviews);
      localStorage.setItem('reviews', serializedState);
    } catch (err) {
      // Ignore errors
    }
  }
  // Save applied promo code to localStorage
  if (state.promoCodes && state.promoCodes.appliedCode) {
    try {
      const serializedState = JSON.stringify(state.promoCodes.appliedCode);
      localStorage.setItem('appliedPromoCode', serializedState);
    } catch (err) {
      // Ignore errors
    }
  }
});
