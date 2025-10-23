"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Loader2, Check, X, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SEOImageUploadProps {
  onImageUploaded: (imageData: any) => void;
  context?: string; // Article title or context for SEO
  className?: string;
}

interface UploadedImage {
  url: string;
  originalUrl: string;
  responsiveUrls: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  altText: string;
  description: string;
  seoFilename: string;
  cacheVersion: number;
}

export default function SEOImageUpload({ onImageUploaded, context, className }: SEOImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate smart alt text based on context
  const generateSmartAltText = (filename: string) => {
    const contextPart = context ? `${context} - ` : '';
    const cleanFilename = filename.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return `${contextPart}${cleanFilename} - IPTV Guide Image`;
  };

  // Generate smart description
  const generateSmartDescription = (filename: string) => {
    const contextPart = context ? `Related to ${context}. ` : '';
    return `${contextPart}High-quality image for IPTV blog content. Optimized for fast loading and SEO.`;
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Auto-generate SEO-friendly alt text and description
    if (!altText) {
      setAltText(generateSmartAltText(file.name));
    }
    if (!description) {
      setDescription(generateSmartDescription(file.name));
    }

    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', context || '');
      formData.append('altText', altText);
      formData.append('description', description);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const imageData = {
          url: result.url,
          originalUrl: result.originalUrl,
          responsiveUrls: result.responsiveUrls,
          altText: result.altText,
          description: result.description,
          seoFilename: result.seoFilename,
          cacheVersion: result.cacheVersion
        };

        setUploadedImage(imageData);
        onImageUploaded(imageData);
        
        toast.success('🚀 Image uploaded with SEO optimization!', {
          description: `Cache-busted URL generated for instant freshness`
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const refreshCache = async () => {
    if (!uploadedImage) return;
    
    // Generate new cache-busting URL
    const timestamp = Date.now();
    const separator = uploadedImage.originalUrl.includes('?') ? '&' : '?';
    const newUrl = `${uploadedImage.originalUrl}${separator}v=${timestamp}&cache=refresh`;
    
    const updatedImage = {
      ...uploadedImage,
      url: newUrl,
      cacheVersion: timestamp
    };
    
    setUploadedImage(updatedImage);
    onImageUploaded(updatedImage);
    
    toast.success('🔄 Cache refreshed!', {
      description: 'New cache-busting URL generated'
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          SEO-Optimized Image Upload
          <Badge variant="secondary" className="text-xs">
            Cache Busting Enabled
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SEO Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="altText">Alt Text (SEO)</Label>
            <Input
              id="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive alt text for SEO..."
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Image Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for metadata..."
              className="text-sm"
            />
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">
                Uploading with SEO optimization...
              </p>
            </div>
          ) : uploadedImage ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={uploadedImage.responsiveUrls.medium}
                  alt={uploadedImage.altText}
                  className="max-w-full h-32 object-cover mx-auto rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Optimized
                </Badge>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="font-medium text-green-600">✅ Upload Successful!</p>
                <p className="text-muted-foreground">SEO Filename: {uploadedImage.seoFilename}</p>
                <p className="text-muted-foreground">Cache Version: {uploadedImage.cacheVersion}</p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshCache}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh Cache
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadedImage(null);
                    setAltText('');
                    setDescription('');
                  }}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Drop image here or click to upload</p>
                <p className="text-xs text-muted-foreground">
                  Auto-generates SEO filenames & cache-busting URLs
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                <Image className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {/* SEO Benefits Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">🚀 SEO Benefits:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Cache-busting URLs for instant freshness</li>
            <li>• SEO-friendly filenames with keywords</li>
            <li>• Responsive image sizes (WebP format)</li>
            <li>• Optimized metadata for search engines</li>
            <li>• Fast loading for better Core Web Vitals</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
