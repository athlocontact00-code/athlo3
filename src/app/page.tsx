'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/logo';
import { cn } from '@/lib/utils';
import { 
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  TrendingUp,
  Users,
  Brain,
  Heart,
  Calendar,
  MessageCircle,
  Play,
  Shield,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: Target,
    title: 'Smart Planning',
    description: 'AI-powered workout planning with TrainingPeaks-level precision',
  },
  {
    icon: Heart,
    title: 'Daily Check-ins',
    description: 'Track readiness with HRV, sleep, stress, and recovery metrics',
  },
  {
    icon: Calendar,
    title: 'Central Calendar',
    description: 'Unified view of workouts, events, and training phases',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'CTL/ATL/TSB analysis with explainable insights',
  },
  {
    icon: MessageCircle,
    title: 'Team Communication',
    description: 'Contextual messaging linked to workouts and training data',
  },
  {
    icon: Brain,
    title: 'AI Coach',
    description: 'Personalized recommendations and intelligent Q&A support',
  },
];

const testimonials = [
  {
    name: 'Anna Kowalski',
    role: 'Triathlete',
    avatar: '/avatars/anna.jpg',
    content: 'ATHLO transformed my training. The AI insights helped me PR by 8 minutes.',
    rating: 5,
  },
  {
    name: 'Marcin Nowak',
    role: 'Running Coach',
    avatar: '/avatars/marcin.jpg',
    content: 'Managing 20+ athletes became effortless. The communication tools are game-changing.',
    rating: 5,
  },
  {
    name: 'Ola Wiśniewska',
    role: 'HYROX Athlete',
    avatar: '/avatars/ola.jpg',
    content: 'Finally, a platform that understands endurance sports beyond just running.',
    rating: 5,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Badge variant="outline" className="mb-6 border-primary/20 text-primary">
                🇵🇱 Premium Polish Engineering
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                Elevate Your
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Endurance
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The premium digital platform for endurance sports. 
                Advanced coaching tools, social features, and AI insights 
                designed for serious athletes and coaches.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Workouts Logged</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools for planning, tracking, analyzing, and optimizing your endurance training.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Athletes Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of athletes and coaches who trust ATHLO
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Training?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the premium platform that's helping athletes and coaches achieve their goals with intelligent training insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                14-day free trial, no credit card required
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 ATHLO. Crafted with ❤️ in Poland.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}