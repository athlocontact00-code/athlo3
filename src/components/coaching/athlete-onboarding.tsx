'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Award, 
  Target, 
  Calendar, 
  Heart, 
  Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  fields: string[];
}

interface FormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Sport & Experience
  primarySport: string;
  experience: string;
  currentLevel: string;
  previousCoaching: string;
  personalBests: string;
  
  // Goals & Targets
  shortTermGoals: string[];
  longTermGoals: string[];
  targetRaces: string[];
  motivations: string[];
  
  // Availability & Preferences
  trainingDays: string[];
  preferredTimes: string[];
  trainingLocation: string;
  equipmentAccess: string[];
  
  // Health & Limitations
  injuries: string;
  medicalConditions: string;
  medications: string;
  limitations: string;
  emergencyContact: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Tell us about yourself',
    icon: User,
    fields: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'],
  },
  {
    id: 2,
    title: 'Sport & Experience',
    description: 'Your athletic background',
    icon: Award,
    fields: ['primarySport', 'experience', 'currentLevel', 'previousCoaching', 'personalBests'],
  },
  {
    id: 3,
    title: 'Goals & Targets',
    description: 'What do you want to achieve?',
    icon: Target,
    fields: ['shortTermGoals', 'longTermGoals', 'targetRaces', 'motivations'],
  },
  {
    id: 4,
    title: 'Availability & Preferences',
    description: 'When and how you like to train',
    icon: Calendar,
    fields: ['trainingDays', 'preferredTimes', 'trainingLocation', 'equipmentAccess'],
  },
  {
    id: 5,
    title: 'Health & Limitations',
    description: 'Important health information',
    icon: Heart,
    fields: ['injuries', 'medicalConditions', 'medications', 'limitations', 'emergencyContact'],
  },
];

const sportOptions = ['Running', 'Cycling', 'Swimming', 'Triathlon', 'CrossFit', 'Strength Training'];
const experienceOptions = ['Beginner (0-1 years)', 'Intermediate (2-5 years)', 'Advanced (5+ years)', 'Elite/Professional'];
const levelOptions = ['Recreational', 'Competitive Amateur', 'Semi-Professional', 'Professional'];
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Early Morning (5-8 AM)', 'Morning (8-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-8 PM)', 'Night (8+ PM)'];
const equipmentOptions = ['Gym', 'Pool', 'Track', 'Bike', 'Treadmill', 'Weights', 'Heart Rate Monitor'];

export function AthleteOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    primarySport: '',
    experience: '',
    currentLevel: '',
    previousCoaching: '',
    personalBests: '',
    shortTermGoals: [],
    longTermGoals: [],
    targetRaces: [],
    motivations: [],
    trainingDays: [],
    preferredTimes: [],
    trainingLocation: '',
    equipmentAccess: [],
    injuries: '',
    medicalConditions: '',
    medications: '',
    limitations: '',
    emergencyContact: '',
  });

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const isSelected = currentArray.includes(value);
      return {
        ...prev,
        [field]: isSelected 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const isStepComplete = (stepId: number) => {
    const step = onboardingSteps.find(s => s.id === stepId);
    if (!step) return false;
    
    return step.fields.every(field => {
      const value = formData[field as keyof FormData];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map(option => (
                    <Button
                      key={option}
                      variant={formData.gender === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange('gender', option)}
                      className={cn(
                        formData.gender === option && "bg-red-600 hover:bg-red-700"
                      )}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Sport *</label>
              <div className="flex flex-wrap gap-2">
                {sportOptions.map(sport => (
                  <Button
                    key={sport}
                    variant={formData.primarySport === sport ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('primarySport', sport)}
                    className={cn(
                      formData.primarySport === sport && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {sport}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Experience Level *</label>
              <div className="space-y-2">
                {experienceOptions.map(exp => (
                  <Button
                    key={exp}
                    variant={formData.experience === exp ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('experience', exp)}
                    className={cn(
                      "w-full justify-start",
                      formData.experience === exp && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {exp}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Current Level *</label>
              <div className="flex flex-wrap gap-2">
                {levelOptions.map(level => (
                  <Button
                    key={level}
                    variant={formData.currentLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('currentLevel', level)}
                    className={cn(
                      formData.currentLevel === level && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Previous Coaching Experience *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={3}
                value={formData.previousCoaching}
                onChange={(e) => handleInputChange('previousCoaching', e.target.value)}
                placeholder="Describe any previous coaching experience or self-guided training..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Short-term Goals (3-6 months) *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={2}
                value={formData.shortTermGoals.join(', ')}
                onChange={(e) => handleInputChange('shortTermGoals', e.target.value)}
                placeholder="Complete a 5K, improve 10K time, build endurance..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Long-term Goals (6+ months) *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={2}
                value={formData.longTermGoals.join(', ')}
                onChange={(e) => handleInputChange('longTermGoals', e.target.value)}
                placeholder="Run a marathon, qualify for Boston, compete in triathlon..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Target Races/Events *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={2}
                value={formData.targetRaces.join(', ')}
                onChange={(e) => handleInputChange('targetRaces', e.target.value)}
                placeholder="City Marathon 2024, Local 10K series, Ironman..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">What motivates you? *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={3}
                value={formData.motivations.join(', ')}
                onChange={(e) => handleInputChange('motivations', e.target.value)}
                placeholder="Health, competition, personal challenge, social aspect..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Available Training Days *</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <Button
                    key={day}
                    variant={formData.trainingDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMultiSelect('trainingDays', day)}
                    className={cn(
                      formData.trainingDays.includes(day) && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Training Times *</label>
              <div className="space-y-2">
                {timeSlots.map(time => (
                  <Button
                    key={time}
                    variant={formData.preferredTimes.includes(time) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMultiSelect('preferredTimes', time)}
                    className={cn(
                      "w-full justify-start",
                      formData.preferredTimes.includes(time) && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Primary Training Location *</label>
              <Input
                value={formData.trainingLocation}
                onChange={(e) => handleInputChange('trainingLocation', e.target.value)}
                placeholder="Home gym, local park, fitness center..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Equipment Access *</label>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map(equipment => (
                  <Button
                    key={equipment}
                    variant={formData.equipmentAccess.includes(equipment) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMultiSelect('equipmentAccess', equipment)}
                    className={cn(
                      formData.equipmentAccess.includes(equipment) && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {equipment}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current/Past Injuries *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={2}
                value={formData.injuries}
                onChange={(e) => handleInputChange('injuries', e.target.value)}
                placeholder="Describe any current or past injuries that might affect training..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Medical Conditions *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={2}
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                placeholder="Any medical conditions we should be aware of..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Medications *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={2}
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                placeholder="Current medications that might affect training..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Physical Limitations *</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background resize-none"
                rows={2}
                value={formData.limitations}
                onChange={(e) => handleInputChange('limitations', e.target.value)}
                placeholder="Any physical limitations or restrictions..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Emergency Contact *</label>
              <Input
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Name and phone number of emergency contact"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);
  const Icon = currentStepData?.icon || User;

  return (
    <Card className="max-w-4xl mx-auto p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {onboardingSteps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                step.id < currentStep 
                  ? 'bg-green-600 text-white' 
                  : step.id === currentStep 
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-400'
              )}>
                {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {step.id < onboardingSteps.length && (
                <div className={cn(
                  'h-1 w-16 mx-2 rounded transition-colors',
                  step.id < currentStep ? 'bg-green-600' : 'bg-gray-700'
                )} />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Step {currentStep} of {onboardingSteps.length}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-red-950/20 border border-red-600/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{currentStepData?.title}</h2>
              <p className="text-sm text-muted-foreground">{currentStepData?.description}</p>
            </div>
          </div>
          
          {renderStepContent()}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          {isStepComplete(currentStep) && (
            <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-600/30">
              <Check className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!isStepComplete(currentStep)}
          className="gap-2 bg-red-600 hover:bg-red-700"
        >
          {currentStep === onboardingSteps.length ? 'Complete' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}