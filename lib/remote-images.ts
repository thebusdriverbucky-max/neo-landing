/** Hosts that next/image may fetch and optimize (wired into next.config.ts). */
export const OPTIMIZED_IMAGE_PATTERNS: { protocol: 'http' | 'https'; hostname: string }[] = [
  { protocol: 'https', hostname: 'images.unsplash.com' },
  { protocol: 'https', hostname: 'i.imgur.com' },
  { protocol: 'https', hostname: 'imgur.com' },
  { protocol: 'https', hostname: 'res.cloudinary.com' },
  { protocol: 'http', hostname: 'res.cloudinary.com' },
];

/**
 * CMS image URLs can point anywhere. The optimizer rejects hosts outside the
 * allowlist (a broken image in production), so such URLs are rendered as-is
 * with `unoptimized` instead of opening /_next/image to every host.
 */
export function isOptimizableImage(src: string): boolean {
  if (src.startsWith('/')) return !src.startsWith('//');

  try {
    const url = new URL(src);
    return OPTIMIZED_IMAGE_PATTERNS.some(
      (pattern) => `${pattern.protocol}:` === url.protocol && pattern.hostname === url.hostname,
    );
  } catch {
    return false;
  }
}
