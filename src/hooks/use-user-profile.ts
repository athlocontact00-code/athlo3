'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UserProfileConfig, profileConfigs } from '@/lib/user-profile';

export interface UseUserProfileReturn {
  profile: UserProfile;
  config: UserProfileConfig;
  setProfile: (profile: UserProfile) => void;
  getConfig: () => UserProfileConfig;
}

export function useUserProfile(): UseUserProfileReturn {
  // Default to athlete-solo as specified in requirements
  const [profile, setProfileState] = useState<UserProfile>('athlete-solo');

  // Load profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('athlo-user-profile-type');
      if (saved && saved in profileConfigs) {
        setProfileState(saved as UserProfile);
      }
    }
  }, []);

  // Save to localStorage when profile changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('athlo-user-profile-type', profile);
    }
  }, [profile]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  };

  const getConfig = () => {
    return profileConfigs[profile];
  };

  return {
    profile,
    config: profileConfigs[profile],
    setProfile,
    getConfig,
  };
}