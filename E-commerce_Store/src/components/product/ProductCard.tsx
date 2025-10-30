import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, truncateText } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useReviews } from '../../hooks/useReviews';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import OptimizedImage from '../common/OptimizedImage';
import { WishlistButton } from '../wishlist/WishlistButton';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItemToCart, isInCart, getItemQuantity } = useCart();
  const { stats } = useReviews(product.id);
  const isInCartItem = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product);
  };

  const discountPrice = product.discountPercentage > 0 
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/products/${product.id}`}>
          <OptimizedImage
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <Badge
            variant="error"
            size="sm"
            className="absolute top-2 left-2"
          >
            -{product.discountPercentage.toFixed(0)}%
          </Badge>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton product={product} variant="compact" />
        </div>

        {/* Stock Status */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="warning" size="sm">
              Only {product.stock} left
            </Badge>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="error" size="md">
              Out of Stock
            </Badge>
          </div>
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
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          leftIcon={<ShoppingCart className="h-4 w-4" />}
        >
          {isInCartItem ? (
            <>
              In Cart ({cartQuantity})
            </>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
