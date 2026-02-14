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
  Zap,
  Dumbbell,
  Timer,
  Trophy,
  Mountain,
  Waves,
  Bike,
  Footprints,
  Users2,
  Sword,
  CircleDot,
  Flame,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: Target,
    title: 'Smart Planning',
    description: 'AI-powered training plans tailored to every sport and every athlete',
  },
  {
    icon: Heart,
    title: 'Daily Check-ins',
    description: 'Universal readiness tracking with HRV, sleep, stress, and recovery metrics',
  },
  {
    icon: Calendar,
    title: 'Unified Calendar',
    description: 'One calendar for all sports: training, competitions, events, and recovery',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Sport-agnostic performance insights with explainable AI analysis',
  },
  {
    icon: MessageCircle,
    title: 'Team Communication',
    description: 'Connect athletes and coaches across all disciplines with context',
  },
  {
    icon: Brain,
    title: 'AI Coach',
    description: 'Personalized guidance for every sport, from running to martial arts',
  },
];

const sports = [
  { icon: Footprints, name: 'Running' },
  { icon: Bike, name: 'Cycling' },
  { icon: Waves, name: 'Swimming' },
  { icon: Dumbbell, name: 'CrossFit' },
  { icon: Users2, name: 'Football' },
  { icon: Trophy, name: 'Basketball' },
  { icon: Sword, name: 'MMA' },
  { icon: Mountain, name: 'Climbing' },
  { icon: CircleDot, name: 'Tennis' },
  { icon: Timer, name: 'HYROX' },
  { icon: Flame, name: 'Yoga' },
  { icon: Activity, name: 'Triathlon' },
];

const testimonials = [
  {
    name: 'Anna Kowalski',
    role: 'Triathlete',
    avatar: '/avatars/anna.jpg',
    content: 'ATHLO transformed my training across all three disciplines. The unified approach helped me PR by 8 minutes.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Football Coach',
    avatar: '/avatars/marcus.jpg',
    content: 'Managing team training sessions, individual players, and match preparation in one platform is revolutionary.',
    rating: 5,
  },
  {
    name: 'Katarzyna Nowak',
    role: 'CrossFit Athlete',
    avatar: '/avatars/kat.jpg',
    content: 'From weightlifting to cardio, ATHLO understands every movement and helps me optimize everything.',
    rating: 5,
  },
  {
    name: 'Diego Martinez',
    role: 'MMA Fighter',
    avatar: '/avatars/diego.jpg',
    content: 'Training striking, grappling, and conditioning - ATHLO handles the complexity so I can focus on fighting.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Yoga Instructor',
    avatar: '/avatars/sarah.jpg',
    content: 'Even for mind-body practices, ATHLO provides insights that help me and my students grow.',
    rating: 5,
  },
  {
    name: 'Coach Thompson',
    role: 'Basketball Coach',
    avatar: '/avatars/thompson.jpg',
    content: 'Team management, player development, and game analysis - everything I need in one premium platform.',
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
                🇵🇱 Built in Poland with Pride
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  ATHLO
                </span>
                <br />
                <span className="text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground">
                  Universal Premium Sports Platform
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The universal premium platform for every sport and every athlete. 
                Advanced coaching tools, team communication, and AI insights 
                designed for serious athletes and coaches across all disciplines.
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
                <div className="text-2xl font-bold text-primary">15k+</div>
                <div className="text-sm text-muted-foreground">Active Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1.2k+</div>
                <div className="text-sm text-muted-foreground">Professional Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2.5M+</div>
                <div className="text-sm text-muted-foreground">Workouts Tracked</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sports Showcase */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Built for Every Sport
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a weekend warrior or professional athlete, ATHLO adapts to your discipline
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {sports.map((sport, index) => {
              const Icon = sport.icon;
              return (
                <motion.div
                  key={sport.name}
                  variants={fadeInUp}
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-card/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{sport.name}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools that work across all sports, disciplines, and training methodologies.
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
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
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
              Trusted by Athletes Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              From recreational enthusiasts to professional athletes across every sport
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
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
              Elevate Every Athlete
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the universal premium platform that's helping athletes and coaches across all sports achieve their greatest potential.
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
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="lg:col-span-1">
              <Logo size="sm" className="mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                The universal premium sports platform for every athlete and every sport. 
                Professional coaching, team communication, and AI insights.
              </p>
              <div className="flex items-center gap-4">
                <Link href="https://instagram.com/athlo" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.619 5.367 11.986 11.988 11.986s11.987-5.367 11.987-11.986C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                  </svg>
                </Link>
                <Link href="https://twitter.com/athlo" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
                <Link href="https://tiktok.com/@athlo" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">TikTok</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/ai-coach" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    AI Coach
                  </Link>
                </li>
                <li>
                  <Link href="/for-coaches" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    For Coaches
                  </Link>
                </li>
                <li>
                  <Link href="/for-athletes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    For Athletes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 ATHLO. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Built with ❤️ in Poland 🇵🇱
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}