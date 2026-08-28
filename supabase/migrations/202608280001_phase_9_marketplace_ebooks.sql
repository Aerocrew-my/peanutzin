-- Phase 9: backward-compatible marketplace metadata and format-aware orders.
alter table public.books
  add column publisher text,
  add column publication_year integer check (publication_year between 1000 and 2100),
  add column language text,
  add column genre text,
  add column format text not null default 'physical' check (format in ('physical','ebook','both')),
  add column ebook_price_cents integer check (ebook_price_cents >= 0),
  add column catalogue_type text not null default 'peanutzin' check (catalogue_type in ('peanutzin','indie_author','independent_publisher')),
  add column independent_publisher boolean not null default false,
  add column emerging_author boolean not null default false,
  add column preview_only boolean not null default false;

alter table public.books add constraint books_format_prices check (
  (format = 'physical' and ebook_price_cents is null) or
  (format in ('ebook','both') and ebook_price_cents is not null)
);
alter table public.order_items add column format text not null default 'physical' check (format in ('physical','ebook'));

create or replace function public.create_guest_order(p_input jsonb, p_items jsonb, p_token_hash text)
returns table(order_id uuid, order_number text, subtotal_cents integer, shipping_cents integer, total_cents integer)
language plpgsql security definer set search_path = public as $$
declare v_order_id uuid := gen_random_uuid(); v_number text; v_subtotal integer; v_shipping integer; v_state text; v_has_physical boolean;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then raise exception 'Invalid cart'; end if;
  v_state := p_input->>'shipping_state';
  if v_state not in ('Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Penang','Perak','Perlis','Sabah','Sarawak','Selangor','Terengganu','Kuala Lumpur','Labuan','Putrajaya') then raise exception 'Invalid state'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) x where (x->>'quantity') !~ '^([1-9]|1[0-9]|20)$' or coalesce(x->>'format','physical') not in ('physical','ebook')) then raise exception 'Invalid item'; end if;
  if (select count(*) from jsonb_array_elements(p_items)) <> (select count(distinct (x->>'book_id',coalesce(x->>'format','physical'))) from jsonb_array_elements(p_items) x) then raise exception 'Duplicate item'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) x left join books b on b.id=(x->>'book_id')::uuid where b.id is null or not b.active or (coalesce(x->>'format','physical')='physical' and (b.format not in ('physical','both') or (b.stock_quantity is not null and b.stock_quantity < (x->>'quantity')::integer))) or (coalesce(x->>'format','physical')='ebook' and b.format not in ('ebook','both'))) then raise exception 'Book unavailable or insufficient stock'; end if;
  select coalesce(sum((case when coalesce(x->>'format','physical')='ebook' then b.ebook_price_cents else b.price_cents end) * (x->>'quantity')::integer),0), bool_or(coalesce(x->>'format','physical')='physical') into v_subtotal,v_has_physical from jsonb_array_elements(p_items) x join books b on b.id=(x->>'book_id')::uuid;
  if v_has_physical then select case when v_state in ('Sabah','Sarawak','Labuan') then coalesce((value->>'east_malaysia_cents')::integer,1500) else coalesce((value->>'peninsular_cents')::integer,800) end into v_shipping from site_settings where key='shipping'; else v_shipping:=0; end if;
  v_shipping := coalesce(v_shipping,0);
  v_number := 'PZ-' || to_char(now() at time zone 'Asia/Kuala_Lumpur','YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  insert into orders(id,order_number,confirmation_token_hash,customer_name,customer_email,customer_phone,shipping_address_line1,shipping_address_line2,shipping_postcode,shipping_city,shipping_state,customer_notes,subtotal_cents,shipping_cents,total_cents,payment_provider,payment_status)
  values(v_order_id,v_number,p_token_hash,p_input->>'customer_name',lower(p_input->>'customer_email'),p_input->>'customer_phone',p_input->>'shipping_address_line1',nullif(p_input->>'shipping_address_line2',''),p_input->>'shipping_postcode',p_input->>'shipping_city',v_state,nullif(p_input->>'customer_notes',''),v_subtotal,v_shipping,v_subtotal+v_shipping,p_input->>'payment_provider','pending');
  insert into order_items(order_id,book_id,book_title,book_author,book_slug,unit_price_cents,quantity,line_total_cents,format)
  select v_order_id,b.id,b.title,b.author,b.slug,case when coalesce(x->>'format','physical')='ebook' then b.ebook_price_cents else b.price_cents end,(x->>'quantity')::integer,(case when coalesce(x->>'format','physical')='ebook' then b.ebook_price_cents else b.price_cents end)*(x->>'quantity')::integer,coalesce(x->>'format','physical') from jsonb_array_elements(p_items) x join books b on b.id=(x->>'book_id')::uuid;
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
 if exists(select 1 from order_items oi join books b on b.id=oi.book_id where oi.order_id=p_order_id and oi.format='physical' and b.stock_quantity is not null and b.stock_quantity < oi.quantity) then raise exception 'Insufficient stock'; end if;
 update books b set stock_quantity=b.stock_quantity-oi.quantity from order_items oi where oi.order_id=p_order_id and oi.book_id=b.id and oi.format='physical' and b.stock_quantity is not null;
 update orders set payment_status='paid',paid_at=now(),stock_decremented_at=now(),payment_reference=p_reference where id=p_order_id;
 return true;
end $$;
revoke all on function public.create_guest_order(jsonb,jsonb,text), public.confirm_test_payment(uuid,text) from public, anon, authenticated;
grant execute on function public.create_guest_order(jsonb,jsonb,text), public.confirm_test_payment(uuid,text) to service_role;
