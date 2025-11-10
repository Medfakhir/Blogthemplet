import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium">Loading Admin Panel...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait</p>
      </div>
    </div>
  );
}
