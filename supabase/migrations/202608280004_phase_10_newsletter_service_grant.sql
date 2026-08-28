-- Service operations need explicit table privileges; RLS bypass alone is insufficient.
grant select, insert, update, delete on public.newsletter_subscribers to service_role;
