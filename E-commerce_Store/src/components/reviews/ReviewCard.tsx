import { ThumbsUp, BadgeCheck, Trash2 } from 'lucide-react';
import { StarRating } from './StarRating';
import type { Review } from '../../types/product';
import { cn } from '../../utils/cn';
import OptimizedImage from '../common/OptimizedImage';

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onMarkHelpful?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  isHelpful?: boolean;
  className?: string;
}

export const ReviewCard = ({
  review,
  currentUserId,
  onMarkHelpful,
  onDelete,
  isHelpful,
  className,
}: ReviewCardProps) => {
  const isOwner = currentUserId === review.userId;
  const reviewDate = new Date(review.createdAt);
  const formattedDate = reviewDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 font-semibold text-sm">
                {review.userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{review.userName}</span>
              {review.verifiedPurchase && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <BadgeCheck className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Delete Button (if owner) */}
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      )}

      {/* Comment */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.images.map((image, index) => (
            <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
              <OptimizedImage
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        {/* Helpful Button */}
        {onMarkHelpful && (
          <button
            onClick={() => onMarkHelpful(review.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              isHelpful
                ? 'bg-primary-50 text-primary-600 border border-primary-200'
                : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
            )}
          >
            <ThumbsUp className={cn('w-4 h-4', isHelpful && 'fill-current')} />
            <span>Helpful</span>
            {review.helpfulCount > 0 && (
              <span className="font-semibold">({review.helpfulCount})</span>
            )}
          </button>
        )}

        {/* Updated Badge */}
        {review.updatedAt && (
          <span className="text-xs text-gray-500 italic">Edited</span>
        )}
      </div>
    </div>
  );
};
