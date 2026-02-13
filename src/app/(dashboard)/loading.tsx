'use client';

import { Logo } from '@/components/common/logo';
import { 
  Activity, 
  Calendar, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Target 
} from 'lucide-react';
import { motion } from 'framer-motion';

const loadingSteps = [
  { icon: Activity, text: 'Loading workouts...' },
  { icon: Calendar, text: 'Syncing calendar...' },
  { icon: TrendingUp, text: 'Calculating progress...' },
  { icon: Users, text: 'Connecting athletes...' },
  { icon: MessageCircle, text: 'Loading messages...' },
  { icon: Target, text: 'Preparing dashboard...' },
];

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      <div className="relative z-10 max-w-md mx-auto text-center space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Logo size="lg" className="mx-auto" />
        </motion.div>

        {/* Loading Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Setting up your training dashboard...
          </p>
        </motion.div>

        {/* Loading Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {loadingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.6 + (index * 0.1)
                }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50"
              >
                <div className="relative">
                  <motion.div
                    className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"
                    animate={{
                      backgroundColor: [`rgba(220, 38, 38, 0.1)`, `rgba(220, 38, 38, 0.2)`, `rgba(220, 38, 38, 0.1)`],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 360] 
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.1,
                      }}
                    >
                      <Icon className="w-4 h-4 text-primary" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Loading indicator dot */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  />
                </div>
                
                <span className="text-sm text-foreground">
                  {step.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="space-y-2"
        >
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full"
              animate={{
                width: ["0%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Almost ready...
          </p>
        </motion.div>

        {/* Loading tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="bg-muted/30 rounded-lg p-4 border border-border/50"
        >
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Use the command palette (⌘K) for quick navigation around ATHLO.
          </p>
        </motion.div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}