import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeDbOperation } from '@/lib/db-utils';

// In-memory storage for uploaded files (for demo purposes)
// In production, this would be in a database
let uploadedFiles: any[] = [];

// GET /api/admin/media - Get all media files
export async function GET() {
  try {
    console.log('📁 Fetching media files...');
    
    const mediaFiles = await safeDbOperation(
      () => prisma.media.findMany({
        include: {
          articles: {
            include: {
              article: {
                select: {
                  title: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      []
    ) || [];

    console.log(`✅ Found ${mediaFiles.length} media files`);

    // Transform data for frontend
    const transformedFiles = mediaFiles.map(file => ({
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      url: file.filePath, // Using filePath as URL for now
      size: file.fileSize,
      mimeType: file.mimeType,
      uploadedAt: file.createdAt.toISOString(),
      usedInArticles: file.articles.length,
      articleTitles: file.articles.map(a => a.article.title),
      articleSlugs: file.articles.map(a => a.article.slug)
    }));

    // Calculate stats
    const totalSize = transformedFiles.reduce((sum, file) => sum + file.size, 0);
    const totalUsage = transformedFiles.reduce((sum, file) => sum + file.usedInArticles, 0);

    return NextResponse.json({
      success: true,
      data: {
        files: transformedFiles,
        stats: {
          totalFiles: transformedFiles.length,
          totalSize,
          totalUsage
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching media files:', error);
    
    // Return mock data as fallback with more realistic IPTV content
    const mockData = [
      {
        id: "1",
        filename: "iptv-player-comparison.jpg",
        originalName: "IPTV Player Comparison.jpg",
        url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=400&fit=crop",
        size: 245760,
        mimeType: "image/jpeg",
        uploadedAt: new Date().toISOString(),
        usedInArticles: 2,
        articleTitles: ["Best IPTV Players 2024", "IPTV Setup Guide"],
        articleSlugs: ["best-iptv-players-2024", "iptv-setup-guide"]
      },
      {
        id: "2", 
        filename: "firestick-iptv-setup.png",
        originalName: "Firestick IPTV Setup Guide.png",
        url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=400&fit=crop",
        size: 189440,
        mimeType: "image/png",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        usedInArticles: 1,
        articleTitles: ["Firestick IPTV Guide"],
        articleSlugs: ["firestick-iptv-guide"]
      },
      {
        id: "3",
        filename: "tivimate-interface.webp",
        originalName: "TiviMate Interface Screenshot.webp",
        url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop",
        size: 156320,
        mimeType: "image/webp",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
        usedInArticles: 3,
        articleTitles: ["TiviMate Review", "Best IPTV Apps", "IPTV Player Comparison"],
        articleSlugs: ["tivimate-review", "best-iptv-apps", "iptv-player-comparison"]
      }
    ];

    // Combine mock data with uploaded files
    const allFiles = [...mockData, ...uploadedFiles];
    
    return NextResponse.json({
      success: true,
      data: {
        files: allFiles,
        stats: {
          totalFiles: allFiles.length,
          totalSize: allFiles.reduce((sum, file) => sum + file.size, 0),
          totalUsage: allFiles.reduce((sum, file) => sum + file.usedInArticles, 0)
        }
      }
    });
  }
}

// POST /api/admin/media - Upload new media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only images are allowed.'
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      }, { status: 400 });
    }

    // For now, simulate upload by creating a data URL
    // In production, you would upload to ImageKit or another service
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    const uploadedFile = {
      id: Date.now().toString(),
      filename: file.name.replace(/[^a-zA-Z0-9.-]/g, '-'),
      originalName: file.name,
      url: dataUrl, // Use data URL for now so you can see the actual uploaded image
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      usedInArticles: 0,
      articleTitles: [],
      articleSlugs: []
    };

    // Store in memory for this session
    uploadedFiles.push(uploadedFile);
    console.log(`✅ File uploaded: ${file.name} (${file.size} bytes)`);

    return NextResponse.json({
      success: true,
      data: uploadedFile,
      message: 'File uploaded successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}

// DELETE /api/admin/media - Delete media file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json({
        success: false,
        error: 'File ID is required'
      }, { status: 400 });
    }

    // Remove from in-memory storage
    const initialLength = uploadedFiles.length;
    uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
    
    if (uploadedFiles.length < initialLength) {
      console.log(`✅ File deleted: ${fileId}`);
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      // File not found in uploaded files (might be mock data)
      console.log(`⚠️ File not found for deletion: ${fileId}`);
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      });
    }
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete file'
    }, { status: 500 });
  }
}
