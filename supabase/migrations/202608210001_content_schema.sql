create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug <> ''),
  title text not null,
  excerpt text,
  body text,
  category text not null check (category in ('news', 'gossip', 'event', 'feature')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  trending_rank integer check (trending_rank is null or trending_rank > 0),
  hero_image_path text,
  published_at timestamptz,
  event_start_at timestamptz,
  event_end_at timestamptz,
  event_location text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (category <> 'event' or event_start_at is not null or event_location is not null)
);

create index if not exists articles_public_feed_idx on public.articles (published_at desc) where status = 'published';
create index if not exists articles_category_idx on public.articles (category, published_at desc) where status = 'published';

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug <> ''),
  title text not null,
  author text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'MYR' check (currency = 'MYR'),
  cover_image_path text,
  featured boolean not null default false,
  active boolean not null default true,
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  isbn text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key <> ''),
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace trigger articles_set_updated_at before update on public.articles for each row execute function public.set_updated_at();
create or replace trigger books_set_updated_at before update on public.books for each row execute function public.set_updated_at();

alter table public.articles enable row level security;
alter table public.books enable row level security;
alter table public.site_settings enable row level security;

create policy "Published articles are public" on public.articles for select to anon, authenticated using (status = 'published');
create policy "Active books are public" on public.books for select to anon, authenticated using (active = true);
create policy "Public site settings are readable" on public.site_settings for select to anon, authenticated using (key in ('announcement', 'newsletterHeading', 'newsletterCopy', 'contact', 'social'));

insert into storage.buckets (id, name, public) values ('article-media', 'article-media', true), ('book-covers', 'book-covers', true) on conflict (id) do update set public = excluded.public;
create policy "Public article media is readable" on storage.objects for select to anon, authenticated using (bucket_id = 'article-media');
create policy "Public book covers are readable" on storage.objects for select to anon, authenticated using (bucket_id = 'book-covers');
