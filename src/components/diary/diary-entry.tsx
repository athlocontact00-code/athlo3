"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ChevronDown, ChevronUp, Moon, Heart, Brain, Target, Scale, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DiaryEntryProps {
  entry: {
    id: string
    date: Date
    readiness: number
    mood: number
    sleepHours: number
    sleepQuality: number
    hrv: number
    hrvTrend: 'up' | 'down' | 'stable'
    stress: number
    weight?: number
    weightTrend?: 'up' | 'down' | 'stable'
    doms: { [key: string]: number }
    notes: string
    tags: string[]
  }
  onClick?: () => void
}

const moodEmojis = [
  { value: 1, emoji: '😫' },
  { value: 2, emoji: '😟' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😄' },
]

const bodyParts = [
  { key: 'legs', name: 'Nogi' },
  { key: 'core', name: 'Brzuch/Core' },
  { key: 'back', name: 'Plecy' },
  { key: 'arms', name: 'Ramiona' },
  { key: 'neck', name: 'Szyja' },
]

export default function DiaryEntry({ entry, onClick }: DiaryEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
    onClick?.()
  }

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return 'text-green-400 border-green-500/30 bg-green-500/10'
    if (readiness >= 60) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    return 'text-red-400 border-red-500/30 bg-red-500/10'
  }

  const getReadinessLabel = (readiness: number) => {
    if (readiness >= 80) return 'Wysoka'
    if (readiness >= 60) return 'Średnia'
    return 'Niska'
  }

  const getMoodEmoji = (mood: number) => {
    return moodEmojis.find(m => m.value === mood)?.emoji || '😐'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      default: return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const avgDoms = Object.keys(entry.doms).length > 0 
    ? Object.values(entry.doms).reduce((a, b) => a + b, 0) / Object.values(entry.doms).length 
    : 1

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
          ${getReadinessColor(entry.readiness)}
          hover:shadow-lg hover:scale-[1.02]
          border
        `}
        onClick={handleClick}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {format(entry.date, 'EEEE, d MMMM', { locale: pl })}
              </h3>
              <p className="text-sm text-gray-400">
                {format(entry.date, 'yyyy', { locale: pl })}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Readiness score */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${getReadinessColor(entry.readiness).split(' ')[0]}`}>
                  {entry.readiness}%
                </div>
                <div className="text-xs text-gray-400">
                  {getReadinessLabel(entry.readiness)}
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </motion.div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                <span className="text-gray-400">Nastrój</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Moon className="h-4 w-4 text-blue-400" />
                <span className="text-white">{entry.sleepHours}h</span>
              </div>

              <div className="flex items-center space-x-1">
                <Heart className={`h-4 w-4 ${getTrendColor(entry.hrvTrend)}`} />
                <span className="text-white">{entry.hrv}</span>
                <span className={`text-xs ${getTrendColor(entry.hrvTrend)}`}>
                  {getTrendIcon(entry.hrvTrend)}
                </span>
              </div>
            </div>

            {entry.tags.length > 0 && (
              <div className="flex space-x-1">
                {entry.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {entry.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{entry.tags.length - 2}
                  </Badge>
                )}
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
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-4">
                    {/* Sleep details */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4 text-blue-400" />
                        <h4 className="text-sm font-medium text-gray-300">Sen</h4>
                      </div>
                      <div className="ml-6 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Godziny:</span>
                          <span className="text-white">{entry.sleepHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Jakość:</span>
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={i < entry.sleepQuality ? 'text-yellow-400' : 'text-gray-600'}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HRV details */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-400" />
                        <h4 className="text-sm font-medium text-gray-300">HRV</h4>
                      </div>
                      <div className="ml-6 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Wartość:</span>
                          <span className="text-white">{entry.hrv}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Trend:</span>
                          <span className={getTrendColor(entry.hrvTrend)}>
                            {getTrendIcon(entry.hrvTrend)} 
                            {entry.hrvTrend === 'up' ? 'Wzrost' :
                             entry.hrvTrend === 'down' ? 'Spadek' :
                             'Stabilnie'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stress */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <h4 className="text-sm font-medium text-gray-300">Stres</h4>
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                entry.stress <= 3 ? 'bg-green-500' :
                                entry.stress <= 7 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${(entry.stress / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-white">{entry.stress}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Weight */}
                    {entry.weight && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Scale className="h-4 w-4 text-green-400" />
                          <h4 className="text-sm font-medium text-gray-300">Waga</h4>
                        </div>
                        <div className="ml-6 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Wartość:</span>
                            <span className="text-white">{entry.weight} kg</span>
                          </div>
                          {entry.weightTrend && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Trend:</span>
                              <span className={getTrendColor(entry.weightTrend)}>
                                {getTrendIcon(entry.weightTrend)}
                                {entry.weightTrend === 'up' ? 'Wzrost' :
                                 entry.weightTrend === 'down' ? 'Spadek' :
                                 'Stabilnie'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    {/* Body soreness */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-orange-400" />
                        <h4 className="text-sm font-medium text-gray-300">Ból/Sztywność</h4>
                      </div>
                      <div className="ml-6 space-y-2">
                        {bodyParts.map((part) => {
                          const value = entry.doms[part.key] || 1
                          return (
                            <div key={part.key} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">{part.name}:</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      value <= 3 ? 'bg-green-500' :
                                      value <= 7 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${(value / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-white text-xs">{value}/10</span>
                              </div>
                            </div>
                          )
                        })}
                        <div className="mt-2 pt-2 border-t border-gray-800">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 font-medium">Średnia:</span>
                            <span className={`font-medium ${
                              avgDoms <= 3 ? 'text-green-400' :
                              avgDoms <= 7 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {avgDoms.toFixed(1)}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {entry.tags.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Tagi</h4>
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {entry.notes && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                          <h4 className="text-sm font-medium text-gray-300">Notatki</h4>
                        </div>
                        <div className="ml-6">
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {entry.notes}
                          </p>
                        </div>
                      </div>
                    )}
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