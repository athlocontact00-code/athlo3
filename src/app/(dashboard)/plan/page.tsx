'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Filter,
  PersonStanding,
  Bike,
  Dumbbell,
  Waves
} from 'lucide-react';
import { format, startOfWeek, addDays, subDays, addWeeks, subWeeks } from 'date-fns';
import { cn } from '@/lib/utils';

type WorkoutStatus = 'planned' | 'completed' | 'missed' | 'modified';

interface Workout {
  id: string;
  title: string;
  type: 'running' | 'cycling' | 'strength' | 'swimming' | 'rest';
  duration: string;
  distance?: string;
  intensity: 'easy' | 'moderate' | 'hard' | 'recovery';
  description: string;
  status: WorkoutStatus;
  actualDuration?: string;
  actualDistance?: string;
  notes?: string;
}

interface DayPlan {
  date: Date;
  workouts: Workout[];
}

export default function PlanPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showWorkoutLibrary, setShowWorkoutLibrary] = useState(false);

  // Mock weekly plan data
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weeklyPlan: DayPlan[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dayIndex = i;
    
    // Mock workout data for each day
    const workouts: Workout[] = [];
    
    if (dayIndex === 0) { // Monday
      workouts.push({
        id: '1',
        title: 'Easy Run',
        type: 'running',
        duration: '45 min',
        distance: '8 km',
        intensity: 'easy',
        description: 'Comfortable pace, focus on form',
        status: 'completed',
        actualDuration: '47 min',
        actualDistance: '8.2 km',
        notes: 'Felt great, good pace'
      });
    } else if (dayIndex === 2) { // Wednesday
      workouts.push({
        id: '2',
        title: 'Strength Training',
        type: 'strength',
        duration: '60 min',
        intensity: 'moderate',
        description: 'Upper body focus, 3 sets x 12 reps',
        status: 'planned'
      });
    } else if (dayIndex === 3) { // Thursday
      workouts.push({
        id: '3',
        title: 'Interval Run',
        type: 'running',
        duration: '50 min',
        distance: '10 km',
        intensity: 'hard',
        description: '4x1200m @ 5k pace, 2min rest',
        status: 'missed'
      });
    } else if (dayIndex === 5) { // Saturday
      workouts.push({
        id: '4',
        title: 'Long Ride',
        type: 'cycling',
        duration: '120 min',
        distance: '45 km',
        intensity: 'moderate',
        description: 'Steady effort, endurance focus',
        status: 'planned'
      });
    } else if (dayIndex === 6) { // Sunday
      workouts.push({
        id: '5',
        title: 'Recovery',
        type: 'rest',
        duration: '30 min',
        intensity: 'recovery',
        description: 'Light stretching or yoga',
        status: 'planned'
      });
    }

    return { date, workouts };
  });

  // Calculate compliance
  const totalPlannedWorkouts = weeklyPlan.reduce((sum, day) => 
    sum + day.workouts.filter(w => w.type !== 'rest').length, 0
  );
  const completedWorkouts = weeklyPlan.reduce((sum, day) => 
    sum + day.workouts.filter(w => w.status === 'completed').length, 0
  );
  const compliance = totalPlannedWorkouts > 0 ? (completedWorkouts / totalPlannedWorkouts) * 100 : 0;

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'running': return PersonStanding;
      case 'cycling': return Bike;
      case 'strength': return Dumbbell;
      case 'swimming': return Waves;
      default: return Target;
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'recovery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: WorkoutStatus) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'missed': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'modified': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-border bg-card';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(direction === 'next' ? addWeeks(currentWeek, 1) : subWeeks(currentWeek, 1));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Training Plan</h1>
          <p className="text-muted-foreground">
            Your structured weekly training schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowWorkoutLibrary(!showWorkoutLibrary)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Library
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Workout
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Plan View */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn("space-y-6", showWorkoutLibrary ? "lg:col-span-3" : "lg:col-span-4")}
        >
          {/* Compliance Bar */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Weekly Compliance</h3>
                <span className="text-2xl font-bold text-primary">{Math.round(compliance)}%</span>
              </div>
              <Progress value={compliance} className="mb-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{completedWorkouts}/{totalPlannedWorkouts} workouts completed</span>
                <span className={cn(
                  "font-medium",
                  compliance >= 80 ? "text-green-500" : 
                  compliance >= 60 ? "text-yellow-500" : 
                  "text-red-500"
                )}>
                  {compliance >= 80 ? "Excellent!" : 
                   compliance >= 60 ? "Good progress" : 
                   "Keep going!"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Week Navigation */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateWeek('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold">
                      Week of {format(weekStart, 'MMM d')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {format(weekStart, 'yyyy')}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateWeek('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  This Week
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {weeklyPlan.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {format(day.date, 'EEE')}
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {format(day.date, 'd')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {day.workouts.length > 0 ? (
                        day.workouts.map((workout) => {
                          const WorkoutIcon = getWorkoutIcon(workout.type);
                          return (
                            <motion.div
                              key={workout.id}
                              whileHover={{ scale: 1.02 }}
                              className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all",
                                getStatusColor(workout.status)
                              )}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <WorkoutIcon className="h-4 w-4" />
                                  <span className="font-medium text-sm">{workout.title}</span>
                                </div>
                                {workout.status === 'completed' && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                                {workout.status === 'missed' && (
                                  <X className="h-4 w-4 text-red-500" />
                                )}
                              </div>

                              <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {workout.duration}
                                  {workout.distance && (
                                    <>
                                      <span>•</span>
                                      <span>{workout.distance}</span>
                                    </>
                                  )}
                                </div>
                                <Badge 
                                  className={cn("text-xs", getIntensityColor(workout.intensity))}
                                >
                                  {workout.intensity}
                                </Badge>
                              </div>

                              {/* Plan vs Actual Comparison */}
                              {workout.status === 'completed' && (workout.actualDuration || workout.actualDistance) && (
                                <div className="mt-2 pt-2 border-t border-border/50">
                                  <div className="text-xs">
                                    <div className="flex items-center justify-between text-muted-foreground">
                                      <span>Planned:</span>
                                      <span>{workout.duration}{workout.distance && ` • ${workout.distance}`}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-foreground font-medium">
                                      <span>Actual:</span>
                                      <span>{workout.actualDuration}{workout.actualDistance && ` • ${workout.actualDistance}`}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {workout.notes && (
                                <div className="mt-2 text-xs text-muted-foreground italic">
                                  "{workout.notes}"
                                </div>
                              )}
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <div className="text-xs">Rest Day</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workout Library Sidebar */}
        <AnimatePresence>
          {showWorkoutLibrary && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Workout Library
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowWorkoutLibrary(false)}
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Running Templates */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      <PersonStanding className="h-3 w-3" />
                      PersonStanding
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Easy Run - 8km',
                        'Interval - 5x1km',
                        'Long Run - 15km',
                        'Tempo - 8km'
                      ].map((template, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="w-full text-left p-2 text-xs bg-background/50 hover:bg-muted/50 rounded border transition-colors"
                        >
                          {template}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Strength Templates */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" />
                      Strength
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Upper Body - 60min',
                        'Lower Body - 45min',
                        'Full Body - 75min',
                        'Core & Stability'
                      ].map((template, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="w-full text-left p-2 text-xs bg-background/50 hover:bg-muted/50 rounded border transition-colors"
                        >
                          {template}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Cycling Templates */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      <Bike className="h-3 w-3" />
                      Cycling
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Easy Ride - 90min',
                        'Hill Repeats - 60min',
                        'Long Ride - 2h+',
                        'Recovery - 45min'
                      ].map((template, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="w-full text-left p-2 text-xs bg-background/50 hover:bg-muted/50 rounded border transition-colors"
                        >
                          {template}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}