'use client';

import { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  FileText, 
  Bell,
  TrendingUp,
  TrendingDown,
  Battery,
  Shield,
  AlertTriangle,
  Activity,
  Heart,
  Moon,
  Zap,
  Clock,
  Target,
  Flag,
  MoreVertical,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Athlete {
  id: string;
  name: string;
  sport: 'cycling' | 'running' | 'triathlon';
  avatar?: string;
  timezone: string;
  currentFTP?: number;
  currentThresholdPace?: number; // seconds per km
}

interface ReadinessMetrics {
  overall: number; // 0-100
  hrv: number;
  rhr: number; // resting heart rate
  sleep: {
    duration: number; // hours
    quality: number; // 0-100
    efficiency: number; // 0-100
  };
  mood: number; // 1-5
  energy: number; // 1-5
  motivation: number; // 1-5
  soreness: number; // 1-5
  stress: number; // 1-5
}

interface ComplianceMetrics {
  thisWeek: number; // 0-100
  thisMonth: number; // 0-100
  plannedWorkouts: number;
  completedWorkouts: number;
  missedWorkouts: number;
  trend: 'up' | 'down' | 'stable';
}

interface InjuryRisk {
  overall: 'low' | 'moderate' | 'high';
  acwr: number; // acute:chronic workload ratio
  factors: string[];
}

interface PMCData {
  date: string;
  ctl: number; // fitness
  atl: number; // fatigue
  tsb: number; // form
}

interface CheckIn {
  id: string;
  date: string;
  type: 'manual' | 'device' | 'survey';
  metrics: Partial<ReadinessMetrics>;
}

interface Message {
  id: string;
  from: 'athlete' | 'coach';
  content: string;
  timestamp: string;
  read: boolean;
}

interface WorkoutPlan {
  id: string;
  date: string;
  name: string;
  planned: {
    duration: number;
    tss: number;
    type: 'easy' | 'tempo' | 'intervals' | 'long' | 'recovery';
  };
  completed?: {
    duration: number;
    tss: number;
    compliance: number; // 0-100
  };
}

interface Props {
  athlete: Athlete;
  onSendMessage?: (message: string) => void;
  onAdjustPlan?: () => void;
  onViewCalendar?: () => void;
  onGenerateReport?: () => void;
  className?: string;
}

// Mock data
const mockReadiness: ReadinessMetrics = {
  overall: 78,
  hrv: 42,
  rhr: 52,
  sleep: {
    duration: 7.2,
    quality: 85,
    efficiency: 88
  },
  mood: 4,
  energy: 3,
  motivation: 5,
  soreness: 2,
  stress: 3
};

const mockCompliance: ComplianceMetrics = {
  thisWeek: 85,
  thisMonth: 78,
  plannedWorkouts: 6,
  completedWorkouts: 5,
  missedWorkouts: 1,
  trend: 'stable'
};

const mockInjuryRisk: InjuryRisk = {
  overall: 'moderate',
  acwr: 1.35,
  factors: ['Elevated ACWR', 'Poor sleep quality', 'High training load']
};

const mockPMCData: PMCData[] = Array.from({ length: 84 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (83 - i));
  
  const baseCtl = 45 + Math.sin(i * 0.1) * 10;
  const baseAtl = 40 + Math.sin(i * 0.15) * 15;
  
  return {
    date: date.toISOString().split('T')[0],
    ctl: baseCtl,
    atl: baseAtl,
    tsb: baseCtl - baseAtl
  };
});

const mockCheckIns: CheckIn[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  return {
    id: `checkin-${i}`,
    date: date.toISOString().split('T')[0],
    type: 'manual',
    metrics: {
      sleep: {
        duration: 6.5 + Math.random() * 2,
        quality: 70 + Math.random() * 30,
        efficiency: 80 + Math.random() * 15
      },
      hrv: 35 + Math.random() * 20,
      mood: 2 + Math.floor(Math.random() * 3),
      energy: 2 + Math.floor(Math.random() * 3)
    }
  };
});

const mockMessages: Message[] = [
  {
    id: '1',
    from: 'athlete',
    content: "Hey coach! Feeling really good after yesterday's interval session. Legs recovered well overnight.",
    timestamp: '2026-02-13T10:30:00Z',
    read: true
  },
  {
    id: '2',
    from: 'coach',
    content: "Great to hear! Your power numbers looked solid. Let's see how you feel for tomorrow's tempo ride.",
    timestamp: '2026-02-13T11:15:00Z',
    read: true
  },
  {
    id: '3',
    from: 'athlete',
    content: "Should I adjust the workout if my HRV is still low tomorrow morning?",
    timestamp: '2026-02-13T19:45:00Z',
    read: false
  }
];

const mockThisWeekWorkouts: WorkoutPlan[] = [
  {
    id: '1',
    date: '2026-02-10',
    name: 'Easy Ride',
    planned: { duration: 60, tss: 42, type: 'easy' },
    completed: { duration: 65, tss: 45, compliance: 95 }
  },
  {
    id: '2',
    date: '2026-02-11',
    name: '5x4min VO2max',
    planned: { duration: 75, tss: 78, type: 'intervals' },
    completed: { duration: 72, tss: 74, compliance: 88 }
  },
  {
    id: '3',
    date: '2026-02-12',
    name: 'Tempo Ride',
    planned: { duration: 90, tss: 68, type: 'tempo' },
    completed: { duration: 85, tss: 62, compliance: 82 }
  },
  {
    id: '4',
    date: '2026-02-13',
    name: 'Recovery Spin',
    planned: { duration: 45, tss: 28, type: 'recovery' },
  },
  {
    id: '5',
    date: '2026-02-14',
    name: 'Threshold Intervals',
    planned: { duration: 90, tss: 85, type: 'intervals' }
  },
  {
    id: '6',
    date: '2026-02-15',
    name: 'Long Ride',
    planned: { duration: 180, tss: 125, type: 'long' }
  }
];

export function AthleteDashboard({ 
  athlete, 
  onSendMessage, 
  onAdjustPlan, 
  onViewCalendar, 
  onGenerateReport,
  className = '' 
}: Props) {
  const [newMessage, setNewMessage] = useState('');

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getWorkoutTypeColor = (type: string) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-400',
      tempo: 'bg-yellow-500/20 text-yellow-400',
      intervals: 'bg-red-500/20 text-red-400',
      long: 'bg-blue-500/20 text-blue-400',
      recovery: 'bg-gray-500/20 text-gray-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  const currentFitness = mockPMCData[mockPMCData.length - 1];

  const Sparkline = ({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) => (
    <svg width="100%" height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={data.map((value, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = height - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * (height - 10);
          return `${x},${y}`;
        }).join(' ')}
      />
    </svg>
  );

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={athlete.avatar} />
            <AvatarFallback className="bg-red-600 text-white text-xl">
              {athlete.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">{athlete.name}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <Badge className="bg-blue-600 text-white capitalize">{athlete.sport}</Badge>
              <span>CTL: {Math.round(currentFitness.ctl)} • ATL: {Math.round(currentFitness.atl)} • TSB: {Math.round(currentFitness.tsb)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-zinc-700 text-gray-400">
                <MoreVertical size={16} className="mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
              <DropdownMenuItem onClick={() => onSendMessage?.('')} className="text-white">
                <MessageSquare size={16} className="mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAdjustPlan} className="text-white">
                <Target size={16} className="mr-2" />
                Adjust Plan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewCalendar} className="text-white">
                <Calendar size={16} className="mr-2" />
                View Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onGenerateReport} className="text-white">
                <FileText size={16} className="mr-2" />
                Generate Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Readiness */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Battery size={20} className="text-green-400" />
                Readiness
              </CardTitle>
              <span className={`text-2xl font-bold ${getReadinessColor(mockReadiness.overall)}`}>
                {mockReadiness.overall}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">HRV:</span>
                <span className="text-white">{mockReadiness.hrv}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">RHR:</span>
                <span className="text-white">{mockReadiness.rhr} bpm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sleep:</span>
                <span className="text-white">{mockReadiness.sleep.duration}h ({mockReadiness.sleep.quality}%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Energy:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < mockReadiness.energy ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-white ml-1">{mockReadiness.energy}/5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Target size={20} className="text-blue-400" />
                Compliance
              </CardTitle>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getComplianceColor(mockCompliance.thisWeek)}`}>
                  {mockCompliance.thisWeek}%
                </div>
                <div className="text-xs text-gray-400">This Week</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completed:</span>
                <span className="text-white">{mockCompliance.completedWorkouts}/{mockCompliance.plannedWorkouts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">This Month:</span>
                <span className={getComplianceColor(mockCompliance.thisMonth)}>{mockCompliance.thisMonth}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Trend:</span>
                <div className="flex items-center gap-1">
                  {mockCompliance.trend === 'up' && <TrendingUp size={16} className="text-green-400" />}
                  {mockCompliance.trend === 'down' && <TrendingDown size={16} className="text-red-400" />}
                  {mockCompliance.trend === 'stable' && <Activity size={16} className="text-gray-400" />}
                  <span className="text-white capitalize">{mockCompliance.trend}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Injury Risk */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Shield size={20} className="text-orange-400" />
                Injury Risk
              </CardTitle>
              <Badge className={`${
                mockInjuryRisk.overall === 'low' ? 'bg-green-600' :
                mockInjuryRisk.overall === 'moderate' ? 'bg-yellow-600' :
                'bg-red-600'
              } text-white capitalize`}>
                {mockInjuryRisk.overall}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">ACWR:</span>
                <span className={`font-medium ${
                  mockInjuryRisk.acwr < 0.8 ? 'text-blue-400' :
                  mockInjuryRisk.acwr > 1.5 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {mockInjuryRisk.acwr.toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 text-sm">Risk Factors:</span>
                {mockInjuryRisk.factors.map((factor, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <AlertTriangle size={12} className="text-yellow-500" />
                    <span className="text-xs text-gray-300">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PMC Chart */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Fitness, Fatigue & Form (Last 12 Weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Mini PMC Chart</p>
              <p className="text-xs opacity-75">Interactive chart would render here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Week's Workouts */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">This Week's Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockThisWeekWorkouts.map(workout => (
              <div key={workout.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    workout.completed ? 'bg-green-500' : 
                    new Date(workout.date) < new Date() ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="text-white font-medium">{workout.name}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(workout.date).toLocaleDateString()} • {formatDuration(workout.planned.duration)} • {workout.planned.tss} TSS
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {workout.completed ? (
                    <div>
                      <div className={`font-medium ${getComplianceColor(workout.completed.compliance)}`}>
                        {workout.completed.compliance}%
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDuration(workout.completed.duration)} • {workout.completed.tss} TSS
                      </div>
                    </div>
                  ) : (
                    <Badge className={getWorkoutTypeColor(workout.planned.type)}>
                      {workout.planned.type}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Check-ins Trends */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Check-in Trends (14 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Moon size={16} />
                  Sleep Quality
                </span>
                <span className="text-white">
                  {Math.round(mockCheckIns[0]?.metrics.sleep?.quality || 0)}%
                </span>
              </div>
              <Sparkline 
                data={mockCheckIns.slice(0, 14).reverse().map(c => c.metrics.sleep?.quality || 0)}
                color="#3b82f6"
                height={30}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Heart size={16} />
                  HRV
                </span>
                <span className="text-white">
                  {Math.round(mockCheckIns[0]?.metrics.hrv || 0)}ms
                </span>
              </div>
              <Sparkline 
                data={mockCheckIns.slice(0, 14).reverse().map(c => c.metrics.hrv || 0)}
                color="#ef4444"
                height={30}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Zap size={16} />
                  Energy
                </span>
                <span className="text-white">
                  {mockCheckIns[0]?.metrics.energy || 0}/5
                </span>
              </div>
              <Sparkline 
                data={mockCheckIns.slice(0, 14).reverse().map(c => c.metrics.energy || 0)}
                color="#22c55e"
                height={30}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Recent Messages</CardTitle>
              <Badge className="bg-red-600 text-white">
                {mockMessages.filter(m => !m.read).length} unread
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-40 overflow-y-auto">
              {mockMessages.slice(-3).map(message => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className={`text-xs ${
                        message.from === 'athlete' ? 'bg-blue-600' : 'bg-green-600'
                      } text-white`}>
                        {message.from === 'athlete' ? 'A' : 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white capitalize">{message.from}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {!message.read && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                  <p className="text-sm text-gray-300 ml-8">{message.content}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 border-t border-zinc-800 pt-4">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a quick message..."
                  className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  rows={2}
                />
                <Button
                  onClick={() => {
                    onSendMessage?.(newMessage);
                    setNewMessage('');
                  }}
                  disabled={!newMessage.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coach Notes */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Coach Notes & Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <Flag size={16} className="text-yellow-500 mt-1" />
              <div>
                <div className="text-white font-medium">Watch ACWR</div>
                <div className="text-sm text-yellow-400">ACWR trending high. Consider reducing load next week.</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Bell size={16} className="text-blue-500 mt-1" />
              <div>
                <div className="text-white font-medium">Race Preparation</div>
                <div className="text-sm text-blue-400">Big event in 6 weeks. Start taper planning soon.</div>
              </div>
            </div>
            
            <Textarea
              placeholder="Add new notes or observations..."
              className="bg-zinc-800 border-zinc-700 text-white"
              rows={3}
            />
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}