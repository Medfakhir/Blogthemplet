/**
 * Environment Variable Validation
 * Validates all required environment variables at build time
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // NextAuth (Optional - for future authentication)
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // ImageKit (Optional)
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Site Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

// Validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.safeParse(process.env);
    
    if (!parsed.success) {
      console.error('❌ Invalid environment variables:');
      console.error(parsed.error.flatten().fieldErrors);
      throw new Error('Invalid environment variables');
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Environment validation failed:', error);
    // In development, allow to continue with warnings
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return process.env as z.infer<typeof envSchema>;
  }
}

export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
