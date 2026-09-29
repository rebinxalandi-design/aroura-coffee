import { supabase } from "./supabase";

/**
 * Postgres-backed rate limiter (fixed window). An in-memory version
 * doesn't work on Vercel's serverless model -- each request can land on a
 * different, short-lived instance with its own empty memory, so a
 * same-process counter almost never actually sees a second hit from the
 * same attacker (confirmed in production: 8 rapid/parallel failed logins
 * from the same IP all landed as separate "first" attempts). Using the
 * database everyone's requests already share fixes that, at the cost of
 * one extra round trip per check.
 *
 * The increment is atomic (see rate_limit_hit() in
 * supabase/migrations/002_add_rate_limits.sql) so concurrent requests
 * from the same attacker can't race past each other between a read and a
 * write.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const { data, error } = await supabase
    .rpc("rate_limit_hit", { p_key: key, p_window_ms: windowMs })
    .single();

  if (error || !data) {
    // Fail open: a rate-limit check that can't reach the database
    // shouldn't take down login/ordering for every legitimate user.
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const { count, reset_at } = data as { count: number; reset_at: string };
  if (count > limit) {
    const retryAfterSeconds = Math.max(
      0,
      Math.ceil((new Date(reset_at).getTime() - Date.now()) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
