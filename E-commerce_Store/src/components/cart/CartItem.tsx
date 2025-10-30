import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import Button from '../ui/Button';
import OptimizedImage from '../common/OptimizedImage';

interface CartItemProps {
  item: CartItemType;
  showRemoveButton?: boolean;
  className?: string;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  showRemoveButton = true,
  className 
}) => {
  const { updateItemQuantity, removeItemFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 0) return;
    updateItemQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItemFromCart(item.id);
  };

  return (
    <div className={`flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <OptimizedImage
          src={item.product.thumbnail}
          alt={item.product.title}
          className="w-16 h-16 object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.product.title}
        </h3>
        <p className="text-sm text-gray-500">
          {item.product.brand}
        </p>
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(item.product.price)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1 h-8 w-8"
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 h-8 w-8"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(item.totalPrice)}
        </p>
      </div>

      {/* Remove Button */}
      {showRemoveButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CartItem;






