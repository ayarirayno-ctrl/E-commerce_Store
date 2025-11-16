import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Heart } from 'lucide-react';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bounce';
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 'md',
  text = 'Loading...',
  variant = 'spinner',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  // Spinner variant with rotating package icon
  const SpinnerVariant = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={sizeClasses[size]}
      >
        <Package className="w-full h-full text-primary-600" />
      </motion.div>
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-600 dark:text-gray-400 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  // Dots variant with bouncing dots
  const DotsVariant = () => {
    const dotVariants = {
      initial: { y: 0 },
      animate: {
        y: [-10, 0, -10],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      },
    };

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.2 }}
              className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-primary-600 rounded-full`}
            />
          ))}
        </div>
        {text && (
          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            {text}
          </p>
        )}
      </div>
    );
  };

  // Pulse variant with growing circles
  const PulseVariant = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${sizeClasses[size]} bg-primary-600 rounded-full absolute`}
        />
        <motion.div
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${sizeClasses[size]} bg-primary-400 rounded-full absolute`}
        />
        <ShoppingBag className="w-6 h-6 text-white relative z-10" />
      </div>
      {text && (
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  // Bounce variant with multiple icons
  const BounceVariant = () => {
    const icons = [Package, ShoppingBag, Heart];
    
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-3">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            >
              <Icon className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10'} text-primary-600`} />
            </motion.div>
          ))}
        </div>
        {text && (
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {text}
          </p>
        )}
      </div>
    );
  };

  const variants = {
    spinner: <SpinnerVariant />,
    dots: <DotsVariant />,
    pulse: <PulseVariant />,
    bounce: <BounceVariant />,
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      {variants[variant]}
    </div>
  );
};

// Skeleton Loader for cards
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        
        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
          ))}
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
};

// Page transition wrapper
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default LoadingAnimation;
