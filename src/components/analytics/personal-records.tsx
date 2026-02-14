'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Calendar,
  Activity,
  Bike,
  Waves,
  Dumbbell,
  Clock,
  Zap,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Types
interface PersonalRecord {
  id: string;
  category: 'running' | 'cycling' | 'swimming' | 'strength';
  event: string;
  value: string;
  unit: string;
  date: string;
  previousValue?: string;
  improvement?: string;
  isNew?: boolean;
  context?: string; // Additional context like "Half Marathon" or "Bench Press"
}

// Mock PR data
const personalRecords: PersonalRecord[] = [
  // Running PRs
  {
    id: 'run_1k',
    category: 'running',
    event: '1K',
    value: '3:42',
    unit: 'min:sec',
    date: '2024-02-10',
    previousValue: '3:48',
    improvement: '6s faster',
    isNew: true,
    context: 'Track workout'
  },
  {
    id: 'run_5k',
    category: 'running',
    event: '5K',
    value: '19:45',
    unit: 'min:sec',
    date: '2024-02-05',
    previousValue: '20:12',
    improvement: '27s faster',
    context: 'Parkrun'
  },
  {
    id: 'run_10k',
    category: 'running',
    event: '10K',
    value: '42:15',
    unit: 'min:sec',
    date: '2024-01-28',
    previousValue: '43:20',
    improvement: '1:05 faster',
    context: 'Race'
  },
  {
    id: 'run_half',
    category: 'running',
    event: 'Half Marathon',
    value: '1:35:22',
    unit: 'h:min:sec',
    date: '2024-01-15',
    previousValue: '1:38:45',
    improvement: '3:23 faster',
    context: 'Warsaw Half Marathon'
  },
  {
    id: 'run_marathon',
    category: 'running',
    event: 'Marathon',
    value: '3:28:17',
    unit: 'h:min:sec',
    date: '2023-10-08',
    context: 'Warsaw Marathon'
  },

  // Cycling PRs
  {
    id: 'bike_5min',
    category: 'cycling',
    event: '5 min Power',
    value: '285',
    unit: 'W',
    date: '2024-02-12',
    previousValue: '278',
    improvement: '7W higher',
    isNew: true,
    context: 'FTP Test'
  },
  {
    id: 'bike_20min',
    category: 'cycling',
    event: '20 min Power',
    value: '265',
    unit: 'W',
    date: '2024-02-12',
    previousValue: '258',
    improvement: '7W higher',
    context: 'FTP Test'
  },
  {
    id: 'bike_1hr',
    category: 'cycling',
    event: '1 hr Power',
    value: '245',
    unit: 'W',
    date: '2024-01-20',
    previousValue: '238',
    improvement: '7W higher',
    context: 'Zone 2 Ride'
  },

  // Swimming PRs
  {
    id: 'swim_100m',
    category: 'swimming',
    event: '100m Freestyle',
    value: '1:32',
    unit: 'min:sec',
    date: '2024-02-08',
    previousValue: '1:35',
    improvement: '3s faster',
    context: 'Pool session'
  },
  {
    id: 'swim_400m',
    category: 'swimming',
    event: '400m Freestyle',
    value: '6:45',
    unit: 'min:sec',
    date: '2024-01-25',
    previousValue: '7:02',
    improvement: '17s faster',
    context: 'Time trial'
  },
  {
    id: 'swim_1500m',
    category: 'swimming',
    event: '1500m Freestyle',
    value: '28:30',
    unit: 'min:sec',
    date: '2024-01-10',
    context: 'Open water'
  },

  // Strength PRs
  {
    id: 'squat',
    category: 'strength',
    event: 'Squat',
    value: '140',
    unit: 'kg',
    date: '2024-02-11',
    previousValue: '135',
    improvement: '5kg heavier',
    isNew: true,
    context: '3x5 rep scheme'
  },
  {
    id: 'deadlift',
    category: 'strength',
    event: 'Deadlift',
    value: '180',
    unit: 'kg',
    date: '2024-02-09',
    previousValue: '175',
    improvement: '5kg heavier',
    isNew: true,
    context: '1 rep max'
  },
  {
    id: 'bench',
    category: 'strength',
    event: 'Bench Press',
    value: '95',
    unit: 'kg',
    date: '2024-01-30',
    previousValue: '92.5',
    improvement: '2.5kg heavier',
    context: '3x5 rep scheme'
  }
];

const getCategoryIcon = (category: PersonalRecord['category']) => {
  switch (category) {
    case 'running': return Activity;
    case 'cycling': return Bike;
    case 'swimming': return Waves;
    case 'strength': return Dumbbell;
    default: return Trophy;
  }
};

const getCategoryColor = (category: PersonalRecord['category']) => {
  switch (category) {
    case 'running': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'cycling': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'swimming': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
    case 'strength': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const getTimeSince = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

interface PRCardProps {
  pr: PersonalRecord;
}

function PRCard({ pr }: PRCardProps) {
  const CategoryIcon = getCategoryIcon(pr.category);
  const categoryColor = getCategoryColor(pr.category);

  return (
    <Card className={cn(
      "bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300 relative overflow-hidden",
      pr.isNew && "ring-2 ring-yellow-500/50"
    )}>
      {pr.isNew && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-2 right-2"
        >
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
            <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
            New PR!
          </Badge>
        </motion.div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg", categoryColor)}>
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{pr.event}</h3>
              {pr.context && (
                <p className="text-sm text-muted-foreground">{pr.context}</p>
              )}
            </div>
          </div>
        </div>

        {/* PR Value */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-foreground font-mono">
              {pr.value}
            </span>
            <span className="text-sm text-muted-foreground">
              {pr.unit}
            </span>
          </div>
          
          {pr.improvement && (
            <div className="flex items-center space-x-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">
                {pr.improvement}
              </span>
            </div>
          )}
        </div>

        {/* Date & Previous Value */}
        <div className="space-y-2 pt-4 border-t border-border/30">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(pr.date)}</span>
            <span>•</span>
            <span>{getTimeSince(pr.date)}</span>
          </div>
          
          {pr.previousValue && (
            <div className="text-sm text-muted-foreground">
              Previous: {pr.previousValue} {pr.unit}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface PersonalRecordsProps {
  className?: string;
  category?: PersonalRecord['category'];
  limit?: number;
}

export function PersonalRecords({ className, category, limit }: PersonalRecordsProps) {
  const [selectedCategory, setSelectedCategory] = useState<PersonalRecord['category'] | 'all'>(
    category || 'all'
  );

  const filteredRecords = personalRecords.filter(pr => 
    selectedCategory === 'all' || pr.category === selectedCategory
  );

  const displayedRecords = limit ? filteredRecords.slice(0, limit) : filteredRecords;

  const categories: Array<{ key: PersonalRecord['category'] | 'all', label: string, icon: any }> = [
    { key: 'all', label: 'All Sports', icon: Trophy },
    { key: 'running', label: 'Running', icon: Activity },
    { key: 'cycling', label: 'Cycling', icon: Bike },
    { key: 'swimming', label: 'Swimming', icon: Waves },
    { key: 'strength', label: 'Strength', icon: Dumbbell }
  ];

  const newPRCount = personalRecords.filter(pr => pr.isNew).length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span>Personal Records</span>
          </h2>
          <p className="text-muted-foreground">
            Your best performances across all sports
          </p>
          {newPRCount > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              {newPRCount} new PR{newPRCount > 1 ? 's' : ''} this week!
            </Badge>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <Tabs 
        value={selectedCategory} 
        onValueChange={(value) => setSelectedCategory(value as typeof selectedCategory)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(({ key, label, icon: Icon }) => (
            <TabsTrigger key={key} value={key} className="flex items-center space-x-1">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(({ key }) => (
          <TabsContent key={key} value={key} className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {displayedRecords
                .filter(pr => key === 'all' || pr.category === key)
                .map((pr, index) => (
                  <motion.div
                    key={pr.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PRCard pr={pr} />
                  </motion.div>
                ))}
            </motion.div>
            
            {displayedRecords.filter(pr => key === 'all' || pr.category === key).length === 0 && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No records yet
                  </h3>
                  <p className="text-muted-foreground">
                    Complete workouts to start tracking your personal records
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {!limit && (
        <div className="text-center pt-6">
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Set New Goals
          </Button>
        </div>
      )}
    </div>
  );
}