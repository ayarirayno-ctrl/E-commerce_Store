import { Product, ProductApiResponse } from '../../types';
import { ENDPOINTS, buildUrl } from '../../config/api';

/**
 * API service for products
 * TOUJOURS connecté au backend MongoDB (pas de fallback JSON)
 */

/**
 * Fetch products from MongoDB backend API
 */
export const fetchProducts = async (params?: {
  search?: string;
  category?: string;
  brand?: string;
  limit?: number;
  skip?: number;
}): Promise<ProductApiResponse> => {
  try {
    console.log('🔄 Fetching products from MongoDB backend with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.brand) queryParams.append('brand', params.brand);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Convert skip to page number for backend
    if (params?.skip) {
      const page = Math.floor((params.skip / (params.limit || 10)) + 1);
      queryParams.append('page', page.toString());
    }

    const url = `${buildUrl(ENDPOINTS.PRODUCTS.LIST)}?${queryParams.toString()}`;
    console.log('📡 API URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch products from backend`);
    }
    
    const data = await response.json();
    console.log('✅ Products loaded from MongoDB:', data.totalProducts, 'total');
    
    // Transform backend response to match ProductApiResponse format
    return {
      products: data.products || [],
      total: data.totalProducts || 0,
      skip: params?.skip || 0,
      limit: params?.limit || 10
    };
  } catch (error) {
    console.error('❌ Backend API error:', error);
    // Return empty array instead of fallback
    return {
      products: [],
      total: 0,
      skip: 0,
      limit: 10
    };
  }
};

/**
 * Fetch a single product by ID from MongoDB
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log('🔄 Fetching product by ID from MongoDB:', id);
    const response = await fetch(`${buildUrl(ENDPOINTS.PRODUCTS.LIST)}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Product not found: ${id}`);
    }
    
    const product = await response.json();
    console.log('✅ Product loaded from MongoDB:', product.name);
    return product;
  } catch (error) {
    console.error('❌ Error fetching product by ID:', error);
    return null;
  }
};

/**
 * Fetch categories from MongoDB backend
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    console.log('🔄 Fetching categories from MongoDB backend');
    const response = await fetch(`${buildUrl(ENDPOINTS.PRODUCTS.LIST)}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    console.log('✅ Categories loaded from MongoDB:', data);
    return data.categories || data || [];
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

/**
 * Fetch brands from MongoDB (distinct brands from products)
 */
export const fetchBrands = async (): Promise<string[]> => {
  try {
    console.log('🔄 Fetching brands from MongoDB backend');
    // Get all products and extract unique brands
    const response = await fetch(`${buildUrl(ENDPOINTS.PRODUCTS.LIST)}?limit=1000`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    
    const data = await response.json();
    const brands = [...new Set(data.products.map((p: any) => p.brand).filter(Boolean))];
    console.log('✅ Brands extracted from MongoDB:', brands);
    return brands as string[];
  } catch (error) {
    console.error('❌ Error fetching brands:', error);
    return [];
  }
};

/**
 * Search products
 */
export const searchProducts = async (query: string): Promise<ProductApiResponse> => {
  return fetchProducts({ search: query });
};
