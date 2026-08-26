# Security handover

Supabase RLS is the primary database boundary. Public users read only published articles, active books, allow-listed settings and public media. Active `admin_users` gain scoped CMS/order/social policies; protected routes and every Server Action re-check membership. Use least privilege, individual administrator accounts, strong unique passwords and prompt deactivation on handover or departure.

The service-role key bypasses RLS and is used only in server-only modules for guest-order transactions and verified callbacks. It must never use `NEXT_PUBLIC_`, enter browser code, logs or source control. Public Supabase URL/anon key are browser configuration, not authorization secrets.

Checkout validates input server-side and Postgres reloads books, derives integer-cent price/shipping/totals and snapshots order items. Confirmation tokens are random; only SHA-256 hashes are stored. Production ignores test payment mode. A future provider must verify signed webhooks, amount/currency/reference and idempotency before marking paid.

Social drafts must be human-marked Ready. Make.com handoff becomes `sent`, not `published`; only the bearer-secret callback may confirm `published`/`failed`, and constant-time comparison plus attempt/status matching prevents unauthenticated or duplicate confirmation. Platform credentials belong in Make.com.

Keep secrets in encrypted hosting/provider settings, rotate them after exposure, redact customer data and tokens from logs, and restrict log retention/access. Never send production service-role keys, webhook secrets, or payment secrets through public GitHub issues or commit history.
