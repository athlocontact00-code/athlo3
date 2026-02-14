'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MapPin,
  Clock,
  Zap,
  Activity,
  Bike,
  Waves,
  Dumbbell,
  MoreHorizontal,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types
interface ActivityFeedItem {
  id: string;
  athlete: {
    id: string;
    name: string;
    avatar?: string;
    team?: string;
  };
  activity: {
    type: 'run' | 'bike' | 'swim' | 'strength' | 'other';
    name: string;
    description?: string;
    metrics: {
      duration?: string;
      distance?: string;
      pace?: string;
      power?: string;
      heartRate?: string;
    };
    achievements?: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    liked: boolean;
  };
  location?: string;
  timestamp: string;
  photo?: string;
  weather?: {
    condition: string;
    temp: number;
  };
}

// Mock data
const mockActivities: ActivityFeedItem[] = [
  {
    id: '1',
    athlete: {
      id: 'anna_coach',
      name: 'Anna Kowalski',
      avatar: '/avatars/anna.jpg',
      team: 'Warsaw Runners'
    },
    activity: {
      type: 'run',
      name: 'Morning Tempo Run',
      description: 'Perfect conditions for threshold work! Felt strong throughout.',
      metrics: {
        distance: '8.2 km',
        duration: '42:15',
        pace: '5:09/km',
        heartRate: '165 avg'
      },
      achievements: ['New 10K PR!', 'Consistent pace']
    },
    engagement: {
      likes: 12,
      comments: 3,
      liked: false
    },
    location: 'Łazienki Park, Warsaw',
    timestamp: '2 hours ago',
    photo: '/activities/morning-run.jpg',
    weather: {
      condition: 'sunny',
      temp: 18
    }
  },
  {
    id: '2',
    athlete: {
      id: 'tomek_teammate',
      name: 'Tomek Nowak',
      avatar: '/avatars/tomek.jpg',
      team: 'Warsaw Runners'
    },
    activity: {
      type: 'bike',
      name: 'Zone 2 Base Building',
      description: 'Easy spin, working on aerobic base. Legs felt good after yesterday\'s run.',
      metrics: {
        distance: '45.8 km',
        duration: '1:52:30',
        power: '180W avg',
        heartRate: '142 avg'
      }
    },
    engagement: {
      likes: 8,
      comments: 1,
      liked: true
    },
    location: 'Wilanów, Warsaw',
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    athlete: {
      id: 'kasia_swimmer',
      name: 'Kasia Wiśniewska',
      avatar: '/avatars/kasia.jpg',
      team: 'Tri Team Warsaw'
    },
    activity: {
      type: 'swim',
      name: 'Technique Focus Session',
      description: 'Working on catch and pull. Coach says form is improving!',
      metrics: {
        distance: '2.5 km',
        duration: '58:45',
        pace: '1:33/100m'
      },
      achievements: ['Best technique session']
    },
    engagement: {
      likes: 15,
      comments: 2,
      liked: false
    },
    location: 'Aquatic Center',
    timestamp: '6 hours ago'
  },
  {
    id: '4',
    athlete: {
      id: 'marcin_strong',
      name: 'Marcin Kowal',
      avatar: '/avatars/marcin.jpg'
    },
    activity: {
      type: 'strength',
      name: 'Lower Body Power',
      description: 'Squats and deadlifts feeling strong today. New PR on squats!',
      metrics: {
        duration: '1:15:00'
      },
      achievements: ['New Squat PR: 140kg']
    },
    engagement: {
      likes: 20,
      comments: 5,
      liked: true
    },
    timestamp: '8 hours ago'
  },
  {
    id: '5',
    athlete: {
      id: 'ola_runner',
      name: 'Ola Zielińska',
      avatar: '/avatars/ola.jpg',
      team: 'Warsaw Runners'
    },
    activity: {
      type: 'run',
      name: 'Easy Recovery Jog',
      description: 'Taking it easy after yesterday\'s intervals. Beautiful sunset!',
      metrics: {
        distance: '6.5 km',
        duration: '38:20',
        pace: '5:54/km',
        heartRate: '135 avg'
      }
    },
    engagement: {
      likes: 7,
      comments: 1,
      liked: false
    },
    location: 'Vistula Boulevards',
    timestamp: '12 hours ago',
    photo: '/activities/sunset-run.jpg'
  }
];

const getActivityIcon = (type: ActivityFeedItem['activity']['type']) => {
  switch (type) {
    case 'run': return Activity;
    case 'bike': return Bike;
    case 'swim': return Waves;
    case 'strength': return Dumbbell;
    default: return Activity;
  }
};

const getActivityColor = (type: ActivityFeedItem['activity']['type']) => {
  switch (type) {
    case 'run': return 'text-blue-500 bg-blue-500/10';
    case 'bike': return 'text-orange-500 bg-orange-500/10';
    case 'swim': return 'text-cyan-500 bg-cyan-500/10';
    case 'strength': return 'text-purple-500 bg-purple-500/10';
    default: return 'text-gray-500 bg-gray-500/10';
  }
};

interface ActivityCardProps {
  activity: ActivityFeedItem;
  onLike: (id: string) => void;
}

function ActivityCard({ activity, onLike }: ActivityCardProps) {
  const ActivityIcon = getActivityIcon(activity.activity.type);
  const activityColor = getActivityColor(activity.activity.type);
  
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start space-x-3 p-4 pb-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={activity.athlete.avatar} alt={activity.athlete.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {activity.athlete.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {activity.athlete.name}
              </h3>
              {activity.athlete.team && (
                <Badge variant="secondary" className="text-xs">
                  {activity.athlete.team}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>completed</span>
              <div className={cn("p-1 rounded", activityColor)}>
                <ActivityIcon className="w-3 h-3" />
              </div>
              <span className="font-medium">{activity.activity.name}</span>
              {activity.activity.metrics.distance && (
                <>
                  <span>—</span>
                  <span>{activity.activity.metrics.distance}</span>
                  {activity.activity.metrics.duration && (
                    <>
                      <span>in</span>
                      <span>{activity.activity.metrics.duration}</span>
                    </>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{activity.timestamp}</span>
              </span>
              {activity.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activity.location}</span>
                </span>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Activity Photo */}
        {activity.photo && (
          <div className="px-4 pb-3">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground">📸 Activity Photo</span>
              </div>
            </div>
          </div>
        )}

        {/* Activity Description */}
        {activity.activity.description && (
          <div className="px-4 pb-3">
            <p className="text-sm text-muted-foreground">
              {activity.activity.description}
            </p>
          </div>
        )}

        {/* Metrics */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-3 text-sm">
            {Object.entries(activity.activity.metrics).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-1">
                <span className="text-muted-foreground capitalize">
                  {key === 'heartRate' ? 'HR' : key}:
                </span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        {activity.activity.achievements && activity.activity.achievements.length > 0 && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-2">
              {activity.activity.achievements.map((achievement, index) => (
                <Badge 
                  key={index}
                  className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Engagement */}
        <div className="px-4 pb-4 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(activity.id)}
                className={cn(
                  "flex items-center space-x-1 p-2 h-auto",
                  activity.engagement.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart 
                  className={cn(
                    "w-4 h-4",
                    activity.engagement.liked ? "fill-current" : ""
                  )} 
                />
                <span className="text-sm font-medium">
                  {activity.engagement.likes}
                </span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 p-2 h-auto text-muted-foreground hover:text-foreground">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{activity.engagement.comments}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="p-2 h-auto text-muted-foreground hover:text-foreground">
                <Share className="w-4 h-4" />
              </Button>
            </div>
            
            {activity.engagement.comments > 0 && (
              <Button variant="link" size="sm" className="text-xs text-muted-foreground p-0">
                View comments
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityFeedProps {
  className?: string;
  limit?: number;
}

export function ActivityFeed({ className, limit }: ActivityFeedProps) {
  const [activities, setActivities] = useState(mockActivities);
  const [loading, setLoading] = useState(false);

  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  const handleLike = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? {
              ...activity,
              engagement: {
                ...activity.engagement,
                liked: !activity.engagement.liked,
                likes: activity.engagement.liked 
                  ? activity.engagement.likes - 1 
                  : activity.engagement.likes + 1
              }
            }
          : activity
      )
    );
  };

  const handleLoadMore = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    // In real app, would load more activities from API
  };

  return (
    <div className={cn("space-y-4", className)}>
      {displayedActivities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ActivityCard 
            activity={activity} 
            onLike={handleLike}
          />
        </motion.div>
      ))}
      
      {(!limit || displayedActivities.length >= limit) && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
      
      {displayedActivities.length === 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No activities yet
            </h3>
            <p className="text-muted-foreground">
              Follow teammates to see their activities here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}