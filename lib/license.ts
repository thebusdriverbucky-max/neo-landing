import { jwtVerify } from 'jose';

const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || '';
const LICENSE_KEY = process.env.LICENSE_KEY || '';
const LICENSE_PRODUCT = process.env.LICENSE_PRODUCT || 'neo-landing';
const LICENSE_SERVER_SECRET = process.env.LICENSE_SERVER_SECRET || '';

export const LICENSE_COOKIE_NAME = 'neo_license';

// Verify JWT locally — no network call, works in Edge Runtime.
// If LICENSE_SERVER_SECRET is not configured we cannot verify locally,
// so we return false and the middleware falls back to the license server.
export async function verifyLicenseToken(token: string): Promise<boolean> {
  if (!LICENSE_SERVER_SECRET) return false;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(LICENSE_SERVER_SECRET)
    );
    return payload.valid === true;
  } catch {
    return false;
  }
}

// Fetch fresh validation from license server
export async function fetchLicenseValidation(): Promise<{
  valid: boolean;
  token?: string;
  grace?: boolean;
  product?: string;
}> {
  // No key configured = license required
  if (!LICENSE_KEY || !LICENSE_SERVER_URL) {
    return { valid: false };
  }

  try {
    const response = await fetch(`${LICENSE_SERVER_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: LICENSE_KEY,
        product: LICENSE_PRODUCT
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    // Verify returned product matches what this project expects
    if (data.valid && data.product && data.product !== LICENSE_PRODUCT) {
      return { valid: false };
    }

    return data;
  } catch {
    // Server unreachable — grant grace period
    return { valid: true, grace: true };
  }
}
