'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter,
  Users,
  TrendingUp,
  Trophy,
  Target,
  Activity,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityFeed } from '@/components/social/activity-feed';
import { cn } from '@/lib/utils';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Mock team stats data
const teamStats = {
  thisWeek: {
    totalActivities: 47,
    totalDistance: '1,247 km',
    totalTime: '89h 23m',
    avgActivities: 4.2,
    mostActiveDay: 'Wednesday'
  },
  leaderboards: {
    distance: [
      { name: 'Anna Kowalski', value: '125 km', change: '+12%' },
      { name: 'Tomek Nowak', value: '118 km', change: '+8%' },
      { name: 'You', value: '95 km', change: '+15%' },
      { name: 'Kasia Wiśniewska', value: '87 km', change: '+5%' },
      { name: 'Marcin Kowal', value: '72 km', change: '-3%' }
    ],
    activities: [
      { name: 'Tomek Nowak', value: '7 activities', change: '+2' },
      { name: 'Anna Kowalski', value: '6 activities', change: '+1' },
      { name: 'You', value: '5 activities', change: '+1' },
      { name: 'Kasia Wiśniewska', value: '4 activities', change: '0' },
      { name: 'Marcin Kowal', value: '3 activities', change: '-1' }
    ]
  },
  achievements: [
    {
      athlete: 'Anna Kowalski',
      achievement: 'New 10K PR',
      value: '42:15',
      improvement: '-2:30'
    },
    {
      athlete: 'Marcin Kowal',
      achievement: 'Squat PR',
      value: '140kg',
      improvement: '+5kg'
    },
    {
      athlete: 'Kasia Wiśniewska',
      achievement: '100km Week',
      value: '102km',
      improvement: 'First time!'
    }
  ]
};

interface TeamStatsCardProps {
  className?: string;
}

function TeamStatsCard({ className }: TeamStatsCardProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Weekly Team Summary */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Team Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-2xl font-bold text-foreground">
                {teamStats.thisWeek.totalActivities}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Distance</p>
              <p className="text-2xl font-bold text-foreground">
                {teamStats.thisWeek.totalDistance}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-lg font-semibold text-foreground">
                {teamStats.thisWeek.totalTime}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg per Person</p>
              <p className="text-lg font-semibold text-foreground">
                {teamStats.thisWeek.avgActivities} activities
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Most active day: <span className="text-foreground font-medium">{teamStats.thisWeek.mostActiveDay}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboards */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>This Week</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distance" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="distance">Distance</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="distance" className="space-y-3 mt-4">
              {teamStats.leaderboards.distance.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 ? "bg-yellow-500/20 text-yellow-600" :
                      index === 1 ? "bg-gray-500/20 text-gray-600" :
                      index === 2 ? "bg-orange-500/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      item.name === 'You' ? "text-primary" : "text-foreground"
                    )}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                    <p className={cn(
                      "text-xs",
                      item.change.startsWith('+') ? "text-green-500" : "text-red-500"
                    )}>
                      {item.change}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-3 mt-4">
              {teamStats.leaderboards.activities.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 ? "bg-yellow-500/20 text-yellow-600" :
                      index === 1 ? "bg-gray-500/20 text-gray-600" :
                      index === 2 ? "bg-orange-500/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      item.name === 'You' ? "text-primary" : "text-foreground"
                    )}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                    <p className={cn(
                      "text-xs",
                      item.change.startsWith('+') ? "text-green-500" : 
                      item.change === '0' ? "text-muted-foreground" : "text-red-500"
                    )}>
                      {item.change === '0' ? '—' : item.change}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teamStats.achievements.map((achievement, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {achievement.athlete}
                </span>
                <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20">
                  <Trophy className="w-3 h-3 mr-1" />
                  New PR
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {achievement.achievement}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-semibold text-foreground">
                    {achievement.value}
                  </span>
                  <span className="text-sm text-green-500">
                    {achievement.improvement}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'team' | 'following'>('all');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground">Activity Feed</h1>
              <p className="text-muted-foreground">
                See what your team and friends are up to
              </p>
            </div>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
          </div>

          {/* Filter Tabs */}
          <Tabs 
            value={activeFilter} 
            onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>My Team</span>
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Following</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
              {/* Activity Feed */}
              <div className="xl:col-span-3">
                <TabsContent value="all" className="mt-0">
                  <ActivityFeed />
                </TabsContent>
                
                <TabsContent value="team" className="mt-0">
                  <ActivityFeed />
                </TabsContent>
                
                <TabsContent value="following" className="mt-0">
                  <ActivityFeed />
                </TabsContent>
              </div>

              {/* Sidebar - Desktop Only */}
              <div className="hidden xl:block">
                <div className="sticky top-6">
                  <TeamStatsCard />
                </div>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}