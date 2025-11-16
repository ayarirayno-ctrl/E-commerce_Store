import { useState, useMemo, useCallback } from 'react';
import { Product } from '../types';

export interface AdvancedSearchFilters {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}

const DEFAULT_FILTERS: AdvancedSearchFilters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'newest',
};

/**
 * Hook pour gérer les filtres avancés et le tri des produits
 */
export const useAdvancedFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<AdvancedSearchFilters>(DEFAULT_FILTERS);

  // Mettre à jour des filtres spécifiques
  const updateFilters = useCallback((updates: Partial<AdvancedSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  // Réinitialiser tous les filtres
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Catégories et marques disponibles
  const availableCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].sort();
  }, [products]);

  const availableBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))].sort();
  }, [products]);

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtre par catégories
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Filtre par marques
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Filtre par prix
    result = result.filter(p => 
      p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Filtre par note
    if (filters.minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= filters.minRating);
    }

    // Filtre stock
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Tri
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        // Garder l'ordre original
        break;
    }

    return result;
  }, [products, filters]);

  // Nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.brands.length +
      (filters.minRating > 0 ? 1 : 0) +
      (filters.inStockOnly ? 1 : 0) +
      (filters.minPrice > DEFAULT_FILTERS.minPrice ? 1 : 0) +
      (filters.maxPrice < DEFAULT_FILTERS.maxPrice ? 1 : 0)
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    filteredProducts,
    availableCategories,
    availableBrands,
    activeFiltersCount,
  };
};
