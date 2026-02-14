'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TimeRange = '30d' | '90d' | '1yr' | 'all';
type Sport = 'cycling' | 'running';

interface PerformanceData {
  duration: number; // seconds
  value: number; // watts for cycling, seconds/km for running
  date: string;
}

interface Props {
  sport: Sport;
  className?: string;
}

// Mock data - replace with real data
const generateMockData = (sport: Sport, timeRange: TimeRange): PerformanceData[] => {
  const durations = [1, 5, 10, 15, 30, 60, 120, 300, 600, 1200, 1800, 3600, 7200, 18000]; // 1s to 5h
  const now = new Date();
  
  return durations.map(duration => {
    const baseValue = sport === 'cycling' 
      ? Math.max(150, 400 - Math.log(duration) * 30) // Power curve
      : Math.max(180, 200 + Math.log(duration) * 10); // Pace curve (slower = higher seconds/km)
    
    return {
      duration,
      value: baseValue + Math.random() * 50,
      date: new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

export function PerformanceCurve({ sport, className = '' }: Props) {
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: PerformanceData } | null>(null);

  const data = useMemo(() => ({
    current: generateMockData(sport, timeRange),
    previous: generateMockData(sport, timeRange),
    allTime: generateMockData(sport, 'all'),
  }), [sport, timeRange]);

  const chartDimensions = {
    width: 800,
    height: 400,
    padding: { top: 20, right: 40, bottom: 60, left: 80 }
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;

  // Scale functions
  const xScale = (duration: number) => {
    const logDuration = Math.log(duration);
    const minLog = Math.log(1);
    const maxLog = Math.log(18000);
    return (logDuration - minLog) / (maxLog - minLog) * chartWidth;
  };

  const yScale = (value: number) => {
    const maxValue = Math.max(...data.current.map(d => d.value), ...data.allTime.map(d => d.value));
    const minValue = Math.min(...data.current.map(d => d.value), ...data.allTime.map(d => d.value));
    return chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  };

  // Generate smooth curve path
  const generateCurvePath = (points: PerformanceData[]) => {
    if (points.length < 2) return '';
    
    const pathPoints = points.map(p => ({ x: xScale(p.duration), y: yScale(p.value) }));
    
    let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    
    for (let i = 1; i < pathPoints.length; i++) {
      const prevPoint = pathPoints[i - 1];
      const currentPoint = pathPoints[i];
      const nextPoint = pathPoints[i + 1];
      
      const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3;
      const cp1y = prevPoint.y;
      const cp2x = currentPoint.x - (nextPoint ? (nextPoint.x - currentPoint.x) * 0.3 : 0);
      const cp2y = currentPoint.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return path;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const formatValue = (value: number) => {
    return sport === 'cycling' ? `${Math.round(value)}W` : `${Math.floor(value / 60)}:${String(Math.round(value % 60)).padStart(2, '0')}/km`;
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '30d', label: '30d' },
    { value: '90d', label: '90d' },
    { value: '1yr', label: '1yr' },
    { value: 'all', label: 'All' }
  ];

  return (
    <Card className={`${className} bg-zinc-950 border-zinc-800`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">
            {sport === 'cycling' ? 'Power Duration Curve' : 'Pace Duration Curve'}
          </CardTitle>
          <div className="flex gap-2">
            {timeRanges.map(({ value, label }) => (
              <Button
                key={value}
                variant={timeRange === value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(value)}
                className={
                  timeRange === value
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            width={chartDimensions.width}
            height={chartDimensions.height}
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <g className="grid" transform={`translate(${chartDimensions.padding.left}, ${chartDimensions.padding.top})`}>
              {/* Vertical grid lines */}
              {[1, 5, 10, 30, 60, 300, 1200, 3600].map(duration => (
                <line
                  key={`vgrid-${duration}`}
                  x1={xScale(duration)}
                  y1={0}
                  x2={xScale(duration)}
                  y2={chartHeight}
                  stroke="#374151"
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              ))}
              
              {/* Horizontal grid lines */}
              {Array.from({ length: 6 }, (_, i) => i * (chartHeight / 5)).map((y, i) => (
                <line
                  key={`hgrid-${i}`}
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#374151"
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              ))}
            </g>

            {/* Chart data */}
            <g transform={`translate(${chartDimensions.padding.left}, ${chartDimensions.padding.top})`}>
              {/* All-time curve (gray) */}
              <path
                d={generateCurvePath(data.allTime)}
                fill="none"
                stroke="#6b7280"
                strokeWidth={2}
                opacity={0.4}
              />

              {/* Previous period curve (darker gray) */}
              <path
                d={generateCurvePath(data.previous)}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={2}
                opacity={0.6}
              />

              {/* Current period curve (red) */}
              <path
                d={generateCurvePath(data.current)}
                fill="none"
                stroke="#dc2626"
                strokeWidth={3}
              />

              {/* Fill area under current curve */}
              <path
                d={`${generateCurvePath(data.current)} L ${xScale(data.current[data.current.length - 1].duration)} ${chartHeight} L ${xScale(data.current[0].duration)} ${chartHeight} Z`}
                fill="url(#redGradient)"
              />

              {/* Interactive points */}
              {data.current.map((point, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <circle
                        cx={xScale(point.duration)}
                        cy={yScale(point.value)}
                        r={4}
                        fill="#dc2626"
                        stroke="white"
                        strokeWidth={2}
                        className="cursor-pointer hover:r-6 transition-all duration-200"
                        onMouseEnter={() => setHoveredPoint({
                          x: xScale(point.duration),
                          y: yScale(point.value),
                          data: point
                        })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-white">
                      <div className="space-y-1">
                        <p className="font-semibold">{formatDuration(point.duration)}</p>
                        <p>{formatValue(point.value)}</p>
                        <p className="text-sm text-zinc-400">
                          {new Date(point.date).toLocaleDateString()}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </g>

            {/* X-axis labels */}
            <g transform={`translate(${chartDimensions.padding.left}, ${chartDimensions.height - chartDimensions.padding.bottom + 20})`}>
              {[1, 5, 10, 30, 60, 300, 1200, 3600].map(duration => (
                <text
                  key={`xlabel-${duration}`}
                  x={xScale(duration)}
                  y={0}
                  textAnchor="middle"
                  className="fill-zinc-400 text-sm"
                >
                  {formatDuration(duration)}
                </text>
              ))}
            </g>

            {/* Y-axis labels */}
            <g transform={`translate(${chartDimensions.padding.left - 10}, ${chartDimensions.padding.top})`}>
              {Array.from({ length: 6 }, (_, i) => {
                const value = (data.current.reduce((max, d) => Math.max(max, d.value), 0) / 5) * (5 - i);
                return (
                  <text
                    key={`ylabel-${i}`}
                    x={0}
                    y={i * (chartHeight / 5) + 5}
                    textAnchor="end"
                    className="fill-zinc-400 text-sm"
                  >
                    {Math.round(value)}{sport === 'cycling' ? 'W' : ''}
                  </text>
                );
              })}
            </g>
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-600"></div>
              <span className="text-white">Current ({timeRange})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-400"></div>
              <span className="text-gray-400">Previous</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-600"></div>
              <span className="text-gray-400">All-time</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}