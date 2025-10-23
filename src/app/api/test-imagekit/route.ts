import { NextResponse } from 'next/server';
import { imagekit } from '@/lib/imagekit';

export async function GET() {
  try {
    const config = {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    };

    const status = {
      imagekitConfigured: !!imagekit,
      environmentVariables: {
        publicKey: !!config.publicKey,
        privateKey: !!config.privateKey,
        urlEndpoint: !!config.urlEndpoint,
      },
      publicKeyValue: config.publicKey ? `${config.publicKey.substring(0, 10)}...` : 'Not set',
      urlEndpointValue: config.urlEndpoint || 'Not set'
    };

    return NextResponse.json({
      success: true,
      status: status,
      message: imagekit ? 'ImageKit is properly configured' : 'ImageKit is not configured - using fallback mode'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'ImageKit configuration failed'
    }, { status: 500 });
  }
}
