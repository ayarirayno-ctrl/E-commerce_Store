import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Star, TrendingUp, DollarSign, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';

interface FilterOptions {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
}

interface ActiveFilters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  minRating: number;
}

interface AdvancedFiltersProps {
  options: FilterOptions;
  onFilterChange: (filters: ActiveFilters) => void;
  resultCount?: number;
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  options,
  onFilterChange,
  resultCount = 0,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    brands: [],
    priceRange: [options.minPrice, options.maxPrice],
    minRating: 0,
  });

  // Update parent when filters change
  useEffect(() => {
    onFilterChange(activeFilters);
  }, [activeFilters, onFilterChange]);

  // Toggle category
  const toggleCategory = (category: string) => {
    setActiveFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  // Toggle brand
  const toggleBrand = (brand: string) => {
    setActiveFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  // Set rating
  const setMinRating = (rating: number) => {
    setActiveFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating,
    }));
  };

  // Update price range
  const updatePriceRange = (index: 0 | 1, value: number) => {
    setActiveFilters(prev => {
      const newRange: [number, number] = [...prev.priceRange];
      newRange[index] = value;
      
      // Ensure min doesn't exceed max
      if (index === 0 && value > newRange[1]) {
        newRange[1] = value;
      }
      // Ensure max doesn't go below min
      if (index === 1 && value < newRange[0]) {
        newRange[0] = value;
      }
      
      return { ...prev, priceRange: newRange };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      brands: [],
      priceRange: [options.minPrice, options.maxPrice],
      minRating: 0,
    });
  };

  // Count active filters
  const activeFilterCount = 
    activeFilters.categories.length +
    activeFilters.brands.length +
    (activeFilters.minRating > 0 ? 1 : 0) +
    (activeFilters.priceRange[0] !== options.minPrice || activeFilters.priceRange[1] !== options.maxPrice ? 1 : 0);

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        leftIcon={<Filter className="h-4 w-4" />}
        className="relative"
      >
        Filters
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Filter Sidebar */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed lg:relative top-0 left-0 h-full lg:h-auto w-80 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none rounded-r-lg lg:rounded-lg z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary-600" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Result Count */}
                {resultCount > 0 && (
                  <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {resultCount} product{resultCount !== 1 ? 's' : ''} found
                    </span>
                  </div>
                )}

                {/* Clear All */}
                {activeFilterCount > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Clear All Filters ({activeFilterCount})
                  </Button>
                )}

                {/* Price Range */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>Price Range</span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Min Price Slider */}
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Min: {formatPrice(activeFilters.priceRange[0])}
                      </label>
                      <input
                        type="range"
                        min={options.minPrice}
                        max={options.maxPrice}
                        step={10}
                        value={activeFilters.priceRange[0]}
                        onChange={(e) => updatePriceRange(0, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                    </div>

                    {/* Max Price Slider */}
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Max: {formatPrice(activeFilters.priceRange[1])}
                      </label>
                      <input
                        type="range"
                        min={options.minPrice}
                        max={options.maxPrice}
                        step={10}
                        value={activeFilters.priceRange[1]}
                        onChange={(e) => updatePriceRange(1, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                    <Star className="h-4 w-4" />
                    <span>Minimum Rating</span>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`
                          w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                          ${activeFilters.minRating === rating
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">& up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                {options.categories.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      <span>Categories</span>
                    </div>
                    
                    <div className="space-y-2">
                      {options.categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={activeFilters.categories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brands */}
                {options.brands.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                      <Package className="h-4 w-4" />
                      <span>Brands</span>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {options.brands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={activeFilters.brands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
