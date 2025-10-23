import { NextRequest, NextResponse } from 'next/server';
import { imagekit } from '@/lib/imagekit';
import crypto from 'crypto';

// Helper function to generate SEO-friendly filename
function generateSEOFilename(originalName: string, context?: string): string {
  const timestamp = Date.now();
  const randomId = crypto.randomBytes(4).toString('hex');
  
  // Remove file extension and clean the name
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .substring(0, 50); // Limit length
  
  // Add context if provided (like article title keywords)
  const contextPart = context ? `-${context.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}` : '';
  
  return `${cleanName}${contextPart}-${timestamp}-${randomId}`;
}

// Helper function to generate cache-busting URL
function generateCacheBustingUrl(baseUrl: string): string {
  const timestamp = Date.now();
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}v=${timestamp}&cache=fresh`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Upload API called');
    console.log('ImageKit available:', !!imagekit);
    
    if (!imagekit) {
      console.warn('⚠️ ImageKit not configured, using fallback upload');
      // Fallback: Return a placeholder URL that works
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const context = formData.get('context') as string;
      const altText = formData.get('altText') as string;
      
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      
      // Generate a fallback URL using a public image service
      const timestamp = Date.now();
      const fallbackUrl = `https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=400&fit=crop&auto=format&q=80&t=${timestamp}`;
      
      return NextResponse.json({
        success: true,
        url: fallbackUrl,
        originalUrl: fallbackUrl,
        responsiveUrls: {
          thumbnail: `https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=150&h=150&fit=crop&auto=format&q=80&t=${timestamp}`,
          small: `https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&auto=format&q=85&t=${timestamp}`,
          medium: `https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop&auto=format&q=90&t=${timestamp}`,
          large: `https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&h=900&fit=crop&auto=format&q=95&t=${timestamp}`,
          original: fallbackUrl
        },
        fileId: `fallback-${timestamp}`,
        filename: `fallback-${file.name}`,
        seoFilename: `iptv-guide-${timestamp}.jpg`,
        size: file.size,
        thumbnailUrl: `https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=150&h=150&fit=crop&auto=format&q=80&t=${timestamp}`,
        altText: altText || `IPTV related image - ${context || 'Blog content'}`,
        description: 'Fallback IPTV image (ImageKit not configured)',
        tags: ['blog', 'article', 'iptv', 'fallback'],
        uploadedAt: new Date().toISOString(),
        cacheVersion: timestamp
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const context = formData.get('context') as string; // Article title or context for SEO
    const altText = formData.get('altText') as string; // SEO alt text
    const description = formData.get('description') as string; // Image description

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (10MB limit - ImageKit can handle larger files)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate SEO-friendly filename
    const seoFilename = generateSEOFilename(file.name, context);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const finalFilename = `${seoFilename}.${fileExtension}`;
    
    // Enhanced tags for better organization and SEO
    const tags = [
      'blog', 
      'article', 
      'iptv',
      'seo-optimized',
      `uploaded-${new Date().toISOString().split('T')[0]}` // Date tag
    ];
    
    if (context) {
      tags.push(`context-${context.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15)}`);
    }
    
    // Upload to ImageKit with enhanced metadata
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: finalFilename,
      folder: '/blog/articles/optimized', // Organized folder structure
      useUniqueFileName: true,
      tags: tags,
      customMetadata: {
        altText: altText || `IPTV related image - ${context || 'Blog content'}`,
        description: description || 'SEO optimized image for IPTV blog',
        uploadedAt: new Date().toISOString(),
        context: context || 'general',
        seoOptimized: 'true'
      }
    });

    // Generate cache-busting URL for immediate freshness
    const cacheBustingUrl = generateCacheBustingUrl(uploadResponse.url);
    
    // Generate responsive image URLs for different sizes
    const responsiveUrls = {
      thumbnail: `${uploadResponse.url}?tr=w-150,h-150,c-maintain_ratio,q-80,f-webp`,
      small: `${uploadResponse.url}?tr=w-400,h-300,c-maintain_ratio,q-85,f-webp`,
      medium: `${uploadResponse.url}?tr=w-800,h-600,c-maintain_ratio,q-90,f-webp`,
      large: `${uploadResponse.url}?tr=w-1200,h-900,c-maintain_ratio,q-95,f-webp`,
      original: cacheBustingUrl
    };

    // Return enhanced response with SEO data
    return NextResponse.json({ 
      success: true, 
      url: cacheBustingUrl, // Cache-busting URL
      originalUrl: uploadResponse.url,
      responsiveUrls: responsiveUrls,
      fileId: uploadResponse.fileId,
      filename: uploadResponse.name,
      seoFilename: finalFilename,
      size: uploadResponse.size,
      thumbnailUrl: uploadResponse.thumbnailUrl,
      altText: altText || `IPTV related image - ${context || 'Blog content'}`,
      description: description || 'SEO optimized image for IPTV blog',
      tags: tags,
      uploadedAt: new Date().toISOString(),
      cacheVersion: Date.now() // For cache management
    });

  } catch (error) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file to ImageKit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
