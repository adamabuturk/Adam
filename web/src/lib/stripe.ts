import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 19,
    priceId: process.env.STRIPE_PRICE_STARTER!,
    applications: 50,
    features: [
      '50 applications / month',
      'LinkedIn automation',
      'Basic profile setup',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 39,
    priceId: process.env.STRIPE_PRICE_PRO!,
    applications: 200,
    features: [
      '200 applications / month',
      'LinkedIn + Indeed automation',
      'Smart form filling',
      'Application tracking dashboard',
      'Priority support',
    ],
  },
  unlimited: {
    name: 'Unlimited',
    price: 79,
    priceId: process.env.STRIPE_PRICE_UNLIMITED!,
    applications: Infinity,
    features: [
      'Unlimited applications',
      'All platforms',
      'AI cover letter generation',
      'Advanced analytics',
      'Dedicated support',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return key as PlanKey;
  }
  return null;
}
