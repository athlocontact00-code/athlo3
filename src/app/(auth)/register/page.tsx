'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/common/logo';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Users, 
  Mail, 
  Lock, 
  Trophy,
  CheckCircle,
  Github,
  Chrome,
  Apple,
  Dumbbell,
  Timer,
  Bike,
  Footprints,
  Waves,
  Users2,
  Sword,
  Mountain,
  CircleDot,
  Flame,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const sports = [
  { id: 'running', icon: Footprints, name: 'Running' },
  { id: 'cycling', icon: Bike, name: 'Cycling' },
  { id: 'swimming', icon: Waves, name: 'Swimming' },
  { id: 'crossfit', icon: Dumbbell, name: 'CrossFit' },
  { id: 'football', icon: Users2, name: 'Football' },
  { id: 'basketball', icon: Trophy, name: 'Basketball' },
  { id: 'mma', icon: Sword, name: 'MMA' },
  { id: 'climbing', icon: Mountain, name: 'Climbing' },
  { id: 'tennis', icon: CircleDot, name: 'Tennis' },
  { id: 'hyrox', icon: Timer, name: 'HYROX' },
  { id: 'yoga', icon: Flame, name: 'Yoga' },
  { id: 'triathlon', icon: Activity, name: 'Triathlon' },
];

const experienceLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Just starting my journey' },
  { id: 'intermediate', name: 'Intermediate', description: '1-3 years of experience' },
  { id: 'advanced', name: 'Advanced', description: '3+ years, competing regularly' },
  { id: 'elite', name: 'Elite/Pro', description: 'Professional or elite level' },
];

interface RegistrationState {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'athlete' | 'coach' | null;
  name: string;
  selectedSports: string[];
  experienceLevel: string;
  agreeToTerms: boolean;
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationState>({
    email: '',
    password: '',
    confirmPassword: '',
    role: null,
    name: '',
    selectedSports: [],
    experienceLevel: '',
    agreeToTerms: false,
  });

  const totalSteps = 4;

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

  const handleSportToggle = (sportId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(sportId)
        ? prev.selectedSports.filter(id => id !== sportId)
        : [...prev.selectedSports, sportId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && formData.agreeToTerms;
      case 2:
        return formData.role;
      case 3:
        return formData.name && formData.selectedSports.length > 0 && formData.experienceLevel;
      default:
        return true;
    }
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
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Logo size="md" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join thousands of athletes and coaches on ATHLO
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > i + 1 
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === i + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div 
                    className={`w-12 h-0.5 mx-2 transition-colors ${
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
                opacity: { duration: 0.2 }
              }}
            >
              {/* Step 1: Email & Password */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Let's start with the basics
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Create your account credentials
                    </p>
                  </div>

                  {/* Social Auth Options */}
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" type="button">
                      <Github className="w-4 h-4 mr-2" />
                      Continue with GitHub
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                      <Chrome className="w-4 h-4 mr-2" />
                      Continue with Google
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                      <Apple className="w-4 h-4 mr-2" />
                      Continue with Apple
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="mt-1"
                      />
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">Passwords do not match</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                      />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Choose Role */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      What describes you best?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      This helps us customize your experience
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'athlete' }))}
                      className={`w-full p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                        formData.role === 'athlete'
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          formData.role === 'athlete' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <User className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-foreground">I'm an Athlete</h3>
                          <p className="text-sm text-muted-foreground">
                            I train, compete, and want to improve my performance
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'coach' }))}
                      className={`w-full p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                        formData.role === 'coach'
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          formData.role === 'coach' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-foreground">I'm a Coach</h3>
                          <p className="text-sm text-muted-foreground">
                            I guide, train, and develop athletes to reach their potential
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Basic Profile */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Tell us about yourself
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Help us personalize your ATHLO experience
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Sports & Activities</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select all that apply to you
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {sports.map((sport) => {
                          const Icon = sport.icon;
                          const isSelected = formData.selectedSports.includes(sport.id);
                          return (
                            <button
                              key={sport.id}
                              type="button"
                              onClick={() => handleSportToggle(sport.id)}
                              className={`p-3 rounded-lg border transition-all text-sm flex items-center gap-2 ${
                                isSelected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {sport.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label>Experience Level</Label>
                      <div className="space-y-2 mt-2">
                        {experienceLevels.map((level) => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.id }))}
                            className={`w-full p-3 rounded-lg border transition-all text-left ${
                              formData.experienceLevel === level.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium text-foreground">{level.name}</div>
                            <div className="text-sm text-muted-foreground">{level.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Integrations */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Connect your data
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Import your existing workout data (optional)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" type="button">
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      Connect Strava
                    </Button>

                    <Button variant="outline" className="w-full justify-start" type="button">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      Connect Garmin
                    </Button>

                    <Button variant="outline" className="w-full justify-start" type="button">
                      <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      Connect Polar
                    </Button>

                    <div className="text-center pt-4">
                      <Button variant="ghost" type="button">
                        Skip for now
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mt-6">
                    <h3 className="font-medium text-foreground mb-2">Ready to get started!</h3>
                    <p className="text-sm text-muted-foreground">
                      You can always connect more services later from your settings.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="ml-auto"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="ml-auto"
                onClick={() => {
                  // Handle final registration submission
                  console.log('Registration complete:', formData);
                }}
              >
                Create Account
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="flex items-center justify-center p-12">
          <div className="text-center max-w-md">
            <Badge variant="outline" className="mb-6 border-primary/20 text-primary">
              🇵🇱 Built in Poland
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Join the Universal Sports Platform
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're training for your first 5K or coaching elite athletes, 
              ATHLO adapts to your sport and your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}