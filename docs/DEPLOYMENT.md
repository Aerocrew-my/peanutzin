# Deployment

Status: **READY FOR CONFIGURATION**. No hosting provider, production domain or live deployment is recorded in this repository. The application requires a full Next.js Node-compatible runtime (route handlers, Server Actions and dynamic data); it is not a static export. Vercel is compatible but not assumed.

## Prerequisites

- Node.js 20+ and npm (the repository does not pin a patch version)
- GitHub and a Next.js-compatible hosting account
- Access to the intended Supabase project and reviewed migrations
- Production values described in `.env.example`

## Build and deploy

```powershell
npm ci
npm run test:commerce
npm run test:social
npm run lint
npm run build
```

Connect `origin/main` to the hosting provider or deploy the validated commit using the provider's standard Next.js workflow. Build command is `npm run build`; for a generic Node host, start with `npm run start`. Add variables in the provider's encrypted environment settings, not a committed file. Public variables are fixed into the client build, so rebuild after changes.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin; production builds reject a missing/non-HTTPS value. Set the Supabase public URL/anon key and server-only service role. Omit `PAYMENT_MODE`. Add OpenAI and Make.com values only when those services are approved. Apply/verify Supabase migrations using [SUPABASE_OPERATIONS.md](SUPABASE_OPERATIONS.md).

Attach the client-approved custom domain in the host, add the requested DNS records with the DNS owner, wait for HTTPS issuance, then update `NEXT_PUBLIC_SITE_URL` and redeploy. No final domain or HTTPS status is currently verified.

## Post-deploy checks

Check `/`, `/news`, `/gossips`, `/events`, `/features`, `/books`, representative story/event/book pages, `/about`, `/contact`, `/cart` and `/checkout`; admin login and protected redirects; article/book/order/settings/Social Studio screens; `/robots.txt`, `/sitemap.xml` and `/opengraph-image`; canonical/OG absolute URLs; Storage and optimized images; desktop/mobile/dark mode; accessible keyboard/focus basics; checkout's production-unconfigured payment behaviour; manual social fallback; Make.com only if configured; and hosting/Supabase error logs.

## Rollback

Redeploy the previous known-good Git commit through the host (or create a reviewed revert commit). Do not use code rollback to rewrite database records. Code rollback changes application code; content mistakes should be corrected through CMS; database rollback needs migration-specific SQL or a verified backup restore. Never delete migrations or run a production reset.

Suggested handover tag after owner approval: `v1.0.0-mvp`. It is not created automatically.
