import HeroSection from "@/components/blog/hero-section";
import ArticleCard from "@/components/blog/article-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { safeDbOperation } from "@/lib/db-utils";

// Demo articles for when database is not available
const getDemoArticles = () => [
  {
    title: "Best IPTV Players for Android TV Box 2024",
    excerpt: "Discover the top IPTV players that work perfectly with Android TV boxes. Complete setup guide and feature comparison.",
    slug: "best-iptv-players-android-tv-box-2024",
    featuredImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=400&fit=crop",
    category: "Reviews",
    publishedAt: "Dec 15, 2024",
    readTime: "8 min read",
    author: "IPTV Hub Team"
  },
  {
    title: "How to Setup IPTV on Firestick - Complete Guide",
    excerpt: "Step-by-step tutorial to install and configure IPTV on Amazon Firestick. Works with all popular IPTV apps.",
    slug: "setup-iptv-firestick-guide",
    featuredImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=400&fit=crop",
    category: "Tutorials",
    publishedAt: "Dec 12, 2024",
    readTime: "6 min read",
    author: "IPTV Hub Team"
  },
  {
    title: "Top 10 Android TV Boxes for IPTV Streaming",
    excerpt: "Compare the best Android TV boxes optimized for IPTV streaming. Performance tests and buying recommendations.",
    slug: "top-android-tv-boxes-iptv-streaming",
    featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    category: "Hardware",
    publishedAt: "Dec 10, 2024",
    readTime: "10 min read",
    author: "IPTV Hub Team"
  },
  {
    title: "IPTV vs Cable TV: Which is Better in 2024?",
    excerpt: "Comprehensive comparison between IPTV and traditional cable TV. Cost analysis, features, and recommendations.",
    slug: "iptv-vs-cable-tv-comparison-2024",
    featuredImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=400&fit=crop",
    category: "Comparison",
    publishedAt: "Dec 8, 2024",
    readTime: "7 min read",
    author: "IPTV Hub Team"
  },
  {
    title: "Troubleshooting Common IPTV Issues",
    excerpt: "Fix buffering, connection problems, and other common IPTV issues. Expert solutions and optimization tips.",
    slug: "troubleshooting-common-iptv-issues",
    featuredImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    category: "Support",
    publishedAt: "Dec 5, 2024",
    readTime: "9 min read",
    author: "IPTV Hub Team"
  },
  {
    title: "Best Free IPTV Apps for Smart TV",
    excerpt: "Discover the top free IPTV applications for Smart TVs. Installation guides and feature reviews included.",
    slug: "best-free-iptv-apps-smart-tv",
    featuredImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=400&fit=crop",
    category: "Apps",
    publishedAt: "Dec 3, 2024",
    readTime: "5 min read",
    author: "IPTV Hub Team"
  }
];

async function getFeaturedArticles() {
  // Always try to get articles from database first, even without DATABASE_URL
  // This allows the site to work if database is configured in Netlify but not locally

  console.log('Attempting to fetch articles from database...');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  try {
    const articles = await safeDbOperation(
      () => prisma.article.findMany({
        where: {
          status: 'PUBLISHED'
        },
        include: {
          author: {
            select: {
              name: true
            }
          },
          category: {
            select: {
              name: true,
              slug: true
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: 6 // Get latest 6 articles
      }),
      []
    );

    // If we got articles from database, format and return them
    if (articles && articles.length > 0) {
      console.log(`✅ Successfully found ${articles.length} articles in database`);
      return articles.map(article => ({
        title: article.title,
        excerpt: article.excerpt || '',
        slug: article.slug,
        featuredImage: article.featuredImage || "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=400&fit=crop",
        category: article.category.name,
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : '',
        readTime: `${article.readTime || 5} min read`,
        author: article.author.name
      }));
    }

    // If no articles in database, return empty array (no placeholders)
    console.log('⚠️ Database connected but no published articles found');
    return [];
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    // Only show placeholder if there's a connection error
    return [
      {
        title: "Database Connection Issue",
        excerpt: "Unable to connect to database. Please check your database configuration and try again.",
        slug: "database-connection-issue",
        featuredImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=400&fit=crop",
        category: "System",
        publishedAt: "Dec 15, 2024",
        readTime: "1 min read",
        author: "System"
      }
    ];
  }
}

// Force dynamic rendering to ensure database queries work at runtime
export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredArticles = await getFeaturedArticles();
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Articles */}
      <section className="container mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Latest IPTV Guides & Reviews</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t miss out on the latest IPTV trends, reviews, and comprehensive setup guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/articles">
                Browse All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground">
              Find exactly what you're looking for with our organized content categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "IPTV Players", count: "Featured articles", href: "/category/iptv-players" },
              { name: "Android Boxes", count: "Coming soon", href: "/category/android-boxes" },
              { name: "Firestick", count: "Featured articles", href: "/category/firestick" },
              { name: "Reviews", count: "Coming soon", href: "/category/reviews" },
              { name: "Guides", count: "Coming soon", href: "/category/guides" },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group p-6 bg-card rounded-lg border hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
