'use client';

import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
}

export function Loading({ 
  className, 
  size = 'md', 
  variant = 'spinner',
  text 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className={cn(
          "rounded-full bg-primary animate-pulse",
          size === 'sm' && 'w-2 h-2',
          size === 'md' && 'w-3 h-3',
          size === 'lg' && 'w-4 h-4'
        )} style={{ animationDelay: '0ms' }} />
        <div className={cn(
          "rounded-full bg-primary animate-pulse",
          size === 'sm' && 'w-2 h-2',
          size === 'md' && 'w-3 h-3',
          size === 'lg' && 'w-4 h-4'
        )} style={{ animationDelay: '150ms' }} />
        <div className={cn(
          "rounded-full bg-primary animate-pulse",
          size === 'sm' && 'w-2 h-2',
          size === 'md' && 'w-3 h-3',
          size === 'lg' && 'w-4 h-4'
        )} style={{ animationDelay: '300ms' }} />
        {text && (
          <span className="ml-3 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn(
          "rounded-full bg-primary/20 animate-pulse",
          sizeClasses[size]
        )} />
        {text && (
          <span className="ml-3 text-sm text-muted-foreground animate-pulse">{text}</span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size]
      )} />
      {text && (
        <span className="ml-3 text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-muted border-t-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">ATHLO</h3>
          <p className="text-sm text-muted-foreground">Loading your training data...</p>
        </div>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}