import { Tag, Calendar, TrendingDown, Gift } from 'lucide-react';
import { useAppSelector } from '../../store';
import { selectActivePromoCodes } from '../../store/slices/promoCodesSlice';
import type { PromoCode } from '../../types/promoCode';

interface AvailablePromoCodesProps {
  onSelect?: (code: string) => void;
  compact?: boolean;
  limit?: number;
}

export function AvailablePromoCodes({ 
  onSelect, 
  compact = false, 
  limit 
}: AvailablePromoCodesProps) {
  const activeCodes = useAppSelector(selectActivePromoCodes);
  const displayCodes = limit ? activeCodes.slice(0, limit) : activeCodes;

  if (displayCodes.length === 0) {
    return null;
  }

  const getDiscountText = (promo: PromoCode) => {
    switch (promo.discountType) {
      case 'percentage':
        return `${promo.discountValue}% OFF`;
      case 'fixed':
        return `$${promo.discountValue} OFF`;
      case 'freeShipping':
        return 'FREE SHIPPING';
      case 'buyXGetY':
        return `Buy ${promo.buyQuantity} Get ${promo.getQuantity}`;
      default:
        return 'DISCOUNT';
    }
  };

  const getExpiryText = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 1) return 'Expires today';
    if (daysLeft === 1) return 'Expires tomorrow';
    if (daysLeft < 7) return `${daysLeft} days left`;
    return end.toLocaleDateString();
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Gift className="w-4 h-4 inline mr-2" />
          Available Offers
        </p>
        {displayCodes.map((promo) => (
          <button
            key={promo.id}
            onClick={() => onSelect?.(promo.code)}
            className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {promo.code}
              </span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                {getDiscountText(promo)}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {promo.description}
            </p>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {displayCodes.map((promo) => (
        <div
          key={promo.id}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-[2px] hover:shadow-xl transition-shadow"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 h-full">
            {/* Discount Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm">
                {getDiscountText(promo)}
              </div>
              <TrendingDown className="w-5 h-5 text-green-500" />
            </div>

            {/* Code */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Code</span>
              </div>
              <div className="font-mono font-bold text-lg text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                {promo.code}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {promo.description}
            </p>

            {/* Details */}
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
              {promo.minOrderValue && (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>Min. order: ${promo.minOrderValue}</span>
                </div>
              )}
              {promo.maxDiscount && (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span>Max. discount: ${promo.maxDiscount}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{getExpiryText(promo.endDate)}</span>
              </div>
            </div>

            {/* Apply Button */}
            {onSelect && (
              <button
                onClick={() => onSelect(promo.code)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-shadow"
              >
                Apply Code
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
