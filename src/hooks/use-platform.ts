'use client';

import { useState, useEffect } from 'react';
import { 
  getPlatformInfo, 
  triggerHaptic, 
  HapticType, 
  getSafeAreaInsets,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  PlatformInfo
} from '@/lib/capacitor';

export function usePlatform() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isNative: false,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    platform: 'web',
  });

  const [viewport, setViewport] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    // Get platform info
    const platform = getPlatformInfo();
    setPlatformInfo(platform);

    // Get safe area insets
    const insets = getSafeAreaInsets();
    setSafeAreaInsets(insets);

    // Update viewport info
    const updateViewport = () => {
      setViewport({
        isMobile: isMobileViewport(),
        isTablet: isTabletViewport(),
        isDesktop: isDesktopViewport(),
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const haptic = {
    light: () => triggerHaptic(HapticType.Light),
    medium: () => triggerHaptic(HapticType.Medium),
    heavy: () => triggerHaptic(HapticType.Heavy),
    selection: () => triggerHaptic(HapticType.Selection),
    success: () => triggerHaptic(HapticType.Success),
    warning: () => triggerHaptic(HapticType.Warning),
    error: () => triggerHaptic(HapticType.Error),
  };

  const features = {
    hasHaptics: platformInfo.isNative,
    hasStatusBar: platformInfo.isNative,
    hasSafeArea: platformInfo.isIOS,
    hasPushNotifications: platformInfo.isNative,
    hasDeepLinking: platformInfo.isNative,
    hasFileSystem: platformInfo.isNative,
    hasCamera: platformInfo.isNative,
    hasGeolocation: true, // Available on web and native
    hasNetworkInfo: platformInfo.isNative,
    hasBiometrics: platformInfo.isNative,
  };

  return {
    ...platformInfo,
    viewport,
    safeAreaInsets,
    haptic,
    features,
  };
}

// Convenience hooks for specific platforms
export function useIsNative() {
  const { isNative } = usePlatform();
  return isNative;
}

export function useIsIOS() {
  const { isIOS } = usePlatform();
  return isIOS;
}

export function useIsAndroid() {
  const { isAndroid } = usePlatform();
  return isAndroid;
}

export function useHaptics() {
  const { haptic, features } = usePlatform();
  return { ...haptic, available: features.hasHaptics };
}

export function useSafeArea() {
  const { safeAreaInsets, features } = usePlatform();
  return { ...safeAreaInsets, available: features.hasSafeArea };
}

export function useViewport() {
  const { viewport } = usePlatform();
  return viewport;
}