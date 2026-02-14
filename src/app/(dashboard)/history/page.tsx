'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  Download,
  Activity,
  Bike,
  Waves,
  Dumbbell,
  Clock,
  MapPin,
  TrendingUp,
  Heart,
  Zap,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Types
interface WorkoutHistory {
  id: string;
  date: string;
  sport: 'run' | 'bike' | 'swim' | 'strength' | 'other';
  name: string;
  description?: string;
  metrics: {
    duration?: string;
    distance?: string;
    pace?: string;
    avgHR?: number;
    maxHR?: number;
    power?: number;
    elevation?: string;
    calories?: number;
  };
  compliance: 'completed' | 'partial' | 'skipped';
  load: number;
  feel: 'great' | 'good' | 'okay' | 'tough' | 'terrible';
  location?: string;
  notes?: string;
  achievements?: string[];
}

// Mock workout history data
const workoutHistory: WorkoutHistory[] = [
  {
    id: 'w1',
    date: '2024-02-14',
    sport: 'run',
    name: 'Tempo Run',
    description: '8km threshold pace with 2km warm-up/cool-down',
    metrics: {
      duration: '50:15',
      distance: '12.0 km',
      pace: '4:11/km',
      avgHR: 165,
      maxHR: 178,
      elevation: '120m',
      calories: 620
    },
    compliance: 'completed',
    load: 85,
    feel: 'great',
    location: 'Łazienki Park',
    notes: 'Felt strong throughout. Hit all pace targets perfectly.',
    achievements: ['New threshold pace PR']
  },
  {
    id: 'w2',
    date: '2024-02-13',
    sport: 'strength',
    name: 'Upper Body Power',
    description: 'Bench press, pull-ups, and accessory work',
    metrics: {
      duration: '1:15:00',
      calories: 285
    },
    compliance: 'completed',
    load: 65,
    feel: 'good',
    notes: 'New bench press PR! 95kg for 3x5.'
  },
  {
    id: 'w3',
    date: '2024-02-12',
    sport: 'bike',
    name: 'FTP Test',
    description: '20-minute all-out effort to test functional threshold power',
    metrics: {
      duration: '1:05:00',
      distance: '25.8 km',
      power: 265,
      avgHR: 172,
      maxHR: 185,
      calories: 450
    },
    compliance: 'completed',
    load: 95,
    feel: 'tough',
    location: 'Indoor trainer',
    notes: '7W improvement over last test. Very happy with progress.',
    achievements: ['New FTP: 265W']
  },
  {
    id: 'w4',
    date: '2024-02-11',
    sport: 'run',
    name: 'Easy Run',
    description: 'Recovery pace run to flush out legs',
    metrics: {
      duration: '45:30',
      distance: '8.5 km',
      pace: '5:21/km',
      avgHR: 135,
      maxHR: 148,
      elevation: '85m',
      calories: 420
    },
    compliance: 'completed',
    load: 35,
    feel: 'good',
    location: 'Vistula Boulevards',
    notes: 'Nice recovery run. Legs felt fresh.'
  },
  {
    id: 'w5',
    date: '2024-02-10',
    sport: 'swim',
    name: 'Technique Session',
    description: 'Drill work and moderate pace swimming',
    metrics: {
      duration: '58:45',
      distance: '2.5 km',
      pace: '1:33/100m',
      calories: 380
    },
    compliance: 'completed',
    load: 55,
    feel: 'okay',
    location: 'Pool',
    notes: 'Working on catch phase. Feeling more efficient.'
  },
  {
    id: 'w6',
    date: '2024-02-09',
    sport: 'run',
    name: 'Interval Training',
    description: '5x1000m at 5K pace with 90s recovery',
    metrics: {
      duration: '52:20',
      distance: '10.2 km',
      pace: '4:28/km',
      avgHR: 168,
      maxHR: 182,
      elevation: '65m',
      calories: 580
    },
    compliance: 'partial',
    load: 88,
    feel: 'tough',
    location: 'Track',
    notes: 'Only completed 4 of 5 intervals. Legs felt heavy.'
  },
  {
    id: 'w7',
    date: '2024-02-08',
    sport: 'strength',
    name: 'Lower Body Strength',
    description: 'Squats, deadlifts, and unilateral work',
    metrics: {
      duration: '1:20:00',
      calories: 310
    },
    compliance: 'completed',
    load: 75,
    feel: 'great',
    notes: 'New squat PR! Hit 140kg for 3x5. Form felt solid.'
  },
  {
    id: 'w8',
    date: '2024-02-07',
    sport: 'run',
    name: 'Long Run',
    description: 'Aerobic base building at conversational pace',
    metrics: {
      duration: '1:28:45',
      distance: '18.2 km',
      pace: '4:52/km',
      avgHR: 142,
      maxHR: 158,
      elevation: '245m',
      calories: 980
    },
    compliance: 'completed',
    load: 92,
    feel: 'good',
    location: 'Kampinos Forest',
    notes: 'Beautiful morning run. Felt strong the entire way.'
  }
];

const getSportIcon = (sport: WorkoutHistory['sport']) => {
  switch (sport) {
    case 'run': return Activity;
    case 'bike': return Bike;
    case 'swim': return Waves;
    case 'strength': return Dumbbell;
    default: return Activity;
  }
};

const getSportColor = (sport: WorkoutHistory['sport']) => {
  switch (sport) {
    case 'run': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'bike': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'swim': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
    case 'strength': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  }
};

const getComplianceConfig = (compliance: WorkoutHistory['compliance']) => {
  switch (compliance) {
    case 'completed':
      return {
        icon: CheckCircle,
        color: 'text-green-500 bg-green-500/10 border-green-500/20',
        label: 'Completed'
      };
    case 'partial':
      return {
        icon: AlertCircle,
        color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        label: 'Partial'
      };
    case 'skipped':
      return {
        icon: AlertCircle,
        color: 'text-red-500 bg-red-500/10 border-red-500/20',
        label: 'Skipped'
      };
  }
};

const getFeelColor = (feel: WorkoutHistory['feel']) => {
  switch (feel) {
    case 'great': return 'text-green-500';
    case 'good': return 'text-green-400';
    case 'okay': return 'text-yellow-500';
    case 'tough': return 'text-orange-500';
    case 'terrible': return 'text-red-500';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
};

const getMonthYear = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long',
    year: 'numeric'
  });
};

interface WorkoutCardProps {
  workout: WorkoutHistory;
  expanded: boolean;
  onToggle: () => void;
}

function WorkoutCard({ workout, expanded, onToggle }: WorkoutCardProps) {
  const SportIcon = getSportIcon(workout.sport);
  const sportColor = getSportColor(workout.sport);
  const complianceConfig = getComplianceConfig(workout.compliance);
  const ComplianceIcon = complianceConfig.icon;
  const feelColor = getFeelColor(workout.feel);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
      <CardContent className="p-0">
        {/* Main Info */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={cn("p-2 rounded-lg", sportColor)}>
                <SportIcon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground">{workout.name}</h3>
                  <Badge className={cn("text-xs", complianceConfig.color)}>
                    <ComplianceIcon className="w-3 h-3 mr-1" />
                    {complianceConfig.label}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(workout.date)}</span>
                  </span>
                  
                  {workout.metrics.duration && (
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{workout.metrics.duration}</span>
                    </span>
                  )}
                  
                  {workout.metrics.distance && (
                    <span>{workout.metrics.distance}</span>
                  )}
                  
                  {workout.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{workout.location}</span>
                    </span>
                  )}
                  
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Load: {workout.load}</span>
                  </span>
                  
                  <span className={cn("capitalize font-medium", feelColor)}>
                    {workout.feel}
                  </span>
                </div>
                
                {workout.description && (
                  <p className="text-sm text-muted-foreground">
                    {workout.description}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0 ml-2"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/30"
            >
              <div className="p-4 space-y-4">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(workout.metrics).map(([key, value]) => {
                    if (!value) return null;
                    
                    const getMetricIcon = () => {
                      switch (key) {
                        case 'avgHR':
                        case 'maxHR':
                          return Heart;
                        case 'power':
                          return Zap;
                        case 'elevation':
                          return TrendingUp;
                        default:
                          return Clock;
                      }
                    };
                    
                    const MetricIcon = getMetricIcon();
                    
                    return (
                      <div key={key} className="flex items-center space-x-2">
                        <MetricIcon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground capitalize">
                            {key === 'avgHR' ? 'Avg HR' : 
                             key === 'maxHR' ? 'Max HR' : 
                             key}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {value}{key.includes('HR') ? ' bpm' : 
                               key === 'power' ? 'W' : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Achievements */}
                {workout.achievements && workout.achievements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {workout.achievements.map((achievement, index) => (
                        <Badge 
                          key={index}
                          className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Notes */}
                {workout.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {workout.notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<'all' | WorkoutHistory['sport']>('all');
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  // Filter workouts based on search and sport filter
  const filteredWorkouts = workoutHistory.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'all' || workout.sport === selectedSport;
    
    return matchesSearch && matchesSport;
  });

  // Group workouts by month
  const groupedWorkouts = filteredWorkouts.reduce((groups, workout) => {
    const monthYear = getMonthYear(workout.date);
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(workout);
    return groups;
  }, {} as Record<string, WorkoutHistory[]>);

  const sports: Array<{ key: 'all' | WorkoutHistory['sport'], label: string, icon: any }> = [
    { key: 'all', label: 'All Sports', icon: Activity },
    { key: 'run', label: 'Running', icon: Activity },
    { key: 'bike', label: 'Cycling', icon: Bike },
    { key: 'swim', label: 'Swimming', icon: Waves },
    { key: 'strength', label: 'Strength', icon: Dumbbell }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">Training History</h1>
          <p className="text-muted-foreground">
            Complete log of all your workouts and training sessions
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Sport Filter */}
          <Tabs 
            value={selectedSport} 
            onValueChange={(value) => setSelectedSport(value as typeof selectedSport)}
          >
            <TabsList>
              {sports.map(({ key, label, icon: Icon }) => (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-1">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Export Button */}
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </motion.div>

        {/* Workout History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {Object.entries(groupedWorkouts).map(([monthYear, workouts]) => (
            <div key={monthYear}>
              {/* Month Header */}
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {monthYear}
                </h2>
                <div className="flex-1 h-px bg-border/50" />
                <Badge variant="secondary" className="text-xs">
                  {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {/* Workouts for this month */}
              <div className="space-y-3">
                {workouts.map((workout, index) => (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <WorkoutCard
                      workout={workout}
                      expanded={expandedWorkout === workout.id}
                      onToggle={() => setExpandedWorkout(
                        expandedWorkout === workout.id ? null : workout.id
                      )}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredWorkouts.length === 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-medium text-foreground mb-2">
                No workouts found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 
                  "Try adjusting your search criteria" : 
                  "Start training to build your workout history"
                }
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}