import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Navbar() {
  const user = await getSession();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-blue-600 tracking-tight">
          ⚡ AutoApply
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
            Pricing
          </Link>
          <Link href="/download" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
            Download
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Profile
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="btn-secondary text-sm px-4 py-2">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">
                Get started →
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu placeholder — toggle with JS in a real app */}
        <div className="md:hidden">
          {user ? (
            <Link href="/dashboard" className="btn-primary text-sm px-4 py-2">Dashboard</Link>
          ) : (
            <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">Get started</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
