'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import { RefreshCw, AlertTriangle, Home, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-destructive/5" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-destructive/3 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen">
        <div className="w-full h-full opacity-5 bg-grid-pattern" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Logo size="lg" className="mx-auto" />
        </motion.div>

        {/* Error Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Warning Icon */}
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </motion.div>
            </div>
            
            {/* Floating Error Elements */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-4 left-1/4 transform -translate-x-1/2 text-2xl"
            >
              ⚠️
            </motion.div>
            
            <motion.div
              animate={{
                y: [10, -10, 10],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-8 right-1/4 transform translate-x-1/2 text-2xl"
            >
              🚨
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            We encountered an unexpected error. Don't worry - even elite athletes face setbacks! 
            Our team has been notified and we're working to fix this.
          </p>
          
          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-card/50 border border-border rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto"
            >
              <h3 className="text-sm font-medium text-foreground mb-2">Error Details:</h3>
              <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button size="lg" onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-6"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              What you can do:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  <RefreshCw className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground mb-1">Refresh the page</h4>
                  <p className="text-sm text-muted-foreground">
                    Sometimes a simple refresh solves temporary issues
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground mb-1">Return to dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Go back to your training overview and try again
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>Need help? </span>
                <Link 
                  href="mailto:support@athlo.com?subject=Error Report&body=Error ID: ${error.digest || 'Unknown'}"
                  className="text-primary hover:underline font-medium"
                >
                  Report this issue
                </Link>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Good to know:</strong> Our monitoring systems have automatically detected this error. 
              Our development team is already investigating and working on a fix. Thank you for your patience!
            </p>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              ATHLO - Built with ❤️ in Poland 🇵🇱
            </p>
          </div>
        </motion.div>
      </div>

      {/* Subtle animated error particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-destructive/20 rounded-full"
            style={{
              left: `${15 + i * 20}%`,
              top: `${25 + i * 15}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}