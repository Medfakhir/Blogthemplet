import ImageKit from 'imagekit';

// Check if all required environment variables are present
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

// Only validate server-side environment variables on the server
let imagekit: ImageKit | null = null;

if (typeof window === 'undefined') {
  // Server-side only - only initialize if all variables are present
  if (publicKey && privateKey && urlEndpoint) {
    try {
      // Server-side ImageKit instance (with private key)
      imagekit = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint,
      });
    } catch (error) {
      console.warn('ImageKit initialization failed:', error);
    }
  } else {
    console.warn('ImageKit environment variables not configured. Image upload features will be disabled.');
  }
}

export { imagekit };

// Client-side configuration
export const imagekitConfig = {
  publicKey: publicKey,
  urlEndpoint: urlEndpoint,
};

// Helper function to generate authentication parameters for client uploads
export function getImageKitAuthParams() {
  if (!imagekit) {
    console.warn('ImageKit is not initialized. Image upload features are disabled.');
    return null;
  }
  try {
    const token = imagekit.getAuthenticationParameters();
    return token;
  } catch (error) {
    console.error('Failed to get ImageKit auth params:', error);
    return null;
  }
}

// Helper function to generate optimized image URLs
export function getOptimizedImageUrl(
  imagePath: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  }
) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  // If ImageKit is not configured, return the image path as-is
  if (!baseUrl) {
    return imagePath;
  }
  
  if (!transformations) {
    return `${baseUrl}/${imagePath}`;
  }

  const params = [];
  
  if (transformations.width) params.push(`w-${transformations.width}`);
  if (transformations.height) params.push(`h-${transformations.height}`);
  if (transformations.quality) params.push(`q-${transformations.quality}`);
  if (transformations.format) params.push(`f-${transformations.format}`);
  if (transformations.crop) params.push(`c-${transformations.crop}`);

  const transformString = params.length > 0 ? `tr:${params.join(',')}` : '';
  
  return `${baseUrl}/${transformString}/${imagePath}`;
}
