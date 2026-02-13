import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export interface PlatformInfo {
  isNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  platform: string;
  version?: string;
}

export function getPlatformInfo(): PlatformInfo {
  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();
  
  return {
    isNative,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isWeb: platform === 'web',
    platform,
    version: Capacitor.isNativePlatform() ? '1.0.0' : undefined,
  };
}

export enum HapticType {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Selection = 'selection',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export async function triggerHaptic(type: HapticType = HapticType.Light): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback - could use navigator.vibrate() if available
    if (navigator.vibrate) {
      const duration = type === HapticType.Heavy ? 100 : type === HapticType.Medium ? 50 : 25;
      navigator.vibrate(duration);
    }
    return;
  }

  try {
    switch (type) {
      case HapticType.Light:
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case HapticType.Medium:
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case HapticType.Heavy:
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case HapticType.Selection:
        await Haptics.selectionStart();
        break;
      case HapticType.Success:
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case HapticType.Warning:
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case HapticType.Error:
        await Haptics.notification({ type: NotificationType.Error });
        break;
    }
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
}

export async function configureStatusBar(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0f0f0f' });
    
    // Hide status bar on iOS for immersive experience (optional)
    if (Capacitor.getPlatform() === 'ios') {
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (error) {
    console.warn('Status bar configuration failed:', error);
  }
}

export async function hideSplashScreen(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await SplashScreen.hide({
      fadeOutDuration: 200,
    });
  } catch (error) {
    console.warn('Hide splash screen failed:', error);
  }
}

export function getSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  // iOS safe area insets
  if (Capacitor.getPlatform() === 'ios') {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0', 10),
      right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0', 10),
      bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
      left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0', 10),
    };
  }

  // Android - usually just status bar height at top
  return { top: 24, right: 0, bottom: 0, left: 0 };
}

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // Tailwind md breakpoint
}

export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024; // Tailwind md to lg
}

export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024; // Tailwind lg+
}

export async function initializeApp(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await configureStatusBar();
    
    // Give the app a moment to fully load
    setTimeout(async () => {
      await hideSplashScreen();
    }, 1000);
    
    console.log('ATHLO mobile app initialized');
  } catch (error) {
    console.error('App initialization failed:', error);
  }
}