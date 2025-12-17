import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import { toastWishlistActions } from '../../utils/toastUtils';
import wishlistService, { Wishlist, WishlistItem } from '../../services/wishlistService';

interface WishlistState {
  items: Product[];
  backendItems: WishlistItem[];
  loading: boolean;
  error: string | null;
  synced: boolean;
}

// Load wishlist from localStorage (fallback)
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
  backendItems: [],
  loading: false,
  error: null,
  synced: false,
};

// Async thunks for backend integration
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/add',
  async (productId: string, { rejectWithValue }) => {
    try {
      const wishlist = await wishlistService.addToWishlist(productId);
      return wishlist;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/remove',
  async (productId: string, { rejectWithValue }) => {
    try {
      const wishlist = await wishlistService.removeFromWishlist(productId);
      return wishlist;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

export const clearWishlistAsync = createAsyncThunk(
  'wishlist/clear',
  async (_, { rejectWithValue }) => {
    try {
      const result = await wishlistService.clearWishlist();
      return result.wishlist;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear wishlist');
    }
  }
);

export const moveToCartAsync = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const result = await wishlistService.moveToCart(productId, quantity);
      return { productId, cart: result.cart };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to move to cart');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Local-only actions (fallback for non-authenticated users)
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        toastWishlistActions.added(action.payload.title);
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      const removedItem = state.items.find(item => item.id === action.payload);
      state.items = state.items.filter(item => item.id !== action.payload);
      if (removedItem) {
        toastWishlistActions.removed(removedItem.title);
      }
    },
    
    clearWishlist: (state) => {
      state.items = [];
      state.backendItems = [];
      state.synced = false;
    },
    
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
        toastWishlistActions.removed(action.payload.title);
      } else {
        state.items.push(action.payload);
        toastWishlistActions.added(action.payload.title);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<Wishlist>) => {
        state.loading = false;
        state.backendItems = action.payload.items;
        state.synced = true;
        
        // Convert backend items to Product format for display
        state.items = action.payload.items.map(item => ({
          id: parseInt(item.product._id) || 0,
          title: item.product.name,
          description: item.product.description || '',
          price: item.product.price,
          discountPercentage: 0,
          rating: 0,
          stock: item.product.stock,
          brand: '',
          category: item.product.category?.name || 'Uncategorized',
          thumbnail: item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url || '',
          images: item.product.images.map(img => img.url),
        } as Product));
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.synced = false;
      })
      
      // Add to wishlist
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action: PayloadAction<Wishlist>) => {
        state.loading = false;
        state.backendItems = action.payload.items;
        state.synced = true;
        
        // Update local state
        state.items = action.payload.items.map(item => ({
          id: parseInt(item.product._id) || 0,
          title: item.product.name,
          description: item.product.description || '',
          price: item.product.price,
          discountPercentage: 0,
          rating: 0,
          stock: item.product.stock,
          brand: '',
          category: item.product.category?.name || 'Uncategorized',
          thumbnail: item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url || '',
          images: item.product.images.map(img => img.url),
        } as Product));
        
        // Show toast for the last added item
        const lastItem = action.payload.items[action.payload.items.length - 1];
        if (lastItem) {
          toastWishlistActions.added(lastItem.product.name);
        }
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action: PayloadAction<Wishlist>) => {
        state.loading = false;
        state.backendItems = action.payload.items;
        state.synced = true;
        
        state.items = action.payload.items.map(item => ({
          id: parseInt(item.product._id) || 0,
          title: item.product.name,
          description: item.product.description || '',
          price: item.product.price,
          discountPercentage: 0,
          rating: 0,
          stock: item.product.stock,
          brand: '',
          category: item.product.category?.name || 'Uncategorized',
          thumbnail: item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url || '',
          images: item.product.images.map(img => img.url),
        } as Product));
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Clear wishlist
      .addCase(clearWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlistAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.backendItems = [];
        state.synced = true;
      })
      .addCase(clearWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Move to cart
      .addCase(moveToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { productId } = action.payload;
        
        // Remove the item from wishlist
        state.backendItems = state.backendItems.filter(item => item.product._id !== productId);
        state.items = state.items.filter(item => item.id.toString() !== productId);
        state.synced = true;
      })
      .addCase(moveToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  toggleWishlist 
} = wishlistSlice.actions;

// Selectors - Accept any state shape with wishlist property
export const selectWishlistItems = (state: any) => 
  state.wishlist.items;

export const selectWishlistCount = (state: any) => 
  state.wishlist.items.length;

export const selectIsInWishlist = (productId: number) => 
  (state: any) => 
    state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
