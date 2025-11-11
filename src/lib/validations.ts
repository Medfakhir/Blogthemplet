/**
 * Input Validation Schemas
 * Zod schemas for validating API inputs
 */

import { z } from 'zod';

// ========================================
// ARTICLE SCHEMAS
// ========================================

export const createArticleSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters'),
  
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional(),
  
  content: z.string()
    .min(100, 'Content must be at least 100 characters'),
  
  featuredImage: z.string().url().optional().or(z.literal('')),
  
  categoryId: z.string().min(1, 'Category is required'),
  
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.string().optional(),
  
  tags: z.array(z.string()).optional(),
  
  authorId: z.string().min(1, 'Author is required'),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.string().min(1, 'Article ID is required'),
});

// ========================================
// CATEGORY SCHEMAS
// ========================================

export const createCategorySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
  showInMenu: z.boolean().default(true),
  menuOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  menuLabel: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().min(1, 'Category ID is required'),
});

// ========================================
// TAG SCHEMAS
// ========================================

export const createTagSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// ========================================
// COMMENT SCHEMAS
// ========================================

export const createCommentSchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
  authorName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  authorEmail: z.string().email('Invalid email address'),
  content: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
  parentId: z.string().optional(),
});

// ========================================
// SETTINGS SCHEMAS
// ========================================

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  siteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
  ogImageUrl: z.string().url().optional().or(z.literal('')),
  defaultMetaTitle: z.string().max(60).optional(),
  defaultMetaDescription: z.string().max(160).optional(),
  defaultMetaKeywords: z.string().optional(),
  contactEmail: z.string().email().optional(),
  socialLinks: z.object({
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }).optional(),
});

// ========================================
// MEDIA SCHEMAS
// ========================================

export const uploadMediaSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'File must be an image (JPEG, PNG, WebP, or GIF)'
    ),
  alt: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
});

// ========================================
// SEARCH SCHEMAS
// ========================================

export const searchSchema = z.object({
  query: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters'),
  category: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

// ========================================
// PAGINATION SCHEMA
// ========================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Validate request body against a schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('; ');
      
      return {
        success: false,
        error: errorMessage || 'Validation failed',
      };
    }
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON in request body',
    };
  }
}

/**
 * Validate query parameters against a schema
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    
    // Convert string numbers to actual numbers
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (typeof value === 'string' && !isNaN(Number(value))) {
        (params as Record<string, unknown>)[key] = Number(value);
      }
    });
    
    const result = schema.safeParse(params);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('; ');
      
      return {
        success: false,
        error: errorMessage || 'Validation failed',
      };
    }
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid query parameters',
    };
  }
}
