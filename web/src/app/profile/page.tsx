'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  linkedin: string;
  skills: string;
  coverLetter: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    linkedin: '',
    skills: '',
    coverLetter: '',
  });
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => {
        if (r.status === 401) { router.push('/auth/signin'); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setEmail(data.user?.email || '');
        const p = data.profile || {};
        setForm({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          phone: p.phone || '',
          location: p.location || '',
          linkedin: p.linkedin || '',
          skills: (p.skills || []).join(', '),
          coverLetter: p.coverLetter || '',
        });
        setLoading(false);
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold mb-2">Profile</h1>
        <p className="text-slate-500 mb-8">
          This information is used to auto-fill job applications. Keep it accurate and up to date.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account */}
          <div className="card p-6">
            <h2 className="font-bold text-base mb-4">Account</h2>
            <div>
              <label className="label">Email address</label>
              <input className="input bg-slate-50 text-slate-400 cursor-not-allowed" value={email} disabled />
            </div>
          </div>

          {/* Personal info */}
          <div className="card p-6">
            <h2 className="font-bold text-base mb-4">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" className="input" value={form.firstName} onChange={handleChange} placeholder="Jane" />
              </div>
              <div>
                <label className="label" htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" className="input" value={form.lastName} onChange={handleChange} placeholder="Smith" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="label" htmlFor="location">City / Location</label>
                <input id="location" name="location" className="input" value={form.location} onChange={handleChange} placeholder="San Francisco, CA" />
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="card p-6">
            <h2 className="font-bold text-base mb-4">Professional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="linkedin">LinkedIn URL</label>
                <input id="linkedin" name="linkedin" className="input" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" />
              </div>
              <div>
                <label className="label" htmlFor="skills">Skills <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                <input id="skills" name="skills" className="input" value={form.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js, Python" />
              </div>
            </div>
          </div>

          {/* Cover letter */}
          <div className="card p-6">
            <h2 className="font-bold text-base mb-1">Default Cover Letter</h2>
            <p className="text-slate-500 text-sm mb-4">Used when applications ask for a cover letter. You can personalise it per job later.</p>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={8}
              className="input resize-y"
              value={form.coverLetter}
              onChange={handleChange}
              placeholder="Dear Hiring Manager, I am excited to apply for..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="btn-primary px-8 py-3 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save profile'}
            </button>
            {saved && <span className="text-green-600 text-sm font-medium">✓ Saved successfully</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
