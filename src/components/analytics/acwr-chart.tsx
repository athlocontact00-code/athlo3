'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react';

interface ACWRData {
  date: string;
  acwr: number;
  acuteLoad: number;
  chronicLoad: number;
  isWeekly?: boolean;
}

interface Props {
  data?: ACWRData[];
  className?: string;
}

// Mock ACWR data - typically calculated as 7-day average / 28-day average
const generateMockData = (weeks: number = 16): ACWRData[] => {
  const data: ACWRData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (weeks * 7));
  
  let chronicLoad = 300; // Starting chronic load
  
  for (let i = 0; i < weeks; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7));
    
    // Simulate training load variations
    const variation = Math.sin(i * 0.3) * 50 + Math.random() * 100 - 50;
    const acuteLoad = Math.max(100, chronicLoad + variation);
    
    // Update chronic load (slower adaptation)
    chronicLoad = chronicLoad + (acuteLoad - chronicLoad) * 0.15;
    
    const acwr = acuteLoad / chronicLoad;
    
    data.push({
      date: date.toISOString().split('T')[0],
      acwr: Math.round(acwr * 100) / 100,
      acuteLoad: Math.round(acuteLoad),
      chronicLoad: Math.round(chronicLoad),
      isWeekly: true
    });
  }
  
  return data;
};

export function ACWRChart({ data: providedData, className = '' }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: ACWRData } | null>(null);
  const [timeRange, setTimeRange] = useState<'12w' | '16w' | '24w'>('16w');

  const data = useMemo(() => {
    if (providedData) return providedData;
    const weeks = timeRange === '12w' ? 12 : timeRange === '16w' ? 16 : 24;
    return generateMockData(weeks);
  }, [providedData, timeRange]);

  const chartDimensions = {
    width: 800,
    height: 350,
    padding: { top: 20, right: 40, bottom: 60, left: 60 }
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;

  const currentACWR = data[data.length - 1]?.acwr || 1.0;
  const previousACWR = data[data.length - 2]?.acwr || 1.0;
  const trend = currentACWR > previousACWR ? 'up' : currentACWR < previousACWR ? 'down' : 'stable';

  // Risk zones
  const riskZones = [
    { min: 0, max: 0.8, label: 'Detraining Risk', color: '#3b82f6', risk: 'moderate' },
    { min: 0.8, max: 1.3, label: 'Sweet Spot', color: '#22c55e', risk: 'low' },
    { min: 1.3, max: 1.5, label: 'Moderate Risk', color: '#f59e0b', risk: 'moderate' },
    { min: 1.5, max: 2.5, label: 'High Injury Risk', color: '#ef4444', risk: 'high' }
  ];

  const getCurrentRiskZone = (acwr: number) => {
    return riskZones.find(zone => acwr >= zone.min && acwr < zone.max) || riskZones[riskZones.length - 1];
  };

  const currentRisk = getCurrentRiskZone(currentACWR);

  // Scale functions
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => {
    const minValue = 0.5;
    const maxValue = 2.0;
    return chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  };

  // Generate smooth line path
  const generatePath = () => {
    if (data.length < 2) return '';
    
    const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.acwr) }));
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const prev = points[i - 1];
      
      // Simple line for now, could add bezier curves for smoothing
      path += ` L ${current.x} ${current.y}`;
    }
    
    return path;
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield className="text-green-400" size={16} />;
      case 'moderate': return <AlertTriangle className="text-yellow-400" size={16} />;
      case 'high': return <AlertTriangle className="text-red-400" size={16} />;
      default: return <InfoIcon className="text-gray-400" size={16} />;
    }
  };

  const getACWRRecommendation = (acwr: number) => {
    if (acwr < 0.8) return {
      message: "Load may be too low for adaptation. Consider gradually increasing training volume.",
      action: "Increase load gradually",
      color: "text-blue-400"
    };
    if (acwr > 1.5) return {
      message: "High injury risk. Consider reducing acute load or adding recovery time.",
      action: "Reduce training load",
      color: "text-red-400"
    };
    if (acwr > 1.3) return {
      message: "Moderate injury risk. Monitor closely and ensure adequate recovery.",
      action: "Monitor closely",
      color: "text-yellow-400"
    };
    return {
      message: "Optimal training load for adaptation with low injury risk.",
      action: "Maintain current approach",
      color: "text-green-400"
    };
  };

  const recommendation = getACWRRecommendation(currentACWR);

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Acute:Chronic Workload Ratio</h2>
          <p className="text-gray-400">Monitor injury risk and training load balance</p>
        </div>
        <div className="flex gap-2">
          {['12w', '16w', '24w'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range as any)}
              className={
                timeRange === range
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'border-zinc-700 text-gray-400 hover:text-white'
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Current ACWR Card */}
        <Card className="bg-zinc-950 border-zinc-800 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              {getRiskIcon(currentRisk.risk)}
              Current ACWR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  currentACWR < 0.8 ? 'text-blue-400' :
                  currentACWR > 1.5 ? 'text-red-400' :
                  currentACWR > 1.3 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {currentACWR.toFixed(2)}
                </div>
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: currentRisk.color }}
                >
                  {currentRisk.label}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">7-day avg:</span>
                  <span className="text-white">{data[data.length - 1]?.acuteLoad || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">28-day avg:</span>
                  <span className="text-white">{data[data.length - 1]?.chronicLoad || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trend:</span>
                  <div className="flex items-center gap-1">
                    {trend === 'up' && <TrendingUp className="text-green-400" size={14} />}
                    {trend === 'down' && <TrendingDown className="text-red-400" size={14} />}
                    <span className="text-white capitalize">{trend}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="bg-zinc-950 border-zinc-800 lg:col-span-3">
          <CardContent className="p-6">
            <div className="relative">
              <svg
                width={chartDimensions.width}
                height={chartDimensions.height}
                className="overflow-visible"
              >
                <defs>
                  {/* Gradients for risk zones */}
                  <linearGradient id="sweetSpotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="detrainingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                {/* Chart area */}
                <g transform={`translate(${chartDimensions.padding.left}, ${chartDimensions.padding.top})`}>
                  {/* Risk zone backgrounds */}
                  <rect
                    x={0}
                    y={yScale(2.5)}
                    width={chartWidth}
                    height={yScale(1.5) - yScale(2.5)}
                    fill="url(#riskGradient)"
                  />
                  <rect
                    x={0}
                    y={yScale(1.5)}
                    width={chartWidth}
                    height={yScale(1.3) - yScale(1.5)}
                    fill="#f59e0b"
                    opacity={0.1}
                  />
                  <rect
                    x={0}
                    y={yScale(1.3)}
                    width={chartWidth}
                    height={yScale(0.8) - yScale(1.3)}
                    fill="url(#sweetSpotGradient)"
                  />
                  <rect
                    x={0}
                    y={yScale(0.8)}
                    width={chartWidth}
                    height={yScale(0.5) - yScale(0.8)}
                    fill="url(#detrainingGradient)"
                  />

                  {/* Zone boundary lines */}
                  <line x1={0} y1={yScale(0.8)} x2={chartWidth} y2={yScale(0.8)} 
                        stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,4" opacity={0.6} />
                  <line x1={0} y1={yScale(1.3)} x2={chartWidth} y2={yScale(1.3)} 
                        stroke="#22c55e" strokeWidth={1} strokeDasharray="4,4" opacity={0.6} />
                  <line x1={0} y1={yScale(1.5)} x2={chartWidth} y2={yScale(1.5)} 
                        stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,4" opacity={0.6} />

                  {/* Optimal zone line */}
                  <line x1={0} y1={yScale(1.0)} x2={chartWidth} y2={yScale(1.0)} 
                        stroke="#6b7280" strokeWidth={1} strokeDasharray="2,2" opacity={0.8} />

                  {/* Grid lines */}
                  {[0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0].map((value) => (
                    <line
                      key={`hgrid-${value}`}
                      x1={0}
                      y1={yScale(value)}
                      x2={chartWidth}
                      y2={yScale(value)}
                      stroke="#374151"
                      strokeWidth={0.5}
                      opacity={0.3}
                    />
                  ))}

                  {/* Data line */}
                  <path
                    d={generatePath()}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth={3}
                    className="drop-shadow-sm"
                  />

                  {/* Data points */}
                  {data.map((point, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <circle
                            cx={xScale(i)}
                            cy={yScale(point.acwr)}
                            r={4}
                            fill="#dc2626"
                            stroke="white"
                            strokeWidth={2}
                            className="cursor-pointer hover:r-6 transition-all duration-200"
                            onMouseEnter={() => setHoveredPoint({
                              x: xScale(i),
                              y: yScale(point.acwr),
                              data: point
                            })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 border-zinc-700 text-white">
                          <div className="space-y-1">
                            <p className="font-semibold">{new Date(point.date).toLocaleDateString()}</p>
                            <p>ACWR: {point.acwr}</p>
                            <p>Acute: {point.acuteLoad}</p>
                            <p>Chronic: {point.chronicLoad}</p>
                            <p className="text-sm text-gray-400">
                              Zone: {getCurrentRiskZone(point.acwr).label}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}

                  {/* Current value marker */}
                  {data.length > 0 && (
                    <g transform={`translate(${xScale(data.length - 1)}, ${yScale(currentACWR)})`}>
                      <circle r={6} fill="#dc2626" stroke="white" strokeWidth={3} />
                      <circle r={10} fill="none" stroke="#dc2626" strokeWidth={1} opacity={0.5}>
                        <animate attributeName="r" values="10;15;10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  )}
                </g>

                {/* X-axis labels */}
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

                {/* Y-axis labels */}
                <g transform={`translate(${chartDimensions.padding.left - 10}, ${chartDimensions.padding.top})`}>
                  {[0.5, 0.8, 1.0, 1.3, 1.5, 2.0].map((value) => (
                    <text
                      key={value}
                      x={0}
                      y={yScale(value) + 5}
                      textAnchor="end"
                      className="fill-zinc-400 text-sm"
                    >
                      {value.toFixed(1)}
                    </text>
                  ))}
                </g>
              </svg>
            </div>

            {/* Zone Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              {riskZones.map((zone, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-2 rounded"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-gray-300">{zone.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              currentRisk.risk === 'low' ? 'bg-green-500/10 border-green-500/20' :
              currentRisk.risk === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/20' :
              'bg-red-500/10 border-red-500/20'
            }`}>
              <div className={`font-medium ${recommendation.color} mb-2`}>
                {recommendation.action}
              </div>
              <p className="text-gray-300 text-sm">{recommendation.message}</p>
            </div>

            {/* What is ACWR explanation */}
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-start gap-3">
                <InfoIcon className="text-blue-400 mt-1" size={16} />
                <div>
                  <h3 className="text-white font-medium mb-2">What is ACWR?</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    The Acute:Chronic Workload Ratio compares your recent training load (7 days) 
                    to your longer-term average (28 days). It helps identify injury risk and optimize training progression.
                  </p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• <strong>0.8-1.3:</strong> Sweet spot for adaptation with low injury risk</li>
                    <li>• <strong>&lt;0.8:</strong> May indicate detraining or insufficient stimulus</li>
                    <li>• <strong>&gt;1.5:</strong> High injury risk due to rapid load increases</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}