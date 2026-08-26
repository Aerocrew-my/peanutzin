# Production email

Status: **NOT CONFIGURED**. There is no email provider or sending abstraction in the repository. An order confirmation page does not imply email delivery.

Send confirmation only after order creation succeeds. Include the order number, customer name, item snapshots, server-derived totals, shipping summary/status and confirmation link. Do not send admin notes, secrets or the stored token hash.

The integration belongs server-side after successful order creation, behind a small provider-neutral adapter. Delivery failure must not mark payment successful or discard the order; monitor it separately and support an authorized resend. The existing link uses a random 256-bit token while only its SHA-256 hash is stored, so email code should receive the raw link only during checkout.

Before launch, select a provider, approve sender/template, verify the sender domain (SPF/DKIM/DMARC where supported), configure server-only credentials, define retry/privacy retention, and test success and failure. No email variables exist until a provider is selected.
