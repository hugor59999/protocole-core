import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body || {};

  if (!password || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Password required' },
      { status: 400 }
    );
  }

  const expectedPassword = process.env.DASHBOARD_PASSWORD || 'admin';

  if (password !== expectedPassword) {
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  }

  // Set cookie server-side
  const cookieStore = await cookies();
  cookieStore.set('dashboard_auth', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400, // 24 hours
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
