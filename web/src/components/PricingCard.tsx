'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

interface Plan {
  name: string;
  price: number;
  applications: number;
  features: readonly string[];
}

interface Props {
  planKey: string;
  plan: Plan;
  featured?: boolean;
}

export default function PricingCard({ planKey, plan, featured = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey }),
    });

    if (res.status === 401) {
      router.push(`/auth/signin`);
      return;
    }

    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  };

  return (
    <div
      className={clsx(
        'rounded-2xl p-8 flex flex-col relative',
        featured
          ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 scale-105'
          : 'bg-white border border-slate-100 shadow-sm'
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}

      <div className={clsx('text-sm font-semibold mb-2', featured ? 'text-blue-200' : 'text-blue-600')}>
        {plan.name}
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className="text-4xl font-extrabold">${plan.price}</span>
        <span className={clsx('text-sm mb-1', featured ? 'text-blue-200' : 'text-slate-400')}>/mo</span>
      </div>

      <p className={clsx('text-sm mb-6', featured ? 'text-blue-100' : 'text-slate-500')}>
        {plan.applications === Infinity ? 'Unlimited' : plan.applications} applications / month
      </p>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <span className={clsx('mt-0.5 text-base', featured ? 'text-blue-200' : 'text-green-500')}>✓</span>
            <span className={featured ? 'text-blue-50' : 'text-slate-600'}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={clsx(
          'w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-60',
          featured
            ? 'bg-white text-blue-600 hover:bg-blue-50'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
        )}
      >
        {loading ? 'Redirecting…' : `Get ${plan.name}`}
      </button>
    </div>
  );
}
