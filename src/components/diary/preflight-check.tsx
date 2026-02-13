"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, AlertTriangle, Heart, CheckCircle, XCircle, Edit } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PreflightCheckProps {
  onComplete?: (suggestion: string, responses: PreflightResponses) => void
  onClose?: () => void
  currentReadiness?: number
}

interface PreflightResponses {
  energy: number
  pain: number
  motivation: number
}

const questions = [
  {
    id: 'energy',
    title: 'Jak oceniasz swoją energię?',
    icon: Zap,
    color: 'text-yellow-400',
    scale: [
      { value: 1, label: 'Bardzo niska', emoji: '😴' },
      { value: 2, label: 'Niska', emoji: '😪' },
      { value: 3, label: 'Średnia', emoji: '😐' },
      { value: 4, label: 'Dobra', emoji: '🙂' },
      { value: 5, label: 'Bardzo dobra', emoji: '⚡' },
    ]
  },
  {
    id: 'pain',
    title: 'Czy odczuwasz ból lub dyskomfort?',
    icon: AlertTriangle,
    color: 'text-red-400',
    scale: [
      { value: 1, label: 'Brak bólu', emoji: '✅' },
      { value: 2, label: 'Lekki dyskomfort', emoji: '😌' },
      { value: 3, label: 'Umiarkowany ból', emoji: '😕' },
      { value: 4, label: 'Silny ból', emoji: '😣' },
      { value: 5, label: 'Bardzo silny ból', emoji: '🤕' },
    ]
  },
  {
    id: 'motivation',
    title: 'Jak oceniasz swoją motywację?',
    icon: Heart,
    color: 'text-red-400',
    scale: [
      { value: 1, label: 'Bardzo niska', emoji: '😞' },
      { value: 2, label: 'Niska', emoji: '😔' },
      { value: 3, label: 'Średnia', emoji: '😐' },
      { value: 4, label: 'Wysoka', emoji: '😊' },
      { value: 5, label: 'Bardzo wysoka', emoji: '🔥' },
    ]
  },
]

export default function PreflightCheck({ onComplete, onClose, currentReadiness = 75 }: PreflightCheckProps) {
  const [responses, setResponses] = useState<Partial<PreflightResponses>>({})
  const [showSuggestion, setShowSuggestion] = useState(false)

  const handleResponse = (questionId: string, value: number) => {
    const newResponses = { ...responses, [questionId]: value }
    setResponses(newResponses)
    
    // Show suggestion after all questions answered
    if (Object.keys(newResponses).length === 3) {
      setTimeout(() => setShowSuggestion(true), 500)
    }
  }

  const calculateSuggestion = () => {
    if (Object.keys(responses).length < 3) return null

    const { energy, pain, motivation } = responses as PreflightResponses
    
    // Algorithm to determine training suggestion
    const readinessFactor = currentReadiness / 100
    const energyFactor = energy / 5
    const painFactor = (6 - pain) / 5 // Invert pain (less pain = better)
    const motivationFactor = motivation / 5
    
    const overallScore = (readinessFactor + energyFactor + painFactor + motivationFactor) / 4

    // Decision logic
    if (pain >= 4) {
      return {
        type: 'rest',
        title: 'Rozważ odpoczynek',
        description: 'Wysoki poziom bólu wskazuje na potrzebę regeneracji. Lepiej odpocząć dziś.',
        color: 'text-red-400 border-red-500/30 bg-red-500/10',
        icon: XCircle,
        intensity: 'rest'
      }
    }

    if (overallScore >= 0.75) {
      return {
        type: 'go',
        title: 'Realizuj plan',
        description: 'Świetnie się czujesz! Możesz realizować trening zgodnie z planem.',
        color: 'text-green-400 border-green-500/30 bg-green-500/10',
        icon: CheckCircle,
        intensity: 'planned'
      }
    }

    if (overallScore >= 0.5) {
      return {
        type: 'reduce',
        title: 'Zmniejsz intensywność',
        description: 'Nie czujesz się w 100%. Zmniejsz intensywność o 20-30%.',
        color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
        icon: Edit,
        intensity: 'reduced'
      }
    }

    return {
      type: 'rest',
      title: 'Rozważ odpoczynek',
      description: 'Niska energia i motywacja. Dzień odpoczynku może być lepszy niż słaby trening.',
      color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      icon: XCircle,
      intensity: 'rest'
    }
  }

  const suggestion = calculateSuggestion()
  const allAnswered = Object.keys(responses).length === 3

  const handleAcceptSuggestion = () => {
    if (suggestion && allAnswered) {
      onComplete?.(suggestion.intensity, responses as PreflightResponses)
    }
  }

  const handleCustomModify = () => {
    // Allow user to modify the suggestion
    onComplete?.('custom', responses as PreflightResponses)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Preflight Check</h2>
              <p className="text-sm text-gray-400">Sprawdź swoją gotowość</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Current readiness */}
          <div className="mb-6 p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Dzisiejsza gotowość</span>
              <span className={`text-lg font-bold ${
                currentReadiness >= 80 ? 'text-green-400' :
                currentReadiness >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {currentReadiness}%
              </span>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6 mb-6">
            {questions.map((question, index) => {
              const QuestionIcon = question.icon
              const currentValue = responses[question.id as keyof PreflightResponses]
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <QuestionIcon className={`h-4 w-4 ${question.color}`} />
                    <h3 className="text-sm font-medium text-white">{question.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {question.scale.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleResponse(question.id, option.value)}
                        className={`p-2 rounded-lg border transition-all text-center ${
                          currentValue === option.value
                            ? 'border-red-600 bg-red-600/20 text-red-400'
                            : 'border-gray-700 hover:border-gray-600 text-gray-400'
                        }`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-xs">{option.value}</div>
                      </motion.button>
                    ))}
                  </div>
                  
                  {currentValue && (
                    <div className="text-xs text-gray-400 text-center">
                      {question.scale.find(s => s.value === currentValue)?.label}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Suggestion */}
          {showSuggestion && suggestion && allAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className={`p-4 border ${suggestion.color}`}>
                <div className="flex items-start space-x-3">
                  <suggestion.icon className={`h-5 w-5 mt-0.5 ${suggestion.color.split(' ')[0]}`} />
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${suggestion.color.split(' ')[0]}`}>
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      {suggestion.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleAcceptSuggestion}
                      >
                        Akceptuj
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCustomModify}
                      >
                        Modyfikuj
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Postęp</span>
              <span>{Object.keys(responses).length}/3</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Object.keys(responses).length / 3) * 100}%` }}
                className="h-full bg-red-600 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Summary of responses */}
          {allAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h4 className="text-sm font-medium text-gray-300">Twoje odpowiedzi:</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Energia:</span>
                <Badge variant="secondary">{responses.energy}/5</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Ból:</span>
                <Badge variant="secondary">{responses.pain}/5</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Motywacja:</span>
                <Badge variant="secondary">{responses.motivation}/5</Badge>
              </div>
            </motion.div>
          )}

          {!showSuggestion && allAnswered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-400"
            >
              Analizuję Twoje odpowiedzi...
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}