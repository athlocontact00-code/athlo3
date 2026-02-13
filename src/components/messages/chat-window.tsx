"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Phone, Video, MoreVertical, ArrowDown } from 'lucide-react'
import { format, isSameDay, isToday, isYesterday } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import MessageBubble from './message-bubble'
import MessageInput from './message-input'

interface ChatWindowProps {
  chatId: string
  onClose?: () => void
}

interface Message {
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

interface Chat {
  id: string
  type: 'dm' | 'group'
  name: string
  avatar?: string
  participants: {
    id: string
    name: string
    avatar?: string
    isOnline: boolean
  }[]
  isTyping: string[] // user IDs who are typing
}

// Mock data
const mockChat: Chat = {
  id: '1',
  type: 'dm',
  name: 'Trener Anna',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
  participants: [
    {
      id: 'trainer-anna',
      name: 'Trener Anna',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
      isOnline: true
    },
    {
      id: 'current-user',
      name: 'Ty',
      isOnline: true
    }
  ],
  isTyping: ['trainer-anna']
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Cześć! Jak się czujesz po wczorajszym treningu?',
    sender: {
      id: 'trainer-anna',
      name: 'Trener Anna',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
    },
    timestamp: new Date(2025, 1, 12, 9, 15),
    isRead: true,
    reactions: [],
    type: 'text'
  },
  {
    id: '2',
    content: 'Czuję się świetnie! Trochę zmęczony, ale to była dobra sesja',
    sender: {
      id: 'current-user',
      name: 'Ty'
    },
    timestamp: new Date(2025, 1, 12, 9, 18),
    isRead: true,
    reactions: [
      { emoji: '💪', users: ['trainer-anna'] }
    ],
    type: 'text'
  },
  {
    id: '3',
    content: 'Świetnie! Widzę że udało Ci się utrzymać tempo w strefie 4',
    sender: {
      id: 'trainer-anna',
      name: 'Trener Anna',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
    },
    timestamp: new Date(2025, 1, 12, 9, 20),
    isRead: true,
    reactions: [],
    workoutContext: {
      workoutId: 'workout-123',
      workoutName: 'Threshold Intervals',
      date: new Date(2025, 1, 11)
    },
    type: 'workout-link'
  },
  {
    id: '4',
    content: 'Tak, czułem się naprawdę dobrze podczas interwałów. Mam nadzieję, że postęp jest widoczny',
    sender: {
      id: 'current-user',
      name: 'Ty'
    },
    timestamp: new Date(2025, 1, 12, 9, 25),
    isRead: true,
    reactions: [],
    type: 'text'
  },
  {
    id: '5',
    content: 'Definitywnie! Twoje średnie tętno spadło o 5 bpm przy tym samym tempie. To świetny postęp! 🎉',
    sender: {
      id: 'trainer-anna',
      name: 'Trener Anna',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
    },
    timestamp: new Date(2025, 1, 12, 9, 28),
    isRead: true,
    reactions: [
      { emoji: '🎉', users: ['current-user'] },
      { emoji: '💪', users: ['current-user'] }
    ],
    type: 'text'
  },
  {
    id: '6',
    content: 'Jutro mamy zaplanowany długi bieg. Pamiętaj o odpowiedniej nawodnieniu!',
    sender: {
      id: 'trainer-anna',
      name: 'Trener Anna',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
    },
    timestamp: new Date(2025, 1, 13, 18, 15),
    isRead: true,
    reactions: [],
    type: 'text'
  },
  {
    id: '7',
    content: 'Świetny wynik na dzisiejszym treningu! 💪',
    sender: {
      id: 'trainer-anna',
      name: 'Trener Anna',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
    },
    timestamp: new Date(2025, 1, 13, 18, 30),
    isRead: false,
    reactions: [],
    workoutContext: {
      workoutId: 'workout-124',
      workoutName: 'Long Run',
      date: new Date(2025, 1, 13)
    },
    type: 'workout-link'
  },
]

export default function ChatWindow({ chatId, onClose }: ChatWindowProps) {
  const [messages] = useState(mockMessages)
  const [chat] = useState(mockChat)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      setShowScrollButton(distanceFromBottom > 100)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string, workoutContext?: any) => {
    console.log('Sending message:', content, workoutContext)
    // In a real app, this would send the message via API
  }

  const handleReaction = (messageId: string, emoji: string) => {
    console.log('Adding reaction:', messageId, emoji)
    // In a real app, this would add/remove reaction via API
  }

  const groupMessagesByDate = () => {
    const groups: { date: Date; messages: Message[] }[] = []
    
    messages.forEach(message => {
      const existingGroup = groups.find(group => 
        isSameDay(group.date, message.timestamp)
      )
      
      if (existingGroup) {
        existingGroup.messages.push(message)
      } else {
        groups.push({
          date: message.timestamp,
          messages: [message]
        })
      }
    })
    
    return groups
  }

  const formatDateHeader = (date: Date) => {
    if (isToday(date)) return 'Dzisiaj'
    if (isYesterday(date)) return 'Wczoraj'
    return format(date, 'EEEE, d MMMM', { locale: pl })
  }

  const messageGroups = groupMessagesByDate()
  const currentUser = chat.participants.find(p => p.id === 'current-user')
  const otherParticipants = chat.participants.filter(p => p.id !== 'current-user')

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <Card className="p-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <img 
                  src={chat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} 
                  alt={chat.name}
                  className="rounded-full object-cover"
                />
              </Avatar>
              
              {chat.type === 'dm' && otherParticipants[0]?.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
              )}
            </div>
            
            <div>
              <h2 className="font-semibold text-white">{chat.name}</h2>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                {chat.type === 'dm' ? (
                  <span>
                    {otherParticipants[0]?.isOnline ? 'Online' : 'Ostatnio aktywny wczoraj'}
                  </span>
                ) : (
                  <span>{chat.participants.length} uczestników</span>
                )}
                
                {chat.isTyping.length > 0 && (
                  <span className="text-green-400 animate-pulse">
                    {chat.isTyping.length === 1 
                      ? 'pisze...' 
                      : `${chat.isTyping.length} osób pisze...`
                    }
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {chat.type === 'dm' && (
              <>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <Video className="h-4 w-4" />
                </button>
              </>
            )}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messageGroups.map((group, groupIndex) => (
          <div key={group.date.toISOString()}>
            {/* Date header */}
            <div className="flex justify-center mb-4">
              <Badge 
                variant="secondary" 
                className="bg-gray-800/50 text-gray-400 border-gray-700"
              >
                {formatDateHeader(group.date)}
              </Badge>
            </div>
            
            {/* Messages for this date */}
            <div className="space-y-2">
              {group.messages.map((message, messageIndex) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: messageIndex * 0.05 }}
                >
                  <MessageBubble
                    message={message}
                    isOwnMessage={message.sender.id === 'current-user'}
                    showAvatar={
                      chat.type === 'group' && 
                      message.sender.id !== 'current-user'
                    }
                    onReaction={(emoji) => handleReaction(message.id, emoji)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        <AnimatePresence>
          {chat.isTyping.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-3"
            >
              <Avatar className="h-8 w-8">
                <img 
                  src={chat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} 
                  alt={chat.name}
                  className="rounded-full object-cover"
                />
              </Avatar>
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 right-6 p-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-colors z-10"
          >
            <ArrowDown className="h-4 w-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message input */}
      <div className="border-t border-gray-800 p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}