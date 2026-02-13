'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
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

        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-8xl md:text-9xl font-bold text-foreground/10 select-none">
              404
            </h1>
            
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-4 left-1/4 transform -translate-x-1/2 text-4xl"
            >
              🏃‍♂️
            </motion.div>
            
            <motion.div
              animate={{
                y: [10, -10, 10],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-8 right-1/4 transform translate-x-1/2 text-3xl"
            >
              🎯
            </motion.div>
            
            <motion.div
              animate={{
                y: [-5, 15, -5],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-4 left-1/3 transform -translate-x-1/2 text-2xl"
            >
              🏆
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Looks like you've ventured off the beaten path! This page seems to have 
            gone for a run without us. Don't worry, we'll help you get back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
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
              What can you do next?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/dashboard" className="group">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground">Dashboard</h4>
                    <p className="text-sm text-muted-foreground">Your training hub</p>
                  </div>
                </div>
              </Link>

              <Link href="/search" className="group">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground">Search</h4>
                    <p className="text-sm text-muted-foreground">Find what you need</p>
                  </div>
                </div>
              </Link>

              <Link href="/contact" className="group">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground">Contact</h4>
                    <p className="text-sm text-muted-foreground">We're here to help</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact our support team
              </Link>
              . We'd love to help you get back to training!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Subtle animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
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