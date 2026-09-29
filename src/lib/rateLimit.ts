/**
 * Minimal in-memory per-IP rate limiter (fixed window). Good enough to
 * blunt naive brute-force/spam scripts against a small single-cafe site
 * without adding a paid external store -- not a substitute for a real
 * distributed limiter (e.g. Upstash Redis) if traffic ever justifies one.
 *
 * Caveat: this state is per serverless instance/cold start on Vercel, so
 * a determined attacker spreading requests across many cold starts can
 * evade it. It still meaningfully raises the cost of a single-script
 * brute force from one warm instance, which is the realistic threat here.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this doesn't grow unbounded over
// a long-lived instance's lifetime.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
