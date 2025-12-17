import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  PromoCode, 
  AppliedPromoCode, 
  PromoCodeState,
  PromoCodeValidation 
} from '../../types/promoCode';
import type { CartItem } from '../../types/cart';

// Async thunk to load promotions from backend
export const loadPromotionsFromBackend = createAsyncThunk(
  'promoCodes/loadPromotions',
  async () => {
    try {
      // Get active promotions from backend (public route)
      const response = await fetch('http://localhost:5000/api/promotions/active', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load promotions');
      }
      
      const data = await response.json();
      return data.promotions || [];
    } catch (error) {
      console.error('Error loading promotions:', error);
      // Fallback to JSON file
      const jsonData = await import('../../data/promoCodes.json');
      return jsonData.promoCodes || [];
    }
  }
);

const initialState: PromoCodeState = {
  availableCodes: [],
  appliedCode: null,
  validationLoading: false,
  error: null,
};

const promoCodesSlice = createSlice({
  name: 'promoCodes',
  initialState,
  reducers: {
    setPromoCodes: (state, action: PayloadAction<PromoCode[]>) => {
      state.availableCodes = action.payload;
    },

    applyPromoCode: (state, action: PayloadAction<AppliedPromoCode>) => {
      state.appliedCode = action.payload;
      state.error = null;
    },

    removePromoCode: (state) => {
      state.appliedCode = null;
      state.error = null;
    },

    setValidationLoading: (state, action: PayloadAction<boolean>) => {
      state.validationLoading = action.payload;
    },

    setPromoCodeError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.validationLoading = false;
    },

    clearPromoCodeError: (state) => {
      state.error = null;
    },

    // Admin actions
    addPromoCode: (state, action: PayloadAction<PromoCode>) => {
      state.availableCodes.push(action.payload);
    },

    updatePromoCode: (state, action: PayloadAction<PromoCode>) => {
      const index = state.availableCodes.findIndex(
        (code) => code.id === action.payload.id
      );
      if (index !== -1) {
        state.availableCodes[index] = action.payload;
      }
    },

    deletePromoCode: (state, action: PayloadAction<string>) => {
      state.availableCodes = state.availableCodes.filter(
        (code) => code.id !== action.payload
      );
    },

    incrementPromoCodeUsage: (state, action: PayloadAction<string>) => {
      const promoCode = state.availableCodes.find(
        (code) => code.code === action.payload
      );
      if (promoCode) {
        promoCode.usedCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPromotionsFromBackend.pending, (state) => {
        state.validationLoading = true;
        state.error = null;
      })
      .addCase(loadPromotionsFromBackend.fulfilled, (state, action) => {
        state.availableCodes = action.payload;
        state.validationLoading = false;
      })
      .addCase(loadPromotionsFromBackend.rejected, (state, action) => {
        state.validationLoading = false;
        state.error = action.error.message || 'Failed to load promotions';
      });
  },
});

export const {
  setPromoCodes,
  applyPromoCode,
  removePromoCode,
  setValidationLoading,
  setPromoCodeError,
  clearPromoCodeError,
  addPromoCode,
  updatePromoCode,
  deletePromoCode,
  incrementPromoCodeUsage,
} = promoCodesSlice.actions;

// Selectors
export const selectAllPromoCodes = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.availableCodes;

export const selectAppliedPromoCode = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.appliedCode;

export const selectPromoCodeError = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.error;

export const selectValidationLoading = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.validationLoading;

export const selectActivePromoCodes = (state: { promoCodes: PromoCodeState }) => {
  const now = new Date().toISOString();
  return state.promoCodes.availableCodes.filter(
    (code: PromoCode) =>
      code.status === 'active' &&
      code.startDate <= now &&
      code.endDate >= now &&
      (!code.maxUses || code.usedCount < code.maxUses)
  );
};

export const selectPromoCodeById = (state: { promoCodes: PromoCodeState }, id: string) =>
  state.promoCodes.availableCodes.find((code: PromoCode) => code.id === id);

export const selectPromoCodeByCode = (state: { promoCodes: PromoCodeState }, code: string) =>
  state.promoCodes.availableCodes.find(
    (promo: PromoCode) => promo.code.toLowerCase() === code.toLowerCase()
  );

// Helper function to validate promo code
export const validatePromoCode = (
  promoCode: PromoCode,
  cartItems: CartItem[],
  cartTotal: number
): PromoCodeValidation => {
  const now = new Date().toISOString();

  // Check if code is active
  if (promoCode.status !== 'active') {
    return { isValid: false, error: 'This promo code is not active' };
  }

  // Check date range
  if (promoCode.startDate > now) {
    return { isValid: false, error: 'This promo code is not yet valid' };
  }

  if (promoCode.endDate < now) {
    return { isValid: false, error: 'This promo code has expired' };
  }

  // Check usage limits
  if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
    return { isValid: false, error: 'This promo code has reached its usage limit' };
  }

  // Check minimum order value
  if (promoCode.minOrderValue && cartTotal < promoCode.minOrderValue) {
    return {
      isValid: false,
      error: `Minimum order value of $${promoCode.minOrderValue} required`,
    };
  }

  // Check category/product restrictions
  // Note: CartItem doesn't have category property directly
  // This would need to be fetched from the product data in a real implementation
  if (promoCode.applicableProducts && promoCode.applicableProducts.length > 0) {
    const hasApplicableProduct = cartItems.some((item) =>
      promoCode.applicableProducts!.includes(item.product.id.toString())
    );
    if (!hasApplicableProduct) {
      return {
        isValid: false,
        error: 'This promo code is not applicable to items in your cart',
      };
    }
  }

  if (promoCode.excludedProducts && promoCode.excludedProducts.length > 0) {
    const hasExcludedProduct = cartItems.every((item) =>
      promoCode.excludedProducts!.includes(item.product.id.toString())
    );
    if (hasExcludedProduct) {
      return {
        isValid: false,
        error: 'This promo code cannot be applied to items in your cart',
      };
    }
  }

  // Calculate discount
  let discountAmount = 0;

  switch (promoCode.discountType) {
    case 'percentage':
      discountAmount = (cartTotal * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount) {
        discountAmount = Math.min(discountAmount, promoCode.maxDiscount);
      }
      break;

    case 'fixed':
      discountAmount = Math.min(promoCode.discountValue, cartTotal);
      break;

    case 'freeShipping':
      // Shipping cost would be calculated separately
      discountAmount = 0; // Placeholder
      break;

    case 'buyXGetY':
      // Complex calculation for Buy X Get Y
      // This would need more detailed implementation
      discountAmount = 0; // Placeholder
      break;
  }

  return {
    isValid: true,
    discountAmount: Math.round(discountAmount * 100) / 100,
    promoCode,
  };
};

// Helper function to calculate discount amount
export const calculateDiscount = (
  appliedCode: AppliedPromoCode | null
): number => {
  if (!appliedCode) return 0;
  return appliedCode.discountAmount;
};

export default promoCodesSlice.reducer;
