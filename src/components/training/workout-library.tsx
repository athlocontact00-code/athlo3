"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, List, Heart, Clock, TrendingUp, Star, StarOff, Play, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WorkoutLibraryProps {
  onUseTemplate?: (template: WorkoutTemplate) => void
  onCreateNew?: () => void
}

interface WorkoutTemplate {
  id: string
  name: string
  sport: string
  type: string
  duration: string
  distance?: string
  intensity: 'easy' | 'moderate' | 'hard' | 'very-hard'
  description: string
  load: number
  tags: string[]
  isFavorite: boolean
  author: string
  usageCount: number
  rating: number
  steps: number
  createdAt: Date
}

const mockTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Morning Easy Run',
    sport: 'running',
    type: 'Easy Run',
    duration: '45 min',
    distance: '7-8 km',
    intensity: 'easy',
    description: 'Spokojny bieg w strefie 1-2, idealny na początek dnia',
    load: 35,
    tags: ['rano', 'recovery', 'base'],
    isFavorite: true,
    author: 'Trener Jan',
    usageCount: 245,
    rating: 4.8,
    steps: 3,
    createdAt: new Date(2025, 0, 15)
  },
  {
    id: '2',
    name: 'Threshold Intervals',
    sport: 'running',
    type: 'Intervals',
    duration: '60 min',
    distance: '10 km',
    intensity: 'hard',
    description: '5x 5min w strefie 4 z 90s odpoczynkiem',
    load: 85,
    tags: ['interwały', 'próg', 'key workout'],
    isFavorite: false,
    author: 'Anna Kowalska',
    usageCount: 189,
    rating: 4.6,
    steps: 5,
    createdAt: new Date(2025, 0, 12)
  },
  {
    id: '3',
    name: 'Power Endurance Ride',
    sport: 'cycling',
    type: 'Tempo Ride',
    duration: '90 min',
    distance: '45 km',
    intensity: 'moderate',
    description: 'Jazda w strefie 3-4 z elementami progressive',
    load: 95,
    tags: ['tempo', 'endurance', 'power'],
    isFavorite: true,
    author: 'Michał Nowak',
    usageCount: 156,
    rating: 4.7,
    steps: 4,
    createdAt: new Date(2025, 0, 10)
  },
  {
    id: '4',
    name: 'Swimming Technique',
    sport: 'swimming',
    type: 'Technique',
    duration: '45 min',
    distance: '2000m',
    intensity: 'moderate',
    description: 'Praca nad techniką z elementami drill',
    load: 45,
    tags: ['technika', 'drill', 'form'],
    isFavorite: false,
    author: 'Piotr Swim',
    usageCount: 98,
    rating: 4.5,
    steps: 6,
    createdAt: new Date(2025, 0, 8)
  },
  {
    id: '5',
    name: 'Full Body Strength',
    sport: 'strength',
    type: 'Full Body',
    duration: '50 min',
    intensity: 'hard',
    description: 'Kompleksowy trening siłowy na całe ciało',
    load: 65,
    tags: ['strength', 'full body', 'conditioning'],
    isFavorite: true,
    author: 'Fit Coach',
    usageCount: 234,
    rating: 4.9,
    steps: 8,
    createdAt: new Date(2025, 0, 5)
  },
  {
    id: '6',
    name: 'Long Weekend Run',
    sport: 'running',
    type: 'Long Run',
    duration: '120 min',
    distance: '18-20 km',
    intensity: 'easy',
    description: 'Długi bieg budujący wytrzymałość bazową',
    load: 110,
    tags: ['long run', 'weekend', 'base', 'endurance'],
    isFavorite: false,
    author: 'Marathon Coach',
    usageCount: 312,
    rating: 4.8,
    steps: 3,
    createdAt: new Date(2025, 0, 3)
  },
]

const sportIcons = {
  running: '🏃‍♂️',
  cycling: '🚴‍♂️',
  swimming: '🏊‍♂️',
  strength: '💪',
  tennis: '🎾',
  football: '⚽',
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

export default function WorkoutLibrary({ onUseTemplate, onCreateNew }: WorkoutLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('all')
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'usage' | 'recent'>('rating')

  const [templates, setTemplates] = useState(mockTemplates)

  const toggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ))
  }

  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sport filter
    if (selectedSport !== 'all') {
      filtered = filtered.filter(template => template.sport === selectedSport)
    }

    // Intensity filter
    if (selectedIntensity !== 'all') {
      filtered = filtered.filter(template => template.intensity === selectedIntensity)
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(template => template.isFavorite)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'usage':
          return b.usageCount - a.usageCount
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [templates, searchTerm, selectedSport, selectedIntensity, showFavoritesOnly, sortBy])

  const sports = Array.from(new Set(templates.map(t => t.sport)))
  const intensities = Array.from(new Set(templates.map(t => t.intensity)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Biblioteka Treningów</h2>
          <p className="text-sm text-gray-400">
            {filteredTemplates.length} z {templates.length} szablonów
          </p>
        </div>
        <Button
          onClick={onCreateNew}
          className="bg-red-600 hover:bg-red-700"
        >
          Stwórz nowy
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gray-900/50 border-gray-800">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj treningów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
              />
            </div>
          </div>

          {/* Sport filter */}
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            <option value="all">Wszystkie sporty</option>
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sportIcons[sport as keyof typeof sportIcons]} {sport}
              </option>
            ))}
          </select>

          {/* Intensity filter */}
          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            <option value="all">Wszystkie intensywności</option>
            {intensities.map(intensity => (
              <option key={intensity} value={intensity}>
                {intensityLabels[intensity as keyof typeof intensityLabels]}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'usage' | 'recent')}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            <option value="rating">Najlepiej oceniane</option>
            <option value="usage">Najczęściej używane</option>
            <option value="recent">Najnowsze</option>
          </select>

          {/* View mode */}
          <div className="flex rounded-lg border border-gray-600 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Additional filters */}
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-700">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Tylko ulubione</span>
          </label>
        </div>
      </Card>

      {/* Templates */}
      <AnimatePresence>
        {filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Brak rezultatów</h3>
            <p className="text-sm text-gray-400">
              Spróbuj zmienić filtry lub utwórz nowy szablon
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`
                    group cursor-pointer transition-all duration-200
                    bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:shadow-lg
                    ${viewMode === 'list' ? 'p-4' : 'p-5'}
                  `}
                >
                  {viewMode === 'grid' ? (
                    // Grid view
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">
                            {sportIcons[template.sport as keyof typeof sportIcons]}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-400 capitalize">
                              {template.sport} • {template.type}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleFavorite(template.id)}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          {template.isFavorite ? (
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-white">{template.duration}</span>
                        </div>
                        {template.distance && (
                          <div className="flex items-center space-x-1">
                            <span className="text-white">{template.distance}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-gray-400" />
                          <span className="text-white">{template.load} TSS</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Tags and intensity */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <Badge className={`text-xs ${intensityColors[template.intensity]} bg-transparent`}>
                          {intensityLabels[template.intensity]}
                        </Badge>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <div className="text-xs text-gray-400">
                          <div className="flex items-center space-x-3">
                            <span>⭐ {template.rating}</span>
                            <span>👥 {template.usageCount}</span>
                            <span>📋 {template.steps} etapów</span>
                          </div>
                          <div className="mt-1">by {template.author}</div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUseTemplate?.(template)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Użyj
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List view
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">
                          {sportIcons[template.sport as keyof typeof sportIcons]}
                        </span>
                        <button
                          onClick={() => toggleFavorite(template.id)}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          {template.isFavorite ? (
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-white group-hover:text-red-400 transition-colors">
                            {template.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm">
                            <Badge className={`text-xs ${intensityColors[template.intensity]} bg-transparent`}>
                              {intensityLabels[template.intensity]}
                            </Badge>
                            <span className="text-gray-400">⭐ {template.rating}</span>
                            <span className="text-gray-400">👥 {template.usageCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="capitalize">{template.sport} • {template.type}</span>
                            <span>⏱️ {template.duration}</span>
                            {template.distance && <span>📏 {template.distance}</span>}
                            <span>{template.load} TSS</span>
                            <span>by {template.author}</span>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUseTemplate?.(template)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Użyj szablon
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}