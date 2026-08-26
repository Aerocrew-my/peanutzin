# Supabase operations

Correct development project: `peanutzin-devMY`, ref `kdyquipcyynugdyagecr`, Singapore. **Do not use the obsolete Seoul PEANUTZIN Supabase project.** Verify the ref before every remote command.

## Data model and security

- `articles`: news, gossip, features and events; events use `category = 'event'` and source/event/SEO/media fields.
- `books`: catalogue, MYR integer-cent prices, active/featured state, covers and nullable stock.
- `site_settings`: controlled public settings plus server-read shipping configuration.
- `admin_users`: Auth-user membership and active `admin`/`editor` role.
- `orders` → `order_items`: guest order/customer data and immutable item/price snapshots.
- `social_drafts` → `social_publications`: reviewed copy and per-platform attempts/history.

RLS is enabled on application tables. Anonymous/public reads are limited to published articles, active books and allow-listed settings. Active administrators receive CMS/order/social policies; Server Actions re-check membership. Orders have no anonymous access. Service-role access is used server-side for order transactions and verified social callbacks only.

Public Storage buckets are `article-media` and `book-covers`. Anyone may read; only active administrators may mutate. Public means asset URLs are not confidential. Keep sensitive/customer files out of these buckets.

## Migration workflow

```powershell
Get-Content supabase\.temp\project-ref
npx supabase migration list --linked
npx supabase db push --dry-run
npx supabase db push
npx supabase migration list --linked
```

Inspect every file under `supabase/migrations` first, link explicitly with `npx supabase link --project-ref kdyquipcyynugdyagecr`, and confirm the dashboard name/region. Never reset an unknown or production database. `supabase/seed.sql` is development content and must not be run blindly in production. Regenerate/review TypeScript database types after schema changes.

The expected latest local migration is `202608260001_phase_7_editorial_artwork.sql`. Audit on 2026-08-26 found the linked development project applied through `202608210012`; Phase 7 remains local-only and must be reviewed/applied before launch. A production project should be separate or explicitly approved; apply the same reviewed chain, provision admins separately and configure its URL/keys in hosting.

## Admin bootstrap

Create the user in Supabase Auth, then insert the matching UUID/email/role/active row into `admin_users` through an owner-controlled SQL session. There is no public signup. Transfer credentials out of band and require a password change where practical.

## Backup and recovery

Verify the actual project's plan and current Supabase dashboard before relying on automated backups or point-in-time recovery; capabilities vary. Schedule/export according to the approved recovery objective, test restoration in a separate project, and retain client originals outside Storage. A Git code rollback does not reverse data. Correct a bad migration with a reviewed forward migration or a migration-specific recovery plan.
