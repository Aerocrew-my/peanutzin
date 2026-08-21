-- The service role bypasses RLS but still requires table privileges after the
-- explicit anonymous revocation in the Phase 4 migration.
grant select, insert, update, delete on public.orders, public.order_items to service_role;
