'use client';

import { motion } from 'framer-motion';
import { 
  Share2, 
  Download, 
  Calendar, 
  Clock, 
  Target, 
  Heart, 
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WeeklyStats {
  workoutsDone: number;
  workoutsPlanned: number;
  hoursTrained: number;
  hoursPlanned: number;
  compliancePercentage: number;
  avgReadiness: number;
  achievements: string[];
  loadTrend: 'increasing' | 'stable' | 'decreasing';
  readinessTrend: 'improving' | 'stable' | 'declining';
}

// Mock data for the week
const mockWeeklyStats: WeeklyStats = {
  workoutsDone: 5,
  workoutsPlanned: 6,
  hoursTrained: 6.2,
  hoursPlanned: 7.5,
  compliancePercentage: 83,
  avgReadiness: 7.2,
  achievements: [
    'Completed first 10K of the season',
    'Hit all tempo runs this week',
    'Maintained consistent sleep schedule'
  ],
  loadTrend: 'increasing',
  readinessTrend: 'stable',
};

const weekPeriod = {
  start: '2024-02-05',
  end: '2024-02-11',
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'red' | 'green' | 'yellow' | 'blue';
}

function StatCard({ icon: Icon, label, value, subtitle, trend, color = 'red' }: StatCardProps) {
  const colorClasses = {
    red: 'bg-red-950/20 border-red-600/30 text-red-400',
    green: 'bg-green-950/20 border-green-600/30 text-green-400',
    yellow: 'bg-yellow-950/20 border-yellow-600/30 text-yellow-400',
    blue: 'bg-blue-950/20 border-blue-600/30 text-blue-400',
  };

  const trendIcons = {
    up: <TrendingUp className="w-3 h-3 text-green-500" />,
    down: <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />,
    stable: <div className="w-3 h-0.5 bg-gray-500 rounded" />,
  };

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        {trend && (
          <div className="flex items-center gap-1">
            {trendIcons[trend]}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-80">{label}</div>
        {subtitle && (
          <div className="text-xs opacity-60">{subtitle}</div>
        )}
      </div>
    </div>
  );
}

export function WeeklyDigest() {
  const complianceColor = mockWeeklyStats.compliancePercentage >= 90 
    ? 'green' 
    : mockWeeklyStats.compliancePercentage >= 70 
      ? 'yellow' 
      : 'red';

  const readinessColor = mockWeeklyStats.avgReadiness >= 7 
    ? 'green' 
    : mockWeeklyStats.avgReadiness >= 5 
      ? 'yellow' 
      : 'red';

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Weekly Digest</h3>
          <p className="text-sm text-muted-foreground">
            Week of {new Date(weekPeriod.start).toLocaleDateString()} - {new Date(weekPeriod.end).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Training Summary Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Training Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={Calendar}
            label="Workouts Done"
            value={`${mockWeeklyStats.workoutsDone}/${mockWeeklyStats.workoutsPlanned}`}
            subtitle="sessions"
            color="red"
          />
          <StatCard
            icon={Clock}
            label="Hours Trained"
            value={mockWeeklyStats.hoursTrained.toString()}
            subtitle={`of ${mockWeeklyStats.hoursPlanned}h planned`}
            color="blue"
          />
          <StatCard
            icon={Target}
            label="Compliance"
            value={`${mockWeeklyStats.compliancePercentage}%`}
            subtitle="plan adherence"
            trend="up"
            color={complianceColor}
          />
          <StatCard
            icon={Heart}
            label="Avg Readiness"
            value={`${mockWeeklyStats.avgReadiness}/10`}
            subtitle="daily check-ins"
            trend="stable"
            color={readinessColor}
          />
        </div>
      </div>

      {/* Load Trend */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Load Trend</h4>
        <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Training Load Progression</span>
            <Badge 
              variant="outline" 
              className={cn(
                mockWeeklyStats.loadTrend === 'increasing' 
                  ? 'bg-green-950/30 text-green-400 border-green-600/30'
                  : mockWeeklyStats.loadTrend === 'stable'
                    ? 'bg-yellow-950/30 text-yellow-400 border-yellow-600/30'
                    : 'bg-red-950/30 text-red-400 border-red-600/30'
              )}
            >
              {mockWeeklyStats.loadTrend}
            </Badge>
          </div>
          
          {/* Simple visualization using CSS bars */}
          <div className="flex items-end gap-2 h-16">
            {[45, 52, 48, 58, 62, 55, 68].map((value, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-red-600/80 rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: `${(value / 70) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Readiness */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Readiness</h4>
        <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Recovery Status</span>
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                readinessColor === 'green' ? 'bg-green-500' : 
                readinessColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              )} />
              <span className="text-sm">
                {readinessColor === 'green' ? 'Good' : 
                 readinessColor === 'yellow' ? 'Fair' : 'Poor'}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {mockWeeklyStats.readinessTrend === 'improving' 
              ? 'Your recovery is trending positively. Continue current routine.'
              : mockWeeklyStats.readinessTrend === 'stable'
                ? 'Recovery remains consistent. Monitor for changes.'
                : 'Recovery shows signs of decline. Consider additional rest.'
            }
          </p>
        </div>
      </div>

      {/* Achievements */}
      {mockWeeklyStats.achievements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Achievements
          </h4>
          <div className="space-y-2">
            {mockWeeklyStats.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-950/10 border border-green-600/20"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span className="text-sm">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>
            Generated on {new Date().toLocaleDateString()} • 
            Next digest: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}