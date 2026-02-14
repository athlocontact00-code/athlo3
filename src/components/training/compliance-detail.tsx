'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MessageSquare,
  Clock,
  Target,
  Activity,
  Heart,
  Zap
} from 'lucide-react';

interface ComplianceMetric {
  name: string;
  planned: number;
  actual: number;
  unit: string;
  tolerance: number; // Percentage tolerance for "good" compliance
  weight: number; // Weight in overall compliance calculation (0-1)
}

interface WorkoutCompliance {
  workoutId: string;
  workoutName: string;
  date: string;
  sport: 'cycling' | 'running' | 'swimming';
  overallScore: number; // 0-100
  metrics: ComplianceMetric[];
  feedback?: {
    reason?: string;
    rpe?: number;
    notes?: string;
  };
  coachComments?: string;
}

interface Props {
  workout: WorkoutCompliance;
  showTrend?: boolean;
  onUpdateCoachComment?: (comment: string) => void;
  className?: string;
}

// Mock compliance history for trend
const mockComplianceHistory = Array.from({ length: 8 }, (_, i) => ({
  week: i + 1,
  compliance: Math.max(60, Math.min(100, 85 + (Math.random() - 0.5) * 30))
}));

// Mock workout compliance data
const mockWorkout: WorkoutCompliance = {
  workoutId: '1',
  workoutName: '5x4min VO2max Intervals',
  date: '2026-02-13',
  sport: 'cycling',
  overallScore: 87,
  metrics: [
    {
      name: 'Duration',
      planned: 75, // 75 minutes
      actual: 72, // 72 minutes
      unit: 'min',
      tolerance: 0.1, // 10%
      weight: 0.15
    },
    {
      name: 'Distance',
      planned: 30,
      actual: 28.5,
      unit: 'km',
      tolerance: 0.15,
      weight: 0.1
    },
    {
      name: 'Average Power',
      planned: 320,
      actual: 315,
      unit: 'W',
      tolerance: 0.05, // 5%
      weight: 0.25
    },
    {
      name: 'Average HR',
      planned: 170,
      actual: 168,
      unit: 'bpm',
      tolerance: 0.1,
      weight: 0.2
    },
    {
      name: 'Training Stress Score',
      planned: 78,
      actual: 74,
      unit: 'TSS',
      tolerance: 0.15,
      weight: 0.3
    }
  ],
  feedback: {
    reason: 'Cut workout short due to heavy legs from yesterday',
    rpe: 8,
    notes: 'Power targets felt harder than usual. Stopped after 4th interval.'
  },
  coachComments: 'Good execution overall. Power close to target despite early termination. Consider easier recovery day next time.'
};

export function ComplianceDetail({ 
  workout = mockWorkout, 
  showTrend = true,
  onUpdateCoachComment,
  className = '' 
}: Props) {
  const [coachComment, setCoachComment] = useState(workout.coachComments || '');

  const getComplianceStatus = (metric: ComplianceMetric): 'excellent' | 'good' | 'warning' => {
    const deviation = Math.abs(metric.actual - metric.planned) / metric.planned;
    
    if (deviation <= metric.tolerance) return 'excellent';
    if (deviation <= metric.tolerance * 2) return 'good';
    return 'warning';
  };

  const getStatusIcon = (status: 'excellent' | 'good' | 'warning') => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'good':
        return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'warning':
        return <XCircle className="text-red-400" size={20} />;
    }
  };

  const getStatusColor = (status: 'excellent' | 'good' | 'warning') => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'warning': return 'text-red-400';
    }
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === 'min') {
      const hours = Math.floor(value / 60);
      const minutes = Math.round(value % 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    return `${value}${unit}`;
  };

  const getDeviationPercentage = (metric: ComplianceMetric): number => {
    return ((metric.actual - metric.planned) / metric.planned) * 100;
  };

  const overallComplianceColor = useMemo(() => {
    if (workout.overallScore >= 90) return 'text-green-400';
    if (workout.overallScore >= 75) return 'text-yellow-400';
    return 'text-red-400';
  }, [workout.overallScore]);

  const complianceTrend = useMemo(() => {
    if (mockComplianceHistory.length < 2) return 'stable';
    const recent = mockComplianceHistory.slice(-3);
    const average = recent.reduce((sum, item) => sum + item.compliance, 0) / recent.length;
    const previous = mockComplianceHistory.slice(-6, -3);
    const prevAverage = previous.reduce((sum, item) => sum + item.compliance, 0) / previous.length;
    
    if (average > prevAverage + 5) return 'improving';
    if (average < prevAverage - 5) return 'declining';
    return 'stable';
  }, []);

  const getTrendIcon = () => {
    switch (complianceTrend) {
      case 'improving': return <TrendingUp className="text-green-400" size={16} />;
      case 'declining': return <TrendingDown className="text-red-400" size={16} />;
      case 'stable': return <Minus className="text-gray-400" size={16} />;
    }
  };

  const getRPEColor = (rpe: number) => {
    if (rpe <= 3) return 'text-green-400';
    if (rpe <= 5) return 'text-yellow-400';
    if (rpe <= 7) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{workout.workoutName}</h2>
          <div className="flex items-center gap-4 text-gray-400">
            <span>{new Date(workout.date).toLocaleDateString()}</span>
            <Badge className="bg-blue-600 text-white capitalize">{workout.sport}</Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm">Overall Compliance:</span>
              <span className={`text-xl font-bold ${overallComplianceColor}`}>
                {workout.overallScore}%
              </span>
            </div>
          </div>
        </div>
        
        {showTrend && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {getTrendIcon()}
                <div>
                  <div className="text-white font-medium capitalize">{complianceTrend}</div>
                  <div className="text-xs text-gray-400">8-week trend</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overall Score Visualization */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${overallComplianceColor} mb-2`}>
              {workout.overallScore}%
            </div>
            <div className="text-gray-400">Overall Compliance Score</div>
            <Progress 
              value={workout.overallScore} 
              className="w-full max-w-md mx-auto mt-4 h-3"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {workout.metrics.filter(m => getComplianceStatus(m) === 'excellent').length}
              </div>
              <div className="text-sm text-gray-400">Excellent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {workout.metrics.filter(m => getComplianceStatus(m) === 'good').length}
              </div>
              <div className="text-sm text-gray-400">Good</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {workout.metrics.filter(m => getComplianceStatus(m) === 'warning').length}
              </div>
              <div className="text-sm text-gray-400">Needs Attention</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Metric Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {workout.metrics.map((metric, index) => {
              const status = getComplianceStatus(metric);
              const deviation = getDeviationPercentage(metric);
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status)}
                      <span className="text-white font-medium">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={getStatusColor(status)}>
                        {deviation >= 0 ? '+' : ''}{deviation.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400 mb-1">Planned</div>
                      <div className="text-white font-medium">
                        {formatValue(metric.planned, metric.unit)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 mb-1">Actual</div>
                      <div className="text-white font-medium">
                        {formatValue(metric.actual, metric.unit)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 mb-1">Difference</div>
                      <div className={getStatusColor(status)}>
                        {metric.actual > metric.planned ? '+' : ''}
                        {formatValue(metric.actual - metric.planned, metric.unit)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar showing compliance for this metric */}
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'excellent' ? 'bg-green-500' :
                        status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(0, 100 - Math.abs(deviation)))}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Athlete Feedback */}
      {workout.feedback && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare size={20} />
              Athlete Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workout.feedback.rpe && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Perceived Exertion (RPE):</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < (workout.feedback?.rpe || 0) ? 'bg-red-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`font-medium ${getRPEColor(workout.feedback.rpe)}`}>
                    {workout.feedback.rpe}/10
                  </span>
                </div>
              </div>
            )}
            
            {workout.feedback.reason && (
              <div>
                <div className="text-gray-400 mb-2">Reason for deviation:</div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-200">{workout.feedback.reason}</p>
                </div>
              </div>
            )}
            
            {workout.feedback.notes && (
              <div>
                <div className="text-gray-400 mb-2">Additional notes:</div>
                <div className="bg-zinc-800 rounded-lg p-3">
                  <p className="text-gray-300">{workout.feedback.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compliance Trend Chart */}
      {showTrend && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Compliance Trend (8 weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Activity size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Compliance Trend Chart</p>
                <p className="text-xs opacity-75">Interactive chart would render here</p>
              </div>
            </div>
            
            {/* Simple text-based trend for now */}
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              {mockComplianceHistory.slice(-4).map((week, i) => (
                <div key={i} className="text-center">
                  <div className="text-white font-medium">{Math.round(week.compliance)}%</div>
                  <div className="text-gray-400">Week {week.week}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coach Comments */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Coach Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={coachComment}
            onChange={(e) => setCoachComment(e.target.value)}
            placeholder="Add comments about this workout's execution, suggestions for improvement, or notes for future planning..."
            className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
          />
          <Button
            onClick={() => onUpdateCoachComment?.(coachComment)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Save Comment
          </Button>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workout.overallScore < 80 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="text-yellow-500 mt-1" size={16} />
                <div>
                  <div className="text-yellow-200 font-medium">Review Workout Difficulty</div>
                  <div className="text-sm text-yellow-400">
                    Consider adjusting future workout targets based on current fitness level.
                  </div>
                </div>
              </div>
            )}
            
            {workout.metrics.some(m => m.name === 'Average HR' && getComplianceStatus(m) === 'warning') && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <Heart className="text-red-500 mt-1" size={16} />
                <div>
                  <div className="text-red-200 font-medium">Heart Rate Response</div>
                  <div className="text-sm text-red-400">
                    HR response suggests potential fatigue or overreaching. Monitor closely.
                  </div>
                </div>
              </div>
            )}
            
            {workout.feedback?.rpe && workout.feedback.rpe > 8 && (
              <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Zap className="text-blue-500 mt-1" size={16} />
                <div>
                  <div className="text-blue-200 font-medium">High Perceived Exertion</div>
                  <div className="text-sm text-blue-400">
                    RPE higher than expected. Consider adding recovery time before next hard session.
                  </div>
                </div>
              </div>
            )}
            
            {workout.overallScore >= 90 && (
              <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="text-green-500 mt-1" size={16} />
                <div>
                  <div className="text-green-200 font-medium">Excellent Execution</div>
                  <div className="text-sm text-green-400">
                    Great workout compliance! Consider progressive overload for continued adaptation.
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}