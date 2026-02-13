"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Mic, Link, Calendar, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MessageInputProps {
  onSendMessage: (content: string, workoutContext?: any) => void
  disabled?: boolean
  placeholder?: string
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Napisz wiadomość..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showWorkoutPicker, setShowWorkoutPicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // Mock voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        onSendMessage('[Wiadomość głosowa]')
      }, 3000)
    }
  }

  const handleWorkoutLink = (workoutId: string, workoutName: string) => {
    onSendMessage(
      `Sprawdź mój trening: ${workoutName}`, 
      { workoutId, workoutName, date: new Date() }
    )
    setShowWorkoutPicker(false)
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  // Mock workout data for linking
  const recentWorkouts = [
    { id: '1', name: 'Morning Run', date: new Date(2025, 1, 13), type: 'running' },
    { id: '2', name: 'Interval Training', date: new Date(2025, 1, 12), type: 'running' },
    { id: '3', name: 'Recovery Ride', date: new Date(2025, 1, 11), type: 'cycling' },
  ]

  const quickEmojis = ['😊', '😂', '❤️', '👍', '🔥', '💪', '🎉', '😮', '😢', '🤔']

  return (
    <div className="relative">
      {/* Workout picker */}
      <AnimatePresence>
        {showWorkoutPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
          >
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Linkuj trening</h4>
              <div className="space-y-2">
                {recentWorkouts.map((workout) => (
                  <motion.button
                    key={workout.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWorkoutLink(workout.id, workout.name)}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="text-lg">
                      {workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {workout.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {workout.date.toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
          >
            <div className="p-3">
              <div className="grid grid-cols-5 gap-2">
                {quickEmojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-2 hover:bg-gray-700 rounded-md text-xl transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input area */}
      <div className="flex items-end space-x-2">
        {/* Attachment/actions */}
        <div className="flex space-x-1 mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowWorkoutPicker(!showWorkoutPicker)}
            className={`
              p-2 rounded-lg transition-colors
              ${showWorkoutPicker 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }
            `}
            title="Linkuj trening"
          >
            <Calendar className="h-4 w-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Załączniki"
          >
            <Paperclip className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="
              w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-2xl 
              text-white placeholder-gray-400 resize-none
              focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              max-h-32 min-h-[48px]
            "
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#4a5568 transparent'
            }}
          />
          
          {/* Emoji button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`
              absolute right-3 bottom-3 p-1 rounded-md transition-colors
              ${showEmojiPicker 
                ? 'text-red-400' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <Smile className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Voice/Send button */}
        <div className="mb-2">
          {message.trim() ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Button
                onClick={handleSend}
                disabled={disabled}
                className="bg-red-600 hover:bg-red-700 p-3 rounded-full"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceRecord}
              disabled={disabled}
              className={`
                p-3 rounded-full transition-all
                ${isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Recording indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 bg-white rounded-full"
            />
            <span className="text-sm font-medium">Nagrywanie...</span>
            <span className="text-xs opacity-80">Puknij aby zatrzymać</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handlers */}
      {(showWorkoutPicker || showEmojiPicker) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowWorkoutPicker(false)
            setShowEmojiPicker(false)
          }} 
        />
      )}
    </div>
  )
}