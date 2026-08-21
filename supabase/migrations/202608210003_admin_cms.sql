create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_users_active_idx on public.admin_users (id) where active;
create or replace trigger admin_users_set_updated_at before update on public.admin_users
for each row execute function public.set_updated_at();
alter table public.admin_users enable row level security;

create or replace function public.is_active_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where id = auth.uid() and active) $$;
revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;

create policy "Admins can read their membership" on public.admin_users for select to authenticated
using (id = auth.uid());

create policy "Active admins read all articles" on public.articles for select to authenticated using (public.is_active_admin());
create policy "Active admins insert articles" on public.articles for insert to authenticated with check (public.is_active_admin());
create policy "Active admins update articles" on public.articles for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Active admins delete articles" on public.articles for delete to authenticated using (public.is_active_admin());
create policy "Active admins read all books" on public.books for select to authenticated using (public.is_active_admin());
create policy "Active admins insert books" on public.books for insert to authenticated with check (public.is_active_admin());
create policy "Active admins update books" on public.books for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Active admins delete books" on public.books for delete to authenticated using (public.is_active_admin());
create policy "Active admins insert settings" on public.site_settings for insert to authenticated with check (public.is_active_admin());
create policy "Active admins update settings" on public.site_settings for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Active admins delete settings" on public.site_settings for delete to authenticated using (public.is_active_admin());

create policy "Active admins upload article media" on storage.objects for insert to authenticated with check (bucket_id = 'article-media' and public.is_active_admin());
create policy "Active admins update article media" on storage.objects for update to authenticated using (bucket_id = 'article-media' and public.is_active_admin()) with check (bucket_id = 'article-media' and public.is_active_admin());
create policy "Active admins delete article media" on storage.objects for delete to authenticated using (bucket_id = 'article-media' and public.is_active_admin());
create policy "Active admins upload book covers" on storage.objects for insert to authenticated with check (bucket_id = 'book-covers' and public.is_active_admin());
create policy "Active admins update book covers" on storage.objects for update to authenticated using (bucket_id = 'book-covers' and public.is_active_admin()) with check (bucket_id = 'book-covers' and public.is_active_admin());
create policy "Active admins delete book covers" on storage.objects for delete to authenticated using (bucket_id = 'book-covers' and public.is_active_admin());

grant select on public.admin_users to authenticated;
grant insert, update, delete on public.articles, public.books, public.site_settings to authenticated;
grant insert, update, delete on storage.objects to authenticated;
