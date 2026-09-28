import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local (dev) or the hosting provider's environment variables (production)."
  );
}

// Server-only client using the service_role key, which bypasses Row Level
// Security. This must never be imported from a "use client" component or
// otherwise reach the browser bundle -- every table read/write goes through
// Next.js API routes / Server Components instead.
export const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
