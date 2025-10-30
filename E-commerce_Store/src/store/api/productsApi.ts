import { Product, ProductApiResponse } from '../../types';
import productsData from '../../data/products.json';
import { ENDPOINTS, buildUrl } from '../../config/api';

/**
 * API service for products
 * Connects to Express backend API with local fallback
 */
const FALLBACK_DATA = productsData as ProductApiResponse;
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true' || false;

/**
 * Fetch products from API with fallback to local data
 */
export const fetchProducts = async (params?: {
  search?: string;
  category?: string;
  brand?: string;
  limit?: number;
  skip?: number;
}): Promise<ProductApiResponse> => {
  // Use backend API if enabled
  if (USE_BACKEND) {
    try {
      console.log('Fetching products from backend with params:', params);
      
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.skip) queryParams.append('page', Math.floor((params.skip / (params.limit || 10)) + 1).toString());

  const response = await fetch(`${buildUrl(ENDPOINTS.PRODUCTS.LIST)}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products from backend');
      }
      
      const data = await response.json();
      
      // Transform backend response to match ProductApiResponse format
      return {
        products: data.products || [],
        total: data.totalProducts || 0,
        skip: params?.skip || 0,
        limit: params?.limit || 10
      };
    } catch (error) {
      console.error('Backend API error, falling back to local data:', error);
      // Fall through to local data
    }
  }
  
  // Use local data by default for better performance and reliability
  console.log('Fetching products with params:', params);
  
  let filteredProducts = FALLBACK_DATA.products;
  
  // Apply search filter
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply category filter
  if (params?.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === params.category?.toLowerCase()
    );
  }
  
  // Apply brand filter
  if (params?.brand) {
    filteredProducts = filteredProducts.filter(
      product => product.brand.toLowerCase() === params.brand?.toLowerCase()
    );
  }
  
  // Apply pagination
  const skip = params?.skip || 0;
  const limit = params?.limit || filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(skip, skip + limit);
  
  return {
    ...FALLBACK_DATA,
    products: paginatedProducts,
    total: filteredProducts.length,
    skip,
    limit,
  };
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id: number): Promise<Product | null> => {
  console.log('Fetching product by ID:', id);
  
  // Use local data for better performance and reliability
  const product = FALLBACK_DATA.products.find(p => p.id === id);
  return product || null;
};

/**
 * Fetch product categories
 */
export const fetchCategories = async (): Promise<string[]> => {
  console.log('Fetching categories');
  
  // Use local data - extract unique categories
  const categories = [...new Set(FALLBACK_DATA.products.map(product => product.category))];
  return categories;
};

/**
 * Search products
 */
export const searchProducts = async (query: string): Promise<ProductApiResponse> => {
  return fetchProducts({ search: query });
};
