'use client';

import { PremiumCard } from '@/components/common/premium-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Info
} from 'lucide-react';

interface LoadData {
  date: string;
  plannedLoad: number;
  actualLoad: number;
  workouts: number;
}

interface WeeklyLoadMetrics {
  currentWeek: number;
  previousWeek: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  rampRate: number; // percentage change
  recommendation?: string;
}

interface WeeklyLoadChartProps {
  className?: string;
  data?: LoadData[];
  metrics?: WeeklyLoadMetrics;
}

const mockData: LoadData[] = [
  { date: 'Mon', plannedLoad: 120, actualLoad: 115, workouts: 2 },
  { date: 'Tue', plannedLoad: 80, actualLoad: 85, workouts: 1 },
  { date: 'Wed', plannedLoad: 150, actualLoad: 140, workouts: 2 },
  { date: 'Thu', plannedLoad: 90, actualLoad: 95, workouts: 1 },
  { date: 'Fri', plannedLoad: 110, actualLoad: 0, workouts: 0 },
  { date: 'Sat', plannedLoad: 200, actualLoad: 0, workouts: 0 },
  { date: 'Sun', plannedLoad: 60, actualLoad: 0, workouts: 0 },
];

const mockMetrics: WeeklyLoadMetrics = {
  currentWeek: 435,
  previousWeek: 520,
  change: -85,
  trend: 'down',
  rampRate: -16.3,
  recommendation: 'Good recovery week. Ready to increase load next week.',
};

function getTrendIcon(trend: string, size = 'w-4 h-4') {
  switch (trend) {
    case 'up':
      return <TrendingUp className={cn(size, "text-green-500")} />;
    case 'down':
      return <TrendingDown className={cn(size, "text-red-500")} />;
    default:
      return <Minus className={cn(size, "text-muted-foreground")} />;
  }
}

function getRampRateColor(rampRate: number) {
  if (rampRate > 20) return 'text-red-500';
  if (rampRate > 10) return 'text-amber-500';
  if (rampRate > -10) return 'text-green-500';
  if (rampRate > -20) return 'text-blue-500';
  return 'text-red-500';
}

export function WeeklyLoadChart({ 
  className, 
  data = mockData,
  metrics = mockMetrics 
}: WeeklyLoadChartProps) {
  const maxLoad = Math.max(...data.map(d => Math.max(d.plannedLoad, d.actualLoad)));
  const currentDate = new Date().toLocaleDateString('en', { weekday: 'short' }).slice(0, 3);

  return (
    <PremiumCard className={className}>
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Weekly Load
        </h3>
        <div className="flex items-center gap-2">
          {getTrendIcon(metrics.trend)}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs border-border/50",
              getRampRateColor(metrics.rampRate)
            )}
          >
            {metrics.rampRate > 0 ? '+' : ''}{metrics.rampRate}%
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Chart */}
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>This Week</span>
            <span className="font-mono font-bold">{metrics.currentWeek} TSS</span>
          </div>
          
          <div className="space-y-3">
            {data.map((day, index) => {
              const isToday = day.date === currentDate;
              const plannedPercent = (day.plannedLoad / maxLoad) * 100;
              const actualPercent = (day.actualLoad / maxLoad) * 100;
              const isCompleted = day.actualLoad > 0;
              const isMissed = day.plannedLoad > 0 && day.actualLoad === 0;

              return (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn(
                      "font-medium w-8",
                      isToday && "text-primary font-semibold",
                      isCompleted && "text-green-500",
                      isMissed && "text-red-500"
                    )}>
                      {day.date}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {day.workouts > 0 && (
                        <span>
                          {day.workouts}
                        </span>
                      )}
                      <span className="font-mono font-bold text-foreground min-w-[3ch]">
                        {day.actualLoad || day.plannedLoad}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-2 bg-border/20 rounded-full overflow-hidden">
                    {/* Planned Load (background) - very subtle */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-muted/60 transition-all duration-300 ease-out"
                      style={{ width: `${plannedPercent}%` }}
                    />
                    
                    {/* Actual Load - primary colors */}
                    <div 
                      className={cn(
                        "absolute top-0 left-0 h-full transition-all duration-300 ease-out rounded-full",
                        isCompleted && "bg-green-500",
                        isMissed && "bg-red-500/70",
                        !isCompleted && !isMissed && "bg-primary"
                      )}
                      style={{ width: `${actualPercent}%` }}
                    />
                    
                    {/* Today indicator - subtle glow */}
                    {isToday && (
                      <div className="absolute inset-0 border border-primary/60 rounded-full shadow-glow" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inline Legend - minimal design */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-muted/60 rounded-full" />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500/70 rounded-full" />
            <span>Missed</span>
          </div>
        </div>

        {/* Metrics - clean layout */}
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/30">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold font-mono text-foreground">
              {metrics.currentWeek}
            </div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold font-mono text-muted-foreground">
              {metrics.previousWeek}
            </div>
            <div className="text-xs text-muted-foreground">Last Week</div>
          </div>
        </div>

        {/* Recommendation - premium styling */}
        {metrics.recommendation && (
          <div className="flex gap-3 p-4 bg-muted/20 border border-border/30 rounded-lg">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">
              {metrics.recommendation}
            </p>
          </div>
        )}
      </div>
    </PremiumCard>
  );
}