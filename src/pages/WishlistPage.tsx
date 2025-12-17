import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, X, ArrowLeft, Lock } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/formatters';
import { Product } from '../types/product';
import Button from '../components/ui/Button';
import OptimizedImage from '../components/common/OptimizedImage';

const WishlistPage: React.FC = () => {
  const { items, removeItem, clearAll, moveToCart, loading } = useWishlist();
  const { addItemToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ✅ RÈGLE: Wishlist accessible uniquement aux utilisateurs authentifiés
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/wishlist');
    }
  }, [isAuthenticated, navigate]);

  const handleAddToCart = (product: Product) => {
    if (isAuthenticated) {
      // Use backend moveToCart for authenticated users
      moveToCart(product.id, 1);
    } else {
      // Fallback to local cart for non-authenticated users
      addItemToCart(product);
    }
  };

  if (!isAuthenticated) {
    return null; // Redirection en cours
  }

  if (items.length === 0) {
    return (
      <div className="container-custom min-h-screen py-16">
        <div className="max-w-2xl mx-auto text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Heart className="h-24 w-24 text-gray-300 mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                Save your favorite items for later by clicking the heart icon on any product.
              </p>
              <Link to="/products">
                <Button size="lg">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAll}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => {
            const discountPrice = product.discountPercentage > 0
              ? product.price * (1 - product.discountPercentage / 100)
              : product.price;

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Remove from wishlist"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>

                {/* Product Image */}
                <Link to={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  {/* Brand */}
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.brand}
                  </div>

                  {/* Title */}
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2 mb-4">
                    {product.discountPercentage > 0 ? (
                      <>
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(discountPrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs font-semibold text-green-600">
                          {product.discountPercentage.toFixed(0)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    fullWidth
                    disabled={product.stock === 0 || loading}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {loading ? 'Moving...' : product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
