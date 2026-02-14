'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Save, Clock, Target, Repeat, 
  Zap, GripVertical, Play, Eye, Wand2,
  Activity, Timer, MapPin, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Sport = 'cycling' | 'running' | 'swimming';
type StepType = 'warmup' | 'work' | 'recovery' | 'cooldown' | 'repeat';

interface WorkoutStep {
  id: string;
  type: StepType;
  name: string;
  duration: number; // seconds
  target: {
    type: 'power' | 'pace' | 'hr' | 'rpe';
    zone: number;
    value?: number;
  };
  description?: string;
  repeatCount?: number; // for repeat groups
  repeatSteps?: WorkoutStep[]; // steps inside repeat group
}

interface WorkoutTemplate {
  id?: string;
  name: string;
  sport: Sport;
  steps: WorkoutStep[];
  description?: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  totalDuration: number;
  estimatedTSS: number;
  estimatedIF: number;
}

interface Props {
  onSave?: (workout: WorkoutTemplate) => void;
  onClose?: () => void;
  initialData?: Partial<WorkoutTemplate>;
  className?: string;
}

const STEP_COLORS = {
  warmup: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', accent: '#22c55e' },
  work: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', accent: '#ef4444' },
  recovery: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', accent: '#3b82f6' },
  cooldown: { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400', accent: '#6b7280' },
  repeat: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', accent: '#a855f7' }
};

const ZONES = {
  cycling: {
    power: ['Z1 (≤55%)', 'Z2 (56-75%)', 'Z3 (76-90%)', 'Z4 (91-105%)', 'Z5 (106-120%)', 'Z6 (>120%)'],
    multipliers: [0.5, 0.65, 0.83, 0.98, 1.13, 1.4] // TSS multipliers
  },
  running: {
    pace: ['Z1 Easy', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 VO2max', 'Z6 Anaerobic'],
    multipliers: [0.5, 0.65, 0.83, 0.98, 1.13, 1.4]
  },
  swimming: {
    pace: ['Z1 Easy', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 VO2max', 'Z6 Anaerobic'],
    multipliers: [0.5, 0.65, 0.83, 0.98, 1.13, 1.4]
  }
};

export function WorkoutBuilder({ onSave, onClose, initialData, className = '' }: Props) {
  const [workout, setWorkout] = useState<Partial<WorkoutTemplate>>({
    name: '',
    sport: 'cycling',
    steps: [],
    description: '',
    tags: [],
    difficulty: 3,
    ...initialData
  });

  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'timeline'>('editor');
  const [aiSuggestions, setAiSuggestions] = useState<WorkoutTemplate[]>([]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const parseDuration = (input: string): number => {
    const parts = input.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };

  const calculateMetrics = useMemo(() => {
    const steps = workout.steps || [];
    let totalDuration = 0;
    let weightedTSS = 0;
    
    const calculateStepMetrics = (step: WorkoutStep): { duration: number; tss: number } => {
      let stepDuration = step.duration;
      let stepTSS = 0;
      
      if (step.type === 'repeat' && step.repeatSteps && step.repeatCount) {
        const repeatMetrics = step.repeatSteps.reduce((acc, repeatStep) => {
          const metrics = calculateStepMetrics(repeatStep);
          return { duration: acc.duration + metrics.duration, tss: acc.tss + metrics.tss };
        }, { duration: 0, tss: 0 });
        
        stepDuration = repeatMetrics.duration * step.repeatCount;
        stepTSS = repeatMetrics.tss * step.repeatCount;
      } else {
        const sport = workout.sport as Sport;
        const zoneMultiplier = ZONES[sport]?.multipliers[step.target.zone - 1] || 1;
        stepTSS = (stepDuration / 3600) * 100 * zoneMultiplier;
      }
      
      return { duration: stepDuration, tss: stepTSS };
    };
    
    steps.forEach(step => {
      const metrics = calculateStepMetrics(step);
      totalDuration += metrics.duration;
      weightedTSS += metrics.tss;
    });
    
    const estimatedIF = totalDuration > 0 ? Math.sqrt(weightedTSS / (totalDuration / 3600) / 100) : 0;
    
    return {
      totalDuration,
      estimatedTSS: Math.round(weightedTSS),
      estimatedIF: Math.round(estimatedIF * 100) / 100
    };
  }, [workout.steps, workout.sport]);

  const addStep = (type: StepType) => {
    const newStep: WorkoutStep = {
      id: crypto.randomUUID(),
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      duration: type === 'warmup' ? 600 : type === 'cooldown' ? 600 : 1200, // Default durations
      target: {
        type: workout.sport === 'cycling' ? 'power' : 'pace',
        zone: type === 'warmup' ? 1 : type === 'cooldown' ? 1 : 3
      }
    };
    
    setWorkout(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));
  };

  const updateStep = (stepId: string, updates: Partial<WorkoutStep>) => {
    setWorkout(prev => ({
      ...prev,
      steps: (prev.steps || []).map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const deleteStep = (stepId: string) => {
    setWorkout(prev => ({
      ...prev,
      steps: (prev.steps || []).filter(step => step.id !== stepId)
    }));
  };

  const duplicateStep = (step: WorkoutStep) => {
    const newStep = { ...step, id: crypto.randomUUID() };
    setWorkout(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));
  };

  const addRepeatGroup = () => {
    const repeatStep: WorkoutStep = {
      id: crypto.randomUUID(),
      type: 'repeat',
      name: '5x Intervals',
      duration: 0, // Will be calculated from repeat steps
      target: { type: 'power', zone: 4 },
      repeatCount: 5,
      repeatSteps: [
        {
          id: crypto.randomUUID(),
          type: 'work',
          name: 'Work',
          duration: 240, // 4 minutes
          target: { type: workout.sport === 'cycling' ? 'power' : 'pace', zone: 4 }
        },
        {
          id: crypto.randomUUID(),
          type: 'recovery',
          name: 'Recovery',
          duration: 120, // 2 minutes
          target: { type: workout.sport === 'cycling' ? 'power' : 'pace', zone: 1 }
        }
      ]
    };
    
    setWorkout(prev => ({
      ...prev,
      steps: [...(prev.steps || []), repeatStep]
    }));
  };

  const generateAISuggestions = async () => {
    // Mock AI suggestions - in real app, this would call an API
    const suggestions: WorkoutTemplate[] = [
      {
        name: '5x4min VO2max Intervals',
        sport: workout.sport as Sport,
        steps: [
          { id: '1', type: 'warmup', name: 'Warmup', duration: 900, target: { type: 'power', zone: 1 } },
          {
            id: '2', type: 'repeat', name: '5x4min@Z5', duration: 0, repeatCount: 5,
            target: { type: 'power', zone: 5 },
            repeatSteps: [
              { id: '2a', type: 'work', name: 'Work', duration: 240, target: { type: 'power', zone: 5 } },
              { id: '2b', type: 'recovery', name: 'Recovery', duration: 90, target: { type: 'power', zone: 1 } }
            ]
          },
          { id: '3', type: 'cooldown', name: 'Cooldown', duration: 600, target: { type: 'power', zone: 1 } }
        ],
        tags: ['intervals', 'vo2max'],
        difficulty: 4,
        totalDuration: 3030,
        estimatedTSS: 85,
        estimatedIF: 0.88
      }
    ];
    
    setAiSuggestions(suggestions);
  };

  const handleSave = () => {
    const finalWorkout: WorkoutTemplate = {
      id: workout.id || crypto.randomUUID(),
      name: workout.name || 'Untitled Workout',
      sport: workout.sport as Sport,
      steps: workout.steps || [],
      description: workout.description,
      tags: workout.tags || [],
      difficulty: workout.difficulty || 3,
      ...calculateMetrics
    };
    
    onSave?.(finalWorkout);
  };

  const StepEditor = ({ step, isNested = false }: { step: WorkoutStep; isNested?: boolean }) => {
    const colors = STEP_COLORS[step.type];
    const sport = workout.sport as Sport;
    const targetTypes = sport === 'cycling' ? ['power', 'hr'] : sport === 'running' ? ['pace', 'hr'] : ['pace', 'hr'];
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 ${isNested ? 'ml-6' : ''}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {!isNested && <GripVertical className="text-gray-400 cursor-move" size={16} />}
            <div className={`w-3 h-3 rounded-full ${colors.bg.replace('/20', '')}`}></div>
            <Input
              value={step.name}
              onChange={(e) => updateStep(step.id, { name: e.target.value })}
              className="bg-transparent border-none p-0 font-medium text-white focus-visible:ring-0"
              placeholder="Step name"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => duplicateStep(step)}
              className="text-gray-400 hover:text-white"
            >
              <Plus size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteStep(step.id)}
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Duration</label>
            <Input
              value={formatDuration(step.duration)}
              onChange={(e) => updateStep(step.id, { duration: parseDuration(e.target.value) })}
              placeholder="mm:ss"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Target Zone</label>
            <Select
              value={step.target.zone.toString()}
              onValueChange={(value) => updateStep(step.id, { 
                target: { ...step.target, zone: parseInt(value) }
              })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {ZONES[sport]?.[step.target.type as keyof typeof ZONES[typeof sport]]?.map((zone, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white">
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {step.type === 'repeat' && (
          <div className="space-y-3 mt-4 p-3 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Repeat size={16} className="text-purple-400" />
                <span className="text-sm text-gray-300">Repeat</span>
              </div>
              <Input
                type="number"
                value={step.repeatCount || 1}
                onChange={(e) => updateStep(step.id, { repeatCount: parseInt(e.target.value) || 1 })}
                className="w-20 bg-zinc-700 border-zinc-600 text-white"
                min={1}
              />
              <span className="text-sm text-gray-400">times</span>
            </div>
            
            {step.repeatSteps?.map((repeatStep) => (
              <StepEditor key={repeatStep.id} step={repeatStep} isNested />
            ))}
          </div>
        )}

        {step.description && (
          <div className="mt-3">
            <Textarea
              value={step.description}
              onChange={(e) => updateStep(step.id, { description: e.target.value })}
              placeholder="Step description..."
              className="bg-zinc-800 border-zinc-700 text-white text-sm"
              rows={2}
            />
          </div>
        )}
      </motion.div>
    );
  };

  const TimelineView = () => {
    const steps = workout.steps || [];
    const totalDuration = calculateMetrics.totalDuration;
    
    const getStepWidth = (step: WorkoutStep): number => {
      let duration = step.duration;
      if (step.type === 'repeat' && step.repeatSteps && step.repeatCount) {
        duration = step.repeatSteps.reduce((acc, s) => acc + s.duration, 0) * step.repeatCount;
      }
      return (duration / totalDuration) * 100;
    };

    return (
      <div className="space-y-4">
        <div className="h-20 bg-zinc-800 rounded-lg p-4 relative overflow-hidden">
          <div className="flex h-full">
            {steps.map((step) => {
              const width = getStepWidth(step);
              const colors = STEP_COLORS[step.type];
              
              return (
                <TooltipProvider key={step.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`${colors.bg} ${colors.border} border-2 h-full flex items-center justify-center cursor-pointer transition-all hover:scale-105`}
                        style={{ width: `${width}%`, backgroundColor: `${colors.accent}20` }}
                        onClick={() => setActiveStep(step.id)}
                      >
                        <div className="text-center">
                          <div className={`text-sm font-medium ${colors.text}`}>
                            {step.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDuration(step.type === 'repeat' && step.repeatSteps && step.repeatCount
                              ? step.repeatSteps.reduce((acc, s) => acc + s.duration, 0) * step.repeatCount
                              : step.duration
                            )}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-white">
                      <div className="space-y-1">
                        <p className="font-semibold">{step.name}</p>
                        <p>Zone {step.target.zone}</p>
                        {step.type === 'repeat' && (
                          <p>{step.repeatCount}x repetitions</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>

        {/* Workout summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="text-blue-400" size={20} />
                <div>
                  <div className="text-lg font-semibold text-white">{formatDuration(calculateMetrics.totalDuration)}</div>
                  <div className="text-sm text-gray-400">Total Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-red-400" size={20} />
                <div>
                  <div className="text-lg font-semibold text-white">{calculateMetrics.estimatedTSS}</div>
                  <div className="text-sm text-gray-400">Estimated TSS</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="text-green-400" size={20} />
                <div>
                  <div className="text-lg font-semibold text-white">{calculateMetrics.estimatedIF}</div>
                  <div className="text-sm text-gray-400">Estimated IF</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Workout Builder</h2>
          <p className="text-gray-400">Create professional training sessions with precise targeting</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={generateAISuggestions}
            className="border-red-600 text-red-400 hover:bg-red-600/10"
          >
            <Wand2 size={16} className="mr-2" />
            Smart Fill
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'editor' ? 'timeline' : 'editor')}
            className="border-zinc-700 text-gray-400 hover:text-white"
          >
            <Eye size={16} className="mr-2" />
            {viewMode === 'editor' ? 'Timeline' : 'Editor'}
          </Button>
        </div>
      </div>

      {/* Workout Details */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Workout Name</label>
                <Input
                  value={workout.name}
                  onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., 5x4min VO2max Intervals"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Sport</label>
                <Select
                  value={workout.sport}
                  onValueChange={(value: Sport) => setWorkout(prev => ({ ...prev, sport: value }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="cycling" className="text-white">🚴‍♂️ Cycling</SelectItem>
                    <SelectItem value="running" className="text-white">🏃‍♂️ Running</SelectItem>
                    <SelectItem value="swimming" className="text-white">🏊‍♂️ Swimming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                <Textarea
                  value={workout.description}
                  onChange={(e) => setWorkout(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Workout description and goals..."
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Workout Steps</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addStep('warmup')}
                    className="border-green-600 text-green-400 hover:bg-green-600/10"
                  >
                    <Plus size={16} className="mr-1" />
                    Warmup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addStep('work')}
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    <Plus size={16} className="mr-1" />
                    Work
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addStep('recovery')}
                    className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
                  >
                    <Plus size={16} className="mr-1" />
                    Recovery
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRepeatGroup}
                    className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
                  >
                    <Repeat size={16} className="mr-1" />
                    Repeat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addStep('cooldown')}
                    className="border-gray-600 text-gray-400 hover:bg-gray-600/10"
                  >
                    <Plus size={16} className="mr-1" />
                    Cooldown
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList className="bg-zinc-800 mb-6">
                  <TabsTrigger value="editor" className="data-[state=active]:bg-red-600">
                    Step Editor
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-red-600">
                    Timeline View
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="space-y-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {(workout.steps || []).map((step) => (
                        <div key={step.id}>
                          <StepEditor step={step} />
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {(!workout.steps || workout.steps.length === 0) && (
                    <div className="text-center py-12 text-gray-400">
                      <Activity size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No steps added yet. Click the buttons above to start building your workout.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="timeline">
                  <TimelineView />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Workout Summary */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Workout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-medium">{formatDuration(calculateMetrics.totalDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Est. TSS:</span>
                <span className="text-white font-medium">{calculateMetrics.estimatedTSS}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Est. IF:</span>
                <span className="text-white font-medium">{calculateMetrics.estimatedIF}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Difficulty:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < (workout.difficulty || 3) ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                    onClick={() => setWorkout(suggestion)}
                  >
                    <div className="font-medium text-white text-sm mb-1">{suggestion.name}</div>
                    <div className="text-xs text-gray-400">
                      {formatDuration(suggestion.totalDuration)} • TSS {suggestion.estimatedTSS}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={!workout.name || !workout.steps?.length}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Save size={16} className="mr-2" />
              Save Workout
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-zinc-700 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}