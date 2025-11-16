import { TrendingUp, Eye, DollarSign } from 'lucide-react';
import type { TopProduct } from '../../types/analytics';

interface TopProductsProps {
  products: TopProduct[];
  sortBy?: 'sales' | 'revenue' | 'views';
  limit?: number;
}

export function TopProducts({ products, sortBy = 'revenue', limit = 5 }: TopProductsProps) {
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'sales':
        return b.sales - a.sales;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  }).slice(0, limit);

  const getMaxValue = () => {
    return Math.max(...sortedProducts.map(p => {
      switch (sortBy) {
        case 'sales':
          return p.sales;
        case 'revenue':
          return p.revenue;
        case 'views':
          return p.views;
      }
    }));
  };

  const getValue = (product: TopProduct) => {
    switch (sortBy) {
      case 'sales':
        return product.sales;
      case 'revenue':
        return product.revenue;
      case 'views':
        return product.views;
    }
  };

  const formatValue = (value: number) => {
    if (sortBy === 'revenue') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const getIcon = () => {
    switch (sortBy) {
      case 'sales':
        return TrendingUp;
      case 'revenue':
        return DollarSign;
      case 'views':
        return Eye;
    }
  };

  const Icon = getIcon();
  const maxValue = getMaxValue();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-500" />
          Top Products by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
        </h3>
      </div>

      <div className="space-y-4">
        {sortedProducts.map((product, index) => {
          const value = getValue(product);
          const percentage = (value / maxValue) * 100;
          
          return (
            <div key={product.id} className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  #{index + 1}
                </span>
              </div>

              {/* Product Image */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
              </div>

              {/* Value & Bar */}
              <div className="flex-shrink-0 w-32">
                <div className="text-right mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatValue(value)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Sales</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {sortedProducts.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            ${sortedProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Views</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {sortedProducts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
