// SEO Analysis Utilities

export interface SEOAnalysis {
  score: number;
  title: SEOCheck;
  description: SEOCheck;
  content: ContentCheck;
  keyword: KeywordCheck;
  headings: HeadingCheck;
  links: LinkCheck;
  images: ImageCheck;
  slug: SEOCheck;
  readability: ReadabilityCheck;
  suggestions: string[];
}

export interface SEOCheck {
  status: 'good' | 'warning' | 'error';
  value: string | number;
  message: string;
  score: number;
}

export interface ContentCheck extends SEOCheck {
  wordCount: number;
}

export interface KeywordCheck extends SEOCheck {
  keyword: string;
  density: number;
  inTitle: boolean;
  inFirstParagraph: boolean;
  inLastParagraph: boolean;
  count: number;
}

export interface HeadingCheck extends SEOCheck {
  h1Count: number;
  h2Count: number;
  h3Count: number;
}

export interface LinkCheck extends SEOCheck {
  internal: number;
  external: number;
}

export interface ImageCheck extends SEOCheck {
  total: number;
  withAlt: number;
}

export interface ReadabilityCheck extends SEOCheck {
  grade: number;
}

/**
 * Extract focus keyword from title or tags
 */
export function extractFocusKeyword(title: string, tags: string[] = []): string {
  // Remove common words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'how', 'what', 'when', 'where', 'why', 'which', 'who', 'best', 'top', 'guide', 'tutorial', '2024', '2025'];
  
  // Try to extract from title first
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  // Get 2-word phrases from title
  if (titleWords.length >= 2) {
    return `${titleWords[0]} ${titleWords[1]}`;
  }
  
  // Fallback to first tag
  if (tags.length > 0) {
    return tags[0].toLowerCase();
  }
  
  // Fallback to first word
  return titleWords[0] || '';
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate keyword density
 */
export function calculateKeywordDensity(content: string, keyword: string): number {
  if (!keyword) return 0;
  
  const contentLower = content.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  const keywordCount = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
  const totalWords = countWords(content);
  
  return totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;
}

/**
 * Check if keyword is in text
 */
export function keywordInText(text: string, keyword: string): boolean {
  if (!keyword) return false;
  return text.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * Extract first paragraph from content
 */
export function getFirstParagraph(content: string): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  const paragraphs = text.split(/\n\n+/);
  return paragraphs[0] || '';
}

/**
 * Extract last paragraph from content
 */
export function getLastParagraph(content: string): string {
  const text = content.replace(/<[^>]*>/g, '');
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  return paragraphs[paragraphs.length - 1] || '';
}

/**
 * Count headings in content
 */
export function countHeadings(content: string): { h1: number; h2: number; h3: number } {
  const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
  
  return { h1: h1Count, h2: h2Count, h3: h3Count };
}

/**
 * Count links in content
 */
export function countLinks(content: string, currentDomain: string = 'iptv-blogg.site'): { internal: number; external: number } {
  const links = content.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  
  let internal = 0;
  let external = 0;
  
  links.forEach(link => {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (href.startsWith('/') || href.includes(currentDomain)) {
        internal++;
      } else if (href.startsWith('http')) {
        external++;
      }
    }
  });
  
  return { internal, external };
}

/**
 * Count images and alt text
 */
export function countImages(content: string): { total: number; withAlt: number } {
  const images = content.match(/<img[^>]*>/gi) || [];
  const total = images.length;
  const withAlt = images.filter(img => /alt=["'][^"']+["']/i.test(img)).length;
  
  return { total, withAlt };
}

/**
 * Calculate readability score (Flesch Reading Ease approximation)
 */
export function calculateReadability(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = countWords(text);
  const syllables = estimateSyllables(text);
  
  if (sentences === 0 || words === 0) return 0;
  
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, score));
}

/**
 * Estimate syllables in text (rough approximation)
 */
function estimateSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  let syllables = 0;
  
  words.forEach(word => {
    syllables += word.match(/[aeiouy]{1,2}/g)?.length || 1;
  });
  
  return syllables;
}

/**
 * Perform complete SEO analysis
 */
export function analyzeSEO(
  title: string,
  description: string,
  content: string,
  slug: string,
  tags: string[] = []
): SEOAnalysis {
  const focusKeyword = extractFocusKeyword(title, tags);
  const wordCount = countWords(content);
  const keywordDensity = calculateKeywordDensity(content, focusKeyword);
  const keywordCount = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length;
  const firstParagraph = getFirstParagraph(content);
  const lastParagraph = getLastParagraph(content);
  const headings = countHeadings(content);
  const links = countLinks(content);
  const images = countImages(content);
  const readability = calculateReadability(content);
  
  const suggestions: string[] = [];
  let totalScore = 0;
  
  // Title check (15 points)
  const titleCheck: SEOCheck = {
    status: 'good',
    value: title.length,
    message: '',
    score: 0
  };
  
  if (title.length === 0) {
    titleCheck.status = 'error';
    titleCheck.message = 'Title is required';
    titleCheck.score = 0;
    suggestions.push('Add a title to your article');
  } else if (title.length < 30) {
    titleCheck.status = 'warning';
    titleCheck.message = `Title too short (${title.length} chars). Aim for 50-60.`;
    titleCheck.score = 7;
    suggestions.push('Lengthen your title to 50-60 characters');
  } else if (title.length > 60) {
    titleCheck.status = 'warning';
    titleCheck.message = `Title too long (${title.length} chars). Keep under 60.`;
    titleCheck.score = 10;
    suggestions.push('Shorten your title to under 60 characters');
  } else {
    titleCheck.status = 'good';
    titleCheck.message = `Title length perfect (${title.length} chars)`;
    titleCheck.score = 15;
  }
  totalScore += titleCheck.score;
  
  // Description check (10 points)
  const descCheck: SEOCheck = {
    status: 'good',
    value: description.length,
    message: '',
    score: 0
  };
  
  if (description.length === 0) {
    descCheck.status = 'error';
    descCheck.message = 'Meta description is required';
    descCheck.score = 0;
    suggestions.push('Add a meta description');
  } else if (description.length < 120) {
    descCheck.status = 'warning';
    descCheck.message = `Too short (${description.length} chars). Aim for 150-160.`;
    descCheck.score = 5;
    suggestions.push(`Add ${160 - description.length} more characters to meta description`);
  } else if (description.length > 160) {
    descCheck.status = 'warning';
    descCheck.message = `Too long (${description.length} chars). Keep under 160.`;
    descCheck.score = 7;
    suggestions.push('Shorten meta description to under 160 characters');
  } else {
    descCheck.status = 'good';
    descCheck.message = `Perfect length (${description.length} chars)`;
    descCheck.score = 10;
  }
  totalScore += descCheck.score;
  
  // Content check (20 points)
  const contentCheck: ContentCheck = {
    status: 'good',
    value: wordCount,
    wordCount,
    message: '',
    score: 0
  };
  
  if (wordCount === 0) {
    contentCheck.status = 'error';
    contentCheck.message = 'Content is empty';
    contentCheck.score = 0;
    suggestions.push('Write your article content');
  } else if (wordCount < 300) {
    contentCheck.status = 'error';
    contentCheck.message = `Too short (${wordCount} words). Minimum 1500 words.`;
    contentCheck.score = 5;
    suggestions.push(`Add ${1500 - wordCount} more words to reach minimum`);
  } else if (wordCount < 1000) {
    contentCheck.status = 'warning';
    contentCheck.message = `Short (${wordCount} words). Aim for 1500+.`;
    contentCheck.score = 10;
    suggestions.push(`Add ${1500 - wordCount} more words for better SEO`);
  } else if (wordCount < 1500) {
    contentCheck.status = 'warning';
    contentCheck.message = `Good (${wordCount} words). Aim for 1500+.`;
    contentCheck.score = 15;
    suggestions.push(`Add ${1500 - wordCount} more words to reach target`);
  } else {
    contentCheck.status = 'good';
    contentCheck.message = `Excellent (${wordCount} words)`;
    contentCheck.score = 20;
  }
  totalScore += contentCheck.score;
  
  // Keyword check (20 points)
  const keywordCheck: KeywordCheck = {
    status: 'good',
    value: keywordDensity.toFixed(2),
    keyword: focusKeyword,
    density: keywordDensity,
    inTitle: keywordInText(title, focusKeyword),
    inFirstParagraph: keywordInText(firstParagraph, focusKeyword),
    inLastParagraph: keywordInText(lastParagraph, focusKeyword),
    count: keywordCount,
    message: '',
    score: 0
  };
  
  let keywordScore = 0;
  if (keywordCheck.inTitle) keywordScore += 5;
  else suggestions.push(`Add "${focusKeyword}" to your title`);
  
  if (keywordCheck.inFirstParagraph) keywordScore += 5;
  else suggestions.push(`Add "${focusKeyword}" to first paragraph`);
  
  if (keywordCheck.inLastParagraph) keywordScore += 3;
  else suggestions.push(`Add "${focusKeyword}" to last paragraph`);
  
  if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
    keywordScore += 7;
    keywordCheck.status = 'good';
    keywordCheck.message = `Keyword density perfect (${keywordDensity.toFixed(1)}%)`;
  } else if (keywordDensity < 0.5) {
    keywordScore += 3;
    keywordCheck.status = 'warning';
    keywordCheck.message = `Keyword density low (${keywordDensity.toFixed(1)}%). Use "${focusKeyword}" more.`;
    suggestions.push(`Use "${focusKeyword}" ${Math.ceil((0.01 * wordCount) - keywordCount)} more times`);
  } else {
    keywordScore += 3;
    keywordCheck.status = 'warning';
    keywordCheck.message = `Keyword density high (${keywordDensity.toFixed(1)}%). Reduce usage.`;
    suggestions.push('Reduce keyword usage to avoid keyword stuffing');
  }
  
  keywordCheck.score = keywordScore;
  totalScore += keywordScore;
  
  // Headings check (10 points)
  const headingCheck: HeadingCheck = {
    status: 'good',
    value: `H1:${headings.h1} H2:${headings.h2} H3:${headings.h3}`,
    h1Count: headings.h1,
    h2Count: headings.h2,
    h3Count: headings.h3,
    message: '',
    score: 0
  };
  
  if (headings.h1 === 0) {
    headingCheck.status = 'error';
    headingCheck.message = 'No H1 heading found';
    headingCheck.score = 0;
    suggestions.push('Add one H1 heading');
  } else if (headings.h1 > 1) {
    headingCheck.status = 'warning';
    headingCheck.message = `Multiple H1 headings (${headings.h1}). Use only one.`;
    headingCheck.score = 5;
    suggestions.push('Use only one H1 heading per article');
  } else if (headings.h2 < 2) {
    headingCheck.status = 'warning';
    headingCheck.message = 'Add more H2 headings for structure';
    headingCheck.score = 7;
    suggestions.push('Add at least 3-5 H2 headings');
  } else {
    headingCheck.status = 'good';
    headingCheck.message = 'Good heading structure';
    headingCheck.score = 10;
  }
  totalScore += headingCheck.score;
  
  // Links check (10 points)
  const linkCheck: LinkCheck = {
    status: 'good',
    value: `Internal:${links.internal} External:${links.external}`,
    internal: links.internal,
    external: links.external,
    message: '',
    score: 0
  };
  
  let linkScore = 0;
  if (links.internal >= 3 && links.internal <= 7) {
    linkScore += 6;
  } else if (links.internal < 3) {
    linkCheck.status = 'warning';
    suggestions.push(`Add ${3 - links.internal} more internal links`);
    linkScore += 3;
  } else {
    linkScore += 5;
  }
  
  if (links.external >= 2 && links.external <= 5) {
    linkScore += 4;
  } else if (links.external < 2) {
    linkCheck.status = 'warning';
    suggestions.push(`Add ${2 - links.external} more external links`);
    linkScore += 2;
  } else {
    linkScore += 3;
  }
  
  linkCheck.score = linkScore;
  linkCheck.message = linkCheck.status === 'good' ? 'Good link structure' : 'Improve link structure';
  totalScore += linkScore;
  
  // Images check (5 points)
  const imageCheck: ImageCheck = {
    status: 'good',
    value: `${images.total} images, ${images.withAlt} with alt`,
    total: images.total,
    withAlt: images.withAlt,
    message: '',
    score: 0
  };
  
  if (images.total === 0) {
    imageCheck.status = 'warning';
    imageCheck.message = 'No images found. Add images to improve engagement.';
    imageCheck.score = 2;
    suggestions.push('Add at least 3-5 images to your article');
  } else if (images.withAlt < images.total) {
    imageCheck.status = 'warning';
    imageCheck.message = `${images.total - images.withAlt} images missing alt text`;
    imageCheck.score = 3;
    suggestions.push(`Add alt text to ${images.total - images.withAlt} images`);
  } else {
    imageCheck.status = 'good';
    imageCheck.message = 'All images have alt text';
    imageCheck.score = 5;
  }
  totalScore += imageCheck.score;
  
  // Slug check (5 points)
  const slugCheck: SEOCheck = {
    status: 'good',
    value: slug,
    message: '',
    score: 0
  };
  
  if (!slug || slug.length === 0) {
    slugCheck.status = 'error';
    slugCheck.message = 'URL slug is required';
    slugCheck.score = 0;
    suggestions.push('Add a URL slug');
  } else if (slug.length > 60) {
    slugCheck.status = 'warning';
    slugCheck.message = 'Slug too long. Keep under 60 characters.';
    slugCheck.score = 3;
    suggestions.push('Shorten URL slug');
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    slugCheck.status = 'warning';
    slugCheck.message = 'Use only lowercase letters, numbers, and hyphens';
    slugCheck.score = 3;
    suggestions.push('Fix URL slug format');
  } else {
    slugCheck.status = 'good';
    slugCheck.message = 'Good URL slug';
    slugCheck.score = 5;
  }
  totalScore += slugCheck.score;
  
  // Readability check (5 points)
  const readabilityCheck: ReadabilityCheck = {
    status: 'good',
    value: readability.toFixed(0),
    grade: readability,
    message: '',
    score: 0
  };
  
  if (readability >= 60) {
    readabilityCheck.status = 'good';
    readabilityCheck.message = 'Easy to read';
    readabilityCheck.score = 5;
  } else if (readability >= 30) {
    readabilityCheck.status = 'warning';
    readabilityCheck.message = 'Fairly difficult to read';
    readabilityCheck.score = 3;
    suggestions.push('Simplify sentences for better readability');
  } else {
    readabilityCheck.status = 'warning';
    readabilityCheck.message = 'Difficult to read';
    readabilityCheck.score = 2;
    suggestions.push('Use shorter sentences and simpler words');
  }
  totalScore += readabilityCheck.score;
  
  return {
    score: Math.round(totalScore),
    title: titleCheck,
    description: descCheck,
    content: contentCheck,
    keyword: keywordCheck,
    headings: headingCheck,
    links: linkCheck,
    images: imageCheck,
    slug: slugCheck,
    readability: readabilityCheck,
    suggestions: suggestions.slice(0, 5) // Top 5 suggestions
  };
}
