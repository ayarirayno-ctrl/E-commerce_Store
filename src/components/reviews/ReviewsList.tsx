import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import type { Review, ReviewFilters } from '../../types/product';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

interface ReviewsListProps {
  reviews: Review[];
  currentUserId?: string;
  filters: ReviewFilters;
  onFilterChange: (filters: ReviewFilters) => void;
  onMarkHelpful: (reviewId: string, userId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
  isHelpful: (review: Review, userId: string) => boolean;
  className?: string;
}

export const ReviewsList = ({
  reviews,
  currentUserId,
  filters,
  onFilterChange,
  onMarkHelpful,
  onDeleteReview,
  isHelpful,
  className,
}: ReviewsListProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'helpful', label: 'Most Helpful' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
  ] as const;

  const ratingOptions = [
    { value: undefined, label: 'All Ratings' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 2, label: '2 Stars' },
    { value: 1, label: '1 Star' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform',
              showFilters && 'rotate-180'
            )} />
          </Button>

          {/* Active Filters Count */}
          {(filters.rating || filters.verifiedOnly) && (
            <span className="text-sm text-gray-600">
              {[filters.rating, filters.verifiedOnly].filter(Boolean).length} active
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={filters.sortBy || 'recent'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as ReviewFilters['sortBy'] })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={filters.rating || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  rating: e.target.value ? Number(e.target.value) as 1 | 2 | 3 | 4 | 5 : undefined
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {ratingOptions.map(option => (
                  <option key={option.label} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified Purchase Filter */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly || false}
                  onChange={(e) => onFilterChange({
                    ...filters,
                    verifiedOnly: e.target.checked || undefined
                  })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Verified Purchases Only
                </span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.rating || filters.verifiedOnly) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange({ sortBy: filters.sortBy })}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Reviews Count */}
      <div className="text-sm text-gray-600">
        Showing {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No reviews found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onMarkHelpful={() => currentUserId && onMarkHelpful(review.id, currentUserId)}
              onDelete={onDeleteReview}
              isHelpful={currentUserId ? isHelpful(review, currentUserId) : false}
            />
          ))}
        </div>
      )}
    </div>
  );
};
