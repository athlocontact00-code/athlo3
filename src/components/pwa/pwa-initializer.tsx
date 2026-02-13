'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, RefreshCw, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pwaManager } from '@/lib/pwa';

interface PWAPromptProps {
  onClose: () => void;
  onAction: () => void;
  title: string;
  description: string;
  actionText: string;
  icon: React.ReactNode;
}

function PWAPrompt({ onClose, onAction, title, description, actionText, icon }: PWAPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
    >
      <Card className="p-4 bg-card border-border/40 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm mb-1">
              {title}
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed mb-3">
              {description}
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={onAction}
                className="flex-1 h-8 text-xs"
              >
                {actionText}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onClose}
                className="h-8 px-3"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function PWAInitializer() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let installTimeout: NodeJS.Timeout;
    let notificationTimeout: NodeJS.Timeout;

    const initialize = async () => {
      if (isInitialized) return;
      
      console.log('ATHLO PWA: Initializing...');
      
      // Register service worker (handled automatically by pwaManager)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for app to settle
      
      // Set up event listeners
      pwaManager.on('installable', () => {
        // Show install prompt after user has had time to explore (30 seconds)
        installTimeout = setTimeout(() => {
          if (!pwaManager.isStandalone()) {
            setShowInstallPrompt(true);
          }
        }, 30000);
      });

      pwaManager.on('update-available', () => {
        setShowUpdatePrompt(true);
      });

      // Check for notification permission after app is running for a bit
      notificationTimeout = setTimeout(async () => {
        if (Notification.permission === 'default' && !localStorage.getItem('notifications-prompted')) {
          setShowNotificationPrompt(true);
        }
      }, 60000); // Show after 1 minute

      setIsInitialized(true);
      console.log('ATHLO PWA: Initialization complete');
    };

    initialize();

    return () => {
      if (installTimeout) clearTimeout(installTimeout);
      if (notificationTimeout) clearTimeout(notificationTimeout);
    };
  }, [isInitialized]);

  const handleInstall = async () => {
    const success = await pwaManager.installApp();
    if (success) {
      setShowInstallPrompt(false);
    }
  };

  const handleUpdate = async () => {
    pwaManager.skipWaiting();
    setShowUpdatePrompt(false);
    // Reload the page to activate new service worker
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleNotificationRequest = async () => {
    await pwaManager.requestNotificationPermission();
    localStorage.setItem('notifications-prompted', 'true');
    setShowNotificationPrompt(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('install-prompt-dismissed', 'true');
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  const handleDismissNotification = () => {
    localStorage.setItem('notifications-prompted', 'true');
    setShowNotificationPrompt(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showInstallPrompt && (
          <PWAPrompt
            onClose={handleDismissInstall}
            onAction={handleInstall}
            title="Install ATHLO"
            description="Get the full app experience! Install ATHLO for faster loading, offline access, and desktop integration."
            actionText="Install"
            icon={<Download className="w-5 h-5 text-primary" />}
          />
        )}
        
        {showUpdatePrompt && (
          <PWAPrompt
            onClose={handleDismissUpdate}
            onAction={handleUpdate}
            title="Update Available"
            description="A new version of ATHLO is ready! Update now to get the latest features and improvements."
            actionText="Update"
            icon={<RefreshCw className="w-5 h-5 text-primary" />}
          />
        )}
        
        {showNotificationPrompt && (
          <PWAPrompt
            onClose={handleDismissNotification}
            onAction={handleNotificationRequest}
            title="Stay Updated"
            description="Enable notifications to get training reminders, coach messages, and important updates."
            actionText="Enable"
            icon={<Bell className="w-5 h-5 text-primary" />}
          />
        )}
      </AnimatePresence>
    </>
  );
}