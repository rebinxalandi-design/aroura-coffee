-- Aroura Coffee: Supabase/Postgres schema.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- before switching src/lib/store.ts over to Postgres.
--
-- Row Level Security is left OFF on all three tables intentionally: every
-- read/write goes through Next.js API routes using the service_role key
-- (server-side only, never exposed to the browser), which bypasses RLS by
-- design. The anon key is only used for nothing yet -- if a future feature
-- ever queries Supabase directly from client-side code, RLS policies must
-- be added first.

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  role text not null check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null,          -- { "en": "...", "fa": "..." }
  description jsonb not null,   -- { "en": "...", "fa": "..." }
  price_toman integer not null check (price_toman > 0),
  tag jsonb not null,           -- { "en": "...", "fa": "..." }
  category text not null check (category in ('coffee', 'espresso', 'cake', 'pastry', 'juice', 'other')),
  image jsonb not null,         -- { "src": "...", "alt": "..." }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references menu_items(id) on delete restrict,
  item_name jsonb not null,     -- { "en": "...", "fa": "..." }
  price_toman integer not null check (price_toman > 0),
  customer_name text not null,
  note text,
  table_or_location text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
