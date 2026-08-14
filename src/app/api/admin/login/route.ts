import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    console.log('Login POST received');
    const body = await req.json();
    console.log('Body:', body);
    const { password } = body || {};

    if (!password || typeof password !== 'string') {
      console.log('Password missing or not string');
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    const expectedPassword = process.env.DASHBOARD_PASSWORD || 'admin';

    console.log('Login attempt:', {
      password,
      expectedPassword,
      match: password === expectedPassword
    });

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
  } catch (err: any) {
    console.error('Login error:', err.message);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
