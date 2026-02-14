'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/logo';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  SkipForward,
  Heart,
  Target,
  Trophy,
  Calendar,
  Zap,
  Activity,
  Timer,
  TrendingUp,
  Users,
  MessageCircle,
  Settings,
  Sparkles,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUserProfile } from '@/hooks/use-user-profile';

const trainingZones = [
  { zone: 1, name: 'Active Recovery', color: 'bg-gray-500', percentage: '50-60%', description: 'Very light activity' },
  { zone: 2, name: 'Aerobic Base', color: 'bg-blue-500', percentage: '60-70%', description: 'Comfortable, conversational pace' },
  { zone: 3, name: 'Aerobic', color: 'bg-green-500', percentage: '70-80%', description: 'Moderate effort, slightly breathless' },
  { zone: 4, name: 'Threshold', color: 'bg-yellow-500', percentage: '80-90%', description: 'Hard effort, uncomfortable' },
  { zone: 5, name: 'VO2 Max', color: 'bg-red-500', percentage: '90-100%', description: 'Maximum effort, unsustainable' },
];

const goalTypes = [
  { id: 'race', name: 'Race/Competition', icon: Trophy, description: 'Specific event or competition' },
  { id: 'fitness', name: 'General Fitness', icon: Heart, description: 'Improve overall health and fitness' },
  { id: 'weight', name: 'Weight Management', icon: TrendingUp, description: 'Lose weight or build muscle' },
  { id: 'skill', name: 'Skill Development', icon: Target, description: 'Master a new technique or movement' },
  { id: 'team', name: 'Team Performance', icon: Users, description: 'Improve team or group results' },
];

const integrations = [
  { 
    id: 'strava', 
    name: 'Strava', 
    logo: 'S', 
    color: 'bg-orange-500', 
    description: 'Import runs, rides, and activities',
    connected: false
  },
  { 
    id: 'garmin', 
    name: 'Garmin Connect', 
    logo: 'G', 
    color: 'bg-blue-600', 
    description: 'Sync workouts and health metrics',
    connected: false
  },
  { 
    id: 'polar', 
    name: 'Polar Flow', 
    logo: 'P', 
    color: 'bg-red-500', 
    description: 'Connect training data and recovery',
    connected: false
  },
  { 
    id: 'whoop', 
    name: 'WHOOP', 
    logo: 'W', 
    color: 'bg-black', 
    description: 'Import recovery and strain data',
    connected: false
  },
];

interface OnboardingState {
  restingHeartRate: string;
  maxHeartRate: string;
  goals: Array<{
    type: string;
    name: string;
    date: string;
    description: string;
  }>;
  selectedIntegrations: string[];
  completedSteps: number[];
}

export default function OnboardingPage() {
  const { profile, config } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingState>({
    restingHeartRate: '',
    maxHeartRate: '',
    goals: [],
    selectedIntegrations: [],
    completedSteps: [],
  });

  // Profile-specific onboarding steps
  const getProfileSteps = () => {
    switch (profile) {
      case 'coach':
        return {
          totalSteps: 5,
          steps: ['welcome', 'add-athlete', 'create-plan', 'team-setup', 'complete']
        };
      case 'athlete-coach':
        return {
          totalSteps: 5,
          steps: ['welcome', 'connect-coach', 'training-zones', 'first-checkin', 'complete']
        };
      case 'athlete-solo':
        return {
          totalSteps: 5,
          steps: ['welcome', 'training-zones', 'create-workout', 'first-checkin', 'complete']
        };
      case 'athlete-ai':
        return {
          totalSteps: 6,
          steps: ['welcome', 'meet-ai', 'goal-assessment', 'ai-plan', 'first-checkin', 'complete']
        };
      default:
        return {
          totalSteps: 5,
          steps: ['welcome', 'training-zones', 'goals', 'integrations', 'complete']
        };
    }
  };

  const { totalSteps } = getProfileSteps();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipStep = () => {
    setFormData(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, currentStep]
    }));
    handleNext();
  };

  const addGoal = (type: string) => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, {
        type,
        name: '',
        date: '',
        description: ''
      }]
    }));
  };

  const updateGoal = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <Badge variant="outline" className="text-xs">Setup</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSkipStep}>
                <SkipForward className="w-4 h-4 mr-1" />
                Skip
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep > i + 1 
                    ? 'bg-primary scale-110'
                    : currentStep === i + 1
                    ? 'bg-primary scale-125 ring-4 ring-primary/20'
                    : 'bg-muted'
                }`}
              />
              {i < totalSteps - 1 && (
                <div 
                  className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > i + 1 ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            className="max-w-2xl mx-auto"
          >
            {/* Step 1: Welcome - Profile Specific */}
            {currentStep === 1 && (
              <div className="text-center space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    {config.icon}
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute -top-2 -right-2 text-2xl"
                  >
                    🎉
                  </motion.div>
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    {profile === 'coach' 
                      ? 'Welcome, Coach!'
                      : profile === 'athlete-ai'
                        ? 'Welcome to AI-Powered Training!'
                        : 'Welcome to ATHLO!'
                    }
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                    {profile === 'coach' 
                      ? "Let's set up your coaching platform. We'll help you manage your athletes and create effective training plans."
                      : profile === 'athlete-coach'
                        ? "You're about to connect with your coach and start your personalized training journey."
                        : profile === 'athlete-ai'
                          ? "Get ready to train with our AI Coach. We'll create a personalized plan that adapts to your progress."
                          : "Let's set up your account in just a few steps. This will help us personalize your training experience."
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                  <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border">
                    <Heart className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Training Zones</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Set up your heart rate zones for accurate training
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border">
                    <Target className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Goals</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Define what you want to achieve this season
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border">
                    <Zap className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Integrations</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Connect your favorite fitness apps and devices
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Training Zones */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Set Up Your Training Zones
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Heart rate zones help optimize your training intensity
                  </p>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="restingHR">Resting Heart Rate (bpm)</Label>
                      <Input
                        id="restingHR"
                        type="number"
                        placeholder="e.g. 60"
                        value={formData.restingHeartRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, restingHeartRate: e.target.value }))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Measure when you first wake up
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="maxHR">Maximum Heart Rate (bpm)</Label>
                      <Input
                        id="maxHR"
                        type="number"
                        placeholder="e.g. 190"
                        value={formData.maxHeartRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxHeartRate: e.target.value }))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Or use formula: 220 - age
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground mb-3">Your Training Zones</h3>
                    {trainingZones.map((zone, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className={`w-4 h-4 rounded-full ${zone.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">
                              Zone {zone.zone}: {zone.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {zone.percentage} max HR
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{zone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Don't know your exact values? No worries! 
                    ATHLO can estimate them based on your training data, and you can always update them later.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Season Goals */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Set Your Season Goals
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    What do you want to achieve? Add your targets and events.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {goalTypes.map((goalType) => {
                    const Icon = goalType.icon;
                    return (
                      <button
                        key={goalType.id}
                        onClick={() => addGoal(goalType.id)}
                        className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-card/50 transition-all group"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-medium text-foreground">{goalType.name}</h3>
                            <p className="text-sm text-muted-foreground">{goalType.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Goals List */}
                {formData.goals.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Your Goals</h3>
                    {formData.goals.map((goal, index) => (
                      <div key={index} className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="outline">
                            {goalTypes.find(gt => gt.id === goal.type)?.name}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGoal(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ✕
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`goal-name-${index}`}>Goal/Event Name</Label>
                            <Input
                              id={`goal-name-${index}`}
                              placeholder="e.g. Boston Marathon, Summer Cut"
                              value={goal.name}
                              onChange={(e) => updateGoal(index, 'name', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`goal-date-${index}`}>Target Date</Label>
                            <Input
                              id={`goal-date-${index}`}
                              type="date"
                              value={goal.date}
                              onChange={(e) => updateGoal(index, 'date', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor={`goal-description-${index}`}>Description (optional)</Label>
                          <Input
                            id={`goal-description-${index}`}
                            placeholder="What specifically do you want to achieve?"
                            value={goal.description}
                            onChange={(e) => updateGoal(index, 'description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.goals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Click on a goal type above to add your first goal</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Connect Integrations */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Connect Your Apps
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Import your existing training data and sync future workouts
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="bg-card rounded-xl p-6 border border-border">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-bold">{integration.logo}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={integration.connected ? "secondary" : "outline"}
                        className="w-full"
                        onClick={() => {
                          // Handle integration connection
                          console.log(`Connecting to ${integration.name}`);
                        }}
                      >
                        {integration.connected ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Connected
                          </>
                        ) : (
                          'Connect'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    🔒 <strong>Secure:</strong> We use OAuth 2.0 for all connections. 
                    Your login credentials are never stored, and you can disconnect anytime.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: First Check-in Walkthrough */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    You're All Set! 🎉
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Let's do your first check-in to get started
                  </p>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Quick Daily Check-in
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>How are you feeling today?</Label>
                      <div className="flex gap-2 mt-2">
                        {['😴', '😐', '😊', '🔥', '💪'].map((emoji, i) => (
                          <button key={i} className="w-12 h-12 rounded-lg border border-border hover:border-primary transition-colors text-xl">
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Sleep Quality (1-10)</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10" 
                        placeholder="8"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Stress Level (1-10)</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10" 
                        placeholder="3"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Energy Level (1-10)</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10" 
                        placeholder="7"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">What's Next?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                      <Calendar className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium text-foreground">Plan Your Week</h4>
                        <p className="text-sm text-muted-foreground">Schedule workouts and activities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                      <Activity className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium text-foreground">Log First Workout</h4>
                        <p className="text-sm text-muted-foreground">Record your training session</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                      <Users className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium text-foreground">Find Athletes</h4>
                        <p className="text-sm text-muted-foreground">Connect with training partners</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                      <Settings className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium text-foreground">Customize Settings</h4>
                        <p className="text-sm text-muted-foreground">Personalize your experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 max-w-2xl mx-auto">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/dashboard">
              <Button className="ml-auto">
                Go to Dashboard
                <Play className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}