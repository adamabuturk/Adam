import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AutoApply – Automate Your Job Search',
  description:
    'Apply to hundreds of jobs on LinkedIn, Indeed, and more with one click. AutoApply fills forms, tracks applications, and saves you hours every week.',
  keywords: ['job application automation', 'LinkedIn bot', 'auto apply jobs', 'job search tool'],
  openGraph: {
    title: 'AutoApply – Automate Your Job Search',
    description: 'Apply to hundreds of jobs automatically. Save hours every week.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
