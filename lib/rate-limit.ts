import { createHash } from 'node:crypto';

type RateLimitResult = {
  ok: boolean;
  retryAfterSec?: number;
  unavailable?: boolean;
};

type UpstashPipelineItem = { result?: unknown; error?: string };

const IP_PATTERN = /^[a-f0-9:.]+$/i;

/** Trust only the client-IP header managed by Vercel, never raw proxy headers. */
export function getClientIp(request: Request): string {
  const platformIp = request.headers
    .get('x-vercel-forwarded-for')
    ?.split(',')[0]
    ?.trim();
  return platformIp && IP_PATTERN.test(platformIp) ? platformIp : 'anonymous';
}

function limiterUnavailable(): RateLimitResult {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Rate limiter unavailable; allowing request in development');
    return { ok: true, unavailable: true };
  }
  return { ok: false, retryAfterSec: 60, unavailable: true };
}

function redisKey(key: string, windowMs: number): string {
  const digest = createHash('sha256').update(key).digest('hex');
  return `neo-landing:rate-limit:${windowMs}:${digest}`;
}

/**
 * Distributed fixed-window limiter backed by the Upstash REST API. If neither
 * Upstash variable is set, the deployment must provide the external WAF rules
 * documented in README. Partial configuration and provider failures fail
 * closed outside development.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url && !token) return { ok: true };
  if (!url || !token) {
    console.error('Rate limiter configuration is incomplete');
    return limiterUnavailable();
  }

  try {
    const bucketKey = redisKey(key, windowMs);
    const response = await fetch(`${url}/pipeline`, {
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
    });
    if (!response.ok) throw new Error(`Upstash returned ${response.status}`);

    const results = await response.json() as UpstashPipelineItem[];
    if (!Array.isArray(results) || results.some((item) => item.error)) {
      throw new Error('Invalid Upstash pipeline response');
    }

    const count = Number(results[0]?.result);
    const ttlMs = Number(results[2]?.result);
    if (!Number.isFinite(count) || !Number.isFinite(ttlMs) || ttlMs < 0) {
      throw new Error('Invalid Upstash counter response');
    }

    return count <= limit
      ? { ok: true }
      : { ok: false, retryAfterSec: Math.max(1, Math.ceil(ttlMs / 1000)) };
  } catch (error) {
    console.error('Rate limiter unavailable', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return limiterUnavailable();
  }
}
