'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Trophy, 
  Clock, 
  Target,
  Calendar,
  Activity,
  Bike,
  Waves,
  Dumbbell,
  TrendingUp,
  MapPin,
  Award,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const container = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Mock profile data
const profileData = {
  personal: {
    name: 'Bartosz Kantarowski',
    bio: 'Passionate triathlete and runner. Always chasing new PRs and enjoying the journey. Warsaw-based, training for IM 70.3.',
    location: 'Warsaw, Poland',
    joinDate: '2023-06-15',
    avatar: '/avatars/bartosz.jpg'
  },
  stats: {
    totalWorkouts: 847,
    totalHours: 1243,
    currentStreak: 12,
    longestStreak: 28,
    totalDistance: '5,247 km',
    averageWeekly: 8.5 // hours
  },
  sports: [
    { sport: 'run', name: 'Running', icon: Activity, level: 'Advanced', workouts: 423 },
    { sport: 'bike', name: 'Cycling', icon: Bike, level: 'Intermediate', workouts: 267 },
    { sport: 'swim', name: 'Swimming', icon: Waves, level: 'Beginner', workouts: 89 },
    { sport: 'strength', name: 'Strength', icon: Dumbbell, level: 'Intermediate', workouts: 68 }
  ],
  recentPRs: [
    {
      sport: 'run',
      event: '10K',
      value: '42:15',
      improvement: '1:05 faster',
      date: '2024-02-10'
    },
    {
      sport: 'bike',
      event: 'FTP',
      value: '265W',
      improvement: '+7W',
      date: '2024-02-12'
    },
    {
      sport: 'strength',
      event: 'Squat',
      value: '140kg',
      improvement: '+5kg',
      date: '2024-02-11'
    }
  ],
  trainingHeatmap: {
    // Mock data for training activity heatmap (365 days)
    // In a real app, this would be actual training data
    data: Array.from({ length: 365 }, (_, i) => ({
      date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 4) // 0-3 workouts per day
    }))
  }
};

interface SportBadgeProps {
  sport: typeof profileData.sports[0];
}

function SportBadge({ sport }: SportBadgeProps) {
  const Icon = sport.icon;
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'Intermediate': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'Advanced': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };
  
  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{sport.name}</h4>
            <Badge className={cn("text-xs mt-1", getLevelColor(sport.level))}>
              {sport.level}
            </Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {sport.workouts} workouts completed
        </div>
      </CardContent>
    </Card>
  );
}

interface TrainingHeatmapProps {
  data: Array<{ date: string; count: number }>;
}

function TrainingHeatmap({ data }: TrainingHeatmapProps) {
  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    if (count === 1) return 'bg-green-200 dark:bg-green-900/40';
    if (count === 2) return 'bg-green-400 dark:bg-green-700/60';
    return 'bg-green-600 dark:bg-green-500/80';
  };

  // Group data by weeks (simplified version)
  const weeks = [];
  for (let i = 0; i < Math.ceil(data.length / 7); i++) {
    weeks.push(data.slice(i * 7, (i + 1) * 7));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {new Date(data[0]?.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-muted-foreground">Today</span>
      </div>
      
      <div className="grid grid-cols-53 gap-1 max-w-full overflow-x-auto">
        {data.slice(-371).map((day, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-sm",
              getActivityColor(day.count)
            )}
            title={`${day.date}: ${day.count} workout${day.count !== 1 ? 's' : ''}`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-muted/30" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/60" />
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500/80" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'run': return Activity;
      case 'bike': return Bike;
      case 'swim': return Waves;
      case 'strength': return Dumbbell;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="max-w-6xl mx-auto p-4 md:p-6 space-y-8"
        variants={container}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-r from-card/90 to-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                  <AvatarImage src={profileData.personal.avatar} alt={profileData.personal.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {profileData.personal.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {profileData.personal.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profileData.personal.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {formatJoinDate(profileData.personal.joinDate)}</span>
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">
                      {profileData.personal.bio}
                    </p>
                  </div>
                </div>
                
                {/* Edit Button */}
                <div>
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={fadeInUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {profileData.stats.totalWorkouts}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Workouts
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {profileData.stats.totalHours}h
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Hours
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-foreground mb-1">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span>{profileData.stats.currentStreak}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Day Streak
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {profileData.stats.totalDistance}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Distance
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Sport Badges */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span>Sports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  {profileData.sports.map(sport => (
                    <SportBadge key={sport.sport} sport={sport} />
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent PRs */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Recent PRs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.recentPRs.map((pr, index) => {
                    const SportIcon = getSportIcon(pr.sport);
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <SportIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">{pr.event}</span>
                            <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20 text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              PR
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{pr.value}</span>
                            <span>•</span>
                            <span className="text-green-500">{pr.improvement}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(pr.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Training Heatmap */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span>Training Activity</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your workout consistency over the past year
                  </p>
                </CardHeader>
                <CardContent>
                  <TrainingHeatmap data={profileData.trainingHeatmap.data} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Average Progress */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Training Volume</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Weekly Average</span>
                    <span className="text-lg font-bold text-foreground">
                      {profileData.stats.averageWeekly}h
                    </span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: 10h/week</span>
                    <span>75% of goal</span>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Best Week:</span>
                        <span className="ml-2 font-medium text-foreground">14.5h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Longest Streak:</span>
                        <span className="ml-2 font-medium text-foreground">{profileData.stats.longestStreak} days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}