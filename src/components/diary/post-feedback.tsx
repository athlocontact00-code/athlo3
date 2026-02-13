"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mic, Clock, Cloud, Zap, Activity, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PostFeedbackProps {
  workoutName?: string
  plannedDuration?: string
  onComplete?: (feedback: PostWorkoutFeedback) => void
  onClose?: () => void
}

interface PostWorkoutFeedback {
  rpe: number
  feeling: number
  hasDeviation: boolean
  deviationReason?: string
  timeDeviation?: string
  notes: string
}

const rpeScale = [
  { value: 1, label: 'Bardzo łatwy', description: 'Odpoczynek' },
  { value: 2, label: 'Łatwy', description: 'Spokojne tempo' },
  { value: 3, label: 'Umiarkowany', description: 'Można rozmawiać' },
  { value: 4, label: 'Nieco trudny', description: 'Lekko ciężko' },
  { value: 5, label: 'Trudny', description: 'Ciężko' },
  { value: 6, label: 'Trudny+', description: 'Bardzo ciężko' },
  { value: 7, label: 'Bardzo trudny', description: 'Bardzo, bardzo ciężko' },
  { value: 8, label: 'Bardzo trudny+', description: 'Prawie maksimum' },
  { value: 9, label: 'Ekstremalnie trudny', description: 'Maksimum' },
  { value: 10, label: 'Maksimum', description: 'Nie można więcej' },
]

const feelingEmojis = [
  { value: 1, emoji: '😫', label: 'Okropnie' },
  { value: 2, emoji: '😞', label: 'Źle' },
  { value: 3, emoji: '😐', label: 'Neutralnie' },
  { value: 4, emoji: '🙂', label: 'Dobrze' },
  { value: 5, emoji: '😄', label: 'Świetnie' },
]

const deviationReasons = [
  { value: 'time', label: 'Czas', icon: Clock, description: 'Za krótko/długo' },
  { value: 'weather', label: 'Pogoda', icon: Cloud, description: 'Warunki pogodowe' },
  { value: 'fatigue', label: 'Zmęczenie', icon: Zap, description: 'Brak energii' },
  { value: 'injury', label: 'Kontuzja', icon: AlertTriangle, description: 'Ból/dyskomfort' },
  { value: 'equipment', label: 'Sprzęt', icon: Activity, description: 'Problem ze sprzętem' },
  { value: 'other', label: 'Inne', icon: MessageSquare, description: 'Inna przyczyna' },
]

export default function PostFeedback({ workoutName = 'Trening', plannedDuration, onComplete, onClose }: PostFeedbackProps) {
  const [feedback, setFeedback] = useState<Partial<PostWorkoutFeedback>>({
    rpe: undefined,
    feeling: undefined,
    hasDeviation: false,
    notes: '',
  })
  const [isRecording, setIsRecording] = useState(false)

  const updateFeedback = (field: string, value: any) => {
    setFeedback(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (feedback.rpe && feedback.feeling !== undefined) {
      onComplete?.(feedback as PostWorkoutFeedback)
    }
  }

  const handleVoiceNote = () => {
    setIsRecording(!isRecording)
    // Mock voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        updateFeedback('notes', (feedback.notes || '') + ' [Notatka głosowa dodana]')
      }, 3000)
    }
  }

  const isComplete = feedback.rpe && feedback.feeling !== undefined

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Jak poszedł trening?</h2>
              <p className="text-sm text-gray-400">{workoutName}</p>
              {plannedDuration && (
                <p className="text-xs text-gray-500">Plan: {plannedDuration}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* RPE Scale */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">
                Jak oceniasz wysiłek? (RPE)
              </h3>
              
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
                  const rpeInfo = rpeScale.find(r => r.value === value)
                  return (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateFeedback('rpe', value)}
                      className={`p-2 rounded-lg border transition-all text-center ${
                        feedback.rpe === value
                          ? 'border-red-600 bg-red-600/20 text-red-400'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400'
                      }`}
                    >
                      <div className="text-lg font-bold">{value}</div>
                      {value <= 5 && (
                        <div className="text-xs">{rpeInfo?.label.split(' ')[0]}</div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              {feedback.rpe && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="text-sm">
                    <div className="font-medium text-white mb-1">
                      RPE {feedback.rpe}/10 - {rpeScale[feedback.rpe - 1]?.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      {rpeScale[feedback.rpe - 1]?.description}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Feeling */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">
                Jak się czujesz po treningu?
              </h3>
              
              <div className="grid grid-cols-5 gap-2">
                {feelingEmojis.map((feeling) => (
                  <motion.button
                    key={feeling.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFeedback('feeling', feeling.value)}
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      feedback.feeling === feeling.value
                        ? 'border-red-600 bg-red-600/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{feeling.emoji}</div>
                    <div className="text-xs text-gray-400">{feeling.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Deviation from plan */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">
                Czy trening przebiegł zgodnie z planem?
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFeedback('hasDeviation', false)}
                  className={`p-3 rounded-lg border transition-all ${
                    feedback.hasDeviation === false
                      ? 'border-green-600 bg-green-600/20 text-green-400'
                      : 'border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  <div className="text-xl mb-1">✅</div>
                  <div className="text-sm">Tak, zgodnie z planem</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFeedback('hasDeviation', true)}
                  className={`p-3 rounded-lg border transition-all ${
                    feedback.hasDeviation === true
                      ? 'border-orange-600 bg-orange-600/20 text-orange-400'
                      : 'border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  <div className="text-xl mb-1">⚠️</div>
                  <div className="text-sm">Nie, były zmiany</div>
                </motion.button>
              </div>

              {/* Deviation details */}
              {feedback.hasDeviation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <label className="text-xs text-gray-400">Powód zmiany:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {deviationReasons.map((reason) => {
                      const IconComponent = reason.icon
                      return (
                        <button
                          key={reason.value}
                          onClick={() => updateFeedback('deviationReason', reason.value)}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            feedback.deviationReason === reason.value
                              ? 'border-orange-600 bg-orange-600/20 text-orange-400'
                              : 'border-gray-700 hover:border-gray-600 text-gray-400'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-3 w-3" />
                            <span className="text-xs">{reason.label}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {feedback.deviationReason === 'time' && (
                    <div>
                      <label className="text-xs text-gray-400">Rzeczywisty czas:</label>
                      <input
                        type="text"
                        placeholder="np. 45 min zamiast 60 min"
                        value={feedback.timeDeviation || ''}
                        onChange={(e) => updateFeedback('timeDeviation', e.target.value)}
                        className="w-full mt-1 p-2 bg-gray-800/50 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:border-red-600 outline-none"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">
                Dodatkowe uwagi
              </h3>
              
              <div className="space-y-2">
                <textarea
                  placeholder="Jak się czułeś podczas treningu? Coś szczególnego?"
                  value={feedback.notes}
                  onChange={(e) => updateFeedback('notes', e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg resize-none focus:border-red-600 outline-none text-white placeholder-gray-400"
                />
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVoiceNote}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                      isRecording
                        ? 'border-red-600 bg-red-600/20 text-red-400'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                    <span className="text-sm">
                      {isRecording ? 'Nagrywanie...' : 'Notatka głosowa'}
                    </span>
                  </motion.button>
                  
                  {isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-red-400"
                    >
                      🔴
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-800/30 rounded-lg border border-gray-700"
              >
                <h4 className="text-sm font-medium text-gray-300 mb-2">Podsumowanie:</h4>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>RPE: {feedback.rpe}/10</div>
                  <div>Samopoczucie: {feelingEmojis.find(f => f.value === feedback.feeling)?.label}</div>
                  <div>Plan: {feedback.hasDeviation ? 'Zmodyfikowany' : 'Zrealizowany'}</div>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Anuluj
              </Button>
              
              <motion.div
                whileHover={isComplete ? { scale: 1.02 } : {}}
                whileTap={isComplete ? { scale: 0.98 } : {}}
                className="flex-1"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!isComplete}
                  className={`w-full ${
                    isComplete
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {isComplete ? 'Zapisz feedback' : 'Uzupełnij oceny'}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}