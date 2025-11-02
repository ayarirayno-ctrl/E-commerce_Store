import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SwipeableItemProps {
  onDelete?: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant item swipeable pour supprimer/éditer
 * Swipe left: affiche bouton delete
 * Swipe right: affiche bouton edit (optionnel)
 */
export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  onDelete,
  onEdit,
  children,
  className = '',
}) => {
  const [swipeX, setSwipeX] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Limiter le swipe entre -100 et 100
    const newSwipeX = Math.max(-100, Math.min(100, diff));
    setSwipeX(newSwipeX);
  };

  const handleTouchEnd = () => {
    // Si swipe > 50px, garder ouvert, sinon fermer
    if (swipeX < -50) {
      setSwipeX(-80); // Position delete visible
    } else if (swipeX > 50) {
      setSwipeX(80); // Position edit visible (si existe)
    } else {
      setSwipeX(0); // Fermer
    }
  };

  const handleDelete = () => {
    onDelete?.();
    setSwipeX(0);
  };

  const handleEdit = () => {
    onEdit?.();
    setSwipeX(0);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Actions Background */}
      <div className="absolute inset-y-0 right-0 flex items-center">
        {onDelete && (
          <button
            onClick={handleDelete}
            className="h-full px-6 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            style={{ transform: `translateX(${swipeX < 0 ? 0 : 100}px)` }}
          >
            <X className="h-5 w-5" />
            <span className="ml-2 font-medium">Delete</span>
          </button>
        )}
      </div>

      {onEdit && (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={handleEdit}
            className="h-full px-6 bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
            style={{ transform: `translateX(${swipeX > 0 ? 0 : -100}px)` }}
          >
            <span className="mr-2 font-medium">Edit</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div
        className="relative bg-white dark:bg-gray-800 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};
