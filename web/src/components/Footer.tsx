import Link from 'next/link';

const links = {
  Product: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Download Extension', href: '/download' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Account: [
    { label: 'Sign up', href: '/auth/signup' },
    { label: 'Sign in', href: '/auth/signin' },
    { label: 'Profile', href: '/profile' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-white font-extrabold text-lg mb-3">⚡ AutoApply</div>
          <p className="text-sm leading-relaxed">
            Automate your job applications on LinkedIn, Indeed, and more. Land interviews faster.
          </p>
        </div>

        {Object.entries(links).map(([section, items]) => (
          <div key={section}>
            <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs">© {new Date().getFullYear()} AutoApply. All rights reserved.</p>
          <p className="text-xs">Built with Next.js · Payments by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
