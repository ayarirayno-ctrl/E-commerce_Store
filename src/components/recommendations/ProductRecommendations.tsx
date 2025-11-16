import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types/product';
import ProductCard from '../product/ProductCard';
import { TrendingUp, Heart, Sparkles } from 'lucide-react';

interface ProductRecommendationsProps {
  title: string;
  products: Product[];
  type?: 'similar' | 'trending' | 'personalized';
  loading?: boolean;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  title,
  products,
  type = 'similar',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            {getIcon(type)}
            {title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {getIcon(type)}
              {title}
            </h2>
            {type === 'trending' && (
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Popular this week
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const getIcon = (type: 'similar' | 'trending' | 'personalized') => {
  switch (type) {
    case 'trending':
      return <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />;
    case 'personalized':
      return <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />;
    case 'similar':
    default:
      return <Heart className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />;
  }
};

export default ProductRecommendations;
