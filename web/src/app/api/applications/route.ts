import { NextRequest, NextResponse } from 'next/server';
import { getSession, getSessionFromHeader } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function resolveUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader) return getSessionFromHeader(authHeader);
  return getSession();
}

export async function GET(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');
  const status = searchParams.get('status');

  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
      ...(platform ? { platform } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { appliedAt: 'desc' },
    take: 100,
  });

  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify subscription is active
  const sub = user.subscription;
  if (!sub || !['active', 'trialing'].includes(sub.status)) {
    return NextResponse.json({ error: 'Active subscription required.' }, { status: 403 });
  }

  const { jobTitle, company, platform, jobUrl, status, notes } = await req.json();

  if (!jobTitle || !company || !platform) {
    return NextResponse.json({ error: 'jobTitle, company and platform are required.' }, { status: 400 });
  }

  // Enforce monthly limit based on plan
  const planLimits: Record<string, number> = { starter: 50, pro: 200, unlimited: Infinity };
  const limit = planLimits[sub.plan] ?? 0;

  if (limit < Infinity) {
    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const count = await prisma.application.count({
      where: { userId: user.id, appliedAt: { gte: periodStart } },
    });

    if (count >= limit) {
      return NextResponse.json(
        { error: `Monthly limit of ${limit} applications reached. Upgrade your plan.` },
        { status: 429 }
      );
    }
  }

  const application = await prisma.application.create({
    data: { userId: user.id, jobTitle, company, platform, jobUrl: jobUrl || '', status: status || 'applied', notes },
  });

  return NextResponse.json({ ok: true, application }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, notes } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const existing = await prisma.application.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const updated = await prisma.application.update({
    where: { id },
    data: { ...(status ? { status } : {}), ...(notes !== undefined ? { notes } : {}) },
  });

  return NextResponse.json({ ok: true, application: updated });
}
