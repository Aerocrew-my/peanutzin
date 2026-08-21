# AI Social Studio

`/admin/social-studio` turns an optional source article plus a master brief into editable Facebook, Instagram, LinkedIn, Threads, short promotional, hashtag, and SEO copy. The workflow is explicit: create, generate, review, edit, and save. It never publishes or regenerates on page load or keystrokes.

## Architecture and configuration

The page reads articles and drafts with the signed-in user's Supabase session. Server Actions re-check active admin/editor membership for every save, delete, and generation request. AI configuration is centralized in `src/lib/ai/config.ts`; prompts and structured parsing live in `src/lib/ai/social.ts`. Set `OPENAI_API_KEY` only in the server environment. `OPENAI_MODEL` is optional and defaults to `gpt-4.1-mini`. The key is never browser-exposed or logged.

Generation uses the OpenAI Responses API with a strict JSON schema. It times out after 30 seconds, constrains output and prompt sizes, and returns friendly errors for missing configuration, timeout, malformed output, rate limits, and provider failures. Existing edits stay in client state when generation fails. Individual regeneration replaces only the requested field. OpenAI usage is billed by the third-party provider; generation therefore occurs only after an explicit click.

Without an API key the studio still renders and manual drafts can be created, edited, copied, reviewed, marked ready, and deleted. There is no implicit fake/mock generation.

## Voice and factual safety

The system prompt defines PEANUTZIN as an independent Malaysian publisher with a fun, smart, conversational, curious voice. It discourages corporate jargon, forced slang, generic hype, excessive emoji, and invented cultural references. The article/brief is declared the complete factual source and the model is instructed never to invent details.

Only useful article fields are sent: title, category, excerpt, truncated body, and applicable event dates/location. Database metadata and secrets are excluded.

## Data and security

Migration `202608210006_ai_social_studio.sql` creates `social_drafts`, links an optional article, stores each editable platform field in one row, and supports `draft`, `generated`, `reviewed`, and `ready`. Small audit metadata records generation time, model, and whether the source was a brief or article; full provider responses are not stored.

RLS grants select/insert/update/delete only to authenticated users for whom `public.is_active_admin()` is true. Inserts bind `created_by` to `auth.uid()`. Anonymous and ordinary authenticated users have no table policy, and server actions independently enforce the same authorization.

## Phase 6 handoff

The single-row platform fields and workflow status are ready for a future explicit export payload. Make.com, platform credentials, direct publishing, scheduling, analytics, and engagement metrics are intentionally absent. Phase 6 must preserve the rule that AI assists editors and never silently publishes or overwrites reviewed human work.
