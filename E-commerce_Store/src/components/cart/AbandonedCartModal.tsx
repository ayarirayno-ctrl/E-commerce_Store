import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Tag, Clock } from 'lucide-react';
import { AbandonedCart } from '../../types/abandonedCart';
import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';

interface AbandonedCartModalProps {
  cart: AbandonedCart;
  onClose: () => void;
  onRecover: (promoCode?: string) => void;
}

const AbandonedCartModal: React.FC<AbandonedCartModalProps> = ({
  cart,
  onClose,
  onRecover,
}) => {
  const handleRecover = () => {
    onRecover(cart.recoveryPromoCode);
    onClose();
  };

  const timeSinceAbandoned = Math.floor(
    (new Date().getTime() - cart.abandonedAt.getTime()) / (1000 * 60 * 60)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                <div>
                  <h2 className="text-2xl font-bold">Your Cart is Waiting! 🛒</h2>
                  <p className="text-sm text-primary-100">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Abandoned {timeSinceAbandoned} hour{timeSinceAbandoned !== 1 ? 's' : ''} ago
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Promo Code Highlight */}
            {cart.recoveryPromoCode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold text-green-900 dark:text-green-100">
                    🎁 Exclusive 10% Discount Code!
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-white dark:bg-gray-700 px-4 py-2 rounded border-2 border-dashed border-green-500 text-lg font-mono font-bold text-green-700 dark:text-green-300">
                    {cart.recoveryPromoCode}
                  </code>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(cart.recoveryPromoCode!);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  ⏰ Code expires in 7 days. Use it now to save!
                </p>
              </motion.div>
            )}

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Your Items ({cart.items.length})
              </h3>
              {cart.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-semibold text-primary-600 dark:text-primary-400">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(cart.totalValue)}
                </span>
              </div>
              {cart.recoveryPromoCode && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400 mb-2">
                  <span>Discount (10%):</span>
                  <span className="font-semibold">
                    -{formatPrice(cart.totalValue * 0.1)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {cart.recoveryPromoCode
                    ? formatPrice(cart.totalValue * 0.9)
                    : formatPrice(cart.totalValue)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleRecover}
                className="flex-1"
                size="lg"
              >
                {cart.recoveryPromoCode
                  ? '🎉 Complete Order with Discount'
                  : '✅ Complete My Order'}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                size="lg"
              >
                Maybe Later
              </Button>
            </div>

            {/* Urgency Message */}
            {cart.remindersSent >= 2 && (
              <p className="text-center text-sm text-red-600 dark:text-red-400 mt-4">
                ⚠️ Hurry! Your items are in high demand and may sell out soon!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AbandonedCartModal;
