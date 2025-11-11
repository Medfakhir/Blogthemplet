'use client';

import { useState, useMemo } from 'react';
import ArticleCard from "@/components/blog/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List, Calendar, Clock, User, Tag } from "lucide-react";

interface Article {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  category: string;
  categorySlug: string;
  categoryColor?: string | null;
  publishedAt: string;
  readTime: string;
  author: string;
  tags: string[];
  viewCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  articleCount: number;
}

interface ArticlesClientProps {
  initialArticles: Article[];
  categories: Category[];
}

export default function ArticlesClient({ initialArticles, categories }: ArticlesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(9);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = [...initialArticles];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.categorySlug === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [initialArticles, searchQuery, selectedCategory, sortBy]);

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayCount < filteredArticles.length;

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        <div className="bg-card rounded-lg border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name} ({category.articleCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          Showing {displayedArticles.length} of {filteredArticles.length} articles
          {searchQuery && ` for "${searchQuery}"`}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Articles Grid/List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p>Try adjusting your filters or search query.</p>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {displayedArticles.map((article) => (
            <div key={article.slug} className="group">
              <ArticleCard
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug}
                featuredImage={article.featuredImage}
                category={article.category}
                publishedAt={article.publishedAt}
                readTime={article.readTime}
                author={article.author}
              />

              {/* Additional metadata */}
              <div className="mt-3 px-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {article.publishedAt}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {article.author}
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: `${article.categoryColor || '#3B82F6'}20`,
                      color: article.categoryColor || '#3B82F6',
                      borderColor: `${article.categoryColor || '#3B82F6'}40`
                    }}
                  >
                    {article.category}
                  </Badge>

                  {article.viewCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {article.viewCount.toLocaleString()} views
                    </span>
                  )}
                </div>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setDisplayCount(prev => prev + 9)}
          >
            Load More Articles ({filteredArticles.length - displayCount} remaining)
          </Button>
        </div>
      )}
    </>
  );
}
