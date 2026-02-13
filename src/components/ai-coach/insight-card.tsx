"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Info, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Minus, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface InsightCardProps {
  insight: {
    id: string
    type: 'info' | 'warning' | 'alert'
    title: string
    summary: string
    explanation: string
    dataPoints: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[]
    action: string
  }
  isExpanded: boolean
  onToggle: () => void
  onFeedback?: (helpful: boolean) => void
}

const insightConfig = {
  info: {
    icon: Info,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    badgeColor: 'bg-blue-500/20 text-blue-400'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    badgeColor: 'bg-yellow-500/20 text-yellow-400'
  },
  alert: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    badgeColor: 'bg-red-500/20 text-red-400'
  }
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
}

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400', 
  stable: 'text-gray-400'
}

export default function InsightCard({ insight, isExpanded, onToggle, onFeedback }: InsightCardProps) {
  const config = insightConfig[insight.type]
  const IconComponent = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className={`
        ${config.bgColor} ${config.borderColor} border
        hover:shadow-lg transition-all duration-200
      `}>
        {/* Header */}
        <motion.button
          onClick={onToggle}
          className="w-full p-4 text-left hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`p-1.5 rounded-full ${config.bgColor} border ${config.borderColor}`}>
                <IconComponent className={`h-4 w-4 ${config.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-white">{insight.title}</h4>
                  <Badge className={`text-xs ${config.badgeColor} border-none`}>
                    {insight.type === 'info' ? 'Informacja' :
                     insight.type === 'warning' ? 'Uwaga' :
                     'Alert'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {insight.summary}
                </p>
              </div>
            </div>
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-2 p-1"
            >
              <ChevronDown className={`h-4 w-4 ${config.color}`} />
            </motion.div>
          </div>
        </motion.button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-4 space-y-4">
                {/* Explanation */}
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <span className="mr-2">🤔</span>
                    Dlaczego ta obserwacja?
                  </h5>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {insight.explanation}
                  </p>
                </div>

                {/* Data points */}
                {insight.dataPoints.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                      <span className="mr-2">📊</span>
                      Kluczowe dane
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {insight.dataPoints.map((point, index) => {
                        const TrendIcon = point.trend ? trendIcons[point.trend] : null
                        const trendColor = point.trend ? trendColors[point.trend] : ''
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
                          >
                            <div>
                              <div className="text-xs text-gray-400">{point.label}</div>
                              <div className="text-sm font-medium text-white">{point.value}</div>
                            </div>
                            {TrendIcon && (
                              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Action */}
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <span className="mr-2">💡</span>
                    Co robić dalej?
                  </h5>
                  <div className={`
                    p-3 rounded-lg border ${config.borderColor} ${config.bgColor}
                  `}>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {insight.action}
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
                  <span className="text-xs text-gray-500">
                    Czy ta analiza była pomocna?
                  </span>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onFeedback?.(true)}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Pomocne"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onFeedback?.(false)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Niepomocne"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}