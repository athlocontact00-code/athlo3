"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, ChevronDown, ChevronUp, Plus, Sidebar, ArrowDown, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import PromptChips from './prompt-chips'
import InsightCard from './insight-card'

interface CoachChatProps {
  onNewThread?: () => void
}

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  insights?: Insight[]
  sources?: Source[]
  isTyping?: boolean
}

interface Insight {
  id: string
  type: 'info' | 'warning' | 'alert'
  title: string
  summary: string
  explanation: string
  dataPoints: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[]
  action: string
}

interface Source {
  type: 'workout' | 'checkin' | 'metric'
  name: string
  date: Date
  value?: string
}

interface Thread {
  id: string
  title: string
  lastActivity: Date
  messageCount: number
}

const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Plan na ten tydzień',
    lastActivity: new Date(2025, 1, 13, 18, 30),
    messageCount: 12
  },
  {
    id: '2', 
    title: 'Analiza ostatniego miesiąca',
    lastActivity: new Date(2025, 1, 12, 14, 20),
    messageCount: 8
  },
  {
    id: '3',
    title: 'Przygotowanie do maratonu',
    lastActivity: new Date(2025, 1, 10, 9, 15),
    messageCount: 15
  }
]

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Cześć! Jak mogę Ci dzisiaj pomóc?',
    sender: 'ai',
    timestamp: new Date(2025, 1, 13, 9, 0)
  },
  {
    id: '2',
    content: 'Jak oceniasz mój postęp w tym miesiącu?',
    sender: 'user',
    timestamp: new Date(2025, 1, 13, 9, 5)
  },
  {
    id: '3',
    content: 'Świetne pytanie! Przeanalizowałem Twoje dane z ostatnich 4 tygodni i widzę znaczący postęp w kilku obszarach.',
    sender: 'ai',
    timestamp: new Date(2025, 1, 13, 9, 6),
    insights: [
      {
        id: 'insight-1',
        type: 'info',
        title: 'Poprawa wydolności',
        summary: 'Twoje tempo progowe poprawiło się o 15 sekund na kilometr',
        explanation: 'Analizując Twoje treningi interwałowe z ostatnich 4 tygodni, widzę konsystentną poprawę w tempie przy tym samym poziomie wysiłku (RPE).',
        dataPoints: [
          { label: 'Tempo progowe', value: '4:15/km', trend: 'up' },
          { label: 'Średnie HR w Z4', value: '165 bpm', trend: 'down' },
          { label: 'RPE przy tempie progowym', value: '7.2/10', trend: 'down' }
        ],
        action: 'Kontynuuj obecny plan treningowy - świetnie Ci idzie!'
      }
    ],
    sources: [
      { type: 'workout', name: 'Threshold Intervals', date: new Date(2025, 1, 11), value: '4:15/km' },
      { type: 'workout', name: 'Tempo Run', date: new Date(2025, 1, 8), value: '4:18/km' },
      { type: 'checkin', name: 'RPE tracking', date: new Date(2025, 1, 13), value: '7.2 avg' }
    ]
  },
  {
    id: '4',
    content: 'To brzmi świetnie! Czy powinienem zwiększyć intensywność treningów?',
    sender: 'user',
    timestamp: new Date(2025, 1, 13, 9, 10)
  },
  {
    id: '5',
    content: 'Nie zalecam gwałtownego zwiększania intensywności. Twój organizm świetnie adaptuje się do obecnego planu. Zamiast tego skupmy się na zwiększeniu objętości w strefie 2 o 10-15%.',
    sender: 'ai',
    timestamp: new Date(2025, 1, 13, 9, 12),
    insights: [
      {
        id: 'insight-2',
        type: 'warning',
        title: 'Ryzyko przeciążenia',
        summary: 'Zbyt szybkie zwiększenie intensywności może prowadzić do kontuzji',
        explanation: 'Twój aktualny TSS (Training Stress Score) wzrósł już o 20% w tym miesiącu. Dalsze zwiększanie intensywności bez odpowiedniej bazy aerobowej może być ryzykowne.',
        dataPoints: [
          { label: 'TSS tygodniowy', value: '450', trend: 'up' },
          { label: 'Czas w Z2', value: '65%', trend: 'stable' },
          { label: 'Compliance', value: '95%', trend: 'up' }
        ],
        action: 'Zwiększ objętość Z2 o 15%, utrzymaj obecną intensywność Z4-Z5'
      }
    ],
    sources: [
      { type: 'metric', name: 'Weekly TSS', date: new Date(2025, 1, 13), value: '450' },
      { type: 'metric', name: 'Zone distribution', date: new Date(2025, 1, 13), value: 'Z2: 65%' }
    ]
  }
]

export default function CoachChat({ onNewThread }: CoachChatProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedThread, setSelectedThread] = useState('current')
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
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

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(content),
        sender: 'ai',
        timestamp: new Date(),
        sources: [
          { type: 'checkin', name: 'Daily check-in', date: new Date(), value: 'Readiness: 78%' }
        ]
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateMockResponse = (userInput: string): string => {
    const responses = [
      'Świetne pytanie! Na podstawie Twoich danych widzę, że...',
      'Analizując Twoje ostatnie treningi, mogę powiedzieć, że...',
      'To interesujące obserwacja. Sprawdziłem Twoje dane i...',
      'Doskonały punkt! Oto co sugerują Twoje metryki...'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const toggleInsightExpansion = (insightId: string) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev)
      if (newSet.has(insightId)) {
        newSet.delete(insightId)
      } else {
        newSet.add(insightId)
      }
      return newSet
    })
  }

  return (
    <div className="flex h-full bg-gray-900">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-gray-800 bg-gray-900/50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Historia rozmów</h3>
                <Button
                  size="sm"
                  onClick={onNewThread}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedThread('current')}
                  className={`
                    w-full p-3 rounded-lg text-left transition-colors
                    ${selectedThread === 'current' 
                      ? 'bg-red-600/20 border border-red-600/30' 
                      : 'hover:bg-gray-800/50'
                    }
                  `}
                >
                  <div className="font-medium text-white">Obecna rozmowa</div>
                  <div className="text-sm text-gray-400">{messages.length} wiadomości</div>
                </button>
                
                {mockThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`
                      w-full p-3 rounded-lg text-left transition-colors
                      ${selectedThread === thread.id 
                        ? 'bg-red-600/20 border border-red-600/30' 
                        : 'hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <div className="font-medium text-white">{thread.title}</div>
                    <div className="text-sm text-gray-400 flex justify-between">
                      <span>{thread.messageCount} wiadomości</span>
                      <span>{format(thread.lastActivity, 'd MMM', { locale: pl })}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Card className="p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Sidebar className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500">
                    <div className="flex items-center justify-center w-full h-full">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  </Avatar>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  />
                </div>
                
                <div>
                  <h2 className="font-semibold text-white flex items-center space-x-2">
                    <span>AI Coach</span>
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </h2>
                  <p className="text-sm text-gray-400">
                    Zawsze dostępny • Powered by AI
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={onNewThread}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Nowy wątek
            </Button>
          </div>
        </Card>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-900 to-gray-900/50"
        >
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-4xl ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
                <div className="flex items-start space-x-3 mb-2">
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                      <div className="flex items-center justify-center w-full h-full">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </Avatar>
                  )}
                  
                  <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className="text-xs text-gray-400 mb-1">
                      {message.sender === 'ai' ? 'AI Coach' : 'Ty'} • {format(message.timestamp, 'HH:mm')}
                    </div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <User className="h-4 w-4" />
                    </Avatar>
                  )}
                </div>

                <div className={`${message.sender === 'user' ? 'flex justify-end' : ''}`}>
                  <Card className={`
                    p-4 max-w-none
                    ${message.sender === 'ai' 
                      ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20' 
                      : 'bg-red-600 text-white'
                    }
                  `}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {/* AI Insights */}
                    {message.insights && message.insights.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.insights.map((insight) => (
                          <InsightCard
                            key={insight.id}
                            insight={insight}
                            isExpanded={expandedInsights.has(insight.id)}
                            onToggle={() => toggleInsightExpansion(insight.id)}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300 transition-colors">
                          Źródła danych ({message.sources.length})
                        </summary>
                        <div className="mt-2 space-y-1">
                          {message.sources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <span>
                                  {source.type === 'workout' ? '🏃‍♂️' : 
                                   source.type === 'checkin' ? '📝' : '📊'}
                                </span>
                                <span className="text-gray-300">{source.name}</span>
                              </div>
                              <div className="text-gray-400">
                                {source.value && <span>{source.value} • </span>}
                                {format(source.date, 'd MMM', { locale: pl })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </Card>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-4xl mr-12">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500">
                    <Bot className="h-4 w-4 text-white" />
                  </Avatar>
                  <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
          
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
              className="absolute bottom-32 right-6 p-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-colors z-10"
            >
              <ArrowDown className="h-4 w-4 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Prompt chips and input */}
        <div className="border-t border-gray-800 bg-gray-900">
          <PromptChips onPromptSelect={handlePromptSelect} />
          
          <div className="p-4">
            <div className="flex space-x-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(newMessage)
                  }
                }}
                placeholder="Zadaj pytanie AI Coach..."
                rows={1}
                className="
                  flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-2xl resize-none
                  text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none
                  max-h-32
                "
              />
              <Button
                onClick={() => handleSendMessage(newMessage)}
                disabled={!newMessage.trim() || isTyping}
                className="bg-purple-600 hover:bg-purple-700 px-6 rounded-2xl"
              >
                Wyślij
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}