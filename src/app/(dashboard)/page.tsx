'use client';

import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Target, Zap } from 'lucide-react';
import { FocusDayCard } from '@/components/dashboard/focus-day-card';
import { ReadinessScore } from '@/components/dashboard/readiness-score';
import { MentalReadinessRadar } from '@/components/dashboard/mental-readiness-radar';
import { InjuryRiskGauge } from '@/components/dashboard/injury-risk-gauge';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { WeeklyLoadChart } from '@/components/dashboard/weekly-load-chart';
import { TrainingHeatmapMini } from '@/components/dashboard/training-heatmap-mini';
import { AIInsightCard } from '@/components/dashboard/ai-insight-card';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const handleCheckIn = () => {
    // Navigate to check-in flow
    window.location.href = '/dashboard/diary?action=checkin';
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = "Bartek"; // In real app, get from user context
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Mock AI insights
  const aiInsights = [
    {
      type: 'performance' as const,
      title: 'Your running efficiency is improving',
      description: 'Your pace per heart rate has improved by 8% over the last month.',
      priority: 'high' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      type: 'recovery' as const,
      title: 'Consider a rest day tomorrow',
      description: 'Your HRV shows signs of accumulated fatigue. A recovery day would be optimal.',
      priority: 'medium' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    }
  ];

  return (
    <motion.div 
      className="p-4 md:p-6 space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Greeting Header */}
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{getGreeting()}</h1>
        <p className="text-muted-foreground">
          Ready to conquer {new Date().toLocaleDateString('en', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}?
        </p>
      </motion.div>

      {/* Row 1: Readiness Metrics */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Readiness Score - Large */}
        <div className="md:col-span-1">
          <ReadinessScore 
            className="h-full"
            size="large"
            onCheckIn={handleCheckIn}
          />
        </div>

        {/* Mental Readiness Radar */}
        <div className="hidden md:block">
          <MentalReadinessRadar className="h-full" />
        </div>

        {/* Injury Risk Gauge */}
        <div className="hidden xl:block">
          <InjuryRiskGauge className="h-full" />
        </div>
      </motion.div>

      {/* Row 2: Focus Day + Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Focus Day Card */}
        <div className="lg:col-span-2">
          <FocusDayCard className="h-full" />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions className="h-full" />
        </div>
      </motion.div>

      {/* Row 3: Weekly Load + Training Heatmap */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Weekly Load Chart */}
        <WeeklyLoadChart className="h-full" />

        {/* Training Heatmap Mini */}
        <TrainingHeatmapMini className="h-full" />
      </motion.div>

      {/* Row 4: AI Insights + Messages */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent AI Insights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <AIInsightCard 
                key={index} 
                insight={insight}
                compact 
              />
            ))}
          </div>
        </div>

        {/* Unread Messages */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Messages</h3>
            <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              3
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Coach Anna</p>
                <p className="text-xs text-muted-foreground truncate">Great job on yesterday's workout! Ready for...</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Training Group</p>
                <p className="text-xs text-muted-foreground truncate">Who's joining the long run tomorrow?</p>
                <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => window.location.href = '/dashboard/messages'}
            className="w-full mt-4 p-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors"
          >
            View all messages
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}