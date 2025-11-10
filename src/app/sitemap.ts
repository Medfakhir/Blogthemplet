import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { safeDbOperation } from '@/lib/db-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://iptv-blogg.site';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Get all published articles
  const articles = await safeDbOperation(
    () => prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    }),
    []
  ) || [];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Get all active categories
  const categories = await safeDbOperation(
    () => prisma.category.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true,
        updatedAt: true,
      }
    }),
    []
  ) || [];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Get all active pages
  const pages = await safeDbOperation(
    () => prisma.page.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true,
        updatedAt: true,
      }
    }),
    []
  ) || [];

  const customPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}/pages/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...articlePages, ...categoryPages, ...customPages];
}
