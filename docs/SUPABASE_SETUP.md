# Supabase setup

PEANUTZIN uses Supabase Auth sessions, Postgres, RLS and Storage. See [SUPABASE_OPERATIONS.md](SUPABASE_OPERATIONS.md) for the complete handover runbook.

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`: the intended Singapore PEANUTZIN project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: that project's public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: server-only checkout and integration access

Never expose the service-role key to browser code. `.env*` files are ignored by Git except `.env.example`.

## Apply the database

Create a Supabase project, confirm it is the PEANUTZIN development project, then apply the migration and seed file with the Supabase CLI:

```sh
npx supabase link --project-ref kdyquipcyynugdyagecr
supabase db push
supabase db seed
```

The migration chain covers content, CMS, commerce, Social Studio/publishing and editorial artwork. Verify ref `kdyquipcyynugdyagecr` before pushing. Do not use the obsolete Seoul PEANUTZIN project. Do not reset a linked database.

The seed is repeatable by slug/key and contains development editorial content. Do not run it against an unknown or production project.

## Content rules

Anonymous and authenticated users can read only published articles, active books, and explicitly public settings. There are no public insert, update, or delete policies. Events remain article rows with `category = 'event'`; there is no standalone events table.

Without Supabase variables, local development uses the clearly scoped Phase 1 fallback data. Production throws a configuration error instead of silently showing fake content.

## Types

`src/lib/supabase/database.types.ts` is generated-style TypeScript matching the migration. When the schema changes, regenerate with `supabase gen types typescript --linked > src/lib/supabase/database.types.ts` and review the diff.

## Admin provisioning

There is no signup route and no credential is stored in this repository. To provision the first administrator:

1. Create an email/password user in Supabase Dashboard → Authentication → Users.
2. Copy that Auth user's UUID.
3. In the administrator-controlled SQL editor, insert the matching membership:

```sql
insert into public.admin_users (id, email, role, active)
values ('<auth-user-uuid>', '<admin-email>', 'admin', true);
```

4. Sign in at `/admin/login`.

Use `editor` or `admin` as the role. Both roles have Phase 3 CMS access; `active = false` immediately removes it. Arbitrary authenticated users cannot add or modify memberships.

## Security model

- Anonymous visitors can read published articles, active books, safe settings, and public media; they cannot mutate them.
- Authenticated users without an active `admin_users` row have no CMS or Storage mutation access.
- Every Server Action re-checks administrator membership, and RLS remains the database boundary.
- Storage accepts JPEG, PNG, and WebP images up to 5 MB under organized article/book paths. Replacement uploads occur before the database reference changes; only managed old paths are removed afterward.
- The Next.js proxy refreshes auth cookies and redirects protected `/admin/*` routes. The login route stays public and has no signup flow.

CMS routes under `/admin` include implemented article, book, order, settings and Social Studio operations.

## Caching

Public route pages use server-side reads and Next's normal route caching behaviour; no content is baked into static params. CMS actions revalidate public routes after content changes.
