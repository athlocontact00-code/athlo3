'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  MessageSquare, 
  Bot,
  CheckCircle,
  Calendar,
  TrendingUp,
  Zap,
  ArrowRight,
  Clock,
  Target,
  Users,
  AlertTriangle,
  ThumbsUp,
  BarChart3,
  Star,
  Award,
  Heart,
  Lightbulb
} from 'lucide-react';
import { PremiumCard, MetricCard } from '@/components/common/premium-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuoteOfDay } from '@/components/dashboard/quote-of-day';
import { useUserProfile } from '@/hooks/use-user-profile';
import Link from 'next/link';

// Animation variants with staggered delays
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1
  }
};

const containerTransition = {
  staggerChildren: 0.1,
  delayChildren: 0.05
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0
  }
};

// Mock data - in real app this would come from APIs
const mockData = {
  user: {
    name: 'Bartek',
    readinessScore: 78,
    readinessStatus: "You're well recovered. Ready for intensity."
  },
  todaysWorkouts: [
    { 
      id: 1, 
      name: 'Interval Training', 
      duration: '45 min', 
      zone: 'Z4-Z5',
      type: 'run',
      completed: false 
    },
    { 
      id: 2, 
      name: 'Core Strength', 
      duration: '20 min', 
      zone: 'Recovery',
      type: 'strength',
      completed: false 
    },
  ],
  weeklyLoad: [65, 82, 78, 90, 85, 72, 88], // 7 days of load
  recentInsights: [
    {
      title: 'Your running efficiency is improving',
      summary: '8% improvement in pace per heart rate this month',
      timestamp: '2 hours ago'
    },
    {
      title: 'Recovery trending upward',
      summary: 'HRV shows positive adaptation to training load',
      timestamp: '1 day ago'
    }
  ],
  lastMessage: {
    from: 'Coach Anna',
    preview: 'Great session yesterday! Ready for intervals?',
    timestamp: '2 hours ago'
  }
};

// Profile-specific mock data
const getProfileMockData = (profile: string): any => {
  const baseData = {
    user: {
      name: 'Bartek',
      readinessScore: 78,
      readinessStatus: "You're well recovered. Ready for intensity."
    },
    weeklyLoad: [65, 82, 78, 90, 85, 72, 88],
  };

  switch (profile) {
    case 'coach':
      return {
        ...baseData,
        athletesNeedingAttention: [
          { name: 'Alex M.', issue: 'Low readiness (42)', urgency: 'high' },
          { name: 'Sara K.', issue: 'Missed check-in', urgency: 'medium' },
          { name: 'Tom R.', issue: 'High injury risk', urgency: 'high' },
        ],
        teamCompliance: 78,
        recentActivity: [
          { athlete: 'Alex M.', action: 'completed workout', time: '2h ago' },
          { athlete: 'Sara K.', action: 'logged check-in', time: '4h ago' },
          { athlete: 'Emma L.', action: 'sent message', time: '6h ago' },
        ],
        teamLeaderboard: [
          { name: 'Emma L.', score: 92, change: 'up' },
          { name: 'Tom R.', score: 89, change: 'same' },
          { name: 'Alex M.', score: 76, change: 'down' },
        ]
      };

    case 'athlete-coach':
      return {
        ...baseData,
        todaysWorkout: {
          name: 'Threshold Intervals',
          duration: '60 min',
          zone: 'Z3-Z4',
          coachNote: 'Focus on maintaining steady effort. Keep HR in zone 4.',
          from: 'Coach Anna'
        },
        checkInStatus: false,
        coachMessage: {
          from: 'Coach Anna',
          preview: 'Great session yesterday! Ready for intervals today?',
          timestamp: '2 hours ago'
        },
      };

    case 'athlete-solo':
      return {
        ...baseData,
        todaysWorkouts: [
          { id: 1, name: 'Morning Run', duration: '45 min', zone: 'Z2', type: 'run' },
          { id: 2, name: 'Strength Training', duration: '30 min', zone: 'Recovery', type: 'strength' },
        ],
        checkInStatus: false,
        currentGoals: [
          { name: '10K under 45min', progress: 78, target: '2 weeks' },
          { name: 'Consistent training', progress: 92, target: 'ongoing' },
        ]
      };

    case 'athlete-ai':
      return {
        ...baseData,
        aiRecommendation: {
          workout: 'Easy Recovery Run',
          duration: '30 min',
          zone: 'Z1',
          reasoning: 'Based on your readiness score (78/100) and recent high-intensity sessions, today calls for active recovery.',
        },
        aiInsight: 'Your running efficiency improved 12% this month! Keep up the consistency.',
        aiConversation: {
          lastMessage: 'How are you feeling after yesterday\'s workout?',
          timestamp: '1 hour ago'
        },
        checkInStatus: false,
      };

    default:
      return baseData;
  }
};

export default function DashboardPage() {
  const { profile, config } = useUserProfile();
  const mockData = getProfileMockData(profile);

  // Dynamic greeting based on time and profile
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = mockData.user.name;
    
    if (profile === 'coach') {
      if (hour < 12) return `Good morning, Coach`;
      if (hour < 17) return `Good afternoon, Coach`;
      return `Good evening, Coach`;
    }
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Get readiness color
  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  // Current date formatting
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Coach Dashboard
  if (profile === 'coach') {
    return (
      <motion.div 
        className="p-4 md:p-6 max-w-7xl mx-auto"
        variants={container}
        transition={containerTransition}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {getCurrentDate()} • Managing 8 athletes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Athletes Needing Attention */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-foreground">Athletes Needing Attention</h3>
                </div>
                
                <div className="space-y-3">
                  {mockData.athletesNeedingAttention.map((athlete: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className={`w-2 h-2 rounded-full ${
                        athlete.urgency === 'high' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{athlete.name}</p>
                        <p className="text-xs text-muted-foreground">{athlete.issue}</p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>

            {/* Team Compliance */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Team Compliance This Week</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Check-ins completed</span>
                    <span className="text-2xl font-bold text-foreground">{mockData.teamCompliance}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${mockData.teamCompliance}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">6 out of 8 athletes on track</p>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item}>
              <PremiumCard>
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                    <Link href="/plan">
                      <Target className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Create Plan</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                    <Link href="/messages">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Message Athlete</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                    <Link href="/calendar">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">View Calendar</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                    <Link href="/athletes">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Manage Athletes</span>
                    </Link>
                  </Button>
                </div>
              </PremiumCard>
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Recent Athlete Activity</h3>
                </div>
                
                <div className="space-y-3">
                  {mockData.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <ThumbsUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.athlete}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>

            {/* Team Leaderboard */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Team Leaderboard</h3>
                </div>
                
                <div className="space-y-3">
                  {mockData.teamLeaderboard.map((athlete: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{athlete.name}</p>
                        <p className="text-xs text-muted-foreground">Readiness Score</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{athlete.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Athlete + Coach Dashboard
  if (profile === 'athlete-coach') {
    return (
      <motion.div 
        className="p-4 md:p-6 max-w-7xl mx-auto"
        variants={container}
        transition={containerTransition}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {getCurrentDate()}
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Hero Card - Today's Readiness */}
          <motion.div variants={item}>
            <PremiumCard variant="elevated" accentColor="primary">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">Today's Readiness</h2>
                  <p className="text-sm text-muted-foreground">{mockData.user.readinessStatus}</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold font-mono ${getReadinessColor(mockData.user.readinessScore)}`}>
                    {mockData.user.readinessScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">out of 100</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${mockData.user.readinessScore}%` }} />
                </div>
              </div>
            </PremiumCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Today's Workout from Coach */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Today's Workout</h3>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">From Coach</Badge>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{mockData.todaysWorkout.name}</h4>
                      <span className="text-sm text-muted-foreground">{mockData.todaysWorkout.duration}</span>
                    </div>
                    <Badge variant="secondary" className="mb-3">{mockData.todaysWorkout.zone}</Badge>
                    <p className="text-sm text-muted-foreground mb-4">{mockData.todaysWorkout.coachNote}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Start Workout</Button>
                      <Button size="sm" variant="outline">Modify</Button>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Check-in Status */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Daily Check-in</h3>
                      <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                    </div>
                    {!mockData.checkInStatus ? (
                      <Button asChild>
                        <Link href="/diary">Log Check-in →</Link>
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={item}>
                <PremiumCard>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/diary">
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Check-in</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/messages">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Message Coach</span>
                      </Link>
                    </Button>
                  </div>
                </PremiumCard>
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* Message from Coach */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Message from Coach</h3>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">{mockData.coachMessage.from}</p>
                      <span className="text-xs text-muted-foreground">{mockData.coachMessage.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{mockData.coachMessage.preview}</p>
                    <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto text-xs text-primary">
                      Reply →
                    </Button>
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Weekly Load */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Weekly Load</h3>
                  </div>
                  
                  <div className="flex items-end gap-1 h-20 px-2">
                    {mockData.weeklyLoad.map((load: number, index: number) => {
                      const isToday = index === new Date().getDay();
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className={`w-full rounded-sm transition-all duration-300 ${
                              isToday ? 'bg-primary' : 'bg-muted hover:bg-muted/80'
                            }`}
                            style={{ 
                              height: `${(load / Math.max(...mockData.weeklyLoad)) * 100}%`,
                              minHeight: '4px'
                            }}
                          />
                          <span className={`text-xs ${
                            isToday ? 'text-primary font-medium' : 'text-muted-foreground'
                          }`}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </PremiumCard>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Athlete Solo Dashboard
  if (profile === 'athlete-solo') {
    return (
      <motion.div 
        className="p-4 md:p-6 max-w-7xl mx-auto"
        variants={container}
        transition={containerTransition}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {getCurrentDate()}
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Hero Card - Today's Readiness */}
          <motion.div variants={item}>
            <PremiumCard variant="elevated" accentColor="primary">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">Today's Readiness</h2>
                  <p className="text-sm text-muted-foreground">{mockData.user.readinessStatus}</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold font-mono ${getReadinessColor(mockData.user.readinessScore)}`}>
                    {mockData.user.readinessScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">out of 100</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${mockData.user.readinessScore}%` }} />
                </div>
              </div>
            </PremiumCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Today's Self-Planned Workouts */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Today's Plan
                    </h3>
                    <Link href="/plan">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View all <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {mockData.todaysWorkouts.map((workout: any) => (
                      <div key={workout.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className={`w-2 h-2 rounded-full ${
                          workout.type === 'run' ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{workout.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {workout.duration}
                            </span>
                            <Badge variant="secondary" className="text-xs">{workout.zone}</Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Start</Button>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Goal Tracker */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Goal Tracker</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {mockData.currentGoals.map((goal: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{goal.name}</span>
                          <span className="text-xs text-muted-foreground">{goal.target}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${goal.progress}%` }} />
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Quote of the Day */}
              <motion.div variants={item}>
                <QuoteOfDay />
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div variants={item}>
                <PremiumCard>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/diary">
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Check-in</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/plan">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Add Workout</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/progress">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">View Progress</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/status">
                        <Heart className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Health Status</span>
                      </Link>
                    </Button>
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Weekly Progress */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Weekly Load</h3>
                  </div>
                  
                  <div className="flex items-end gap-1 h-20 px-2">
                    {mockData.weeklyLoad.map((load: number, index: number) => {
                      const isToday = index === new Date().getDay();
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className={`w-full rounded-sm transition-all duration-300 ${
                              isToday ? 'bg-primary' : 'bg-muted hover:bg-muted/80'
                            }`}
                            style={{ 
                              height: `${(load / Math.max(...mockData.weeklyLoad)) * 100}%`,
                              minHeight: '4px'
                            }}
                          />
                          <span className={`text-xs ${
                            isToday ? 'text-primary font-medium' : 'text-muted-foreground'
                          }`}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </PremiumCard>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Athlete + AI Dashboard
  if (profile === 'athlete-ai') {
    return (
      <motion.div 
        className="p-4 md:p-6 max-w-7xl mx-auto"
        variants={container}
        transition={containerTransition}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {getCurrentDate()}
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Hero Card - Today's Readiness */}
          <motion.div variants={item}>
            <PremiumCard variant="elevated" accentColor="primary">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">Today's Readiness</h2>
                  <p className="text-sm text-muted-foreground">{mockData.user.readinessStatus}</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold font-mono ${getReadinessColor(mockData.user.readinessScore)}`}>
                    {mockData.user.readinessScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">out of 100</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${mockData.user.readinessScore}%` }} />
                </div>
              </div>
            </PremiumCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* AI Coach Recommendation */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">AI Coach Recommendation</h3>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">Based on your readiness ({mockData.user.readinessScore}/100), I recommend:</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-1">{mockData.aiRecommendation.workout}</h4>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-muted-foreground">{mockData.aiRecommendation.duration}</span>
                        <Badge variant="secondary">{mockData.aiRecommendation.zone}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{mockData.aiRecommendation.reasoning}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Accept</Button>
                      <Button size="sm" variant="outline">Modify</Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href="/ai-coach">Ask AI</Link>
                      </Button>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Latest AI Insight */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Latest AI Insight</h3>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-foreground">{mockData.aiInsight}</p>
                    <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto text-xs text-primary" asChild>
                      <Link href="/ai-coach">Learn more →</Link>
                    </Button>
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={item}>
                <PremiumCard>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/diary">
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Check-in</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/ai-coach">
                        <Bot className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Chat with AI</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/plan">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">View Plan</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <Link href="/progress">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Progress</span>
                      </Link>
                    </Button>
                  </div>
                </PremiumCard>
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* AI Conversation Preview */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      AI Coach Chat
                    </h3>
                    <Link href="/ai-coach">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Open chat <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground mb-1">{mockData.aiConversation.lastMessage}</p>
                        <span className="text-xs text-muted-foreground">{mockData.aiConversation.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Weekly Load */}
              <motion.div variants={item}>
                <PremiumCard>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Weekly Load</h3>
                  </div>
                  
                  <div className="flex items-end gap-1 h-20 px-2">
                    {mockData.weeklyLoad.map((load: number, index: number) => {
                      const isToday = index === new Date().getDay();
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className={`w-full rounded-sm transition-all duration-300 ${
                              isToday ? 'bg-primary' : 'bg-muted hover:bg-muted/80'
                            }`}
                            style={{ 
                              height: `${(load / Math.max(...mockData.weeklyLoad)) * 100}%`,
                              minHeight: '4px'
                            }}
                          />
                          <span className={`text-xs ${
                            isToday ? 'text-primary font-medium' : 'text-muted-foreground'
                          }`}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </PremiumCard>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback - should never reach here but just in case
  return <div>Loading...</div>;
}