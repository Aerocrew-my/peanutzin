# PEANUTZIN commerce

Phase 4 adds a deliberately small guest-commerce system without changing PEANUTZIN's editorial-first structure.

## Cart and checkout

The cart provider stores only book ID, slug, and an integer quantity (1–20) in `localStorage` under `peanutzin-cart-v1`. Display prices are convenient previews only. `POST /api/checkout` validates contact details, a controlled Malaysian state, postcode, quantities, and cart shape before calling the transactional `create_guest_order` database function. That function reloads active books, checks current stock, snapshots title/author/slug and integer-cent prices, and derives shipping and totals.

Shipping defaults are isolated in the `shipping` site setting: RM8 Peninsular and RM15 Sabah, Sarawak, or Labuan. These are development/business placeholders, not courier quotes. Change `peninsular_cents` and `east_malaysia_cents` in that setting before launch.

## Orders and security

`orders` and `order_items` use RLS. Anonymous and ordinary authenticated users receive no direct order access. Active admins can read orders/items and update orders. Guest creation and test confirmation RPCs are executable only by `service_role`; the key is used only by server code and must never use a `NEXT_PUBLIC_` name. Confirmation pages use a 256-bit random token while the database stores only its SHA-256 hash. Admin notes are never returned publicly.

Order fulfilment follows `pending → processing → shipped → completed`, with explicit cancellation from pending/processing. Payment follows its own `unpaid / pending / paid / failed / refunded` lifecycle. Admin UI cannot mark payments paid.

## Payments and stock

No production provider is selected. `PAYMENT_MODE=test` enables immediate test confirmation only when `NODE_ENV` is not `production`; production always stays provider-unconfigured and orders remain pending. The one-time `confirm_test_payment` transaction locks the order, verifies availability, decrements non-null stock without going negative, records a unique reference, and returns without repeating work when already paid. A real provider must create its session after order creation and call an equivalent service-role-only confirmation function only after trusted webhook/server verification.

## Environment

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `PAYMENT_MODE` (`test` locally; omit in production until a provider is implemented)

## Production checklist

Apply migrations to the linked Singapore development project first; set reviewed shipping rates; configure the service role only in the server deployment; replace test mode with a Malaysian payment provider and verified webhook; add confirmation email when a provider is chosen; run the commerce tests, lint, build, RLS checks, and an end-to-end low-stock/idempotency test; then remove test orders. Courier integration, accounts, discounts, memberships, returns, and advanced inventory remain deferred.
