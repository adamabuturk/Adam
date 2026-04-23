import Link from 'next/link';

const steps = [
  { n: '1', title: 'Download the extension', desc: 'Click the button below to add AutoApply to Chrome.' },
  { n: '2', title: 'Sign in to your account', desc: 'Click the extension icon and sign in with your AutoApply account.' },
  { n: '3', title: 'Build your profile', desc: 'Fill in your resume details so AutoApply knows what to enter on forms.' },
  { n: '4', title: 'Start applying', desc: 'Browse jobs on LinkedIn or Indeed — AutoApply handles the rest.' },
];

export default function DownloadPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-white border-b border-slate-100 py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-6xl mb-6">⚡</div>
          <h1 className="text-5xl font-extrabold mb-4">Get the Extension</h1>
          <p className="text-slate-500 text-lg mb-10">
            Install AutoApply on Chrome and start automating your job applications in minutes.
          </p>
          {/* In production this links to the Chrome Web Store listing */}
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-10 py-4 inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-11v6l5-3-5-3z" />
            </svg>
            Add to Chrome — It&apos;s Free
          </a>
          <p className="text-slate-400 text-xs mt-4">Chrome 88+ required · No data sold to third parties</p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-center mb-12">Getting started</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="card p-6 flex gap-5">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                {s.n}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="card p-8 flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-3">System requirements</h3>
            <ul className="text-sm text-slate-500 space-y-1.5 list-disc list-inside">
              <li>Google Chrome version 88 or later</li>
              <li>Active AutoApply subscription</li>
              <li>LinkedIn or Indeed account</li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-3">Don&apos;t have an account?</h3>
            <p className="text-sm text-slate-500 mb-4">
              Sign up for free and get 5 applications to try AutoApply before subscribing.
            </p>
            <Link href="/auth/signup" className="btn-primary text-sm px-5 py-2.5">
              Create free account →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
