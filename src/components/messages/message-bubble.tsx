"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CheckCheck, Smile, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    sender: {
      id: string
      name: string
      avatar?: string
    }
    timestamp: Date
    isRead: boolean
    reactions: { emoji: string; users: string[] }[]
    workoutContext?: {
      workoutId: string
      workoutName: string
      date: Date
    }
    type: 'text' | 'workout-link' | 'system'
  }
  isOwnMessage: boolean
  showAvatar: boolean
  onReaction: (emoji: string) => void
}

const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '💪', '🎉']

export default function MessageBubble({ 
  message, 
  isOwnMessage, 
  showAvatar, 
  onReaction 
}: MessageBubbleProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [showTimestamp, setShowTimestamp] = useState(false)

  const handleReactionClick = (emoji: string) => {
    onReaction(emoji)
    setShowReactionPicker(false)
  }

  const renderWorkoutContext = () => {
    if (!message.workoutContext) return null

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <span className="text-red-400">🏃‍♂️</span>
          <div>
            <div className="text-sm font-medium text-red-400">
              {message.workoutContext.workoutName}
            </div>
            <div className="text-xs text-gray-400">
              {format(message.workoutContext.date, 'd MMMM yyyy', { locale: pl })}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const renderReactions = () => {
    if (message.reactions.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {message.reactions.map((reaction, index) => (
          <motion.button
            key={`${reaction.emoji}-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReactionClick(reaction.emoji)}
            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-xs hover:bg-gray-700/50 transition-colors"
          >
            <span>{reaction.emoji}</span>
            <span className="text-gray-400">{reaction.users.length}</span>
          </motion.button>
        ))}
      </div>
    )
  }

  if (message.type === 'system') {
    return (
      <div className="flex justify-center">
        <Badge variant="secondary" className="bg-gray-800/30 text-gray-400 text-xs">
          {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-3 group ${
        isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <img 
            src={message.sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender.name}`} 
            alt={message.sender.name}
            className="rounded-full object-cover"
          />
        </Avatar>
      )}
      {showAvatar && isOwnMessage && <div className="w-8" />}
      
      <div className={`flex-1 max-w-xs lg:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender name (for group chats) */}
        {showAvatar && !isOwnMessage && (
          <span className="text-xs text-gray-400 mb-1 px-3">
            {message.sender.name}
          </span>
        )}

        {/* Message bubble */}
        <div className="relative">
          {/* Workout context */}
          {renderWorkoutContext()}
          
          {/* Main message */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowTimestamp(!showTimestamp)}
            className={`
              relative px-4 py-2 rounded-2xl cursor-pointer transition-all
              ${isOwnMessage
                ? 'bg-red-600 text-white rounded-br-md'
                : 'bg-gray-800 text-white rounded-bl-md'
              }
            `}
          >
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
            
            {/* Message status (for own messages) */}
            {isOwnMessage && (
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-xs text-red-100 opacity-70">
                  {format(message.timestamp, 'HH:mm')}
                </span>
                {message.isRead ? (
                  <CheckCheck className="h-3 w-3 text-red-100" />
                ) : (
                  <Check className="h-3 w-3 text-red-200" />
                )}
              </div>
            )}
          </motion.div>

          {/* Reactions */}
          {renderReactions()}

          {/* Reaction picker */}
          <AnimatePresence>
            {showReactionPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className={`
                  absolute z-10 mt-2 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg
                  ${isOwnMessage ? 'right-0' : 'left-0'}
                `}
              >
                <div className="flex space-x-1">
                  {quickReactions.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReactionClick(emoji)}
                      className="p-2 hover:bg-gray-700 rounded-md text-lg transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reaction button (visible on hover) */}
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className={`
              absolute top-1/2 transform -translate-y-1/2 p-1 bg-gray-700 border border-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
              ${isOwnMessage ? '-left-8' : '-right-8'}
            `}
            onClick={() => setShowReactionPicker(!showReactionPicker)}
          >
            <Smile className="h-3 w-3 text-gray-300" />
          </motion.button>
        </div>

        {/* Timestamp (shown on click) */}
        <AnimatePresence>
          {showTimestamp && !isOwnMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 px-3"
            >
              <span className="text-xs text-gray-500">
                {format(message.timestamp, 'HH:mm, d MMMM yyyy', { locale: pl })}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer for alignment */}
      {!showAvatar && <div className="w-8" />}

      {/* Click outside to close reaction picker */}
      {showReactionPicker && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowReactionPicker(false)} 
        />
      )}
    </motion.div>
  )
}