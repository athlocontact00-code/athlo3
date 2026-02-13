'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlanCard } from '@/components/billing/plan-card';
import { UsageMeter } from '@/components/billing/usage-meter';
import { plans, Plan } from '@/lib/stripe-plans';

// Mock data
const currentPlan = 'free';
const mockUsage = [
  { name: 'AI Queries', used: 7, limit: 10, unit: 'queries' },
  { name: 'Athletes', used: 1, limit: 1, unit: 'athletes' },
  { name: 'Storage', used: 45, limit: 100, unit: 'MB' },
];

const mockBillingHistory = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Pro Plan - Monthly',
    amount: 14.99,
    status: 'paid',
    invoice: 'inv_1234',
  },
  {
    id: '2',
    date: '2023-12-15',
    description: 'Pro Plan - Monthly',
    amount: 14.99,
    status: 'paid',
    invoice: 'inv_1233',
  },
  {
    id: '3',
    date: '2023-11-15',
    description: 'Pro Plan - Monthly',
    amount: 14.99,
    status: 'paid',
    invoice: 'inv_1232',
  },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = async (planId: string) => {
    if (planId === currentPlan) return;
    
    setLoading(true);
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan?.stripeId) {
        console.log(`Selected ${planId} plan (no Stripe ID - mock mode)`);
        setTimeout(() => {
          setLoading(false);
          // Mock success
        }, 2000);
        return;
      }

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripeId,
          userId: 'user_mock_123', // In real app, get from session
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: 'cus_mock_123', // In real app, get from user data
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Plans</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleManageBilling}
          className="gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Manage Billing
        </Button>
      </div>

      {/* Current Plan Status */}
      <Card className="p-6 bg-gradient-to-r from-red-950/20 to-red-900/10 border-red-600/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-400">
              Current Plan: {plans.find(p => p.id === currentPlan)?.name}
            </h3>
            <p className="text-muted-foreground">
              {currentPlan === 'free' 
                ? 'Upgrade to unlock premium features' 
                : 'Next billing: February 15, 2024'
              }
            </p>
          </div>
          <Badge variant="outline" className="bg-red-950/30 text-red-400 border-red-600/30">
            Active
          </Badge>
        </div>
      </Card>

      {/* Usage Overview */}
      <UsageMeter items={mockUsage} />

      {/* Plan Comparison */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: plans.indexOf(plan) * 0.1 }}
            >
              <PlanCard
                plan={plan}
                isCurrentPlan={plan.id === currentPlan}
                onSelect={handlePlanSelect}
                loading={loading && selectedPlan === plan.id}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      {currentPlan !== 'free' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Billing History</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockBillingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border border-border/40">
                <div>
                  <p className="font-medium">{invoice.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">${invoice.amount}</p>
                    <Badge 
                      variant="outline" 
                      className="bg-green-950/30 text-green-400 border-green-600/30"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cancel Subscription */}
      {currentPlan !== 'free' && (
        <Card className="p-6 border-red-600/30 bg-red-950/10">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-400">Cancel Subscription</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your subscription will remain active until the end of your current billing period.
              </p>
              <Button variant="outline" size="sm" className="mt-4 border-red-600/50 text-red-400 hover:bg-red-950/20">
                Cancel Subscription
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}