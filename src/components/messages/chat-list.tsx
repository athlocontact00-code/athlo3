"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Pin, Star, MessageCircle, Users, ChevronDown, Circle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface ChatListProps {
  onChatSelect?: (chatId: string) => void
  selectedChatId?: string
}

interface Chat {
  id: string
  type: 'dm' | 'group'
  name: string
  avatar?: string
  lastMessage: {
    content: string
    sender: string
    timestamp: Date
    isRead: boolean
  }
  unreadCount: number
  isOnline: boolean
  isPinned: boolean
  isFavorite: boolean
  participants?: string[]
  workoutContext?: {
    workoutName: string
    date: Date
  }
}

const mockChats: Chat[] = [
  {
    id: '1',
    type: 'dm',
    name: 'Trener Anna',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    lastMessage: {
      content: 'Świetny wynik na dzisiejszym treningu! 💪',
      sender: 'Trener Anna',
      timestamp: new Date(2025, 1, 13, 18, 30),
      isRead: false
    },
    unreadCount: 2,
    isOnline: true,
    isPinned: true,
    isFavorite: true,
    workoutContext: {
      workoutName: 'Threshold Intervals',
      date: new Date(2025, 1, 13)
    }
  },
  {
    id: '2',
    type: 'group',
    name: 'Grupa Biegowa Warszawa',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150',
    lastMessage: {
      content: 'Kto idzie jutro na długi bieg?',
      sender: 'Michał',
      timestamp: new Date(2025, 1, 13, 16, 15),
      isRead: true
    },
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isFavorite: false,
    participants: ['Michał', 'Kasia', 'Paweł', '+12 innych']
  },
  {
    id: '3',
    type: 'dm',
    name: 'Dr. Kowalski',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
    lastMessage: {
      content: 'Wyniki badań wyglądają dobrze. Możemy zwiększyć obciążenie.',
      sender: 'Dr. Kowalski',
      timestamp: new Date(2025, 1, 13, 14, 45),
      isRead: true
    },
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isFavorite: true
  },
  {
    id: '4',
    type: 'group',
    name: 'Team Triathlon',
    avatar: 'https://images.unsplash.com/photo-1566442020473-a3523e2e3d97?w=150',
    lastMessage: {
      content: 'Nowy plan treningowy na ten tydzień już dostępny!',
      sender: 'Coach Mike',
      timestamp: new Date(2025, 1, 13, 9, 20),
      isRead: false
    },
    unreadCount: 5,
    isOnline: false,
    isPinned: true,
    isFavorite: false,
    participants: ['Coach Mike', 'Ania', 'Tomek', '+8 innych']
  },
  {
    id: '5',
    type: 'dm',
    name: 'Kasia Running',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastMessage: {
      content: 'Jak Ci poszedł dzisiejszy trening?',
      sender: 'Kasia Running',
      timestamp: new Date(2025, 1, 12, 20, 15),
      isRead: true
    },
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    isFavorite: false
  },
  {
    id: '6',
    type: 'dm',
    name: 'Fizjoterapeuta Jan',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150',
    lastMessage: {
      content: 'Pamiętaj o rozciąganiu po każdym treningu',
      sender: 'Fizjoterapeuta Jan',
      timestamp: new Date(2025, 1, 12, 15, 30),
      isRead: true
    },
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isFavorite: true
  },
  {
    id: '7',
    type: 'group',
    name: 'Maraton PZU 2025',
    avatar: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150',
    lastMessage: {
      content: 'Link do rejestracji: https://pzumarathon.pl',
      sender: 'Organizer',
      timestamp: new Date(2025, 1, 11, 12, 0),
      isRead: true
    },
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isFavorite: false,
    participants: ['Organizer', 'You', '+234 innych']
  }
]

export default function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState<'all' | 'dm' | 'groups' | 'favorites'>('all')

  const filteredChats = useMemo(() => {
    let filtered = mockChats

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by section
    switch (activeSection) {
      case 'dm':
        filtered = filtered.filter(chat => chat.type === 'dm')
        break
      case 'groups':
        filtered = filtered.filter(chat => chat.type === 'group')
        break
      case 'favorites':
        filtered = filtered.filter(chat => chat.isFavorite)
        break
    }

    // Sort: pinned first, then by last message timestamp
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    })
  }, [searchTerm, activeSection])

  const pinnedChats = filteredChats.filter(chat => chat.isPinned)
  const regularChats = filteredChats.filter(chat => !chat.isPinned)
  const favoriteChats = filteredChats.filter(chat => chat.isFavorite && !chat.isPinned)

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'teraz'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return format(timestamp, 'd MMM', { locale: pl })
  }

  const totalUnreadCount = mockChats.reduce((total, chat) => total + chat.unreadCount, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Wiadomości</h2>
            {totalUnreadCount > 0 && (
              <p className="text-sm text-gray-400">
                {totalUnreadCount} nieprzeczytanych
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj rozmów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-600 outline-none"
          />
        </div>

        {/* Section tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'all', label: 'Wszystkie', icon: MessageCircle },
            { id: 'dm', label: 'Prywatne', icon: Circle },
            { id: 'groups', label: 'Grupy', icon: Users },
            { id: 'favorites', label: 'Ulubione', icon: Star },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`
                flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-xs font-medium transition-all
                ${activeSection === section.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <section.icon className="h-3 w-3" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Brak rozmów</h3>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Spróbuj innych kryteriów wyszukiwania' : 'Rozpocznij nową rozmowę'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {/* Pinned chats */}
            {pinnedChats.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <Pin className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Przypięte
                  </span>
                </div>
                {pinnedChats.map((chat, index) => (
                  <ChatItem 
                    key={chat.id} 
                    chat={chat} 
                    isSelected={selectedChatId === chat.id}
                    onClick={() => onChatSelect?.(chat.id)}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Favorite chats (excluding pinned) */}
            {favoriteChats.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 px-3 py-2 mt-4">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Ulubione
                  </span>
                </div>
                {favoriteChats.map((chat, index) => (
                  <ChatItem 
                    key={chat.id} 
                    chat={chat} 
                    isSelected={selectedChatId === chat.id}
                    onClick={() => onChatSelect?.(chat.id)}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Regular chats */}
            {regularChats.filter(chat => !chat.isFavorite).length > 0 && (
              <div>
                {(pinnedChats.length > 0 || favoriteChats.length > 0) && (
                  <div className="flex items-center space-x-2 px-3 py-2 mt-4">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Pozostałe
                    </span>
                  </div>
                )}
                {regularChats.filter(chat => !chat.isFavorite).map((chat, index) => (
                  <ChatItem 
                    key={chat.id} 
                    chat={chat} 
                    isSelected={selectedChatId === chat.id}
                    onClick={() => onChatSelect?.(chat.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface ChatItemProps {
  chat: Chat
  isSelected: boolean
  onClick: () => void
  index: number
}

function ChatItem({ chat, isSelected, onClick, index }: ChatItemProps) {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'teraz'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return format(timestamp, 'd MMM', { locale: pl })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={onClick}
      className={`
        relative flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-red-600/20 border border-red-600/30' 
          : 'hover:bg-gray-800/50'
        }
      `}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-12 w-12">
          <img 
            src={chat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} 
            alt={chat.name}
            className="rounded-full object-cover"
          />
        </Avatar>
        
        {/* Online status */}
        {chat.type === 'dm' && (
          <div className={`
            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900
            ${chat.isOnline ? 'bg-green-500' : 'bg-gray-500'}
          `} />
        )}
        
        {/* Type indicator */}
        {chat.type === 'group' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-900">
            <Users className="h-2 w-2 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h3 className={`
              font-medium truncate
              ${!chat.lastMessage.isRead && chat.unreadCount > 0 ? 'text-white font-semibold' : 'text-white'}
            `}>
              {chat.name}
            </h3>
            
            {/* Icons */}
            <div className="flex items-center space-x-1">
              {chat.isPinned && (
                <Pin className="h-3 w-3 text-gray-400 fill-current" />
              )}
              {chat.isFavorite && (
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {formatTimestamp(chat.lastMessage.timestamp)}
            </span>
            {chat.unreadCount > 0 && (
              <Badge className="bg-red-600 text-white text-xs px-2 py-1">
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`
            text-sm truncate flex-1 mr-2
            ${!chat.lastMessage.isRead && chat.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}
          `}>
            {chat.type === 'group' && (
              <span className="text-gray-500">{chat.lastMessage.sender}: </span>
            )}
            {chat.lastMessage.content}
          </p>
          
          {chat.participants && (
            <span className="text-xs text-gray-500">
              {chat.participants.length > 3 
                ? `${chat.participants.slice(0, 2).join(', ')} ${chat.participants[2]}`
                : chat.participants.join(', ')
              }
            </span>
          )}
        </div>

        {/* Workout context */}
        {chat.workoutContext && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/20"
          >
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-red-400">🏃‍♂️</span>
              <span className="text-gray-300">Re: {chat.workoutContext.workoutName}</span>
              <span className="text-gray-500">
                {format(chat.workoutContext.date, 'd MMM', { locale: pl })}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}