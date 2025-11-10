import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useRecommendations } from '../hooks/useRecommendations';
import ProductCard from '../components/product/ProductCard';
import ProductRecommendations from '../components/recommendations/ProductRecommendations';
import Loading from '../components/ui/Loading';
import EnhancedSEO from '../components/common/EnhancedSEO';
import { generateWebSiteSchema, generateKeywords } from '../utils/seoUtils';
import { generateHomeMetaDescription } from '../utils/seoMetaUtils';
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  const { items: products, loading, error } = useProducts();
  const { getTrendingProducts, getPersonalizedRecommendations } = useRecommendations();

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
          <button
            onClick={() => {
              console.log('Refresh désactivé - utilisez F5 manuellement si nécessaire');
              // window.location.reload() SUPPRIMÉ
            }}
            className="btn btn-primary"
          >
            Actualiser (F5)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors">
      <EnhancedSEO 
        title="E-commerce Family's - Votre boutique électronique de confiance"
        description={generateHomeMetaDescription()}
        keywords={generateKeywords("electronics smartphones laptops headphones tech products online shopping fast delivery secure payment quality guarantee family trust")}
        image="https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/hero-banner.jpg"
        url="https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/"
        type="website"
        structuredData={generateWebSiteSchema()}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Shop the latest technology and electronics with fast shipping and great prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <button className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 active:bg-gray-800 active:text-white transition-colors">
                  Shop Now
                </button>
              </Link>
              <Link to="/about">
                <button className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 active:bg-gray-800 active:text-white transition-colors">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Truck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Fast Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Free shipping on orders over $50. Get your items delivered in 2-3 business days.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Secure Payment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Your payment information is secure with our encrypted checkout process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Star className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Quality Guarantee
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                All products come with a 30-day money-back guarantee and 1-year warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              Discover our handpicked selection of the best products at unbeatable prices.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-colors" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors">
                No products available
              </h3>
              <p className="text-gray-600">
                Check back later for new products.
              </p>
            </div>
          )}

          {products.length > 8 && (
            <div className="text-center mt-12">
              <Link to="/products">
                <button className="btn btn-primary btn-lg">
                  View All Products
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trending Products Section */}
      {products.length > 0 && (
        <ProductRecommendations
          title="Trending Now"
          products={getTrendingProducts(products, 8)}
          type="trending"
        />
      )}

      {/* Personalized Recommendations Section */}
      {products.length > 0 && (
        <ProductRecommendations
          title="Recommended For You"
          products={getPersonalizedRecommendations(products, 8)}
          type="personalized"
        />
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products and exclusive deals.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button className="px-6 py-3 bg-primary-800 text-white rounded-r-lg hover:bg-primary-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
