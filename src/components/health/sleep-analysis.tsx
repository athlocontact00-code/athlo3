'use client';

import { motion } from 'framer-motion';
import { Moon, Sun, TrendingDown, TrendingUp, Minus, AlertTriangle } from 'lucide-react';

const sleepStages = [
  { name: 'Awake', percentage: 8, color: '#ef4444', time: '0h 24m' },
  { name: 'Light', percentage: 45, color: '#3b82f6', time: '2h 42m' },
  { name: 'Deep', percentage: 22, color: '#1d4ed8', time: '1h 19m' },
  { name: 'REM', percentage: 25, color: '#8b5cf6', time: '1h 30m' },
];

const weeklyData = [
  { day: 'Mon', hours: 7.2, quality: 82 },
  { day: 'Tue', hours: 6.5, quality: 68 },
  { day: 'Wed', hours: 7.8, quality: 88 },
  { day: 'Thu', hours: 6.1, quality: 55 },
  { day: 'Fri', hours: 7.5, quality: 85 },
  { day: 'Sat', hours: 8.2, quality: 92 },
  { day: 'Sun', hours: 7.0, quality: 78 },
];

const maxHours = 10;
const targetHours = 7.5;
const avgHours = (weeklyData.reduce((sum, d) => sum + d.hours, 0) / weeklyData.length).toFixed(1);
const sleepDebt = Math.max(0, targetHours * 7 - weeklyData.reduce((sum, d) => sum + d.hours, 0)).toFixed(1);

export function SleepAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Sleep Score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sleep Analysis</h3>
          <p className="text-sm text-muted-foreground">Last night · 5h 55m total</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-400">78</div>
          <div className="text-xs text-muted-foreground">Sleep Score</div>
        </div>
      </div>

      {/* Sleep Stages Bar */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Sleep Stages</p>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {sleepStages.map((stage) => (
            <motion.div
              key={stage.name}
              initial={{ width: 0 }}
              animate={{ width: `${stage.percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ backgroundColor: stage.color }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {stage.percentage >= 15 && (
                  <span className="text-[10px] font-medium text-white">{stage.percentage}%</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          {sleepStages.map((stage) => (
            <div key={stage.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="text-[10px] text-muted-foreground">{stage.name} · {stage.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time In Bed */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card/50 rounded-lg p-3 text-center">
          <Moon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-sm font-semibold text-foreground">22:45</div>
          <div className="text-[10px] text-muted-foreground">Bedtime</div>
        </div>
        <div className="bg-card/50 rounded-lg p-3 text-center">
          <Sun className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-sm font-semibold text-foreground">06:40</div>
          <div className="text-[10px] text-muted-foreground">Wake up</div>
        </div>
        <div className="bg-card/50 rounded-lg p-3 text-center">
          <Minus className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <div className="text-sm font-semibold text-foreground">5h 55m</div>
          <div className="text-[10px] text-muted-foreground">Actual sleep</div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">7-Day Sleep Trend</p>
          <p className="text-xs text-muted-foreground">Avg: {avgHours}h</p>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {weeklyData.map((day, i) => {
            const height = (day.hours / maxHours) * 100;
            const isToday = i === weeklyData.length - 1;
            const color = day.quality >= 80 ? 'bg-blue-500' : day.quality >= 60 ? 'bg-blue-400/60' : 'bg-blue-300/40';
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`w-full rounded-t ${color} ${isToday ? 'ring-1 ring-blue-400' : ''}`}
                />
                <span className={`text-[9px] ${isToday ? 'text-blue-400 font-semibold' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
        {/* Target line */}
        <div className="relative -mt-20 h-20 pointer-events-none">
          <div
            className="absolute w-full border-t border-dashed border-blue-400/30"
            style={{ bottom: `${(targetHours / maxHours) * 100}%` }}
          />
        </div>
      </div>

      {/* Sleep Debt */}
      {Number(sleepDebt) > 0 && (
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 rounded-lg p-3 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Sleep debt: {sleepDebt}h this week. You're averaging {avgHours}h — aim for {targetHours}h+</span>
        </div>
      )}
    </motion.div>
  );
}
