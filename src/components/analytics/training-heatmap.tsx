'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DayData {
  date: string;
  workouts: number;
  totalLoad: number;
  intensity: 'none' | 'light' | 'medium' | 'heavy' | 'intense';
}

interface TooltipData extends DayData {
  dayName: string;
  formattedDate: string;
}

// Generate mock data for 52 weeks
function generateMockData(): DayData[] {
  const data: DayData[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (52 * 7)); // 52 weeks ago
  
  for (let i = 0; i < 52 * 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Random training data with some patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const random = Math.random();
    
    let workouts = 0;
    let totalLoad = 0;
    let intensity: DayData['intensity'] = 'none';
    
    if (random > 0.2) { // 80% chance of training
      workouts = isWeekend ? (random > 0.5 ? 1 : 0) : (random > 0.7 ? 2 : 1);
      
      if (workouts > 0) {
        totalLoad = Math.floor(Math.random() * 100) + 20;
        
        if (totalLoad >= 80) intensity = 'intense';
        else if (totalLoad >= 60) intensity = 'heavy';
        else if (totalLoad >= 40) intensity = 'medium';
        else intensity = 'light';
      }
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      workouts,
      totalLoad,
      intensity,
    });
  }
  
  return data;
}

const intensityColors = {
  none: 'bg-gray-800/30',
  light: 'bg-red-600/20',
  medium: 'bg-red-600/50',
  heavy: 'bg-red-600/75',
  intense: 'bg-red-600',
};

const intensityLabels = {
  none: 'No training',
  light: 'Light training',
  medium: 'Moderate training',
  heavy: 'Heavy training',
  intense: 'Intense training',
};

export function TrainingHeatmap() {
  const [data] = useState(() => generateMockData());
  const [hoveredDay, setHoveredDay] = useState<TooltipData | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Group data into weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  
  // Calculate visible weeks (show 26 weeks at a time)
  const visibleWeeks = weeks.slice(currentWeek, currentWeek + 26);
  
  const handleDayHover = (day: DayData, dayIndex: number) => {
    const date = new Date(day.date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    setHoveredDay({
      ...day,
      dayName: dayNames[dayIndex],
      formattedDate: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
    });
  };
  
  const handleDayLeave = () => {
    setHoveredDay(null);
  };
  
  const canGoBack = currentWeek > 0;
  const canGoForward = currentWeek + 26 < weeks.length;
  
  const goBack = () => {
    if (canGoBack) {
      setCurrentWeek(Math.max(0, currentWeek - 13));
    }
  };
  
  const goForward = () => {
    if (canGoForward) {
      setCurrentWeek(Math.min(weeks.length - 26, currentWeek + 13));
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Training Heatmap</h3>
          <p className="text-sm text-muted-foreground">
            Your training activity over the past year
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goBack}
            disabled={!canGoBack}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={goForward}
            disabled={!canGoForward}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Heatmap */}
      <div className="relative mb-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Day labels */}
            <div className="flex mb-2">
              <div className="w-8" /> {/* Space for week day labels */}
              <div className="flex-1">
                <div className="grid grid-cols-26 gap-1 text-xs text-muted-foreground">
                  {visibleWeeks.map((_, weekIndex) => (
                    <div key={weekIndex} className="text-center">
                      {weekIndex % 4 === 0 && (
                        <span className="text-[10px]">
                          {new Date(visibleWeeks[weekIndex]?.[0]?.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Calendar grid */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, dayIndex) => (
              <div key={dayName} className="flex items-center mb-1">
                <div className="w-8 text-xs text-muted-foreground text-right pr-2">
                  {dayIndex % 2 === 0 && dayName}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-26 gap-1">
                    {visibleWeeks.map((week, weekIndex) => {
                      const day = week[dayIndex + 1] || week[dayIndex]; // Handle week start offset
                      if (!day) return <div key={weekIndex} className="w-3 h-3" />;
                      
                      const isToday = day.date === today;
                      
                      return (
                        <motion.div
                          key={`${weekIndex}-${dayIndex}`}
                          className={cn(
                            'w-3 h-3 rounded-sm cursor-pointer border border-gray-700/50',
                            intensityColors[day.intensity],
                            isToday && 'ring-2 ring-red-500 ring-offset-1 ring-offset-gray-900'
                          )}
                          whileHover={{ scale: 1.2 }}
                          onMouseEnter={() => handleDayHover(day, dayIndex)}
                          onMouseLeave={handleDayLeave}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-10 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="space-y-1">
              <div className="font-medium text-sm">
                {hoveredDay.dayName}, {hoveredDay.formattedDate}
              </div>
              <div className="text-xs text-muted-foreground">
                {hoveredDay.workouts > 0 ? (
                  <>
                    <div>{hoveredDay.workouts} workout{hoveredDay.workouts > 1 ? 's' : ''}</div>
                    <div>{hoveredDay.totalLoad} TSS</div>
                    <div className="text-red-400">{intensityLabels[hoveredDay.intensity]}</div>
                  </>
                ) : (
                  <div>No training</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {Object.entries(intensityColors).map(([intensity, colorClass]) => (
              <div
                key={intensity}
                className={cn('w-3 h-3 rounded-sm border border-gray-700/50', colorClass)}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="w-3 h-3" />
          <span>Click and drag to scroll</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-border/40">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-red-400">
              {data.filter(d => d.workouts > 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Days trained</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-400">
              {Math.max(...data.map(d => d.workouts))}
            </div>
            <div className="text-xs text-muted-foreground">Max workouts/day</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-400">
              {Math.round(data.reduce((sum, d) => sum + d.totalLoad, 0) / data.length)}
            </div>
            <div className="text-xs text-muted-foreground">Avg daily load</div>
          </div>
        </div>
      </div>
    </Card>
  );
}