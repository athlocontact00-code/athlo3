"use client";

import { cn } from "@/lib/utils";
import { SkeletonCard } from "./skeleton-card";
import { SkeletonChart } from "./skeleton-chart";
import { SkeletonList } from "./skeleton-list";

interface LoadingSkeletonProps {
  variant: "card" | "chart" | "list" | "form" | "dashboard" | "calendar-cell";
  className?: string;
  count?: number;
  chartType?: "line" | "bar" | "donut";
  listVariant?: "chat" | "workout" | "calendar" | "simple";
  height?: number;
}

export function LoadingSkeleton({ 
  variant, 
  className, 
  count = 3,
  chartType = "line",
  listVariant = "simple",
  height = 200
}: LoadingSkeletonProps) {
  
  if (variant === "card") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <SkeletonChart 
        className={className} 
        type={chartType}
        height={height}
      />
    );
  }

  if (variant === "list") {
    return (
      <SkeletonList 
        className={className}
        items={count}
        variant={listVariant}
      />
    );
  }

  if (variant === "form") {
    return (
      <div className={cn("space-y-6 p-6 bg-card rounded-lg border", className)}>
        {/* Form title */}
        <div className="h-6 bg-muted rounded shimmer w-1/3"></div>
        
        {/* Form fields */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded shimmer w-1/4"></div>
            <div className="h-10 bg-muted rounded-md shimmer w-full"></div>
          </div>
        ))}
        
        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <div className="h-10 bg-muted rounded shimmer w-24"></div>
          <div className="h-10 bg-primary/20 rounded shimmer w-32"></div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded shimmer w-1/2"></div>
                <div className="h-8 bg-muted rounded shimmer w-3/4"></div>
                <div className="h-3 bg-muted rounded shimmer w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart type="line" height={300} />
          <SkeletonChart type="donut" height={300} />
        </div>
        
        {/* Recent activity */}
        <SkeletonList variant="workout" items={3} />
      </div>
    );
  }

  if (variant === "calendar-cell") {
    return (
      <div className={cn("aspect-square min-h-[120px] bg-card border rounded-md p-2", className)}>
        <div className="h-4 w-4 bg-muted rounded shimmer mb-2"></div>
        <div className="space-y-1">
          {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 rounded shimmer",
                i === 0 ? "bg-primary/30" : 
                i === 1 ? "bg-secondary/30" : "bg-muted/30"
              )}
              style={{ width: `${Math.random() * 40 + 60}%` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-muted rounded shimmer w-3/4"></div>
    </div>
  );
}