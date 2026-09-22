import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import {
  createGraceToken,
  verifyGraceToken,
  verifyLicenseToken,
  fetchLicenseValidation,
  LICENSE_COOKIE_NAME,
} from '@/lib/license';
import { getJwtSecret } from '@/lib/auth';

// Paths that skip license check entirely
const LICENSE_SKIP_PATHS = [
  '/license-required',
  '/admin/login',
  '/api/admin/login',
  '/api/auth',
  '/api/stripe/webhooks',
  '/_next',
  '/favicon.ico',
];

async function adminAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, getJwtSecret());
      return null;
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return null;
}

async function licenseMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  // Skip check for system paths
  if (LICENSE_SKIP_PATHS.some(p => pathname.startsWith(p))) {
    return null;
  }


  // Check existing JWT cookie
  const cookieToken = request.cookies.get(LICENSE_COOKIE_NAME)?.value;
  if (cookieToken) {
    if (await verifyLicenseToken(cookieToken)) return null;
    if (await verifyGraceToken(cookieToken)) return null;
  }

  // Cookie missing or expired — fetch from license server
  const { valid, token, grace } = await fetchLicenseValidation();

  if (!valid) {
    // License invalid or revoked — block access
    const url = request.nextUrl.clone();
    url.pathname = '/license-required';
    return NextResponse.redirect(url);
  }

  // Valid — we need to set/refresh cookie, but we also need to allow other middlewares to run
  // So we'll return a response only if we actually need to set a cookie.
  // If we just want to continue, we return null.

  if (token || grace) {
    const response = NextResponse.next();
    if (token) {
      response.cookies.set(LICENSE_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 48,
        path: '/',
      });
    } else if (grace) {
      try {
        const graceToken = await createGraceToken(6);
        response.cookies.set(LICENSE_COOKIE_NAME, graceToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 6,
          path: '/',
        });
      } catch {
        // Without a configured shared secret no unverifiable grace cookie is
        // persisted; the next request will retry the license server.
      }
    }
    return response;
  }

  return null;
}

export default async function middleware(request: NextRequest) {
  // 1. License check first
  const licenseResponse = await licenseMiddleware(request);
  // If licenseMiddleware returns a redirect, return it immediately
  if (licenseResponse && licenseResponse.status >= 300 && licenseResponse.status < 400) {
    return licenseResponse;
  }

  // 2. Admin auth check
  const adminResponse = await adminAuthMiddleware(request);
  if (adminResponse) return adminResponse;

  // 3. If licenseMiddleware returned a response (to set cookies), but not a redirect,
  // we should ideally merge it with the next response. 
  // But for simplicity, if licenseMiddleware wanted to set cookies, we return its response.
  // However, we must ensure adminAuthMiddleware didn't want to redirect.
  if (licenseResponse) return licenseResponse;

  // 4. Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
