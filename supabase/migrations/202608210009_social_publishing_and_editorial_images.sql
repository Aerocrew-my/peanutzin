alter table public.articles add column if not exists hero_image_alt text;

update public.articles set hero_image_path = 'articles/klibf-2027-partnership.png', hero_image_alt = 'Malaysian readers browsing crowded book tables inside a Kuala Lumpur convention hall' where slug = 'klibf-2027-plans-british-council-partnership';
update public.articles set hero_image_path = 'articles/pena-manuscript-call.png', hero_image_alt = 'A Malaysian writer editing manuscript pages at a book-filled desk' where slug = 'pena-malaysia-madani-opens-2026-manuscript-call';
update public.articles set hero_image_path = 'articles/klibf-social-community.png', hero_image_alt = 'Young Malaysian readers chatting with a writer among books at a book fair' where slug = 'social-media-connects-writers-and-readers-at-klibf-2026';
update public.articles set hero_image_path = 'articles/johor-book-bazaar.png', hero_image_alt = 'Malaysian families and readers browsing book stalls in a modern Johor Bahru venue' where slug = 'bazar-buku-antarabangsa-johor-2026';
update public.articles set hero_image_path = 'articles/selangor-book-fair.png', hero_image_alt = 'A large Malaysian crowd browsing publisher booths at a Selangor convention-centre book fair' where slug = 'selangor-international-book-fair-2026';

create table if not exists public.social_publications (
  id uuid primary key default gen_random_uuid(), social_draft_id uuid not null references public.social_drafts(id) on delete cascade,
  platform text not null check (platform in ('facebook','instagram','linkedin','threads')),
  status text not null default 'pending' check (status in ('pending','sent','published','failed','manual')),
  method text not null check (method in ('make','manual')), attempt_reference text not null unique,
  external_reference text, error_message text check (char_length(error_message) <= 1000), published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null default auth.uid(), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint social_publications_state_check check ((status = 'manual' and method = 'manual' and published_at is not null) or (status <> 'manual' and method = 'make'))
);
create index if not exists social_publications_draft_idx on public.social_publications (social_draft_id, created_at desc);
create or replace trigger social_publications_set_updated_at before update on public.social_publications for each row execute function public.set_updated_at();
alter table public.social_publications enable row level security;
create policy "Active admins read social publications" on public.social_publications for select to authenticated using (public.is_active_admin());
create policy "Active admins insert social publications" on public.social_publications for insert to authenticated with check (public.is_active_admin() and created_by = auth.uid());
create policy "Active admins update social publications" on public.social_publications for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Active admins delete social publications" on public.social_publications for delete to authenticated using (public.is_active_admin());
grant select, insert, update, delete on public.social_publications to authenticated, service_role;
