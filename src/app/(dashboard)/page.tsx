'use client';

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
  Target
} from 'lucide-react';
import { PremiumCard, MetricCard } from '@/components/common/premium-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuoteOfDay } from '@/components/dashboard/quote-of-day';
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

export default function DashboardPage() {
  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = mockData.user.name;
    
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

  return (
    <motion.div 
      className="p-4 md:p-6 max-w-7xl mx-auto"
      variants={container}
      transition={containerTransition}
      initial="hidden"
      animate="show"
    >
      {/* Greeting Section */}
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
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    Today's Readiness
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {mockData.user.readinessStatus}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-4xl font-bold font-mono ${getReadinessColor(mockData.user.readinessScore)}`}>
                  {mockData.user.readinessScore}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  out of 100
                </div>
              </div>
            </div>
            
            {/* Circular Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${mockData.user.readinessScore}%` }}
                />
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Desktop Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Today's Plan */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Today's Plan
                  </h3>
                  <Link href="/dashboard/plan">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View all
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {mockData.todaysWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        workout.type === 'run' ? 'bg-blue-500' : 
                        workout.type === 'strength' ? 'bg-orange-500' : 'bg-gray-400'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {workout.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {workout.duration}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {workout.zone}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline" className="flex-shrink-0">
                        Start
                      </Button>
                    </div>
                  ))}
                  
                  {mockData.todaysWorkouts.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No workouts planned for today</p>
                    </div>
                  )}
                </div>
              </PremiumCard>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item}>
              <PremiumCard>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/diary?action=checkin">
                      <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Check-in</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/plan?action=add">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Add Workout</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/messages">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Message Coach</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/ai-coach">
                      <Bot className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">AI Coach</span>
                    </Link>
                  </Button>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Quote of the Day */}
            <motion.div variants={item}>
              <QuoteOfDay />
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Weekly Snapshot */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Weekly Snapshot
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-end gap-1 h-20 px-2">
                    {mockData.weeklyLoad.map((load, index) => {
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
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Daily training load • This week
                    </p>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Recent Insights */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Recent Insights
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {mockData.recentInsights.slice(0, 2).map((insight, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {insight.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {insight.timestamp}
                        </span>
                        <button className="text-xs text-primary hover:underline">
                          Why?
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>

            {/* Messages Preview */}
            <motion.div variants={item}>
              <PremiumCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Messages
                  </h3>
                  <Link href="/dashboard/messages">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View all
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                
                {mockData.lastMessage ? (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {mockData.lastMessage.from}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {mockData.lastMessage.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mockData.lastMessage.preview}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent messages</p>
                  </div>
                )}
              </PremiumCard>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}