import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart, Heart, AlertCircle, X, Package } from 'lucide-react';

interface FeedbackToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  type,
  message,
  description,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Package className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
  };

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full"
        >
          <div className={`${colors[type]} border rounded-lg shadow-lg overflow-hidden backdrop-blur-sm`}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="flex-shrink-0"
                >
                  {icons[type]}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{message}</p>
                  {description && (
                    <p className="text-xs mt-1 opacity-90">{description}</p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              className={`h-1 ${progressColors[type]}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Cart Bounce Animation Component
export const CartBounceIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1.3, 0.9, 1.1, 1],
        rotate: [0, -10, 10, -5, 0],
      } : {}}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <ShoppingCart className="h-6 w-6" />
    </motion.div>
  );
};

// Wishlist Heart Animation
export const WishlistHeartIcon: React.FC<{ isActive: boolean; isFavorite: boolean }> = ({ 
  isActive, 
  isFavorite 
}) => {
  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1.5, 1],
      } : {}}
      transition={{ duration: 0.3 }}
    >
      <Heart 
        className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
      />
    </motion.div>
  );
};

// Floating Success Indicator
export const FloatingSuccessIndicator: React.FC<{ 
  isVisible: boolean;
  icon?: React.ReactNode;
  text?: string;
}> = ({ isVisible, icon, text = 'Added!' }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: -30, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
        >
          <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            {icon || <Check className="h-5 w-5" />}
            <span className="font-semibold text-sm">{text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Pulse Animation Wrapper
export const PulseWrapper: React.FC<{ 
  children: React.ReactNode;
  isActive: boolean;
  color?: string;
}> = ({ children, isActive, color = 'primary-500' }) => {
  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        {isActive && (
          <>
            <motion.span
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className={`absolute inset-0 rounded-full bg-${color}`}
            />
            <motion.span
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
              className={`absolute inset-0 rounded-full bg-${color}`}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackToast;
