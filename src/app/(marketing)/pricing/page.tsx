'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/common/logo';

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    icon: Zap,
    features: [
      "Basic workout tracking",
      "Simple analytics",
      "Community access",
      "Mobile app",
      "Up to 5 workouts/month"
    ]
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious athletes",
    icon: Star,
    popular: true,
    features: [
      "Unlimited workouts",
      "AI coaching insights",
      "Advanced analytics",
      "Training plans",
      "Heart rate monitoring",
      "Integration with wearables",
      "Priority support"
    ]
  },
  {
    name: "Elite",
    price: "$49",
    period: "/month",
    description: "For professional athletes and coaches",
    icon: Trophy,
    features: [
      "Everything in Pro",
      "Team management",
      "Custom integrations",
      "Advanced AI features",
      "Biomechanics analysis",
      "1-on-1 coaching calls",
      "White-label options",
      "API access"
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost">About</Button>
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

      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready. All plans include our core features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-foreground">
                      {plan.price}
                      {plan.period && <span className="text-lg text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.price === 'Free' ? 'Get Started' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade, downgrade, or cancel anytime. Changes take effect immediately."
              },
              {
                q: "Is there a free trial?",
                a: "All paid plans include a 14-day free trial. No credit card required to start."
              },
              {
                q: "What integrations do you support?",
                a: "We integrate with Strava, Garmin, Apple Health, Google Fit, and many more platforms."
              },
              {
                q: "Do you offer team discounts?",
                a: "Yes! Teams of 5+ athletes get special pricing. Contact us for a custom quote."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}