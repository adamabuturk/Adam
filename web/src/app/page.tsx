import Link from 'next/link';
import PricingCard from '@/components/PricingCard';
import { PLANS } from '@/lib/stripe';

const stats = [
  { value: '12,000+', label: 'Applications submitted' },
  { value: '3.2×', label: 'More interviews' },
  { value: '4 hrs', label: 'Saved per week' },
  { value: '98%', label: 'Form fill accuracy' },
];

const platforms = [
  { name: 'LinkedIn', icon: '🔵', color: 'bg-blue-50 text-blue-700' },
  { name: 'Indeed', icon: '🟡', color: 'bg-yellow-50 text-yellow-700' },
  { name: 'Glassdoor', icon: '🟢', color: 'bg-green-50 text-green-700' },
  { name: 'More coming', icon: '➕', color: 'bg-slate-50 text-slate-500' },
];

const steps = [
  {
    step: '01',
    title: 'Create your profile',
    desc: 'Add your resume, skills, and experience once. AutoApply remembers everything.',
  },
  {
    step: '02',
    title: 'Install the extension',
    desc: 'Add our Chrome extension in seconds. It connects instantly to your account.',
  },
  {
    step: '03',
    title: 'Browse and apply',
    desc: 'Visit any job listing. AutoApply detects the form and fills it for you automatically.',
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Now live on LinkedIn & Indeed
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Apply to 100s of jobs
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              while you sleep
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            AutoApply fills job application forms automatically on LinkedIn, Indeed, and more.
            Set up your profile once, then let us handle the rest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
              Start for free →
            </Link>
            <Link href="/pricing" className="btn-secondary text-base px-8 py-4 !bg-white/5 !text-white !border-white/10 hover:!bg-white/10">
              See pricing
            </Link>
          </div>

          <p className="text-slate-500 text-sm mt-6">No credit card required for trial · Cancel anytime</p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-blue-600">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-6">
          Works on
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {platforms.map((p) => (
            <div key={p.name} className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold ${p.color}`}>
              <span>{p.icon}</span> {p.name}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold">How it works</h2>
            <p className="text-slate-500 mt-3">Three steps to automated job applications</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="card p-8">
                <div className="text-5xl font-extrabold text-blue-100 mb-4">{s.step}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold">Simple pricing</h2>
            <p className="text-slate-500 mt-3">Pick a plan and start applying today</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <PricingCard key={key} planKey={key} plan={plan} featured={key === 'pro'} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to land your next job faster?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of job seekers who save hours every week with AutoApply.
          </p>
          <Link href="/auth/signup" className="btn-secondary text-base px-10 py-4">
            Get started free →
          </Link>
        </div>
      </section>
    </>
  );
}
