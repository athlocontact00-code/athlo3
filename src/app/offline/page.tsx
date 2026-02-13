'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/common/logo';
import { 
  WifiOff, 
  RefreshCw, 
  Calendar,
  Heart,
  MessageCircle,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const offlineFeatures = [
  {
    icon: Calendar,
    title: 'View Today\'s Workout',
    description: 'Your planned workout is cached and available offline',
    action: 'Go to Dashboard',
    href: '/dashboard'
  },
  {
    icon: Heart,
    title: 'Daily Check-in',
    description: 'Complete your readiness check-in (syncs when online)',
    action: 'Open Diary',
    href: '/diary'
  },
  {
    icon: TrendingUp,
    title: 'Review Progress',
    description: 'Browse your cached training history and analytics',
    action: 'View Progress',
    href: '/progress'
  },
];

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check initial connection status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-redirect to dashboard when connection is restored
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleRetry = () => {
    if (navigator.onLine) {
      router.push('/dashboard');
    } else {
      // Force a connection check
      fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache' 
      })
      .then(() => {
        setIsOnline(true);
        router.push('/dashboard');
      })
      .catch(() => {
        // Still offline, do nothing
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            {isOnline ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-green-500 mb-2">
                  Connection Restored!
                </h1>
                <p className="text-muted-foreground">
                  Redirecting you back to ATHLO...
                </p>
              </motion.div>
            ) : (
              <>
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WifiOff className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  You're Offline
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Don't worry - you can still access key features of ATHLO
                </p>
                
                <Button 
                  onClick={handleRetry}
                  className="mb-8"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </>
            )}
          </motion.div>

          {/* Offline Features */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                Available Offline
              </h2>
              
              <div className="grid gap-4 mb-8">
                {offlineFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <Card className="p-4 hover:bg-muted/50 transition-colors">
                        <Link href={feature.href} className="block">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground mb-1">
                                {feature.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {feature.description}
                              </p>
                              <span className="text-sm text-primary font-medium">
                                {feature.action} →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tips */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-6 bg-muted/30 rounded-xl border border-border/40"
            >
              <h3 className="font-semibold text-foreground mb-3">
                💡 Offline Tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your daily check-ins will sync automatically when you're back online</li>
                <li>• Recent workouts and progress data are cached for offline viewing</li>
                <li>• The AI Coach requires an internet connection for new conversations</li>
                <li>• Messages and real-time features need connectivity</li>
              </ul>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          ATHLO - Your training continues, online or offline
        </p>
      </footer>
    </div>
  );
}