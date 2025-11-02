import { useRef, useState, useCallback } from 'react';

/**
 * Hook pour détecter les gestures de swipe (glissement)
 */

export interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  isSwiping: boolean;
}

export const useSwipeGesture = (
  callbacks: SwipeCallbacks,
  minSwipeDistance: number = 50,
  maxSwipeTime: number = 300
) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwiping: false,
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isSwiping: true,
    });
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!swipeState.isSwiping) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - swipeState.startX;
    const deltaY = endY - swipeState.startY;
    const deltaTime = endTime - swipeState.startTime;

    // Vérifier si le swipe est assez rapide et long
    if (deltaTime > maxSwipeTime) {
      setSwipeState(prev => ({ ...prev, isSwiping: false }));
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Déterminer la direction dominante
    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      // Swipe horizontal
      if (deltaX > 0) {
        callbacks.onSwipeRight?.();
      } else {
        callbacks.onSwipeLeft?.();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
      // Swipe vertical
      if (deltaY > 0) {
        callbacks.onSwipeDown?.();
      } else {
        callbacks.onSwipeUp?.();
      }
    }

    setSwipeState(prev => ({ ...prev, isSwiping: false }));
  }, [swipeState, callbacks, minSwipeDistance, maxSwipeTime]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    isSwiping: swipeState.isSwiping,
  };
};

/**
 * Hook pour détecter le pinch-to-zoom
 */

export interface PinchCallbacks {
  onPinchStart?: () => void;
  onPinchMove?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
}

export const usePinchZoom = (callbacks: PinchCallbacks) => {
  const [isPinching, setIsPinching] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
      setIsPinching(true);
      callbacks.onPinchStart?.();
    }
  }, [callbacks]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / initialDistance;
      setCurrentScale(scale);
      callbacks.onPinchMove?.(scale);
    }
  }, [isPinching, initialDistance, callbacks]);

  const handleTouchEnd = useCallback((_e: TouchEvent) => {
    if (isPinching) {
      setIsPinching(false);
      callbacks.onPinchEnd?.(currentScale);
      setCurrentScale(1);
      setInitialDistance(0);
    }
  }, [isPinching, currentScale, callbacks]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isPinching,
    scale: currentScale,
  };
};

/**
 * Hook pour Pull-to-Refresh
 */

export interface PullToRefreshCallbacks {
  onRefresh: () => Promise<void>;
}

export const usePullToRefresh = (
  callbacks: PullToRefreshCallbacks,
  threshold: number = 80
) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Vérifier si on est en haut de la page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  }, [isPulling, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await callbacks.onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, callbacks]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isPulling,
    pullDistance,
    isRefreshing,
    refreshThreshold: threshold,
  };
};
