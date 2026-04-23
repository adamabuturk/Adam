import PricingCard from '@/components/PricingCard';
import { PLANS } from '@/lib/stripe';

const faqs = [
  {
    q: 'How does the free trial work?',
    a: 'You get 5 free applications when you sign up — no credit card required. After that, choose any plan to continue.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. You can cancel your subscription at any time from your dashboard. You keep access until the end of your billing period.',
  },
  {
    q: 'Which job platforms are supported?',
    a: 'LinkedIn Easy Apply and Indeed are fully supported. Glassdoor and more platforms are coming soon.',
  },
  {
    q: 'Is my data safe?',
    a: 'Your profile data is encrypted and never shared with third parties. We only use it to fill job applications on your behalf.',
  },
  {
    q: 'Does it work on all job listings?',
    a: 'AutoApply works best with platform-native apply flows (like LinkedIn Easy Apply). External application sites may vary.',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-100 py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-4">Pricing</h1>
          <p className="text-slate-500 text-lg">
            Start free. Scale as your job search grows. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(PLANS).map(([key, plan]) => (
            <PricingCard key={key} planKey={key} plan={plan} featured={key === 'pro'} />
          ))}
        </div>
        <p className="text-center text-slate-400 text-sm mt-8">
          All plans include a 5-application free trial · Secure payment via Stripe
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="card p-6">
              <h3 className="font-semibold text-base mb-2">{faq.q}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
