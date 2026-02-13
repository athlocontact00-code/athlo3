'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface ReadinessData {
  score: number;
  trend: 'up' | 'down' | 'stable';
  components: {
    sleep: number;
    hrv: number;
    stress: number;
    energy: number;
    recovery: number;
  };
  lastUpdated?: Date;
  recommendation?: string;
}

interface ReadinessScoreProps {
  className?: string;
  data?: ReadinessData;
  size?: 'normal' | 'large';
  onCheckIn?: () => void;
}

const mockData: ReadinessData = {
  score: 78,
  trend: 'up',
  components: {
    sleep: 85,
    hrv: 72,
    stress: 65,
    energy: 88,
    recovery: 75,
  },
  lastUpdated: new Date(),
  recommendation: 'Good for moderate training today. Consider a recovery session tomorrow.',
};

function getScoreColor(score: number) {
  if (score >= 85) return { color: 'text-green-500', bg: 'bg-green-500' };
  if (score >= 70) return { color: 'text-blue-500', bg: 'bg-blue-500' };
  if (score >= 55) return { color: 'text-yellow-500', bg: 'bg-yellow-500' };
  if (score >= 40) return { color: 'text-orange-500', bg: 'bg-orange-500' };
  return { color: 'text-red-500', bg: 'bg-red-500' };
}

function getScoreLabel(score: number) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Very Poor';
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
}

export function ReadinessScore({ 
  className, 
  data = mockData,
  size = 'normal',
  onCheckIn 
}: ReadinessScoreProps) {
  const scoreColor = getScoreColor(data.score);
  const scoreLabel = getScoreLabel(data.score);
  
  // Calculate the stroke dasharray for the circular progress
  const radius = size === 'large' ? 55 : 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-primary" />
            Readiness
          </CardTitle>
          <div className="flex items-center gap-1">
            {getTrendIcon(data.trend)}
            <Badge variant="outline" className="text-xs">
              {scoreLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="flex items-center justify-center">
          <div className={cn(
            "relative",
            size === 'large' ? "w-40 h-40" : "w-32 h-32"
          )}>
            <svg 
              className={cn(
                "transform -rotate-90",
                size === 'large' ? "w-40 h-40" : "w-32 h-32"
              )} 
              viewBox="0 0 120 120"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth={size === 'large' ? "10" : "8"}
                fill="transparent"
                className="text-muted/30"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth={size === 'large' ? "10" : "8"}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={cn(scoreColor.color, "transition-all duration-500 ease-in-out")}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={cn(
                  "font-bold",
                  size === 'large' ? "text-4xl" : "text-3xl",
                  scoreColor.color
                )}>
                  {data.score}
                </div>
                <div className={cn(
                  "text-muted-foreground",
                  size === 'large' ? "text-sm" : "text-xs"
                )}>
                  /100
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Components</h4>
          <div className="space-y-2">
            {Object.entries(data.components).map(([key, value]) => {
              const componentColor = getScoreColor(value);
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key === 'hrv' ? 'HRV' : key}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-300", componentColor.bg)}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className={cn("text-sm font-medium w-8 text-right", componentColor.color)}>
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendation */}
        {data.recommendation && (
          <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">
              {data.recommendation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={onCheckIn}
            size="sm" 
            className="flex-1"
          >
            Update Check-in
          </Button>
          <Button variant="outline" size="sm">
            View History
          </Button>
        </div>

        {/* Last Updated */}
        {data.lastUpdated && (
          <p className="text-xs text-muted-foreground text-center">
            Last updated: {data.lastUpdated.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </CardContent>

      {/* Background Gradient */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10",
        scoreColor.bg
      )} />
    </Card>
  );
}