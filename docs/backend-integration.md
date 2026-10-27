# Local backend integration boundary

The current Mantra app remains usable as a local browser demo. This document
records the production-shaped integration boundary without claiming that any
external service is configured.

## Cloudflare Workers AI and Agents

Next.js keeps the `/api/chat` and `/api/career` routes. Each route validates
input, limits request size, applies a 15-second timeout, and calls a private
Cloudflare Worker endpoint through `src/lib/server-config.ts`.

The local Worker source is in `worker/index.ts`. It uses the native Workers AI
binding, exposes separate `/companion` and `/career` agent routes, validates
its bearer token, and never returns a fabricated response. Career responses are
parsed as JSON before they are returned. It also exports a durable
`MantraAgent` class from the Cloudflare `agents` SDK and routes SDK agent
requests through `routeAgentRequest`; the Durable Object binding and SQLite
migration are in `wrangler.toml`.

Required local variables:

```text
CLOUDFLARE_AGENT_URL=
CLOUDFLARE_AGENT_TOKEN=
```

The configured Worker exposes these POST paths:

- `/companion` returning `{ "reply": "..." }`
- `/career` returning `{ "roadmap": ... }`

No provider response is fabricated. Without `CLOUDFLARE_AGENT_URL`, both routes
return HTTP 503 with a configuration error. The Worker bundle and Wrangler
configuration can be checked locally with `npm run worker:typecheck` and
`npx wrangler deploy --dry-run`; actual inference requires a Cloudflare account
with Workers AI enabled.

## Supabase

The initial schema and RLS policies are in
`supabase/migrations/0001_mantra_core.sql`. They are not applied automatically.
API routes now exist for authenticated community posts and private reflections.
They enforce the Supabase session and rely on the migration's RLS policies.
The browser demo retains a local-only fallback when Supabase is unavailable;
this must not be described as shared persistence.

Required variables when Supabase is actually connected:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service-role key is server-only and must never be exposed to the browser.
Apply the migration with the Supabase CLI only after creating a local project
and reviewing the policies.

## Local commands

```powershell
npm install
npm run dev
```

In a second terminal, after authenticating Wrangler:

```powershell
npx wrangler login
npm run worker:dev
```

For a local token-protected Worker, set a secret in the local Wrangler
environment and copy the same value to `CLOUDFLARE_AGENT_TOKEN`:

```powershell
npx wrangler secret put AGENT_TOKEN
```

Then set `CLOUDFLARE_AGENT_URL=http://127.0.0.1:8787` in the Next.js process.
Do not put account tokens in `.env.example` or source files.

## Account setup still required

1. Create or select a Cloudflare account with Workers AI access.
2. Authenticate Wrangler locally.
3. Confirm the configured model is available for the account.
4. Start the Worker and send a local `/companion` request.
5. Create a Supabase project and enable email authentication.
6. Set the three Supabase variables locally.
7. Apply `supabase/migrations/0001_mantra_core.sql`.
8. Open `/auth`, create a test account, and verify `/api/auth/status`.
9. Verify a community post is visible only under the intended RLS policy.
10. Verify a reflection is inaccessible from another user account.

None of these account-dependent checks were claimed as verified in this local
workspace.
