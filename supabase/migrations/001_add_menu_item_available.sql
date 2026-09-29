-- Adds the "temporarily unavailable" toggle for menu items (super admin
-- can mark an item as sold out / out of season without deleting it).
-- Run this once in the Supabase SQL editor.

alter table menu_items
  add column if not exists available boolean not null default true;
