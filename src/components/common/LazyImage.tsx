import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage Component with WebP support and Intersection Observer
 * 
 * Features:
 * - Lazy loading using Intersection Observer API
 * - Automatic WebP format detection and fallback
 * - Blur placeholder while loading
 * - Error handling with fallback image
 * - Performance optimized with proper cleanup
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3C/svg%3E',
  onLoad,
  onError,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Convert image URL to WebP format if supported
  const getWebPUrl = (url: string): string => {
    // Check if browser supports WebP
    const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (!supportsWebP) return url;
    
    // For Unsplash images, add fm=webp parameter
    if (url.includes('unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('fm', 'webp');
      return urlObj.toString();
    }
    
    return url;
  };

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load the image when it enters viewport
            const webpSrc = getWebPUrl(src);
            setImageSrc(webpSrc);
            observer.unobserve(imgElement);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgElement);

    // Cleanup
    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    // Fallback to placeholder on error
    setImageSrc(placeholder);
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy" // Native lazy loading as fallback
      className={`${className} ${
        imageLoaded ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300 ${
        imageError ? 'grayscale' : ''
      }`}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        backgroundColor: '#f0f0f0',
        ...(imageLoaded ? {} : { filter: 'blur(10px)' }),
      }}
    />
  );
}

/**
 * Hook for preloading critical images
 */
export function useImagePreload(urls: string[]) {
  useEffect(() => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}

/**
 * Hook to detect WebP support
 */
export function useWebPSupport() {
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        const result = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        setSupportsWebP(result);
      }
    };

    checkWebPSupport();
  }, []);

  return supportsWebP;
}
