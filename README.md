# PEANUTZIN

PEANUTZIN is an editorial-first Malaysian digital publishing platform with a secondary bookstore. It combines public news, gossip, events, features and books with an authenticated CMS, guest checkout and order management, AI-assisted Social Studio, and provider-neutral social publishing.

## Stack and architecture

- Next.js 16 App Router, React 19, TypeScript and Tailwind CSS 4
- Supabase Postgres, Auth, Row Level Security and Storage
- Server Actions for authenticated CMS operations
- Server-only service-role access for guest order creation and trusted integrations
- Optional OpenAI generation and Make.com publishing; neither is required for manual editorial work

The repository is handover-ready. Core editorial, CMS, commerce architecture, SEO and Social Studio are implemented. Production payment and confirmation email providers are **NOT CONFIGURED**. Make.com publishing is **READY FOR CONFIGURATION**. Shipping rules and final artwork require client approval.

## Local development

Prerequisites: Node.js 20 or newer, npm, and access to the intended Supabase project.

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Populate `.env.local` according to [.env.example](.env.example). Use only the Singapore development project `kdyquipcyynugdyagecr`; never use the obsolete Seoul PEANUTZIN project. Test payment simulation requires `PAYMENT_MODE=test` and is disabled whenever `NODE_ENV=production`.

## Validation

```powershell
npm run test:commerce
npm run test:social
npm run lint
npm run build
```

The `*:live` scripts use linked development services and may create temporary records. Review their prerequisites before running them.

## Operations

- [Deployment](docs/DEPLOYMENT.md)
- [Production checklist](docs/PRODUCTION_CHECKLIST.md)
- [Administrator guide](docs/ADMIN_GUIDE.md)
- [Supabase operations](docs/SUPABASE_OPERATIONS.md)
- [Payments](docs/PAYMENTS_PRODUCTION.md)
- [Email](docs/EMAIL_PRODUCTION.md)
- [Social publishing](docs/SOCIAL_PUBLISHING.md)
- [Content and assets](docs/CONTENT_AND_ASSETS.md)
- [Maintenance and recovery](docs/MAINTENANCE.md)
- [Security](docs/SECURITY.md)

## Security

Never commit `.env.local`, service-role keys, API keys, callback secrets or client passwords. Public Supabase credentials are intentionally browser-visible; authorization remains enforced by RLS. See [SECURITY.md](docs/SECURITY.md) for trust boundaries and incident guidance.
