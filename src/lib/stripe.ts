import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-01-28.clover',
});

export interface CheckoutData {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PortalData {
  customerId: string;
  returnUrl: string;
}

export async function createCheckout(data: CheckoutData): Promise<{ url: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Mock mode for development
    return { url: '/billing?checkout=success' };
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: data.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
    client_reference_id: data.userId,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return { url: session.url! };
}

export async function createPortalSession(data: PortalData): Promise<{ url: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Mock mode for development
    return { url: '/billing' };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: data.customerId,
    return_url: data.returnUrl,
  });

  return { url: session.url };
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Mock subscription data
    return {
      id: 'sub_mock',
      status: 'active',
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      items: {
        data: [{
          price: {
            id: 'price_pro',
            nickname: 'Pro Plan',
          }
        }]
      }
    } as any;
  }

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return null;
  }
}

export default stripe;