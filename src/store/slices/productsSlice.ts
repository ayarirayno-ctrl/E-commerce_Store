import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductFilters, ProductState } from '../../types';
import { fetchProducts } from '../api/productsApi';

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  filters: {},
  categories: [],
  brands: [],
};

// Async thunk for fetching products
export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async (params?: { search?: string; category?: string; brand?: string }) => {
    const response = await fetchProducts(params);
    return response;
  }
);

// Async thunk for fetching categories
export const fetchCategoriesAsync = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    // In a real app, this would be an API call
    const categories = [
      'smartphones',
      'laptops',
      'audio',
      'gaming',
      'tablets',
      'wearables',
    ];
    return categories;
  }
);

// Async thunk for fetching brands
export const fetchBrandsAsync = createAsyncThunk(
  'products/fetchBrands',
  async () => {
    // In a real app, this would be an API call
    const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'Nintendo'];
    return brands;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setBrand: (state, action: PayloadAction<string>) => {
      state.filters.brand = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.filters.rating = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Fetch categories
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch brands
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.brands = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSearch,
  setCategory,
  setBrand,
  setPriceRange,
  setRating,
} = productsSlice.actions;

export default productsSlice.reducer;
