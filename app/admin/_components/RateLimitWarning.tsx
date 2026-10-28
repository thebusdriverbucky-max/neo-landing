import { TriangleAlert } from 'lucide-react';

interface RateLimitWarningProps {
  reason: string;
}

export default function RateLimitWarning({ reason }: RateLimitWarningProps) {
  return (
    <div
      role="alert"
      className="flex gap-4 p-4 md:p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10"
    >
      <TriangleAlert className="w-6 h-6 shrink-0 text-amber-400" />
      <div className="space-y-2 min-w-0">
        <h2 className="font-semibold text-amber-200">Upstash rate limiting is not working</h2>
        <p className="text-sm text-amber-100/80 break-words">{reason}</p>
        <p className="text-sm text-neutral-400">
          Bookings and admin login keep working with a temporary per-server limit,
          which is weaker protection. Fix the Upstash variables in your hosting
          settings and redeploy — this notice disappears once Upstash responds.
        </p>
      </div>
    </div>
  );
}
