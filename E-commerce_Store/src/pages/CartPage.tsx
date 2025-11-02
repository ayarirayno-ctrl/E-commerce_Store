import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { useAbandonedCart } from '../hooks/useAbandonedCart';
import { formatPrice } from '../utils/formatters';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import AbandonedCartModal from '../components/cart/AbandonedCartModal';
import { PromoCodeInput, AppliedPromoCode } from '../components/promo/PromoCodeInput';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCartItems } = useCart();
  const { appliedCode, discountAmount, getFinalTotal, validateAndApply } = usePromoCodes();
  const { getUserAbandonedCarts, markCartAsRecovered } = useAbandonedCart();
  const [showAbandonedCartModal, setShowAbandonedCartModal] = useState(false);
  const [selectedAbandonedCart, setSelectedAbandonedCart] = useState<import('../types/abandonedCart').AbandonedCart | null>(null);

  // Check for abandoned carts on mount
  useEffect(() => {
    const abandonedCarts = getUserAbandonedCarts();
    if (abandonedCarts.length > 0 && items.length === 0) {
      // Show modal for most recent abandoned cart
      setSelectedAbandonedCart(abandonedCarts[0]);
      setShowAbandonedCartModal(true);
    }
  }, [getUserAbandonedCarts, items.length]);

  const handleRecoverCart = (promoCode?: string) => {
    if (selectedAbandonedCart) {
      markCartAsRecovered(selectedAbandonedCart.id);
      
      // Apply promo code if available
      if (promoCode) {
        validateAndApply(promoCode);
      }
      
      // Navigate to checkout
      navigate('/checkout');
    }
  };

  const shippingCost = totalPrice >= 50 ? 0 : 9.99;
  const taxRate = 0.08;
  const subtotal = totalPrice;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const finalTotal = getFinalTotal() + shippingCost + taxAmount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link to="/">
              <Button size="lg" leftIcon={<ArrowLeft className="h-5 w-5" />}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCartItems}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {appliedCode && discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCode.code})</span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {totalPrice >= 50 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(taxAmount)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                {appliedCode ? (
                  <AppliedPromoCode />
                ) : (
                  <PromoCodeInput />
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link to="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      Secure checkout with SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>

      {/* Abandoned Cart Modal */}
      {showAbandonedCartModal && selectedAbandonedCart && (
        <AbandonedCartModal
          cart={selectedAbandonedCart}
          onClose={() => setShowAbandonedCartModal(false)}
          onRecover={handleRecoverCart}
        />
      )}
    </div>
  );
};

export default CartPage;




