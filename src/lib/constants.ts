// ATHLO Constants

export const APP_NAME = 'ATHLO';
export const APP_DESCRIPTION = 'Premium digital platform for endurance sports with coaching, social, and AI layers';

// Sports Configuration
export const SPORTS = {
  running: { label: 'Running', icon: '🏃', color: '#ef4444' },
  cycling: { label: 'Cycling', icon: '🚴', color: '#f97316' },
  swimming: { label: 'Swimming', icon: '🏊', color: '#06b6d4' },
  triathlon: { label: 'Triathlon', icon: '🏊🚴🏃', color: '#8b5cf6' },
  football: { label: 'Football', icon: '⚽', color: '#10b981' },
  hyrox: { label: 'HYROX', icon: '💪', color: '#dc2626' },
  strength: { label: 'Strength', icon: '🏋️', color: '#475569' },
  crossfit: { label: 'CrossFit', icon: '🤸', color: '#f59e0b' },
  rowing: { label: 'Rowing', icon: '🚣', color: '#3b82f6' },
  other: { label: 'Other', icon: '🏃', color: '#6b7280' },
} as const;

// Intensity Zones
export const INTENSITY_ZONES = {
  z1: { label: 'Zone 1', color: '#10b981', description: 'Recovery' },
  z2: { label: 'Zone 2', color: '#06b6d4', description: 'Aerobic Base' },
  z3: { label: 'Zone 3', color: '#f59e0b', description: 'Tempo' },
  z4: { label: 'Zone 4', color: '#f97316', description: 'Lactate Threshold' },
  z5: { label: 'Zone 5', color: '#ef4444', description: 'VO2 Max' },
} as const;

// Rating Scales
export const FEELING_SCALE = {
  1: { label: 'Terrible', emoji: '😞', color: '#ef4444' },
  2: { label: 'Poor', emoji: '😕', color: '#f97316' },
  3: { label: 'Average', emoji: '😐', color: '#f59e0b' },
  4: { label: 'Good', emoji: '🙂', color: '#06b6d4' },
  5: { label: 'Excellent', emoji: '😄', color: '#10b981' },
} as const;

export const RPE_SCALE = {
  1: { label: 'Very Easy', description: 'Could maintain for hours' },
  2: { label: 'Easy', description: 'Comfortable, conversational pace' },
  3: { label: 'Moderate', description: 'Comfortably hard' },
  4: { label: 'Hard', description: 'Hard but sustainable' },
  5: { label: 'Very Hard', description: 'Very hard, approaching limit' },
  6: { label: 'Max Effort', description: 'Maximum effort' },
} as const;

// Readiness Score Ranges
export const READINESS_RANGES = {
  excellent: { min: 85, max: 100, label: 'Excellent', color: '#10b981' },
  good: { min: 70, max: 84, label: 'Good', color: '#06b6d4' },
  fair: { min: 55, max: 69, label: 'Fair', color: '#f59e0b' },
  poor: { min: 40, max: 54, label: 'Poor', color: '#f97316' },
  very_poor: { min: 0, max: 39, label: 'Very Poor', color: '#ef4444' },
} as const;

// Training Load Ranges
export const TRAINING_LOAD_RANGES = {
  low: { min: 0, max: 150, label: 'Low', color: '#10b981' },
  moderate: { min: 151, max: 300, label: 'Moderate', color: '#f59e0b' },
  high: { min: 301, max: 450, label: 'High', color: '#f97316' },
  very_high: { min: 451, max: 999, label: 'Very High', color: '#ef4444' },
} as const;

// Navigation Items
export const NAVIGATION_ITEMS = [
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: 'LayoutDashboard',
    description: 'Overview and Focus Day'
  },
  { 
    label: 'Calendar', 
    href: '/dashboard/calendar', 
    icon: 'Calendar',
    description: 'Training schedule'
  },
  { 
    label: 'Diary', 
    href: '/dashboard/diary', 
    icon: 'BookOpen',
    description: 'Check-ins and logs'
  },
  { 
    label: 'Plan', 
    href: '/dashboard/plan', 
    icon: 'Target',
    description: 'Training plans'
  },
  { 
    label: 'Progress', 
    href: '/dashboard/progress', 
    icon: 'TrendingUp',
    description: 'Analytics and insights'
  },
  { 
    label: 'Messages', 
    href: '/dashboard/messages', 
    icon: 'MessageCircle',
    description: 'Team communication'
  },
  { 
    label: 'AI Coach', 
    href: '/dashboard/ai-coach', 
    icon: 'Bot',
    description: 'AI-powered coaching'
  },
  { 
    label: 'Settings', 
    href: '/dashboard/settings', 
    icon: 'Settings',
    description: 'Account and preferences'
  },
] as const;

// Quick Actions
export const QUICK_ACTIONS = [
  { 
    id: 'log-workout',
    label: 'Log Workout',
    icon: 'Plus',
    href: '/dashboard/plan?action=create',
    variant: 'primary' as const
  },
  { 
    id: 'check-in',
    label: 'Daily Check-in',
    icon: 'Heart',
    href: '/dashboard/diary?action=checkin',
    variant: 'secondary' as const
  },
  { 
    id: 'view-insights',
    label: 'View Insights',
    icon: 'Lightbulb',
    href: '/dashboard/progress?tab=insights',
    variant: 'default' as const
  },
  { 
    id: 'ask-coach',
    label: 'Ask AI Coach',
    icon: 'Bot',
    href: '/dashboard/ai-coach',
    variant: 'default' as const
  },
] as const;

// AI Coach Prompt Categories
export const AI_COACH_PROMPTS = [
  {
    id: 'training',
    label: 'Training',
    prompts: [
      'How should I adjust my training this week?',
      'What does my training load trend mean?',
      'Should I take a recovery day?',
      'How can I improve my running pace?',
    ]
  },
  {
    id: 'recovery',
    label: 'Recovery',
    prompts: [
      'Why is my readiness score low?',
      'How can I improve my sleep quality?',
      'What recovery strategies do you recommend?',
      'Should I be concerned about my HRV?',
    ]
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    prompts: [
      'What should I eat before my long run?',
      'How should I fuel during a race?',
      'What are good recovery foods?',
      'How much protein do I need?',
    ]
  },
  {
    id: 'general',
    label: 'General',
    prompts: [
      'Analyze my performance this month',
      'What are my strengths and weaknesses?',
      'How do I compare to other athletes?',
      'Set a training goal for me',
    ]
  },
] as const;

// Integration Platforms
export const INTEGRATION_PLATFORMS = {
  strava: { 
    name: 'Strava', 
    logo: '/integrations/strava.png',
    color: '#fc4c02',
    description: 'Connect your Strava activities'
  },
  garmin: { 
    name: 'Garmin', 
    logo: '/integrations/garmin.png',
    color: '#007cc3',
    description: 'Sync from Garmin Connect'
  },
  apple_health: { 
    name: 'Apple Health', 
    logo: '/integrations/apple.png',
    color: '#000000',
    description: 'Import health and fitness data'
  },
  google_fit: { 
    name: 'Google Fit', 
    logo: '/integrations/google-fit.png',
    color: '#4285f4',
    description: 'Sync Google Fit activities'
  },
  polar: { 
    name: 'Polar', 
    logo: '/integrations/polar.png',
    color: '#ed1c24',
    description: 'Connect Polar Flow data'
  },
  suunto: { 
    name: 'Suunto', 
    logo: '/integrations/suunto.png',
    color: '#ff6600',
    description: 'Import from Suunto app'
  },
  wahoo: { 
    name: 'Wahoo', 
    logo: '/integrations/wahoo.png',
    color: '#00aeef',
    description: 'Sync Wahoo ELEMNT data'
  },
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  short: 'MMM d',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  weekday: 'EEEE, MMM d',
  time: 'HH:mm',
  datetime: 'MMM d, yyyy HH:mm',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  auth: '/api/auth',
  users: '/api/users',
  workouts: '/api/workouts',
  checkins: '/api/checkins',
  insights: '/api/insights',
  ai: '/api/ai',
  integrations: '/api/integrations',
  teams: '/api/teams',
  messages: '/api/messages',
} as const;

// Polish National Colors (Brand Colors)
export const BRAND_COLORS = {
  primary: '#dc2626', // Polish Red
  primaryLight: '#f87171',
  primaryDark: '#b91c1c',
  accent: '#ffffff', // Polish White
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export default {
  APP_NAME,
  APP_DESCRIPTION,
  SPORTS,
  INTENSITY_ZONES,
  FEELING_SCALE,
  RPE_SCALE,
  READINESS_RANGES,
  TRAINING_LOAD_RANGES,
  NAVIGATION_ITEMS,
  QUICK_ACTIONS,
  AI_COACH_PROMPTS,
  INTEGRATION_PLATFORMS,
  DATE_FORMATS,
  API_ENDPOINTS,
  BRAND_COLORS,
  ANIMATION_DURATION,
  BREAKPOINTS,
};