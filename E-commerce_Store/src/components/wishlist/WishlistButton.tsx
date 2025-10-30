import { Heart } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import type { Product } from '../../types/product';
import { cn } from '../../utils/cn';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'compact';
}

export const WishlistButton = ({
  product,
  className,
  variant = 'default',
}: WishlistButtonProps) => {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'p-2 rounded-full transition-all duration-200',
          'hover:scale-110 active:scale-95',
          inWishlist
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200',
          className
        )}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={cn(
            'w-5 h-5 transition-all',
            inWishlist && 'fill-current'
          )}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'border-2 transition-all duration-200',
        'hover:scale-105 active:scale-95',
        inWishlist
          ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
          : 'border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50',
        className
      )}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-all',
          inWishlist && 'fill-current'
        )}
      />
      <span className="font-medium">
        {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
      </span>
    </button>
  );
};
