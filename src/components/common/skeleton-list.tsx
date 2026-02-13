"use client";

import { cn } from "@/lib/utils";

interface SkeletonListProps {
  className?: string;
  items?: number;
  variant?: "chat" | "workout" | "calendar" | "simple";
}

export function SkeletonList({ 
  className, 
  items = 5,
  variant = "simple"
}: SkeletonListProps) {
  
  if (variant === "chat") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className={cn(
            "flex space-x-3 p-3 rounded-lg",
            i % 2 === 0 ? "justify-start" : "justify-end"
          )}>
            {i % 2 === 0 && (
              <div className="w-8 h-8 bg-muted rounded-full shimmer flex-shrink-0"></div>
            )}
            <div className={cn(
              "space-y-2 max-w-xs",
              i % 2 === 0 ? "" : "order-first"
            )}>
              <div className={cn(
                "h-3 bg-muted rounded shimmer",
                i % 2 === 0 ? "w-3/4" : "w-2/3"
              )}></div>
              {Math.random() > 0.5 && (
                <div className={cn(
                  "h-3 bg-muted rounded shimmer",
                  i % 2 === 0 ? "w-1/2" : "w-3/4"
                )}></div>
              )}
              <div className="h-2 bg-muted rounded shimmer w-16 opacity-60"></div>
            </div>
            {i % 2 !== 0 && (
              <div className="w-8 h-8 bg-muted rounded-full shimmer flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "workout") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-card rounded-lg border">
            <div className="w-12 h-12 bg-muted rounded-lg shimmer flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="h-4 bg-muted rounded shimmer w-1/2"></div>
                <div className="h-3 bg-muted rounded shimmer w-16"></div>
              </div>
              <div className="h-3 bg-muted rounded shimmer w-3/4"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-muted rounded shimmer w-20"></div>
                <div className="h-3 bg-muted rounded shimmer w-16"></div>
                <div className="h-3 bg-muted rounded shimmer w-24"></div>
              </div>
            </div>
            <div className="w-6 h-6 bg-muted rounded shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "calendar") {
    return (
      <div className={cn("grid grid-cols-7 gap-1", className)}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-square bg-card border rounded-md p-2">
            <div className="h-4 w-4 bg-muted rounded shimmer mb-1"></div>
            {Math.random() > 0.7 && (
              <div className="space-y-1">
                <div className="h-1 bg-primary/30 rounded shimmer"></div>
                <div className="h-1 bg-secondary/30 rounded shimmer w-3/4"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default simple list
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3">
          <div className="w-10 h-10 bg-muted rounded-full shimmer flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded shimmer w-3/4"></div>
            <div className="h-3 bg-muted rounded shimmer w-1/2"></div>
          </div>
          <div className="w-6 h-6 bg-muted rounded shimmer"></div>
        </div>
      ))}
    </div>
  );
}