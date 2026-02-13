"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WorkoutEventProps {
  workout: {
    id: string
    sport: string
    name: string
    duration: string
    targetZone?: string
    status: 'planned' | 'completed' | 'skipped'
    completedDuration?: string
    completedZone?: string
    description?: string
    load?: number
    rpe?: number
  }
  onClick?: () => void
}

const sportIcons = {
  running: '🏃‍♂️',
  cycling: '🚴‍♂️',
  swimming: '🏊‍♂️',
  strength: '💪',
  rest: '😴',
  race: '🏆',
}

const sportColors = {
  running: 'border-red-500',
  cycling: 'border-yellow-500',
  swimming: 'border-blue-500',
  strength: 'border-green-500',
  rest: 'border-gray-400',
  race: 'border-purple-500',
}

const statusConfig = {
  planned: { label: 'Zaplanowany', color: 'bg-gray-500/20 text-gray-400', icon: '⏳' },
  completed: { label: 'Ukończony', color: 'bg-green-500/20 text-green-400', icon: '✅' },
  skipped: { label: 'Pominięty', color: 'bg-red-500/20 text-red-400', icon: '❌' },
}

export default function WorkoutEvent({ workout, onClick }: WorkoutEventProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
    onClick?.()
  }

  const status = statusConfig[workout.status]
  const sportIcon = sportIcons[workout.sport as keyof typeof sportIcons] || '⚡'
  const borderColor = sportColors[workout.sport as keyof typeof sportColors] || 'border-gray-500'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card 
        className={`
          cursor-pointer transition-all duration-200 
          bg-gray-900/50 border-l-4 ${borderColor}
          hover:bg-gray-800/70 hover:shadow-lg
          border-gray-800
        `}
        onClick={handleClick}
      >
        <div className="p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{sportIcon}</span>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                  {workout.name}
                </h3>
                <p className="text-xs text-gray-400 capitalize">{workout.sport}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${status.color} border-none`}>
                <span className="mr-1">{status.icon}</span>
                {status.label}
              </Badge>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </motion.div>
            </div>
          </div>

          {/* Quick info */}
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            {(workout.status === 'completed' ? workout.completedDuration : workout.duration) && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{workout.status === 'completed' ? workout.completedDuration : workout.duration}</span>
              </div>
            )}
            
            {(workout.targetZone || (workout.status === 'completed' && workout.completedZone)) && (
              <div className="flex items-center space-x-1">
                <Target className="h-3 w-3" />
                <span>
                  {workout.status === 'completed' && workout.completedZone 
                    ? workout.completedZone 
                    : workout.targetZone
                  }
                </span>
              </div>
            )}

            {workout.load && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>{workout.load} TSS</span>
              </div>
            )}
          </div>

          {/* Expanded details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-gray-700"
              >
                <div className="space-y-2">
                  {workout.description && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-300 mb-1">Opis treningu</h4>
                      <p className="text-sm text-gray-400">{workout.description}</p>
                    </div>
                  )}

                  {workout.status === 'completed' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-300 mb-1">Planowany</h4>
                        <div className="space-y-1 text-xs text-gray-500">
                          {workout.duration && <p>Czas: {workout.duration}</p>}
                          {workout.targetZone && <p>Strefa: {workout.targetZone}</p>}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-300 mb-1">Wykonany</h4>
                        <div className="space-y-1 text-xs text-green-400">
                          {workout.completedDuration && <p>Czas: {workout.completedDuration}</p>}
                          {workout.completedZone && <p>Strefa: {workout.completedZone}</p>}
                          {workout.rpe && <p>RPE: {workout.rpe}/10</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {workout.status === 'planned' && (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-2 px-3 bg-green-600/20 border border-green-600/30 rounded-lg text-xs text-green-400 hover:bg-green-600/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Oznacz jako wykonany
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-2 px-3 bg-red-600/20 border border-red-600/30 rounded-lg text-xs text-red-400 hover:bg-red-600/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Pomiń trening
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}