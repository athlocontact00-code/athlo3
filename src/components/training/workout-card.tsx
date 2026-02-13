"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Clock, Target, TrendingUp, MapPin, Play, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface WorkoutCardProps {
  workout: {
    id: string
    sport: string
    type: string
    name: string
    duration?: string
    distance?: string
    targetZone?: string
    intensity: 'easy' | 'moderate' | 'hard' | 'very-hard'
    load: number
    steps: WorkoutStep[]
    coachNotes?: string
    tags: string[]
    status: 'planned' | 'completed' | 'skipped'
    completedData?: {
      actualDuration?: string
      actualDistance?: string
      avgHR?: number
      rpe?: number
    }
  }
  onClick?: () => void
  onStart?: () => void
  onComplete?: () => void
}

interface WorkoutStep {
  id: string
  type: 'warmup' | 'main' | 'interval' | 'rest' | 'cooldown'
  duration?: string
  distance?: string
  targetZone?: string
  description: string
  rest?: string
}

const sportIcons = {
  running: '🏃‍♂️',
  cycling: '🚴‍♂️',
  swimming: '🏊‍♂️',
  strength: '💪',
  yoga: '🧘‍♀️',
  tennis: '🎾',
  football: '⚽',
}

const sportGradients = {
  running: 'from-red-500/10 to-red-600/5',
  cycling: 'from-yellow-500/10 to-yellow-600/5',
  swimming: 'from-blue-500/10 to-blue-600/5',
  strength: 'from-green-500/10 to-green-600/5',
  yoga: 'from-purple-500/10 to-purple-600/5',
  tennis: 'from-pink-500/10 to-pink-600/5',
  football: 'from-orange-500/10 to-orange-600/5',
}

const intensityColors = {
  easy: 'text-green-400 border-green-500/30',
  moderate: 'text-yellow-400 border-yellow-500/30',
  hard: 'text-orange-400 border-orange-500/30',
  'very-hard': 'text-red-400 border-red-500/30',
}

const intensityLabels = {
  easy: 'Łatwy',
  moderate: 'Umiarkowany',
  hard: 'Trudny',
  'very-hard': 'Bardzo trudny',
}

const stepTypeIcons = {
  warmup: '🔥',
  main: '💪',
  interval: '⚡',
  rest: '😌',
  cooldown: '🧊',
}

const stepTypeColors = {
  warmup: 'text-orange-400 bg-orange-500/10',
  main: 'text-red-400 bg-red-500/10',
  interval: 'text-yellow-400 bg-yellow-500/10',
  rest: 'text-blue-400 bg-blue-500/10',
  cooldown: 'text-cyan-400 bg-cyan-500/10',
}

export default function WorkoutCard({ workout, onClick, onStart, onComplete }: WorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCardClick = () => {
    setIsExpanded(!isExpanded)
    onClick?.()
  }

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStart?.()
  }

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onComplete?.()
  }

  const sportIcon = sportIcons[workout.sport as keyof typeof sportIcons] || '⚡'
  const sportGradient = sportGradients[workout.sport as keyof typeof sportGradients] || 'from-gray-500/10 to-gray-600/5'
  const intensityColor = intensityColors[workout.intensity]
  const intensityLabel = intensityLabels[workout.intensity]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card 
        className={`
          cursor-pointer transition-all duration-300
          bg-gradient-to-br ${sportGradient}
          border-gray-800 hover:border-gray-700 hover:shadow-lg hover:shadow-black/20
        `}
        onClick={handleCardClick}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{sportIcon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                    {workout.name}
                  </h3>
                  <Badge className={`text-xs ${intensityColor} bg-transparent`}>
                    {intensityLabel}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 capitalize">
                  {workout.sport} • {workout.type}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              {workout.status === 'completed' && (
                <div className="text-green-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
              {workout.status === 'skipped' && (
                <div className="text-red-400">
                  <XCircle className="h-5 w-5" />
                </div>
              )}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </motion.div>
            </div>
          </div>

          {/* Target info */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {workout.duration && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">
                  {workout.status === 'completed' && workout.completedData?.actualDuration
                    ? workout.completedData.actualDuration
                    : workout.duration
                  }
                </span>
              </div>
            )}
            
            {workout.distance && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">
                  {workout.status === 'completed' && workout.completedData?.actualDistance
                    ? workout.completedData.actualDistance
                    : workout.distance
                  }
                </span>
              </div>
            )}

            {workout.targetZone && (
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">{workout.targetZone}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-white">{workout.load} TSS</span>
            </div>
          </div>

          {/* Tags */}
          {workout.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {workout.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-800/50 text-gray-300 border-gray-700"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Completed data summary */}
          {workout.status === 'completed' && workout.completedData && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400 font-medium">Ukończony</span>
                <div className="flex space-x-4 text-xs text-gray-300">
                  {workout.completedData.avgHR && (
                    <span>Śr. HR: {workout.completedData.avgHR} bpm</span>
                  )}
                  {workout.completedData.rpe && (
                    <span>RPE: {workout.completedData.rpe}/10</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {workout.status === 'planned' && (
            <div className="flex space-x-2 mb-4">
              <Button
                size="sm"
                onClick={handleStart}
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                <Play className="h-4 w-4 mr-1" />
                Rozpocznij
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleComplete}
                className="flex-1"
              >
                Oznacz jako wykonany
              </Button>
            </div>
          )}

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Coach notes */}
                {workout.coachNotes && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">
                      💭 Notatki trenera
                    </h4>
                    <p className="text-sm text-gray-300">{workout.coachNotes}</p>
                  </div>
                )}

                {/* Workout steps */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300 flex items-center">
                    📋 Plan treningu
                  </h4>
                  <div className="space-y-2">
                    {workout.steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          p-3 rounded-lg border border-gray-700/50 
                          ${stepTypeColors[step.type]}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2">
                            <span className="text-lg">
                              {stepTypeIcons[step.type]}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-white capitalize">
                                  {step.type === 'warmup' ? 'Rozgrzewka' :
                                   step.type === 'main' ? 'Część główna' :
                                   step.type === 'interval' ? 'Interwały' :
                                   step.type === 'rest' ? 'Odpoczynek' :
                                   'Wyciszenie'}
                                </span>
                                {step.targetZone && (
                                  <Badge variant="secondary" className="text-xs">
                                    {step.targetZone}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-300 mb-1">
                                {step.description}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-400">
                                {step.duration && (
                                  <span>⏱️ {step.duration}</span>
                                )}
                                {step.distance && (
                                  <span>📏 {step.distance}</span>
                                )}
                                {step.rest && (
                                  <span>😌 Odpoczynek: {step.rest}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Total summary */}
                <div className="pt-3 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">
                        {workout.steps.length}
                      </div>
                      <div className="text-xs text-gray-400">Etapów</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {workout.load}
                      </div>
                      <div className="text-xs text-gray-400">TSS</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${intensityColor.split(' ')[0]}`}>
                        {intensityLabel}
                      </div>
                      <div className="text-xs text-gray-400">Intensywność</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}