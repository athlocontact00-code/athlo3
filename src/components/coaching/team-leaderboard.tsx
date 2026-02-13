'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AthleteStats {
  id: string;
  name: string;
  avatar?: string;
  team: string;
  sport: string;
  volume: number; // hours or distance
  compliance: number; // percentage
  streak: number; // days
  trend: 'up' | 'down' | 'stable';
  isCurrentUser?: boolean;
}

// Mock data
const mockAthletes: AthleteStats[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    team: 'Elite Squad',
    sport: 'Running',
    volume: 28.5,
    compliance: 96,
    streak: 14,
    trend: 'up',
  },
  {
    id: '2',
    name: 'Mike Chen',
    team: 'Elite Squad', 
    sport: 'Running',
    volume: 26.2,
    compliance: 89,
    streak: 21,
    trend: 'up',
    isCurrentUser: true,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    team: 'Development',
    sport: 'Cycling',
    volume: 25.8,
    compliance: 92,
    streak: 7,
    trend: 'stable',
  },
  {
    id: '4',
    name: 'James Rodriguez',
    team: 'Elite Squad',
    sport: 'Triathlon',
    volume: 24.1,
    compliance: 85,
    streak: 28,
    trend: 'down',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    team: 'Development',
    sport: 'Swimming',
    volume: 22.3,
    compliance: 88,
    streak: 9,
    trend: 'stable',
  },
  {
    id: '6',
    name: 'David Kim',
    team: 'Elite Squad',
    sport: 'Running',
    volume: 21.7,
    compliance: 91,
    streak: 12,
    trend: 'up',
  },
  {
    id: '7',
    name: 'Sophie Clark',
    team: 'Development',
    sport: 'Cycling',
    volume: 20.4,
    compliance: 87,
    streak: 5,
    trend: 'down',
  },
  {
    id: '8',
    name: 'Alex Morgan',
    team: 'Elite Squad',
    sport: 'Running',
    volume: 19.8,
    compliance: 83,
    streak: 16,
    trend: 'stable',
  },
];

type LeaderboardType = 'volume' | 'compliance' | 'streaks';
type TimePeriod = 'week' | 'month' | 'all';

interface PodiumProps {
  athletes: AthleteStats[];
  type: LeaderboardType;
}

function Podium({ athletes, type }: PodiumProps) {
  const top3 = athletes.slice(0, 3);
  
  const getValue = (athlete: AthleteStats) => {
    switch (type) {
      case 'volume':
        return `${athlete.volume}h`;
      case 'compliance':
        return `${athlete.compliance}%`;
      case 'streaks':
        return `${athlete.streak} days`;
    }
  };
  
  const podiumHeights = {
    0: 'h-24', // 1st place
    1: 'h-20', // 2nd place  
    2: 'h-16', // 3rd place
  };
  
  const podiumColors = {
    0: 'bg-gradient-to-t from-yellow-600/20 to-yellow-500/10 border-yellow-500/30',
    1: 'bg-gradient-to-t from-gray-600/20 to-gray-500/10 border-gray-500/30',
    2: 'bg-gradient-to-t from-amber-600/20 to-amber-500/10 border-amber-500/30',
  };
  
  const icons = {
    0: Trophy,
    1: Medal,
    2: Award,
  };
  
  return (
    <div className="flex items-end justify-center gap-4 mb-8">
      {/* 2nd Place */}
      {top3[1] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <div className={cn(
            'w-20 flex flex-col items-center justify-end p-4 rounded-t-lg border',
            podiumHeights[1],
            podiumColors[1]
          )}>
            <Avatar className="w-12 h-12 mb-2">
              <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
                {top3[1].name.split(' ').map(n => n[0]).join('')}
              </div>
            </Avatar>
            {React.createElement(icons[1], { className: "w-5 h-5 text-gray-400 mb-1" })}
          </div>
          <div className="mt-2">
            <div className="font-medium text-sm">{top3[1].name.split(' ')[0]}</div>
            <div className="text-xs text-muted-foreground">{getValue(top3[1])}</div>
          </div>
        </motion.div>
      )}
      
      {/* 1st Place */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className={cn(
          'w-20 flex flex-col items-center justify-end p-4 rounded-t-lg border',
          podiumHeights[0],
          podiumColors[0]
        )}>
          <Avatar className="w-12 h-12 mb-2">
            <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
              {top3[0].name.split(' ').map(n => n[0]).join('')}
            </div>
          </Avatar>
          {React.createElement(icons[0], { className: "w-5 h-5 text-yellow-500 mb-1" })}
        </div>
        <div className="mt-2">
          <div className="font-medium text-sm">{top3[0].name.split(' ')[0]}</div>
          <div className="text-xs text-muted-foreground">{getValue(top3[0])}</div>
        </div>
      </motion.div>
      
      {/* 3rd Place */}
      {top3[2] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className={cn(
            'w-20 flex flex-col items-center justify-end p-4 rounded-t-lg border',
            podiumHeights[2],
            podiumColors[2]
          )}>
            <Avatar className="w-12 h-12 mb-2">
              <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
                {top3[2].name.split(' ').map(n => n[0]).join('')}
              </div>
            </Avatar>
            {React.createElement(icons[2], { className: "w-5 h-5 text-amber-500 mb-1" })}
          </div>
          <div className="mt-2">
            <div className="font-medium text-sm">{top3[2].name.split(' ')[0]}</div>
            <div className="text-xs text-muted-foreground">{getValue(top3[2])}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface LeaderboardListProps {
  athletes: AthleteStats[];
  type: LeaderboardType;
}

function LeaderboardList({ athletes, type }: LeaderboardListProps) {
  const getValue = (athlete: AthleteStats) => {
    switch (type) {
      case 'volume':
        return athlete.volume;
      case 'compliance':
        return athlete.compliance;
      case 'streaks':
        return athlete.streak;
    }
  };
  
  const getValueString = (athlete: AthleteStats) => {
    switch (type) {
      case 'volume':
        return `${athlete.volume} hours`;
      case 'compliance':
        return `${athlete.compliance}%`;
      case 'streaks':
        return `${athlete.streak} days`;
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-1 bg-gray-500 rounded" />;
    }
  };
  
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-500" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300">
            {position}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {athletes.map((athlete, index) => {
        const position = index + 1;
        
        return (
          <motion.div
            key={athlete.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn(
              'flex items-center justify-between p-4 rounded-lg border transition-colors',
              athlete.isCurrentUser 
                ? 'bg-red-950/20 border-red-600/30' 
                : 'bg-gray-900/30 border-gray-700/50 hover:bg-gray-800/50'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {getPositionIcon(position)}
              </div>
              
              <Avatar className="w-10 h-10">
                <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
                  {athlete.name.split(' ').map(n => n[0]).join('')}
                </div>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{athlete.name}</span>
                  {athlete.isCurrentUser && (
                    <Badge variant="outline" className="bg-red-950/30 text-red-400 border-red-600/30 text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {athlete.team} • {athlete.sport}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium">{getValueString(athlete)}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getTrendIcon(athlete.trend)}
                  <span className="capitalize">{athlete.trend}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function TeamLeaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('volume');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  
  const getSortedAthletes = (type: LeaderboardType): AthleteStats[] => {
    return [...mockAthletes].sort((a, b) => {
      switch (type) {
        case 'volume':
          return b.volume - a.volume;
        case 'compliance':
          return b.compliance - a.compliance;
        case 'streaks':
          return b.streak - a.streak;
        default:
          return 0;
      }
    });
  };
  
  const sortedAthletes = getSortedAthletes(activeTab);
  
  const getTabTitle = (type: LeaderboardType) => {
    switch (type) {
      case 'volume':
        return 'Training Volume';
      case 'compliance':
        return 'Plan Compliance';
      case 'streaks':
        return 'Training Streaks';
    }
  };
  
  const getTimePeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'all':
        return 'All Time';
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Team Leaderboard</h3>
          <p className="text-sm text-muted-foreground">
            Performance rankings across your team
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as TimePeriod[]).map(period => (
            <Button
              key={period}
              variant={timePeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod(period)}
              className={cn(
                "gap-2",
                timePeriod === period && "bg-red-600 hover:bg-red-700"
              )}
            >
              <Calendar className="w-4 h-4" />
              {getTimePeriodLabel(period)}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-1 bg-gray-900/50 p-1 rounded-lg">
          {(['volume', 'compliance', 'streaks'] as LeaderboardType[]).map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1",
                activeTab === tab && "bg-red-600 hover:bg-red-700"
              )}
            >
              {getTabTitle(tab)}
            </Button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <Podium athletes={sortedAthletes} type={activeTab} />

      {/* Full Rankings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-muted-foreground">Full Rankings</h4>
          <span className="text-xs text-muted-foreground">
            {sortedAthletes.length} athletes
          </span>
        </div>
        
        <LeaderboardList athletes={sortedAthletes} type={activeTab} />
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          Rankings updated daily • {getTimePeriodLabel(timePeriod)} period
        </p>
      </div>
    </Card>
  );
}