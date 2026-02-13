'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ 
  className, 
  variant = 'full', 
  size = 'md' 
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  const LogoMark = () => (
    <div className={cn(
      "relative inline-flex items-center justify-center",
      "w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80",
      "shadow-lg shadow-primary/25",
      size === 'sm' && 'w-6 h-6',
      size === 'md' && 'w-8 h-8',
      size === 'lg' && 'w-12 h-12',
      size === 'xl' && 'w-16 h-16'
    )}>
      <span className={cn(
        "font-bold text-white",
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-2xl'
      )}>
        A
      </span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-transparent to-white/20" />
    </div>
  );

  const LogoText = () => (
    <span className={cn(
      "font-bold text-foreground tracking-tight",
      sizeClasses[size],
      "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
    )}>
      ATHLO
    </span>
  );

  if (variant === 'mark') {
    return (
      <div className={cn("inline-flex", className)}>
        <LogoMark />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn("inline-flex", className)}>
        <LogoText />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <LogoText />
    </div>
  );
}