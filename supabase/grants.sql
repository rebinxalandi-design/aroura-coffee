-- Grants only service_role (used exclusively by server-side Next.js API
-- routes, never exposed to the browser) access to these tables. anon gets
-- nothing, since no client-side code talks to Supabase directly.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.admins to service_role;
grant select, insert, update, delete on public.menu_items to service_role;
grant select, insert, update, delete on public.orders to service_role;
