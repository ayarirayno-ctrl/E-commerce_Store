import React from 'react';

/**
 * ProductSkeleton Component
 * Loading placeholder for product cards
 */
const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="bg-gray-200 h-64 w-full"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * ProductListSkeleton Component
 * Grid of loading product cards
 */
export const ProductListSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

/**
 * ProductDetailSkeleton Component
 * Loading placeholder for product detail page
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        {/* Image column */}
        <div>
          <div className="bg-gray-200 rounded-lg h-96 w-full mb-4"></div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded h-20"></div>
            ))}
          </div>
        </div>
        
        {/* Details column */}
        <div className="space-y-4">
          {/* Brand */}
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          
          {/* Title */}
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          
          {/* Rating */}
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          
          {/* Price */}
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded w-12"></div>
          </div>
          
          {/* Additional info */}
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * CartItemSkeleton Component
 * Loading placeholder for cart items
 */
export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 animate-pulse">
      {/* Image */}
      <div className="bg-gray-200 rounded h-20 w-20 flex-shrink-0"></div>
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      
      {/* Actions */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
};

/**
 * ProfileSkeleton Component
 * Loading placeholder for profile page
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="container-custom py-8 animate-pulse">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gray-200 rounded-full h-20 w-20"></div>
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
          ))}
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded h-24"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * OrderSkeleton Component
 * Loading placeholder for orders
 */
export const OrderSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="bg-gray-200 rounded h-16 w-16"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 mt-4 border-t">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
