'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PeriodData {
  label: string;
  startDate: string;
  endDate: string;
  metrics: {
    volume: number;
    intensity: number;
    compliance: number;
    fitness: number;
  };
}

interface ComparisonMetric {
  name: string;
  current: number;
  previous: number;
  unit: string;
  format?: 'number' | 'percentage' | 'time';
}

// Mock data for two 4-week periods
const mockPeriods: PeriodData[] = [
  {
    label: 'Current 4 Weeks',
    startDate: '2024-01-15',
    endDate: '2024-02-11',
    metrics: {
      volume: 280, // minutes
      intensity: 75, // percentage
      compliance: 92, // percentage
      fitness: 68, // TSS/day average
    },
  },
  {
    label: 'Previous 4 Weeks',
    startDate: '2023-12-18',
    endDate: '2024-01-14',
    metrics: {
      volume: 245,
      intensity: 68,
      compliance: 85,
      fitness: 62,
    },
  },
];

export function SeasonComparison() {
  const [selectedPeriods, setSelectedPeriods] = useState<[number, number]>([0, 1]);
  
  const currentPeriod = mockPeriods[selectedPeriods[0]];
  const comparisonPeriod = mockPeriods[selectedPeriods[1]];
  
  const comparisonMetrics: ComparisonMetric[] = [
    {
      name: 'Training Volume',
      current: currentPeriod.metrics.volume,
      previous: comparisonPeriod.metrics.volume,
      unit: 'hours',
      format: 'time',
    },
    {
      name: 'Avg Intensity',
      current: currentPeriod.metrics.intensity,
      previous: comparisonPeriod.metrics.intensity,
      unit: '%',
      format: 'percentage',
    },
    {
      name: 'Plan Compliance',
      current: currentPeriod.metrics.compliance,
      previous: comparisonPeriod.metrics.compliance,
      unit: '%',
      format: 'percentage',
    },
    {
      name: 'Fitness (CTL)',
      current: currentPeriod.metrics.fitness,
      previous: comparisonPeriod.metrics.fitness,
      unit: 'TSS',
      format: 'number',
    },
  ];
  
  function calculateDifference(current: number, previous: number): {
    percentage: number;
    direction: 'up' | 'down' | 'same';
  } {
    const diff = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(diff),
      direction: diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'same',
    };
  }
  
  function formatValue(value: number, format?: string): string {
    switch (format) {
      case 'time':
        return `${(value / 60).toFixed(1)}`;
      case 'percentage':
        return `${value}`;
      case 'number':
      default:
        return value.toString();
    }
  }
  
  function renderTrendIcon(direction: 'up' | 'down' | 'same') {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'same':
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  }
  
  function getTrendColor(direction: 'up' | 'down' | 'same') {
    switch (direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'same':
        return 'text-gray-500';
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Season Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare training metrics across different periods
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Select Periods
        </Button>
      </div>

      {/* Period Labels */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-red-950/20 border border-red-600/30">
          <h4 className="font-medium text-red-400">{currentPeriod.label}</h4>
          <p className="text-xs text-muted-foreground">
            {new Date(currentPeriod.startDate).toLocaleDateString()} - {new Date(currentPeriod.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-600/30">
          <h4 className="font-medium text-gray-300">{comparisonPeriod.label}</h4>
          <p className="text-xs text-muted-foreground">
            {new Date(comparisonPeriod.startDate).toLocaleDateString()} - {new Date(comparisonPeriod.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="space-y-4">
        {comparisonMetrics.map((metric, index) => {
          const diff = calculateDifference(metric.current, metric.previous);
          
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{metric.name}</span>
                <div className="flex items-center gap-2">
                  {renderTrendIcon(diff.direction)}
                  <span className={getTrendColor(diff.direction)}>
                    {diff.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bars */}
              <div className="grid grid-cols-2 gap-4">
                {/* Current Period */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Current</span>
                    <span>{formatValue(metric.current, metric.format)}{metric.unit}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-gray-800 rounded-full" />
                    <motion.div
                      className="absolute top-0 left-0 h-2 bg-red-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((metric.current / Math.max(metric.current, metric.previous)) * 100, 100)}%` 
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                
                {/* Previous Period */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Previous</span>
                    <span>{formatValue(metric.previous, metric.format)}{metric.unit}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-gray-800 rounded-full" />
                    <motion.div
                      className="absolute top-0 left-0 h-2 bg-gray-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((metric.previous / Math.max(metric.current, metric.previous)) * 100, 100)}%` 
                      }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-600/30">
            Improving
          </Badge>
          <Badge variant="outline" className="bg-yellow-950/30 text-yellow-400 border-yellow-600/30">
            Stable
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Overall progress shows improvement in most metrics. Continue current training approach while monitoring compliance.
        </p>
      </div>
    </Card>
  );
}