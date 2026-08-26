# Environment reference

Never commit real values. `NEXT_PUBLIC_*` values are bundled into browser code and are public; all other application secrets are server-only.

| Variable | Development | Production | Boundary | Missing behaviour |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required for real data | Required | Public project URL | Dev fallback only; production data fails closed |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required for real data/Auth | Required | Public anon key | Auth/data unavailable; production fails closed |
| `NEXT_PUBLIC_SITE_URL` | Optional (`localhost`) | Required HTTPS origin | Public canonical origin | Production build fails |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for checkout/live tests | Required for checkout | Server-only secret | Secure checkout/integration access unavailable |
| `PAYMENT_MODE` | Optional `test` | Omit | Server-only flag | Provider unconfigured; production ignores `test` |
| `OPENAI_API_KEY` | Optional | Optional if AI wanted | Server-only secret | Manual Social Studio works |
| `OPENAI_MODEL` | Optional | Optional | Server-only setting | Defaults to `gpt-4.1-mini` |
| `MAKE_SOCIAL_WEBHOOK_URL` | Optional | Required for automation | Server-only URL | Automated handoff fails safely; manual flow works |
| `MAKE_SOCIAL_CALLBACK_SECRET` | Optional | Required with automation | Server-only secret | Callbacks are rejected |
| `PEANUTZIN_APP_URL` | Optional live-test URL | Not required | Script-only | Image test uses `127.0.0.1:3010` |
| `PEANUTZIN_TEST_ADMIN_EMAIL/PASSWORD` | Optional test account | Do not set | Script-only secret | Admin live tests skip/fail per script |
| `PEANUTZIN_TEST_NONADMIN_EMAIL/PASSWORD` | Optional test account | Do not set | Script-only secret | Non-admin live assertions may skip/fail |
| `NODE_ENV` | Next.js-managed | Next.js-managed | Build/runtime flag | Next.js supplies it |

Safe formats are in `.env.example`. Add payment/email variables only after a provider is selected.
