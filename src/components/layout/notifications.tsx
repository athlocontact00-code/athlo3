'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellRing,
  Check, 
  CheckCheck, 
  X, 
  ArrowRight,
  User,
  Calendar,
  MessageCircle,
  Bot,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'training' | 'checkin' | 'coach' | 'ai' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const notificationIcons = {
  training: { icon: Calendar, emoji: '🏃', color: 'text-blue-400' },
  checkin: { icon: User, emoji: '📋', color: 'text-green-400' },
  coach: { icon: MessageCircle, emoji: '💬', color: 'text-purple-400' },
  ai: { icon: Bot, emoji: '🤖', color: 'text-red-400' },
  achievement: { icon: Trophy, emoji: '🏆', color: 'text-yellow-400' },
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'training',
    title: 'Morning run reminder',
    description: 'Your 45-minute easy run is scheduled for 7:00 AM today',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: '/dashboard/calendar',
  },
  {
    id: '2',
    type: 'ai',
    title: 'Recovery insight available',
    description: 'Your AI coach noticed your HRV trending down and has suggestions',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    actionUrl: '/dashboard/ai-coach',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'New personal record!',
    description: 'You achieved your fastest 5K time: 22:45. Congratulations!',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    actionUrl: '/dashboard/progress',
  },
  {
    id: '4',
    type: 'checkin',
    title: 'Daily check-in reminder',
    description: "Don't forget to log your readiness and sleep quality",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: true,
    actionUrl: '/dashboard/diary',
  },
  {
    id: '5',
    type: 'coach',
    title: 'Message from Sarah Johnson',
    description: 'Great job on yesterday\'s tempo run! Your pacing was perfect.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: true,
    actionUrl: '/dashboard/messages',
  },
  {
    id: '6',
    type: 'training',
    title: 'Week 3 training plan updated',
    description: 'Your coach made adjustments to this week\'s schedule',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: '/dashboard/plan',
  },
];

function formatTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onAction: (url: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onAction }: NotificationItemProps) {
  const iconData = notificationIcons[notification.type];
  const Icon = iconData.icon;
  
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      onAction(notification.actionUrl);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'p-4 border-b border-border/40 cursor-pointer transition-all hover:bg-gray-900/30',
        !notification.read && 'bg-red-950/10 border-l-4 border-l-red-600'
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          notification.type === 'training' && 'bg-blue-950/30 border border-blue-600/30',
          notification.type === 'checkin' && 'bg-green-950/30 border border-green-600/30',
          notification.type === 'coach' && 'bg-purple-950/30 border border-purple-600/30',
          notification.type === 'ai' && 'bg-red-950/30 border border-red-600/30',
          notification.type === 'achievement' && 'bg-yellow-950/30 border border-yellow-600/30'
        )}>
          <Icon className={cn('w-4 h-4', iconData.color)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={cn(
                  'font-medium text-sm',
                  !notification.read && 'text-white'
                )}>
                  {notification.title}
                </h4>
                {!notification.read && (
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(notification.timestamp)}
                </span>
                {notification.actionUrl && (
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const handleAction = (url: string) => {
    // In a real app, this would navigate to the URL
    console.log('Navigate to:', url);
    setIsOpen(false);
  };
  
  const handleClearNotification = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700 text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[600px] bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/40 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs gap-1 h-6 px-2"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div>
                  {notifications.map(notification => (
                    <div key={notification.id} className="group relative">
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onAction={handleAction}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleClearNotification(notification.id, e)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 h-6 w-6 p-0 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/40 bg-gray-900/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleAction('/dashboard/notifications');
                }}
                className="w-full justify-center text-xs gap-2"
              >
                View all notifications
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}