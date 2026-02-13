"use client";

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg bg-card border p-6 animate-pulse", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted rounded-lg shimmer"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded shimmer w-3/4"></div>
            <div className="h-3 bg-muted rounded shimmer w-1/2"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <div className="h-3 bg-muted rounded shimmer w-full"></div>
          <div className="h-3 bg-muted rounded shimmer w-5/6"></div>
          <div className="h-3 bg-muted rounded shimmer w-3/4"></div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex space-x-2">
            <div className="h-6 bg-muted rounded shimmer w-16"></div>
            <div className="h-6 bg-muted rounded shimmer w-12"></div>
          </div>
          <div className="h-8 bg-muted rounded shimmer w-20"></div>
        </div>
      </div>
    </div>
  );
}