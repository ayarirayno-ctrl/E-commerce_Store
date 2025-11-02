import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import Button from '../ui/Button';

interface ProductComparisonProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { addItemToCart } = useCart();

  if (products.length === 0) return null;

  const comparisonRows = [
    { label: 'Image', key: 'image' },
    { label: 'Name', key: 'title' },
    { label: 'Price', key: 'price' },
    { label: 'Discount', key: 'discount' },
    { label: 'Rating', key: 'rating' },
    { label: 'Brand', key: 'brand' },
    { label: 'Category', key: 'category' },
    { label: 'Stock', key: 'stock' },
    { label: 'Description', key: 'description' },
  ];

  const renderCell = (product: Product, key: string) => {
    switch (key) {
      case 'image':
        return (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-32 h-32 object-cover rounded-lg mx-auto"
          />
        );
      case 'title':
        return (
          <button
            onClick={() => {
              navigate(`/products/${product.id}`);
              onClose();
            }}
            className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline text-left"
          >
            {product.title}
          </button>
        );
      case 'price': {
        const discountPrice = product.discountPercentage > 0
          ? product.price * (1 - product.discountPercentage / 100)
          : product.price;
        return (
          <div className="space-y-1">
            <div className="font-bold text-lg text-gray-900 dark:text-white">
              {formatPrice(discountPrice)}
            </div>
            {product.discountPercentage > 0 && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </div>
            )}
          </div>
        );
      }
      case 'discount':
        return product.discountPercentage > 0 ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            -{product.discountPercentage.toFixed(0)}%
          </span>
        ) : (
          <Minus className="h-4 w-4 text-gray-400 mx-auto" />
        );
      case 'rating':
        return (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.rating.toFixed(1)}
            </span>
          </div>
        );
      case 'brand':
        return (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {product.brand}
          </span>
        );
      case 'category':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {product.category}
          </span>
        );
      case 'stock':
        return (
          <div className="flex items-center justify-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {product.stock} in stock
                </span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Out of stock
                </span>
              </>
            )}
          </div>
        );
      case 'description':
        return (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 text-left">
            {product.description}
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Product Comparison
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comparing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="flex-1 overflow-auto p-6">
              <div className="min-w-max">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700 z-10">
                        Feature
                      </th>
                      {products.map((product, index) => (
                        <th
                          key={product.id}
                          className="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700 min-w-[280px]"
                        >
                          Product {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, rowIndex) => (
                      <motion.tr
                        key={row.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIndex * 0.05 }}
                        className={`
                          ${rowIndex % 2 === 0 
                            ? 'bg-gray-50 dark:bg-gray-700/30' 
                            : 'bg-white dark:bg-gray-800'
                          }
                        `}
                      >
                        <td className="sticky left-0 bg-inherit px-4 py-4 font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 z-10">
                          {row.label}
                        </td>
                        {products.map((product) => (
                          <td
                            key={product.id}
                            className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700"
                          >
                            {renderCell(product, row.key)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-wrap gap-3 justify-end">
                {products.map((product) => (
                  <div key={product.id} className="flex gap-2">
                    <Button
                      onClick={() => {
                        navigate(`/products/${product.id}`);
                        onClose();
                      }}
                      variant="outline"
                      size="sm"
                      leftIcon={<ExternalLink className="h-4 w-4" />}
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => {
                        addItemToCart(product);
                      }}
                      disabled={product.stock === 0}
                      size="sm"
                      leftIcon={<ShoppingCart className="h-4 w-4" />}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Comparison Manager Component
interface ComparisonManagerProps {
  selectedProducts: Product[];
  onRemove: (productId: number) => void;
  onCompare: () => void;
  maxProducts?: number;
}

export const ComparisonManager: React.FC<ComparisonManagerProps> = ({
  selectedProducts,
  onRemove,
  onCompare,
  maxProducts = 4,
}) => {
  if (selectedProducts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 px-6 py-3"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compare ({selectedProducts.length}/{maxProducts})
            </span>
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="relative group"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                />
                <button
                  onClick={() => onRemove(product.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <Button
            onClick={onCompare}
            disabled={selectedProducts.length < 2}
            size="sm"
          >
            Compare Now
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductComparison;
