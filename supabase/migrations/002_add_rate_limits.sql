-- Distributed rate limiting, backed by Postgres instead of per-instance
-- in-memory state (which doesn't work on Vercel's serverless model --
-- each request can land on a different, short-lived instance with its own
-- empty memory, so an in-memory counter never actually accumulates hits
-- from the same attacker). Run this once in the Supabase SQL editor.

create table if not exists rate_limits (
  key text primary key,
  count integer not null default 1,
  reset_at timestamptz not null
);

grant select, insert, update, delete on public.rate_limits to service_role;

-- Atomically increments (or starts a fresh window for) a rate-limit
-- bucket and returns its current state in one round trip -- doing this as
-- read-then-write from the client would race under concurrent requests
-- from the same attacker (the whole point of the limiter), so the
-- increment-and-return happens inside a single statement instead.
create or replace function rate_limit_hit(p_key text, p_window_ms integer)
returns table (count integer, reset_at timestamptz)
language plpgsql
as $$
begin
  insert into rate_limits (key, count, reset_at)
  values (p_key, 1, now() + (p_window_ms || ' milliseconds')::interval)
  on conflict (key) do update
    set count = case
          when rate_limits.reset_at <= now() then 1
          else rate_limits.count + 1
        end,
        reset_at = case
          when rate_limits.reset_at <= now()
            then now() + (p_window_ms || ' milliseconds')::interval
          else rate_limits.reset_at
        end
  returning rate_limits.count, rate_limits.reset_at
  into count, reset_at;

  return next;
end;
$$;

grant execute on function rate_limit_hit(text, integer) to service_role;
