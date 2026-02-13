'use client';

import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingHeatmapMiniProps {
  className?: string;
}

export function TrainingHeatmapMini({ className }: TrainingHeatmapMiniProps) {
  // Generate 3 months of mock training data
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Generate realistic training patterns
      let intensity = 0;
      if (Math.random() > 0.3) { // 70% chance of some activity
        if (isWeekend) {
          intensity = Math.floor(Math.random() * 3) + 2; // 2-4 for weekends (longer sessions)
        } else {
          intensity = Math.floor(Math.random() * 4) + 1; // 1-4 for weekdays
        }
      }
      
      data.push({
        date: new Date(d),
        intensity,
        workoutCount: intensity > 0 ? Math.floor(Math.random() * 2) + 1 : 0
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();
  
  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-muted/30';
      case 1: return 'bg-primary/20';
      case 2: return 'bg-primary/40';
      case 3: return 'bg-primary/60';
      case 4: return 'bg-primary/80';
      default: return 'bg-muted/30';
    }
  };

  const getIntensityLabel = (intensity: number) => {
    switch (intensity) {
      case 0: return 'No activity';
      case 1: return 'Light training';
      case 2: return 'Moderate training';
      case 3: return 'Intensive training';
      case 4: return 'Very intensive training';
      default: return 'No activity';
    }
  };

  // Calculate streaks and stats
  const currentStreak = () => {
    let streak = 0;
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].intensity > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const totalWorkouts = heatmapData.reduce((sum, day) => sum + day.workoutCount, 0);
  const activedays = heatmapData.filter(day => day.intensity > 0).length;

  // Group data by weeks for display
  const weeklyData: (typeof heatmapData)[] = [];
  let currentWeek: typeof heatmapData = [];
  
  heatmapData.forEach((day, index) => {
    const dayOfWeek = day.date.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeklyData.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    if (index === heatmapData.length - 1) {
      weeklyData.push([...currentWeek]);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Training Activity</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          Last 3 months
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{totalWorkouts}</div>
          <div className="text-xs text-muted-foreground">Workouts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{activedays}</div>
          <div className="text-xs text-muted-foreground">Active Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{currentStreak()}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center h-4 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {weeklyData.map((week, weekIndex) => (
            <motion.div
              key={weekIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: weekIndex * 0.05 }}
              className="grid grid-cols-7 gap-1"
            >
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const day = week[dayIndex];
                return (
                  <motion.div
                    key={dayIndex}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className={cn(
                      "w-3 h-3 rounded-sm cursor-pointer transition-all",
                      day ? getIntensityColor(day.intensity) : 'bg-transparent'
                    )}
                    title={day ? `${day.date.toLocaleDateString()}: ${getIntensityLabel(day.intensity)}` : undefined}
                  />
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div
              key={intensity}
              className={cn("w-3 h-3 rounded-sm", getIntensityColor(intensity))}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Trend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-primary/5 rounded-lg flex items-center gap-2"
      >
        <TrendingUp className="h-4 w-4 text-primary" />
        <div className="text-sm">
          <p className="text-foreground font-medium">
            {activedays > 60 ? 'Excellent consistency!' : activedays > 40 ? 'Good training pattern' : 'Room for improvement'}
          </p>
          <p className="text-muted-foreground text-xs">
            {activedays > 60 
              ? 'You\'ve been very consistent with your training'
              : activedays > 40 
              ? 'Keep up the momentum with regular sessions'
              : 'Try to establish a more regular routine'
            }
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}