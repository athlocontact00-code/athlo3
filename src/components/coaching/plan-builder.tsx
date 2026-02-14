'use client';

import { useState, useMemo } from 'react';
import { 
  Calendar, 
  Copy, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  ArrowRight,
  Save,
  Users,
  Target,
  TrendingUp,
  Clock,
  Zap,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// Simple show/hide functionality instead of collapsible

type Sport = 'cycling' | 'running' | 'triathlon' | 'swimming';
type WorkoutType = 'easy' | 'tempo' | 'intervals' | 'long' | 'recovery' | 'race' | 'rest';
type Phase = 'base' | 'build1' | 'build2' | 'peak' | 'taper' | 'race' | 'recovery';

interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  sport: Sport;
  duration: number; // minutes
  tss: number;
  description?: string;
  isTemplate?: boolean;
}

interface PlanWeek {
  weekNumber: number;
  phase: Phase;
  targetTSS: number;
  targetHours: number;
  workouts: { [dayIndex: number]: Workout | null }; // 0-6 for Mon-Sun
  notes?: string;
  isCollapsed?: boolean;
}

interface TrainingPlan {
  id: string;
  name: string;
  sport: Sport;
  weeks: PlanWeek[];
  athlete?: {
    id: string;
    name: string;
  };
  description?: string;
  isTemplate?: boolean;
}

interface Props {
  plan?: TrainingPlan;
  onSave?: (plan: TrainingPlan) => void;
  onAssign?: (plan: TrainingPlan, athleteIds: string[]) => void;
  className?: string;
}

const WORKOUT_COLORS = {
  easy: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
  tempo: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' },
  intervals: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
  long: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
  recovery: { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400' },
  race: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
  rest: { bg: 'bg-zinc-500/20', border: 'border-zinc-500', text: 'text-zinc-400' }
};

const PHASE_COLORS = {
  base: '#22c55e',
  build1: '#f59e0b',
  build2: '#ef4444',
  peak: '#a855f7',
  taper: '#06b6d4',
  race: '#ec4899',
  recovery: '#6b7280'
};

const WEEK_TEMPLATES = [
  {
    id: 'base-week',
    name: 'Base Week',
    description: 'Aerobic base building with steady efforts',
    phase: 'base' as Phase,
    targetTSS: 400,
    targetHours: 8,
    workouts: {
      0: { id: '1', name: 'Easy Ride', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 60, tss: 42 },
      1: { id: '2', name: 'Tempo', type: 'tempo' as WorkoutType, sport: 'cycling' as Sport, duration: 90, tss: 85 },
      2: { id: '3', name: 'Easy Ride', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 60, tss: 42 },
      3: { id: '4', name: 'Sweet Spot', type: 'intervals' as WorkoutType, sport: 'cycling' as Sport, duration: 75, tss: 78 },
      4: { id: '5', name: 'Recovery', type: 'recovery' as WorkoutType, sport: 'cycling' as Sport, duration: 45, tss: 28 },
      5: { id: '6', name: 'Long Ride', type: 'long' as WorkoutType, sport: 'cycling' as Sport, duration: 180, tss: 125 },
      6: null // Rest day
    }
  },
  {
    id: 'build-week',
    name: 'Build Week',
    description: 'Higher intensity with VO2max and threshold work',
    phase: 'build1' as Phase,
    targetTSS: 520,
    targetHours: 9,
    workouts: {
      0: { id: '1', name: 'Easy Ride', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 60, tss: 42 },
      1: { id: '2', name: 'VO2max Intervals', type: 'intervals' as WorkoutType, sport: 'cycling' as Sport, duration: 90, tss: 95 },
      2: { id: '3', name: 'Tempo', type: 'tempo' as WorkoutType, sport: 'cycling' as Sport, duration: 75, tss: 68 },
      3: { id: '4', name: 'Threshold', type: 'intervals' as WorkoutType, sport: 'cycling' as Sport, duration: 90, tss: 92 },
      4: { id: '5', name: 'Recovery', type: 'recovery' as WorkoutType, sport: 'cycling' as Sport, duration: 45, tss: 28 },
      5: { id: '6', name: 'Long Ride', type: 'long' as WorkoutType, sport: 'cycling' as Sport, duration: 210, tss: 155 },
      6: { id: '7', name: 'Easy Ride', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 90, tss: 62 }
    }
  },
  {
    id: 'recovery-week',
    name: 'Recovery Week',
    description: 'Reduced volume for adaptation',
    phase: 'recovery' as Phase,
    targetTSS: 280,
    targetHours: 6,
    workouts: {
      0: { id: '1', name: 'Easy Ride', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 60, tss: 42 },
      1: { id: '2', name: 'Easy Ride', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 75, tss: 52 },
      2: { id: '3', name: 'Recovery', type: 'recovery' as WorkoutType, sport: 'cycling' as Sport, duration: 45, tss: 28 },
      3: { id: '4', name: 'Tempo', type: 'tempo' as WorkoutType, sport: 'cycling' as Sport, duration: 60, tss: 56 },
      4: null, // Rest day
      5: { id: '5', name: 'Long Ride', type: 'long' as WorkoutType, sport: 'cycling' as Sport, duration: 150, tss: 102 },
      6: null // Rest day
    }
  }
];

const WORKOUT_LIBRARY: Workout[] = [
  { id: 'easy-60', name: 'Easy 60min', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 60, tss: 42, isTemplate: true },
  { id: 'easy-90', name: 'Easy 90min', type: 'easy' as WorkoutType, sport: 'cycling' as Sport, duration: 90, tss: 62, isTemplate: true },
  { id: 'tempo-60', name: 'Tempo 60min', type: 'tempo' as WorkoutType, sport: 'cycling' as Sport, duration: 60, tss: 56, isTemplate: true },
  { id: 'vo2max-intervals', name: '5x4min VO2max', type: 'intervals' as WorkoutType, sport: 'cycling' as Sport, duration: 75, tss: 78, isTemplate: true },
  { id: 'threshold-intervals', name: '3x12min Threshold', type: 'intervals' as WorkoutType, sport: 'cycling' as Sport, duration: 90, tss: 92, isTemplate: true },
  { id: 'long-ride', name: 'Long Ride', type: 'long' as WorkoutType, sport: 'cycling' as Sport, duration: 180, tss: 125, isTemplate: true },
  { id: 'recovery-45', name: 'Recovery 45min', type: 'recovery' as WorkoutType, sport: 'cycling' as Sport, duration: 45, tss: 28, isTemplate: true }
];

export function PlanBuilder({ plan: initialPlan, onSave, onAssign, className = '' }: Props) {
  const [plan, setPlan] = useState<TrainingPlan>(
    initialPlan || {
      id: crypto.randomUUID(),
      name: 'New Training Plan',
      sport: 'cycling',
      weeks: Array.from({ length: 12 }, (_, i) => ({
        weekNumber: i + 1,
        phase: i < 4 ? 'base' : i < 8 ? 'build1' : i < 10 ? 'peak' : 'taper',
        targetTSS: 400,
        targetHours: 8,
        workouts: {},
        isCollapsed: i > 3 // Collapse weeks beyond the first 4
      })),
      description: ''
    }
  );

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [showLibrary, setShowLibrary] = useState(false);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const weeklyStats = useMemo(() => {
    return plan.weeks.map(week => {
      const workouts = Object.values(week.workouts).filter(w => w !== null) as Workout[];
      const actualTSS = workouts.reduce((sum, w) => sum + w.tss, 0);
      const actualHours = workouts.reduce((sum, w) => sum + w.duration, 0) / 60;
      const compliance = week.targetTSS > 0 ? (actualTSS / week.targetTSS) * 100 : 0;
      
      return {
        actualTSS,
        actualHours: Math.round(actualHours * 10) / 10,
        compliance: Math.round(compliance)
      };
    });
  }, [plan.weeks]);

  const periodizationData = useMemo(() => {
    const phases = plan.weeks.reduce((acc, week, index) => {
      const stats = weeklyStats[index];
      if (!acc[week.phase]) {
        acc[week.phase] = { weeks: 0, avgTSS: 0, avgHours: 0, totalTSS: 0, totalHours: 0 };
      }
      acc[week.phase].weeks++;
      acc[week.phase].totalTSS += stats.actualTSS;
      acc[week.phase].totalHours += stats.actualHours;
      acc[week.phase].avgTSS = acc[week.phase].totalTSS / acc[week.phase].weeks;
      acc[week.phase].avgHours = acc[week.phase].totalHours / acc[week.phase].weeks;
      return acc;
    }, {} as Record<Phase, { weeks: number; avgTSS: number; avgHours: number; totalTSS: number; totalHours: number }>);

    return phases;
  }, [plan.weeks, weeklyStats]);

  const updateWeek = (weekNumber: number, updates: Partial<PlanWeek>) => {
    setPlan(prev => ({
      ...prev,
      weeks: prev.weeks.map(week =>
        week.weekNumber === weekNumber ? { ...week, ...updates } : week
      )
    }));
  };

  const addWorkoutToDay = (weekNumber: number, dayIndex: number, workout: Workout) => {
    const newWorkout = {
      ...workout,
      id: crypto.randomUUID()
    };
    
    updateWeek(weekNumber, {
      workouts: {
        ...plan.weeks[weekNumber - 1].workouts,
        [dayIndex]: newWorkout
      }
    });
  };

  const removeWorkoutFromDay = (weekNumber: number, dayIndex: number) => {
    updateWeek(weekNumber, {
      workouts: {
        ...plan.weeks[weekNumber - 1].workouts,
        [dayIndex]: null
      }
    });
  };

  const copyWeek = (weekNumber: number) => {
    const weekToCopy = plan.weeks[weekNumber - 1];
    const copiedWorkouts = Object.entries(weekToCopy.workouts).reduce((acc, [dayIndex, workout]) => {
      if (workout) {
        acc[parseInt(dayIndex)] = { ...workout, id: crypto.randomUUID() };
      }
      return acc;
    }, {} as { [dayIndex: number]: Workout });

    // Apply to next week if it exists
    if (weekNumber < plan.weeks.length) {
      updateWeek(weekNumber + 1, {
        workouts: copiedWorkouts,
        targetTSS: weekToCopy.targetTSS,
        targetHours: weekToCopy.targetHours
      });
    }
  };

  const applyTemplate = (weekNumber: number, templateId: string) => {
    const template = WEEK_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const workouts = Object.entries(template.workouts).reduce((acc, [dayIndex, workout]) => {
      if (workout) {
        acc[parseInt(dayIndex)] = { ...workout, id: crypto.randomUUID() };
      }
      return acc;
    }, {} as { [dayIndex: number]: Workout });

    updateWeek(weekNumber, {
      phase: template.phase,
      targetTSS: template.targetTSS,
      targetHours: template.targetHours,
      workouts
    });
  };

  const shiftWeek = (weekNumber: number, direction: 'forward' | 'backward') => {
    if (direction === 'forward' && weekNumber < plan.weeks.length) {
      const currentWeek = plan.weeks[weekNumber - 1];
      const nextWeek = plan.weeks[weekNumber];
      
      setPlan(prev => ({
        ...prev,
        weeks: prev.weeks.map((week, index) => {
          if (index === weekNumber - 1) return { ...nextWeek, weekNumber: currentWeek.weekNumber };
          if (index === weekNumber) return { ...currentWeek, weekNumber: nextWeek.weekNumber };
          return week;
        })
      }));
    } else if (direction === 'backward' && weekNumber > 1) {
      const currentWeek = plan.weeks[weekNumber - 1];
      const prevWeek = plan.weeks[weekNumber - 2];
      
      setPlan(prev => ({
        ...prev,
        weeks: prev.weeks.map((week, index) => {
          if (index === weekNumber - 2) return { ...currentWeek, weekNumber: prevWeek.weekNumber };
          if (index === weekNumber - 1) return { ...prevWeek, weekNumber: currentWeek.weekNumber };
          return week;
        })
      }));
    }
  };

  const toggleWeekCollapse = (weekNumber: number) => {
    updateWeek(weekNumber, {
      isCollapsed: !plan.weeks[weekNumber - 1].isCollapsed
    });
  };

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const WeekCard = ({ week, stats }: { week: PlanWeek; stats: typeof weeklyStats[0] }) => {
    const phaseColor = PHASE_COLORS[week.phase];
    
    return (
      <Card 
        className={`bg-zinc-950 border-zinc-800 ${selectedWeek === week.weekNumber ? 'ring-2 ring-red-500' : ''}`}
        style={{ borderLeftColor: phaseColor, borderLeftWidth: '4px' }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleWeekCollapse(week.weekNumber)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                {week.isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                <h3 className="text-lg font-semibold text-white">
                  Week {week.weekNumber}
                </h3>
              </button>
              
              <Badge 
                className="capitalize text-white"
                style={{ backgroundColor: phaseColor }}
              >
                {week.phase}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem onClick={() => copyWeek(week.weekNumber)} className="text-white">
                    <Copy size={16} className="mr-2" />
                    Copy Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shiftWeek(week.weekNumber, 'backward')} className="text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Shift Back
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shiftWeek(week.weekNumber, 'forward')} className="text-white">
                    <ArrowRight size={16} className="mr-2" />
                    Shift Forward
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Week Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">TSS:</span>
              <span className="ml-2 text-white font-medium">{stats.actualTSS} / {week.targetTSS}</span>
            </div>
            <div>
              <span className="text-gray-400">Hours:</span>
              <span className="ml-2 text-white font-medium">{stats.actualHours} / {week.targetHours}</span>
            </div>
            <div>
              <span className="text-gray-400">Compliance:</span>
              <span className={`ml-2 font-medium ${
                stats.compliance >= 90 ? 'text-green-400' :
                stats.compliance >= 80 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {stats.compliance}%
              </span>
            </div>
          </div>
        </CardHeader>
        
        {!week.isCollapsed && (
          <div>
            <CardContent className="pt-0">
              {/* Week Templates */}
              <div className="flex gap-2 mb-4">
                {WEEK_TEMPLATES.map(template => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(week.weekNumber, template.id)}
                    className="text-xs border-zinc-700 text-gray-400 hover:text-white"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
              
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day, dayIndex) => {
                  const workout = week.workouts[dayIndex];
                  const colors = workout ? WORKOUT_COLORS[workout.type] : null;
                  
                  return (
                    <div
                      key={dayIndex}
                      className="min-h-[100px] border border-zinc-800 rounded-lg p-2 hover:border-zinc-700 transition-colors"
                    >
                      <div className="text-xs text-gray-400 font-medium mb-2">{day}</div>
                      
                      {workout ? (
                        <div className={`${colors!.bg} ${colors!.border} border rounded-lg p-2 relative group`}>
                          <div className={`text-xs font-medium ${colors!.text} mb-1`}>
                            {workout.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDuration(workout.duration)}
                          </div>
                          <div className="text-xs text-gray-400">
                            TSS: {workout.tss}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWorkoutFromDay(week.weekNumber, dayIndex)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-gray-400 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-full border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center hover:border-red-600/50 transition-colors cursor-pointer group"
                             onClick={() => setShowLibrary(true)}>
                          <Plus size={16} className="text-gray-600 group-hover:text-red-400 transition-colors" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Week Notes */}
              <div className="mt-4">
                <Textarea
                  value={week.notes || ''}
                  onChange={(e) => updateWeek(week.weekNumber, { notes: e.target.value })}
                  placeholder="Week notes and objectives..."
                  className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  rows={2}
                />
              </div>
            </CardContent>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Plan Builder</h1>
          <p className="text-gray-400">Create and customize training plans with drag & drop simplicity</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onAssign?.(plan, [])}
            className="border-zinc-700 text-gray-400 hover:text-white"
          >
            <Users size={16} className="mr-2" />
            Assign to Athletes
          </Button>
          <Button
            onClick={() => onSave?.(plan)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Save size={16} className="mr-2" />
            Save Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-6">
          {/* Plan Details */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Plan Name</label>
                  <Input
                    value={plan.name}
                    onChange={(e) => setPlan(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Enter plan name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Sport</label>
                  <Select
                    value={plan.sport}
                    onValueChange={(value: Sport) => setPlan(prev => ({ ...prev, sport: value }))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="cycling" className="text-white">🚴‍♂️ Cycling</SelectItem>
                      <SelectItem value="running" className="text-white">🏃‍♂️ Running</SelectItem>
                      <SelectItem value="triathlon" className="text-white">🏊‍♂️ Triathlon</SelectItem>
                      <SelectItem value="swimming" className="text-white">🏊‍♂️ Swimming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                <Textarea
                  value={plan.description || ''}
                  onChange={(e) => setPlan(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Plan philosophy and objectives..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Weeks */}
          <div className="space-y-4">
            {plan.weeks.map((week, index) => (
              <WeekCard
                key={week.weekNumber}
                week={week}
                stats={weeklyStats[index]}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Periodization Overview */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Periodization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(periodizationData).map(([phase, data]) => (
                  <div key={phase} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize">{phase}</span>
                      <span className="text-sm text-gray-400">{data.weeks}w</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Avg: {Math.round(data.avgTSS)} TSS, {data.avgHours.toFixed(1)}h
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: PHASE_COLORS[phase as Phase],
                          width: `${(data.weeks / plan.weeks.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Stats */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Plan Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{plan.weeks.length} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total TSS:</span>
                <span className="text-white">
                  {weeklyStats.reduce((sum, stats) => sum + stats.actualTSS, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Hours:</span>
                <span className="text-white">
                  {Math.round(weeklyStats.reduce((sum, stats) => sum + stats.actualHours, 0))}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Weekly TSS:</span>
                <span className="text-white">
                  {Math.round(weeklyStats.reduce((sum, stats) => sum + stats.actualTSS, 0) / plan.weeks.length)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Volume/Intensity Curve */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Load Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <TrendingUp size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Volume/Intensity Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Library */}
          {showLibrary && (
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Workout Library</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLibrary(false)}
                    className="text-gray-400"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {WORKOUT_LIBRARY.map(workout => {
                  const colors = WORKOUT_COLORS[workout.type];
                  return (
                    <div
                      key={workout.id}
                      className={`${colors.bg} ${colors.border} border rounded-lg p-3 cursor-pointer hover:bg-opacity-30 transition-colors`}
                      onClick={() => {
                        // Add workout to selected week/day
                        console.log('Add workout:', workout);
                      }}
                    >
                      <div className={`font-medium ${colors.text} mb-1`}>{workout.name}</div>
                      <div className="text-xs text-gray-400">
                        {formatDuration(workout.duration)} • TSS {workout.tss}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}