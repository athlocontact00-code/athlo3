'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Users, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  team: string;
  sport: string;
}

interface WorkoutStatus {
  status: 'completed' | 'planned' | 'missed' | 'rest';
  workout?: {
    type: string;
    duration: number;
    intensity: string;
    notes?: string;
  };
}

interface DayData {
  date: string;
  athletes: Record<string, WorkoutStatus>;
}

// Mock athletes data
const mockAthletes: Athlete[] = [
  { id: '1', name: 'Sarah Johnson', team: 'Elite Squad', sport: 'Running' },
  { id: '2', name: 'Mike Chen', team: 'Elite Squad', sport: 'Running' },
  { id: '3', name: 'Emma Wilson', team: 'Development', sport: 'Cycling' },
  { id: '4', name: 'James Rodriguez', team: 'Elite Squad', sport: 'Triathlon' },
  { id: '5', name: 'Lisa Thompson', team: 'Development', sport: 'Swimming' },
  { id: '6', name: 'David Kim', team: 'Elite Squad', sport: 'Running' },
];

// Generate mock calendar data
function generateMockWeekData(): DayData[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  
  const weekData: DayData[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const athletes: Record<string, WorkoutStatus> = {};
    
    mockAthletes.forEach(athlete => {
      const random = Math.random();
      if (i === 6) { // Sunday - mostly rest
        athletes[athlete.id] = { status: 'rest' };
      } else if (random > 0.8) {
        athletes[athlete.id] = { status: 'missed' };
      } else if (random > 0.6) {
        athletes[athlete.id] = {
          status: 'completed',
          workout: {
            type: ['Easy Run', 'Interval', 'Tempo', 'Long Run'][Math.floor(Math.random() * 4)],
            duration: Math.floor(Math.random() * 90) + 30,
            intensity: ['Easy', 'Moderate', 'Hard'][Math.floor(Math.random() * 3)],
            notes: 'Felt great today!',
          },
        };
      } else {
        athletes[athlete.id] = {
          status: 'planned',
          workout: {
            type: ['Easy Run', 'Interval', 'Tempo', 'Long Run'][Math.floor(Math.random() * 4)],
            duration: Math.floor(Math.random() * 90) + 30,
            intensity: ['Easy', 'Moderate', 'Hard'][Math.floor(Math.random() * 3)],
          },
        };
      }
    });
    
    weekData.push({
      date: date.toISOString().split('T')[0],
      athletes,
    });
  }
  
  return weekData;
}

const statusColors = {
  completed: 'bg-green-600',
  planned: 'bg-blue-600',
  missed: 'bg-red-600',
  rest: 'bg-gray-600',
};

const statusLabels = {
  completed: 'Completed',
  planned: 'Planned',
  missed: 'Missed',
  rest: 'Rest Day',
};

interface WorkoutDetailProps {
  athlete: Athlete;
  date: string;
  workoutStatus: WorkoutStatus;
  onClose: () => void;
}

function WorkoutDetail({ athlete, date, workoutStatus, onClose }: WorkoutDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Workout Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
                {athlete.name.split(' ').map(n => n[0]).join('')}
              </div>
            </Avatar>
            <div>
              <div className="font-medium">{athlete.name}</div>
              <div className="text-sm text-muted-foreground">{athlete.team} • {athlete.sport}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <div>{new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge 
              variant="outline" 
              className={cn(
                'mt-1',
                workoutStatus.status === 'completed' && 'bg-green-950/30 text-green-400 border-green-600/30',
                workoutStatus.status === 'planned' && 'bg-blue-950/30 text-blue-400 border-blue-600/30',
                workoutStatus.status === 'missed' && 'bg-red-950/30 text-red-400 border-red-600/30',
                workoutStatus.status === 'rest' && 'bg-gray-950/30 text-gray-400 border-gray-600/30'
              )}
            >
              {statusLabels[workoutStatus.status]}
            </Badge>
          </div>
          
          {workoutStatus.workout && (
            <>
              <div>
                <div className="text-sm text-muted-foreground">Workout</div>
                <div>{workoutStatus.workout.type}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div>{workoutStatus.workout.duration} min</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Intensity</div>
                  <div>{workoutStatus.workout.intensity}</div>
                </div>
              </div>
              
              {workoutStatus.workout.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <div className="text-sm">{workoutStatus.workout.notes}</div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function SharedCalendar() {
  const [weekData] = useState(() => generateMockWeekData());
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>(mockAthletes);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<{
    athlete: Athlete;
    date: string;
    status: WorkoutStatus;
  } | null>(null);
  
  const teams = Array.from(new Set(mockAthletes.map(a => a.team)));
  const sports = Array.from(new Set(mockAthletes.map(a => a.sport)));
  
  const handleFilter = (type: 'team' | 'sport', value: string) => {
    if (type === 'team') {
      setSelectedTeam(selectedTeam === value ? null : value);
    } else {
      setSelectedSport(selectedSport === value ? null : value);
    }
  };
  
  // Apply filters
  const filtered = mockAthletes.filter(athlete => {
    if (selectedTeam && athlete.team !== selectedTeam) return false;
    if (selectedSport && athlete.sport !== selectedSport) return false;
    return true;
  });
  
  const handleCellClick = (athlete: Athlete, date: string, status: WorkoutStatus) => {
    setSelectedWorkout({ athlete, date, status });
  };
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <>
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Team Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Overview of all athletes' training schedules
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          
          {teams.map(team => (
            <Button
              key={team}
              variant={selectedTeam === team ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilter('team', team)}
              className={cn(
                selectedTeam === team && "bg-red-600 hover:bg-red-700"
              )}
            >
              <Users className="w-4 h-4 mr-1" />
              {team}
            </Button>
          ))}
          
          {sports.map(sport => (
            <Button
              key={sport}
              variant={selectedSport === sport ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilter('sport', sport)}
              className={cn(
                selectedSport === sport && "bg-red-600 hover:bg-red-700"
              )}
            >
              {sport}
            </Button>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header row */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="p-2 font-medium text-sm text-muted-foreground">Athlete</div>
              {weekData.map((day, index) => (
                <div key={day.date} className="p-2 text-center">
                  <div className="text-sm font-medium">{dayNames[index]}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Athlete rows */}
            <div className="space-y-1">
              {filtered.map((athlete) => (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-8 gap-2 p-2 rounded-lg hover:bg-gray-900/30 transition-colors"
                >
                  {/* Athlete info */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-xs font-medium">
                        {athlete.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{athlete.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {athlete.team}
                      </div>
                    </div>
                  </div>
                  
                  {/* Workout dots */}
                  {weekData.map((day) => (
                    <div key={day.date} className="flex justify-center items-center p-2">
                      <motion.button
                        className={cn(
                          'w-3 h-3 rounded-full transition-all hover:scale-125',
                          statusColors[day.athletes[athlete.id]?.status || 'rest']
                        )}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCellClick(athlete, day.date, day.athletes[athlete.id])}
                      />
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border/40">
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2 text-sm">
              <div className={cn('w-3 h-3 rounded-full', statusColors[status as keyof typeof statusColors])} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {mockAthletes.length} athletes • 
            Week of {new Date(weekData[0].date).toLocaleDateString()} - {new Date(weekData[6].date).toLocaleDateString()}
          </p>
        </div>
      </Card>

      {/* Workout Detail Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <WorkoutDetail
            athlete={selectedWorkout.athlete}
            date={selectedWorkout.date}
            workoutStatus={selectedWorkout.status}
            onClose={() => setSelectedWorkout(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}