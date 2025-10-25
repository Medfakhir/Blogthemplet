import Head from 'next/head';

interface AdminHeadProps {
  title?: string;
  description?: string;
}

export default function AdminHead({ 
  title = "Admin Dashboard", 
  description = "Admin dashboard for content management" 
}: AdminHeadProps) {
  return (
    <Head>
      <title>{title} - IPTV Hub Admin</title>
      <meta name="description" content={description} />
      
      {/* Prevent search engine indexing */}
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      
      {/* Additional security headers */}
      <meta name="referrer" content="no-referrer" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Prevent caching */}
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
    </Head>
  );
}
