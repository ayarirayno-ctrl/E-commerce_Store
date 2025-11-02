import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Star } from 'lucide-react';
import Button from '../ui/Button';

export interface AdvancedFilters {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
}

interface AdvancedFiltersProps {
  filters: AdvancedFilters;
  availableCategories: string[];
  availableBrands: string[];
  onFiltersChange: (filters: Partial<AdvancedFilters>) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

/**
 * Composant de filtres avancés pour la recherche de produits
 * Permet la sélection multiple de catégories, marques, prix, note et stock
 */
export const AdvancedFiltersPanel: React.FC<AdvancedFiltersProps> = ({
  filters,
  availableCategories,
  availableBrands,
  onFiltersChange,
  onClearFilters,
  showFilters,
  onToggleFilters,
}) => {
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ categories: newCategories });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ brands: newBrands });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant={showFilters ? 'primary' : 'outline'}
        onClick={onToggleFilters}
        leftIcon={<Filter className="h-4 w-4" />}
        size="sm"
        className="relative"
      >
        Advanced Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h3>
            <button
              onClick={onToggleFilters}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Categories ({filters.categories.length} selected)
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableCategories.map(category => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Brands ({filters.brands.length} selected)
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableBrands.map(brand => (
                <label
                  key={brand}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Price Range
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => onFiltersChange({ minPrice: Number(e.target.value) })}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400">-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => onFiltersChange({ maxPrice: Number(e.target.value) })}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Minimum Rating
            </h4>
            <div className="flex items-center space-x-2">
              {[0, 1, 2, 3, 4].map(rating => (
                <button
                  key={rating}
                  onClick={() => onFiltersChange({ minRating: rating })}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                    filters.minRating === rating
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Star className="h-3 w-3 fill-current" />
                  <span>{rating === 0 ? 'All' : `${rating}+`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onFiltersChange({ inStockOnly: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                In Stock Only
              </span>
            </label>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              leftIcon={<X className="h-4 w-4" />}
              size="sm"
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};
