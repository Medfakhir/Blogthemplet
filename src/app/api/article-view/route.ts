import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeDbOperation } from '@/lib/db-utils';

// POST /api/article-view - Increment article view count
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Article slug is required'
      }, { status: 400 });
    }

    console.log(`📊 Incrementing view count for article: ${slug}`);

    // Increment view count
    const article = await safeDbOperation(
      () => prisma.article.update({
        where: {
          slug: slug,
          status: 'PUBLISHED'
        },
        data: {
          viewCount: {
            increment: 1
          }
        },
        select: {
          id: true,
          slug: true,
          viewCount: true
        }
      }),
      null
    );

    if (!article) {
      console.log(`❌ Article not found: ${slug}`);
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      }, { status: 404 });
    }

    console.log(`✅ View count incremented: ${article.slug} (${article.viewCount} views)`);

    return NextResponse.json({
      success: true,
      data: {
        slug: article.slug,
        viewCount: article.viewCount
      }
    });
  } catch (error) {
    console.error('❌ Error incrementing view count:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to increment view count'
    }, { status: 500 });
  }
}
