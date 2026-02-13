'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Heart, Target, AlertTriangle, Lightbulb, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsight {
  type: 'performance' | 'recovery' | 'nutrition' | 'technique' | 'goal' | 'warning';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionable?: boolean;
}

interface AIInsightCardProps {
  insight: AIInsight;
  compact?: boolean;
  className?: string;
}

export function AIInsightCard({ insight, compact = false, className }: AIInsightCardProps) {
  const getIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'performance':
        return TrendingUp;
      case 'recovery':
        return Heart;
      case 'nutrition':
        return Target;
      case 'technique':
        return Lightbulb;
      case 'goal':
        return Target;
      case 'warning':
        return AlertTriangle;
      default:
        return Lightbulb;
    }
  };

  const getIconColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'performance':
        return 'text-primary';
      case 'recovery':
        return 'text-green-500';
      case 'nutrition':
        return 'text-blue-500';
      case 'technique':
        return 'text-purple-500';
      case 'goal':
        return 'text-indigo-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-primary';
    }
  };

  const getBorderColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-primary/50';
      case 'medium':
        return 'border-yellow-500/50';
      case 'low':
        return 'border-muted';
      default:
        return 'border-muted';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const Icon = getIcon(insight.type);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "bg-card/30 backdrop-blur-sm border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer",
          getBorderColor(insight.priority),
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-background/50",
            insight.priority === 'high' && "bg-primary/10",
            insight.priority === 'medium' && "bg-yellow-500/10"
          )}>
            <Icon className={cn("h-4 w-4", getIconColor(insight.type))} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-foreground truncate">
                {insight.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="h-3 w-3" />
                {getTimeAgo(insight.timestamp)}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {insight.description}
            </p>

            {insight.actionable && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-md transition-colors"
              >
                View Details
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        "bg-card/50 backdrop-blur-sm border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer",
        getBorderColor(insight.priority),
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl bg-background/50",
          insight.priority === 'high' && "bg-primary/10",
          insight.priority === 'medium' && "bg-yellow-500/10"
        )}>
          <Icon className={cn("h-5 w-5", getIconColor(insight.type))} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              {insight.title}
            </h3>
            <div className="flex items-center gap-2">
              {insight.priority === 'high' && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {getTimeAgo(insight.timestamp)}
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            {insight.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "px-2 py-1 rounded-md text-xs font-medium",
                insight.priority === 'high' && "bg-primary/10 text-primary",
                insight.priority === 'medium' && "bg-yellow-500/10 text-yellow-600",
                insight.priority === 'low' && "bg-muted text-muted-foreground"
              )}>
                {insight.priority} priority
              </div>
              <div className="px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground">
                {insight.type}
              </div>
            </div>

            {insight.actionable && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Take Action
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}