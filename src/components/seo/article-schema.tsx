interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
  url: string;
  category: string;
}

export default function ArticleSchema({
  title,
  description,
  author,
  publishedAt,
  updatedAt,
  imageUrl,
  url,
  category
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl || "https://iptv-blogg.site/og-image.jpg",
    "datePublished": publishedAt,
    "dateModified": updatedAt,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://iptv-blogg.site/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": category,
    "inLanguage": "en-US"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
