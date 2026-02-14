'use client';

import { motion } from 'framer-motion';
import { Target, Calendar, TrendingUp, Flag } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  type: 'race' | 'volume' | 'consistency';
  target: string;
  current: number;
  max: number;
  deadline?: string;
  daysLeft?: number;
  status: 'on-track' | 'behind' | 'at-risk';
}

const goals: Goal[] = [
  {
    id: '1',
    name: 'Warsaw Half Marathon',
    type: 'race',
    target: 'March 23, 2025',
    current: 72,
    max: 100,
    daysLeft: 37,
    status: 'on-track',
  },
  {
    id: '2',
    name: 'Monthly Volume',
    type: 'volume',
    target: '200 km',
    current: 142,
    max: 200,
    status: 'on-track',
  },
  {
    id: '3',
    name: 'Weekly Consistency',
    type: 'consistency',
    target: '5 workouts/week',
    current: 3,
    max: 5,
    status: 'behind',
  },
];

const statusColors = {
  'on-track': { bg: 'bg-green-500', text: 'text-green-400', label: 'On track' },
  'behind': { bg: 'bg-amber-500', text: 'text-amber-400', label: 'Behind' },
  'at-risk': { bg: 'bg-red-500', text: 'text-red-400', label: 'At risk' },
};

const typeIcons = {
  race: Flag,
  volume: TrendingUp,
  consistency: Calendar,
};

export function GoalTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Season Goals</h3>
      </div>

      {goals.map((goal, i) => {
        const Icon = typeIcons[goal.type];
        const status = statusColors[goal.status];
        const progress = (goal.current / goal.max) * 100;

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/50 border border-border/30 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{goal.name}</span>
              </div>
              <span className={`text-[10px] font-medium ${status.text}`}>{status.label}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-border/30 rounded-full overflow-hidden mb-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${status.bg}`}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{goal.current}/{goal.max} · {goal.target}</span>
              {goal.daysLeft && <span>{goal.daysLeft} days left</span>}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
