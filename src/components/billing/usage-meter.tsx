'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UsageItem {
  name: string;
  used: number;
  limit: number;
  unit: string;
  color?: 'green' | 'yellow' | 'red';
}

interface UsageMeterProps {
  title?: string;
  items: UsageItem[];
  className?: string;
}

function getUsageColor(percentage: number, customColor?: string): string {
  if (customColor) {
    switch (customColor) {
      case 'green': return 'bg-green-600';
      case 'yellow': return 'bg-yellow-600';
      case 'red': return 'bg-red-600';
    }
  }
  
  if (percentage >= 90) return 'bg-red-600';
  if (percentage >= 75) return 'bg-yellow-600';
  return 'bg-green-600';
}

function getBackgroundColor(percentage: number, customColor?: string): string {
  if (customColor) {
    switch (customColor) {
      case 'green': return 'bg-green-600/20';
      case 'yellow': return 'bg-yellow-600/20';
      case 'red': return 'bg-red-600/20';
    }
  }
  
  if (percentage >= 90) return 'bg-red-600/20';
  if (percentage >= 75) return 'bg-yellow-600/20';
  return 'bg-green-600/20';
}

function formatUsage(used: number, limit: number, unit: string): string {
  if (limit === -1) return `${used.toLocaleString()} ${unit}`;
  return `${used.toLocaleString()} / ${limit.toLocaleString()} ${unit}`;
}

export function UsageMeter({ title = "Current Usage", items, className }: UsageMeterProps) {
  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="space-y-4">
        {items.map((item) => {
          const percentage = item.limit === -1 ? 0 : Math.min((item.used / item.limit) * 100, 100);
          const isUnlimited = item.limit === -1;
          
          return (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className={cn(
                  "text-xs",
                  percentage >= 90 ? "text-red-400" : "text-muted-foreground"
                )}>
                  {formatUsage(item.used, item.limit, item.unit)}
                </span>
              </div>
              
              {!isUnlimited && (
                <div className="relative">
                  <div className={cn(
                    "w-full h-2 rounded-full",
                    getBackgroundColor(percentage, item.color)
                  )} />
                  <motion.div
                    className={cn(
                      "absolute top-0 left-0 h-2 rounded-full",
                      getUsageColor(percentage, item.color)
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              )}
              
              {isUnlimited && (
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  Unlimited
                </div>
              )}
              
              {!isUnlimited && percentage >= 90 && (
                <div className="text-xs text-red-400">
                  ⚠️ Approaching limit
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          Usage resets on your billing cycle. 
          <span className="text-red-400 hover:text-red-300 cursor-pointer ml-1">
            Upgrade to increase limits →
          </span>
        </p>
      </div>
    </Card>
  );
}