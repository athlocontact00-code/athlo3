'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap, 
  Activity,
  Trophy,
  Clock,
  Heart,
  BarChart3,
  Gauge,
  Flame,
  Sparkles
} from 'lucide-react';

// Import our new components
import { PerformanceCurve } from '@/components/analytics/performance-curve';
import { PMCChart } from '@/components/analytics/pmc-chart';
import { TrainingHeatmap } from '@/components/analytics/training-heatmap';
// import { RacePredictor } from '@/components/analytics/race-predictor';
// import { SeasonComparison } from '@/components/analytics/season-comparison';
// import { WeeklyDigest } from '@/components/analytics/weekly-digest';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for key stats
  const currentFitness = {
    ctl: 52.3,
    atl: 45.8,
    tsb: 6.5,
    rampRate: 2.3,
    form: 'good'
  };

  const weeklyStats = {
    thisWeek: {
      hours: 8.5,
      tss: 425,
      workouts: 6,
      compliance: 85
    },
    lastWeek: {
      hours: 9.2,
      tss: 480,
      workouts: 7,
      compliance: 92
    }
  };

  const personalBests = [
    { distance: '5K', time: '18:42', date: '2026-01-15', improvement: '-12s' },
    { distance: '10K', time: '39:18', date: '2026-01-28', improvement: '-25s' },
    { distance: 'Half Marathon', time: '1:25:33', date: '2025-12-10', improvement: '' },
    { distance: 'Marathon', time: '3:02:45', date: '2025-10-22', improvement: '-2:15' }
  ];

  const monthlyGoals = [
    { name: 'Training Hours', current: 34, target: 40, unit: 'h' },
    { name: 'Long Runs', current: 3, target: 4, unit: '' },
    { name: 'Speed Sessions', current: 6, target: 8, unit: '' },
    { name: 'Total Distance', current: 180, target: 220, unit: 'km' }
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Fitness Trending Up',
      description: 'Your CTL has increased 8% over the past 4 weeks. Great consistency!',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      type: 'warning',
      title: 'Watch Your Form',
      description: 'TSB is trending negative. Consider an easier week to optimize adaptation.',
      icon: Gauge,
      color: 'text-yellow-400'
    },
    {
      type: 'info',
      title: 'Race Season Prep',
      description: 'You\'re 8 weeks out from your A-race. Time to add race-specific intensity.',
      icon: Trophy,
      color: 'text-blue-400'
    }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="text-blue-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{currentFitness.ctl}</div>
                <div className="text-sm text-gray-400">Fitness (CTL)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Flame className="text-red-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{currentFitness.atl}</div>
                <div className="text-sm text-gray-400">Fatigue (ATL)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Gauge className="text-green-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{currentFitness.tsb > 0 ? '+' : ''}{currentFitness.tsb}</div>
                <div className="text-sm text-gray-400">Form (TSB)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="text-purple-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">+{currentFitness.rampRate}</div>
                <div className="text-sm text-gray-400">CTL/week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* This Week Summary */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">This Week vs Last Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {weeklyStats.thisWeek.hours}h
              </div>
              <div className="text-sm text-gray-400 mb-2">Training Hours</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${
                weeklyStats.thisWeek.hours > weeklyStats.lastWeek.hours ? 'text-green-400' : 'text-red-400'
              }`}>
                {weeklyStats.thisWeek.hours > weeklyStats.lastWeek.hours ? '↗' : '↘'}
                {Math.abs(weeklyStats.thisWeek.hours - weeklyStats.lastWeek.hours).toFixed(1)}h
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {weeklyStats.thisWeek.tss}
              </div>
              <div className="text-sm text-gray-400 mb-2">Training Stress</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${
                weeklyStats.thisWeek.tss > weeklyStats.lastWeek.tss ? 'text-green-400' : 'text-red-400'
              }`}>
                {weeklyStats.thisWeek.tss > weeklyStats.lastWeek.tss ? '↗' : '↘'}
                {Math.abs(weeklyStats.thisWeek.tss - weeklyStats.lastWeek.tss)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {weeklyStats.thisWeek.workouts}
              </div>
              <div className="text-sm text-gray-400 mb-2">Workouts</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${
                weeklyStats.thisWeek.workouts >= weeklyStats.lastWeek.workouts ? 'text-green-400' : 'text-red-400'
              }`}>
                {weeklyStats.thisWeek.workouts >= weeklyStats.lastWeek.workouts ? '↗' : '↘'}
                {Math.abs(weeklyStats.thisWeek.workouts - weeklyStats.lastWeek.workouts)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {weeklyStats.thisWeek.compliance}%
              </div>
              <div className="text-sm text-gray-400 mb-2">Compliance</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${
                weeklyStats.thisWeek.compliance >= weeklyStats.lastWeek.compliance ? 'text-green-400' : 'text-red-400'
              }`}>
                {weeklyStats.thisWeek.compliance >= weeklyStats.lastWeek.compliance ? '↗' : '↘'}
                {Math.abs(weeklyStats.thisWeek.compliance - weeklyStats.lastWeek.compliance)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Digest */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Weekly Digest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">This week's training summary and insights would be displayed here.</p>
          </CardContent>
        </Card>

        {/* Monthly Goals */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="text-red-400" size={20} />
              Monthly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyGoals.map((goal, i) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{goal.name}</span>
                    <span className="text-white font-medium">
                      {goal.current}{goal.unit} / {goal.target}{goal.unit}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-gray-400 text-right">
                    {Math.round(progress)}% complete
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={20} />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <insight.icon className={`${insight.color} mt-1`} size={20} />
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{insight.title}</h3>
                  <p className="text-gray-400 text-sm">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Bests */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            Personal Bests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {personalBests.map((pb, i) => (
              <div key={i} className="text-center p-4 bg-zinc-800/30 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">{pb.distance}</div>
                <div className="text-xl font-bold text-white mb-2">{pb.time}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(pb.date).toLocaleDateString()}
                </div>
                {pb.improvement && (
                  <Badge className="bg-green-600 text-white text-xs">
                    {pb.improvement}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Progress & Analytics</h1>
          <p className="text-gray-400">Track your performance, analyze trends, and optimize your training</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-zinc-700 text-gray-400 hover:text-white"
          >
            <Calendar size={16} className="mr-2" />
            Date Range
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <BarChart3 size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="pmc" className="data-[state=active]:bg-red-600">
            PMC
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-red-600">
            Performance
          </TabsTrigger>
          <TabsTrigger value="load" className="data-[state=active]:bg-red-600">
            Load
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-red-600">
            Predictions
          </TabsTrigger>
          <TabsTrigger value="compare" className="data-[state=active]:bg-red-600">
            Compare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="pmc" className="space-y-6">
          <PMCChart />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Form Zones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Peak Form (TSB &gt; 5)</span>
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Neutral (-10 to 5)</span>
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Overreaching (-30 to -10)</span>
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Detraining (&lt; -30)</span>
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Training Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Ratio:</span>
                  <span className="text-white font-medium">
                    {(currentFitness.atl / currentFitness.ctl).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Optimal Range:</span>
                  <span className="text-green-400">0.8 - 1.2</span>
                </div>
                <div className="text-sm text-gray-400">
                  Current balance is {(currentFitness.atl / currentFitness.ctl) > 1.2 ? 'too high' : 
                                    (currentFitness.atl / currentFitness.ctl) < 0.8 ? 'too low' : 'optimal'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Ramp Rate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current:</span>
                  <span className="text-white font-medium">+{currentFitness.rampRate} CTL/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recommended:</span>
                  <span className="text-green-400">2-6 CTL/week</span>
                </div>
                <div className="text-sm text-gray-400">
                  Current rate is {currentFitness.rampRate > 6 ? 'too aggressive' : 
                                  currentFitness.rampRate < 2 ? 'too conservative' : 'optimal'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceCurve sport="cycling" />
          
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Zone Distribution (Last 4 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { zone: 'Zone 1', time: '12h 30m', percentage: 45, color: 'bg-green-500' },
                  { zone: 'Zone 2', time: '8h 15m', percentage: 30, color: 'bg-yellow-500' },
                  { zone: 'Zone 3', time: '3h 45m', percentage: 15, color: 'bg-orange-500' },
                  { zone: 'Zone 4', time: '2h 10m', percentage: 8, color: 'bg-red-500' },
                  { zone: 'Zone 5', time: '0h 32m', percentage: 2, color: 'bg-purple-500' }
                ].map((zone, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{zone.zone}</span>
                      <span className="text-white">{zone.time} ({zone.percentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${zone.color}`}
                        style={{ width: `${zone.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="load" className="space-y-6">
          {/* Weekly Load Chart Placeholder */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Weekly Training Load</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Weekly Load Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Monotony</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">1.8</div>
                  <div className="text-sm text-gray-400 mb-4">Current (4 weeks)</div>
                  <div className="text-xs text-gray-500">
                    Optimal: 1.5-2.0<br/>
                    Current level is good
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Strain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">285</div>
                  <div className="text-sm text-gray-400 mb-4">Current (4 weeks)</div>
                  <div className="text-xs text-gray-500">
                    Weekly TSS × Monotony<br/>
                    Manageable strain level
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">ACWR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">1.15</div>
                  <div className="text-sm text-gray-400 mb-4">Acute:Chronic Ratio</div>
                  <div className="text-xs text-gray-500">
                    Sweet spot: 0.8-1.3<br/>
                    Low injury risk
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Race Predictor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">AI-powered race time predictions based on your current fitness would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Season Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Comparison of training metrics across different seasons would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Training Heatmap at bottom */}
      <div className="mt-8">
        <TrainingHeatmap />
      </div>
    </div>
  );
}