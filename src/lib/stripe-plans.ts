export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
  unit?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: PlanFeature[];
  stripeId?: string;
  highlighted?: boolean;
  current?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      { name: 'Basic workout tracking', included: true },
      { name: 'Manual data entry', included: true },
      { name: 'Simple analytics', included: true },
      { name: 'AI queries', included: true, limit: 10, unit: 'per month' },
      { name: 'Athletes managed', included: true, limit: 1 },
      { name: 'Data storage', included: true, limit: 100, unit: 'MB' },
      { name: 'Advanced analytics', included: false },
      { name: 'Integrations (Strava, Garmin)', included: false },
      { name: 'Team features', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 14.99,
    currency: 'USD',
    period: 'month',
    description: 'For serious athletes',
    stripeId: 'price_pro_monthly',
    highlighted: true,
    features: [
      { name: 'Everything in Free', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Integrations (Strava, Garmin)', included: true },
      { name: 'AI queries', included: true, limit: 100, unit: 'per month' },
      { name: 'Athletes managed', included: true, limit: 5 },
      { name: 'Data storage', included: true, limit: 1, unit: 'GB' },
      { name: 'Training zones calculator', included: true },
      { name: 'Race predictor', included: true },
      { name: 'Email support', included: true },
      { name: 'Team features', included: false },
    ],
  },
  {
    id: 'coach',
    name: 'Coach',
    price: 29.99,
    currency: 'USD',
    period: 'month',
    description: 'For coaches and trainers',
    stripeId: 'price_coach_monthly',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Team features', included: true },
      { name: 'AI queries', included: true, limit: 500, unit: 'per month' },
      { name: 'Athletes managed', included: true, limit: 25 },
      { name: 'Data storage', included: true, limit: 5, unit: 'GB' },
      { name: 'Workout templates library', included: true },
      { name: 'Group messaging', included: true },
      { name: 'Athlete onboarding', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom branding', included: false },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 49.99,
    currency: 'USD',
    period: 'month',
    description: 'For organizations and clubs',
    stripeId: 'price_team_monthly',
    features: [
      { name: 'Everything in Coach', included: true },
      { name: 'Custom branding', included: true },
      { name: 'AI queries', included: true, limit: -1, unit: 'unlimited' },
      { name: 'Athletes managed', included: true, limit: -1, unit: 'unlimited' },
      { name: 'Data storage', included: true, limit: 25, unit: 'GB' },
      { name: 'API access', included: true },
      { name: 'Advanced reporting', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'SSO integration', included: true },
    ],
  },
];

export function getPlanById(planId: string): Plan | undefined {
  return plans.find(plan => plan.id === planId);
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  if (price === 0) return 'Free';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function getFeatureValue(plan: Plan, featureName: string): string {
  const feature = plan.features.find(f => f.name === featureName);
  if (!feature || !feature.included) return 'Not included';
  
  if (feature.limit === -1) return 'Unlimited';
  if (feature.limit && feature.unit) return `${feature.limit} ${feature.unit}`;
  
  return 'Included';
}