# Mantra Security Audit

Date: 2026-10-28

## Confirmed controls

- No service-role key is imported by client components.
- Browser/server Supabase clients use the publishable key and request cookies.
- Middleware refreshes sessions with `auth.getUser()`.
- User-owned routes derive IDs from the verified Supabase session, not request payloads.
- Existing SQL enables RLS and applies ownership checks to profiles, reflections, posts, and reports.
- AI route inputs are length-bounded and provider calls have 15-second abort timeouts.
- Cloudflare agent calls support an optional bearer token; provider errors avoid exposing raw upstream failures.
- Local source assets remain intact; no destructive reset or deployment occurred.

## Findings

- The configured app has no repository test suite for cross-user RLS or auth flows. These require isolated Supabase test accounts and were not claimed as passed.
- Direct Worker callers receive weaker validation than the Next.js routes. Before public deployment, add strict per-agent schemas and rate limiting at the Worker boundary.
- AI routes are currently callable without a Supabase session. This preserves guest/demo behavior but permits unauthenticated provider usage; add authenticated mode or a deployment-specific rate limiter before public exposure.
- Live Storage verification on 2026-10-28 confirmed the private bucket `mantra-character-assets`, 24 processed PNGs, 6 GLBs, authenticated listing, and authenticated sample retrieval. Local assets remain intact.
- Email verification and password recovery UI are not fully implemented in the existing auth page. Sign-up/sign-in are present; recovery and verification behavior depends on Supabase configuration.

## Secret handling

Never commit or print `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDFLARE_AGENT_TOKEN`, or other privileged values. The supplied publishable key is not stored in project files by this change.
