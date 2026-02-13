"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

interface PromptChipsProps {
  onPromptSelect: (prompt: string) => void
}

interface PromptCategory {
  id: string
  name: string
  prompts: string[]
  icon: string
}

const promptCategories: PromptCategory[] = [
  {
    id: 'morning',
    name: 'Rano',
    icon: '🌅',
    prompts: [
      'Jak wygląda moja gotowość dziś?',
      'Co mam zaplanowane na dzisiaj?',
      'Czy powinienem trenować dziś rano?',
      'Jak przygotować się do dzisiejszego treningu?',
      'Sprawdź mój sen z ostatniej nocy'
    ]
  },
  {
    id: 'post-workout',
    name: 'Po treningu',
    icon: '💪',
    prompts: [
      'Przeanalizuj mój ostatni trening',
      'Jak się regeneruję?',
      'Czy osiągnąłem dzisiejsze cele?',
      'Co powinienem jeść po treningu?',
      'Kiedy mogę trenować następny raz?'
    ]
  },
  {
    id: 'evening',
    name: 'Wieczorem',
    icon: '🌙',
    prompts: [
      'Podsumuj mój dzisiejszy dzień',
      'Zaplanuj jutrzejszy trening',
      'Jak przygotować się do snu?',
      'Oceń mój postęp w tym tygodniu',
      'Co powinienem poprawić jutro?'
    ]
  },
  {
    id: 'analysis',
    name: 'Analiza',
    icon: '📊',
    prompts: [
      'Wyjaśnij mój trend tygodniowy',
      'Porównaj ten miesiąc z poprzednim',
      'Gdzie robię największe postępy?',
      'Co hamuje mój rozwój?',
      'Pokazuje trendy w moich danych'
    ]
  },
  {
    id: 'planning',
    name: 'Planowanie',
    icon: '🎯',
    prompts: [
      'Wygeneruj trening na jutro',
      'Zaplanuj mikrocykl treningowy',
      'Jak przygotować się do wyścigu?',
      'Dostosuj plan do mojego harmonogramu',
      'Stwórz plan na urlop'
    ]
  },
  {
    id: 'health',
    name: 'Zdrowie',
    icon: '🏥',
    prompts: [
      'Mam ból - co robić?',
      'Jak uniknąć kontuzji?',
      'Oceń moje ryzyko przeciążenia',
      'Potrzebuję porady żywieniowej',
      'Jak poprawić regenerację?'
    ]
  }
]

export default function PromptChips({ onPromptSelect }: PromptChipsProps) {
  const [currentCategory, setCurrentCategory] = useState<string>('morning')
  const [displayedPrompts, setDisplayedPrompts] = useState<string[]>([])

  // Determine contextual category based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    let contextualCategory = 'morning'

    if (hour >= 5 && hour < 12) {
      contextualCategory = 'morning'
    } else if (hour >= 12 && hour < 18) {
      contextualCategory = 'analysis'
    } else if (hour >= 18 && hour < 22) {
      contextualCategory = 'post-workout'
    } else {
      contextualCategory = 'evening'
    }

    setCurrentCategory(contextualCategory)
  }, [])

  // Update displayed prompts when category changes
  useEffect(() => {
    const category = promptCategories.find(c => c.id === currentCategory)
    if (category) {
      // Shuffle prompts and take first 4
      const shuffled = [...category.prompts].sort(() => Math.random() - 0.5)
      setDisplayedPrompts(shuffled.slice(0, 4))
    }
  }, [currentCategory])

  const refreshPrompts = () => {
    const category = promptCategories.find(c => c.id === currentCategory)
    if (category) {
      const shuffled = [...category.prompts].sort(() => Math.random() - 0.5)
      setDisplayedPrompts(shuffled.slice(0, 4))
    }
  }

  const currentCategoryData = promptCategories.find(c => c.id === currentCategory)

  return (
    <div className="p-4 border-b border-gray-800 bg-gray-900/30">
      {/* Category selector */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Sugestie:</span>
          <select
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
          >
            {promptCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={refreshPrompts}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Odśwież sugestie"
        >
          <RefreshCw className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Prompt chips */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="wait">
          {displayedPrompts.map((prompt, index) => (
            <motion.button
              key={`${currentCategory}-${prompt}-${index}`}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ 
                delay: index * 0.05,
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(147, 51, 234, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPromptSelect(prompt)}
              className="
                px-3 py-2 bg-gray-800/50 hover:bg-purple-500/20 
                border border-gray-600 hover:border-purple-500/30
                rounded-full text-sm text-gray-300 hover:text-white
                transition-all duration-200 cursor-pointer
                flex items-center space-x-2
              "
            >
              <span>{currentCategoryData?.icon}</span>
              <span>{prompt}</span>
            </motion.button>
          ))}
        </AnimatePresence>
        
        {/* Show more button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshPrompts}
          className="
            px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50
            border border-gray-600 hover:border-gray-500
            rounded-full text-sm text-gray-400 hover:text-white
            transition-all duration-200 cursor-pointer
            flex items-center space-x-1
          "
        >
          <RefreshCw className="h-3 w-3" />
          <span>Więcej</span>
        </motion.button>
      </div>

      {/* Context indicator */}
      <div className="mt-3 flex items-center justify-center">
        <div className="text-xs text-gray-500 text-center">
          Sugestie dostosowane do {currentCategoryData?.name.toLowerCase()} 
          <span className="ml-1">{currentCategoryData?.icon}</span>
        </div>
      </div>
    </div>
  )
}