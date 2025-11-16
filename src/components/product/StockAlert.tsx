import React from 'react';
import { AlertCircle, Package, TrendingUp } from 'lucide-react';

interface StockAlertProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

const StockAlert: React.FC<StockAlertProps> = ({ 
  stock, 
  lowStockThreshold = 10,
  className = '' 
}) => {
  // Out of stock
  if (stock === 0) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <span className="text-sm font-medium text-red-700 dark:text-red-300">
          Out of Stock
        </span>
      </div>
    );
  }

  // Low stock warning
  if (stock <= lowStockThreshold) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg ${className}`}>
        <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 animate-pulse" />
        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
          Only {stock} left in stock - Order soon!
        </span>
      </div>
    );
  }

  // In stock
  return (
    <div className={`flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg ${className}`}>
      <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
      <span className="text-sm font-medium text-green-700 dark:text-green-300">
        In Stock ({stock} available)
      </span>
    </div>
  );
};

// Badge variant for compact display
export const StockBadge: React.FC<{ stock: number; lowStockThreshold?: number }> = ({ 
  stock, 
  lowStockThreshold = 10 
}) => {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded">
        <AlertCircle className="h-3 w-3" />
        Out of Stock
      </span>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded animate-pulse">
        <TrendingUp className="h-3 w-3" />
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">
      <Package className="h-3 w-3" />
      In Stock
    </span>
  );
};

export default StockAlert;
