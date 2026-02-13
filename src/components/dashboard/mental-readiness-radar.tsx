'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MentalReadinessRadarProps {
  className?: string;
}

export function MentalReadinessRadar({ className }: MentalReadinessRadarProps) {
  // Mock data for mental readiness dimensions
  const dimensions = [
    { label: 'Focus', value: 85, angle: 0 },
    { label: 'Motivation', value: 92, angle: 60 },
    { label: 'Stress', value: 25, angle: 120 }, // Lower is better for stress
    { label: 'Energy', value: 78, angle: 180 },
    { label: 'Confidence', value: 88, angle: 240 },
    { label: 'Sleep Quality', value: 82, angle: 300 }
  ];

  const centerX = 100;
  const centerY = 100;
  const maxRadius = 80;

  const getPoint = (value: number, angle: number) => {
    const radius = (value / 100) * maxRadius;
    const radian = (angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(radian);
    const y = centerY + radius * Math.sin(radian);
    return { x, y };
  };

  const pathData = dimensions
    .map((dim, index) => {
      const point = getPoint(dim.value, dim.angle);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ') + ' Z';

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
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Mental Readiness</h3>
      </div>

      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
          {/* Background circles */}
          {[20, 40, 60, 80].map((radius, index) => (
            <circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
          ))}

          {/* Axis lines */}
          {dimensions.map((dim, index) => {
            const point = getPoint(100, dim.angle);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground/30"
              />
            );
          })}

          {/* Data area */}
          <motion.path
            d={pathData}
            fill="rgb(220, 38, 38, 0.2)"
            stroke="rgb(220, 38, 38)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Data points */}
          {dimensions.map((dim, index) => {
            const point = getPoint(dim.value, dim.angle);
            return (
              <motion.circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#dc2626"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              />
            );
          })}

          {/* Labels */}
          {dimensions.map((dim, index) => {
            const labelPoint = getPoint(120, dim.angle);
            return (
              <text
                key={index}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-current text-foreground font-medium"
              >
                {dim.label}
              </text>
            );
          })}
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">78</div>
            <div className="text-xs text-muted-foreground">Overall</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Your mental state is <span className="text-primary font-medium">excellent</span> for training
        </p>
      </div>
    </motion.div>
  );
}