'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Plus,
  Heart,
  Lightbulb,
  Bot,
  Calendar,
  Target,
  MessageCircle,
  Zap,
  Camera,
  Upload
} from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  color?: string;
}

interface QuickActionsProps {
  className?: string;
  actions?: QuickAction[];
  layout?: 'grid' | 'list';
}

const defaultActions: QuickAction[] = [
  {
    id: 'log-workout',
    label: 'Log Workout',
    description: 'Record a completed workout',
    icon: Plus,
    href: '/dashboard/plan?action=create',
    variant: 'primary',
    color: 'bg-primary',
  },
  {
    id: 'check-in',
    label: 'Daily Check-in',
    description: 'Update readiness metrics',
    icon: Heart,
    href: '/dashboard/diary?action=checkin',
    variant: 'secondary',
    color: 'bg-red-500',
  },
  {
    id: 'view-insights',
    label: 'View Insights',
    description: 'AI-generated recommendations',
    icon: Lightbulb,
    href: '/dashboard/progress?tab=insights',
    variant: 'outline',
    color: 'bg-yellow-500',
  },
  {
    id: 'ask-coach',
    label: 'Ask AI Coach',
    description: 'Get personalized guidance',
    icon: Bot,
    href: '/dashboard/ai-coach',
    variant: 'outline',
    color: 'bg-blue-500',
  },
  {
    id: 'schedule-workout',
    label: 'Schedule',
    description: 'Plan future workouts',
    icon: Calendar,
    href: '/dashboard/calendar',
    variant: 'outline',
    color: 'bg-green-500',
  },
  {
    id: 'upload-activity',
    label: 'Upload',
    description: 'Import activity file',
    icon: Upload,
    onClick: () => {
      // Handle file upload
      console.log('Upload activity');
    },
    variant: 'outline',
    color: 'bg-purple-500',
  },
];

export function QuickActions({ 
  className, 
  actions = defaultActions,
  layout = 'grid'
}: QuickActionsProps) {
  const ActionButton = ({ action }: { action: QuickAction }) => {
    const Icon = action.icon;
    
    const buttonContent = (
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-lg transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        "group relative overflow-hidden",
        layout === 'grid' && "h-full flex-col text-center gap-2",
        layout === 'list' && "flex-row"
      )}>
        {/* Icon */}
        <div className={cn(
          "flex items-center justify-center rounded-full",
          "transition-all duration-200 group-hover:scale-110",
          layout === 'grid' && "w-12 h-12",
          layout === 'list' && "w-10 h-10 flex-shrink-0",
          action.variant === 'primary' && "bg-primary/20 text-primary",
          action.variant === 'secondary' && "bg-red-500/20 text-red-500",
          action.variant === 'outline' && "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
        )}>
          <Icon className={cn(
            layout === 'grid' && "w-6 h-6",
            layout === 'list' && "w-5 h-5"
          )} />
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1 min-w-0",
          layout === 'grid' && "text-center"
        )}>
          <h3 className={cn(
            "font-medium text-foreground",
            layout === 'grid' && "text-sm",
            layout === 'list' && "text-sm"
          )}>
            {action.label}
          </h3>
          {action.description && (
            <p className={cn(
              "text-muted-foreground",
              layout === 'grid' && "text-xs mt-1",
              layout === 'list' && "text-xs"
            )}>
              {action.description}
            </p>
          )}
        </div>

        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
      </div>
    );

    if (action.href) {
      return (
        <Link href={action.href} className="block">
          <Button
            variant="ghost"
            className={cn(
              "h-auto p-0 w-full border hover:bg-transparent",
              action.variant === 'primary' && "border-primary/20 hover:border-primary/30",
              action.variant === 'secondary' && "border-red-500/20 hover:border-red-500/30",
              action.variant === 'outline' && "border-border hover:border-primary/30"
            )}
          >
            {buttonContent}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        variant="ghost"
        onClick={action.onClick}
        className={cn(
          "h-auto p-0 w-full border hover:bg-transparent",
          action.variant === 'primary' && "border-primary/20 hover:border-primary/30",
          action.variant === 'secondary' && "border-red-500/20 hover:border-red-500/30",
          action.variant === 'outline' && "border-border hover:border-primary/30"
        )}
      >
        {buttonContent}
      </Button>
    );
  };

  if (layout === 'list') {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {actions.map((action) => (
              <ActionButton key={action.id} action={action} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}