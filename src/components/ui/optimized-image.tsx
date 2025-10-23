"use client";

// Client-side ImageKit configuration
const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  transformation?: Array<{
    [key: string]: string | number;
  }>;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 400,
  className = '',
  quality = 80,
  loading = 'lazy',
  transformation = []
}: OptimizedImageProps) {
  // Skip blob URLs (temporary preview URLs)
  if (src.startsWith('blob:')) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }
  
  // Check if ImageKit is configured and if the image is from ImageKit
  const isImageKitUrl = src.includes('ik.imagekit.io');
  const isImageKitConfigured = imagekitConfig.urlEndpoint && imagekitConfig.publicKey;
  
  if (!isImageKitUrl || !isImageKitConfigured) {
    // Fallback to regular img tag for non-ImageKit images or when ImageKit is not configured
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
      />
    );
  }

  // Extract the path from ImageKit URL
  const imagePath = src.replace(imagekitConfig.urlEndpoint, '').replace(/^\//, '');

  // Create optimized ImageKit URL with transformations
  const transformParams = `tr:w-${width},h-${height},q-${quality},f-auto,c-maintain_ratio`;
  const optimizedUrl = `${imagekitConfig.urlEndpoint}/${transformParams}/${imagePath}`;

  return (
    <img
      src={optimizedUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
    />
  );
}
