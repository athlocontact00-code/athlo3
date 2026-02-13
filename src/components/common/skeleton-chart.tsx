"use client";

import { cn } from "@/lib/utils";

interface SkeletonChartProps {
  className?: string;
  type?: "line" | "bar" | "donut";
  height?: number;
}

export function SkeletonChart({ 
  className, 
  type = "line",
  height = 200 
}: SkeletonChartProps) {
  if (type === "donut") {
    return (
      <div className={cn("rounded-lg bg-card border p-6", className)}>
        <div className="space-y-4">
          {/* Title */}
          <div className="h-5 bg-muted rounded shimmer w-1/3"></div>
          
          {/* Donut chart */}
          <div className="flex items-center justify-center">
            <div 
              className="border-8 border-muted rounded-full shimmer"
              style={{ 
                width: height * 0.8, 
                height: height * 0.8,
                borderTopColor: 'hsl(var(--primary))',
                borderRightColor: 'hsl(var(--primary))'
              }}
            ></div>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted rounded-full shimmer"></div>
                <div className="h-3 bg-muted rounded shimmer w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "bar") {
    return (
      <div className={cn("rounded-lg bg-card border p-6", className)}>
        <div className="space-y-4">
          {/* Title */}
          <div className="h-5 bg-muted rounded shimmer w-1/3"></div>
          
          {/* Bar chart */}
          <div className="flex items-end space-x-2" style={{ height }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i}
                className="flex-1 bg-muted rounded-t shimmer"
                style={{ height: `${Math.random() * 60 + 40}%` }}
              ></div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 bg-muted rounded shimmer w-8"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default line chart
  return (
    <div className={cn("rounded-lg bg-card border p-6", className)}>
      <div className="space-y-4">
        {/* Title */}
        <div className="h-5 bg-muted rounded shimmer w-1/3"></div>
        
        {/* Line chart area */}
        <div className="relative" style={{ height }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 rounded shimmer opacity-30"></div>
          
          {/* Mock data points */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full shimmer"
              style={{
                left: `${(i / 7) * 100}%`,
                top: `${Math.random() * 60 + 20}%`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="flex justify-between">
          <div className="h-3 bg-muted rounded shimmer w-12"></div>
          <div className="h-3 bg-muted rounded shimmer w-16"></div>
        </div>
      </div>
    </div>
  );
}