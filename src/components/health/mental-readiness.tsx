'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MentalReadinessData {
  motivation: number;
  stress: number; // inverted for display
  mood: number;
  sleepQuality: number;
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  weeklyHistory: {
    date: string;
    score: number;
  }[];
  baseline: number;
}

// Mock data
const mockData: MentalReadinessData = {
  motivation: 7.5,
  stress: 3.2, // Lower is better (inverted)
  mood: 8.1,
  sleepQuality: 6.8,
  overallScore: 7.4,
  trend: 'improving',
  baseline: 7.0,
  weeklyHistory: [
    { date: '2024-02-05', score: 6.8 },
    { date: '2024-02-06', score: 7.1 },
    { date: '2024-02-07', score: 6.9 },
    { date: '2024-02-08', score: 7.3 },
    { date: '2024-02-09', score: 7.6 },
    { date: '2024-02-10', score: 7.8 },
    { date: '2024-02-11', score: 7.4 },
  ],
};

interface RadarAxisProps {
  label: string;
  value: number;
  maxValue: number;
  angle: number;
  color?: string;
}

function RadarAxis({ label, value, maxValue, angle, color = '#dc2626' }: RadarAxisProps) {
  const radius = 80;
  const valueRadius = (value / maxValue) * radius;
  
  // Calculate positions
  const labelX = Math.cos(angle) * (radius + 20);
  const labelY = Math.sin(angle) * (radius + 20);
  const valueX = Math.cos(angle) * valueRadius;
  const valueY = Math.sin(angle) * valueRadius;
  
  return (
    <g>
      {/* Axis line */}
      <line
        x1="0"
        y1="0"
        x2={Math.cos(angle) * radius}
        y2={Math.sin(angle) * radius}
        stroke="#374151"
        strokeWidth="1"
        opacity="0.3"
      />
      
      {/* Value point */}
      <motion.circle
        cx={valueX}
        cy={valueY}
        r="4"
        fill={color}
        initial={{ r: 0 }}
        animate={{ r: 4 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      
      {/* Label */}
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs fill-gray-300"
      >
        {label}
      </text>
      
      {/* Value label */}
      <text
        x={valueX}
        y={valueY - 12}
        textAnchor="middle"
        className="text-xs fill-red-400 font-medium"
      >
        {value.toFixed(1)}
      </text>
    </g>
  );
}

function SimpleRadarChart({ data }: { data: MentalReadinessData }) {
  const axes = [
    { label: 'Motivation', value: data.motivation, angle: -Math.PI / 2 }, // Top
    { label: 'Mood', value: data.mood, angle: 0 }, // Right
    { label: 'Sleep', value: data.sleepQuality, angle: Math.PI / 2 }, // Bottom
    { label: 'Stress', value: 10 - data.stress, angle: Math.PI }, // Left (inverted)
  ];
  
  const maxValue = 10;
  const centerX = 100;
  const centerY = 100;
  
  // Create polygon points for the data
  const polygonPoints = axes.map(axis => {
    const radius = (axis.value / maxValue) * 80;
    const x = centerX + Math.cos(axis.angle) * radius;
    const y = centerY + Math.sin(axis.angle) * radius;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="flex justify-center">
      <svg width="200" height="200" className="overflow-visible">
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Concentric circles */}
          {[20, 40, 60, 80].map((radius, index) => (
            <circle
              key={radius}
              cx="0"
              cy="0"
              r={radius}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              opacity={0.2}
            />
          ))}
          
          {/* Data polygon */}
          <motion.polygon
            points={polygonPoints.split(' ').map((point, index) => {
              const [x, y] = point.split(',').map(Number);
              return `${x - centerX},${y - centerY}`;
            }).join(' ')}
            fill="#dc2626"
            fillOpacity="0.1"
            stroke="#dc2626"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          
          {/* Axes */}
          {axes.map((axis, index) => (
            <RadarAxis
              key={axis.label}
              label={axis.label}
              value={axis.value}
              maxValue={maxValue}
              angle={axis.angle}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function MiniSparkline({ data }: { data: { date: string; score: number }[] }) {
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const range = maxScore - minScore || 1;
  
  return (
    <div className="flex items-end gap-1 h-8">
      {data.map((point, index) => {
        const height = ((point.score - minScore) / range) * 24 + 4;
        return (
          <motion.div
            key={point.date}
            className="w-1 bg-red-600 rounded-t-sm"
            style={{ height: `${height}px` }}
            initial={{ height: 0 }}
            animate={{ height: `${height}px` }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          />
        );
      })}
    </div>
  );
}

export function MentalReadiness() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-green-950/30 text-green-400 border-green-600/30';
    if (score >= 6) return 'bg-yellow-950/30 text-yellow-400 border-yellow-600/30';
    return 'bg-red-950/30 text-red-400 border-red-600/30';
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-1 bg-gray-500 rounded" />;
    }
  };
  
  const getLowestMetric = () => {
    const metrics = [
      { name: 'Motivation', value: mockData.motivation },
      { name: 'Stress', value: 10 - mockData.stress }, // Inverted
      { name: 'Mood', value: mockData.mood },
      { name: 'Sleep Quality', value: mockData.sleepQuality },
    ];
    
    return metrics.reduce((lowest, current) => 
      current.value < lowest.value ? current : lowest
    );
  };
  
  const getImprovementTips = (lowestMetric: string) => {
    const tips = {
      'Motivation': [
        'Set smaller, achievable goals',
        'Review your "why" for training',
        'Find a training partner or join a group',
      ],
      'Stress': [
        'Practice 5-minute daily meditation',
        'Try progressive muscle relaxation',
        'Consider reducing training load temporarily',
      ],
      'Mood': [
        'Spend time outdoors in natural light',
        'Connect with friends and family',
        'Consider talking to a counselor',
      ],
      'Sleep Quality': [
        'Maintain consistent sleep/wake times',
        'Avoid screens 1 hour before bed',
        'Keep bedroom cool and dark',
      ],
    };
    
    return tips[lowestMetric as keyof typeof tips] || tips['Motivation'];
  };
  
  const lowestMetric = getLowestMetric();
  const improvementTips = getImprovementTips(lowestMetric.name);

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Mental Readiness</h3>
          <p className="text-sm text-muted-foreground">
            Psychological state and recovery assessment
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon(mockData.trend)}
          <Badge 
            variant="outline" 
            className={getScoreBadgeColor(mockData.overallScore)}
          >
            {mockData.trend}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="space-y-4">
          <div className="text-center">
            <div className={cn('text-3xl font-bold', getScoreColor(mockData.overallScore))}>
              {mockData.overallScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Overall Mental Score</div>
          </div>
          
          <SimpleRadarChart data={mockData} />
          
          <div className="text-xs text-center text-muted-foreground">
            Scale: 1-10 (higher is better)
          </div>
        </div>

        {/* Details and Trends */}
        <div className="space-y-4">
          {/* 7-day trend */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">7-Day Trend</span>
              <span className="text-xs text-muted-foreground">
                {mockData.weeklyHistory[0].date} - {mockData.weeklyHistory[mockData.weeklyHistory.length - 1].date}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MiniSparkline data={mockData.weeklyHistory} />
              <div className="text-sm">
                <div className={getScoreColor(mockData.overallScore)}>
                  {mockData.overallScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
            </div>
          </div>

          {/* Baseline comparison */}
          <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">vs Baseline</span>
              <span className={cn(
                'text-sm font-medium',
                mockData.overallScore > mockData.baseline ? 'text-green-400' : 
                mockData.overallScore < mockData.baseline ? 'text-red-400' : 'text-gray-400'
              )}>
                {mockData.overallScore > mockData.baseline ? '+' : ''}
                {(mockData.overallScore - mockData.baseline).toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="h-2 bg-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(mockData.overallScore / 10) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor</span>
              <span>Baseline: {mockData.baseline}</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Improvement tips */}
          <div className="p-3 rounded-lg bg-blue-950/10 border border-blue-600/20">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Focus Area: {lowestMetric.name}</span>
            </div>
            <ul className="space-y-1">
              {improvementTips.map((tip, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}