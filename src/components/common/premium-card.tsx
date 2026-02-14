'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'glass' | 'outline';
  accentColor?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  hover?: boolean;
  children: React.ReactNode;
}

const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(({
  variant = 'default',
  accentColor = 'default',
  hover = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Base styles
        "rounded-xl transition-all duration-200 ease-out",
        "p-5 md:p-6", // Consistent padding
        
        // Variant styles
        {
          // Default card
          'default': "bg-card border border-border/50 shadow-sm",
          
          // Elevated card
          'elevated': "bg-card border border-border/50 shadow-md hover:shadow-lg",
          
          // Interactive card (with hover effects)
          'interactive': cn(
            "bg-card border border-border/50 shadow-sm cursor-pointer",
            "hover:shadow-md hover:-translate-y-0.5 hover:border-border/70",
            "active:translate-y-0 active:shadow-sm"
          ),
          
          // Glass morphism card
          'glass': cn(
            "glass border border-border/30 shadow-sm backdrop-blur-md",
            "bg-card/80"
          ),
          
          // Outline only card
          'outline': "bg-transparent border border-border/50 hover:border-border/70 hover:bg-card/30",
        }[variant],
        
        // Accent top border
        {
          'primary': "border-t-2 border-t-primary",
          'success': "border-t-2 border-t-green-500",
          'warning': "border-t-2 border-t-amber-500",
          'info': "border-t-2 border-t-blue-500",
          'default': "",
        }[accentColor],
        
        // Optional hover effects (for non-interactive variants)
        hover && variant !== 'interactive' && cn(
          "hover:shadow-md hover:-translate-y-0.5 hover:border-border/70 cursor-pointer"
        ),
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

PremiumCard.displayName = "PremiumCard";

// Card Header Component
export interface PremiumCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PremiumCardHeader = forwardRef<HTMLDivElement, PremiumCardHeaderProps>(({
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-start justify-between mb-4",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {title && (
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  );
});

PremiumCardHeader.displayName = "PremiumCardHeader";

// Card Content Component
export interface PremiumCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardContent = forwardRef<HTMLDivElement, PremiumCardContentProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm text-card-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
});

PremiumCardContent.displayName = "PremiumCardContent";

// Card Footer Component
export interface PremiumCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardFooter = forwardRef<HTMLDivElement, PremiumCardFooterProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mt-4 pt-4 border-t border-border/30 flex items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

PremiumCardFooter.displayName = "PremiumCardFooter";

// Metric Card - specialized for displaying stats
export interface MetricCardProps extends Omit<PremiumCardProps, 'children'> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'default',
  className,
  ...props
}, ref) => {
  return (
    <PremiumCard
      ref={ref}
      variant="default"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <div className="space-y-1">
            <p className={cn(
              "text-2xl font-bold font-mono tabular-nums",
              {
                'text-foreground': color === 'default',
                'text-primary': color === 'primary',
                'text-green-600 dark:text-green-400': color === 'success',
                'text-amber-600 dark:text-amber-400': color === 'warning',
                'text-red-600 dark:text-red-400': color === 'danger',
              }
            )}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg",
            {
              'bg-muted': color === 'default',
              'bg-primary/10 text-primary': color === 'primary',
              'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400': color === 'success',
              'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400': color === 'warning',
              'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': color === 'danger',
            }
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          <span className={cn(
            "font-medium",
            trend.isPositive 
              ? "text-green-600 dark:text-green-400" 
              : "text-red-600 dark:text-red-400"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-muted-foreground">
            {trend.label}
          </span>
        </div>
      )}
    </PremiumCard>
  );
});

MetricCard.displayName = "MetricCard";

export { 
  PremiumCard, 
  PremiumCardHeader, 
  PremiumCardContent, 
  PremiumCardFooter,
  MetricCard 
};