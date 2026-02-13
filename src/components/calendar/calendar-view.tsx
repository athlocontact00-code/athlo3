"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock workout data
const mockWorkouts = [
  { date: new Date(2025, 1, 3), type: 'running', name: 'Easy Run', duration: '45min', color: 'bg-red-500' },
  { date: new Date(2025, 1, 4), type: 'cycling', name: 'Tempo Ride', duration: '60min', color: 'bg-yellow-500' },
  { date: new Date(2025, 1, 5), type: 'swimming', name: 'Technique', duration: '30min', color: 'bg-blue-500' },
  { date: new Date(2025, 1, 6), type: 'rest', name: 'Rest Day', duration: '', color: 'bg-gray-400' },
  { date: new Date(2025, 1, 7), type: 'running', name: 'Long Run', duration: '90min', color: 'bg-red-500' },
  { date: new Date(2025, 1, 8), type: 'race', name: '10K Race', duration: '', color: 'bg-purple-500' },
  { date: new Date(2025, 1, 10), type: 'cycling', name: 'Recovery Spin', duration: '45min', color: 'bg-yellow-500' },
  { date: new Date(2025, 1, 11), type: 'strength', name: 'Core & Strength', duration: '40min', color: 'bg-green-500' },
  { date: new Date(2025, 1, 12), type: 'running', name: 'Intervals', duration: '50min', color: 'bg-red-500' },
  { date: new Date(2025, 1, 14), type: 'swimming', name: 'Endurance', duration: '45min', color: 'bg-blue-500' },
  { date: new Date(2025, 1, 15), type: 'running', name: 'Tempo Run', duration: '40min', color: 'bg-red-500' },
  { date: new Date(2025, 1, 16), type: 'cycling', name: 'Hill Repeats', duration: '75min', color: 'bg-yellow-500' },
  { date: new Date(2025, 1, 17), type: 'rest', name: 'Rest Day', duration: '', color: 'bg-gray-400' },
]

interface WorkoutEvent {
  date: Date
  type: string
  name: string
  duration: string
  color: string
}

interface CalendarViewProps {
  onDayClick?: (date: Date, workouts: WorkoutEvent[]) => void
}

export default function CalendarView({ onDayClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = useMemo(() => {
    const daysList = []
    let day = startDate

    while (day <= endDate) {
      daysList.push(day)
      day = addDays(day, 1)
    }

    return daysList
  }, [startDate, endDate])

  const getWorkoutsForDate = (date: Date) => {
    return mockWorkouts.filter(workout => isSameDay(workout.date, date))
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    const workouts = getWorkoutsForDate(date)
    onDayClick?.(date, workouts)
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">
            {format(currentDate, 'LLLL yyyy', { locale: pl })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-xs"
          >
            Today
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4 bg-gray-900/50 border-gray-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={format(currentDate, 'yyyy-MM')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-1"
          >
            {/* Days of week header */}
            {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'].map(day => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-400"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, dayIdx) => {
              const workouts = getWorkoutsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isTodayDate = isToday(day)
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <motion.button
                  key={day.toString()}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: dayIdx * 0.01 }}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative p-2 h-20 rounded-lg border transition-all duration-200 hover:bg-gray-800/50
                    ${isCurrentMonth ? 'border-gray-700' : 'border-transparent'}
                    ${isTodayDate ? 'border-red-600 border-2' : ''}
                    ${isSelected ? 'bg-red-600/20 border-red-600' : ''}
                    ${!isCurrentMonth ? 'opacity-30' : ''}
                  `}
                >
                  {/* Day number */}
                  <div className={`text-sm font-medium ${
                    isTodayDate ? 'text-red-400' : 
                    isCurrentMonth ? 'text-white' : 'text-gray-500'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  {/* Workout indicators */}
                  <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
                    {workouts.slice(0, 3).map((workout, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${workout.color}`}
                      />
                    ))}
                    {workouts.length > 3 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    )}
                  </div>

                  {/* Rest day indicator */}
                  {workouts.some(w => w.type === 'rest') && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    </div>
                  )}

                  {/* Race day indicator */}
                  {workouts.some(w => w.type === 'race') && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Selected day details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 bg-gray-900/50 border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: pl })}
              </h3>
              
              {getWorkoutsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-400">Brak zaplanowanych treningów</p>
              ) : (
                <div className="space-y-2">
                  {getWorkoutsForDate(selectedDate).map((workout, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${workout.color}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{workout.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{workout.type}</p>
                        </div>
                      </div>
                      {workout.duration && (
                        <Badge variant="secondary" className="text-xs">
                          {workout.duration}
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}