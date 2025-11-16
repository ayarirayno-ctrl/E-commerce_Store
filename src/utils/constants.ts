/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'cart',
  USER_PREFERENCES: 'userPreferences',
  RECENT_SEARCHES: 'recentSearches',
} as const;

// UI Constants
export const UI_CONFIG = {
  NOTIFICATION_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  ITEMS_PER_PAGE: 12,
  MAX_CART_ITEMS: 99,
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  'smartphones',
  'laptops',
  'audio',
  'gaming',
  'tablets',
  'wearables',
] as const;

// Product Brands
export const PRODUCT_BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Dell',
  'Nintendo',
  'Microsoft',
  'Google',
  'OnePlus',
] as const;

// Price Ranges
export const PRICE_RANGES = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: '$1000 - $2000', min: 1000, max: 2000 },
  { label: 'Over $2000', min: 2000, max: Infinity },
] as const;

// Rating Options
export const RATING_OPTIONS = [
  { label: '4+ Stars', value: 4 },
  { label: '3+ Stars', value: 3 },
  { label: '2+ Stars', value: 2 },
  { label: '1+ Stars', value: 1 },
] as const;

// Sort Options
export const SORT_OPTIONS = [
  { label: 'Best Match', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating: High to Low', value: 'rating_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Name: A to Z', value: 'name_asc' },
  { label: 'Name: Z to A', value: 'name_desc' },
] as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_WEAK: 'Password must contain uppercase, lowercase, and number',
  INVALID_POSTAL_CODE: 'Please enter a valid postal code',
  INVALID_CREDIT_CARD: 'Please enter a valid credit card number',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ITEM_ADDED_TO_CART: 'Item added to cart successfully',
  ITEM_REMOVED_FROM_CART: 'Item removed from cart',
  CART_CLEARED: 'Cart cleared successfully',
  ORDER_PLACED: 'Order placed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const;




