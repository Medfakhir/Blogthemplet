"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  TrendingUp,
  FileText,
  Link2,
  Image as ImageIcon,
  Hash,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { analyzeSEO, type SEOAnalysis } from '@/lib/seo-utils';
import { Button } from '@/components/ui/button';

interface SEOAnalyzerProps {
  title: string;
  description: string;
  content: string;
  slug: string;
  tags?: string[];
}

export default function SEOAnalyzer({ 
  title, 
  description, 
  content, 
  slug, 
  tags = [] 
}: SEOAnalyzerProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    // Debounce analysis to avoid too many calculations
    const timer = setTimeout(() => {
      const result = analyzeSEO(title, description, content, slug, tags);
      setAnalysis(result);
    }, 500);

    return () => clearTimeout(timer);
  }, [title, description, content, slug, tags]);

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SEO Analyzer</CardTitle>
          <CardDescription>Analyzing your content...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 75) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Needs Work';
  };

  const StatusIcon = ({ status }: { status: 'good' | 'warning' | 'error' }) => {
    if (status === 'good') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === 'warning') return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Score
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Overall Score */}
        <div className="flex items-center gap-4 mt-4">
          <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">
              {getScoreLabel(analysis.score)}
            </div>
            <Progress value={analysis.score} className="h-2" />
          </div>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="space-y-4">
          {/* Title Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.title.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Title</span>
                <span className="text-xs text-muted-foreground">{analysis.title.value} chars</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.title.message}</p>
            </div>
          </div>

          {/* Description Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.description.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Meta Description</span>
                <span className="text-xs text-muted-foreground">{analysis.description.value} chars</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.description.message}</p>
            </div>
          </div>

          {/* Content Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.content.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Word Count
                </span>
                <span className="text-xs text-muted-foreground">{analysis.content.wordCount} words</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.content.message}</p>
            </div>
          </div>

          {/* Keyword Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.keyword.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Focus Keyword
                </span>
                <Badge variant="outline" className="text-xs">
                  {analysis.keyword.keyword}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.keyword.message}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {analysis.keyword.inTitle && (
                  <Badge variant="secondary" className="text-xs">✓ In title</Badge>
                )}
                {analysis.keyword.inFirstParagraph && (
                  <Badge variant="secondary" className="text-xs">✓ First ¶</Badge>
                )}
                {analysis.keyword.inLastParagraph && (
                  <Badge variant="secondary" className="text-xs">✓ Last ¶</Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {analysis.keyword.density.toFixed(1)}% density
                </Badge>
              </div>
            </div>
          </div>

          {/* Headings Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.headings.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Headings</span>
                <span className="text-xs text-muted-foreground">
                  H1:{analysis.headings.h1Count} H2:{analysis.headings.h2Count} H3:{analysis.headings.h3Count}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.headings.message}</p>
            </div>
          </div>

          {/* Links Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.links.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  Links
                </span>
                <span className="text-xs text-muted-foreground">
                  {analysis.links.internal} internal, {analysis.links.external} external
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.links.message}</p>
            </div>
          </div>

          {/* Images Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.images.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  Images
                </span>
                <span className="text-xs text-muted-foreground">
                  {analysis.images.withAlt}/{analysis.images.total} with alt
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.images.message}</p>
            </div>
          </div>

          {/* URL Slug Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.slug.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">URL Slug</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.slug.message}</p>
            </div>
          </div>

          {/* Readability Check */}
          <div className="flex items-start gap-2">
            <StatusIcon status={analysis.readability.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Readability</span>
                <span className="text-xs text-muted-foreground">Score: {analysis.readability.value}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.readability.message}</p>
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Quick Wins</span>
              </div>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Title:</span>
                <span>{analysis.title.score}/15</span>
              </div>
              <div className="flex justify-between">
                <span>Description:</span>
                <span>{analysis.description.score}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Content:</span>
                <span>{analysis.content.score}/20</span>
              </div>
              <div className="flex justify-between">
                <span>Keywords:</span>
                <span>{analysis.keyword.score}/20</span>
              </div>
              <div className="flex justify-between">
                <span>Structure:</span>
                <span>{analysis.headings.score + analysis.links.score + analysis.images.score}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Technical:</span>
                <span>{analysis.slug.score + analysis.readability.score}/10</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
