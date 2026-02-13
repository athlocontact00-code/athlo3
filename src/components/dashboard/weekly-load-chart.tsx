'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  if (rampRate > 10) return 'text-yellow-500';
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
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            Weekly Load
          </CardTitle>
          <div className="flex items-center gap-2">
            {getTrendIcon(metrics.trend)}
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                getRampRateColor(metrics.rampRate)
              )}
            >
              {metrics.rampRate > 0 ? '+' : ''}{metrics.rampRate}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>This Week</span>
            <span>{metrics.currentWeek} TSS</span>
          </div>
          
          <div className="space-y-2">
            {data.map((day, index) => {
              const isToday = day.date === currentDate;
              const plannedPercent = (day.plannedLoad / maxLoad) * 100;
              const actualPercent = (day.actualLoad / maxLoad) * 100;
              const isCompleted = day.actualLoad > 0;
              const isMissed = day.plannedLoad > 0 && day.actualLoad === 0;

              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn(
                      "font-medium",
                      isToday && "text-primary",
                      isCompleted && "text-green-500",
                      isMissed && "text-red-500"
                    )}>
                      {day.date}
                    </span>
                    <div className="flex items-center gap-2">
                      {day.workouts > 0 && (
                        <span className="text-muted-foreground">
                          {day.workouts} workout{day.workouts > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="font-medium">
                        {day.actualLoad || day.plannedLoad}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    {/* Planned Load (background) */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary/30 transition-all duration-300"
                      style={{ width: `${plannedPercent}%` }}
                    />
                    
                    {/* Actual Load */}
                    <div 
                      className={cn(
                        "absolute top-0 left-0 h-full transition-all duration-300",
                        isCompleted && "bg-green-500",
                        isMissed && "bg-red-500/60",
                        !isCompleted && !isMissed && "bg-primary"
                      )}
                      style={{ width: `${actualPercent}%` }}
                    />
                    
                    {/* Today indicator */}
                    {isToday && (
                      <div className="absolute inset-0 border-2 border-primary rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary/30 rounded-full" />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500/60 rounded-full" />
            <span>Missed</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {metrics.currentWeek}
            </div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {metrics.previousWeek}
            </div>
            <div className="text-xs text-muted-foreground">Last Week</div>
          </div>
        </div>

        {/* Recommendation */}
        {metrics.recommendation && (
          <div className="flex gap-2 p-3 bg-muted/30 rounded-lg">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">
              {metrics.recommendation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}