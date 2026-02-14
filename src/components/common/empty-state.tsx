'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LucideIcon, 
  Activity, 
  MessageCircle, 
  CheckCircle, 
  Zap, 
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

interface EmptyStateProps {
  className?: string;
  variant?: 'workouts' | 'messages' | 'check-ins' | 'insights' | 'plans' | 'progress' | 'calendar' | 'diary' | 'social';
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}

// Predefined empty state configurations
const emptyStateConfigs: Record<string, EmptyStateConfig> = {
  workouts: {
    icon: Activity,
    title: 'No workouts yet',
    subtitle: 'Start by adding your first workout or importing from Strava',
    action: {
      label: 'Add Workout',
      href: '/dashboard/plan?action=add'
    }
  },
  messages: {
    icon: MessageCircle,
    title: 'No messages',
    subtitle: 'Start a conversation with your coach or training partners',
    action: {
      label: 'Start Conversation',
      href: '/dashboard/messages?action=new'
    }
  },
  'check-ins': {
    icon: CheckCircle,
    title: 'No check-ins recorded',
    subtitle: 'Track your daily wellness metrics to optimize performance',
    action: {
      label: 'Record Check-in',
      href: '/dashboard/diary?action=checkin'
    }
  },
  insights: {
    icon: Zap,
    title: 'No insights available',
    subtitle: 'Keep training and checking in to unlock personalized insights'
  },
  plans: {
    icon: Target,
    title: 'No training plans',
    subtitle: 'Create a structured training plan to reach your goals',
    action: {
      label: 'Create Plan',
      href: '/dashboard/plan?action=create'
    }
  },
  progress: {
    icon: TrendingUp,
    title: 'No progress data',
    subtitle: 'Complete some workouts to see your performance trends'
  },
  calendar: {
    icon: Calendar,
    title: 'No events scheduled',
    subtitle: 'Add workouts and races to your training calendar',
    action: {
      label: 'Add Event',
      href: '/dashboard/calendar?action=add'
    }
  },
  diary: {
    icon: BookOpen,
    title: 'No entries yet',
    subtitle: 'Start logging your training journey and daily wellness',
    action: {
      label: 'Add Entry',
      href: '/dashboard/diary?action=add'
    }
  },
  social: {
    icon: Users,
    title: 'No activity',
    subtitle: 'Connect with other athletes and share your progress'
  }
};

// Animation variants
const containerVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 10 
  },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

const containerTransition = {
  duration: 0.3,
  staggerChildren: 0.1
};

const itemTransition = {
  duration: 0.2
};

export function EmptyState({ 
  className,
  variant,
  icon: customIcon,
  title: customTitle,
  subtitle: customSubtitle,
  action: customAction,
  size = 'md'
}: EmptyStateProps) {
  // Get configuration based on variant
  const config = variant ? emptyStateConfigs[variant] : null;
  
  // Use custom props or fall back to config
  const Icon = customIcon || config?.icon || Activity;
  const title = customTitle || config?.title || 'No data';
  const subtitle = customSubtitle || config?.subtitle;
  const action = customAction || config?.action;

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'py-8 space-y-4',
      icon: 'w-12 h-12',
      iconContainer: 'w-16 h-16',
      iconSize: 'w-6 h-6',
      title: 'text-base font-semibold',
      subtitle: 'text-sm',
      button: 'size-sm'
    },
    md: {
      container: 'py-12 space-y-6',
      icon: 'w-16 h-16',
      iconContainer: 'w-20 h-20',
      iconSize: 'w-8 h-8',
      title: 'text-lg font-semibold',
      subtitle: 'text-sm',
      button: 'size-default'
    },
    lg: {
      container: 'py-16 space-y-8',
      icon: 'w-20 h-20',
      iconContainer: 'w-24 h-24',
      iconSize: 'w-10 h-10',
      title: 'text-xl font-semibold',
      subtitle: 'text-base',
      button: 'size-lg'
    }
  };

  const currentSize = sizeConfig[size];

  return (
    <motion.div
      variants={containerVariants}
      transition={containerTransition}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        currentSize.container,
        className
      )}
    >
      {/* Icon */}
      <motion.div
        variants={itemVariants}
        transition={itemTransition}
        className={cn(
          "flex items-center justify-center rounded-full bg-muted/20 border border-border/30",
          currentSize.iconContainer
        )}
      >
        <Icon className={cn(
          "text-muted-foreground/60",
          currentSize.iconSize
        )} />
      </motion.div>

      {/* Content */}
      <motion.div 
        variants={itemVariants}
        transition={itemTransition}
        className="space-y-2 max-w-md"
      >
        <h3 className={cn(
          "text-foreground",
          currentSize.title
        )}>
          {title}
        </h3>
        {subtitle && (
          <p className={cn(
            "text-muted-foreground",
            currentSize.subtitle
          )}>
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Action Button */}
      {action && (
        <motion.div variants={itemVariants} transition={itemTransition}>
          {action.href ? (
            <Button 
              asChild
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={action.href}>
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={action.onClick}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              {action.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Convenient preset components
export const WorkoutsEmptyState = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState {...props} variant="workouts" />
);

export const MessagesEmptyState = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState {...props} variant="messages" />
);

export const CheckInsEmptyState = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState {...props} variant="check-ins" />
);

export const InsightsEmptyState = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState {...props} variant="insights" />
);

export const PlansEmptyState = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState {...props} variant="plans" />
);