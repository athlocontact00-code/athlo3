'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Target,
  Clock,
  Award,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { PremiumCard } from '@/components/common/premium-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0
  }
};

// Mock analytics data
const mockData = {
  teamOverview: {
    totalAthletes: 8,
    activeToday: 6,
    weeklyCompliance: 87,
    avgReadiness: 78,
    totalWorkouts: 42,
    completionRate: 91
  },
  weeklyStats: [
    { day: 'Mon', completed: 7, planned: 8, compliance: 88 },
    { day: 'Tue', completed: 6, planned: 7, compliance: 86 },
    { day: 'Wed', completed: 8, planned: 8, compliance: 100 },
    { day: 'Thu', completed: 5, planned: 7, compliance: 71 },
    { day: 'Fri', completed: 7, planned: 8, compliance: 88 },
    { day: 'Sat', completed: 6, planned: 6, compliance: 100 },
    { day: 'Sun', completed: 3, planned: 4, compliance: 75 }
  ],
  topPerformers: [
    { name: 'Emma Lin', readiness: 92, compliance: 100, improvement: '+5%' },
    { name: 'Tom Rodriguez', readiness: 89, compliance: 95, improvement: '+3%' },
    { name: 'Sara Kim', readiness: 85, compliance: 90, improvement: '+8%' },
  ],
  alerts: [
    { type: 'warning', athlete: 'Alex Morgan', message: 'Low readiness for 3 consecutive days', urgency: 'high' },
    { type: 'info', athlete: 'Sara Kim', message: 'Missed check-in yesterday', urgency: 'medium' },
  ]
};

export default function AnalyticsPage() {
  return (
    <motion.div 
      className="p-4 md:p-6 max-w-7xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Track your team's performance and progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <PremiumCard>
          <div className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockData.teamOverview.totalAthletes}
            </div>
            <div className="text-xs text-muted-foreground">Total Athletes</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500 mb-1">
              {mockData.teamOverview.activeToday}
            </div>
            <div className="text-xs text-muted-foreground">Active Today</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockData.teamOverview.weeklyCompliance}%
            </div>
            <div className="text-xs text-muted-foreground">Weekly Compliance</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockData.teamOverview.avgReadiness}
            </div>
            <div className="text-xs text-muted-foreground">Avg Readiness</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockData.teamOverview.totalWorkouts}
            </div>
            <div className="text-xs text-muted-foreground">Total Workouts</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockData.teamOverview.completionRate}%
            </div>
            <div className="text-xs text-muted-foreground">Completion Rate</div>
          </div>
        </PremiumCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Compliance Chart */}
          <motion.div variants={item}>
            <PremiumCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Weekly Compliance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Workout completion rate by day
                    </p>
                  </div>
                  <Badge variant="secondary">This Week</Badge>
                </div>
                
                <div className="space-y-4">
                  {mockData.weeklyStats.map((day, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-foreground">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">
                            {day.completed}/{day.planned} workouts
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {day.compliance}%
                          </span>
                        </div>
                        <Progress value={day.compliance} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PremiumCard>
          </motion.div>

          {/* Team Alerts */}
          <motion.div variants={item}>
            <PremiumCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Team Alerts
                </h3>
                
                <div className="space-y-3">
                  {mockData.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      alert.urgency === 'high' 
                        ? 'bg-red-500/10 border-red-500/20' 
                        : 'bg-amber-500/10 border-amber-500/20'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {alert.athlete}
                            </span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                alert.urgency === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                              }`}
                            >
                              {alert.urgency}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/athletes">View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Top Performers */}
          <motion.div variants={item}>
            <PremiumCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Performers
                </h3>
                
                <div className="space-y-4">
                  {mockData.topPerformers.map((athlete, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {athlete.name}
                          </p>
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-500">
                            {athlete.improvement}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>Readiness: {athlete.readiness}</div>
                          <div>Compliance: {athlete.compliance}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PremiumCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <PremiumCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/athletes">
                      <Users className="h-4 w-4 mr-2" />
                      View All Athletes
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/plan">
                      <Target className="h-4 w-4 mr-2" />
                      Create Team Plan
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/messages">
                      <Activity className="h-4 w-4 mr-2" />
                      Send Team Message
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/calendar">
                      <Calendar className="h-4 w-4 mr-2" />
                      Team Calendar
                    </Link>
                  </Button>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}