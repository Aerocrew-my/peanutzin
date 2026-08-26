# Production payments

Status: **NOT CONFIGURED**. PEANUTZIN has a provider-neutral order/payment boundary; no production gateway has been selected.

## Current behaviour

Checkout validates customer/cart input on the server, then `create_guest_order` reloads active books and derives item prices, shipping and totals in Postgres. Browser prices are never authoritative. Orders begin with fulfilment `pending` and payment `pending`. `PAYMENT_MODE=test` permits immediate simulated confirmation only outside `NODE_ENV=production`; production always returns an unconfigured handoff and cannot call a fake-success route.

`confirm_test_payment` locks the order, accepts only test orders, checks finite stock, decrements it once, stores a unique reference and is idempotent for an already-paid order. It is callable only with the server-held service role. Stock is decremented on trusted payment confirmation, not initial cart display.

## Provider integration contract

A selected provider integration must create its session server-side, use the server-derived MYR amount, preserve PEANUTZIN and provider references, verify webhook signature/event/amount/currency/merchant, represent pending/paid/failed/cancelled/refunded outcomes, and process callbacks idempotently inside a locked stock transaction. A browser redirect is never authoritative. Log only safe references and errors.

Create a provider-specific, service-role-only database function modelled on the transactional guarantees of `confirm_test_payment`; do not expose the test function or service-role key. Cancellation/refund and stock-restoration rules require client approval.

## Remaining work

- **CLIENT CONFIRMATION REQUIRED:** provider, merchant account, accepted methods, refund/cancellation policy and approved shipping rates.
- **NOT CONFIGURED:** provider credentials, session endpoint, signed webhook and live end-to-end test.
- `SUPABASE_SERVICE_ROLE_KEY` remains server-only. Omit `PAYMENT_MODE` in production until a real provider exists.
