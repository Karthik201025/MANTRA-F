# Mantra Supabase Integration Audit

Date: 2026-10-28

## Configuration

Inspected variables by name only. `.env.example` declares `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDFLARE_AGENT_URL`, and `CLOUDFLARE_AGENT_TOKEN`. Secret values are not documented here. The supplied publishable key is not written to the repository.

Supabase clients use `@supabase/ssr`:

- `src/lib/supabase-browser.ts`: browser client with publishable key.
- `src/lib/supabase-server.ts`: request-scoped server client with cookie read/write support.
- `src/middleware.ts`: refreshes the auth session with `auth.getUser()` while preserving optional guest mode.

## Existing schema and RLS

Migration `supabase/migrations/0001_mantra_core.sql` defines:

- `profiles`, owned by `auth.users.id`.
- `reflections`, private by `user_id`.
- `community_posts`, visible posts readable publicly and author-owned mutations.
- `community_reports`, reporter-owned inserts/selects.

RLS is enabled on all four tables. No destructive migration was added. No storage schema was found.

## Connected routes

- `/api/auth/status`: session presence.
- `/api/profile`: authenticated profile read/create/update.
- `/api/reflections`: authenticated private reflection CRUD.
- `/api/community/posts`: visible post read and authenticated post creation.
- `/api/community/reports`: authenticated report read/create.
- `/api/chat`, `/api/career`, `/api/quest`, `/api/reflection-prompt`, `/api/safety-review`, `/api/world-suggestion`: Cloudflare agent gateway routes.

## Mode boundaries

The landing experience remains usable as a local guest/demo flow. Authenticated Supabase persistence is opt-in through `/auth`. Play Together remains hidden. `index (2).html` remains untouched.

## Storage

Local processed character PNGs and GLBs remain source/rollback copies. The private bucket `mantra-character-assets` stores verified remote copies under `characters/processed/` and `characters/models/`. No local asset was deleted or overwritten.

## Live verification — 2026-10-28

- Supabase Auth settings: passed (`GET /auth/v1/settings`, HTTP 200).
- Private Storage bucket: verified (`mantra-character-assets`, `public: false`).
- Uploaded 24 processed PNGs and 6 GLBs with idempotent upsert.
- Authenticated listing verified 24 processed images and 6 models.
- Authenticated retrieval verified `characters/processed/barbie.png` (HTTP 200, `image/png`, 143841 bytes).
- Local source and rollback assets remain intact.
- Upload, listing, and retrieval are verified; signed URL retrieval and cross-user RLS tests remain pending.

## Live verification — 2026-10-28

- Supabase Auth settings: passed (`GET /auth/v1/settings`, HTTP 200).
- Auth configuration was reachable; no test account was created and no password was transmitted.
- Storage bucket listing with service-role credentials: passed request (`GET /storage/v1/bucket`, HTTP 200), zero buckets returned.
- Storage bucket listing with anon credentials: HTTP 200, zero buckets returned.
- Upload, signed URL retrieval, remote asset loading, and RLS cross-user tests: not run.

## Verification

Static inspection, live Auth settings reachability, and live Storage bucket checks completed. Upload/retrieval remains blocked by the absent bucket. No destructive operation was performed.
