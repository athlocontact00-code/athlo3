/**
 * PWA (Progressive Web App) utilities for ATHLO
 * Handles service worker registration, installation prompts, and PWA features
 */

// Types for PWA functionality
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isServiceWorkerSupported: boolean;
  isServiceWorkerRegistered: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

class PWAManager {
  private installPrompt: BeforeInstallPromptEvent | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private async initialize() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      this.emit('installable', true);
      console.log('ATHLO PWA: Install prompt available');
    });

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.emit('installed', true);
      console.log('ATHLO PWA: App installed');
    });

    // Check if app is running in standalone mode
    if (this.isStandalone()) {
      this.emit('standalone', true);
      console.log('ATHLO PWA: Running in standalone mode');
    }

    // Register service worker
    await this.registerServiceWorker();
  }

  // Service Worker Registration
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('ATHLO PWA: Service workers not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('ATHLO PWA: Service worker registered', this.registration);

      // Handle service worker updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              this.emit('update-available', newWorker);
              console.log('ATHLO PWA: New version available');
            }
          });
        }
      });

      this.emit('sw-registered', this.registration);
      return this.registration;
    } catch (error) {
      console.error('ATHLO PWA: Service worker registration failed:', error);
      return null;
    }
  }

  // Install App
  async installApp(): Promise<boolean> {
    if (!this.installPrompt) {
      console.log('ATHLO PWA: Install prompt not available');
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choiceResult = await this.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('ATHLO PWA: User accepted install prompt');
        this.installPrompt = null;
        return true;
      } else {
        console.log('ATHLO PWA: User dismissed install prompt');
        return false;
      }
    } catch (error) {
      console.error('ATHLO PWA: Install prompt failed:', error);
      return false;
    }
  }

  // Update Service Worker
  async updateServiceWorker(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      await this.registration.update();
      console.log('ATHLO PWA: Service worker updated');
      return true;
    } catch (error) {
      console.error('ATHLO PWA: Service worker update failed:', error);
      return false;
    }
  }

  // Skip waiting and activate new service worker
  skipWaiting(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Check if app can be installed
  isInstallable(): boolean {
    return this.installPrompt !== null;
  }

  // Check if app is installed/standalone
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Check if service worker is supported
  isServiceWorkerSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  // Get current PWA state
  getState(): PWAState {
    return {
      isInstallable: this.isInstallable(),
      isInstalled: this.isStandalone(),
      isStandalone: this.isStandalone(),
      isServiceWorkerSupported: this.isServiceWorkerSupported(),
      isServiceWorkerRegistered: this.registration !== null,
      installPrompt: this.installPrompt
    };
  }

  // Event system for PWA state changes
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Notification permissions
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('ATHLO PWA: Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      console.log('ATHLO PWA: Notification permission:', permission);
      return permission;
    }

    return Notification.permission;
  }

  // Send local notification
  async showNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
    const permission = await this.requestNotificationPermission();
    
    if (permission !== 'granted') {
      return false;
    }

    try {
      if (this.registration) {
        // Use service worker for notifications
        await this.registration.showNotification(title, {
          icon: '/icons/icon-192.svg',
          badge: '/icons/icon-96.svg',
          ...options
        });
      } else {
        // Fallback to browser notifications
        new Notification(title, {
          icon: '/icons/icon-192.svg',
          ...options
        });
      }
      return true;
    } catch (error) {
      console.error('ATHLO PWA: Notification failed:', error);
      return false;
    }
  }

  // Background sync (for offline actions)
  async backgroundSync(tag: string): Promise<boolean> {
    if (!this.registration || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.log('ATHLO PWA: Background sync not supported');
      return false;
    }

    try {
      await (this.registration as any).sync.register(tag);
      console.log('ATHLO PWA: Background sync registered:', tag);
      return true;
    } catch (error) {
      console.error('ATHLO PWA: Background sync failed:', error);
      return false;
    }
  }

  // Share API
  async share(data: ShareData): Promise<boolean> {
    if (!('share' in navigator)) {
      // Fallback to clipboard or other sharing methods
      console.log('ATHLO PWA: Web Share API not supported');
      return false;
    }

    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('ATHLO PWA: Share failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// React hook for PWA functionality
export function usePWA() {
  const [state, setState] = React.useState<PWAState>(() => pwaManager.getState());

  React.useEffect(() => {
    const updateState = () => setState(pwaManager.getState());

    // Listen for PWA state changes
    pwaManager.on('installable', updateState);
    pwaManager.on('installed', updateState);
    pwaManager.on('standalone', updateState);
    pwaManager.on('sw-registered', updateState);

    return () => {
      pwaManager.off('installable', updateState);
      pwaManager.off('installed', updateState);
      pwaManager.off('standalone', updateState);
      pwaManager.off('sw-registered', updateState);
    };
  }, []);

  return {
    ...state,
    install: () => pwaManager.installApp(),
    update: () => pwaManager.updateServiceWorker(),
    requestNotifications: () => pwaManager.requestNotificationPermission(),
    showNotification: (title: string, options?: NotificationOptions) => 
      pwaManager.showNotification(title, options),
    share: (data: ShareData) => pwaManager.share(data)
  };
}

// Utility functions
export function isPWA(): boolean {
  return pwaManager.isStandalone();
}

export function canInstall(): boolean {
  return pwaManager.isInstallable();
}

// React import (will be available in components)
import * as React from 'react';