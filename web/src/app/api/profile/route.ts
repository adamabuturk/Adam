import { NextRequest, NextResponse } from 'next/server';
import { getSession, getSessionFromHeader } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Used by both web (cookie) and extension (Bearer token)
async function resolveUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader) return getSessionFromHeader(authHeader);
  return getSession();
}

export async function GET(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    profile: user.profile,
  });
}

export async function PUT(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { firstName, lastName, phone, location, linkedin, skills, coverLetter } = body;

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: { firstName, lastName, phone, location, linkedin, skills: skills ?? [], coverLetter },
    create: {
      userId: user.id,
      firstName,
      lastName,
      phone,
      location,
      linkedin,
      skills: skills ?? [],
      coverLetter,
    },
  });

  return NextResponse.json({ ok: true, profile });
}
