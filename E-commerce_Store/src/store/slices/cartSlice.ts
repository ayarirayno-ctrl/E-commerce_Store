import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../../types/cart';
import { Product, ProductVariant } from '../../types/product';
import cartService, { BackendCartItem } from '../../services/cartService';
import { toastCartActions } from '../../utils/toastUtils';

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isOpen: false,
  loading: false,
  error: null,
};

// Helper function to save cart to localStorage
export const saveCartToStorage = (cart: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

// Helper function to load cart from localStorage
export const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Validate the loaded cart structure
      if (parsedCart && Array.isArray(parsedCart.items)) {
        return {
          items: parsedCart.items,
          totalPrice: parsedCart.totalPrice || 0,
          totalItems: parsedCart.totalItems || 0,
          isOpen: parsedCart.isOpen || false,
        };
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return initialState;
};

// Async thunks for backend synchronization
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      return response.cart;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      return response.cart;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(productId);
      return response.cart;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ 
      product: Product; 
      quantity: number;
      selectedVariant?: ProductVariant;
    }>) => {
      const { product, quantity, selectedVariant } = action.payload;
      
      // For items with variants, check if exact variant exists
      const existingItem = state.items.find(item => {
        if (selectedVariant && item.selectedVariant) {
          return item.id === product.id && item.selectedVariant.id === selectedVariant.id;
        }
        return item.id === product.id && !item.selectedVariant;
      });
      
      // Use variant price if available, otherwise use base price
      const itemPrice = selectedVariant?.price ?? product.price;
      
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * itemPrice;
      } else {
        const newItem: CartItem = {
          id: product.id,
          product: {
            id: product.id,
            title: product.title,
            price: itemPrice,
            thumbnail: product.thumbnail,
            brand: product.brand,
          },
          quantity,
          totalPrice: quantity * itemPrice,
          selectedVariant: selectedVariant ? {
            id: selectedVariant.id,
            color: selectedVariant.color,
            colorHex: selectedVariant.colorHex,
            size: selectedVariant.size,
            sku: selectedVariant.sku,
          } : undefined,
        };
        state.items.push(newItem);
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);
      
      // Show toast notification with variant info
      let productName = product.title;
      if (selectedVariant) {
        const variantParts = [];
        if (selectedVariant.color) variantParts.push(selectedVariant.color);
        if (selectedVariant.size) variantParts.push(selectedVariant.size);
        if (variantParts.length > 0) {
          productName += ` (${variantParts.join(', ')})`;
        }
      }
      toastCartActions.added(productName);
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      const removedItem = state.items.find(item => item.id === action.payload);
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);
      
      // Show toast notification
      if (removedItem) {
        toastCartActions.removed(removedItem.product.title);
      }
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      
      if (item) {
        if (action.payload.quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(item => item.id !== action.payload.id);
          toastCartActions.removed(item.product.title);
        } else {
          item.quantity = action.payload.quantity;
          item.totalPrice = item.quantity * item.product.price;
          toastCartActions.updated();
        }
        
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      
      // Show toast notification
      toastCartActions.cleared();
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    loadCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.totalItems = action.payload.totalItems;
      state.isOpen = action.payload.isOpen;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      // Convert backend cart items to frontend format
      state.items = action.payload.items.map((item: BackendCartItem) => ({
        id: parseInt(item.product) || Date.now(),
        product: {
          id: parseInt(item.product) || Date.now(),
          title: item.name,
          price: item.price,
          thumbnail: item.image,
          brand: '',
        },
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      }));
      state.totalPrice = action.payload.totalPrice;
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add to cart
    builder.addCase(addToCartAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items.map((item: BackendCartItem) => ({
        id: parseInt(item.product) || Date.now(),
        product: {
          id: parseInt(item.product) || Date.now(),
          title: item.name,
          price: item.price,
          thumbnail: item.image,
          brand: '',
        },
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      }));
      state.totalPrice = action.payload.totalPrice;
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    });
    builder.addCase(addToCartAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update cart item
    builder.addCase(updateCartItemAsync.fulfilled, (state, action) => {
      state.items = action.payload.items.map((item: BackendCartItem) => ({
        id: parseInt(item.product) || Date.now(),
        product: {
          id: parseInt(item.product) || Date.now(),
          title: item.name,
          price: item.price,
          thumbnail: item.image,
          brand: '',
        },
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      }));
      state.totalPrice = action.payload.totalPrice;
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    });

    // Remove from cart
    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      state.items = action.payload.items.map((item: BackendCartItem) => ({
        id: parseInt(item.product) || Date.now(),
        product: {
          id: parseInt(item.product) || Date.now(),
          title: item.name,
          price: item.price,
          thumbnail: item.image,
          brand: '',
        },
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      }));
      state.totalPrice = action.payload.totalPrice;
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    });

    // Clear cart
    builder.addCase(clearCartAsync.fulfilled, (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, loadCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.totalPrice;
export const selectCartItemCount = (state: { cart: CartState }) => state.cart.totalItems;

export default cartSlice.reducer;