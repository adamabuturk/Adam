import { NextRequest, NextResponse } from 'next/server';
import { getSession, getSessionFromHeader } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = authHeader ? await getSessionFromHeader(authHeader) : await getSession();

  if (!user) return NextResponse.json({ active: false, authenticated: false });

  const sub = user.subscription;
  const active = !!sub && ['active', 'trialing'].includes(sub.status);

  return NextResponse.json({
    authenticated: true,
    active,
    plan: sub?.plan ?? null,
    periodEnd: sub?.currentPeriodEnd ?? null,
  });
}
