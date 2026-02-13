"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { addDays, startOfWeek, format, isSameDay, isToday } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock workout data with time slots
const mockWorkouts = [
  { 
    date: new Date(2025, 1, 10), 
    startTime: '06:00', 
    endTime: '07:00',
    sport: 'running', 
    name: 'Easy Run', 
    duration: '60min',
    load: 45,
    color: 'bg-red-500/80'
  },
  { 
    date: new Date(2025, 1, 10), 
    startTime: '18:00', 
    endTime: '19:00',
    sport: 'strength', 
    name: 'Core & Strength', 
    duration: '60min',
    load: 35,
    color: 'bg-green-500/80'
  },
  { 
    date: new Date(2025, 1, 11), 
    startTime: '17:30', 
    endTime: '19:00',
    sport: 'cycling', 
    name: 'Tempo Ride', 
    duration: '90min',
    load: 65,
    color: 'bg-yellow-500/80'
  },
  { 
    date: new Date(2025, 1, 12), 
    startTime: '06:30', 
    endTime: '07:15',
    sport: 'swimming', 
    name: 'Technique', 
    duration: '45min',
    load: 40,
    color: 'bg-blue-500/80'
  },
  { 
    date: new Date(2025, 1, 13), 
    startTime: '07:00', 
    endTime: '08:30',
    sport: 'running', 
    name: 'Long Run', 
    duration: '90min',
    load: 85,
    color: 'bg-red-500/80'
  },
  { 
    date: new Date(2025, 1, 14), 
    startTime: '08:00', 
    endTime: '10:00',
    sport: 'race', 
    name: '10K Race', 
    duration: '2h',
    load: 95,
    color: 'bg-purple-500/80'
  },
  { 
    date: new Date(2025, 1, 15), 
    startTime: '10:00', 
    endTime: '10:45',
    sport: 'cycling', 
    name: 'Recovery Spin', 
    duration: '45min',
    load: 25,
    color: 'bg-yellow-500/80'
  },
]

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
]

interface WeekViewProps {
  currentDate?: Date
  onWorkoutClick?: (workout: any) => void
}

export default function WeekView({ currentDate = new Date(), onWorkoutClick }: WeekViewProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }))

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i))
    }
    return days
  }, [weekStart])

  const getWorkoutsForDate = (date: Date) => {
    return mockWorkouts.filter(workout => isSameDay(workout.date, date))
  }

  const getTotalLoadForDate = (date: Date) => {
    return getWorkoutsForDate(date).reduce((total, workout) => total + workout.load, 0)
  }

  const getComplianceForDate = (date: Date) => {
    const workouts = getWorkoutsForDate(date)
    if (workouts.length === 0) return 100 // Rest day = 100% compliance
    // Mock compliance calculation
    return Math.floor(Math.random() * 30) + 70 // 70-100%
  }

  const handlePrevWeek = () => {
    setWeekStart(prev => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setWeekStart(prev => addDays(prev, 7))
  }

  const handleToday = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const getWorkoutPositionInSlot = (workout: any, timeSlot: string) => {
    const workoutHour = parseInt(workout.startTime.split(':')[0])
    const slotHour = parseInt(timeSlot.split(':')[0])
    const workoutMinutes = parseInt(workout.startTime.split(':')[1])
    
    if (workoutHour !== slotHour) return null
    
    const topPercent = (workoutMinutes / 60) * 100
    const duration = 
      (parseInt(workout.endTime.split(':')[0]) - parseInt(workout.startTime.split(':')[0])) * 60 +
      parseInt(workout.endTime.split(':')[1]) - parseInt(workout.startTime.split(':')[1])
    const heightPercent = Math.min((duration / 60) * 100, 100)
    
    return { top: `${topPercent}%`, height: `${heightPercent}%` }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">
            {format(weekStart, 'd MMM', { locale: pl })} - {format(addDays(weekStart, 6), 'd MMM yyyy', { locale: pl })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-xs"
          >
            Dzisiaj
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <Card className="p-4 bg-gray-900/50 border-gray-800 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-4">
            <div className="w-16"></div> {/* Empty space for time column */}
            {weekDays.map((day, index) => (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  text-center p-2 rounded-lg transition-all
                  ${isToday(day) ? 'bg-red-600/20 border border-red-600/30' : 'bg-gray-800/30'}
                `}
              >
                <div className="text-xs text-gray-400 font-medium">
                  {format(day, 'EEE', { locale: pl })}
                </div>
                <div className={`text-lg font-bold ${
                  isToday(day) ? 'text-red-400' : 'text-white'
                }`}>
                  {format(day, 'd')}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Time grid */}
          <div className="relative">
            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-1 mb-1">
                {/* Time label */}
                <div className="w-16 text-xs text-gray-400 py-2 text-right pr-2">
                  {timeSlot}
                </div>

                {/* Day columns */}
                {weekDays.map((day, dayIndex) => {
                  const dayWorkouts = getWorkoutsForDate(day)
                  const slotWorkouts = dayWorkouts.filter(workout => {
                    const workoutHour = parseInt(workout.startTime.split(':')[0])
                    const slotHour = parseInt(timeSlot.split(':')[0])
                    return workoutHour === slotHour
                  })

                  return (
                    <div 
                      key={`${day.toString()}-${timeSlot}`} 
                      className="relative h-12 border border-gray-800 rounded"
                    >
                      {slotWorkouts.map((workout, workoutIndex) => {
                        const position = getWorkoutPositionInSlot(workout, timeSlot)
                        if (!position) return null

                        return (
                          <motion.div
                            key={workoutIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (timeIndex * 7 + dayIndex) * 0.01 }}
                            className={`
                              absolute left-1 right-1 rounded text-xs p-1 cursor-pointer
                              ${workout.color} text-white font-medium
                              hover:scale-105 hover:z-10 transition-transform
                            `}
                            style={{
                              top: position.top,
                              height: position.height,
                              minHeight: '20px'
                            }}
                            onClick={() => onWorkoutClick?.(workout)}
                          >
                            <div className="truncate">{workout.name}</div>
                            <div className="text-[10px] opacity-80">{workout.duration}</div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Daily summaries */}
          <div className="grid grid-cols-8 gap-1 mt-4">
            <div className="w-16"></div> {/* Empty space for time column */}
            {weekDays.map((day, index) => {
              const totalLoad = getTotalLoadForDate(day)
              const compliance = getComplianceForDate(day)
              
              return (
                <motion.div
                  key={day.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  {/* Load bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Load</span>
                      <span className="text-white font-medium">{totalLoad}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((totalLoad / 100) * 100, 100)}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          totalLoad > 80 ? 'bg-red-500' :
                          totalLoad > 60 ? 'bg-yellow-500' :
                          totalLoad > 30 ? 'bg-green-500' :
                          'bg-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Compliance indicator */}
                  <div className="flex items-center justify-center">
                    <Badge 
                      className={`text-xs px-2 py-1 ${
                        compliance >= 90 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        compliance >= 70 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {compliance}%
                    </Badge>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}