import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  fetchProductsAsync, 
  fetchCategoriesAsync, 
  fetchBrandsAsync,
  setFilters,
  clearFilters,
  setSearch,
  setCategory,
  setBrand,
  setPriceRange,
  setRating,
} from '../store/slices/productsSlice';
import { ProductFilters } from '../types';

/**
 * Custom hook for product operations
 */
export const useProducts = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products);

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProductsAsync({}));
    dispatch(fetchCategoriesAsync());
    dispatch(fetchBrandsAsync());
  }, [dispatch]);

  const searchProducts = useCallback((query: string) => {
    dispatch(setSearch(query));
    dispatch(fetchProductsAsync({ search: query }));
  }, [dispatch]);

  const filterByCategory = useCallback((category: string) => {
    dispatch(setCategory(category));
    dispatch(fetchProductsAsync({ category }));
  }, [dispatch]);

  const filterByBrand = useCallback((brand: string) => {
    dispatch(setBrand(brand));
    dispatch(fetchProductsAsync({ brand }));
  }, [dispatch]);

  const filterByPriceRange = useCallback((min: number, max: number) => {
    dispatch(setPriceRange({ min, max }));
    // Note: Price filtering is done client-side in the slice
  }, [dispatch]);

  const filterByRating = useCallback((rating: number) => {
    dispatch(setRating(rating));
    // Note: Rating filtering is done client-side in the slice
  }, [dispatch]);

  const applyFilters = useCallback((filters: ProductFilters) => {
    dispatch(setFilters(filters));
    dispatch(fetchProductsAsync(filters));
  }, [dispatch]);

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
    dispatch(fetchProductsAsync({}));
  }, [dispatch]);

  const refreshProducts = useCallback(() => {
    dispatch(fetchProductsAsync(products.filters));
  }, [dispatch, products.filters]);

  return {
    // State
    items: products.items,
    loading: products.loading,
    error: products.error,
    filters: products.filters,
    categories: products.categories,
    brands: products.brands,
    
    // Actions
    searchProducts,
    filterByCategory,
    filterByBrand,
    filterByPriceRange,
    filterByRating,
    applyFilters,
    clearAllFilters,
    refreshProducts,
  };
};




