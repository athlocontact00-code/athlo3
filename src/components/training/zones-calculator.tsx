"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Zap, Clock, Calculator, Save, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ZonesCalculatorProps {
  onSave?: (zones: ZoneConfiguration) => void
  onClose?: () => void
  initialData?: Partial<ZoneConfiguration>
}

interface ZoneConfiguration {
  method: 'hr' | 'pace' | 'power'
  sport: string
  testValues: {
    maxHR?: number
    restingHR?: number
    thresholdHR?: number
    ftp?: number
    thresholdPace?: string
    vo2maxPace?: string
  }
  zones: Zone[]
}

interface Zone {
  id: string
  name: string
  description: string
  color: string
  minValue: number
  maxValue: number
  unit: string
}

const methods = [
  {
    id: 'hr',
    name: 'Na podstawie tętna',
    icon: Heart,
    color: 'text-red-400',
    description: 'Strefy na podstawie maksymalnego tętna i tętna spoczynkowego'
  },
  {
    id: 'pace',
    name: 'Na podstawie tempa',
    icon: Clock,
    color: 'text-blue-400',
    description: 'Strefy na podstawie tempa progowego i VO2max'
  },
  {
    id: 'power',
    name: 'Na podstawie mocy',
    icon: Zap,
    color: 'text-yellow-400',
    description: 'Strefy na podstawie progu mocy (FTP)'
  },
]

const sports = [
  { id: 'running', name: 'Bieg', zones: 'pace' },
  { id: 'cycling', name: 'Kolarstwo', zones: 'power' },
  { id: 'swimming', name: 'Pływanie', zones: 'pace' },
  { id: 'triathlon', name: 'Triathlon', zones: 'hr' },
]

export default function ZonesCalculator({ onSave, onClose, initialData }: ZonesCalculatorProps) {
  const [config, setConfig] = useState<Partial<ZoneConfiguration>>({
    method: 'hr',
    sport: 'running',
    testValues: {},
    zones: [],
    ...initialData,
  })

  const updateConfig = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const updateTestValue = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      testValues: { ...prev.testValues, [field]: value }
    }))
  }

  const calculateHRZones = () => {
    const { maxHR, restingHR } = config.testValues || {}
    if (!maxHR || !restingHR) return []

    const hrReserve = maxHR - restingHR

    const zones: Zone[] = [
      {
        id: 'zone1',
        name: 'Strefa 1',
        description: 'Regeneracja',
        color: 'bg-gray-500',
        minValue: Math.round(restingHR + (hrReserve * 0.50)),
        maxValue: Math.round(restingHR + (hrReserve * 0.60)),
        unit: 'bpm'
      },
      {
        id: 'zone2',
        name: 'Strefa 2',
        description: 'Wytrzymałość bazowa',
        color: 'bg-blue-500',
        minValue: Math.round(restingHR + (hrReserve * 0.60)),
        maxValue: Math.round(restingHR + (hrReserve * 0.70)),
        unit: 'bpm'
      },
      {
        id: 'zone3',
        name: 'Strefa 3',
        description: 'Tempo aerobowe',
        color: 'bg-green-500',
        minValue: Math.round(restingHR + (hrReserve * 0.70)),
        maxValue: Math.round(restingHR + (hrReserve * 0.80)),
        unit: 'bpm'
      },
      {
        id: 'zone4',
        name: 'Strefa 4',
        description: 'Tempo progowe',
        color: 'bg-yellow-500',
        minValue: Math.round(restingHR + (hrReserve * 0.80)),
        maxValue: Math.round(restingHR + (hrReserve * 0.90)),
        unit: 'bpm'
      },
      {
        id: 'zone5',
        name: 'Strefa 5',
        description: 'VO2max',
        color: 'bg-orange-500',
        minValue: Math.round(restingHR + (hrReserve * 0.90)),
        maxValue: Math.round(restingHR + (hrReserve * 0.95)),
        unit: 'bpm'
      },
      {
        id: 'zone6',
        name: 'Strefa 6',
        description: 'Anaerobowa',
        color: 'bg-red-500',
        minValue: Math.round(restingHR + (hrReserve * 0.95)),
        maxValue: maxHR,
        unit: 'bpm'
      },
    ]

    return zones
  }

  const calculatePaceZones = () => {
    const { thresholdPace, vo2maxPace } = config.testValues || {}
    if (!thresholdPace) return []

    // Convert pace string to seconds per km
    const parseTime = (timeStr: string) => {
      const [minutes, seconds] = timeStr.split(':').map(Number)
      return minutes * 60 + (seconds || 0)
    }

    const thresholdSeconds = parseTime(thresholdPace)
    const vo2maxSeconds = vo2maxPace ? parseTime(vo2maxPace) : thresholdSeconds * 0.95

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.round(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const zones: Zone[] = [
      {
        id: 'zone1',
        name: 'Regeneracja',
        description: 'Easy/Recovery',
        color: 'bg-gray-500',
        minValue: thresholdSeconds * 1.29,
        maxValue: thresholdSeconds * 1.15,
        unit: 'min/km'
      },
      {
        id: 'zone2',
        name: 'Wytrzymałość',
        description: 'Long Run',
        color: 'bg-blue-500',
        minValue: thresholdSeconds * 1.15,
        maxValue: thresholdSeconds * 1.06,
        unit: 'min/km'
      },
      {
        id: 'zone3',
        name: 'Tempo',
        description: 'Marathon pace',
        color: 'bg-green-500',
        minValue: thresholdSeconds * 1.06,
        maxValue: thresholdSeconds * 1.00,
        unit: 'min/km'
      },
      {
        id: 'zone4',
        name: 'Próg',
        description: 'Threshold/Half marathon',
        color: 'bg-yellow-500',
        minValue: thresholdSeconds * 1.00,
        maxValue: thresholdSeconds * 0.97,
        unit: 'min/km'
      },
      {
        id: 'zone5',
        name: 'VO2max',
        description: '5K pace',
        color: 'bg-orange-500',
        minValue: thresholdSeconds * 0.97,
        maxValue: vo2maxSeconds,
        unit: 'min/km'
      },
      {
        id: 'zone6',
        name: 'Anaerobowa',
        description: '1500m pace',
        color: 'bg-red-500',
        minValue: vo2maxSeconds,
        maxValue: vo2maxSeconds * 0.92,
        unit: 'min/km'
      },
    ]

    return zones.map(zone => ({
      ...zone,
      minValue: parseFloat(formatTime(zone.minValue).replace(':', '.')),
      maxValue: parseFloat(formatTime(zone.maxValue).replace(':', '.')),
    }))
  }

  const calculatePowerZones = () => {
    const { ftp } = config.testValues || {}
    if (!ftp) return []

    const zones: Zone[] = [
      {
        id: 'zone1',
        name: 'Regeneracja',
        description: 'Recovery',
        color: 'bg-gray-500',
        minValue: 0,
        maxValue: Math.round(ftp * 0.55),
        unit: 'W'
      },
      {
        id: 'zone2',
        name: 'Wytrzymałość',
        description: 'Endurance',
        color: 'bg-blue-500',
        minValue: Math.round(ftp * 0.56),
        maxValue: Math.round(ftp * 0.75),
        unit: 'W'
      },
      {
        id: 'zone3',
        name: 'Tempo',
        description: 'Tempo',
        color: 'bg-green-500',
        minValue: Math.round(ftp * 0.76),
        maxValue: Math.round(ftp * 0.90),
        unit: 'W'
      },
      {
        id: 'zone4',
        name: 'Próg',
        description: 'Lactate Threshold',
        color: 'bg-yellow-500',
        minValue: Math.round(ftp * 0.91),
        maxValue: Math.round(ftp * 1.05),
        unit: 'W'
      },
      {
        id: 'zone5',
        name: 'VO2max',
        description: 'VO2max',
        color: 'bg-orange-500',
        minValue: Math.round(ftp * 1.06),
        maxValue: Math.round(ftp * 1.20),
        unit: 'W'
      },
      {
        id: 'zone6',
        name: 'Anaerobowa',
        description: 'Anaerobic Capacity',
        color: 'bg-red-500',
        minValue: Math.round(ftp * 1.21),
        maxValue: Math.round(ftp * 1.50),
        unit: 'W'
      },
    ]

    return zones
  }

  const calculateZones = () => {
    switch (config.method) {
      case 'hr':
        return calculateHRZones()
      case 'pace':
        return calculatePaceZones()
      case 'power':
        return calculatePowerZones()
      default:
        return []
    }
  }

  const zones = calculateZones()

  const handleCalculate = () => {
    const calculatedZones = calculateZones()
    updateConfig('zones', calculatedZones)
  }

  const handleSave = () => {
    if (zones.length > 0) {
      onSave?.(config as ZoneConfiguration)
    }
  }

  const formatZoneValue = (value: number, unit: string) => {
    if (unit === 'min/km') {
      const minutes = Math.floor(value)
      const seconds = Math.round((value - minutes) * 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return `${Math.round(value)}${unit}`
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
              <h2 className="text-xl font-bold text-white">Kalkulator Stref Treningowych</h2>
              <p className="text-sm text-gray-400">Oblicz spersonalizowane strefy na podstawie testów</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Configuration */}
            <div className="space-y-6">
              {/* Sport selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Wybierz sport</h3>
                <div className="grid grid-cols-2 gap-2">
                  {sports.map(sport => (
                    <button
                      key={sport.id}
                      onClick={() => updateConfig('sport', sport.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        config.sport === sport.id
                          ? 'border-red-600 bg-red-600/20 text-red-400'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400'
                      }`}
                    >
                      <div className="font-medium">{sport.name}</div>
                      <div className="text-xs">Rekomendacja: {sport.zones}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Method selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Metoda obliczania</h3>
                <div className="space-y-2">
                  {methods.map(method => {
                    const IconComponent = method.icon
                    return (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => updateConfig('method', method.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          config.method === method.id
                            ? 'border-red-600 bg-red-600/20'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className={`h-5 w-5 mt-0.5 ${method.color}`} />
                          <div className="flex-1">
                            <div className="font-medium text-white">{method.name}</div>
                            <div className="text-sm text-gray-400 mt-1">
                              {method.description}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Test values input */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Wartości testowe</h3>
                
                {config.method === 'hr' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400">Maksymalne tętno (bpm)</label>
                        <input
                          type="number"
                          placeholder="190"
                          value={config.testValues?.maxHR || ''}
                          onChange={(e) => updateTestValue('maxHR', parseInt(e.target.value) || null)}
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Tętno spoczynkowe (bpm)</label>
                        <input
                          type="number"
                          placeholder="60"
                          value={config.testValues?.restingHR || ''}
                          onChange={(e) => updateTestValue('restingHR', parseInt(e.target.value) || null)}
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                        <div className="text-sm text-gray-300">
                          <strong>Jak zmierzyć:</strong> Maksymalne tętno = test stopniowo rosnącego obciążenia. 
                          Tętno spoczynkowe = pomiar rano po przebudzeniu.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {config.method === 'pace' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400">Tempo progowe (min/km)</label>
                        <input
                          type="text"
                          placeholder="4:30"
                          value={config.testValues?.thresholdPace || ''}
                          onChange={(e) => updateTestValue('thresholdPace', e.target.value)}
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Tempo VO2max (min/km)</label>
                        <input
                          type="text"
                          placeholder="4:10"
                          value={config.testValues?.vo2maxPace || ''}
                          onChange={(e) => updateTestValue('vo2maxPace', e.target.value)}
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                        <div className="text-sm text-gray-300">
                          <strong>Jak zmierzyć:</strong> Tempo progowe = tempo półmaratonu. 
                          Tempo VO2max = tempo 5K (opcjonalne).
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {config.method === 'power' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400">FTP - Próg mocy (W)</label>
                      <input
                        type="number"
                        placeholder="250"
                        value={config.testValues?.ftp || ''}
                        onChange={(e) => updateTestValue('ftp', parseInt(e.target.value) || null)}
                        className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
                      />
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                        <div className="text-sm text-gray-300">
                          <strong>Jak zmierzyć:</strong> Test 20-minutowy z maksymalnym wysiłkiem. 
                          FTP = średnia moc z testu × 0.95.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCalculate}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={
                    (config.method === 'hr' && (!config.testValues?.maxHR || !config.testValues?.restingHR)) ||
                    (config.method === 'pace' && !config.testValues?.thresholdPace) ||
                    (config.method === 'power' && !config.testValues?.ftp)
                  }
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Oblicz strefy
                </Button>
              </div>
            </div>

            {/* Right column - Results */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">Twoje strefy treningowe</h3>
                {zones.length > 0 && (
                  <Badge className="bg-red-500/20 text-red-400">
                    {config.method === 'hr' ? 'Tętno' : 
                     config.method === 'pace' ? 'Tempo' : 'Moc'}
                  </Badge>
                )}
              </div>

              <AnimatePresence>
                {zones.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {zones.map((zone, index) => (
                      <motion.div
                        key={zone.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/30"
                      >
                        {/* Color bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${zone.color}`} />
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{zone.name}</div>
                            <div className="text-sm font-mono text-gray-300">
                              {formatZoneValue(zone.minValue, zone.unit)} - {formatZoneValue(zone.maxValue, zone.unit)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">{zone.description}</div>
                          
                          {/* Visual bar */}
                          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${zone.color}`} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <div className="pt-4">
                      <Button
                        onClick={handleSave}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Zapisz do profilu
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-lg">
                    <div className="text-center text-gray-400">
                      <Calculator className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-sm">Wprowadź wartości testowe i kliknij "Oblicz strefy"</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}