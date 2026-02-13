"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, TrendingUp, Clock, Award, Calculator, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface RacePredictorProps {
  onPredictionUpdate?: (prediction: RacePrediction) => void
}

interface RacePrediction {
  distance: string
  predictedTime: string
  confidence: number
  factors: Factor[]
  historicalData?: HistoricalPrediction[]
}

interface Factor {
  name: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
}

interface HistoricalPrediction {
  date: Date
  predicted: string
  actual?: string
  accuracy?: number
}

const raceDistances = [
  { id: '5k', name: '5K', distance: 5, unit: 'km' },
  { id: '10k', name: '10K', distance: 10, unit: 'km' },
  { id: 'half', name: 'Półmaraton', distance: 21.0975, unit: 'km' },
  { id: 'marathon', name: 'Maraton', distance: 42.195, unit: 'km' },
  { id: 'ultra50', name: 'Ultra 50K', distance: 50, unit: 'km' },
  { id: 'ultra100', name: 'Ultra 100K', distance: 100, unit: 'km' },
  { id: 'custom', name: 'Niestandardowy', distance: 0, unit: 'km' }
]

// Mock current fitness data
const mockFitnessData = {
  currentFTP: 280,
  vo2max: 58,
  thresholdPace: '4:15', // per km
  weeklyVolume: 45, // km
  recentRaces: [
    { distance: '10k', time: '42:30', date: new Date(2025, 0, 15) },
    { distance: '5k', time: '20:15', date: new Date(2024, 11, 20) }
  ],
  trainingConsistency: 0.92,
  currentForm: 0.85
}

export default function RacePredictor({ onPredictionUpdate }: RacePredictorProps) {
  const [selectedDistance, setSelectedDistance] = useState('half')
  const [customDistance, setCustomDistance] = useState('')
  const [prediction, setPrediction] = useState<RacePrediction | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const calculatePrediction = async () => {
    setIsCalculating(true)
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const distance = raceDistances.find(d => d.id === selectedDistance)
    if (!distance) return

    // Mock prediction calculation based on fitness data
    const basePace = convertPaceToSeconds(mockFitnessData.thresholdPace)
    let predictedPace = basePace

    // Adjust for distance
    const distanceFactor = getDistanceFactor(distance.distance)
    predictedPace = basePace * distanceFactor

    // Factor in current form and consistency
    predictedPace *= (2 - mockFitnessData.currentForm) // Lower form = slower pace
    predictedPace *= (2 - mockFitnessData.trainingConsistency) // Lower consistency = slower pace

    const totalSeconds = predictedPace * distance.distance
    const predictedTime = formatTime(totalSeconds)

    // Calculate confidence based on data quality
    let confidence = 0.7
    if (mockFitnessData.recentRaces.length > 0) confidence += 0.1
    if (mockFitnessData.trainingConsistency > 0.8) confidence += 0.1
    if (mockFitnessData.currentForm > 0.8) confidence += 0.1

    // Generate factors
    const factors: Factor[] = [
      {
        name: 'Obecna forma',
        impact: mockFitnessData.currentForm > 0.8 ? 'positive' : 'neutral',
        weight: mockFitnessData.currentForm,
        description: `Forma na poziomie ${Math.round(mockFitnessData.currentForm * 100)}%`
      },
      {
        name: 'Konsystencja treningowa',
        impact: mockFitnessData.trainingConsistency > 0.8 ? 'positive' : 'negative',
        weight: mockFitnessData.trainingConsistency,
        description: `${Math.round(mockFitnessData.trainingConsistency * 100)}% compliance`
      },
      {
        name: 'Tygodniowa objętość',
        impact: mockFitnessData.weeklyVolume > 30 ? 'positive' : 'neutral',
        weight: Math.min(mockFitnessData.weeklyVolume / 50, 1),
        description: `${mockFitnessData.weeklyVolume}km tygodniowo`
      },
      {
        name: 'Ostatnie wyniki',
        impact: mockFitnessData.recentRaces.length > 0 ? 'positive' : 'negative',
        weight: mockFitnessData.recentRaces.length > 0 ? 0.9 : 0.3,
        description: mockFitnessData.recentRaces.length > 0 
          ? `Ostatni wyścig: ${mockFitnessData.recentRaces[0].distance} - ${mockFitnessData.recentRaces[0].time}`
          : 'Brak ostatnich wyników wyścigowych'
      }
    ]

    // Mock historical data
    const historicalData: HistoricalPrediction[] = [
      {
        date: new Date(2024, 10, 15),
        predicted: '1:35:20',
        actual: '1:37:45',
        accuracy: 0.97
      },
      {
        date: new Date(2024, 8, 10), 
        predicted: '1:38:45',
        actual: '1:36:30',
        accuracy: 0.96
      }
    ]

    const newPrediction: RacePrediction = {
      distance: distance.name,
      predictedTime,
      confidence: Math.round(confidence * 100),
      factors,
      historicalData
    }

    setPrediction(newPrediction)
    setIsCalculating(false)
    onPredictionUpdate?.(newPrediction)
  }

  const convertPaceToSeconds = (pace: string): number => {
    const [minutes, seconds] = pace.split(':').map(Number)
    return minutes * 60 + seconds
  }

  const getDistanceFactor = (distance: number): number => {
    // Simplified model - longer distances require slower pace
    if (distance <= 5) return 0.95
    if (distance <= 10) return 1.0
    if (distance <= 21) return 1.15
    if (distance <= 42) return 1.30
    return 1.50
  }

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (selectedDistance !== 'custom') {
      calculatePrediction()
    }
  }, [selectedDistance])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Predyktor Czasów Wyścigowych</h2>
          <p className="text-sm text-gray-400">
            AI przewiduje Twój czas na podstawie obecnej formy
          </p>
        </div>
        <Button
          onClick={calculatePrediction}
          disabled={isCalculating}
          className="bg-red-600 hover:bg-red-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
          Przelicz
        </Button>
      </div>

      {/* Distance selector */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Wybierz dystans</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {raceDistances.map((distance) => (
            <motion.button
              key={distance.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDistance(distance.id)}
              className={`
                p-4 rounded-lg border transition-all text-center
                ${selectedDistance === distance.id
                  ? 'border-red-600 bg-red-600/20 text-red-400'
                  : 'border-gray-700 hover:border-gray-600 text-gray-300'
                }
              `}
            >
              <div className="font-medium">{distance.name}</div>
              {distance.id !== 'custom' && (
                <div className="text-sm opacity-75">{distance.distance} {distance.unit}</div>
              )}
            </motion.button>
          ))}
        </div>

        {selectedDistance === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <div className="flex space-x-3">
              <input
                type="number"
                placeholder="Dystans w km"
                value={customDistance}
                onChange={(e) => setCustomDistance(e.target.value)}
                className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
              />
              <Button
                onClick={calculatePrediction}
                disabled={!customDistance || isCalculating}
                className="bg-red-600 hover:bg-red-700"
              >
                Oblicz
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Prediction results */}
      <AnimatePresence>
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main prediction */}
            <Card className="p-8 bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Target className="h-6 w-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">
                    Przewidywany czas - {prediction.distance}
                  </h3>
                </div>
                
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="text-6xl font-bold text-red-400 mb-4"
                >
                  {prediction.predictedTime}
                </motion.div>

                <div className="flex items-center justify-center space-x-4">
                  <Badge className={`
                    text-sm px-3 py-1 
                    ${prediction.confidence >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      prediction.confidence >= 60 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    }
                  `}>
                    Pewność: {prediction.confidence}%
                  </Badge>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm"
                  >
                    {showDetails ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
                  </Button>
                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className={`h-full rounded-full ${
                      prediction.confidence >= 80 ? 'bg-green-500' :
                      prediction.confidence >= 60 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                  />
                </div>
              </div>
            </Card>

            {/* Detailed analysis */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Factors breakdown */}
                  <Card className="p-6 bg-gray-900/50 border-gray-800">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                      Analiza czynników
                    </h4>
                    <div className="space-y-4">
                      {prediction.factors.map((factor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-300">{factor.name}</span>
                            <div className={`
                              w-3 h-3 rounded-full
                              ${factor.impact === 'positive' ? 'bg-green-500' :
                                factor.impact === 'negative' ? 'bg-red-500' :
                                'bg-gray-500'
                              }
                            `} />
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${factor.weight * 100}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                              className={`h-full rounded-full ${
                                factor.impact === 'positive' ? 'bg-green-500' :
                                factor.impact === 'negative' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}
                            />
                          </div>
                          <p className="text-xs text-gray-400">{factor.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  {/* Historical predictions */}
                  {prediction.historicalData && prediction.historicalData.length > 0 && (
                    <Card className="p-6 bg-gray-900/50 border-gray-800">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-purple-400" />
                        Historia predykcji
                      </h4>
                      <div className="space-y-4">
                        {prediction.historicalData.map((historical, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 bg-gray-800/30 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-300">
                                {historical.date.toLocaleDateString('pl-PL')}
                              </span>
                              {historical.accuracy && (
                                <Badge className={`text-xs ${
                                  historical.accuracy >= 0.95 ? 'bg-green-500/20 text-green-400' :
                                  historical.accuracy >= 0.90 ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-orange-500/20 text-orange-400'
                                }`}>
                                  {Math.round(historical.accuracy * 100)}% trafność
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Przewidywany:</span>
                                <div className="font-medium text-white">{historical.predicted}</div>
                              </div>
                              {historical.actual && (
                                <div>
                                  <span className="text-gray-400">Rzeczywisty:</span>
                                  <div className="font-medium text-white">{historical.actual}</div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Calculator className="h-8 w-8 text-red-400" />
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-medium text-white">Analizuję Twoje dane...</p>
              <p className="text-sm text-gray-400">Uwzględniam formę, objętość i ostatnie treningi</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}