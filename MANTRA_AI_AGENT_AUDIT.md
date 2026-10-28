# Mantra AI Agent Audit

Date: 2026-10-28

## Provider boundary

- The runtime provider is Cloudflare Workers AI through the `AI` binding in `worker/agents.ts`.
- The Next.js API routes call the local/remote Worker through `CLOUDFLARE_AGENT_URL` and an optional server-only `CLOUDFLARE_AGENT_TOKEN`.
- No Anthropic SDK usage exists in the inspected application routes or Worker. The Cloudflare Worker is provider-specific and remains unchanged; no Anthropic SDK was introduced.
- `worker/env.d.ts` contains generated Cloudflare type markers mentioning other gateway providers. These are generated declarations, not active application integrations.

## Agent contracts

| Agent | Route | Output | Current status |
|---|---|---|---|
| Companion | `/api/chat` → Worker `/companion` | `{ reply }` | Implemented through Workers AI |
| Career Navigator | `/api/career` → `/career` | `{ roadmap }` | Implemented; Worker parses JSON |
| Quest/Learning | `/api/quest` → `/quest` | `{ activity }` | Implemented; Worker parses JSON |
| Reflection | `/api/reflection-prompt` → `/reflection` | `{ prompt }` | Implemented; Worker parses JSON |
| Community Safety | `/api/safety-review` → `/safety` | `{ review }` | Implemented; Worker parses JSON |
| World Builder | `/api/world-suggestion` → `/world` | `{ suggestion }` | Implemented; Worker parses JSON |

## Safety controls found

- Next.js routes validate JSON objects and cap user text fields.
- AI requests use 15-second abort timeouts.
- Worker requests can require `Authorization: Bearer` using `AGENT_TOKEN`.
- Worker returns generic provider failure messages instead of provider internals.
- Supabase server authentication uses the publishable key; the service-role key is not used in frontend code.

## Gaps addressed

- Provider-unavailable and provider-request-failed errors now use typed server-side error classes rather than string-only classification.
- Route payload limits now have named constants for agent topic/context/reason/preferences budgets.

## Remaining gaps

- No rate limiter exists in the local Next.js or Worker routes. Add a deployment-appropriate limiter before public exposure.
- Worker input validation remains weaker than the Next.js boundary for direct Worker callers: history entries, preferences, topic, difficulty, reason, and display fields need explicit schemas and limits.
- No agent persistence tables or message/task metadata tables were found in the existing migration.
- No Supabase Storage migration or upload verification exists. Live upload status is unverified until credentials and permissions are supplied.
- No Anthropic provider is configured or evidenced; this audit does not claim Anthropic integration.

## Verification scope

Static inspection completed. Live Cloudflare AI and Supabase calls were not executed. Never treat missing local provider configuration as a successful integration.
