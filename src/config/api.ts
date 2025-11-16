/**
 * Centralized API Configuration
 * All API endpoints and base URLs should be managed here
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * API Endpoints
 * Centralized endpoint definitions to avoid hardcoded URLs
 */
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Admin Authentication
  ADMIN_AUTH: {
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    ME: '/admin/auth/me',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
    SYNC: '/cart/sync',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    STATS: '/orders/stats/overview',
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  
  // Reviews
  REVIEWS: {
    LIST: '/reviews',
    PRODUCT_REVIEWS: (productId: string) => `/reviews/product/${productId}`,
    CREATE: '/reviews',
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
    APPROVE: (id: string) => `/reviews/${id}/approve`,
    REJECT: (id: string) => `/reviews/${id}/reject`,
    STATS: '/reviews/stats',
    RESPONSE: (id: string) => `/reviews/${id}/response`,
  },
  
  // Clients
  CLIENTS: {
    LIST: '/clients',
    DETAIL: (id: string) => `/clients/${id}`,
    BLOCK: (id: string) => `/clients/${id}/block`,
  },
  
  // Promotions
  PROMOTIONS: {
    LIST: '/promotions',
    DETAIL: (id: string) => `/promotions/${id}`,
    CREATE: '/promotions',
    UPDATE: (id: string) => `/promotions/${id}`,
    DELETE: (id: string) => `/promotions/${id}`,
    STATS: '/promotions/stats',
    ACTIVE: '/promotions/active',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    STATS: '/notifications/stats',
    UNREAD: '/notifications/read',
  },
  
  // Content Management
  CONTENT: {
    LIST: '/content',
    DETAIL: (id: string) => `/content/${id}`,
    CREATE: '/content',
    UPDATE: (id: string) => `/content/${id}`,
    DELETE: (id: string) => `/content/${id}`,
    STATS: '/content/stats',
    PUBLISH: (id: string) => `/content/${id}/publish`,
  },
  
  // Roles & Permissions
  ROLES: {
    LIST: '/roles',
    DETAIL: (id: string) => `/roles/${id}`,
    CREATE: '/roles',
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    PERMISSIONS: '/roles/permissions',
    STATS: '/roles/stats',
  },
  
  // Admin Logs
  LOGS: {
    LIST: '/admin/logs',
    STATS: '/admin/logs/stats',
  },
  
  // Health Check
  HEALTH: '/health',
  TEST: '/test',
} as const;

/**
 * Build full URL for an endpoint
 */
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
