"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Heart, Moon, Brain, Zap, Scale, MessageSquare, Target } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CheckInFormProps {
  onSubmit?: (data: CheckInData) => void
  onClose?: () => void
}

interface CheckInData {
  hrv: number
  hrvTrend: 'up' | 'down' | 'stable'
  sleepHours: number
  sleepQuality: number
  stress: number
  mood: number
  doms: { [key: string]: number }
  readiness: number
  weight?: number
  weightTrend?: 'up' | 'down' | 'stable'
  notes: string
  tags: string[]
}

const steps = [
  { id: 'hrv', title: 'HRV', icon: Heart, description: 'Jak się czujesz dziś rano?' },
  { id: 'sleep', title: 'Sen', icon: Moon, description: 'Jak spałeś tej nocy?' },
  { id: 'stress', title: 'Stres', icon: Brain, description: 'Jaki jest Twój poziom stresu?' },
  { id: 'mood', title: 'Nastrój', icon: Zap, description: 'Jak się czujesz emocjonalnie?' },
  { id: 'body', title: 'Ciało', icon: Target, description: 'Jak czuje się Twoje ciało?' },
  { id: 'weight', title: 'Waga', icon: Scale, description: 'Dzisiejsza waga (opcjonalne)' },
  { id: 'notes', title: 'Notatki', icon: MessageSquare, description: 'Dodatkowe uwagi' },
]

const moodEmojis = [
  { value: 1, emoji: '😫', label: 'Bardzo źle' },
  { value: 2, emoji: '😟', label: 'Źle' },
  { value: 3, emoji: '😐', label: 'Neutralnie' },
  { value: 4, emoji: '🙂', label: 'Dobrze' },
  { value: 5, emoji: '😄', label: 'Świetnie' },
]

const sleepQualityStars = [
  { value: 1, label: 'Bardzo źle' },
  { value: 2, label: 'Źle' },
  { value: 3, label: 'Średnio' },
  { value: 4, label: 'Dobrze' },
  { value: 5, label: 'Doskonale' },
]

const quickTags = [
  'Podróż', 'Choroba', 'Zły sen', 'Stres', 'Praca', 'Rodzina', 
  'Zmęczenie', 'Ból', 'Energia', 'Motywacja'
]

const bodyParts = [
  { key: 'legs', name: 'Nogi', position: 'bottom' },
  { key: 'core', name: 'Brzuch/Core', position: 'middle' },
  { key: 'back', name: 'Plecy', position: 'middle' },
  { key: 'arms', name: 'Ramiona', position: 'top' },
  { key: 'neck', name: 'Szyja', position: 'top' },
]

export default function CheckInForm({ onSubmit, onClose }: CheckInFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CheckInData>>({
    hrv: 45,
    hrvTrend: 'stable',
    sleepHours: 7,
    sleepQuality: 3,
    stress: 5,
    mood: 3,
    doms: {},
    notes: '',
    tags: [],
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateReadiness = () => {
    const { hrv, sleepQuality, stress, mood, doms } = formData
    const baseHrv = 45 // Mock baseline
    const hrvScore = Math.min(100, Math.max(0, ((hrv || baseHrv) / baseHrv) * 25))
    const sleepScore = ((sleepQuality || 3) / 5) * 25
    const stressScore = ((10 - (stress || 5)) / 10) * 25
    const moodScore = ((mood || 3) / 5) * 25
    
    // Factor in DOMS
    const domsValues = Object.values(doms || {})
    const avgDoms = domsValues.length > 0 ? domsValues.reduce((a, b) => a + b, 0) / domsValues.length : 5
    const domsScore = Math.max(0, (10 - avgDoms) / 10) * 100
    
    return Math.round((hrvScore + sleepScore + stressScore + moodScore) * 0.8 + domsScore * 0.2)
  }

  const handleSubmit = () => {
    const readiness = calculateReadiness()
    const completeData: CheckInData = {
      ...formData as CheckInData,
      readiness,
    }
    onSubmit?.(completeData)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderStep = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case 'hrv':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">{formData.hrv}</div>
              <div className="text-sm text-gray-400">Dzisiejszy HRV</div>
              <div className="flex items-center justify-center mt-2">
                <span className={`text-sm ${
                  formData.hrvTrend === 'up' ? 'text-green-400' :
                  formData.hrvTrend === 'down' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {formData.hrvTrend === 'up' ? '↗️ Wzrost' :
                   formData.hrvTrend === 'down' ? '↘️ Spadek' :
                   '→ Stabilnie'}
                </span>
                <span className="text-xs text-gray-500 ml-2">vs 7-dni</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-300">Trend HRV</label>
              <div className="grid grid-cols-3 gap-2">
                {['up', 'stable', 'down'].map(trend => (
                  <button
                    key={trend}
                    onClick={() => updateFormData('hrvTrend', trend)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.hrvTrend === trend
                        ? 'border-red-600 bg-red-600/20 text-red-400'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-lg mb-1">
                      {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→'}
                    </div>
                    <div className="text-xs">
                      {trend === 'up' ? 'Wzrost' : trend === 'down' ? 'Spadek' : 'Stabilnie'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-300">Wartość HRV</label>
              <input
                type="range"
                min="20"
                max="100"
                value={formData.hrv}
                onChange={(e) => updateFormData('hrv', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>20</span>
                <span>100</span>
              </div>
            </div>
          </motion.div>
        )

      case 'sleep':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <label className="text-sm text-gray-300">Godziny snu</label>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{formData.sleepHours}h</div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={formData.sleepHours}
                  onChange={(e) => updateFormData('sleepHours', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-300">Jakość snu</label>
              <div className="flex justify-center space-x-2">
                {sleepQualityStars.map((star) => (
                  <button
                    key={star.value}
                    onClick={() => updateFormData('sleepQuality', star.value)}
                    className={`p-2 text-2xl transition-all ${
                      (formData.sleepQuality || 0) >= star.value
                        ? 'text-yellow-400 scale-110'
                        : 'text-gray-600 hover:text-yellow-400/50'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <div className="text-center text-sm text-gray-400">
                {sleepQualityStars.find(s => s.value === formData.sleepQuality)?.label}
              </div>
            </div>
          </motion.div>
        )

      case 'stress':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                (formData.stress || 5) <= 3 ? 'text-green-400' :
                (formData.stress || 5) <= 7 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {formData.stress}/10
              </div>
              <div className="text-sm text-gray-400">Poziom stresu</div>
            </div>

            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stress}
                onChange={(e) => updateFormData('stress', parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    #10b981 0%, #10b981 30%, 
                    #f59e0b 30%, #f59e0b 70%, 
                    #ef4444 70%, #ef4444 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Spokojny</span>
                <span>Bardzo stresujący</span>
              </div>
            </div>
          </motion.div>
        )

      case 'mood':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center text-sm text-gray-400 mb-4">Wybierz swój nastrój</div>
            
            <div className="grid grid-cols-5 gap-3">
              {moodEmojis.map((moodOption) => (
                <motion.button
                  key={moodOption.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateFormData('mood', moodOption.value)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    formData.mood === moodOption.value
                      ? 'border-red-600 bg-red-600/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{moodOption.emoji}</div>
                  <div className="text-xs text-gray-400">{moodOption.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )

      case 'body':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center text-sm text-gray-400 mb-4">
              Oceń ból/sztywność każdej części ciała (1 = brak bólu, 10 = bardzo bolesne)
            </div>
            
            <div className="space-y-4">
              {bodyParts.map((part) => (
                <div key={part.key} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300">{part.name}</label>
                    <span className="text-sm font-medium text-white">
                      {formData.doms?.[part.key] || 1}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.doms?.[part.key] || 1}
                    onChange={(e) => updateFormData('doms', {
                      ...formData.doms,
                      [part.key]: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Brak bólu</span>
                    <span>Bardzo bolesne</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )

      case 'weight':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <label className="text-sm text-gray-300">Waga (kg)</label>
              <div className="text-center">
                <input
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={formData.weight || ''}
                  onChange={(e) => updateFormData('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="text-3xl font-bold bg-transparent text-center border-b border-gray-600 focus:border-red-600 outline-none w-32 text-white"
                />
                <div className="text-sm text-gray-400 mt-2">Opcjonalne</div>
              </div>
            </div>

            {formData.weight && (
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Trend wagowy</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'up', label: 'Wzrost', emoji: '↗️', color: 'text-red-400' },
                    { value: 'stable', label: 'Stabilnie', emoji: '→', color: 'text-gray-400' },
                    { value: 'down', label: 'Spadek', emoji: '↘️', color: 'text-green-400' },
                  ].map(trend => (
                    <button
                      key={trend.value}
                      onClick={() => updateFormData('weightTrend', trend.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.weightTrend === trend.value
                          ? 'border-red-600 bg-red-600/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">{trend.emoji}</div>
                      <div className={`text-xs ${trend.color}`}>{trend.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )

      case 'notes':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <label className="text-sm text-gray-300">Szybkie tagi</label>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const tags = formData.tags || []
                      const newTags = tags.includes(tag)
                        ? tags.filter(t => t !== tag)
                        : [...tags, tag]
                      updateFormData('tags', newTags)
                    }}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      (formData.tags || []).includes(tag)
                        ? 'border-red-600 bg-red-600/20 text-red-400'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-300">Dodatkowe notatki</label>
              <textarea
                placeholder="Jak się dziś czujesz? Coś specjalnego dzieje się w Twoim życiu?"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={4}
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg resize-none focus:border-red-600 outline-none text-white placeholder-gray-400"
              />
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const readiness = calculateReadiness()

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
              <h2 className="text-lg font-bold text-white">Codzienny Check-in</h2>
              <p className="text-sm text-gray-400">Krok {currentStep + 1} z {steps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                className="h-full bg-red-600 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              {(() => {
                const StepIcon = steps[currentStep].icon
                return <StepIcon className="h-5 w-5 text-red-400 mr-2" />
              })()}
              <div>
                <h3 className="text-white font-medium">{steps[currentStep].title}</h3>
                <p className="text-sm text-gray-400">{steps[currentStep].description}</p>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Readiness preview (last step) */}
          {currentStep === steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Twoja dzisiejsza gotowość</div>
                <div className={`text-3xl font-bold mb-2 ${
                  readiness >= 80 ? 'text-green-400' :
                  readiness >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {readiness}%
                </div>
                <div className={`text-xs ${
                  readiness >= 80 ? 'text-green-400' :
                  readiness >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {readiness >= 80 ? 'Wysoka gotowość' :
                   readiness >= 60 ? 'Średnia gotowość' :
                   'Niska gotowość'}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Wstecz
            </Button>

            {currentStep === steps.length - 1 ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                >
                  Zapisz Check-in
                </Button>
              </motion.div>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center"
              >
                Dalej
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}