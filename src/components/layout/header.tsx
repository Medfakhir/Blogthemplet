"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, Tv } from "lucide-react";
import { useRealtime } from "@/contexts/realtime-context";
import { useRouter } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
}

export default function Header() {
  const { data: realtimeData, isConnected, isInitialLoading, updateData } = useRealtime();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteName, setSiteName] = useState(""); // Start empty to avoid flash
  const [logoUrl, setLogoUrl] = useState("");
  const [navigation, setNavigation] = useState<NavigationItem[]>([
    { name: "Home", href: "/" },
  ]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update site name and logo from real-time data
  useEffect(() => {
    // Always update site name when we have data
    if (realtimeData.siteName) {
      setSiteName(realtimeData.siteName);
    }
    
    // Update logo URL from settings
    if (realtimeData.settings && typeof realtimeData.settings.logoUrl === 'string') {
      setLogoUrl(realtimeData.settings.logoUrl);
    } else if (realtimeData.settings) {
      // Clear logo if no logoUrl in settings
      setLogoUrl("");
    }
  }, [realtimeData.siteName, realtimeData.settings]);

  // Update navigation from real-time categories - only when we have real data
  useEffect(() => {
    if (realtimeData.categories && realtimeData.categories.length > 0) {
      interface Category {
        showInMenu?: boolean;
        isActive?: boolean;
        menuOrder?: number;
        menuLabel?: string;
        name: string;
        slug: string;
      }
      const menuCategories = (realtimeData.categories as Category[])
        .filter((cat) => cat.showInMenu && cat.isActive)
        .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0))
        .map((cat) => ({
          name: cat.menuLabel || cat.name,
          href: `/category/${cat.slug}`
        }));
      
      setNavigation([
        { name: "Home", href: "/" },
        ...menuCategories
      ]);
    }
  }, [realtimeData.categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  // No need to fetch data here anymore - the context handles it

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {!isMounted || isInitialLoading ? (
              <div className="animate-pulse bg-gray-200 rounded w-8 h-8"></div>
            ) : logoUrl ? (
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Tv className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <span className="font-bold text-xl">
              {!isMounted || isInitialLoading || !siteName ? (
                <div className="animate-pulse bg-gray-200 rounded h-6 w-24"></div>
              ) : (
                siteName
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {!isMounted || isInitialLoading ? (
              <>
                <div className="animate-pulse bg-gray-200 rounded h-4 w-12"></div>
                <div className="animate-pulse bg-gray-200 rounded h-4 w-16"></div>
                <div className="animate-pulse bg-gray-200 rounded h-4 w-14"></div>
              </>
            ) : (
              navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {item.name}
                </button>
              ))
            )}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Search button - visible on all screen sizes */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              {/* Search option in mobile menu */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMenuOpen(false);
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search Articles</span>
              </button>
              
              {/* Navigation links */}
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg z-50">
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 sm:h-10"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={!searchQuery.trim()}
                    className="flex-1 sm:flex-none h-12 sm:h-10"
                  >
                    Search
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSearchOpen(false)}
                    className="h-12 sm:h-10 px-3"
                    title="Close search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
