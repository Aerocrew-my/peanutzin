# Production checklist

## Repository

- [ ] `main` is clean and synchronized with `origin/main`
- [ ] Validated release commit recorded; optional `v1.0.0-mvp` approved

## Hosting and environment

- [ ] Production deployment/URL and HTTPS verified
- [ ] Custom domain and redirects approved
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
- [ ] Server-only `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`/`OPENAI_MODEL` if AI is required
- [ ] Payment and email provider configuration when implemented
- [ ] `MAKE_SOCIAL_WEBHOOK_URL` and `MAKE_SOCIAL_CALLBACK_SECRET`
- [ ] No test credentials or `PAYMENT_MODE=test` in production

## Supabase

- [ ] Intended project/ref/region verified; obsolete Seoul project excluded
- [ ] Migrations and migration history verified
- [ ] RLS, Storage policies and first admin reviewed
- [ ] Backup/recovery approach and client-original asset backup confirmed

## Content

- [ ] Final articles, events, books, contact details and site settings approved
- [ ] Final artwork and copyright/licensing approved
- [ ] Phase 7 graphics accepted or replaced

## Commerce

- [ ] **CLIENT CONFIRMATION REQUIRED:** Peninsular RM8 and Sabah/Sarawak/Labuan RM15 shipping assumptions approved or replaced
- [ ] Production payment provider configured; live order and signed callback tested
- [ ] Stock, idempotency, cancellation/refund and confirmation behaviour tested

## Email and social

- [ ] Email provider/sender domain configured and delivery tested
- [ ] Make.com scenario active; webhook/callback secret configured
- [ ] Facebook, Instagram, LinkedIn and Threads credentials owned in Make.com
- [ ] One live test per intended platform; manual fallback confirmed

## SEO, QA and handover

- [ ] Site URL, sitemap, robots, canonicals, OpenGraph and indexing checked; admin remains noindex/disallowed
- [ ] Desktop, mobile, dark mode, accessibility, checkout, admin and Social Studio smoke-tested
- [ ] Admin/domain/Supabase/hosting/Make.com/payment/email access transferred securely
- [ ] Documentation delivered and production logs reviewed
