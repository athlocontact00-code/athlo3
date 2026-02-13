'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Users,
  Trophy,
  Heart,
  Zap,
  Globe,
  Medal,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/common/logo';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
  const team = [
    {
      name: "Anna Kowalska",
      role: "Founder & CEO",
      bio: "Former Olympic athlete turned tech entrepreneur. Passionate about democratizing elite sports coaching.",
      avatar: "AK"
    },
    {
      name: "Marcin Nowak",
      role: "Head of Product",
      bio: "15+ years in sports tech. Built training systems for professional teams across Europe.",
      avatar: "MN"
    },
    {
      name: "Katarzyna Wiśniewska",
      role: "AI Engineering Lead",
      bio: "PhD in Machine Learning. Previously worked on performance analytics for Formula 1.",
      avatar: "KW"
    },
    {
      name: "Piotr Zieliński",
      role: "Sports Science Director",
      bio: "Sports physiologist with 20+ years experience. Worked with Polish national teams.",
      avatar: "PZ"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for perfection in every detail, from user experience to coaching science."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections between athletes, coaches, and sports enthusiasts worldwide."
    },
    {
      icon: Trophy,
      title: "Performance",
      description: "Helping every athlete reach their potential through data-driven insights."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our love for sports drives everything we do, from product development to customer support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 py-16 space-y-20"
      >
        {/* Hero Section */}
        <motion.section variants={item} className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <MapPin className="h-4 w-4" />
            Made in Warsaw, Poland 🇵🇱
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            About <span className="text-primary">ATHLO</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building the universal sports platform that every athlete deserves. 
            From weekend warriors to Olympic champions, ATHLO provides the tools, 
            insights, and community to elevate performance.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section variants={item} className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Democratize elite-level sports science and coaching for every athlete, regardless of budget or location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Universal Platform</h3>
                    <p className="text-muted-foreground">
                      Supporting every sport imaginable - from running and cycling to CrossFit, 
                      football, MMA, and everything in between. One platform, infinite possibilities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Coaching</h3>
                    <p className="text-muted-foreground">
                      Advanced AI analyzes your training data, biomechanics, and recovery metrics 
                      to provide personalized coaching that adapts to your unique needs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Polish Pride Section */}
        <motion.section variants={item} className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
              <span>Proudly Polish</span>
              <span className="text-3xl">🇵🇱</span>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Born in Warsaw, inspired by Poland's rich sporting heritage and innovative tech scene.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-red-500/5 to-white/5 border-red-500/20">
            <CardContent className="p-8 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Medal className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">Heritage</h3>
                  <p className="text-sm text-muted-foreground">
                    Following in the footsteps of Polish sporting legends like Agnieszka Radwańska, 
                    Robert Lewandowski, and Anita Włodarczyk.
                  </p>
                </div>
                <div className="space-y-2">
                  <Zap className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Part of Warsaw's thriving tech ecosystem, combining traditional Polish work ethic 
                    with cutting-edge technology.
                  </p>
                </div>
                <div className="space-y-2">
                  <Globe className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">Global Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    Built in Poland, designed for the world. Supporting athletes across all continents 
                    and cultures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Values Section */}
        <motion.section variants={item} className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 group-hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section variants={item} className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A diverse group of athletes, engineers, and sports scientists united by a shared passion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg mx-auto group-hover:bg-primary/20 transition-colors">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                      <Badge variant="outline" className="mt-1">{member.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section variants={item} className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Join Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your journey with ATHLO today and experience the future of sports training.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.section>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                Universal sports platform for every athlete.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground">Contact</Link>
                <Link href="/careers" className="block text-muted-foreground hover:text-foreground">Careers</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
                <Link href="/features" className="block text-muted-foreground hover:text-foreground">Features</Link>
                <Link href="/integrations" className="block text-muted-foreground hover:text-foreground">Integrations</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy</Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-foreground">Terms</Link>
                <Link href="/cookies" className="block text-muted-foreground hover:text-foreground">Cookies</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ATHLO. Made with ❤️ in Warsaw, Poland 🇵🇱</p>
          </div>
        </div>
      </footer>
    </div>
  );
}