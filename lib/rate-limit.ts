import { createHash } from 'node:crypto';

type RateLimitResult = {
  ok: boolean;
  retryAfterSec?: number;
  unavailable?: boolean;
};

export type RateLimiterStatus =
  | { state: 'off' }
  | { state: 'ok' }
  | { state: 'error'; reason: string };

type UpstashPipelineItem = { result?: unknown; error?: string };

const IP_PATTERN = /^[a-f0-9:.]+$/i;
const UPSTASH_TIMEOUT_MS = 3000;
const MAX_MEMORY_BUCKETS = 10_000;

/** Trust only the client-IP header managed by Vercel, never raw proxy headers. */
export function getClientIp(request: Request): string {
  const platformIp = request.headers
    .get('x-vercel-forwarded-for')
    ?.split(',')[0]
    ?.trim();
  return platformIp && IP_PATTERN.test(platformIp) ? platformIp : 'anonymous';
}

function redisKey(key: string, windowMs: number): string {
  const digest = createHash('sha256').update(key).digest('hex');
  return `neo-landing:rate-limit:${windowMs}:${digest}`;
}

function upstashConfig() {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, ''),
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

/** Throws with an admin-readable message when Upstash cannot count the hit. */
async function upstashHit(
  url: string,
  token: string,
  key: string,
  windowMs: number,
): Promise<{ count: number; ttlMs: number }> {
  const bucketKey = redisKey(key, windowMs);
  let response: Response;
  try {
    response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', bucketKey],
        ['PEXPIRE', bucketKey, windowMs, 'NX'],
        ['PTTL', bucketKey],
      ]),
      cache: 'no-store',
      signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
    });
  } catch {
    throw new Error('Upstash could not be reached. Check UPSTASH_REDIS_REST_URL.');
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      `Upstash rejected the token (HTTP ${response.status}). Check UPSTASH_REDIS_REST_TOKEN — it must be the regular token, not the read-only one.`,
    );
  }
  if (!response.ok) throw new Error(`Upstash returned HTTP ${response.status}.`);

  const results = await response.json().catch(() => null) as UpstashPipelineItem[] | null;
  if (!Array.isArray(results)) throw new Error('Upstash returned an invalid response.');
  const failed = results.find((item) => item?.error);
  if (failed) {
    throw new Error(
      `Upstash refused the command: ${failed.error}. A read-only token cannot be used for rate limiting.`,
    );
  }

  const count = Number(results[0]?.result);
  const ttlMs = Number(results[2]?.result);
  if (!Number.isFinite(count) || !Number.isFinite(ttlMs) || ttlMs < 0) {
    throw new Error('Upstash returned an invalid counter.');
  }
  return { count, ttlMs };
}

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Per-instance fixed window used while Upstash is configured but failing.
 * Weaker than the shared counter (each server instance counts separately), but
 * it never blocks legitimate visitors and still slows down brute force.
 */
function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucketKey = `${windowMs}:${key}`;
  let bucket = memoryBuckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    if (memoryBuckets.size >= MAX_MEMORY_BUCKETS) {
      for (const [storedKey, stored] of memoryBuckets) {
        if (stored.resetAt <= now) memoryBuckets.delete(storedKey);
      }
      const oldest = memoryBuckets.keys().next();
      if (memoryBuckets.size >= MAX_MEMORY_BUCKETS && !oldest.done) {
        memoryBuckets.delete(oldest.value);
      }
    }
    bucket = { count: 0, resetAt: now + windowMs };
    memoryBuckets.set(bucketKey, bucket);
  }

  bucket.count += 1;
  return bucket.count <= limit
    ? { ok: true, unavailable: true }
    : {
        ok: false,
        retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        unavailable: true,
      };
}

/**
 * Distributed fixed-window limiter backed by the Upstash REST API. If neither
 * Upstash variable is set, the deployment must provide the external WAF rules
 * documented in README. Partial configuration and provider failures fall back
 * to a per-instance in-memory limiter (and show a warning in the admin panel),
 * so a broken Upstash setup neither locks the owner out nor disables limiting.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const { url, token } = upstashConfig();

  if (!url && !token) return { ok: true };
  if (!url || !token) {
    console.error('Rate limiter configuration is incomplete; using in-memory fallback');
    return memoryRateLimit(key, limit, windowMs);
  }

  try {
    const { count, ttlMs } = await upstashHit(url, token, key, windowMs);
    return count <= limit
      ? { ok: true }
      : { ok: false, retryAfterSec: Math.max(1, Math.ceil(ttlMs / 1000)) };
  } catch (error) {
    console.error('Rate limiter unavailable; using in-memory fallback', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return memoryRateLimit(key, limit, windowMs);
  }
}

/** Live check for the admin panel: exercises the same Upstash path as rateLimit. */
export async function checkRateLimiter(): Promise<RateLimiterStatus> {
  const { url, token } = upstashConfig();

  if (!url && !token) return { state: 'off' };
  if (!url || !token) {
    const missing = url ? 'UPSTASH_REDIS_REST_TOKEN' : 'UPSTASH_REDIS_REST_URL';
    return { state: 'error', reason: `${missing} is not set, but its pair is.` };
  }

  try {
    await upstashHit(url, token, 'admin-health-check', 60_000);
    return { state: 'ok' };
  } catch (error) {
    return {
      state: 'error',
      reason: error instanceof Error ? error.message : 'Unknown Upstash error.',
    };
  }
}
