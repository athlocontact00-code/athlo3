'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Calendar,
  Clock,
  Target,
  Play,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface WorkoutPlan {
  id: string;
  name: string;
  sport: string;
  duration: number; // minutes
  targetZone: string;
  status: 'scheduled' | 'completed' | 'skipped';
  scheduledTime?: string;
}

interface FocusDayCardProps {
  className?: string;
  date?: Date;
  workouts?: WorkoutPlan[];
}

const mockWorkouts: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Easy Run',
    sport: 'running',
    duration: 45,
    targetZone: 'Z2',
    status: 'scheduled',
    scheduledTime: '07:00',
  },
  {
    id: '2',
    name: 'Core Strength',
    sport: 'strength',
    duration: 20,
    targetZone: 'N/A',
    status: 'scheduled',
    scheduledTime: '18:00',
  },
];

const sportIcons: Record<string, string> = {
  running: '🏃',
  cycling: '🚴',
  swimming: '🏊',
  strength: '🏋️',
  other: '💪',
};

export function FocusDayCard({ 
  className, 
  date = new Date(),
  workouts = mockWorkouts 
}: FocusDayCardProps) {
  const completedCount = workouts.filter(w => w.status === 'completed').length;
  const totalCount = workouts.length;
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <Card className={cn("bg-gradient-to-br from-card via-card to-card/95", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              {isToday ? 'Today\'s Focus' : `Focus Day`}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(date, 'EEEE, MMMM d')}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{totalCount} Complete
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-medium text-foreground mb-1">No workouts planned</h3>
            <p className="text-xs text-muted-foreground">
              This could be a rest day or add a workout to get started.
            </p>
            <Button size="sm" className="mt-3">
              Add Workout
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                  "hover:bg-muted/50",
                  workout.status === 'completed' && "bg-green-500/10 border-green-500/20",
                  workout.status === 'skipped' && "bg-red-500/10 border-red-500/20 opacity-60"
                )}
              >
                {/* Sport Icon */}
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full text-lg",
                  workout.status === 'completed' && "bg-green-500/20",
                  workout.status === 'scheduled' && "bg-primary/20",
                  workout.status === 'skipped' && "bg-red-500/20"
                )}>
                  {sportIcons[workout.sport] || '💪'}
                </div>

                {/* Workout Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {workout.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {workout.targetZone}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {workout.duration}min
                    </div>
                    {workout.scheduledTime && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {workout.scheduledTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-2">
                  {workout.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {workout.status === 'skipped' && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  {workout.status === 'scheduled' && (
                    <Button size="sm" variant="outline">
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Daily Summary */}
            <div className="flex items-center justify-between pt-3 mt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                Total planned: <span className="font-medium text-foreground">
                  {workouts.reduce((acc, w) => acc + w.duration, 0)}min
                </span>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                View All Workouts
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}