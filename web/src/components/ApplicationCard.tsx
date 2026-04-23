'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  platform: string;
  jobUrl: string;
  status: string;
  appliedAt: Date | string;
  notes?: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  applied: 'bg-blue-50 text-blue-700',
  interview: 'bg-amber-50 text-amber-700',
  offer: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-600',
};

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: '🔵',
  indeed: '🟡',
  glassdoor: '🟢',
};

const STATUSES = ['applied', 'interview', 'offer', 'rejected'];

export default function ApplicationCard({ application }: { application: Application }) {
  const [status, setStatus] = useState(application.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: application.id, status: newStatus }),
    });
    setStatus(newStatus);
    setUpdating(false);
  };

  const appliedAt = new Date(application.appliedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
      <div className="text-2xl shrink-0">
        {PLATFORM_ICONS[application.platform] ?? '🌐'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{application.jobTitle}</div>
        <div className="text-slate-500 text-xs mt-0.5">
          {application.company} · {appliedAt}
        </div>
      </div>

      <div className="shrink-0">
        <select
          value={status}
          disabled={updating}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={clsx(
            'text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer',
            STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'
          )}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {application.jobUrl && (
        <a
          href={application.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-700 transition-colors shrink-0"
          title="View job"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
