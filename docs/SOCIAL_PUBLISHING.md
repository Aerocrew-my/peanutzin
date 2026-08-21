# Social Publishing

Social Studio keeps human review as the publication boundary. A saved draft must have `status = ready`; server actions re-read that status and platform-specific copy before doing any work.

## Architecture

`social_publications` stores one platform attempt with its method, status, idempotency reference, downstream reference, timestamps, and any failure. RLS allows only active `admin_users`; anonymous and ordinary authenticated users have no policies. Every server mutation also calls `requireAdmin()`.

The Make.com URL is read only in server code from `MAKE_SOCIAL_WEBHOOK_URL`. Configure a custom webhook in Make.com, store its URL in the deployment environment, and route by the payload `platform`. A successful HTTP handoff becomes `sent`, never `published`.

Payload fields are limited to `publication_id`, `attempt_reference`, `social_draft_id`, `platform`, platform copy, hashtags, source URL, and an approved `article-media` URL when the source article has a storage path. Color fallbacks and arbitrary third-party media are omitted.

## Confirmation callback

Configure `MAKE_SOCIAL_CALLBACK_SECRET` and have Make.com POST to `/api/social-publishing/callback` with `Authorization: Bearer <secret>`. The JSON body needs `publication_id`, `attempt_reference`, `status` (`published` or `failed`), and may include `external_reference` or `error_message`. The endpoint uses constant-time secret comparison and only updates the matching record while it is `sent`.

## States and retry

- `pending`: database attempt created before the webhook call.
- `sent`: Make.com accepted the handoff; publication is not yet confirmed.
- `published`: verified callback confirmation.
- `failed`: missing webhook, timeout, HTTP error, malformed response, callback rejection, or downstream failure.
- `manual`: an administrator explicitly confirmed a manual post; method remains `manual`.

Each submission carries a unique attempt reference. Rapid duplicate submissions conflict safely. A retry is a new intentional UI action and therefore a new reference.

## Manual workflow

For Facebook, Instagram, LinkedIn, and Threads, administrators can copy the caption, hashtags, or full post, open the official platform home/feed, and then choose **Mark Published Manually**. This records `method = manual`; it does not claim API confirmation. Platform limitations still apply, and URL-based automatic posting is deliberately not attempted.

## Production setup

1. Apply the Supabase migrations and upload the approved files in `supabase/assets/article-media` to the public `article-media` bucket at the same paths.
2. Set `MAKE_SOCIAL_WEBHOOK_URL` and `MAKE_SOCIAL_CALLBACK_SECRET` in the server deployment environment.
3. Configure authenticated platform connections inside Make.com and map each platform route.
4. Return a signed callback only after the platform confirms publication.

No analytics, scheduling, inbox, background auto-publishing, platform tokens, or secrets are exposed to the browser.
