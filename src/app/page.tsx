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
  Bot,
  Trophy,
  Timer,
  BarChart3,
  Smartphone,
  Globe,
  Monitor,
  Activity,
  ChevronRight,
  ArrowUpRight,
  Check,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SPORTS, getPopularSports } from '@/lib/sports';

const profileTypes = [
  {
    icon: Users,
    emoji: '👨‍🏫',
    title: "Coach",
    description: 'Manage athletes and create world-class training programs',
    features: ['Team Management', 'Plan Creation', 'Performance Analytics']
  },
  {
    icon: Users,
    emoji: '🏃',
    title: "Athlete + Coach",
    description: 'Train with professional coaching guidance on ATHLO',
    features: ['Receive Plans', 'Report Data', 'Coach Communication']
  },
  {
    icon: Trophy,
    emoji: '💪',
    title: "Solo Athlete",
    description: 'Take full control of your training and health data',
    features: ['Self-Managed', 'Data Tracking', 'Personal Analytics']
  },
  {
    icon: Bot,
    emoji: '🤖',
    title: "AI Coach",
    description: 'Get personalized guidance from ATHLO\'s intelligent AI',
    features: ['AI Plans', 'Smart Guidance', 'Adaptive Training']
  }
];

const features = [
  {
    title: 'Smart Training Plans',
    description: 'AI-powered coaching that adapts to every sport and athlete',
    bullets: [
      'Sport-specific training methodologies',
      'Adaptive periodization based on performance',
      'Injury prevention and recovery integration'
    ],
    imageLeft: true
  },
  {
    title: 'Daily Health Tracking',
    description: 'Comprehensive readiness and recovery monitoring',
    bullets: [
      'HRV, sleep quality, and stress tracking',
      'Universal readiness scores across all sports',
      'Smart recovery recommendations'
    ],
    imageLeft: false
  },
  {
    title: 'AI-Powered Coaching',
    description: 'Intelligent guidance that understands every discipline',
    bullets: [
      'Real-time form and technique analysis',
      'Personalized nutrition and hydration advice',
      'Performance prediction and optimization'
    ],
    imageLeft: true
  },
  {
    title: 'Team Communication',
    description: 'Seamless collaboration between athletes and coaches',
    bullets: [
      'Real-time messaging with training context',
      'Team announcements and schedule updates',
      'Progress sharing and feedback loops'
    ],
    imageLeft: false
  }
];

const testimonials = [
  {
    name: 'Anna Kowalska',
    role: 'Professional Triathlete',
    content: 'ATHLO transformed my training across swimming, cycling, and running. The unified approach helped me achieve a personal best and qualify for Ironman World Championships.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Football Coach, FC Krakow',
    content: 'Managing 25 players with individual training plans, team sessions, and match analysis has never been this streamlined. ATHLO is a game-changer for professional coaching.',
    rating: 5,
  },
  {
    name: 'Katarzyna Nowak',
    role: 'CrossFit Regional Athlete',
    content: 'From Olympic lifts to metabolic conditioning, ATHLO understands every movement pattern and helps me optimize every aspect of my training.',
    rating: 5,
  }
];

const comparisonFeatures = [
  { name: 'Multi-Sport Support', athlo: true, trainingpeaks: false, strava: false, whoop: false },
  { name: 'AI Coaching', athlo: true, trainingpeaks: false, strava: false, whoop: false },
  { name: 'Team Management', athlo: true, trainingpeaks: true, strava: false, whoop: false },
  { name: 'Daily Readiness', athlo: true, trainingpeaks: false, strava: false, whoop: true },
  { name: 'Advanced Analytics', athlo: true, trainingpeaks: true, strava: true, whoop: true },
  { name: 'Custom Sports', athlo: true, trainingpeaks: false, strava: false, whoop: false },
  { name: 'Real-time Communication', athlo: true, trainingpeaks: false, strava: false, whoop: false },
  { name: 'Polish Design 🇵🇱', athlo: true, trainingpeaks: false, strava: false, whoop: false },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    features: ['1 sport tracking', 'Basic analytics', 'Community access', '7-day history'],
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Pro',
    price: '19',
    period: '/month',
    features: ['Unlimited sports', 'AI coaching', 'Advanced analytics', 'Team features', 'Unlimited history', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Coach',
    price: '49',
    period: '/month',
    features: ['Everything in Pro', 'Unlimited athletes', 'Team management', 'Custom branding', 'API access', 'Dedicated support'],
    cta: 'Start Free Trial',
    popular: false
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function LandingPage() {
  const popularSports = getPopularSports().slice(0, 12);
  const extraSports = SPORTS.slice(12, 24);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        className="relative z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Start Free
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Full Viewport */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full opacity-30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-8 border-primary/30 text-primary bg-primary/5 px-4 py-2">
              🇵🇱 Built in Poland • Trusted by 15,000+ Athletes
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Your Sport.
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Your Way.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              The intelligent training platform that adapts to <strong>every athlete</strong>, <strong>every sport</strong>, <strong>every goal</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  Start Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold">
                <Play className="mr-2 w-5 h-5" />
                See how it works
              </Button>
            </div>

            {/* Dashboard Mockup Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-2xl">
                <div className="bg-card border border-border/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-muted-foreground">ATHLO Dashboard</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">8.5</div>
                      <div className="text-xs text-muted-foreground">Readiness</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">142</div>
                      <div className="text-xs text-muted-foreground">Training Load</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">5.2km</div>
                      <div className="text-xs text-muted-foreground">Today's Run</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="animate-bounce">
            <ChevronRight className="w-6 h-6 text-muted-foreground rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* 4 Profile Cards - Built for Everyone */}
      <section className="py-24 bg-muted/20 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Built for Everyone
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Every Athlete. Every Coach.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're training solo, working with a coach, or guiding athletes—ATHLO adapts to your role.
            </p>
          </motion.div>

          {/* Desktop Grid, Mobile Scroll */}
          <div className="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 flex md:block overflow-x-auto gap-4 pb-4 md:pb-0 snap-x snap-mandatory">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="contents"
            >
              {profileTypes.map((profile, index) => {
                const Icon = profile.icon;
                return (
                  <motion.div
                    key={profile.title}
                    variants={staggerItem}
                    className="flex-shrink-0 w-80 md:w-auto bg-card border border-border/50 rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group snap-center"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                        <span className="text-4xl">{profile.emoji}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {profile.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {profile.description}
                      </p>
                      <ul className="space-y-2">
                        {profile.features.map((feature) => (
                          <li key={feature} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase - Alternating Layout */}
      <section className="py-24 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional-grade tools that understand the nuances of every sport and training methodology.
            </p>
          </motion.div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                  feature.imageLeft ? "lg:grid-flow-row" : "lg:grid-flow-row-dense"
                )}
              >
                {/* Image Placeholder */}
                <div className={cn(
                  "aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-border/30 flex items-center justify-center",
                  !feature.imageLeft && "lg:col-start-2"
                )}>
                  <div className="text-6xl opacity-20">
                    {feature.title.includes('Training') && '📊'}
                    {feature.title.includes('Health') && '❤️'}
                    {feature.title.includes('AI') && '🤖'}
                    {feature.title.includes('Communication') && '💬'}
                  </div>
                </div>

                {/* Content */}
                <div className={cn(
                  "space-y-6",
                  !feature.imageLeft && "lg:col-start-1 lg:row-start-1"
                )}>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="py-24 bg-muted/20 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Every Sport. Every Athlete.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From endurance sports to combat disciplines, team games to individual pursuits—ATHLO speaks your sport's language.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
          >
            {[...popularSports, ...extraSports].map((sport, index) => {
              const Icon = sport.icon;
              return (
                <motion.div
                  key={sport.id}
                  variants={staggerItem}
                  className="aspect-square bg-card border border-border/30 rounded-xl flex flex-col items-center justify-center p-4 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <span className="text-2xl mb-1">{sport.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                    {sport.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <span className="text-lg">+ and many more sports</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-24 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Trusted by Athletes Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              From recreational enthusiasts to professional athletes across every discipline
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={staggerItem}
                className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Section - Why ATHLO? */}
      <section className="py-24 bg-muted/20 snap-start">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why ATHLO?
            </h2>
            <p className="text-xl text-muted-foreground">
              See how we compare to other training platforms
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="overflow-x-auto"
          >
            <table className="w-full bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-6 font-semibold text-foreground">Features</th>
                  <th className="text-center p-6 bg-primary/5 border-l border-r border-primary/20">
                    <div className="flex flex-col items-center">
                      <Logo size="sm" />
                      <Badge className="mt-1 bg-primary text-primary-foreground">ATHLO</Badge>
                    </div>
                  </th>
                  <th className="text-center p-6 text-muted-foreground">TrainingPeaks</th>
                  <th className="text-center p-6 text-muted-foreground">Strava</th>
                  <th className="text-center p-6 text-muted-foreground">WHOOP</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.name} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-foreground">{feature.name}</td>
                    <td className="p-4 text-center bg-primary/5 border-l border-r border-primary/10">
                      {feature.athlo ? (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {feature.trainingpeaks ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {feature.strava ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {feature.whoop ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Start free, upgrade when ready
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your training journey
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                className={cn(
                  "bg-card border rounded-2xl p-8 relative",
                  plan.popular 
                    ? "border-primary shadow-xl shadow-primary/10 scale-105" 
                    : "border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-primary hover:bg-primary/90" 
                        : "variant-outline"
                    )}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-primary/5 via-background to-primary/10 snap-start">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
              Ready to transform
              <br />
              <span className="text-primary">your training?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of athletes and coaches who've already elevated their performance with ATHLO.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-16 px-12 text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all">
                Start Your Free Trial
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Product */}
            <div>
              <h3 className="font-bold text-foreground mb-6">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/ai-coach" className="text-muted-foreground hover:text-primary transition-colors">AI Coach</Link></li>
                <li><Link href="/integrations" className="text-muted-foreground hover:text-primary transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="text-muted-foreground hover:text-primary transition-colors">API</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-foreground mb-6">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/press" className="text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-foreground mb-6">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
                <li><Link href="/security" className="text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-bold text-foreground mb-6">Connect</h3>
              <ul className="space-y-3">
                <li><Link href="https://twitter.com/athlo" className="text-muted-foreground hover:text-primary transition-colors">Twitter</Link></li>
                <li><Link href="https://instagram.com/athlo" className="text-muted-foreground hover:text-primary transition-colors">Instagram</Link></li>
                <li><Link href="https://linkedin.com/company/athlo" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</Link></li>
                <li><Link href="https://github.com/athlo" className="text-muted-foreground hover:text-primary transition-colors">GitHub</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <p className="text-sm text-muted-foreground">
                  © 2025 ATHLO. All rights reserved.
                </p>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Built with ❤️ in Poland 🇵🇱
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Smooth Scroll Style */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
        }
        section {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
}