"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Save, Eye, Clock, Target, Repeat, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WorkoutBuilderProps {
  onSave?: (workout: WorkoutTemplate) => void
  onClose?: () => void
  initialData?: Partial<WorkoutTemplate>
}

interface WorkoutTemplate {
  name: string
  sport: string
  type: string
  totalDuration?: string
  totalDistance?: string
  steps: WorkoutStep[]
  estimatedLoad: number
  saveAsTemplate: boolean
}

interface WorkoutStep {
  id: string
  type: 'warmup' | 'main' | 'interval' | 'rest' | 'cooldown'
  duration?: string
  distance?: string
  targetZone?: string
  description: string
  rest?: string
  intervals?: {
    count: number
    intervalDuration: string
    restDuration: string
  }
}

const sports = [
  { id: 'running', name: 'Bieg', icon: '🏃‍♂️' },
  { id: 'cycling', name: 'Kolarstwo', icon: '🚴‍♂️' },
  { id: 'swimming', name: 'Pływanie', icon: '🏊‍♂️' },
  { id: 'strength', name: 'Siła', icon: '💪' },
  { id: 'tennis', name: 'Tenis', icon: '🎾' },
  { id: 'football', name: 'Piłka nożna', icon: '⚽' },
]

const workoutTypes = {
  running: ['Easy Run', 'Tempo Run', 'Intervals', 'Long Run', 'Recovery', 'Fartlek'],
  cycling: ['Easy Ride', 'Tempo Ride', 'Intervals', 'Long Ride', 'Recovery', 'Hill Repeats'],
  swimming: ['Technique', 'Endurance', 'Intervals', 'Sprint', 'Recovery'],
  strength: ['Full Body', 'Upper Body', 'Lower Body', 'Core', 'Functional'],
  tennis: ['Technique', 'Match Play', 'Conditioning', 'Drills'],
  football: ['Training', 'Match', 'Conditioning', 'Technical'],
}

const stepTypes = [
  { id: 'warmup', name: 'Rozgrzewka', icon: '🔥', color: 'text-orange-400' },
  { id: 'main', name: 'Część główna', icon: '💪', color: 'text-red-400' },
  { id: 'interval', name: 'Interwały', icon: '⚡', color: 'text-yellow-400' },
  { id: 'rest', name: 'Odpoczynek', icon: '😌', color: 'text-blue-400' },
  { id: 'cooldown', name: 'Wyciszenie', icon: '🧊', color: 'text-cyan-400' },
]

const trainingZones = [
  'Zone 1 (Recovery)', 'Zone 2 (Endurance)', 'Zone 3 (Tempo)',
  'Zone 4 (Threshold)', 'Zone 5 (VO2max)', 'Zone 6 (Anaerobic)'
]

const builderSteps = [
  { id: 'sport', title: 'Sport i Typ', icon: '🏃‍♂️' },
  { id: 'target', title: 'Cel treningu', icon: '🎯' },
  { id: 'steps', title: 'Etapy treningu', icon: '📋' },
  { id: 'preview', title: 'Podgląd', icon: '👀' },
]

export default function WorkoutBuilder({ onSave, onClose, initialData }: WorkoutBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [workout, setWorkout] = useState<Partial<WorkoutTemplate>>({
    name: '',
    sport: '',
    type: '',
    totalDuration: '',
    totalDistance: '',
    steps: [],
    estimatedLoad: 0,
    saveAsTemplate: false,
    ...initialData,
  })

  const updateWorkout = (field: string, value: any) => {
    setWorkout(prev => ({ ...prev, [field]: value }))
  }

  const addStep = () => {
    const newStep: WorkoutStep = {
      id: Date.now().toString(),
      type: 'main',
      duration: '',
      description: '',
      targetZone: '',
    }
    updateWorkout('steps', [...(workout.steps || []), newStep])
  }

  const updateStep = (stepId: string, field: string, value: any) => {
    const updatedSteps = (workout.steps || []).map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    )
    updateWorkout('steps', updatedSteps)
  }

  const removeStep = (stepId: string) => {
    const updatedSteps = (workout.steps || []).filter(step => step.id !== stepId)
    updateWorkout('steps', updatedSteps)
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const steps = workout.steps || []
    const index = steps.findIndex(step => step.id === stepId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) return

    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    
    updateWorkout('steps', newSteps)
  }

  const calculateEstimatedLoad = () => {
    // Mock calculation based on duration and intensity
    const steps = workout.steps || []
    let totalMinutes = 0
    
    steps.forEach(step => {
      if (step.duration) {
        const duration = parseInt(step.duration.replace(/\D/g, '')) || 0
        totalMinutes += duration
      }
    })
    
    // Basic TSS calculation (simplified)
    const baseLoad = totalMinutes * 0.5 // Base multiplier
    const intensityMultiplier = steps.some(s => s.type === 'interval') ? 1.5 : 1
    
    return Math.round(baseLoad * intensityMultiplier)
  }

  const handleNext = () => {
    if (currentStep < builderSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      
      // Update estimated load when moving to preview
      if (currentStep === 2) {
        updateWorkout('estimatedLoad', calculateEstimatedLoad())
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    if (workout.name && workout.sport && workout.steps && workout.steps.length > 0) {
      onSave?.(workout as WorkoutTemplate)
    }
  }

  const renderStepContent = () => {
    const step = builderSteps[currentStep]

    switch (step.id) {
      case 'sport':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Wybierz sport</label>
              <div className="grid grid-cols-2 gap-3">
                {sports.map(sport => (
                  <motion.button
                    key={sport.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateWorkout('sport', sport.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      workout.sport === sport.id
                        ? 'border-red-600 bg-red-600/20 text-red-400'
                        : 'border-gray-700 hover:border-gray-600 text-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{sport.icon}</div>
                    <div className="text-sm">{sport.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {workout.sport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="text-sm font-medium text-gray-300">Typ treningu</label>
                <div className="grid grid-cols-2 gap-2">
                  {(workoutTypes[workout.sport as keyof typeof workoutTypes] || []).map(type => (
                    <button
                      key={type}
                      onClick={() => updateWorkout('type', type)}
                      className={`p-2 rounded border text-sm transition-all ${
                        workout.type === type
                          ? 'border-red-600 bg-red-600/20 text-red-400'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {workout.sport && workout.type && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="text-sm font-medium text-gray-300">Nazwa treningu</label>
                <input
                  type="text"
                  placeholder="np. Morning Easy Run"
                  value={workout.name}
                  onChange={(e) => updateWorkout('name', e.target.value)}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                />
              </motion.div>
            )}
          </motion.div>
        )

      case 'target':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Czas trwania</label>
                <input
                  type="text"
                  placeholder="60 min"
                  value={workout.totalDuration}
                  onChange={(e) => updateWorkout('totalDuration', e.target.value)}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Dystans (opcjonalne)</label>
                <input
                  type="text"
                  placeholder="10 km"
                  value={workout.totalDistance}
                  onChange={(e) => updateWorkout('totalDistance', e.target.value)}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">💡 Wskazówki</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Możesz określić cel czasowy lub dystansowy</li>
                <li>• W następnym kroku dodasz szczegółowe etapy</li>
                <li>• System automatycznie obliczy obciążenie treningowe</li>
              </ul>
            </div>
          </motion.div>
        )

      case 'steps':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-300">Etapy treningu</h3>
              <Button
                onClick={addStep}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj etap
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(workout.steps || []).map((step, index) => {
                const stepType = stepTypes.find(st => st.id === step.type)
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{stepType?.icon}</span>
                        <select
                          value={step.type}
                          onChange={(e) => updateStep(step.id, 'type', e.target.value)}
                          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                        >
                          {stepTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === (workout.steps || []).length - 1}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-gray-400">Czas</label>
                        <input
                          type="text"
                          placeholder="20 min"
                          value={step.duration || ''}
                          onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Strefa</label>
                        <select
                          value={step.targetZone || ''}
                          onChange={(e) => updateStep(step.id, 'targetZone', e.target.value)}
                          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-white"
                        >
                          <option value="">Wybierz strefę</option>
                          {trainingZones.map(zone => (
                            <option key={zone} value={zone}>{zone}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="text-xs text-gray-400">Opis</label>
                      <input
                        type="text"
                        placeholder="Opis etapu..."
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                      />
                    </div>

                    {step.type === 'interval' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-3 gap-2"
                      >
                        <div>
                          <label className="text-xs text-gray-400">Powtórzenia</label>
                          <input
                            type="number"
                            placeholder="5"
                            value={step.intervals?.count || ''}
                            onChange={(e) => updateStep(step.id, 'intervals', {
                              ...step.intervals,
                              count: parseInt(e.target.value) || 0
                            })}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Interwał</label>
                          <input
                            type="text"
                            placeholder="2 min"
                            value={step.intervals?.intervalDuration || ''}
                            onChange={(e) => updateStep(step.id, 'intervals', {
                              ...step.intervals,
                              intervalDuration: e.target.value
                            })}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Odpoczynek</label>
                          <input
                            type="text"
                            placeholder="1 min"
                            value={step.intervals?.restDuration || ''}
                            onChange={(e) => updateStep(step.id, 'intervals', {
                              ...step.intervals,
                              restDuration: e.target.value
                            })}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {(workout.steps || []).length === 0 && (
              <div className="p-8 text-center text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-sm">Dodaj pierwszy etap treningu</p>
              </div>
            )}
          </motion.div>
        )

      case 'preview':
        const estimatedLoad = calculateEstimatedLoad()
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/5 rounded-lg border border-red-500/20">
              <h3 className="text-lg font-bold text-white mb-2">{workout.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className="capitalize">{workout.sport} • {workout.type}</span>
                {workout.totalDuration && (
                  <Badge variant="secondary">⏱️ {workout.totalDuration}</Badge>
                )}
                {workout.totalDistance && (
                  <Badge variant="secondary">📏 {workout.totalDistance}</Badge>
                )}
                <Badge className="bg-red-500/20 text-red-400">
                  {estimatedLoad} TSS
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Etapy treningu</h4>
              {(workout.steps || []).map((step, index) => {
                const stepType = stepTypes.find(st => st.id === step.type)
                return (
                  <div
                    key={step.id}
                    className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg"
                  >
                    <span className="text-lg">{stepType?.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {stepType?.name}
                        {step.intervals && step.type === 'interval' && (
                          <span className="ml-2 text-xs text-gray-400">
                            {step.intervals.count}x {step.intervals.intervalDuration} 
                            ({step.intervals.restDuration} odpoczynek)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {step.description}
                        {step.duration && <span> • {step.duration}</span>}
                        {step.targetZone && <span> • {step.targetZone}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Zapisz jako szablon
                </label>
                <input
                  type="checkbox"
                  checked={workout.saveAsTemplate}
                  onChange={(e) => updateWorkout('saveAsTemplate', e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                />
              </div>
              
              <div className="text-xs text-gray-400">
                Szablony można ponownie wykorzystać przy tworzeniu kolejnych treningów
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return workout.sport && workout.type && workout.name
      case 1:
        return workout.totalDuration || workout.totalDistance
      case 2:
        return (workout.steps || []).length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-4xl bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Kreator Treningu</h2>
              <p className="text-sm text-gray-400">Stwórz spersonalizowany plan treningowy</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {builderSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex items-center ${
                    index !== builderSteps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${index <= currentStep
                      ? 'border-red-600 bg-red-600/20 text-red-400'
                      : 'border-gray-600 text-gray-400'
                    }
                  `}>
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      index <= currentStep ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      Krok {index + 1}
                    </div>
                  </div>
                  {index !== builderSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-red-600' : 'bg-gray-700'
                    }`} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

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

            <div className="flex space-x-3">
              {currentStep === builderSteps.length - 1 ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSave}
                    disabled={!canProceed()}
                    className="bg-red-600 hover:bg-red-700 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Zapisz trening
                  </Button>
                </motion.div>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-red-600 hover:bg-red-700 flex items-center"
                >
                  Dalej
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}