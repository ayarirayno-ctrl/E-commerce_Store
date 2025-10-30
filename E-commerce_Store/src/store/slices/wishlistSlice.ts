import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';

interface WishlistState {
  items: Product[];
}

// Load wishlist from localStorage
const loadWishlistFromStorage = (): Product[] => {
  try {
    const serializedState = localStorage.getItem('wishlist');
    if (serializedState === null) {
      return [];
    }
    const parsed = JSON.parse(serializedState);
    return parsed.items || [];
  } catch (err) {
    return [];
  }
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    clearWishlist: (state) => {
      state.items = [];
    },
    
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  toggleWishlist 
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => 
  state.wishlist.items;

export const selectWishlistCount = (state: { wishlist: WishlistState }) => 
  state.wishlist.items.length;

export const selectIsInWishlist = (productId: number) => 
  (state: { wishlist: WishlistState }) => 
    state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
