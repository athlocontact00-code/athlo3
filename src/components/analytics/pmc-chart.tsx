'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Flag, Eye, EyeOff } from 'lucide-react';

interface PMCData {
  date: string;
  ctl: number; // Chronic Training Load (fitness) - blue
  atl: number; // Acute Training Load (fatigue) - red  
  tsb: number; // Training Stress Balance (form) - green
  tss: number; // Training Stress Score for the day
}

interface Race {
  date: string;
  name: string;
  type: 'A' | 'B' | 'C';
}

interface Props {
  className?: string;
}

// Mock PMC data generator
const generatePMCData = (days: number): PMCData[] => {
  const data: PMCData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let ctl = 40; // Starting fitness
  let atl = 30; // Starting fatigue
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate training stress
    const dayOfWeek = date.getDay();
    const isRestDay = dayOfWeek === 0 || dayOfWeek === 6;
    const tss = isRestDay ? Math.random() * 20 : 50 + Math.random() * 100;
    
    // Calculate CTL and ATL using exponential moving averages
    ctl = ctl + (tss - ctl) / 42; // 42-day time constant
    atl = atl + (tss - atl) / 7;  // 7-day time constant
    const tsb = ctl - atl;
    
    data.push({
      date: date.toISOString().split('T')[0],
      ctl: Math.round(ctl * 10) / 10,
      atl: Math.round(atl * 10) / 10,
      tsb: Math.round(tsb * 10) / 10,
      tss: Math.round(tss)
    });
  }
  
  return data;
};

// Mock race data
const mockRaces: Race[] = [
  { date: '2026-03-15', name: 'Spring 10K', type: 'B' },
  { date: '2026-04-20', name: 'City Marathon', type: 'A' },
  { date: '2026-05-10', name: 'Trail Run', type: 'C' }
];

export function PMCChart({ className = '' }: Props) {
  const [dateRange, setDateRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const [visibleLines, setVisibleLines] = useState({ ctl: true, atl: true, tsb: true });
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; data: PMCData } | null>(null);

  const data = useMemo(() => {
    const days = dateRange === '3m' ? 90 : dateRange === '6m' ? 180 : dateRange === '1y' ? 365 : 500;
    return generatePMCData(days);
  }, [dateRange]);

  const chartDimensions = {
    width: 900,
    height: 450,
    padding: { top: 20, right: 40, bottom: 80, left: 70 }
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;

  // Scale functions
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => {
    const allValues = data.flatMap(d => [d.ctl, d.atl, d.tsb]);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue;
    const padding = range * 0.1;
    return chartHeight - ((value - minValue + padding) / (range + 2 * padding)) * chartHeight;
  };

  // Generate smooth line path
  const generateLinePath = (values: number[]) => {
    if (values.length < 2) return '';
    
    const points = values.map((value, i) => ({ x: xScale(i), y: yScale(value) }));
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const prev = points[i - 1];
      const next = points[i + 1];
      
      if (i === 1 || i === points.length - 1) {
        path += ` L ${current.x} ${current.y}`;
      } else {
        const cpx1 = prev.x + (current.x - prev.x) * 0.3;
        const cpy1 = prev.y + (current.y - prev.y) * 0.3;
        const cpx2 = current.x - (next.x - current.x) * 0.3;
        const cpy2 = current.y - (next.y - current.y) * 0.3;
        
        path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${current.x} ${current.y}`;
      }
    }
    
    return path;
  };

  // Get zone info based on TSB
  const getFormZone = (tsb: number) => {
    if (tsb > 5) return { name: 'Peak Form', color: 'bg-green-500/20 text-green-400' };
    if (tsb > -10) return { name: 'Neutral', color: 'bg-yellow-500/20 text-yellow-400' };
    if (tsb > -30) return { name: 'Overreaching', color: 'bg-orange-500/20 text-orange-400' };
    return { name: 'Detraining', color: 'bg-red-500/20 text-red-400' };
  };

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  const dateRanges = [
    { value: '3m' as const, label: '3M' },
    { value: '6m' as const, label: '6M' },
    { value: '1y' as const, label: '1Y' },
    { value: 'all' as const, label: 'All' }
  ];

  const currentData = data[data.length - 1];
  const formZone = currentData ? getFormZone(currentData.tsb) : null;

  return (
    <Card className={`${className} bg-zinc-950 border-zinc-800`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Performance Management Chart
            </CardTitle>
            {currentData && formZone && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-zinc-400">
                  <span className="text-blue-400 font-medium">Fitness:</span> {currentData.ctl}
                </div>
                <div className="text-sm text-zinc-400">
                  <span className="text-red-400 font-medium">Fatigue:</span> {currentData.atl}
                </div>
                <div className="text-sm text-zinc-400">
                  <span className="text-green-400 font-medium">Form:</span> {currentData.tsb}
                </div>
                <Badge className={formZone.color}>
                  {formZone.name}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {dateRanges.map(({ value, label }) => (
              <Button
                key={value}
                variant={dateRange === value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDateRange(value)}
                className={
                  dateRange === value
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
          {/* Line visibility toggles */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => toggleLine('ctl')}
              className={`flex items-center gap-2 text-sm transition-opacity ${
                visibleLines.ctl ? 'opacity-100' : 'opacity-50'
              }`}
            >
              {visibleLines.ctl ? <Eye size={16} /> : <EyeOff size={16} />}
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span className="text-blue-400">Fitness (CTL)</span>
            </button>
            <button
              onClick={() => toggleLine('atl')}
              className={`flex items-center gap-2 text-sm transition-opacity ${
                visibleLines.atl ? 'opacity-100' : 'opacity-50'
              }`}
            >
              {visibleLines.atl ? <Eye size={16} /> : <EyeOff size={16} />}
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span className="text-red-400">Fatigue (ATL)</span>
            </button>
            <button
              onClick={() => toggleLine('tsb')}
              className={`flex items-center gap-2 text-sm transition-opacity ${
                visibleLines.tsb ? 'opacity-100' : 'opacity-50'
              }`}
            >
              {visibleLines.tsb ? <Eye size={16} /> : <EyeOff size={16} />}
              <div className="w-4 h-0.5 bg-green-500"></div>
              <span className="text-green-400">Form (TSB)</span>
            </button>
          </div>

          <svg
            width={chartDimensions.width}
            height={chartDimensions.height}
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="peakFormGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="overreachingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="detrainingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Chart area */}
            <g transform={`translate(${chartDimensions.padding.left}, ${chartDimensions.padding.top})`}>
              {/* Background zones */}
              <rect
                x={0}
                y={yScale(5)}
                width={chartWidth}
                height={yScale(Math.min(...data.map(d => d.tsb))) - yScale(5)}
                fill="url(#peakFormGradient)"
              />
              <rect
                x={0}
                y={yScale(-10)}
                width={chartWidth}
                height={yScale(5) - yScale(-10)}
                fill="#374151"
                opacity={0.1}
              />
              <rect
                x={0}
                y={yScale(-30)}
                width={chartWidth}
                height={yScale(-10) - yScale(-30)}
                fill="url(#overreachingGradient)"
              />
              <rect
                x={0}
                y={yScale(Math.min(...data.map(d => d.tsb)))}
                width={chartWidth}
                height={yScale(-30) - yScale(Math.min(...data.map(d => d.tsb)))}
                fill="url(#detrainingGradient)"
              />

              {/* Grid lines */}
              {Array.from({ length: 8 }, (_, i) => {
                const value = (Math.max(...data.map(d => Math.max(d.ctl, d.atl))) / 7) * i;
                return (
                  <line
                    key={`hgrid-${i}`}
                    x1={0}
                    y1={yScale(value)}
                    x2={chartWidth}
                    y2={yScale(value)}
                    stroke="#374151"
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}

              {/* Zero line for TSB */}
              <line
                x1={0}
                y1={yScale(0)}
                x2={chartWidth}
                y2={yScale(0)}
                stroke="#6b7280"
                strokeWidth={1}
                strokeDasharray="4,4"
                opacity={0.6}
              />

              {/* Race markers */}
              {mockRaces.map((race, i) => {
                const raceIndex = data.findIndex(d => d.date === race.date);
                if (raceIndex === -1) return null;
                
                const x = xScale(raceIndex);
                const flagColor = race.type === 'A' ? '#dc2626' : race.type === 'B' ? '#f59e0b' : '#6b7280';
                
                return (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <g transform={`translate(${x}, 0)`}>
                          <line
                            x1={0}
                            y1={0}
                            x2={0}
                            y2={chartHeight}
                            stroke={flagColor}
                            strokeWidth={2}
                            strokeDasharray="2,2"
                            opacity={0.6}
                          />
                          <Flag
                            x={-6}
                            y={-10}
                            width={12}
                            height={12}
                            fill={flagColor}
                            className="cursor-pointer"
                          />
                        </g>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-900 border-zinc-700 text-white">
                        <div className="space-y-1">
                          <p className="font-semibold">{race.name}</p>
                          <p className="text-sm text-zinc-400">Priority {race.type}</p>
                          <p className="text-sm text-zinc-400">{new Date(race.date).toLocaleDateString()}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}

              {/* Data lines */}
              {visibleLines.ctl && (
                <path
                  d={generateLinePath(data.map(d => d.ctl))}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  className="drop-shadow-sm"
                />
              )}

              {visibleLines.atl && (
                <path
                  d={generateLinePath(data.map(d => d.atl))}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  className="drop-shadow-sm"
                />
              )}

              {visibleLines.tsb && (
                <path
                  d={generateLinePath(data.map(d => d.tsb))}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  className="drop-shadow-sm"
                />
              )}

              {/* Interactive overlay */}
              <rect
                x={0}
                y={0}
                width={chartWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const dataIndex = Math.round((x / chartWidth) * (data.length - 1));
                  
                  if (dataIndex >= 0 && dataIndex < data.length) {
                    setHoveredPoint({ x, data: data[dataIndex] });
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* Hover line and tooltip */}
              {hoveredPoint && (
                <>
                  <line
                    x1={hoveredPoint.x}
                    y1={0}
                    x2={hoveredPoint.x}
                    y2={chartHeight}
                    stroke="#ffffff"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <foreignObject
                    x={Math.min(hoveredPoint.x + 10, chartWidth - 200)}
                    y={10}
                    width={180}
                    height={120}
                  >
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm shadow-xl">
                      <div className="font-medium text-white mb-2">
                        {new Date(hoveredPoint.data.date).toLocaleDateString()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-blue-400">Fitness (CTL):</span>
                          <span className="text-white">{hoveredPoint.data.ctl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-400">Fatigue (ATL):</span>
                          <span className="text-white">{hoveredPoint.data.atl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400">Form (TSB):</span>
                          <span className="text-white">{hoveredPoint.data.tsb}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">TSS:</span>
                          <span className="text-white">{hoveredPoint.data.tss}</span>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </>
              )}
            </g>

            {/* X-axis */}
            <g transform={`translate(${chartDimensions.padding.left}, ${chartDimensions.height - chartDimensions.padding.bottom + 20})`}>
              {data.filter((_, i) => i % Math.ceil(data.length / 8) === 0).map((d, i) => {
                const index = data.indexOf(d);
                return (
                  <text
                    key={i}
                    x={xScale(index)}
                    y={0}
                    textAnchor="middle"
                    className="fill-zinc-400 text-sm"
                  >
                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </text>
                );
              })}
            </g>

            {/* Y-axis */}
            <g transform={`translate(${chartDimensions.padding.left - 10}, ${chartDimensions.padding.top})`}>
              {Array.from({ length: 8 }, (_, i) => {
                const value = Math.round((Math.max(...data.map(d => Math.max(d.ctl, d.atl))) / 7) * i);
                return (
                  <text
                    key={i}
                    x={0}
                    y={yScale(value) + 5}
                    textAnchor="end"
                    className="fill-zinc-400 text-sm"
                  >
                    {value}
                  </text>
                );
              })}
            </g>
          </svg>

          {/* Zone legend */}
          <div className="mt-4 text-xs text-zinc-400 space-y-1">
            <div className="flex items-center gap-4">
              <span>Form zones:</span>
              <span className="text-green-400">Peak Form (TSB &gt; 5)</span>
              <span className="text-yellow-400">Neutral (-10 to 5)</span>
              <span className="text-orange-400">Overreaching (-30 to -10)</span>
              <span className="text-red-400">Detraining (&lt; -30)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}