import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, X } from 'lucide-react';
import { usePinchZoom } from '../../hooks/useGestures';

interface PinchZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  maxZoom?: number;
  minZoom?: number;
}

/**
 * Composant image avec pinch-to-zoom
 * Double-tap pour zoomer
 * Pinch pour zoomer/dézoomer
 */
export const PinchZoomImage: React.FC<PinchZoomImageProps> = ({
  src,
  alt,
  className = '',
  maxZoom = 3,
  minZoom = 1,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const startPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    onTouchStart: handlePinchStart,
    onTouchMove: handlePinchMove,
    onTouchEnd: handlePinchEnd,
    isPinching,
  } = usePinchZoom({
    onPinchMove: (newScale) => {
      const finalScale = Math.max(minZoom, Math.min(maxZoom, newScale));
      setScale(finalScale);
    },
    onPinchEnd: (finalScale) => {
      const clampedScale = Math.max(minZoom, Math.min(maxZoom, finalScale));
      setScale(clampedScale);
    },
  });

  // Double tap to zoom
  const handleDoubleTap = (_e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2);
      }
    }
    setLastTap(now);
  };

  // Pan/Drag when zoomed
  const handleTouchStartDrag = (e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      startPos.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
    handlePinchStart(e.nativeEvent);
  };

  const handleTouchMoveDrag = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - startPos.current.x,
        y: e.touches[0].clientY - startPos.current.y,
      });
    }
    handlePinchMove(e.nativeEvent);
  };

  const handleTouchEndDrag = (e: React.TouchEvent) => {
    setIsDragging(false);
    handlePinchEnd(e.nativeEvent);
    handleDoubleTap(e);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(maxZoom, prev + 0.5));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(minZoom, prev - 0.5);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Zoom Controls */}
      {scale > 1 && (
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <button
            onClick={handleReset}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Reset zoom"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
        <button
          onClick={handleZoomOut}
          disabled={scale <= minZoom}
          className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-30"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={handleZoomIn}
          disabled={scale >= maxZoom}
          className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-30"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain select-none transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          cursor: scale > 1 ? 'move' : 'zoom-in',
        }}
        onTouchStart={handleTouchStartDrag}
        onTouchMove={handleTouchMoveDrag}
        onTouchEnd={handleTouchEndDrag}
        draggable={false}
      />

      {/* Zoom indicator */}
      {isPinching && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
};
