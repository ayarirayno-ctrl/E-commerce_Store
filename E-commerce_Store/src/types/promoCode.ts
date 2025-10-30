/**
 * Promo Code Types
 */

export type DiscountType = 'percentage' | 'fixed' | 'freeShipping' | 'buyXGetY';

export type PromoCodeStatus = 'active' | 'inactive' | 'expired' | 'used';

export interface PromoCode {
  id: string;
  code: string; // e.g., "SUMMER2025", "WELCOME10"
  description: string;
  discountType: DiscountType;
  discountValue: number; // Percentage (10 = 10%) or fixed amount ($10)
  
  // Validity
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: PromoCodeStatus;
  
  // Usage limits
  maxUses?: number; // Total uses allowed
  usedCount: number; // Current usage count
  maxUsesPerUser?: number; // Per user limit
  
  // Conditions
  minOrderValue?: number; // Minimum cart total
  maxDiscount?: number; // Maximum discount amount (for percentage)
  
  // Restrictions
  applicableCategories?: string[]; // Empty = all categories
  applicableProducts?: string[]; // Empty = all products
  excludedCategories?: string[];
  excludedProducts?: string[];
  
  // Buy X Get Y specific
  buyQuantity?: number; // Buy X items
  getQuantity?: number; // Get Y items free/discounted
  buyProductIds?: string[]; // Specific products for buy
  getProductIds?: string[]; // Specific products for get
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // Admin user ID
}

export interface AppliedPromoCode {
  code: string;
  discountAmount: number;
  discountType: DiscountType;
  appliedAt: string;
}

export interface PromoCodeValidation {
  isValid: boolean;
  error?: string;
  discountAmount?: number;
  promoCode?: PromoCode;
}

export interface PromoCodeState {
  availableCodes: PromoCode[];
  appliedCode: AppliedPromoCode | null;
  validationLoading: boolean;
  error: string | null;
}

export interface PromoCodeFilters {
  status?: PromoCodeStatus;
  discountType?: DiscountType;
  search?: string;
  sortBy?: 'code' | 'discountValue' | 'endDate' | 'usedCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PromoCodeFormData {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses?: number;
  maxUsesPerUser?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
}
