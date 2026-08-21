# Supabase setup

Phase 2 uses the public Supabase URL and anon key for server-side reads protected by RLS.

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`: the intended PEANUTZIN development project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: that project's public anon key

No service-role key is needed by the public website. `.env*` files are ignored by Git.

## Apply the database

Create a Supabase project, confirm it is the PEANUTZIN development project, then apply the migration and seed file with the Supabase CLI:

```sh
supabase link --project-ref <development-project-ref>
supabase db push
supabase db seed
```

The migration creates `articles`, `books`, and `site_settings`, enables RLS, and creates the public `article-media` and `book-covers` buckets. Storage is public-read only; uploads and mutations are intentionally deferred.

The seed is repeatable by slug/key and contains development editorial content. Do not run it against an unknown or production project.

## Content rules

Anonymous and authenticated users can read only published articles, active books, and explicitly public settings. There are no public insert, update, or delete policies. Events remain article rows with `category = 'event'`; there is no standalone events table.

Without Supabase variables, local development uses the clearly scoped Phase 1 fallback data. Production throws a configuration error instead of silently showing fake content.

## Types

`src/lib/supabase/database.types.ts` is generated-style TypeScript matching the migration. When the schema changes, regenerate with `supabase gen types typescript --linked > src/lib/supabase/database.types.ts` and review the diff.

## Caching and Phase 3

Public route pages use server-side reads and Next's normal route caching behaviour; no content is baked into static params, so newly published slugs are discoverable without a rebuild. Phase 3 will add admin authentication, authenticated write policies, CMS editing, and media uploads.
