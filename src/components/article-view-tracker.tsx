"use client";

import { useEffect, useRef } from 'react';

interface ArticleViewTrackerProps {
  slug: string;
}

export default function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current || !slug) return;
    
    hasTracked.current = true;

    // Track view after a short delay to ensure it's a real view
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/article-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`📊 View tracked for article: ${slug} (${data.data?.viewCount} total views)`);
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }, 2000); // Wait 2 seconds before tracking

    return () => clearTimeout(timer);
  }, [slug]);

  return null; // This component doesn't render anything
}
