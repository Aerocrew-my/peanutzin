# Maintenance, backup and recovery

Routine work should use the CMS: update articles and replace images, add/deactivate books, inspect failed orders and private notes, and inspect Social Studio publication history/failure messages. Use hosting logs for route/build errors and Supabase logs for database/Auth/Storage failures. Monitor storage growth and provider usage/costs.

Rotate OpenAI, Make.com callback/webhook and future provider secrets in their owning service and hosting environment, redeploy if required, test, then revoke the old value. Never log the value. Review dependency updates in a branch, read Next.js 16's bundled version-specific docs, run all tests/lint/build, and deploy a small reviewed diff. Add schema changes as new migrations and verify the target ref before `db push`.

Do not casually edit production tables, expose service-role keys, delete/edit applied migrations, bypass RLS, rewrite published order history, force-change paid totals, or commit `.env.local`.

## Backups and recovery

GitHub is the code source of truth. Record deployed SHAs. Confirm the actual Supabase plan's backup/PITR capability in the dashboard; do not assume it. Keep scheduled exports if required by the recovery objective and test restores separately. Storage is operational data: retain client originals and licence records outside Supabase.

Correct content mistakes through the CMS. For a failed deployment, redeploy the prior known-good commit without touching data. A bad migration needs a reviewed forward correction or backup recovery; `git reset` does not reverse Postgres.

## Incident response

1. Contain: disable the affected integration/deployment or revoke the compromised credential without destroying evidence.
2. Record time, affected routes/orders/accounts, deployed SHA and safe log references; never paste secrets into tickets.
3. Assess data/payment/social impact and notify the owner/provider under the agreed policy.
4. Restore a known-good code version or apply a reviewed data fix; rotate credentials.
5. Verify public/admin/checkout/integration paths, preserve an incident summary and add a prevention test/checklist item.
