import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const value = index + 1;
        const isFilled = value <= Math.floor(rating);
        const isHalf = value === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={cn(
              'relative transition-all duration-200',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
            aria-label={`Rate ${value} out of ${maxRating}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-200',
                isFilled && 'fill-yellow-400 text-yellow-400',
                isHalf && 'fill-yellow-400 text-yellow-400',
                !isFilled && !isHalf && 'fill-gray-200 text-gray-300'
              )}
            />
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star
                  className={cn(
                    sizeClasses[size],
                    'fill-yellow-400 text-yellow-400'
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
