'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Zap, 
  Mountain, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  User,
  MessageSquare,
  Star,
  Activity,
  BarChart3
} from 'lucide-react';

interface WorkoutData {
  id: string;
  name: string;
  sport: 'cycling' | 'running' | 'swimming';
  date: string;
  duration: number; // seconds
  planned?: PlannedWorkout;
  actual: ActualWorkout;
  notes?: {
    athlete?: string;
    coach?: string;
  };
  rpe?: number; // 1-10 scale
  feelings?: {
    energy: number; // 1-5
    motivation: number; // 1-5
    legs: number; // 1-5
  };
}

interface PlannedWorkout {
  duration: number;
  distance?: number;
  targetPower?: number;
  targetPace?: number;
  targetHR?: number;
  tss: number;
}

interface ActualWorkout {
  duration: number;
  distance?: number;
  avgPower?: number;
  avgPace?: number; // seconds per km
  avgHR?: number;
  maxHR?: number;
  elevation?: number;
  tss: number;
  if: number; // Intensity Factor
  timeInZones: {
    zone1: number;
    zone2: number;
    zone3: number;
    zone4: number;
    zone5: number;
  };
  laps: Lap[];
  timeSeries: {
    time: number; // seconds from start
    hr?: number;
    power?: number;
    pace?: number;
    elevation?: number;
    cadence?: number;
  }[];
}

interface Lap {
  number: number;
  duration: number;
  distance: number;
  avgPower?: number;
  avgPace?: number;
  avgHR?: number;
  avgCadence?: number;
}

interface Props {
  workout: WorkoutData;
  onUpdateNotes?: (notes: { athlete?: string; coach?: string }) => void;
  className?: string;
}

// Mock workout data
const mockWorkout: WorkoutData = {
  id: '1',
  name: '5x4min VO2max Intervals',
  sport: 'cycling',
  date: '2026-02-13T09:00:00Z',
  duration: 3600,
  planned: {
    duration: 3600,
    targetPower: 320,
    tss: 85
  },
  actual: {
    duration: 3542,
    distance: 45.2,
    avgPower: 285,
    avgHR: 162,
    maxHR: 178,
    elevation: 245,
    tss: 89,
    if: 0.87,
    timeInZones: {
      zone1: 1200, // 20 minutes
      zone2: 900,  // 15 minutes
      zone3: 600,  // 10 minutes
      zone4: 542,  // 9 minutes
      zone5: 300   // 5 minutes
    },
    laps: [
      { number: 1, duration: 600, distance: 8.2, avgPower: 180, avgPace: 0, avgHR: 145, avgCadence: 85 },
      { number: 2, duration: 240, distance: 4.1, avgPower: 315, avgPace: 0, avgHR: 172, avgCadence: 95 },
      { number: 3, duration: 120, distance: 1.8, avgPower: 150, avgPace: 0, avgHR: 155, avgCadence: 80 },
      { number: 4, duration: 240, distance: 4.2, avgPower: 320, avgPace: 0, avgHR: 175, avgCadence: 97 },
      { number: 5, duration: 120, distance: 1.7, avgPower: 145, avgPace: 0, avgHR: 152, avgCadence: 78 }
    ],
    timeSeries: [] // Would contain detailed time series data
  },
  rpe: 8,
  feelings: {
    energy: 4,
    motivation: 5,
    legs: 3
  },
  notes: {
    athlete: "Felt strong on the intervals but legs were heavy from yesterday's ride. Could maintain power targets but HR was elevated.",
    coach: "Good execution overall. Power targets met but HR response suggests athlete may be carrying fatigue. Consider easier day tomorrow."
  }
};

export function WorkoutAnalysis({ workout = mockWorkout, onUpdateNotes, className = '' }: Props) {
  const [activeTab, setActiveTab] = useState('overview');
  const [athleteNotes, setAthleteNotes] = useState(workout.notes?.athlete || '');
  const [coachNotes, setCoachNotes] = useState(workout.notes?.coach || '');

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (secondsPerKm: number): string => {
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.round(secondsPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
  };

  const complianceMetrics = useMemo(() => {
    if (!workout.planned) return null;

    const metrics = [
      {
        name: 'Duration',
        planned: workout.planned.duration,
        actual: workout.actual.duration,
        format: (val: number) => formatDuration(val),
        tolerance: 0.1 // 10%
      },
      {
        name: 'Average Power',
        planned: workout.planned.targetPower || 0,
        actual: workout.actual.avgPower || 0,
        format: (val: number) => val > 0 ? `${Math.round(val)}W` : 'N/A',
        tolerance: 0.05 // 5%
      },
      {
        name: 'TSS',
        planned: workout.planned.tss,
        actual: workout.actual.tss,
        format: (val: number) => Math.round(val).toString(),
        tolerance: 0.15 // 15%
      }
    ];

    return metrics.map(metric => {
      const deviation = Math.abs(metric.actual - metric.planned) / metric.planned;
      const status = deviation <= metric.tolerance ? 'excellent' : 
                    deviation <= metric.tolerance * 2 ? 'good' : 'warning';
      
      return {
        ...metric,
        deviation: deviation * 100,
        status
      };
    });
  }, [workout.planned, workout.actual]);

  const efficiencyMetrics = useMemo(() => {
    // Mock calculations for efficiency metrics
    const paceDecoupling = 3.2; // % increase in pace from first to second half
    const hrDrift = 5.8; // % increase in HR
    const variabilityIndex = 1.15; // normalized power / average power

    return {
      paceDecoupling,
      hrDrift,
      variabilityIndex,
      powerSmoothness: 85 // % (higher is better)
    };
  }, [workout.actual]);

  const zoneDistribution = useMemo(() => {
    const total = Object.values(workout.actual.timeInZones).reduce((a, b) => a + b, 0);
    return Object.entries(workout.actual.timeInZones).map(([zone, time]) => ({
      zone: zone.replace('zone', 'Zone '),
      time,
      percentage: (time / total) * 100,
      color: {
        zone1: '#22c55e',
        zone2: '#84cc16',
        zone3: '#eab308',
        zone4: '#f97316',
        zone5: '#ef4444'
      }[zone] || '#6b7280'
    }));
  }, [workout.actual.timeInZones]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <span className="text-green-400">✓</span>;
      case 'good': return <span className="text-yellow-400">⚠</span>;
      case 'warning': return <span className="text-red-400">✗</span>;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'warning': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const ChartPlaceholder = ({ title, height = 200 }: { title: string; height?: number }) => (
    <div 
      className="bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      <div className="text-center text-gray-400">
        <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">{title} Chart</p>
        <p className="text-xs opacity-75">Chart would render here with real data</p>
      </div>
    </div>
  );

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{workout.name}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span>{new Date(workout.date).toLocaleDateString()}</span>
            <Badge className="bg-blue-600 text-white capitalize">{workout.sport}</Badge>
            {workout.rpe && (
              <div className="flex items-center gap-1">
                <span className="text-sm">RPE:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < workout.rpe! ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-white font-medium">{workout.rpe}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{formatDuration(workout.actual.duration)}</div>
          <div className="text-gray-400">Duration</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Heart className="text-red-400" size={20} />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{workout.actual.avgHR}</div>
                <div className="text-sm text-gray-400">Avg HR</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="text-yellow-400" size={20} />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {workout.actual.avgPower ? `${workout.actual.avgPower}W` : formatPace(workout.actual.avgPace || 0)}
                </div>
                <div className="text-sm text-gray-400">
                  {workout.sport === 'cycling' ? 'Avg Power' : 'Avg Pace'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Mountain className="text-green-400" size={20} />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{workout.actual.elevation}m</div>
                <div className="text-sm text-gray-400">Elevation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="text-purple-400" size={20} />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{workout.actual.tss}</div>
                <div className="text-sm text-gray-400">TSS</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900 w-full justify-start">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">Overview</TabsTrigger>
          <TabsTrigger value="charts" className="data-[state=active]:bg-red-600">Charts</TabsTrigger>
          <TabsTrigger value="laps" className="data-[state=active]:bg-red-600">Laps</TabsTrigger>
          <TabsTrigger value="zones" className="data-[state=active]:bg-red-600">Zones</TabsTrigger>
          <TabsTrigger value="efficiency" className="data-[state=active]:bg-red-600">Efficiency</TabsTrigger>
          {workout.planned && (
            <TabsTrigger value="compliance" className="data-[state=active]:bg-red-600">Compliance</TabsTrigger>
          )}
          <TabsTrigger value="notes" className="data-[state=active]:bg-red-600">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-white">{workout.actual.distance}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max HR:</span>
                    <span className="text-white">{workout.actual.maxHR} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IF:</span>
                    <span className="text-white">{workout.actual.if}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Work:</span>
                    <span className="text-white">{Math.round((workout.actual.avgPower || 0) * workout.actual.duration / 1000)}kJ</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subjective Feedback */}
            {workout.feelings && (
              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">How You Felt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(workout.feelings).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 capitalize">{key}:</span>
                        <span className="text-white">{value}/5</span>
                      </div>
                      <Progress value={value * 20} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Power/HR Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Power/HR Time Series" height={250} />
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Elevation Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Elevation Profile" height={250} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Power/Pace Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Power/Pace Time Series" height={350} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Heart Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder title="Heart Rate" height={250} />
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Cadence</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder title="Cadence" height={250} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="laps" className="mt-6">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Lap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left p-3 text-gray-400">Lap</th>
                      <th className="text-left p-3 text-gray-400">Duration</th>
                      <th className="text-left p-3 text-gray-400">Distance</th>
                      {workout.sport === 'cycling' && (
                        <th className="text-left p-3 text-gray-400">Avg Power</th>
                      )}
                      {workout.sport !== 'cycling' && (
                        <th className="text-left p-3 text-gray-400">Avg Pace</th>
                      )}
                      <th className="text-left p-3 text-gray-400">Avg HR</th>
                      <th className="text-left p-3 text-gray-400">Cadence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workout.actual.laps.map((lap) => (
                      <tr key={lap.number} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="p-3 text-white font-medium">{lap.number}</td>
                        <td className="p-3 text-gray-300">{formatDuration(lap.duration)}</td>
                        <td className="p-3 text-gray-300">{lap.distance.toFixed(1)}km</td>
                        {workout.sport === 'cycling' && (
                          <td className="p-3 text-gray-300">{lap.avgPower}W</td>
                        )}
                        {workout.sport !== 'cycling' && (
                          <td className="p-3 text-gray-300">{formatPace(lap.avgPace || 0)}</td>
                        )}
                        <td className="p-3 text-gray-300">{lap.avgHR} bpm</td>
                        <td className="p-3 text-gray-300">{lap.avgCadence} rpm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="mt-6">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Zone Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneDistribution.map((zone) => (
                  <div key={zone.zone} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{zone.zone}</span>
                      <div className="text-right">
                        <span className="text-white font-medium">{formatDuration(zone.time)}</span>
                        <span className="text-gray-400 ml-2">({zone.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${zone.percentage}%`,
                          backgroundColor: zone.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Pace Decoupling:</span>
                    <span className={`font-medium ${
                      efficiencyMetrics.paceDecoupling < 5 ? 'text-green-400' : 
                      efficiencyMetrics.paceDecoupling < 10 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {efficiencyMetrics.paceDecoupling.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">HR Drift:</span>
                    <span className={`font-medium ${
                      efficiencyMetrics.hrDrift < 5 ? 'text-green-400' : 
                      efficiencyMetrics.hrDrift < 10 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {efficiencyMetrics.hrDrift.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Variability Index:</span>
                    <span className={`font-medium ${
                      efficiencyMetrics.variabilityIndex < 1.05 ? 'text-green-400' : 
                      efficiencyMetrics.variabilityIndex < 1.10 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {efficiencyMetrics.variabilityIndex.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Power Smoothness:</span>
                    <span className={`font-medium ${
                      efficiencyMetrics.powerSmoothness > 80 ? 'text-green-400' : 
                      efficiencyMetrics.powerSmoothness > 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {efficiencyMetrics.powerSmoothness}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">GPS Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">GPS Route Map</p>
                    <p className="text-xs opacity-75">Interactive map would render here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {workout.planned && complianceMetrics && (
          <TabsContent value="compliance" className="mt-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Plan vs Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {complianceMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(metric.status)}
                          <span className={getStatusColor(metric.status)}>
                            {metric.deviation.toFixed(1)}% deviation
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Planned:</span>
                          <div className="text-white font-medium">{metric.format(metric.planned)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Actual:</span>
                          <div className="text-white font-medium">{metric.format(metric.actual)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Difference:</span>
                          <div className={getStatusColor(metric.status)}>
                            {metric.actual > metric.planned ? '+' : ''}{metric.format(metric.actual - metric.planned)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Overall Compliance Score */}
                  <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">87%</div>
                      <div className="text-gray-400">Overall Compliance Score</div>
                      <div className="text-sm text-green-400 mt-1">Excellent execution!</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="notes" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User size={20} />
                  Athlete Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={athleteNotes}
                  onChange={(e) => setAthleteNotes(e.target.value)}
                  placeholder="How did the workout feel? Any observations or feedback..."
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                />
                <Button 
                  onClick={() => onUpdateNotes?.({ athlete: athleteNotes, coach: coachNotes })}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare size={20} />
                  Coach Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  placeholder="Coach feedback and observations..."
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                />
                <Button 
                  onClick={() => onUpdateNotes?.({ athlete: athleteNotes, coach: coachNotes })}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}