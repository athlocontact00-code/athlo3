'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Heart,
  MessageCircle,
  Moon,
  TrendingUp,
  Zap,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Target,
  Coffee,
  Droplets
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface CheckInData {
  sleep: number;
  energy: number;
  mood: number;
  stress: number;
  motivation: number;
  notes: string;
  hydration: number;
  nutrition: number;
}

interface DiaryEntry {
  id: string;
  date: Date;
  checkIn?: CheckInData;
  workoutCompleted?: boolean;
  workoutFeedback?: string;
  aiInsights?: string[];
  readinessScore?: number;
}

export default function DiaryPage() {
  const [activeTab, setActiveTab] = useState('today');
  const [historyDate, setHistoryDate] = useState(new Date());
  const [checkInData, setCheckInData] = useState<CheckInData>({
    sleep: 7,
    energy: 7,
    mood: 7,
    stress: 3,
    motivation: 8,
    notes: '',
    hydration: 6,
    nutrition: 7,
  });
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // Mock data for history
  const diaryEntries: DiaryEntry[] = [
    {
      id: '1',
      date: new Date(),
      checkIn: checkInData,
      workoutCompleted: true,
      workoutFeedback: "Great morning run! Felt strong throughout the 8km session.",
      readinessScore: 78,
      aiInsights: ["Your running pace improved by 3% compared to last week", "Recovery metrics suggest you're adapting well to training load"]
    },
    {
      id: '2',
      date: subDays(new Date(), 1),
      checkIn: {
        sleep: 6,
        energy: 6,
        mood: 8,
        stress: 4,
        motivation: 7,
        notes: 'Felt a bit tired but mentally ready to train',
        hydration: 5,
        nutrition: 8,
      },
      workoutCompleted: true,
      workoutFeedback: "Strength training session was challenging but rewarding.",
      readinessScore: 72,
    },
    {
      id: '3',
      date: subDays(new Date(), 2),
      checkIn: {
        sleep: 8,
        energy: 8,
        mood: 9,
        stress: 2,
        motivation: 9,
        notes: 'Perfect sleep, feeling great!',
        hydration: 8,
        nutrition: 8,
      },
      workoutCompleted: false,
      readinessScore: 85,
    },
  ];

  const todayWorkout = {
    title: "Morning Run",
    time: "07:00",
    duration: "45 min",
    type: "Easy Run",
    targetDistance: "8 km",
  };

  const handleCheckIn = () => {
    // In real app, would save to database
    setHasCheckedIn(true);
    // Calculate readiness score based on check-in data
  };

  const handleSliderChange = (key: keyof CheckInData, value: number[]) => {
    setCheckInData(prev => ({ ...prev, [key]: value[0] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Training Diary</h1>
        <p className="text-muted-foreground">
          Track your daily readiness and training progress
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6 mt-6">
            <AnimatePresence mode="wait">
              {!hasCheckedIn ? (
                <motion.div
                  key="checkin-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Pre-flight Card - Today's Workout */}
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Target className="h-5 w-5" />
                        Today's Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{todayWorkout.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {todayWorkout.time}
                            </span>
                            <span>{todayWorkout.duration}</span>
                            <span>{todayWorkout.targetDistance}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{todayWorkout.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Check-in Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Daily Check-in
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        How are you feeling today? This helps us personalize your training.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sleep Quality */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Sleep Quality
                            </Label>
                            <span className={cn("font-semibold", getScoreColor(checkInData.sleep))}>
                              {checkInData.sleep}/10 • {getScoreLabel(checkInData.sleep)}
                            </span>
                          </div>
                          <Slider
                            value={[checkInData.sleep]}
                            onValueChange={(value) => handleSliderChange('sleep', value)}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                        </div>

                        {/* Energy Level */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Energy Level
                            </Label>
                            <span className={cn("font-semibold", getScoreColor(checkInData.energy))}>
                              {checkInData.energy}/10 • {getScoreLabel(checkInData.energy)}
                            </span>
                          </div>
                          <Slider
                            value={[checkInData.energy]}
                            onValueChange={(value) => handleSliderChange('energy', value)}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                        </div>

                        {/* Mood */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Mood
                            </Label>
                            <span className={cn("font-semibold", getScoreColor(checkInData.mood))}>
                              {checkInData.mood}/10 • {getScoreLabel(checkInData.mood)}
                            </span>
                          </div>
                          <Slider
                            value={[checkInData.mood]}
                            onValueChange={(value) => handleSliderChange('mood', value)}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                        </div>

                        {/* Stress Level */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Stress Level
                            </Label>
                            <span className={cn("font-semibold", getScoreColor(10 - checkInData.stress))}>
                              {checkInData.stress}/10 • {checkInData.stress <= 3 ? 'Low' : checkInData.stress <= 6 ? 'Medium' : 'High'}
                            </span>
                          </div>
                          <Slider
                            value={[checkInData.stress]}
                            onValueChange={(value) => handleSliderChange('stress', value)}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                        </div>

                        {/* Motivation */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Motivation
                            </Label>
                            <span className={cn("font-semibold", getScoreColor(checkInData.motivation))}>
                              {checkInData.motivation}/10 • {getScoreLabel(checkInData.motivation)}
                            </span>
                          </div>
                          <Slider
                            value={[checkInData.motivation]}
                            onValueChange={(value) => handleSliderChange('motivation', value)}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                        </div>

                        {/* Hydration */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Droplets className="h-4 w-4" />
                              Hydration
                            </Label>
                            <span className={cn("font-semibold", getScoreColor(checkInData.hydration))}>
                              {checkInData.hydration}/10 • {getScoreLabel(checkInData.hydration)}
                            </span>
                          </div>
                          <Slider
                            value={[checkInData.hydration]}
                            onValueChange={(value) => handleSliderChange('hydration', value)}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          How are you feeling? Any notes?
                        </Label>
                        <Textarea
                          value={checkInData.notes}
                          onChange={(e) => setCheckInData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="e.g., Slept well but feeling a bit tired from yesterday's workout..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button 
                        onClick={handleCheckIn}
                        className="w-full"
                        size="lg"
                      >
                        Complete Check-in
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="checkin-complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Readiness Summary */}
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                          <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Check-in Complete!</h3>
                        <p className="text-muted-foreground mb-4">
                          Your readiness score has been calculated
                        </p>
                        <div className="text-4xl font-bold text-primary mb-2">78</div>
                        <Badge className="mb-4">Good for moderate training</Badge>
                        <div className="text-sm text-muted-foreground">
                          Based on your sleep quality, energy levels, and overall wellness metrics
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Post-Workout Feedback */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coffee className="h-5 w-5 text-primary" />
                        Post-Workout Reflection
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        How did your workout feel? (Complete after training)
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="How did the workout feel? Any observations about performance, energy, or technique..."
                        className="min-h-[100px]"
                      />
                      <Button variant="outline">
                        Save Reflection
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* History Navigation */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Training History
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setHistoryDate(subDays(historyDate, 7))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[120px] text-center">
                        {format(historyDate, 'MMM yyyy')}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setHistoryDate(addDays(historyDate, 7))}
                        disabled={historyDate >= new Date()}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {diaryEntries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {format(entry.date, 'EEEE, MMM d')}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {format(entry.date, 'yyyy')}
                            </p>
                          </div>
                          {entry.readinessScore && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {entry.readinessScore}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Readiness
                              </div>
                            </div>
                          )}
                        </div>

                        {entry.checkIn && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="text-sm">
                              <div className="text-muted-foreground">Sleep</div>
                              <div className={cn("font-semibold", getScoreColor(entry.checkIn.sleep))}>
                                {entry.checkIn.sleep}/10
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="text-muted-foreground">Energy</div>
                              <div className={cn("font-semibold", getScoreColor(entry.checkIn.energy))}>
                                {entry.checkIn.energy}/10
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="text-muted-foreground">Mood</div>
                              <div className={cn("font-semibold", getScoreColor(entry.checkIn.mood))}>
                                {entry.checkIn.mood}/10
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="text-muted-foreground">Stress</div>
                              <div className={cn("font-semibold", getScoreColor(10 - entry.checkIn.stress))}>
                                {entry.checkIn.stress}/10
                              </div>
                            </div>
                          </div>
                        )}

                        {entry.checkIn?.notes && (
                          <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm text-foreground">"{entry.checkIn.notes}"</p>
                          </div>
                        )}

                        {entry.workoutFeedback && (
                          <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <h5 className="text-sm font-medium text-foreground mb-1">Workout Reflection</h5>
                            <p className="text-sm text-muted-foreground">{entry.workoutFeedback}</p>
                          </div>
                        )}

                        {entry.aiInsights && entry.aiInsights.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-foreground">AI Insights</h5>
                            {entry.aiInsights.map((insight, index) => (
                              <div key={index} className="text-sm text-muted-foreground bg-muted/20 p-2 rounded">
                                {insight}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}