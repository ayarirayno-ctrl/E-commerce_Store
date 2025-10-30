import { Star } from 'lucide-react';
import type { ReviewStats } from '../../types/product';
import { cn } from '../../utils/cn';

interface RatingSummaryProps {
  stats: ReviewStats;
  className?: string;
}

export const RatingSummary = ({ stats, className }: RatingSummaryProps) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  const getRatingPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-6 h-6',
                  i < Math.floor(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-300'
                )}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution] || 0;
            const percentage = getRatingPercentage(count);

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                
                <div className="flex-1 relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        rating >= 4 ? 'bg-green-500' :
                        rating === 3 ? 'bg-yellow-500' :
                        'bg-red-500'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
