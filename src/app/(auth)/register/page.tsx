'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/common/logo';
import { SportSelector } from '@/components/common/sport-selector';
import { 
  ArrowRight, 
  ArrowLeft, 
  User,
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  CheckCircle,
  Github,
  Chrome,
  Apple,
  Users,
  Bot,
  Trophy,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export type UserProfile = 'coach' | 'athlete-with-coach' | 'athlete-solo' | 'athlete-ai-coach';

interface RegistrationState {
  // Step 1: Credentials
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  
  // Step 2: Profile Type
  profileType: UserProfile | null;
  
  // Step 3: Sports
  selectedSports: string[];
  
  // Step 4: Basic Profile
  name: string;
  avatar: File | null;
}

const profileTypes = [
  {
    id: 'coach' as UserProfile,
    icon: Users,
    emoji: '👨‍🏫',
    title: "I'm a Coach",
    description: 'Manage athletes, create plans, monitor performance'
  },
  {
    id: 'athlete-with-coach' as UserProfile,
    icon: User,
    emoji: '🏃',
    title: 'I train with a Coach',
    description: 'My coach is on ATHLO, I receive plans and report data'
  },
  {
    id: 'athlete-solo' as UserProfile,
    icon: Trophy,
    emoji: '💪',
    title: 'I train Solo',
    description: 'I manage my own training and health data'
  },
  {
    id: 'athlete-ai-coach' as UserProfile,
    icon: Bot,
    emoji: '🤖',
    title: 'I want AI Coach',
    description: 'ATHLO AI creates my plans and guides my training'
  }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationState>({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    profileType: null,
    selectedSports: [],
    name: '',
    avatar: null,
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSportsChange = (sports: string[]) => {
    setFormData(prev => ({ ...prev, selectedSports: sports }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.email && 
               formData.password && 
               formData.confirmPassword && 
               formData.password === formData.confirmPassword &&
               formData.password.length >= 8 &&
               formData.agreeToTerms;
      case 2:
        return formData.profileType;
      case 3:
        return formData.selectedSports.length > 0;
      case 4:
        return formData.name.trim().length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      // New users should go through onboarding
      window.location.href = '/onboarding';
    }, 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="text-center p-8 border-b border-border/30">
            <Link href="/" className="inline-block mb-4">
              <Logo size="md" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join ATHLO
            </h1>
            <p className="text-muted-foreground">
              Create your account and start your training journey
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center py-6 bg-muted/20">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
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
                    className={`w-8 h-0.5 mx-2 transition-all ${
                      currentStep > i + 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-8">
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
                      <h2 className="text-2xl font-semibold text-foreground mb-2">
                        Let's get started
                      </h2>
                      <p className="text-muted-foreground">
                        Create your account with email or social login
                      </p>
                    </div>

                    {/* Social Login Options */}
                    <div className="grid grid-cols-1 gap-3">
                      <Button variant="outline" className="w-full h-12" type="button">
                        <Chrome className="w-5 h-5 mr-3" />
                        Continue with Google
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-12" type="button">
                          <Apple className="w-5 h-5 mr-2" />
                          Apple
                        </Button>
                        <Button variant="outline" className="h-12" type="button">
                          <Github className="w-5 h-5 mr-2" />
                          GitHub
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-4 text-muted-foreground font-medium">Or continue with email</span>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 pr-10 h-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {formData.password && formData.password.length < 8 && (
                          <p className="text-sm text-destructive">Password must be at least 8 characters</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10 pr-10 h-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-sm text-destructive">Passwords do not match</p>
                        )}
                      </div>

                      <div className="flex items-start space-x-3 pt-2">
                        <Checkbox 
                          id="terms" 
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                          className="mt-0.5"
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
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

                {/* Step 2: Choose Profile Type */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Choose your profile
                      </h2>
                      <p className="text-muted-foreground">
                        Select the option that best describes how you'll use ATHLO
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profileTypes.map((profile) => {
                        const Icon = profile.icon;
                        const isSelected = formData.profileType === profile.id;
                        
                        return (
                          <motion.button
                            key={profile.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, profileType: profile.id }))}
                            className={`group p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border hover:border-primary/50 hover:bg-muted/30'
                            }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl transition-all ${
                                isSelected 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted group-hover:bg-primary/20'
                              }`}>
                                <span className="text-2xl">{profile.emoji}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                                  {profile.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {profile.description}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Choose Sports */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold text-foreground mb-3">
                        What sports do you do?
                      </h2>
                      <p className="text-muted-foreground">
                        Select all that apply. You can always add more later.
                      </p>
                    </div>

                    <SportSelector
                      selectedSports={formData.selectedSports}
                      onSportsChange={handleSportsChange}
                      multiSelect={true}
                      placeholder="Search sports..."
                    />
                  </div>
                )}

                {/* Step 4: Basic Profile */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Complete your profile
                      </h2>
                      <p className="text-muted-foreground">
                        Just a few more details to personalize your experience
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                          {formData.avatar ? (
                            <img 
                              src={URL.createObjectURL(formData.avatar)} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-white" />
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Add photo (optional)
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Confirmation */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground mb-3">
                        You're all set!
                      </h2>
                      <p className="text-muted-foreground">
                        Review your information and create your account
                      </p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                          <span className="text-xl">
                            {profileTypes.find(p => p.id === formData.profileType)?.emoji}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{formData.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {profileTypes.find(p => p.id === formData.profileType)?.title}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-foreground mb-2">
                          Sports ({formData.selectedSports.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {formData.selectedSports.slice(0, 5).map((sportId) => {
                            const displayName = sportId.charAt(0).toUpperCase() + sportId.slice(1).replace(/-/g, ' ');
                            
                            return (
                              <div key={sportId} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                🏃‍♂️ {displayName}
                              </div>
                            );
                          })}
                          {formData.selectedSports.length > 5 && (
                            <div className="text-xs text-muted-foreground px-2 py-1">
                              +{formData.selectedSports.length - 5} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-600 mb-1">14-Day Free Trial</div>
                          <div className="text-sm text-green-600/80">
                            No credit card required. Full access to all features during your trial.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handlePrevious} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              ) : (
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Back to home
                </Link>
              )}

              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!canProceed()}
                  className="ml-auto flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  className="ml-auto flex items-center gap-2"
                  onClick={handleComplete}
                  disabled={!canProceed() || isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center p-6 bg-muted/20 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}