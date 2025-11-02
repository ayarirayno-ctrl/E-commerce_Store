import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Filter as FilterIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';

interface AdvancedSearchProps {
  products: Product[];
  onSearch?: (query: string) => void;
  onFilterByCategory?: (category: string) => void;
  onFilterByBrand?: (brand: string) => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  type: 'product' | 'category' | 'brand' | 'recent';
  title: string;
  subtitle?: string;
  image?: string;
  price?: number;
  category?: string;
  brand?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  products,
  onSearch,
  onFilterByCategory,
  onFilterByBrand,
  placeholder = 'Search products, categories, brands...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Debounce search query pour optimiser les performances
  const debouncedQuery = useDebounce(query, 300);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        // Ignore invalid data
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Generate suggestions based on query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      // Show recent searches when no query
      if (recentSearches.length > 0) {
        setSuggestions(
          recentSearches.map((search, index) => ({
            id: `recent-${index}`,
            type: 'recent',
            title: search,
          }))
        );
      } else {
        setSuggestions([]);
      }
      return;
    }

    const lowerQuery = debouncedQuery.toLowerCase();
    const matchedSuggestions: SearchSuggestion[] = [];

    // Match products
    const matchedProducts = products
      .filter(p => 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map(p => ({
        id: `product-${p.id}`,
        type: 'product' as const,
        title: p.title,
        subtitle: p.brand,
        image: p.thumbnail,
        price: p.price,
        category: p.category,
      }));

    matchedSuggestions.push(...matchedProducts);

    // Match categories
    const categories = [...new Set(products.map(p => p.category))];
    const matchedCategories = categories
      .filter(c => c.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map(c => ({
        id: `category-${c}`,
        type: 'category' as const,
        title: c,
        subtitle: 'Category',
      }));

    matchedSuggestions.push(...matchedCategories);

    // Match brands
    const brands = [...new Set(products.map(p => p.brand))];
    const matchedBrands = brands
      .filter(b => b.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map(b => ({
        id: `brand-${b}`,
        type: 'brand' as const,
        title: b,
        subtitle: 'Brand',
      }));

    matchedSuggestions.push(...matchedBrands);

    setSuggestions(matchedSuggestions.slice(0, 8));
  }, [debouncedQuery, products, recentSearches]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    saveRecentSearch(suggestion.title);
    
    if (suggestion.type === 'product') {
      const productId = suggestion.id.replace('product-', '');
      navigate(`/products/${productId}`);
    } else if (suggestion.type === 'category' && onFilterByCategory) {
      onFilterByCategory(suggestion.title);
      navigate(`/products?category=${encodeURIComponent(suggestion.title)}`);
    } else if (suggestion.type === 'brand' && onFilterByBrand) {
      onFilterByBrand(suggestion.title);
      navigate(`/products?brand=${encodeURIComponent(suggestion.title)}`);
    } else if (suggestion.type === 'recent') {
      setQuery(suggestion.title);
      if (onSearch) {
        onSearch(suggestion.title);
      }
    }
    
    setQuery('');
    setIsFocused(false);
    inputRef.current?.blur();
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      if (onSearch) {
        onSearch(query);
      }
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-white px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4" />;
      case 'category':
        return <FilterIcon className="h-4 w-4" />;
      case 'brand':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200
          ${isFocused 
            ? 'border-primary-500 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}>
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full py-3 pl-11 pr-20 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedIndex(-1);
                  inputRef.current?.focus();
                }}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors font-medium text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[500px] overflow-y-auto"
          >
            {/* Clear Recent Searches Button */}
            {!query && recentSearches.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}

            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  w-full px-4 py-3 flex items-center gap-3 transition-colors text-left
                  ${selectedIndex === index
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.1 }}
              >
                {/* Icon or Image */}
                {suggestion.image ? (
                  <img
                    src={suggestion.image}
                    alt={suggestion.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {highlightText(suggestion.title, query)}
                  </div>
                  {suggestion.subtitle && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.subtitle}
                    </div>
                  )}
                </div>

                {/* Price or Arrow */}
                {suggestion.price ? (
                  <div className="text-primary-600 dark:text-primary-400 font-semibold">
                    {formatPrice(suggestion.price)}
                  </div>
                ) : (
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
