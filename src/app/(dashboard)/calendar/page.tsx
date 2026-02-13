'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { format, startOfWeek, addDays, isToday, isSameMonth } from 'date-fns';
import { useState } from 'react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Mock events
  const events = [
    {
      id: '1',
      title: 'Morning Run',
      date: new Date(),
      time: '07:00',
      type: 'workout',
      duration: '45 min',
      completed: true,
    },
    {
      id: '2',
      title: 'Strength Training',
      date: addDays(new Date(), 1),
      time: '18:00',
      type: 'workout',
      duration: '60 min',
      completed: false,
    },
    {
      id: '3',
      title: 'Coach Check-in',
      date: addDays(new Date(), 2),
      time: '14:00',
      type: 'meeting',
      duration: '30 min',
      completed: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your training schedule and events
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold min-w-[200px] text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
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
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week View Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = events.filter(event => 
                format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              );

              return (
                <div
                  key={day.toString()}
                  className={`min-h-[120px] p-2 border rounded-lg transition-colors hover:bg-muted/50 ${
                    isToday(day) 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-card border-border'
                  } ${
                    !isSameMonth(day, currentDate) ? 'opacity-40' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday(day) ? 'text-primary' : 'text-foreground'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate cursor-pointer ${
                          event.type === 'workout' 
                            ? event.completed 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-primary/20 text-primary'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="opacity-75">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${
                  event.type === 'workout' 
                    ? event.completed ? 'bg-green-500' : 'bg-primary'
                    : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground">
                      {event.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                    {event.completed && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(event.date, 'EEEE, MMM d')} at {event.time} • {event.duration}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}