'use client';

import { useCallback } from 'react';

type HapticIntensity = 'light' | 'medium' | 'heavy';

interface HapticOptions {
  pattern?: number[];
  duration?: number;
}

// Check if haptics are supported
const isHapticsSupported = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    return 'navigator' in window && 'vibrate' in navigator;
  } catch {
    return false;
  }
};

// Trigger vibration using the Web Vibration API
const triggerVibration = (intensity: HapticIntensity, options?: HapticOptions): boolean => {
  if (!isHapticsSupported()) {
    return false;
  }
  
  try {
    const nav = navigator as any;
    if (!nav.vibrate) {
      return false;
    }
    
    let pattern: number | number[];
    
    if (options?.pattern) {
      pattern = options.pattern;
    } else {
      // Default patterns based on intensity
      switch (intensity) {
        case 'light':
          pattern = [50]; // Single short pulse
          break;
        case 'medium':
          pattern = [100]; // Single medium pulse
          break;
        case 'heavy':
          pattern = [200]; // Single long pulse
          break;
        default:
          pattern = [50];
      }
    }
    
    nav.vibrate(pattern);
    return true;
  } catch (error) {
    console.debug('Vibration API failed:', error);
    return false;
  }
};

export function useHaptics() {
  const triggerHaptic = useCallback((
    intensity: HapticIntensity, 
    options?: HapticOptions
  ): boolean => {
    if (!isHapticsSupported()) {
      console.debug('Haptics not supported on this device');
      return false;
    }

    return triggerVibration(intensity, options);
  }, []);

  // Predefined haptic patterns for common use cases
  const haptics = {
    // Light haptic for button taps, toggles
    tap: useCallback(() => triggerHaptic('light'), [triggerHaptic]),
    
    // Medium haptic for form submissions, check-ins
    impact: useCallback(() => triggerHaptic('medium'), [triggerHaptic]),
    
    // Heavy haptic for achievements, PRs, significant events
    success: useCallback(() => triggerHaptic('heavy'), [triggerHaptic]),
    
    // Double tap pattern for confirmations
    confirm: useCallback(() => triggerHaptic('medium', { 
      pattern: [100, 50, 100] 
    }), [triggerHaptic]),
    
    // Triple tap pattern for errors/warnings
    error: useCallback(() => triggerHaptic('heavy', { 
      pattern: [200, 100, 200, 100, 200] 
    }), [triggerHaptic]),
    
    // Gentle pulse pattern for notifications
    notification: useCallback(() => triggerHaptic('light', { 
      pattern: [50, 100, 50] 
    }), [triggerHaptic]),
    
    // Achievement celebration pattern
    celebration: useCallback(() => triggerHaptic('heavy', { 
      pattern: [100, 50, 200, 50, 100, 50, 300] 
    }), [triggerHaptic]),
  };

  return {
    triggerHaptic,
    isSupported: isHapticsSupported(),
    ...haptics
  };
}

// Utility hook for button haptics
export function useButtonHaptics() {
  const { tap } = useHaptics();
  
  return useCallback((event?: React.MouseEvent | React.TouchEvent) => {
    // Trigger haptic on touch devices
    if (event && 'touches' in event) {
      tap();
    }
  }, [tap]);
}

export default useHaptics;