'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  className?: string;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ 
  className,
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center space-y-6 py-12",
      className
    )}>
      {Icon && (
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/30">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>
      )}
      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Button 
          variant="default"
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}