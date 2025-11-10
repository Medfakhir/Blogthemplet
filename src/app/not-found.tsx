import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FileQuestion className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-6xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. 
            The page may have been moved or deleted.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/articles">
              <Search className="h-4 w-4 mr-2" />
              Browse Articles
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please{' '}
            <Link href="/pages/contact" className="text-primary hover:underline">
              contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
