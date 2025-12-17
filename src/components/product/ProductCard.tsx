import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { formatPrice, truncateText } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useReviews } from '../../hooks/useReviews';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import OptimizedImage from '../common/OptimizedImage';
import { WishlistButton } from '../wishlist/WishlistButton';
import { StockBadge } from './StockAlert';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItemToCart, isInCart, getItemQuantity } = useCart();
  const { stats } = useReviews(product.id);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isInCartItem = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // ✅ Vérification: Utilisateur doit être authentifié pour ajouter au panier
    if (!isAuthenticated) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    setIsAddingToCart(true);
    addItemToCart(product);
    
    // Reset animation after bounce
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const discountPrice = product.discountPercentage > 0 
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <motion.div 
      className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      layout
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/products/${product.id}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <OptimizedImage
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </Link>
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute top-2 left-2"
          >
            <Badge variant="error" size="sm">
              -{product.discountPercentage.toFixed(0)}%
            </Badge>
          </motion.div>
        )}

        {/* Wishlist Button */}
        <motion.div 
          className="absolute top-2 right-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <WishlistButton product={product} variant="compact" />
        </motion.div>

        {/* Stock Status Badge */}
        <motion.div 
          className="absolute bottom-2 left-2"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StockBadge stock={product.stock} lowStockThreshold={10} />
        </motion.div>

        {/* Quick View Button - Shows on Hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickView(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            aria-label={`Quick view for ${product.title}`}
          >
            <Eye className="h-4 w-4" />
            <span className="font-medium text-sm">Quick View</span>
          </motion.button>
        </motion.div>

        {product.stock === 0 && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-label="Out of stock"
          >
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </motion.div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.brand}
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
            {truncateText(product.title, 50)}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  stats && i < Math.floor(stats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          {stats && stats.totalReviews > 0 ? (
            <span className="text-sm text-gray-600">
              {stats.averageRating.toFixed(1)} ({stats.totalReviews})
            </span>
          ) : (
            <span className="text-sm text-gray-500">
              No reviews
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.div
          animate={isAddingToCart ? {
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
            leftIcon={!isAuthenticated ? <Lock className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            variant={!isAuthenticated ? 'secondary' : 'primary'}
          >
            {!isAuthenticated ? (
              'Sign In to Buy'
            ) : isInCartItem ? (
              <>
                In Cart ({cartQuantity})
              </>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </motion.div>
  );
};

export default React.memo(ProductCard);
