'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { PremiumCard } from '@/components/common/premium-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

// Mock athlete data
const mockAthletes = [
  {
    id: 1,
    name: 'Alex Morgan',
    email: 'alex.m@email.com',
    sport: 'Running',
    readinessScore: 42,
    status: 'needs-attention',
    lastCheckIn: '2 days ago',
    upcomingWorkout: 'Easy Run - 30 min',
    weeklyCompliance: 60,
    avatar: 'AM'
  },
  {
    id: 2,
    name: 'Sara Kim',
    email: 'sara.k@email.com',
    sport: 'Triathlon',
    readinessScore: 85,
    status: 'good',
    lastCheckIn: '1 hour ago',
    upcomingWorkout: 'Bike Intervals - 75 min',
    weeklyCompliance: 95,
    avatar: 'SK'
  },
  {
    id: 3,
    name: 'Tom Rodriguez',
    email: 'tom.r@email.com',
    sport: 'Running',
    readinessScore: 76,
    status: 'moderate',
    lastCheckIn: '6 hours ago',
    upcomingWorkout: 'Tempo Run - 45 min',
    weeklyCompliance: 88,
    avatar: 'TR'
  },
  {
    id: 4,
    name: 'Emma Lin',
    email: 'emma.l@email.com',
    sport: 'Cycling',
    readinessScore: 92,
    status: 'excellent',
    lastCheckIn: '30 min ago',
    upcomingWorkout: 'Recovery Ride - 60 min',
    weeklyCompliance: 100,
    avatar: 'EL'
  },
];

function AthleteCard({ athlete }: { athlete: typeof mockAthletes[0] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'good': return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'moderate': return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
      case 'needs-attention': return 'bg-red-500/20 text-red-500 border-red-500/20';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <PremiumCard className="hover:shadow-lg transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {athlete.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{athlete.name}</h3>
              <p className="text-sm text-muted-foreground">{athlete.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {athlete.sport}
              </Badge>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getReadinessColor(athlete.readinessScore)}`}>
              {athlete.readinessScore}
            </div>
            <div className="text-xs text-muted-foreground">Readiness</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {athlete.weeklyCompliance}%
            </div>
            <div className="text-xs text-muted-foreground">Compliance</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last check-in:</span>
            <span className="text-foreground">{athlete.lastCheckIn}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next workout:</span>
            <span className="text-foreground text-right flex-1 ml-2 truncate">
              {athlete.upcomingWorkout}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href="/messages">
              <MessageSquare className="h-3 w-3 mr-1" />
              Message
            </Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link href="/plan">
              <Calendar className="h-3 w-3 mr-1" />
              Assign Plan
            </Link>
          </Button>
        </div>
      </div>
    </PremiumCard>
  );
}

export default function AthletesPage() {
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
            <h1 className="text-2xl font-bold text-foreground">Your Athletes</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your team's progress
            </p>
          </div>
          <Button asChild>
            <Link href="/athletes/invite">
              <Plus className="h-4 w-4 mr-2" />
              Invite Athlete
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={item} className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search athletes..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PremiumCard>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">8</div>
            <div className="text-sm text-muted-foreground">Total Athletes</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">6</div>
            <div className="text-sm text-muted-foreground">Active Today</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-500 mb-1">2</div>
            <div className="text-sm text-muted-foreground">Need Attention</div>
          </div>
        </PremiumCard>
        
        <PremiumCard>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">87%</div>
            <div className="text-sm text-muted-foreground">Avg Compliance</div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Athletes Grid */}
      <motion.div 
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mockAthletes.map((athlete) => (
          <motion.div key={athlete.id} variants={item}>
            <AthleteCard athlete={athlete} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State (when no athletes) */}
      {mockAthletes.length === 0 && (
        <motion.div variants={item} className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No athletes yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Start building your team by inviting your first athlete
          </p>
          <Button asChild>
            <Link href="/athletes/invite">
              <Plus className="h-4 w-4 mr-2" />
              Invite Your First Athlete
            </Link>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}