create table if not exists public.social_drafts (
  id uuid primary key default gen_random_uuid(),
  source_article_id uuid references public.articles(id) on delete set null,
  title text not null default '',
  master_brief text not null check (char_length(master_brief) <= 12000),
  tone_notes text check (char_length(tone_notes) <= 1000),
  facebook_copy text,
  instagram_copy text,
  linkedin_copy text,
  threads_copy text,
  short_copy text,
  hashtags text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'generated', 'reviewed', 'ready')),
  generation_model text,
  generation_metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists social_drafts_updated_idx on public.social_drafts (updated_at desc);
create index if not exists social_drafts_source_article_idx on public.social_drafts (source_article_id);
create or replace trigger social_drafts_set_updated_at before update on public.social_drafts
for each row execute function public.set_updated_at();
alter table public.social_drafts enable row level security;

create policy "Active admins read social drafts" on public.social_drafts for select to authenticated using (public.is_active_admin());
create policy "Active admins insert social drafts" on public.social_drafts for insert to authenticated with check (public.is_active_admin() and created_by = auth.uid());
create policy "Active admins update social drafts" on public.social_drafts for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Active admins delete social drafts" on public.social_drafts for delete to authenticated using (public.is_active_admin());

grant select, insert, update, delete on public.social_drafts to authenticated;
