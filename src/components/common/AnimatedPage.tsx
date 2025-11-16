import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPageProps {
  children: React.ReactNode;
}

/**
 * AnimatedPage Component
 * Wraps page content with entrance/exit animations
 */
const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeIn Component
 * Simple fade-in animation
 */
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}> = ({ children, delay = 0, duration = 0.5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * SlideIn Component
 * Slide-in from different directions
 */
export const SlideIn: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}> = ({ children, direction = 'up', delay = 0 }) => {
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScaleIn Component
 * Scale and fade in animation
 */
export const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger Children Component
 * Stagger animation for lists
 */
export const StaggerChildren: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem Component
 * Individual item in staggered list
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * PressAnimation Component
 * Button press effect
 */
export const PressAnimation: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * HoverFloat Component
 * Float up on hover
 */
export const HoverFloat: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * RotateIn Component
 * Rotate and fade in
 */
export const RotateIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Modal Animation Component
 * Animation for modals/dialogs
 */
export const ModalAnimation: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
}> = ({ children, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Cart Flying Animation
 * Item flies to cart icon when added
 */
export const CartFlyingItem: React.FC<{
  isAnimating: boolean;
  startPosition?: { x: number; y: number };
  onComplete: () => void;
}> = ({ isAnimating, startPosition, onComplete }) => {
  if (!isAnimating || !startPosition) return null;

  return (
    <motion.div
      initial={{
        position: 'fixed',
        top: startPosition.y,
        left: startPosition.x,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        top: 20,
        right: 20,
        opacity: 0,
        scale: 0.3,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
      onAnimationComplete={onComplete}
      className="z-50 pointer-events-none"
    >
      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white">
        🛒
      </div>
    </motion.div>
  );
};

export default AnimatedPage;
