import { useState } from 'react';
import { StarRating } from './StarRating';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { cn } from '../../utils/cn';

interface ReviewFormProps {
  productId: number;
  onSubmit: (data: {
    rating: 1 | 2 | 3 | 4 | 5;
    title?: string;
    comment: string;
  }) => void;
  onCancel?: () => void;
  className?: string;
}

export const ReviewForm = ({
  onSubmit,
  onCancel,
  className,
}: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const validate = () => {
    const newErrors: { rating?: string; comment?: string } = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write a review';
    } else if (comment.length > 500) {
      newErrors.comment = 'Review must be 500 characters or less';
    } else if (comment.length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      rating: rating as 1 | 2 | 3 | 4 | 5,
      title: title.trim() || undefined,
      comment: comment.trim(),
    });

    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
    setErrors({});
  };

  const getRatingLabel = (value: number) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return labels[value as keyof typeof labels] || '';
  };

  return (
    <form onSubmit={handleSubmit} className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-4">
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onChange={setRating}
          />
          {rating > 0 && (
            <span className="text-sm font-medium text-gray-600">
              {getRatingLabel(rating)}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Title (Optional) */}
      <div className="mb-6">
        <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title (Optional)
        </label>
        <Input
          id="review-title"
          type="text"
          placeholder="Sum up your experience in a few words"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="review-comment"
          rows={5}
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          className={cn(
            'w-full px-4 py-3 rounded-lg border transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            errors.comment
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-primary-500'
          )}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.comment ? (
            <p className="text-sm text-red-600">{errors.comment}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Minimum 10 characters
            </p>
          )}
          <span className="text-sm text-gray-500">
            {comment.length}/500
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Button type="submit" className="flex-1">
          Submit Review
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
