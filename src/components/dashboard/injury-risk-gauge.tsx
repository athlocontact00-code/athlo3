'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InjuryRiskGaugeProps {
  className?: string;
}

export function InjuryRiskGauge({ className }: InjuryRiskGaugeProps) {
  const riskScore = 23; // 0-100, lower is better
  const riskLevel = riskScore <= 25 ? 'low' : riskScore <= 50 ? 'medium' : riskScore <= 75 ? 'high' : 'very-high';
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#22c55e';
      case 'medium': return '#eab308';
      case 'high': return '#f97316';
      case 'very-high': return '#ef4444';
      default: return '#22c55e';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      case 'very-high': return 'Very High Risk';
      default: return 'Low Risk';
    }
  };

  // Calculate the arc path for the gauge
  const radius = 70;
  const centerX = 90;
  const centerY = 90;
  const startAngle = 225; // Start from bottom left
  const endAngle = 315; // End at bottom right
  const totalAngle = endAngle - startAngle;
  const scoreAngle = startAngle + (riskScore / 100) * totalAngle;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const backgroundPath = describeArc(centerX, centerY, radius, startAngle, endAngle);
  const scorePath = describeArc(centerX, centerY, radius, startAngle, scoreAngle);

  // Risk factors
  const riskFactors = [
    { label: 'Load Balance', status: 'good', score: 85 },
    { label: 'Recovery Time', status: 'warning', score: 65 },
    { label: 'Sleep Quality', status: 'good', score: 82 },
    { label: 'Nutrition', status: 'good', score: 90 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Injury Risk</h3>
      </div>

      <div className="relative">
        <svg width="180" height="120" viewBox="0 0 180 120" className="mx-auto">
          {/* Background arc */}
          <path
            d={backgroundPath}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted-foreground/20"
          />

          {/* Score arc */}
          <motion.path
            d={scorePath}
            stroke={getRiskColor(riskLevel)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold fill-current text-foreground"
          >
            {riskScore}%
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-current text-muted-foreground"
          >
            {getRiskText(riskLevel)}
          </text>
        </svg>
      </div>

      <div className="mt-4 space-y-2">
        {riskFactors.map((factor, index) => (
          <motion.div
            key={factor.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              {factor.status === 'good' ? (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ) : factor.status === 'warning' ? (
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
              <span className="text-muted-foreground">{factor.label}</span>
            </div>
            <span className={cn(
              "font-medium",
              factor.status === 'good' ? "text-green-500" :
              factor.status === 'warning' ? "text-yellow-500" :
              "text-red-500"
            )}>
              {factor.score}%
            </span>
          </motion.div>
        ))}
      </div>

      {riskLevel !== 'low' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2"
        >
          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="text-yellow-700 dark:text-yellow-300 font-medium">
              Consider increasing recovery
            </p>
            <p className="text-yellow-600 dark:text-yellow-400 mt-1">
              Your body might benefit from lighter training or additional rest.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}