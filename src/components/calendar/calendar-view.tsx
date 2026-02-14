'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  getWeek,
  startOfWeek as getWeekStart,
  addWeeks
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit,
  ArrowRight,
  Flag,
  Pause,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Context menu functionality would be implemented here
import { motion, AnimatePresence } from 'framer-motion';

type WorkoutType = 'easy' | 'tempo' | 'intervals' | 'long' | 'recovery' | 'race' | 'rest' | 'strength';

interface WorkoutEvent {
  id: string;
  date: string; // YYYY-MM-DD format
  type: WorkoutType;
  name: string;
  duration: number; // minutes
  tss: number;
  intensity: 'easy' | 'moderate' | 'hard' | 'very-hard';
  planned?: boolean;
  completed?: boolean;
  compliance?: number; // 0-100
}

interface Props {
  workouts?: WorkoutEvent[];
  onWorkoutMove?: (workoutId: string, newDate: string) => void;
  onWorkoutEdit?: (workout: WorkoutEvent) => void;
  onWorkoutDelete?: (workoutId: string) => void;
  onWorkoutCopy?: (workout: WorkoutEvent) => void;
  onDayClick?: (date: string, workouts: WorkoutEvent[]) => void;
  className?: string;
}

// Mock workout data
const mockWorkouts: WorkoutEvent[] = [
  {
    id: '1',
    date: '2026-02-10',
    type: 'easy',
    name: 'Easy Ride',
    duration: 60,
    tss: 42,
    intensity: 'easy',
    planned: true,
    completed: true,
    compliance: 95
  },
  {
    id: '2',
    date: '2026-02-11',
    type: 'intervals',
    name: '5x4min VO2max',
    duration: 75,
    tss: 78,
    intensity: 'very-hard',
    planned: true,
    completed: true,
    compliance: 88
  },
  {
    id: '3',
    date: '2026-02-12',
    type: 'tempo',
    name: 'Tempo Ride',
    duration: 90,
    tss: 68,
    intensity: 'hard',
    planned: true,
    completed: true,
    compliance: 82
  },
  {
    id: '4',
    date: '2026-02-13',
    type: 'recovery',
    name: 'Recovery Spin',
    duration: 45,
    tss: 28,
    intensity: 'easy',
    planned: true,
    completed: false
  },
  {
    id: '5',
    date: '2026-02-14',
    type: 'intervals',
    name: 'Threshold Work',
    duration: 90,
    tss: 85,
    intensity: 'very-hard',
    planned: true,
    completed: false
  },
  {
    id: '6',
    date: '2026-02-15',
    type: 'long',
    name: 'Long Ride',
    duration: 180,
    tss: 125,
    intensity: 'moderate',
    planned: true,
    completed: false
  },
  {
    id: '7',
    date: '2026-02-16',
    type: 'rest',
    name: 'Rest Day',
    duration: 0,
    tss: 0,
    intensity: 'easy',
    planned: true,
    completed: false
  },
  {
    id: '8',
    date: '2026-02-17',
    type: 'race',
    name: 'Time Trial',
    duration: 60,
    tss: 90,
    intensity: 'very-hard',
    planned: true,
    completed: false
  },
  {
    id: '9',
    date: '2026-02-18',
    name: 'Easy Recovery',
    type: 'easy',
    duration: 45,
    tss: 32,
    intensity: 'easy',
    planned: true,
    completed: false
  }
];

const INTENSITY_COLORS = {
  easy: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', dot: 'bg-green-500' },
  moderate: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  hard: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', dot: 'bg-orange-500' },
  'very-hard': { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', dot: 'bg-red-500' }
};

const WORKOUT_TYPE_COLORS = {
  easy: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
  tempo: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' },
  intervals: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
  long: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
  recovery: { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400' },
  race: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
  rest: { bg: 'bg-zinc-500/20', border: 'border-zinc-500', text: 'text-zinc-400' },
  strength: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' }
};

export function CalendarView({
  workouts = mockWorkouts,
  onWorkoutMove,
  onWorkoutEdit,
  onWorkoutDelete,
  onWorkoutCopy,
  onDayClick,
  className = ''
}: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [draggedWorkout, setDraggedWorkout] = useState<WorkoutEvent | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`;
  };

  const formatDateKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Generate calendar days
  const days = useMemo(() => {
    const dayArray: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      dayArray.push(new Date(day));
      day = addDays(day, 1);
    }

    return dayArray;
  }, [startDate, endDate]);

  // Group workouts by date
  const workoutsByDate = useMemo(() => {
    const grouped: { [key: string]: WorkoutEvent[] } = {};
    workouts.forEach(workout => {
      if (!grouped[workout.date]) {
        grouped[workout.date] = [];
      }
      grouped[workout.date].push(workout);
    });
    return grouped;
  }, [workouts]);

  // Calculate weekly totals
  const weeklyTotals = useMemo(() => {
    const weeks: { [weekKey: string]: { hours: number; tss: number; compliance: number; plannedWorkouts: number; completedWorkouts: number } } = {};
    
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const weekStart = getWeekStart(date, { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { hours: 0, tss: 0, compliance: 0, plannedWorkouts: 0, completedWorkouts: 0 };
      }
      
      weeks[weekKey].hours += workout.duration / 60;
      weeks[weekKey].tss += workout.tss;
      if (workout.planned) weeks[weekKey].plannedWorkouts++;
      if (workout.completed) weeks[weekKey].completedWorkouts++;
    });
    
    // Calculate compliance
    Object.keys(weeks).forEach(weekKey => {
      const week = weeks[weekKey];
      week.compliance = week.plannedWorkouts > 0 ? (week.completedWorkouts / week.plannedWorkouts) * 100 : 0;
    });
    
    return weeks;
  }, [workouts]);

  const handleWorkoutMove = (workoutId: string, newDate: string) => {
    onWorkoutMove?.(workoutId, newDate);
  };

  const handleDayClick = (date: Date, event: React.MouseEvent) => {
    const dateKey = formatDateKey(date);
    const dayWorkouts = workoutsByDate[dateKey] || [];
    
    if (event.shiftKey) {
      // Multi-select with shift
      const newSelected = new Set(selectedDates);
      if (newSelected.has(dateKey)) {
        newSelected.delete(dateKey);
      } else {
        newSelected.add(dateKey);
      }
      setSelectedDates(newSelected);
    } else {
      setSelectedDates(new Set([dateKey]));
      onDayClick?.(dateKey, dayWorkouts);
    }
  };

  const handleBulkAction = (action: 'copy' | 'delete' | 'move') => {
    console.log(`Bulk ${action} for dates:`, Array.from(selectedDates));
    // Implement bulk actions
  };

  const WorkoutCard = ({ workout, index }: { workout: WorkoutEvent; index: number }) => {
    const colors = INTENSITY_COLORS[workout.intensity];
    const isRaceDay = workout.type === 'race';
    const isRestDay = workout.type === 'rest';
    
    return (
      <motion.div
        className={`
          ${colors.bg} ${colors.border} border rounded-lg p-2 mb-1 cursor-pointer
          transition-all duration-200 hover:scale-105 hover:shadow-lg
          ${isRaceDay ? 'ring-2 ring-purple-400 shadow-purple-400/20' : ''}
          ${isRestDay ? 'opacity-60' : ''}
          ${workout.completed ? 'ring-1 ring-green-400/50' : ''}
          ${workout.planned && !workout.completed ? 'ring-1 ring-gray-400/30' : ''}
        `}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium ${colors.text} mb-1 truncate`}>
                      {isRaceDay && <Flag size={10} className="inline mr-1" />}
                      {isRestDay && <span className="inline-block w-4 h-4 text-center text-xs bg-gray-600 text-white rounded-full mr-1">R</span>}
                      {workout.name}
                    </div>
                    {workout.duration > 0 && (
                      <div className="text-xs text-gray-400">
                        {formatDuration(workout.duration)}
                        {workout.tss > 0 && ` • ${workout.tss} TSS`}
                      </div>
                    )}
                    {workout.completed && workout.compliance && (
                      <div className="text-xs text-green-400">
                        ✓ {workout.compliance}%
                      </div>
                    )}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${colors.dot} ml-2`} />
                </div>
              </motion.div>
    );
  };

  const DayCell = ({ date }: { date: Date }) => {
    const dateKey = formatDateKey(date);
    const dayWorkouts = workoutsByDate[dateKey] || [];
    const isSelected = selectedDates.has(dateKey);
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isDayToday = isToday(date);
    
    return (
      <motion.div
        className={`
          min-h-[120px] p-2 border border-zinc-800 rounded-lg transition-all duration-200
          ${isCurrentMonth ? 'bg-zinc-900/50' : 'bg-zinc-800/30 opacity-50'}
          ${isDayToday ? 'ring-2 ring-red-500 bg-red-500/5' : ''}
          ${isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''}
          hover:bg-zinc-800/40 cursor-pointer
        `}
        onClick={(e) => handleDayClick(date, e)}
        whileHover={{ scale: 1.02 }}
        layout
      >
            <div className="flex items-center justify-between mb-2">
              <span className={`
                text-sm font-medium
                ${isDayToday ? 'text-red-400 font-bold' : 'text-gray-300'}
                ${!isCurrentMonth ? 'text-gray-600' : ''}
              `}>
                {format(date, 'd')}
              </span>
              
              {dayWorkouts.length > 0 && (
                <div className="flex items-center gap-1">
                  {dayWorkouts.some(w => w.type === 'race') && (
                    <Flag size={12} className="text-purple-400" />
                  )}
                  {dayWorkouts.some(w => w.type === 'rest') && (
                    <div className="w-3 h-3 rounded-full bg-gray-500 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">R</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <AnimatePresence>
                {dayWorkouts.slice(0, 3).map((workout, index) => (
                  <WorkoutCard key={workout.id} workout={workout} index={index} />
                ))}
              </AnimatePresence>
              
              {dayWorkouts.length > 3 && (
                <div className="text-xs text-gray-400 text-center py-1">
                  +{dayWorkouts.length - 3} more
                </div>
              )}
            </div>
          </motion.div>
    );
  };

  const WeekTotalRow = ({ weekStart }: { weekStart: Date }) => {
    const weekKey = formatDateKey(weekStart);
    const totals = weeklyTotals[weekKey] || { hours: 0, tss: 0, compliance: 0 };
    
    return (
      <div className="grid grid-cols-7 gap-2 mb-4 p-2 bg-zinc-800/30 rounded-lg">
        <div className="col-span-4 text-sm text-gray-400 font-medium">
          Week of {format(weekStart, 'MMM d')}
        </div>
        <div className="text-center text-sm">
          <div className="text-white font-medium">{totals.hours.toFixed(1)}h</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="text-center text-sm">
          <div className="text-white font-medium">{Math.round(totals.tss)}</div>
          <div className="text-xs text-gray-400">TSS</div>
        </div>
        <div className="text-center text-sm">
          <div className={`font-medium ${
            totals.compliance >= 90 ? 'text-green-400' :
            totals.compliance >= 75 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {Math.round(totals.compliance)}%
          </div>
          <div className="text-xs text-gray-400">Compliance</div>
        </div>
      </div>
    );
  };

  // Group days by weeks for rendering
  const weeks = useMemo(() => {
    const weekArray: Date[][] = [];
    let currentWeek: Date[] = [];
    
    days.forEach((day, index) => {
      currentWeek.push(day);
      
      if ((index + 1) % 7 === 0) {
        weekArray.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weekArray.push(currentWeek);
    }
    
    return weekArray;
  }, [days]);

  return (
    <div className={`${className} space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="border-zinc-700 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="border-zinc-700 text-gray-400 hover:text-white"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="border-zinc-700 text-gray-400 hover:text-white"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        {selectedDates.size > 0 && (
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white">
              {selectedDates.size} selected
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('copy')}
              className="border-zinc-700 text-gray-400 hover:text-white"
            >
              <Copy size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              className="border-red-700 text-red-400 hover:text-red-300"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Calendar */}
      <Card className="bg-zinc-950 border-zinc-800">
        <div className="p-6">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar body */}
          <div className="space-y-4">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex}>
                {weekIndex === 0 && <WeekTotalRow weekStart={week[0]} />}
                <div className="grid grid-cols-7 gap-2">
                  {week.map((day) => (
                    <DayCell key={formatDateKey(day)} date={day} />
                  ))}
                </div>
                {weekIndex < weeks.length - 1 && <WeekTotalRow weekStart={weeks[weekIndex + 1][0]} />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Hard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Very Hard</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag size={12} className="text-purple-400" />
          <span>Race Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500 flex items-center justify-center">
            <span className="text-xs text-white font-bold">R</span>
          </div>
          <span>Rest Day</span>
        </div>
      </div>
    </div>
  );
}