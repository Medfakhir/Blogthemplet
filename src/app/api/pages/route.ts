import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeDbOperation } from '@/lib/db-utils';

// GET /api/pages - Get public pages (for footer, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const footerOnly = searchParams.get('footer') === 'true';

    console.log('📄 Fetching public pages...', { footerOnly });

    const pages = await safeDbOperation(
      () => prisma.page.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          title: true,
          slug: true,
          updatedAt: true
        },
        orderBy: {
          title: 'asc'
        }
      }),
      []
    ) || [];

    // For now, show all active pages in footer since showInFooter field doesn't exist yet
    // You can add this field to the database schema later if needed

    console.log(`✅ Found ${pages.length} public pages`);

    return NextResponse.json({
      success: true,
      pages: pages
    });
  } catch (error) {
    console.error('❌ Error fetching public pages:', error);
    
    // Return fallback pages if database fails
    const fallbackPages = [
      { id: '1', title: "Privacy Policy", slug: "privacy-policy" },
      { id: '2', title: "Terms of Service", slug: "terms-of-service" },
      { id: '3', title: "Contact", slug: "contact" },
    ];

    return NextResponse.json({
      success: true,
      pages: fallbackPages
    });
  }
}
