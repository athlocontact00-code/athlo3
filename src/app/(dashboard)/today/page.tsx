'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, 
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Activity,
  Battery,
  Heart,
  Target,
  TrendingUp,
  Zap,
  Clock,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuoteOfDay } from '@/components/dashboard/quote-of-day';
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

// Mock data - in real app would come from APIs
const mockData = {
  readinessScore: 82,
  readinessColor: 'green' as 'green' | 'yellow' | 'red',
  readinessStatus: "You're well recovered and ready for high intensity training.",
  checkInCompleted: false,
  weather: {
    condition: 'sunny',
    temp: 18,
    description: 'Perfect running weather'
  },
  preTrainingChecklist: [
    { id: 1, item: 'Energy Level', value: 8, status: 'good' as 'good' | 'moderate' | 'poor' },
    { id: 2, item: 'Sleep Quality', value: 7, status: 'good' as 'good' | 'moderate' | 'poor' },
    { id: 3, item: 'Motivation', value: 9, status: 'good' as 'good' | 'moderate' | 'poor' },
    { id: 4, item: 'Soreness/Pain', value: 2, status: 'good' as 'good' | 'moderate' | 'poor' }
  ],
  todaysWorkouts: [
    {
      id: 1,
      name: 'Tempo Run',
      description: '8km at threshold pace with 2km warm-up/cool-down',
      duration: '50 min',
      intensity: 'High',
      type: 'run',
      completed: false,
      scheduledTime: '07:00',
      estimatedLoad: 85
    },
    {
      id: 2,
      name: 'Core Stability',
      description: 'Functional core workout focusing on running stability',
      duration: '20 min',
      intensity: 'Low',
      type: 'strength',
      completed: false,
      scheduledTime: '19:00',
      estimatedLoad: 25
    }
  ],
  coachMessage: {
    from: 'Coach Anna',
    message: "Great recovery scores this week! Today's tempo run will help dial in your race pace. Focus on controlled breathing and smooth turnover.",
    timestamp: '6:45 AM'
  },
  aiInsight: {
    title: 'Optimal Training Window',
    message: "Based on your HRV and sleep data, your peak performance window is 7:00-9:00 AM. Consider scheduling high-intensity work during this time.",
    confidence: 'high'
  }
};

interface WorkoutCardProps {
  workout: typeof mockData.todaysWorkouts[0];
  expanded: boolean;
  onToggle: () => void;
}

function WorkoutCard({ workout, expanded, onToggle }: WorkoutCardProps) {
  const intensityColor = {
    'High': 'text-red-500 bg-red-500/10',
    'Moderate': 'text-yellow-500 bg-yellow-500/10',
    'Low': 'text-green-500 bg-green-500/10'
  }[workout.intensity];

  const typeIcon = workout.type === 'run' ? Activity : Target;
  const TypeIcon = typeIcon;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground">{workout.name}</h3>
                <Badge className={cn("text-xs", intensityColor)}>
                  {workout.intensity}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{workout.duration}</span>
                </span>
                <span>{workout.scheduledTime}</span>
                <span>Load: {workout.estimatedLoad}</span>
              </div>
              
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/30"
                >
                  <p>{workout.description}</p>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
            
            <Button size="sm" className="min-w-16">
              Start
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TodayPage() {
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const aiRecommendation = `Based on your readiness checklist: ${
    mockData.preTrainingChecklist.every(item => item.status === 'good') 
      ? "All systems go! You're primed for a great session."
      : mockData.preTrainingChecklist.some(item => item.status === 'poor')
      ? "Consider light activity today. Your body is asking for recovery."
      : "Good overall state. Listen to your body during the workout."
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <motion.div 
        className="max-w-4xl mx-auto p-4 md:p-6 space-y-6"
        variants={container}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div 
          variants={fadeInUp}
          className="text-center space-y-2 py-4"
        >
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <p className="text-lg text-muted-foreground">
              {formatDate(currentTime)}
            </p>
            <div className="flex items-center space-x-1 text-primary">
              <Sun className="w-5 h-5" />
              <span className="text-sm font-medium">
                {mockData.weather.temp}°C
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {mockData.weather.description}
          </p>
        </motion.div>

        {/* Readiness Score - Hero */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-r from-card/90 to-card/60 backdrop-blur-sm border-border/50 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium text-muted-foreground mb-2">
                    Today's Readiness
                  </h2>
                  <div className={cn(
                    "text-7xl font-bold font-mono mb-2",
                    getReadinessColor(mockData.readinessScore)
                  )}>
                    {mockData.readinessScore}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    out of 100
                  </p>
                </div>
                
                <Progress 
                  value={mockData.readinessScore} 
                  className="w-full h-3"
                />
                
                <p className="text-sm text-foreground/90 max-w-md mx-auto leading-relaxed">
                  {mockData.readinessStatus}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quote of the Day */}
        <motion.div variants={fadeInUp}>
          <QuoteOfDay />
        </motion.div>

        {/* Pre-Training Checklist */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Pre-Training Check</span>
                </h3>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {mockData.preTrainingChecklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        item.status === 'good' ? 'bg-green-500' :
                        item.status === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                      )} />
                      <span className="text-sm font-medium text-foreground">
                        {item.item}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">
                        {item.value}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* AI Recommendation */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-primary/10 rounded">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      AI Recommendation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {aiRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Workouts */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Today's Training</span>
                </h3>
                <Link href="/dashboard/plan">
                  <Button variant="outline" size="sm">
                    View Plan
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockData.todaysWorkouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    expanded={expandedWorkout === workout.id}
                    onToggle={() => setExpandedWorkout(
                      expandedWorkout === workout.id ? null : workout.id
                    )}
                  />
                ))}
              </div>
              
              {mockData.todaysWorkouts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No workouts planned for today</p>
                  <p className="text-sm">Perfect day for active recovery</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Check-in Status */}
        <motion.div variants={fadeInUp}>
          <Card className={cn(
            "border-border/50 transition-all duration-300",
            mockData.checkInCompleted 
              ? "bg-green-500/10 border-green-500/20" 
              : "bg-card/80 backdrop-blur-sm hover:bg-card/90"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    mockData.checkInCompleted ? "bg-green-500/20" : "bg-muted/50"
                  )}>
                    {mockData.checkInCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {mockData.checkInCompleted ? "Morning Check-in Complete" : "Morning Check-in"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {mockData.checkInCompleted 
                        ? "Thanks for sharing how you're feeling today"
                        : "Let us know how you're feeling today"
                      }
                    </p>
                  </div>
                </div>
                
                {!mockData.checkInCompleted && (
                  <Link href="/dashboard/diary?action=checkin">
                    <Button size="sm">
                      Check In
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coach Message & AI Insight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coach Message */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Message from {mockData.coachMessage.from}</span>
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {mockData.coachMessage.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {mockData.coachMessage.message}
                </p>
                
                <Link href="/dashboard/messages">
                  <Button variant="outline" size="sm" className="w-full">
                    Reply
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insight */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-1 bg-primary/20 rounded">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground">
                    {mockData.aiInsight.title}
                  </h4>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {mockData.aiInsight.confidence} confidence
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {mockData.aiInsight.message}
                </p>
                
                <Link href="/dashboard/ai-coach">
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}