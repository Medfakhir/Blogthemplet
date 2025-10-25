import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./fallback-fonts.css";
import ConditionalLayout from "@/components/layout/conditional-layout";
import { Toaster } from "sonner";
import { RealtimeProvider } from "@/contexts/realtime-context";
import { getSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    
    const siteTitle = settings.defaultMetaTitle || `${settings.siteName} - Your Ultimate Guide to IPTV Players & Devices`;
    const siteDescription = settings.defaultMetaDescription || "Discover the best IPTV players, streaming devices, and setup guides. Expert reviews, tutorials, and tips for Android boxes, Firestick, and more.";
    const siteUrl = settings.siteUrl || "https://iptv-blogg.netlify.app";
    
    const metadata: Metadata = {
      title: siteTitle,
      description: siteDescription,
      keywords: settings.defaultMetaKeywords || "IPTV, streaming, Android TV box, Firestick, IPTV players, streaming devices, tutorials, reviews",
      authors: [{ name: `${settings.siteName} Team` }],
      metadataBase: new URL(siteUrl),
      openGraph: {
        title: siteTitle,
        description: siteDescription,
        url: siteUrl,
        siteName: settings.siteName || "IPTV Hub",
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: siteDescription,
      },
    };

    // Add OG image if available
    if (settings.ogImageUrl) {
      metadata.openGraph!.images = [
        {
          url: settings.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${settings.siteName} - IPTV Guide`,
        }
      ];
      metadata.twitter!.images = [settings.ogImageUrl];
    }

    // Add favicon if available
    if (settings.faviconUrl) {
      metadata.icons = {
        icon: settings.faviconUrl,
        shortcut: settings.faviconUrl,
        apple: settings.faviconUrl,
      };
    }

    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "IPTV Hub - Your Ultimate Guide to IPTV Players & Devices",
      description: "Discover the best IPTV players, streaming devices, and setup guides. Expert reviews, tutorials, and tips for Android boxes, Firestick, and more.",
      keywords: "IPTV, streaming, Android TV box, Firestick, IPTV players, streaming devices, tutorials, reviews",
      authors: [{ name: "IPTV Hub Team" }],
    };
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <RealtimeProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          {/* Real-time status and debug components removed per user request */}
        </RealtimeProvider>
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
