'use client';

import { createContext, useContext, useState, useEffect, createElement } from 'react';

// Define the 4 user profile types
export type UserProfile = 
  | 'coach'           // 👨‍🏫 Manages athletes on ATHLO, creates plans, monitors progress
  | 'athlete-coach'   // 🏃‍♂️👨‍🏫 Trains with a coach on ATHLO, receives plans, reports check-ins
  | 'athlete-solo'    // 🏃‍♂️ Self-managed, tracks own health & training data (TrainingPeaks style)
  | 'athlete-ai';     // 🤖 Trains with ATHLO's AI Coach, gets AI-generated plans & insights

export interface UserProfileData {
  profileType: UserProfile;
  name: string;
  email: string;
  sports: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  onboardingCompleted: boolean;
  preferences: {
    notifications: boolean;
    weekStartsOn: 'monday' | 'sunday';
    units: 'metric' | 'imperial';
    timezone: string;
  };
}

// Profile feature permissions and visibility
export interface ProfileFeatures {
  // Dashboard widgets
  showAICoach: boolean;
  showCoachMessages: boolean;
  showAthleteList: boolean;
  showSharedCalendar: boolean;
  showPlanBuilder: boolean;
  showAdvancedAnalytics: boolean;
  
  // Navigation items
  showTeamManagement: boolean;
  showClientDashboard: boolean;
  showAICoachPage: boolean;
  showCoachingTools: boolean;
  
  // Features
  canCreatePlans: boolean;
  canInviteAthletes: boolean;
  canReceivePlans: boolean;
  canUseAICoach: boolean;
  canManageTeam: boolean;
  canViewAdvancedMetrics: boolean;
}

// Get profile features based on user type
export function getProfileFeatures(profileType: UserProfile): ProfileFeatures {
  switch (profileType) {
    case 'coach':
      return {
        // Dashboard
        showAICoach: false,
        showCoachMessages: false,
        showAthleteList: true,
        showSharedCalendar: true,
        showPlanBuilder: true,
        showAdvancedAnalytics: true,
        
        // Navigation
        showTeamManagement: true,
        showClientDashboard: true,
        showAICoachPage: false,
        showCoachingTools: true,
        
        // Features
        canCreatePlans: true,
        canInviteAthletes: true,
        canReceivePlans: false,
        canUseAICoach: false,
        canManageTeam: true,
        canViewAdvancedMetrics: true,
      };
      
    case 'athlete-coach':
      return {
        // Dashboard
        showAICoach: false,
        showCoachMessages: true,
        showAthleteList: false,
        showSharedCalendar: true,
        showPlanBuilder: false,
        showAdvancedAnalytics: true,
        
        // Navigation
        showTeamManagement: false,
        showClientDashboard: false,
        showAICoachPage: false,
        showCoachingTools: false,
        
        // Features
        canCreatePlans: false,
        canInviteAthletes: false,
        canReceivePlans: true,
        canUseAICoach: false,
        canManageTeam: false,
        canViewAdvancedMetrics: true,
      };
      
    case 'athlete-solo':
      return {
        // Dashboard
        showAICoach: false,
        showCoachMessages: false,
        showAthleteList: false,
        showSharedCalendar: false,
        showPlanBuilder: true, // Self-planning
        showAdvancedAnalytics: true,
        
        // Navigation
        showTeamManagement: false,
        showClientDashboard: false,
        showAICoachPage: false,
        showCoachingTools: false,
        
        // Features
        canCreatePlans: true,
        canInviteAthletes: false,
        canReceivePlans: false,
        canUseAICoach: false,
        canManageTeam: false,
        canViewAdvancedMetrics: true,
      };
      
    case 'athlete-ai':
      return {
        // Dashboard
        showAICoach: true,
        showCoachMessages: false,
        showAthleteList: false,
        showSharedCalendar: false,
        showPlanBuilder: false, // AI creates plans
        showAdvancedAnalytics: true,
        
        // Navigation
        showTeamManagement: false,
        showClientDashboard: false,
        showAICoachPage: true,
        showCoachingTools: false,
        
        // Features
        canCreatePlans: false, // AI does this
        canInviteAthletes: false,
        canReceivePlans: true, // From AI
        canUseAICoach: true,
        canManageTeam: false,
        canViewAdvancedMetrics: true,
      };
      
    default:
      // Default to athlete-solo
      return getProfileFeatures('athlete-solo');
  }
}

// Profile display information
export interface ProfileDisplayInfo {
  emoji: string;
  title: string;
  description: string;
  badge: string;
}

export function getProfileDisplayInfo(profileType: UserProfile): ProfileDisplayInfo {
  switch (profileType) {
    case 'coach':
      return {
        emoji: '👨‍🏫',
        title: 'Coach',
        description: 'I create plans and guide athletes on ATHLO',
        badge: 'Coach',
      };
      
    case 'athlete-coach':
      return {
        emoji: '🏃‍♂️',
        title: 'I train with a Coach',
        description: 'My coach is already on ATHLO or I\'ll invite them',
        badge: 'Athlete + Coach',
      };
      
    case 'athlete-solo':
      return {
        emoji: '🏃‍♂️',
        title: 'I train solo',
        description: 'I manage my own training and track my health data',
        badge: 'Solo Athlete',
      };
      
    case 'athlete-ai':
      return {
        emoji: '🤖',
        title: 'I want AI as my Coach',
        description: 'ATHLO AI creates plans, analyzes my data, and guides my training',
        badge: 'AI Athlete',
      };
      
    default:
      return getProfileDisplayInfo('athlete-solo');
  }
}

// Mock user profile data (will be replaced with real data later)
const mockUserProfile: UserProfileData = {
  profileType: 'athlete-solo',
  name: 'Demo Athlete',
  email: 'demo@athlo.com',
  sports: ['running', 'cycling'],
  experienceLevel: 'intermediate',
  onboardingCompleted: false,
  preferences: {
    notifications: true,
    weekStartsOn: 'monday',
    units: 'metric',
    timezone: 'Europe/Warsaw',
  },
};

// Context for user profile
export const UserProfileContext = createContext<{
  userProfile: UserProfileData;
  features: ProfileFeatures;
  displayInfo: ProfileDisplayInfo;
  updateProfile: (updates: Partial<UserProfileData>) => void;
  setProfileType: (profileType: UserProfile) => void;
} | null>(null);

// Custom hook to use user profile
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  
  if (!context) {
    // Fallback when used outside provider
    const profileType = 'athlete-solo' as UserProfile;
    const features = getProfileFeatures(profileType);
    const displayInfo = getProfileDisplayInfo(profileType);
    
    return {
      userProfile: mockUserProfile,
      features,
      displayInfo,
      updateProfile: () => {},
      setProfileType: () => {},
    };
  }
  
  return context;
}

// Provider component
export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfileData>(mockUserProfile);
  
  // Load profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('athlo-user-profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUserProfile(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.warn('Failed to parse saved user profile:', error);
        }
      }
    }
  }, []);
  
  // Save to localStorage when profile changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('athlo-user-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);
  
  const features = getProfileFeatures(userProfile.profileType);
  const displayInfo = getProfileDisplayInfo(userProfile.profileType);
  
  const updateProfile = (updates: Partial<UserProfileData>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };
  
  const setProfileType = (profileType: UserProfile) => {
    setUserProfile(prev => ({ ...prev, profileType }));
  };
  
  return createElement(UserProfileContext.Provider, {
    value: {
      userProfile,
      features,
      displayInfo,
      updateProfile,
      setProfileType,
    },
    children,
  });
}

// Utility functions for type checking
export function isCoach(profileType: UserProfile): boolean {
  return profileType === 'coach';
}

export function isAthlete(profileType: UserProfile): boolean {
  return profileType.startsWith('athlete-');
}

export function hasCoach(profileType: UserProfile): boolean {
  return profileType === 'athlete-coach';
}

export function usesAI(profileType: UserProfile): boolean {
  return profileType === 'athlete-ai';
}

export function isSolo(profileType: UserProfile): boolean {
  return profileType === 'athlete-solo';
}