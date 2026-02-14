'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Moon, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

// Mock data - in real app would come from APIs/devices
const mockData = {
  recovery: {
    score: 78,
    status: 'good' as 'optimal' | 'good' | 'moderate' | 'poor',
    trend: 'up' as 'up' | 'down' | 'stable',
    change: '+5%'
  },
  strain: {
    score: 14.2,
    status: 'moderate' as 'optimal' | 'good' | 'moderate' | 'poor',
    trend: 'down' as 'up' | 'down' | 'stable',
    change: '-2.1',
    target: 16.5
  },
  sleep: {
    score: 85,
    status: 'optimal' as 'optimal' | 'good' | 'moderate' | 'poor',
    trend: 'up' as 'up' | 'down' | 'stable',
    change: '+12%',
    hoursLastNight: 8.2,
    efficiency: 87,
    debt: -0.5 // negative means ahead, positive means behind
  },
  hrv: {
    current: 45,
    baseline: 42,
    trend: [38, 41, 39, 45, 42, 46, 45], // Last 7 days
    status: 'good' as 'optimal' | 'good' | 'moderate' | 'poor'
  },
  restingHR: {
    current: 52,
    baseline: 54,
    trend: [55, 54, 56, 52, 53, 51, 52], // Last 7 days
    status: 'optimal' as 'optimal' | 'good' | 'moderate' | 'poor'
  },
  weeklyRecovery: [65, 72, 68, 78, 82, 75, 78] // 7 days of recovery scores
};

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  status: 'optimal' | 'good' | 'moderate' | 'poor';
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
  subtitle?: string;
}

function Gauge({ value, max, label, status, icon: Icon, trend, change, subtitle }: GaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const statusConfig = {
    optimal: { color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500/20' },
    good: { color: 'text-green-400', bg: 'bg-green-400', border: 'border-green-400/20' },
    moderate: { color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-500/20' },
    poor: { color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/20' }
  }[status];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className={cn("bg-card/80 backdrop-blur-sm border", statusConfig.border)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={cn("p-2 rounded-lg", `${statusConfig.bg}/10`)}>
              <Icon className={cn("w-5 h-5", statusConfig.color)} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{label}</h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          
          {trend && change && (
            <div className="flex items-center space-x-1 text-sm">
              <TrendIcon className={cn("w-4 h-4", statusConfig.color)} />
              <span className={statusConfig.color}>{change}</span>
            </div>
          )}
        </div>
        
        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-muted stroke-current"
              strokeDasharray="100, 100"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className={cn("stroke-current", statusConfig.color)}
              strokeDasharray={`${percentage}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          
          {/* Center value */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn("text-2xl font-bold font-mono", statusConfig.color)}>
                {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}
              </div>
              <div className="text-xs text-muted-foreground">
                {label === 'Strain' ? '/21' : label === 'Recovery' || label === 'Sleep' ? '/100' : ''}
              </div>
            </div>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="text-center">
          <Badge 
            className={cn(
              "text-xs capitalize border",
              statusConfig.color,
              statusConfig.border,
              `${statusConfig.bg}/10`
            )}
          >
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface SparklineProps {
  data: number[];
  color: string;
  label: string;
  currentValue: number;
  baselineValue?: number;
  unit?: string;
}

function Sparkline({ data, color, label, currentValue, baselineValue, unit = '' }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-foreground">{label}</h4>
            <div className="flex items-center space-x-2">
              <span className={cn("text-xl font-bold font-mono", color)}>
                {currentValue}{unit}
              </span>
              {baselineValue && (
                <span className="text-sm text-muted-foreground">
                  (avg: {baselineValue}{unit})
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* 7-day sparkline */}
        <div className="flex items-end justify-between h-12 space-x-1">
          {data.map((value, index) => {
            const height = ((value - min) / range) * 100;
            const isToday = index === data.length - 1;
            
            return (
              <div
                key={index}
                className={cn(
                  "flex-1 rounded-sm transition-all duration-300",
                  isToday ? color.replace('text-', 'bg-') : "bg-muted hover:bg-muted/80"
                )}
                style={{ 
                  height: `${Math.max(height, 8)}%`,
                  minHeight: '2px'
                }}
                title={`Day ${index + 1}: ${value}${unit}`}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatusPage() {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="max-w-7xl mx-auto p-4 md:p-6 space-y-6"
        variants={container}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Status</h1>
          <p className="text-muted-foreground">
            Your current physiological state and recovery metrics
          </p>
        </motion.div>

        {/* Main Gauges */}
        <motion.div variants={fadeInUp}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Gauge
              value={mockData.recovery.score}
              max={100}
              label="Recovery"
              status={mockData.recovery.status}
              icon={Heart}
              trend={mockData.recovery.trend}
              change={mockData.recovery.change}
              subtitle="How ready you are"
            />
            
            <Gauge
              value={mockData.strain.score}
              max={21}
              label="Strain"
              status={mockData.strain.status}
              icon={Activity}
              trend={mockData.strain.trend}
              change={mockData.strain.change}
              subtitle="Today's training load"
            />
            
            <Gauge
              value={mockData.sleep.score}
              max={100}
              label="Sleep"
              status={mockData.sleep.status}
              icon={Moon}
              trend={mockData.sleep.trend}
              change={mockData.sleep.change}
              subtitle={`${mockData.sleep.hoursLastNight}h last night`}
            />
          </div>
        </motion.div>

        {/* Detailed Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HRV & Resting HR Trends */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <Sparkline
              data={mockData.hrv.trend}
              color="text-blue-500"
              label="Heart Rate Variability"
              currentValue={mockData.hrv.current}
              baselineValue={mockData.hrv.baseline}
              unit="ms"
            />
            
            <Sparkline
              data={mockData.restingHR.trend}
              color="text-purple-500"
              label="Resting Heart Rate"
              currentValue={mockData.restingHR.current}
              baselineValue={mockData.restingHR.baseline}
              unit="bpm"
            />
          </motion.div>

          {/* Sleep Details & Weekly Recovery */}
          <motion.div variants={fadeInUp} className="space-y-4">
            {/* Sleep Details */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Moon className="w-5 h-5 text-primary" />
                  <span>Sleep Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-lg font-semibold text-foreground">
                      {mockData.sleep.hoursLastNight}h
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-lg font-semibold text-foreground">
                      {mockData.sleep.efficiency}%
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Sleep Debt</p>
                    <Badge 
                      className={cn(
                        "text-xs",
                        mockData.sleep.debt <= 0 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}
                    >
                      {mockData.sleep.debt <= 0 
                        ? `+${Math.abs(mockData.sleep.debt)}h ahead` 
                        : `${mockData.sleep.debt}h behind`
                      }
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 + (mockData.sleep.debt * 10))} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Weekly Recovery Chart */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Weekly Recovery Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-20 space-x-1 mb-4">
                  {mockData.weeklyRecovery.map((recovery, index) => {
                    const isToday = index === mockData.weeklyRecovery.length - 1;
                    const height = (recovery / 100) * 100;
                    
                    return (
                      <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                        <div
                          className={cn(
                            "w-full rounded-sm transition-all duration-300",
                            isToday ? "bg-primary" : "bg-muted hover:bg-muted/80"
                          )}
                          style={{ 
                            height: `${height}%`,
                            minHeight: '4px'
                          }}
                          title={`${recovery}% recovery`}
                        />
                        <span className={cn(
                          "text-xs",
                          isToday ? "text-primary font-medium" : "text-muted-foreground"
                        )}>
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Average: {Math.round(mockData.weeklyRecovery.reduce((a, b) => a + b) / mockData.weeklyRecovery.length)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* How This Is Calculated */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full justify-between p-0 h-auto text-left"
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    How this is calculated
                  </span>
                </div>
                {showExplanation ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
              
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-border/30 space-y-4 text-sm text-muted-foreground"
                >
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Recovery Score</h4>
                    <p>
                      Combines heart rate variability (HRV), resting heart rate, sleep performance, and 
                      subjective wellness data to determine how well your body has recovered from previous training.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Strain Score</h4>
                    <p>
                      Measures cardiovascular load on a scale of 0-21 based on heart rate intensity and duration. 
                      Higher strain indicates more demanding training sessions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Sleep Score</h4>
                    <p>
                      Evaluates sleep duration, efficiency, and consistency. Considers both sleep architecture 
                      and how well your sleep aligns with your recovery needs.
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}