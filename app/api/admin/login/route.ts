import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_TOKEN_COOKIE, getJwtSecret, hasJwtSecret } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

function sha256(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest();
}

export async function POST(request: Request) {
  // Brute-force protection: max 5 attempts per IP per 15 minutes
  const ip = getClientIp(request);
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    if (!process.env.ADMIN_PASSWORD || !hasJwtSecret()) {
      console.error(
        'Admin auth is not configured: ADMIN_PASSWORD and JWT_SECRET must be set (see .env.example).'
      );
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { password } = await request.json();

    // Timing-safe comparison via hashed values to avoid leaking the password
    const provided = sha256(String(password ?? ''));
    const expected = sha256(process.env.ADMIN_PASSWORD);
    const valid =
      provided.length === expected.length && timingSafeEqual(provided, expected);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(getJwtSecret());

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
