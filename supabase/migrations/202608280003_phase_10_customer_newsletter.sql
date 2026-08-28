-- Phase 10: customer-owned orders and private newsletter subscriptions.
alter table public.orders add column customer_user_id uuid references auth.users(id) on delete set null;
create index orders_customer_user_idx on public.orders(customer_user_id, created_at desc) where customer_user_id is not null;

create policy "Customers read own orders" on public.orders for select to authenticated
  using (customer_user_id = (select auth.uid()));
create policy "Customers read own order items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.customer_user_id = (select auth.uid())));

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  status text not null default 'subscribed' check (status in ('subscribed','unsubscribed')),
  source text not null default 'website' check (length(source) between 1 and 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_email_valid check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
create unique index newsletter_subscribers_email_unique on public.newsletter_subscribers(lower(email));
alter table public.newsletter_subscribers enable row level security;
create policy "Active admins read newsletter" on public.newsletter_subscribers for select to authenticated
  using (public.is_active_admin());
create policy "Customers read own newsletter state" on public.newsletter_subscribers for select to authenticated
  using (lower(email) = lower((select auth.jwt()->>'email')));
grant select on public.newsletter_subscribers to authenticated;
revoke all on public.newsletter_subscribers from anon;

create or replace function public.subscribe_newsletter(p_email text, p_name text default null, p_source text default 'website')
returns text language plpgsql security definer set search_path = public as $$
declare v_email text := lower(trim(p_email)); v_existing text;
begin
  if length(v_email) > 254 or v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then return 'invalid'; end if;
  select status into v_existing from newsletter_subscribers where lower(email)=v_email;
  if v_existing='subscribed' then return 'duplicate'; end if;
  insert into newsletter_subscribers(email,name,status,source)
  values(v_email,nullif(left(trim(p_name),120),''),'subscribed',left(coalesce(nullif(trim(p_source),''),'website'),50))
  on conflict(lower(email)) do update set status='subscribed',name=coalesce(excluded.name,newsletter_subscribers.name),source=excluded.source,updated_at=now();
  return 'subscribed';
end $$;
revoke all on function public.subscribe_newsletter(text,text,text) from public;
grant execute on function public.subscribe_newsletter(text,text,text) to anon, authenticated;

create or replace function public.create_guest_order(p_input jsonb, p_items jsonb, p_token_hash text)
returns table(order_id uuid, order_number text, subtotal_cents integer, shipping_cents integer, total_cents integer)
language plpgsql security definer set search_path=public as $$
declare v_order_id uuid := gen_random_uuid(); v_number text; v_subtotal integer; v_shipping integer; v_state text; v_has_physical boolean; v_customer uuid;
begin
  if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>25 then raise exception 'Invalid cart'; end if;
  v_state := p_input->>'shipping_state';
  if v_state not in ('Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Penang','Perak','Perlis','Sabah','Sarawak','Selangor','Terengganu','Kuala Lumpur','Labuan','Putrajaya') then raise exception 'Invalid state'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) x where (x->>'quantity') !~ '^([1-9]|1[0-9]|20)$' or coalesce(x->>'format','physical') not in ('physical','ebook')) then raise exception 'Invalid item'; end if;
  if (select count(*) from jsonb_array_elements(p_items)) <> (select count(distinct (x->>'book_id',coalesce(x->>'format','physical'))) from jsonb_array_elements(p_items) x) then raise exception 'Duplicate item'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) x left join books b on b.id=(x->>'book_id')::uuid where b.id is null or not b.active or (coalesce(x->>'format','physical')='physical' and (b.format not in ('physical','both') or (b.stock_quantity is not null and b.stock_quantity < (x->>'quantity')::integer))) or (coalesce(x->>'format','physical')='ebook' and b.format not in ('ebook','both'))) then raise exception 'Book unavailable or insufficient stock'; end if;
  select coalesce(sum((case when coalesce(x->>'format','physical')='ebook' then b.ebook_price_cents else b.price_cents end) * (x->>'quantity')::integer),0), bool_or(coalesce(x->>'format','physical')='physical') into v_subtotal,v_has_physical from jsonb_array_elements(p_items) x join books b on b.id=(x->>'book_id')::uuid;
  if v_has_physical then select case when v_state in ('Sabah','Sarawak','Labuan') then coalesce((value->>'east_malaysia_cents')::integer,1500) else coalesce((value->>'peninsular_cents')::integer,800) end into v_shipping from site_settings where key='shipping'; else v_shipping:=0; end if;
  v_shipping := coalesce(v_shipping,0); v_number := 'PZ-'||to_char(now(),'YYYYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  if nullif(p_input->>'customer_user_id','') is not null then v_customer := (p_input->>'customer_user_id')::uuid; end if;
  insert into orders(id,order_number,confirmation_token_hash,customer_name,customer_email,customer_phone,shipping_address_line1,shipping_address_line2,shipping_postcode,shipping_city,shipping_state,customer_notes,subtotal_cents,shipping_cents,total_cents,payment_provider,payment_status,customer_user_id)
  values(v_order_id,v_number,p_token_hash,p_input->>'customer_name',lower(p_input->>'customer_email'),p_input->>'customer_phone',p_input->>'shipping_address_line1',nullif(p_input->>'shipping_address_line2',''),p_input->>'shipping_postcode',p_input->>'shipping_city',v_state,nullif(p_input->>'customer_notes',''),v_subtotal,v_shipping,v_subtotal+v_shipping,p_input->>'payment_provider','pending',v_customer);
  insert into order_items(order_id,book_id,book_title,book_author,book_slug,unit_price_cents,quantity,line_total_cents,format)
  select v_order_id,b.id,b.title,b.author,b.slug,case when coalesce(x->>'format','physical')='ebook' then b.ebook_price_cents else b.price_cents end,(x->>'quantity')::integer,(case when coalesce(x->>'format','physical')='ebook' then b.ebook_price_cents else b.price_cents end)*(x->>'quantity')::integer,coalesce(x->>'format','physical') from jsonb_array_elements(p_items) x join books b on b.id=(x->>'book_id')::uuid;
  return query select v_order_id,v_number,v_subtotal,v_shipping,v_subtotal+v_shipping;
end $$;
revoke all on function public.create_guest_order(jsonb,jsonb,text) from public,anon,authenticated;
grant execute on function public.create_guest_order(jsonb,jsonb,text) to service_role;
