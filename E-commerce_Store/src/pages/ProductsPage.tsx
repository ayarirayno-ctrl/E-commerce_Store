import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useRecentSearches } from '../hooks/useLocalStorage';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';
import SEO from '../components/common/SEO';
import { Search, Filter, X } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    items: products, 
    loading, 
    error, 
    filters, 
    categories, 
    brands,
    searchProducts,
    filterByCategory,
    filterByBrand,
    filterByPriceRange,
    clearAllFilters,
    refreshProducts
  } = useProducts();
  
  const { searches, addSearch, removeSearch, clearSearches } = useRecentSearches();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 1000,
  });

  // Handle URL parameters on component mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const brandParam = searchParams.get('brand');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    // Apply filters from URL parameters
    if (categoryParam && categoryParam !== filters.category) {
      filterByCategory(categoryParam);
    }
    if (searchParam && searchParam !== filters.search) {
      searchProducts(searchParam);
      setSearchQuery(searchParam);
    }
    if (brandParam && brandParam !== filters.brand) {
      filterByBrand(brandParam);
    }
    if (minPriceParam || maxPriceParam) {
      const minPrice = minPriceParam ? parseFloat(minPriceParam) : 0;
      const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : 1000;
      filterByPriceRange(minPrice, maxPrice);
      setPriceRange({ min: minPrice, max: maxPrice });
    }
  }, [searchParams, filters, searchProducts, filterByCategory, filterByBrand, filterByPriceRange]);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.search) newSearchParams.set('search', filters.search);
    if (filters.brand) newSearchParams.set('brand', filters.brand);
    if (filters.minPrice) newSearchParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) newSearchParams.set('maxPrice', filters.maxPrice.toString());

    setSearchParams(newSearchParams, { replace: true });
  }, [filters, setSearchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        searchProducts(searchQuery);
        if (searchQuery.trim()) {
          addSearch(searchQuery);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters.search, searchProducts, addSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchQuery);
    if (searchQuery.trim()) {
      addSearch(searchQuery);
    }
  };

  const handleCategoryFilter = (category: string) => {
    filterByCategory(category === filters.category ? '' : category);
  };

  const handleBrandFilter = (brand: string) => {
    filterByBrand(brand === filters.brand ? '' : brand);
  };

  const handlePriceRangeChange = () => {
    filterByPriceRange(priceRange.min, priceRange.max);
  };

  const clearFilters = () => {
    clearAllFilters();
    setSearchQuery('');
    setPriceRange({ min: 0, max: 1000 });
    setSearchParams({}, { replace: true }); // Clear URL parameters
  };

  const hasActiveFilters = filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.search;

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
      default:
        return 0; // Keep original order
    }
  });

  // Get page title based on current filters
  const getPageTitle = () => {
    if (filters.category) {
      return `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace('-', ' ')} Products`;
    }
    if (filters.search) {
      return `Search Results for "${filters.search}"`;
    }
    if (filters.brand) {
      return `${filters.brand} Products`;
    }
    return 'All Products';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshProducts}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={`${getPageTitle()} - Modern Store`}
        description={`Browse our collection of ${products.length} quality products. Find the best deals on electronics, smartphones, laptops, and accessories.`}
        keywords={`products, electronics, ${filters.category || 'all categories'}, online shopping, best deals`}
        type="website"
      />
      
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600">
            {products.length} product{products.length !== 1 ? 's' : ''} found
            {filters.category && (
              <span className="ml-2 text-primary-600">
                in {filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace('-', ' ')}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Search</h3>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </form>
                </div>

                {/* Recent Searches */}
                {searches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Searches</h3>
                    <div className="space-y-2">
                      {searches.slice(0, 5).map((search) => (
                        <div key={search} className="flex items-center justify-between">
                          <button
                            onClick={() => setSearchQuery(search)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            {search}
                          </button>
                          <button
                            onClick={() => removeSearch(search)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={clearSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          filters.category === category
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandFilter(brand)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          filters.brand === brand
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <Button
                      onClick={handlePriceRangeChange}
                      size="sm"
                      className="w-full"
                    >
                      Apply Range
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{sortedProducts.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-700 font-medium">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Search: {filters.search}
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Category: {filters.category}
                      <button
                        onClick={() => handleCategoryFilter('')}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.brand && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Brand: {filters.brand}
                      <button
                        onClick={() => handleBrandFilter('')}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Price: {formatPrice(filters.minPrice || 0)} - {formatPrice(filters.maxPrice || 1000)}
                      <button
                        onClick={() => setPriceRange({ min: 0, max: 1000 })}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
