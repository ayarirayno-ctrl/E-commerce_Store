import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';

interface ProductComparatorProps {
  maxProducts?: number;
}

export const useProductComparator = () => {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('compareProducts');
    if (saved) {
      try {
        setCompareProducts(JSON.parse(saved));
      } catch (e) {
        // Ignore invalid data
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('compareProducts', JSON.stringify(compareProducts));
  }, [compareProducts]);

  const addToCompare = (product: Product) => {
    if (compareProducts.length >= 4) {
      alert('Maximum 4 products can be compared at once');
      return;
    }
    if (!compareProducts.find(p => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
    }
  };

  const removeFromCompare = (productId: number) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const isInCompare = (productId: number) => {
    return compareProducts.some(p => p.id === productId);
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return {
    compareProducts,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    toggleCompare,
    isOpen,
    setIsOpen,
  };
};

export const ProductComparator: React.FC<ProductComparatorProps> = ({ maxProducts = 4 }) => {
  const {
    compareProducts,
    removeFromCompare,
    clearCompare,
    isOpen,
    setIsOpen,
  } = useProductComparator();
  
  const navigate = useNavigate();

  const specs = [
    { label: 'Price', key: 'price' },
    { label: 'Rating', key: 'rating' },
    { label: 'Brand', key: 'brand' },
    { label: 'Category', key: 'category' },
    { label: 'Stock', key: 'stock' },
    { label: 'Discount', key: 'discountPercentage' },
    { label: 'Colors Available', key: 'availableColors' },
    { label: 'Sizes Available', key: 'availableSizes' },
    { label: 'Total Variants', key: 'variants' },
  ];

  const getSpecValue = (product: Product, key: string) => {
    const value = product[key as keyof Product];
    
    switch (key) {
      case 'price':
        return formatPrice(value as number);
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{typeof value === 'number' ? value : 'N/A'}</span>
          </div>
        );
      case 'stock':
        return (
          <span className={value === 0 ? 'text-red-600' : 'text-green-600'}>
            {value === 0 ? 'Out of Stock' : `${value} in stock`}
          </span>
        );
      case 'discountPercentage':
        return value ? `${value}% OFF` : 'No discount';
      case 'availableColors':
        if (Array.isArray(value)) {
          return `${value.length} color${value.length !== 1 ? 's' : ''}`;
        }
        return 'N/A';
      case 'availableSizes':
        if (Array.isArray(value)) {
          return `${value.length} size${value.length !== 1 ? 's' : ''}`;
        }
        return 'N/A';
      case 'variants':
        if (Array.isArray(value)) {
          return `${value.length} variant${value.length !== 1 ? 's' : ''}`;
        }
        return 'N/A';
      default:
        // Gérer les tableaux et objets
        if (Array.isArray(value)) {
          return `${value.length} item${value.length !== 1 ? 's' : ''}`;
        }
        if (typeof value === 'object' && value !== null) {
          return 'Complex data';
        }
        return value?.toString() || 'N/A';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Product Comparison</h2>
                <p className="text-primary-100 mt-1">
                  Compare up to {maxProducts} products side by side
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
            {compareProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No products to compare
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add products to comparison by clicking the compare button on product cards
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-gray-100 dark:bg-gray-700 p-4 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                        Feature
                      </th>
                      {compareProducts.map((product) => (
                        <th
                          key={product.id}
                          className="p-4 border-b border-gray-300 dark:border-gray-600 min-w-[200px]"
                        >
                          <div className="space-y-3">
                            {/* Product Image */}
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCompare(product.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {/* Product Title */}
                            <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                              {product.title}
                            </h4>
                          </div>
                        </th>
                      ))}
                      {/* Empty slots */}
                      {Array.from({ length: maxProducts - compareProducts.length }).map((_, i) => (
                        <th
                          key={`empty-${i}`}
                          className="p-4 border-b border-gray-300 dark:border-gray-600 min-w-[200px]"
                        >
                          <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                            <div className="text-center">
                              <Plus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Add product
                              </p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((spec) => (
                      <tr key={spec.key} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="sticky left-0 bg-gray-50 dark:bg-gray-800 p-4 font-medium text-gray-700 dark:text-gray-300">
                          {spec.label}
                        </td>
                        {compareProducts.map((product) => (
                          <td
                            key={product.id}
                            className="p-4 text-center text-gray-900 dark:text-white"
                          >
                            {getSpecValue(product, spec.key)}
                          </td>
                        ))}
                        {Array.from({ length: maxProducts - compareProducts.length }).map((_, i) => (
                          <td key={`empty-${i}`} className="p-4 text-center text-gray-400">
                            -
                          </td>
                        ))}
                      </tr>
                    ))}
                    
                    {/* Description Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="sticky left-0 bg-gray-50 dark:bg-gray-800 p-4 font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </td>
                      {compareProducts.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <p className="line-clamp-3">{product.description}</p>
                        </td>
                      ))}
                      {Array.from({ length: maxProducts - compareProducts.length }).map((_, i) => (
                        <td key={`empty-${i}`} className="p-4 text-center text-gray-400">
                          -
                        </td>
                      ))}
                    </tr>

                    {/* Action Buttons Row */}
                    <tr>
                      <td className="sticky left-0 bg-gray-50 dark:bg-gray-800 p-4 font-medium text-gray-700 dark:text-gray-300">
                        Actions
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-4">
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                navigate(`/products/${product.id}`);
                                setIsOpen(false);
                              }}
                              leftIcon={<ExternalLink className="h-4 w-4" />}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<ShoppingCart className="h-4 w-4" />}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: maxProducts - compareProducts.length }).map((_, i) => (
                        <td key={`empty-${i}`} className="p-4" />
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Comparing {compareProducts.length} of {maxProducts} products
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearCompare}>
                Clear All
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Compare Button Component for ProductCard
export const CompareButton: React.FC<{ 
  product: Product;
  className?: string;
}> = ({ product, className = '' }) => {
  const { isInCompare, toggleCompare } = useProductComparator();
  const inCompare = isInCompare(product.id);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(product);
      }}
      className={`
        p-2 rounded-lg transition-all
        ${inCompare
          ? 'bg-primary-600 text-white'
          : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
        }
        ${className}
      `}
      title={inCompare ? 'Remove from compare' : 'Add to compare'}
    >
      {inCompare ? (
        <Check className="h-4 w-4" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </motion.button>
  );
};

// Floating Compare Bar
export const CompareFloatingBar: React.FC = () => {
  const { compareProducts, setIsOpen } = useProductComparator();

  if (compareProducts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all"
        >
          <div className="flex -space-x-2">
            {compareProducts.slice(0, 3).map((product) => (
              <img
                key={product.id}
                src={product.thumbnail}
                alt={product.title}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <span className="font-semibold">
            Compare ({compareProducts.length})
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductComparator;
