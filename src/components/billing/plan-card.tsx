'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plan, formatPrice, getFeatureValue } from '@/lib/stripe-plans';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelect?: (planId: string) => void;
  loading?: boolean;
}

export function PlanCard({ plan, isCurrentPlan, onSelect, loading }: PlanCardProps) {
  const handleSelect = () => {
    if (!isCurrentPlan && onSelect) {
      onSelect(plan.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative",
        plan.highlighted && "z-10"
      )}
    >
      <Card className={cn(
        "p-6 h-full flex flex-col relative overflow-hidden",
        "border-border/40 bg-card/80 backdrop-blur-sm",
        plan.highlighted && "border-red-600/50 bg-red-950/20",
        isCurrentPlan && "ring-2 ring-red-600/30"
      )}>
        {plan.highlighted && (
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-600/10 rounded-full" />
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={cn(
              "text-xl font-bold",
              plan.highlighted && "text-red-600"
            )}>
              {plan.name}
            </h3>
            {plan.highlighted && (
              <Badge variant="secondary" className="mt-1 bg-red-600/20 text-red-400 border-red-600/30">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Recommended
              </Badge>
            )}
          </div>
          
          {isCurrentPlan && (
            <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-600/30">
              Current Plan
            </Badge>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-1 mb-2">
            <span className={cn(
              "text-3xl font-bold",
              plan.highlighted && "text-red-500"
            )}>
              {formatPrice(plan.price, plan.currency)}
            </span>
            {plan.price > 0 && (
              <span className="text-muted-foreground">/{plan.period}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {plan.description}
          </p>
        </div>

        <div className="flex-1 mb-6">
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                  feature.included 
                    ? "bg-green-600/20 text-green-400" 
                    : "bg-gray-600/20 text-gray-500"
                )}>
                  {feature.included && <Check className="w-3 h-3" />}
                  {!feature.included && <span className="text-xs">×</span>}
                </div>
                <div className="flex-1">
                  <span className={cn(
                    "text-sm",
                    !feature.included && "text-muted-foreground line-through"
                  )}>
                    {feature.name}
                  </span>
                  {feature.included && feature.limit && (
                    <div className="text-xs text-muted-foreground">
                      {getFeatureValue(plan, feature.name)}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={handleSelect}
          disabled={isCurrentPlan || loading}
          variant={plan.highlighted ? "default" : "outline"}
          className={cn(
            "w-full font-medium",
            plan.highlighted && "bg-red-600 hover:bg-red-700 border-red-600",
            isCurrentPlan && "opacity-50"
          )}
        >
          {loading && "Processing..."}
          {!loading && isCurrentPlan && "Current Plan"}
          {!loading && !isCurrentPlan && (plan.price > 0 ? "Upgrade" : "Get Started")}
        </Button>
      </Card>
    </motion.div>
  );
}