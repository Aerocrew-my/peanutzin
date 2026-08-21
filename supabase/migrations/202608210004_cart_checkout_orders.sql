create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  confirmation_token_hash text not null unique,
  customer_name text not null check (length(trim(customer_name)) between 2 and 120),
  customer_email text not null check (customer_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  customer_phone text not null,
  shipping_address_line1 text not null,
  shipping_address_line2 text,
  shipping_postcode text not null,
  shipping_city text not null,
  shipping_state text not null check (shipping_state in ('Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Penang','Perak','Perlis','Sabah','Sarawak','Selangor','Terengganu','Kuala Lumpur','Labuan','Putrajaya')),
  shipping_country text not null default 'MY' check (shipping_country = 'MY'),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null check (shipping_cents >= 0),
  total_cents integer not null check (total_cents = subtotal_cents + shipping_cents),
  currency text not null default 'MYR' check (currency = 'MYR'),
  order_status text not null default 'pending' check (order_status in ('pending','processing','shipped','completed','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed','refunded')),
  payment_provider text,
  payment_reference text unique,
  stock_decremented_at timestamptz,
  customer_notes text,
  admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  paid_at timestamptz, shipped_at timestamptz, completed_at timestamptz, cancelled_at timestamptz
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  book_id uuid references public.books(id) on delete set null,
  book_title text not null, book_author text, book_slug text,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity between 1 and 20),
  line_total_cents integer not null check (line_total_cents = unit_price_cents * quantity),
  created_at timestamptz not null default now()
);
create index orders_created_idx on public.orders(created_at desc);
create index orders_status_idx on public.orders(order_status, payment_status);
create index order_items_order_idx on public.order_items(order_id);
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Active admins read orders" on public.orders for select to authenticated using (public.is_active_admin());
create policy "Active admins update orders" on public.orders for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Active admins read order items" on public.order_items for select to authenticated using (public.is_active_admin());
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;
revoke all on public.orders, public.order_items from anon;

insert into public.site_settings(key,value) values
 ('shipping', '{"peninsular_cents":800,"east_malaysia_cents":1500}'::jsonb)
on conflict (key) do nothing;

create or replace function public.create_guest_order(p_input jsonb, p_items jsonb, p_token_hash text)
returns table(order_id uuid, order_number text, subtotal_cents integer, shipping_cents integer, total_cents integer)
language plpgsql security definer set search_path = public as $$
declare v_order_id uuid := gen_random_uuid(); v_number text; v_subtotal integer; v_shipping integer; v_state text; v_item jsonb;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then raise exception 'Invalid cart'; end if;
  v_state := p_input->>'shipping_state';
  if v_state not in ('Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Penang','Perak','Perlis','Sabah','Sarawak','Selangor','Terengganu','Kuala Lumpur','Labuan','Putrajaya') then raise exception 'Invalid state'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) x where (x->>'quantity') !~ '^([1-9]|1[0-9]|20)$') then raise exception 'Invalid quantity'; end if;
  if (select count(*) from jsonb_array_elements(p_items)) <> (select count(distinct x->>'book_id') from jsonb_array_elements(p_items) x) then raise exception 'Duplicate item'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) x left join books b on b.id=(x->>'book_id')::uuid where b.id is null or not b.active or (b.stock_quantity is not null and b.stock_quantity < (x->>'quantity')::integer)) then raise exception 'Book unavailable or insufficient stock'; end if;
  select coalesce(sum(b.price_cents * (x->>'quantity')::integer),0) into v_subtotal from jsonb_array_elements(p_items) x join books b on b.id=(x->>'book_id')::uuid;
  select case when v_state in ('Sabah','Sarawak','Labuan') then coalesce((value->>'east_malaysia_cents')::integer,1500) else coalesce((value->>'peninsular_cents')::integer,800) end into v_shipping from site_settings where key='shipping';
  v_shipping := coalesce(v_shipping, case when v_state in ('Sabah','Sarawak','Labuan') then 1500 else 800 end);
  v_number := 'PZ-' || to_char(now() at time zone 'Asia/Kuala_Lumpur','YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  insert into orders(id,order_number,confirmation_token_hash,customer_name,customer_email,customer_phone,shipping_address_line1,shipping_address_line2,shipping_postcode,shipping_city,shipping_state,customer_notes,subtotal_cents,shipping_cents,total_cents,payment_provider,payment_status)
  values(v_order_id,v_number,p_token_hash,p_input->>'customer_name',lower(p_input->>'customer_email'),p_input->>'customer_phone',p_input->>'shipping_address_line1',nullif(p_input->>'shipping_address_line2',''),p_input->>'shipping_postcode',p_input->>'shipping_city',v_state,nullif(p_input->>'customer_notes',''),v_subtotal,v_shipping,v_subtotal+v_shipping,p_input->>'payment_provider','pending');
  insert into order_items(order_id,book_id,book_title,book_author,book_slug,unit_price_cents,quantity,line_total_cents)
  select v_order_id,b.id,b.title,b.author,b.slug,b.price_cents,(x->>'quantity')::integer,b.price_cents*(x->>'quantity')::integer from jsonb_array_elements(p_items) x join books b on b.id=(x->>'book_id')::uuid;
  return query select v_order_id,v_number,v_subtotal,v_shipping,v_subtotal+v_shipping;
end $$;

create or replace function public.confirm_test_payment(p_order_id uuid, p_reference text)
returns boolean language plpgsql security definer set search_path=public as $$
declare v_order orders%rowtype;
begin
 select * into v_order from orders where id=p_order_id for update;
 if not found then raise exception 'Order not found'; end if;
 if v_order.payment_status='paid' then return false; end if;
 if v_order.payment_provider <> 'test' or v_order.payment_status not in ('pending','unpaid') then raise exception 'Order cannot be confirmed'; end if;
 if exists(select 1 from order_items oi join books b on b.id=oi.book_id where oi.order_id=p_order_id and b.stock_quantity is not null and b.stock_quantity < oi.quantity) then raise exception 'Insufficient stock'; end if;
 update books b set stock_quantity=b.stock_quantity-oi.quantity from order_items oi where oi.order_id=p_order_id and oi.book_id=b.id and b.stock_quantity is not null;
 update orders set payment_status='paid',paid_at=now(),stock_decremented_at=now(),payment_reference=p_reference where id=p_order_id;
 return true;
end $$;
revoke all on function public.create_guest_order(jsonb,jsonb,text), public.confirm_test_payment(uuid,text) from public, anon, authenticated;
grant execute on function public.create_guest_order(jsonb,jsonb,text), public.confirm_test_payment(uuid,text) to service_role;
