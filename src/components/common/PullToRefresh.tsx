import React from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '../../hooks/useGestures';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

/**
 * Composant Pull-to-Refresh
 * Tire vers le bas pour actualiser le contenu
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
}) => {
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    pullDistance,
    isRefreshing,
    refreshThreshold,
  } = usePullToRefresh({ onRefresh }, threshold);

  const progress = Math.min(100, (pullDistance / refreshThreshold) * 100);
  const shouldTrigger = pullDistance >= refreshThreshold;

  return (
    <div
      className="relative"
      onTouchStart={onTouchStart as unknown as React.TouchEventHandler}
      onTouchMove={onTouchMove as unknown as React.TouchEventHandler}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary-50 dark:bg-primary-900/20 overflow-hidden transition-all duration-200"
        style={{
          height: `${Math.min(pullDistance, refreshThreshold)}px`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div className="flex flex-col items-center space-y-2 py-4">
          <RefreshCw
            className={`h-6 w-6 text-primary-600 dark:text-primary-400 transition-transform ${
              isRefreshing ? 'animate-spin' : ''
            } ${shouldTrigger && !isRefreshing ? 'rotate-180' : ''}`}
            style={{
              transform: isRefreshing ? '' : `rotate(${progress * 3.6}deg)`,
            }}
          />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {isRefreshing
              ? 'Refreshing...'
              : shouldTrigger
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${Math.min(pullDistance, refreshThreshold)}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
