"use client";

import { useEffect } from 'react';
import { useRealtime } from '@/contexts/realtime-context';

export default function DynamicFavicon() {
  const { data: realtimeData } = useRealtime();

  useEffect(() => {
    // Update favicon dynamically when settings change
    const faviconUrl = realtimeData.settings?.faviconUrl;
    
    if (faviconUrl && typeof faviconUrl === 'string') {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(link => link.remove());

      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = faviconUrl;
      document.head.appendChild(link);

      // Add shortcut icon
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.href = faviconUrl;
      document.head.appendChild(shortcutLink);

      // Add apple touch icon
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = faviconUrl;
      document.head.appendChild(appleLink);

      console.log('✅ Favicon updated:', faviconUrl);
    }
  }, [realtimeData.settings?.faviconUrl]);

  return null; // This component doesn't render anything
}
