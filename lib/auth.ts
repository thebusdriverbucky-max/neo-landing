import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const ADMIN_TOKEN_COOKIE = 'admin_token';

/**
 * Returns true when JWT_SECRET is configured.
 * Used to fail fast (with a clear error) instead of silently falling back
 * to an insecure default secret.
 */
export function hasJwtSecret(): boolean {
  return Boolean(process.env.JWT_SECRET);
}

/**
 * Returns the encoded JWT secret. Throws when JWT_SECRET is not set —
 * there is intentionally NO fallback: running with a default secret would
 * allow anyone to forge admin tokens.
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET is not set. Add it to your environment (.env) — see .env.example.'
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Checks the admin_token cookie for a valid admin JWT.
 * Safe to use in Route Handlers / Server Components (uses next/headers).
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token || !hasJwtSecret()) return false;

  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}
