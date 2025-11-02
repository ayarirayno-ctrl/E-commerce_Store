import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component
 * Features:
 * - Lazy loading with Intersection Observer
 * - WebP format with automatic fallback
 * - Placeholder while loading
 * - Error fallback
 * - Progressive image loading
 * - Responsive images with srcset
 */
const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==',
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check WebP support on mount
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        const result = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        setSupportsWebP(result);
      } else {
        setSupportsWebP(false);
      }
    };
    
    checkWebPSupport();
  }, []);

  // Convert to WebP format if supported
  const getOptimizedUrl = useCallback((url: string): string => {
    if (supportsWebP && url.includes('unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('fm', 'webp');
      return urlObj.toString();
    }
    return url;
  }, [supportsWebP]);

  useEffect(() => {
    // Wait for WebP support check
    if (supportsWebP === null) return;

    // If eager loading, load immediately
    if (loading === 'eager') {
      setImageSrc(getOptimizedUrl(src));
      return;
    }

    // Lazy loading with Intersection Observer
    let imgElement: HTMLImageElement | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(getOptimizedUrl(src));
            if (imgElement) {
              observer.unobserve(imgElement);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      imgElement = imgRef.current;
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src, loading, supportsWebP, getOptimizedUrl]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    // Fallback to placeholder
    setImageSrc(placeholder);
    onError?.();
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string): string => {
    // If it's a data URL or external CDN already optimized, skip
    if (baseSrc.startsWith('data:') || baseSrc.includes('unsplash')) {
      return '';
    }

    // For local images, we could generate different sizes
    // This is a placeholder - you'd implement actual resizing logic
    return `${baseSrc}?w=400 400w, ${baseSrc}?w=800 800w, ${baseSrc}?w=1200 1200w`;
  };

  const srcSet = generateSrcSet(src);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      srcSet={srcSet || undefined}
      sizes={width ? `${width}px` : '100vw'}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={cn(
        'transition-opacity duration-300',
        !isLoaded && imageSrc !== placeholder && 'opacity-0 blur-sm',
        (isLoaded || imageSrc === placeholder) && 'opacity-100',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default OptimizedImage;
