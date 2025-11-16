import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Loading from '../components/ui/Loading';
import SEO from '../components/common/SEO';
import { Grid, Package, TrendingUp, Star } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const { categories, items: allProducts, loading, error } = useProducts();
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculate actual product count per category
    if (categories.length > 0 && allProducts.length > 0) {
      const stats: Record<string, number> = {};
      categories.forEach(category => {
        const count = allProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        ).length;
        stats[category] = count;
      });
      setCategoryStats(stats);
    }
  }, [categories, allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading categories..." />
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
          <button
            onClick={() => console.log('Refresh désactivé - utilisez F5 manuellement')}
            className="btn btn-primary"
          >
            Actualiser (F5)
          </button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'smartphones': <Package className="h-8 w-8" />,
      'laptops': <Grid className="h-8 w-8" />,
      'fragrances': <Star className="h-8 w-8" />,
      'skincare': <TrendingUp className="h-8 w-8" />,
      'groceries': <Package className="h-8 w-8" />,
      'home-decoration': <Grid className="h-8 w-8" />,
      'furniture': <Grid className="h-8 w-8" />,
      'tops': <TrendingUp className="h-8 w-8" />,
      'womens-dresses': <Star className="h-8 w-8" />,
      'womens-shoes': <Package className="h-8 w-8" />,
      'mens-shirts': <Grid className="h-8 w-8" />,
      'mens-shoes': <Package className="h-8 w-8" />,
      'mens-watches': <TrendingUp className="h-8 w-8" />,
      'womens-watches': <Star className="h-8 w-8" />,
      'womens-bags': <Package className="h-8 w-8" />,
      'womens-jewellery': <Star className="h-8 w-8" />,
      'sunglasses': <TrendingUp className="h-8 w-8" />,
      'automotive': <Grid className="h-8 w-8" />,
      'motorcycle': <Package className="h-8 w-8" />,
      'lighting': <Star className="h-8 w-8" />,
    };
    return iconMap[category] || <Package className="h-8 w-8" />;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Browse Categories - Modern Store"
        description="Explore our product categories including smartphones, laptops, tablets, headphones, and more. Find exactly what you're looking for."
        keywords="categories, product categories, electronics categories, shop by category"
        type="website"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-custom py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop by Category
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our wide range of products organized by category.
              Find exactly what you&apos;re looking for with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category}
              to={`/products?category=${category}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getCategoryColor(index)} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                  {getCategoryIcon(category)}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                  {category.replace('-', ' ')}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  {categoryStats[category] || 0} products available
                </p>
                
                <div className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                  Shop Now →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our most popular product categories that customers love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, index) => (
              <div key={category} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg ${getCategoryColor(index)} flex items-center justify-center text-white mr-4`}>
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {category.replace('-', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {categoryStats[category] || 0} products
                    </p>
                  </div>
                </div>
                
                <Link
                  to={`/products?category=${category}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  View Products
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-600 text-white py-12">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse all our products or use our search feature to find exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View All Products
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
