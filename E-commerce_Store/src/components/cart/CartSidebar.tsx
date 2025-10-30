import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import CartItem from './CartItem';
import Button from '../ui/Button';

const CartSidebar: React.FC = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    isOpen, 
    closeCart, 
    clearCartItems 
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({totalItems})
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeCart}
            className="p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some items to get started
              </p>
              <Button onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Clear Cart Button */}
            <Button
              variant="outline"
              onClick={clearCartItems}
              className="w-full"
            >
              Clear Cart
            </Button>

            {/* Total */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={closeCart}
                className="w-full"
              >
                Continue Shopping
              </Button>
              <Link to="/cart" onClick={closeCart}>
                <Button className="w-full">
                  View Cart
                </Button>
              </Link>
              <Link to="/checkout" onClick={closeCart}>
                <Button variant="primary" className="w-full">
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;






