import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/ui/Loading';
import SEO from '../components/common/SEO';
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  const { items: products, loading, error } = useProducts();

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
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title="Modern Store - Shop Latest Electronics & Tech Products"
        description="Discover amazing deals on smartphones, laptops, headphones, and more. Fast shipping, secure payment, and excellent customer service."
        keywords="electronics, smartphones, laptops, headphones, tech products, online shopping"
        type="website"
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
              <button className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
                Shop Now
              </button>
              <button className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on orders over $50. Get your items delivered in 2-3 business days.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                Your payment information is secure with our encrypted checkout process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">
                All products come with a 30-day money-back guarantee and 1-year warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
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
