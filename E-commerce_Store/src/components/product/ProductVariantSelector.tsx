import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ProductVariant } from '../../types';

interface ProductVariantSelectorProps {
  colors?: string[];
  colorHexes?: Record<string, string>; // Map color names to hex codes
  sizes?: string[];
  variants?: ProductVariant[];
  selectedColor?: string;
  selectedSize?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
  onVariantChange?: (variant: ProductVariant | null) => void;
}

const DEFAULT_COLORS: Record<string, string> = {
  Black: '#000000',
  White: '#FFFFFF',
  Red: '#EF4444',
  Blue: '#3B82F6',
  Green: '#10B981',
  Yellow: '#FBBF24',
  Purple: '#A855F7',
  Pink: '#EC4899',
  Gray: '#6B7280',
  Navy: '#1E40AF',
  Beige: '#D4A574',
  Brown: '#92400E',
};

export default function ProductVariantSelector({
  colors,
  colorHexes,
  sizes,
  variants,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const [internalSelectedColor, setInternalSelectedColor] = useState<string | undefined>(selectedColor);
  const [internalSelectedSize, setInternalSelectedSize] = useState<string | undefined>(selectedSize);

  const handleColorSelect = (color: string) => {
    setInternalSelectedColor(color);
    onColorChange?.(color);
    
    // Find matching variant
    if (variants) {
      const variant = variants.find(
        v => v.color === color && (!internalSelectedSize || v.size === internalSelectedSize)
      );
      onVariantChange?.(variant || null);
    }
  };

  const handleSizeSelect = (size: string) => {
    setInternalSelectedSize(size);
    onSizeChange?.(size);
    
    // Find matching variant
    if (variants) {
      const variant = variants.find(
        v => v.size === size && (!internalSelectedColor || v.color === internalSelectedColor)
      );
      onVariantChange?.(variant || null);
    }
  };

  const getColorHex = (colorName: string): string => {
    return colorHexes?.[colorName] || DEFAULT_COLORS[colorName] || '#CCCCCC';
  };

  const isColorAvailable = (color: string): boolean => {
    if (!variants) return true;
    return variants.some(v => v.color === color && v.stock > 0);
  };

  const isSizeAvailable = (size: string): boolean => {
    if (!variants) return true;
    return variants.some(v => v.size === size && v.stock > 0);
  };

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {colors && colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Color
            </label>
            {internalSelectedColor && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {internalSelectedColor}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = internalSelectedColor === color;
              const isAvailable = isColorAvailable(color);
              const hex = getColorHex(color);
              
              return (
                <motion.button
                  key={color}
                  whileHover={isAvailable ? { scale: 1.1 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  onClick={() => isAvailable && handleColorSelect(color)}
                  disabled={!isAvailable}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    isSelected
                      ? 'border-primary-600 dark:border-primary-400 ring-2 ring-primary-200 dark:ring-primary-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  } ${
                    !isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={color}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className={`w-5 h-5 ${
                          hex === '#FFFFFF' || hex === '#FBBF24'
                            ? 'text-gray-900'
                            : 'text-white'
                        }`}
                      />
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-px h-full bg-red-500 rotate-45" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes && sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Size
            </label>
            {internalSelectedSize && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {internalSelectedSize}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = internalSelectedSize === size;
              const isAvailable = isSizeAvailable(size);
              
              return (
                <motion.button
                  key={size}
                  whileHover={isAvailable ? { scale: 1.05 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`px-6 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  } ${
                    !isAvailable
                      ? 'opacity-40 cursor-not-allowed line-through'
                      : 'cursor-pointer'
                  }`}
                >
                  {size}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Information */}
      {variants && internalSelectedColor && internalSelectedSize && (
        <div>
          {(() => {
            const selectedVariant = variants.find(
              v => v.color === internalSelectedColor && v.size === internalSelectedSize
            );
            
            if (!selectedVariant) {
              return (
                <p className="text-sm text-red-600 dark:text-red-400">
                  This combination is not available
                </p>
              );
            }
            
            if (selectedVariant.stock === 0) {
              return (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Out of stock
                </p>
              );
            }
            
            if (selectedVariant.stock < 10) {
              return (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Only {selectedVariant.stock} left in stock!
                </p>
              );
            }
            
            return (
              <p className="text-sm text-green-600 dark:text-green-400">
                In stock ({selectedVariant.stock} available)
              </p>
            );
          })()}
        </div>
      )}
    </div>
  );
}
