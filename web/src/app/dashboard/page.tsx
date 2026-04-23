import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import ApplicationCard from '@/components/ApplicationCard';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect('/auth/signin');

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { appliedAt: 'desc' },
    take: 50,
  });

  const subscription = user.subscription;
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

  const total = applications.length;
  const today = applications.filter(
    (a) => new Date(a.appliedAt).toDateString() === new Date().toDateString()
  ).length;
  const interviews = applications.filter((a) => a.status === 'interview').length;
  const offers = applications.filter((a) => a.status === 'offer').length;

  const statCards = [
    { label: 'Total Applied', value: total, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Today', value: today, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Interviews', value: interviews, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Offers', value: offers, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Welcome back, {user.profile?.firstName || user.name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {subscription?.plan.charAt(0).toUpperCase()}{subscription?.plan.slice(1)} Plan
              </span>
            ) : (
              <Link href="/pricing" className="btn-primary text-sm px-4 py-2">
                Upgrade Plan →
              </Link>
            )}
            <Link href="/download" className="btn-secondary text-sm px-4 py-2">
              Get Extension
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="card p-5">
              <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subscription notice */}
        {!isActive && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between mb-8">
            <div>
              <p className="font-semibold text-amber-800">No active subscription</p>
              <p className="text-amber-700 text-sm">
                Subscribe to start automating your job applications.
              </p>
            </div>
            <Link href="/pricing" className="btn-primary text-sm px-5 py-2.5 shrink-0">
              View Plans
            </Link>
          </div>
        )}

        {/* Applications table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-lg">Recent Applications</h2>
            <span className="text-sm text-slate-400">{total} total</span>
          </div>

          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
              <p className="text-slate-500 text-sm max-w-xs mb-6">
                Install the extension, browse jobs on LinkedIn or Indeed, and AutoApply will fill
                and submit applications for you.
              </p>
              <Link href="/download" className="btn-primary text-sm px-6 py-3">
                Get the Extension →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
