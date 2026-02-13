"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface MilestoneCelebrationProps {
  isVisible: boolean
  achievement: {
    icon: string
    title: string
    description: string
    type: 'badge' | 'streak' | 'pr' | 'goal'
  }
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export default function MilestoneCelebration({ 
  isVisible, 
  achievement, 
  onClose, 
  autoClose = true, 
  duration = 4000 
}: MilestoneCelebrationProps) {
  
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, duration, onClose])

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ['#dc2626', '#ffffff', '#fbbf24', '#10b981', '#3b82f6'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    x: Math.random() * 100,
    rotation: Math.random() * 360
  }))

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer"
        >
          {/* Confetti */}
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                opacity: 1,
                y: -100,
                x: `${piece.x}vw`,
                rotate: 0,
                scale: 0
              }}
              animate={{
                opacity: [1, 1, 0],
                y: window.innerHeight + 100,
                rotate: piece.rotation,
                scale: [0, 1, 1]
              }}
              transition={{
                delay: piece.delay,
                duration: piece.duration,
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: piece.color }}
            />
          ))}

          {/* Main celebration card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              delay: 0.2 
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-2xl p-8 max-w-md mx-4 text-center cursor-default"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Achievement icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.5, 
                type: "spring", 
                stiffness: 200 
              }}
              className="text-6xl mb-4"
            >
              {achievement.icon}
            </motion.div>

            {/* Achievement type badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-4"
            >
              <span className={`
                inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                ${achievement.type === 'badge' ? 'bg-purple-500/20 text-purple-400' :
                  achievement.type === 'streak' ? 'bg-orange-500/20 text-orange-400' :
                  achievement.type === 'pr' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }
              `}>
                {achievement.type === 'badge' ? 'Nowa odznaka' :
                 achievement.type === 'streak' ? 'Seria' :
                 achievement.type === 'pr' ? 'Rekord osobisty' :
                 'Cel osiągnięty'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-2xl font-bold text-white mb-3"
            >
              {achievement.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-gray-300 leading-relaxed mb-6"
            >
              {achievement.description}
            </motion.p>

            {/* Celebration message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
              className="text-lg font-semibold text-red-400"
            >
              🎉 Gratulacje! 🎉
            </motion.div>

            {/* Auto-close indicator */}
            {autoClose && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-red-500 rounded-b-2xl"
              />
            )}
          </motion.div>

          {/* Sparkle effects */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200
              }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 2,
                ease: "easeOut"
              }}
              className="absolute text-2xl pointer-events-none"
              style={{
                left: '50%',
                top: '50%'
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}