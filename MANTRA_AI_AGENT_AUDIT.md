# Mantra AI Agent Audit

Date: 2026-10-28

## Provider boundary

- Cloudflare Workers AI is configured locally through server-only `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_AI_MODEL`.
- The shared provider implementation is `src/lib/ai-gateway.ts`.
- No Cloudflare credential uses a `NEXT_PUBLIC_` prefix.
- Existing Supabase authentication, ownership checks, persistence, UI, and assets remain unchanged.

## Configuration verification

- `CLOUDFLARE_ACCOUNT_ID`: present in `.env.local`; value not printed.
- `CLOUDFLARE_API_TOKEN`: present in `.env.local`; value not printed.
- `CLOUDFLARE_AI_MODEL`: present in `.env.local`; value not printed.
- Cloudflare model listing request: HTTP 200, success true, 73 models returned.

## Live inference verification

- Initial Cloudflare Workers AI REST inference returned HTTP 400, error code `7000` (`No route for that URI`).
- Root cause: model path encoding converted the `/` in `@cf/meta/...` into `%2F`.
- Fixed the gateway to encode model path segments while preserving `/` separators.
- Retried with the configured model and chat-style `messages` payload: HTTP 200, `success: true`, valid `result.response` received.
- Credentials were not printed.

## Personalization gap analysis

- Existing verified identity: Supabase cookie session through `supabase.auth.getUser()`.
- Existing user-owned records: `profiles`, `reflections`, `community_posts`, and `community_reports`, all protected by RLS.
- Existing missing layer: no shared server-side context assembly; agent routes previously sent only request fields.
- No conversation-history, learning-progress, saved-world, or explicit-consent tables were present. These remain unavailable and are not fabricated.
- New context layer reads only the authenticated user's profile, three recent reflections, and aggregate counts for their own posts/reports.
- Context is marked as untrusted data inside the prompt and cannot override agent instructions.

## Agent status

| Agent | Route | Status |
|---|---|---|
| Companion | `/api/chat` | Uses shared Cloudflare REST gateway; live inference blocked by HTTP 400 |
| Career Navigator | `/api/career` | Existing optional Worker boundary; migration pending live Companion verification |
| Quest/Learning | `/api/quest` | Existing optional Worker boundary; migration pending live Companion verification |
| Reflection | `/api/reflection-prompt` | Existing optional Worker boundary; migration pending live Companion verification |
| Community Safety | `/api/safety-review` | Existing optional Worker boundary; migration pending live Companion verification |
| World Builder | `/api/world-suggestion` | Existing optional Worker boundary; migration pending live Companion verification |

## Gateway controls

- Provider URL, model, timeout, and credentials are environment-driven.
- Credentials remain server-side.
- Conversation messages are role- and length-validated.
- Non-2xx responses, timeouts, empty responses, and malformed payloads fail closed.
- Cloudflare REST responses support the Workers AI `{ result: { response } }` shape.
- Cloudflare-specific code remains isolated from agent routes.

## Per-agent live verification — 2026-10-28

Synthetic non-sensitive Cloudflare Workers AI requests completed independently:

| Agent | HTTP | Response received |
|---|---:|---|
| Companion | 200 | yes; previously verified |
| Career | 200 | yes |
| Quest | 200 | yes |
| Reflection | 200 | yes |
| Safety | 200 | yes |
| World Builder | 200 | yes |

These direct provider tests confirm inference reachability and response presence. Route-level authenticated integration tests and cross-user isolation tests remain separate and are not claimed here.

## Verification

- Cloudflare model listing: HTTP 200.
- Cloudflare inference: HTTP 400; not operationally verified.
- TypeScript: passed before final Cloudflare gateway edits; rerun required.
- Lint: passed before final Cloudflare gateway edits; rerun required.
- Production build: passed before final Cloudflare gateway edits; rerun required.
- Public deployment: not performed.

## Remaining blockers

1. Inspect the redacted Cloudflare 400 error code without exposing token values.
2. Correct the configured model or request payload if the error identifies a mismatch.
3. Re-run one real Companion inference.
4. Migrate the remaining five agents after Companion success.
