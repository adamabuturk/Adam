import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanByPriceId } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

async function upsertSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  const priceId = sub.items.data[0]?.price.id;
  const plan = priceId ? (getPlanByPriceId(priceId) ?? 'starter') : 'starter';

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    update: {
      status: sub.status,
      stripePriceId: priceId,
      plan,
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
    create: {
      userId,
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      plan,
      status: sub.status,
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession;
      if (session.mode === 'subscription' && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertSubscription(sub);
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.created':
      await upsertSubscription(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: 'canceled' },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
