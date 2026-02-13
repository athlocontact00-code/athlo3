// Core ATHLO Domain Types

export interface ReadinessMetrics {
  sleepQuality: number;
  sleepHours: number;
  restingHeartRate?: number;
  hrv?: number;
  stressLevel: number;
  energyLevel: number;
  motivation: number;
  soreness: number;
  weight?: number;
  mood: number;
  hydration: number;
  nutrition: number;
}

export interface WorkoutMetrics {
  duration?: number;
  distance?: number;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgPower?: number;
  maxPower?: number;
  avgPace?: number;
  elevationGain?: number;
  trainingLoad?: number;
  zones?: ZoneDistribution;
  laps?: Lap[];
}

export interface ZoneDistribution {
  z1: number; // minutes in zone 1
  z2: number;
  z3: number;
  z4: number;
  z5: number;
}

export interface Lap {
  number: number;
  duration: number; // seconds
  distance?: number; // meters
  avgHeartRate?: number;
  avgPower?: number;
  avgPace?: number; // seconds per km
}

export interface WorkoutInterval {
  id: string;
  type: 'warmup' | 'work' | 'rest' | 'cooldown';
  duration?: number; // minutes
  distance?: number; // meters
  targetZone?: 'z1' | 'z2' | 'z3' | 'z4' | 'z5';
  targetHeartRate?: number;
  targetPower?: number;
  targetPace?: number; // seconds per km
  description?: string;
}

export interface TrainingWeek {
  weekStart: Date;
  weekEnd: Date;
  plannedLoad: number;
  actualLoad: number;
  compliance: number; // percentage
  workouts: WorkoutSummary[];
  readinessAvg: number;
  notes?: string;
}

export interface WorkoutSummary {
  id: string;
  name: string;
  sport: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'skipped';
  plannedDuration?: number;
  actualDuration?: number;
  trainingLoad?: number;
  rpe?: number;
  feeling?: number;
}

export interface LoadMetrics {
  acuteLoad: number; // 7-day average
  chronicLoad: number; // 42-day average
  trainingStressBalance: number; // chronic - acute
  monotony: number;
  strain: number;
  rampRate: number; // week-over-week change
}

export interface PerformanceMarkers {
  vo2Max?: number;
  functionalThresholdPower?: number;
  restingHeartRate?: number;
  maxHeartRate?: number;
  lactateThreshold?: number;
  criticalPower?: number;
  runningEconomy?: number;
}

export interface InsightCard {
  id: string;
  type: 'performance' | 'recovery' | 'training_load' | 'health' | 'recommendation';
  priority: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  explanation?: string; // AI explainability
  action?: string; // recommended action
  data?: any; // supporting chart/graph data
  validUntil?: Date;
  isRead: boolean;
}

export interface AICoachPrompt {
  id: string;
  text: string;
  category: 'training' | 'recovery' | 'nutrition' | 'general';
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    context?: string[];
  };
}

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

export interface DashboardCard {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  className?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'workout' | 'check-in' | 'race' | 'recovery' | 'other';
  color?: string;
  workoutId?: string;
  isCompleted?: boolean;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'athlete' | 'coach';
  isActive: boolean;
  joinedAt: Date;
}

export interface Integration {
  platform: 'strava' | 'garmin' | 'apple_health' | 'google_fit' | 'polar' | 'suunto' | 'wahoo';
  isConnected: boolean;
  lastSync?: Date;
  syncFrequency?: number; // seconds
  scope?: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface CheckInFormData {
  date: string;
  sleepQuality: number;
  sleepHours: number;
  stressLevel: number;
  energyLevel: number;
  motivation: number;
  soreness: number;
  mood: number;
  hydration: number;
  nutrition: number;
  weight?: number;
  restingHeartRate?: number;
  notes?: string;
}

export interface WorkoutFormData {
  name: string;
  sport: string;
  scheduledDate: string;
  description?: string;
  structure: WorkoutInterval[];
  notes?: string;
  estimatedDuration?: number;
}

// Utility Types
export type SportType = 'running' | 'cycling' | 'swimming' | 'triathlon' | 'football' | 'hyrox' | 'strength' | 'crossfit' | 'rowing' | 'other';
export type IntensityZone = 'z1' | 'z2' | 'z3' | 'z4' | 'z5';
export type UserRole = 'athlete' | 'coach' | 'admin';
export type WorkoutStatus = 'draft' | 'scheduled' | 'completed' | 'skipped';
export type MessageType = 'text' | 'workout' | 'media' | 'system';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// Component Props Types
export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}