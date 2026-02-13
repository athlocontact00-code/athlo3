'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight,
  Filter,
  User,
  Settings,
  Calendar,
  Bot,
  RefreshCw,
  Edit,
  Plus,
  Trash,
  MessageCircle,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AuditEventType = 
  | 'plan_change' 
  | 'ai_suggestion' 
  | 'coach_edit' 
  | 'settings_change' 
  | 'integration_sync'
  | 'workout_created'
  | 'workout_updated'
  | 'workout_deleted'
  | 'message_sent'
  | 'user_login';

interface AuditEvent {
  id: string;
  type: AuditEventType;
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userAvatar?: string;
  metadata?: Record<string, any>;
  changes?: {
    before?: any;
    after?: any;
  };
}

const eventIcons = {
  plan_change: { icon: Calendar, color: 'text-blue-400', bgColor: 'bg-blue-950/20' },
  ai_suggestion: { icon: Bot, color: 'text-red-400', bgColor: 'bg-red-950/20' },
  coach_edit: { icon: Edit, color: 'text-purple-400', bgColor: 'bg-purple-950/20' },
  settings_change: { icon: Settings, color: 'text-gray-400', bgColor: 'bg-gray-950/20' },
  integration_sync: { icon: RefreshCw, color: 'text-green-400', bgColor: 'bg-green-950/20' },
  workout_created: { icon: Plus, color: 'text-green-400', bgColor: 'bg-green-950/20' },
  workout_updated: { icon: Edit, color: 'text-yellow-400', bgColor: 'bg-yellow-950/20' },
  workout_deleted: { icon: Trash, color: 'text-red-400', bgColor: 'bg-red-950/20' },
  message_sent: { icon: MessageCircle, color: 'text-blue-400', bgColor: 'bg-blue-950/20' },
  user_login: { icon: User, color: 'text-gray-400', bgColor: 'bg-gray-950/20' },
};

const eventLabels = {
  plan_change: 'Plan Change',
  ai_suggestion: 'AI Suggestion',
  coach_edit: 'Coach Edit',
  settings_change: 'Settings Change',
  integration_sync: 'Integration Sync',
  workout_created: 'Workout Created',
  workout_updated: 'Workout Updated',
  workout_deleted: 'Workout Deleted',
  message_sent: 'Message Sent',
  user_login: 'User Login',
};

// Mock audit events
const mockEvents: AuditEvent[] = [
  {
    id: '1',
    type: 'plan_change',
    title: 'Training plan updated',
    description: 'Weekly volume increased from 6 to 8 hours',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    userId: 'coach_1',
    userName: 'Sarah Johnson',
    changes: {
      before: { weeklyVolume: 6, intensity: 'moderate' },
      after: { weeklyVolume: 8, intensity: 'moderate' },
    },
  },
  {
    id: '2',
    type: 'ai_suggestion',
    title: 'Recovery recommendation',
    description: 'AI suggested adding extra rest day due to HRV decline',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    userId: 'system_ai',
    userName: 'ATHLO AI Coach',
    metadata: {
      confidence: 0.87,
      reason: 'HRV trending down 12% over 3 days',
    },
  },
  {
    id: '3',
    type: 'workout_created',
    title: 'New interval workout added',
    description: '6x400m intervals @ 5K pace with 90s recovery',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    userId: 'coach_1',
    userName: 'Sarah Johnson',
    metadata: {
      workoutType: 'interval',
      duration: 45,
      intensity: 'high',
    },
  },
  {
    id: '4',
    type: 'settings_change',
    title: 'Notification preferences updated',
    description: 'Enabled push notifications for workout reminders',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    userId: 'athlete_1',
    userName: 'Mike Chen',
    changes: {
      before: { pushNotifications: false, emailReminders: true },
      after: { pushNotifications: true, emailReminders: true },
    },
  },
  {
    id: '5',
    type: 'integration_sync',
    title: 'Strava data synchronized',
    description: 'Imported 3 workouts from last week',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    userId: 'system_integration',
    userName: 'System Integration',
    metadata: {
      source: 'Strava',
      workoutsImported: 3,
      dataRange: '2024-02-05 to 2024-02-11',
    },
  },
  {
    id: '6',
    type: 'coach_edit',
    title: 'Workout intensity adjusted',
    description: 'Changed tomorrow\'s tempo run from moderate to easy',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    userId: 'coach_1',
    userName: 'Sarah Johnson',
    changes: {
      before: { intensity: 'moderate', duration: 60 },
      after: { intensity: 'easy', duration: 60 },
    },
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

interface AuditEventItemProps {
  event: AuditEvent;
  isExpanded: boolean;
  onToggle: () => void;
}

function AuditEventItem({ event, isExpanded, onToggle }: AuditEventItemProps) {
  const iconData = eventIcons[event.type];
  const Icon = iconData.icon;
  
  const hasDetails = event.changes || event.metadata;
  
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 top-12 w-0.5 h-full bg-border/40" />
      
      <div className="flex gap-4 pb-6">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border z-10',
          iconData.bgColor,
          'border-border/40'
        )}>
          <Icon className={cn('w-5 h-5', iconData.color)} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-card/50 rounded-lg border border-border/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {eventLabels[event.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(event.timestamp)}
                  </span>
                </div>
                
                <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="w-6 h-6">
                    <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-xs font-medium">
                      {event.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{event.userName}</span>
                </div>
              </div>
              
              {hasDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="flex-shrink-0 h-6 w-6 p-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
            
            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && hasDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-border/40"
                >
                  {event.changes && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Changes
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        {event.changes.before && (
                          <div className="p-3 rounded-lg bg-red-950/10 border border-red-600/20">
                            <div className="text-xs font-medium text-red-400 mb-2">Before</div>
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {JSON.stringify(event.changes.before, null, 2)}
                            </pre>
                          </div>
                        )}
                        {event.changes.after && (
                          <div className="p-3 rounded-lg bg-green-950/10 border border-green-600/20">
                            <div className="text-xs font-medium text-green-400 mb-2">After</div>
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {JSON.stringify(event.changes.after, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {event.metadata && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Metadata
                      </h5>
                      <div className="p-3 rounded-lg bg-gray-950/20 border border-gray-600/20">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AuditLogProps {
  className?: string;
  maxEvents?: number;
}

export function AuditLog({ className, maxEvents = 50 }: AuditLogProps) {
  const [events] = useState(mockEvents);
  const [filterType, setFilterType] = useState<AuditEventType | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  
  const eventTypes = Array.from(new Set(events.map(e => e.type)));
  
  const filteredEvents = filterType 
    ? events.filter(event => event.type === filterType)
    : events;
  
  const displayEvents = filteredEvents.slice(0, maxEvents);
  
  const toggleExpanded = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header & Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Audit Log</h3>
          <p className="text-sm text-muted-foreground">
            System events and changes history
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            <Button
              variant={filterType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(null)}
              className={cn(
                filterType === null && "bg-red-600 hover:bg-red-700"
              )}
            >
              All
            </Button>
            {eventTypes.map(type => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={cn(
                  "text-xs",
                  filterType === type && "bg-red-600 hover:bg-red-700"
                )}
              >
                {eventLabels[type]}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Events Timeline */}
      <div className="relative">
        {displayEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <AuditEventItem
              event={event}
              isExpanded={expandedEvents.has(event.id)}
              onToggle={() => toggleExpanded(event.id)}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="text-center pt-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          Showing {displayEvents.length} of {filteredEvents.length} events
          {filterType && ` • Filtered by: ${eventLabels[filterType]}`}
        </p>
      </div>
    </div>
  );
}