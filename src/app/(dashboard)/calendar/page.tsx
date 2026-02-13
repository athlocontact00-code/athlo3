'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  PersonStanding,
  Bike,
  Dumbbell,
  Waves,
  MapPin,
  Clock,
  Target
} from 'lucide-react';
import { format, startOfWeek, addDays, isToday, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SportType = 'all' | 'running' | 'cycling' | 'strength' | 'swimming';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSport, setSelectedSport] = useState<SportType>('all');
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  // Mock events with sports
  const events = [
    {
      id: '1',
      title: 'Morning Run',
      date: new Date(),
      time: '07:00',
      type: 'workout',
      sport: 'running',
      duration: '45 min',
      distance: '8.5 km',
      completed: true,
      location: 'Park Route',
    },
    {
      id: '2',
      title: 'Strength Training',
      date: addDays(new Date(), 1),
      time: '18:00',
      type: 'workout',
      sport: 'strength',
      duration: '60 min',
      completed: false,
      location: 'Home Gym',
    },
    {
      id: '3',
      title: 'Evening Ride',
      date: addDays(new Date(), 2),
      time: '17:30',
      type: 'workout',
      sport: 'cycling',
      duration: '90 min',
      distance: '32 km',
      completed: false,
      location: 'Bike Path',
    },
    {
      id: '4',
      title: 'Waves Session',
      date: addDays(new Date(), 3),
      time: '06:00',
      type: 'workout',
      sport: 'swimming',
      duration: '45 min',
      distance: '2000m',
      completed: false,
      location: 'Pool',
    },
  ];

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'running': return PersonStanding;
      case 'cycling': return Bike;
      case 'strength': return Dumbbell;
      case 'swimming': return Waves;
      default: return Target;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'running': return 'text-blue-500 bg-blue-500/10';
      case 'cycling': return 'text-green-500 bg-green-500/10';
      case 'strength': return 'text-purple-500 bg-purple-500/10';
      case 'swimming': return 'text-cyan-500 bg-cyan-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const filteredEvents = selectedSport === 'all' 
    ? events 
    : events.filter(event => event.sport === selectedSport);

  const selectedDayEvents = selectedDay 
    ? filteredEvents.filter(event => 
        format(event.date, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd')
      )
    : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = addDays(currentDate, direction === 'next' ? 7 : -7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  const renderCalendar = () => {
    if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = addDays(calendarStart, 41); // 6 weeks
      const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

      return (
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayEvents = filteredEvents.filter(event => 
              format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
            );

            return (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-[120px] p-2 border rounded-lg transition-all cursor-pointer hover:shadow-md",
                  isToday(day) 
                    ? 'bg-primary/10 border-primary/30 shadow-md' 
                    : 'bg-card/50 backdrop-blur-sm border-border hover:bg-card/80',
                  !isSameMonth(day, currentDate) && 'opacity-40',
                  selectedDay && format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && 
                    'ring-2 ring-primary ring-offset-2'
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-2",
                  isToday(day) ? 'text-primary' : 'text-foreground'
                )}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const SportIcon = getSportIcon(event.sport);
                    return (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "text-xs p-1.5 rounded truncate cursor-pointer flex items-center gap-1",
                          event.completed 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : getSportColor(event.sport)
                        )}
                      >
                        <SportIcon className="h-3 w-3 flex-shrink-0" />
                        <div className="truncate">
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="opacity-75">{event.time}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      );
    } else {
      // Week view
      const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

      return (
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => {
            const dayEvents = filteredEvents.filter(event => 
              format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
            );

            return (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-[200px] p-3 border rounded-xl transition-all cursor-pointer",
                  isToday(day) 
                    ? 'bg-primary/10 border-primary/30 shadow-lg' 
                    : 'bg-card/50 backdrop-blur-sm border-border hover:shadow-md',
                  selectedDay && format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && 
                    'ring-2 ring-primary ring-offset-2'
                )}
              >
                <div className="text-center mb-3">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {format(day, 'EEE')}
                  </div>
                  <div className={cn(
                    "text-lg font-bold",
                    isToday(day) ? 'text-primary' : 'text-foreground'
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="space-y-2">
                  {dayEvents.map((event) => {
                    const SportIcon = getSportIcon(event.sport);
                    return (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "p-2 rounded-lg text-xs",
                          event.completed 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : getSportColor(event.sport)
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <SportIcon className="h-3 w-3" />
                          <span className="font-medium">{event.title}</span>
                        </div>
                        <div className="text-xs opacity-75">{event.time} • {event.duration}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      );
    }
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your training schedule and events
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => view === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-lg font-semibold min-w-[200px] text-center">
                      {view === 'month' 
                        ? format(currentDate, 'MMMM yyyy')
                        : `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')}`
                      }
                    </h2>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => view === 'month' ? navigateMonth('next') : navigateWeek('next')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant={view === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant={view === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('week')}
                  >
                    Week
                  </Button>

                  {/* Sport Filter */}
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value as SportType)}
                    className="px-3 py-1 bg-background border border-border rounded-md text-sm"
                  >
                    <option value="all">All Sports</option>
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="strength">Strength</option>
                    <option value="swimming">Waves</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week View Header */}
              {view === 'month' && (
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${view}-${format(currentDate, 'yyyy-MM')}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderCalendar()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar - Selected Day Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* Selected Day Details */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">
                {selectedDay ? format(selectedDay, 'EEEE, MMM d') : 'Select a day'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDay && (
                <div className="space-y-3">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map((event) => {
                      const SportIcon = getSportIcon(event.sport);
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "p-3 rounded-lg border",
                            event.completed 
                              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                              : 'bg-background/50'
                          )}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <SportIcon className={cn("h-4 w-4 mt-0.5", getSportColor(event.sport).split(' ')[0])} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                {event.time} • {event.duration}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </div>
                              )}
                              {event.distance && (
                                <div className="text-xs text-muted-foreground">
                                  Distance: {event.distance}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No events scheduled</p>
                      <Button
                        size="sm"
                        onClick={() => setShowAddWorkout(true)}
                        className="mt-2"
                      >
                        Add Workout
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEvents.filter(event => !event.completed).slice(0, 4).map((event) => {
                  const SportIcon = getSportIcon(event.sport);
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-background/50 text-sm"
                    >
                      <SportIcon className={cn("h-3 w-3", getSportColor(event.sport).split(' ')[0])} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, 'MMM d')} • {event.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddWorkout(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </motion.div>
    </div>
  );
}