# Mantra - AI Companion & Student Wellbeing Application

A retro-game-inspired digital world for students combining AI companionship, career discovery, learning, wellbeing, and safe community interactions with customizable pixel-art environments.

**Current Status:** Core features implemented, backend integration ready, local development fully functional.

The original source of truth remains preserved at [`index (2).html`](./index%20%282%29.html).

## Requirements

- Node.js 20.9 or newer. The current workspace was checked with Node.js 24.13.1 and npm 11.17.0.
- VS Code with this folder opened as the workspace.

## Install and run locally

From `g:\New folder (2)` in the VS Code terminal:

```powershell
npm install
npm run dev
```

Optional AI Worker, in a second terminal after local Wrangler authentication:

```powershell
npm run worker:dev
```

Use [`.env.example`](./.env.example) and
[`docs/backend-integration.md`](./docs/backend-integration.md) for the exact
provider setup. The Worker can be bundle-checked without credentials using
`npm run worker:typecheck` and `npx wrangler deploy --dry-run`.

Open [http://localhost:3000](http://localhost:3000).

## Ten Core Features

### 1. **My World** - Personal Dashboard
Your home base with character selection, navigation, and personalized welcome.

### 2. **Talk to Companion** - AI Chat
Conversational AI companion for support and encouragement (requires Cloudflare Worker AI).

### 3. **Career Guidance** - AI Career Navigator
Explore career paths, skills, and create learning roadmaps (requires Cloudflare Worker AI).

### 4. **Play Together** - Interactive Wellness Games
- Patience Garden, Cloud Sorter, Grounding Explorer
- Comfort Room, Meteor Mender, Tiny Step Trail
- Story Quest cooperative adventure with star tracking

### 5. **Right Match** - Compatibility Quiz
Discover your preferred support style and communication preferences.

### 6. **Worlds** - Community Spaces
Topic-based communities with entry tests for safety:
- College Pressure, Confidence & Self-Worth
- Friendships & Belonging, Small Wins Club
- Life Changes, Quiet Corner

### 7. **Community Feed** - Shared Experiences
Post thoughts, offer encouragement, and connect with others (requires Supabase for persistence).

### 8. **Reflection Space** - Private Journaling
Save private reflections with guided prompts (requires Supabase for persistence).

### 9. **Take a Pause** - Wellness Tools
- Guided breathing exercise with animation
- 5-4-3-2-1 grounding technique
- Clear mental health disclaimers

### 10. **Safety & Reports** - Community Moderation
Report inappropriate content and review report status (requires Supabase for persistence).

## Feature Availability

### ✅ Works Without Configuration (Browser-Only Demo)
- All 10 features accessible
- Character and universe selection
- Games and quizzes fully functional
- Wellness tools operational
- Local browser storage for temporary data

### 🔧 Enhanced with Supabase (Optional)
- User authentication
- Persistent storage across sessions
- Community posts visible to all users
- Private reflections with full CRUD
- Report tracking and moderation
- User profile with preferences

### 🤖 Enhanced with Cloudflare Worker AI (Optional)
- AI Companion chat responses
- Career guidance roadmap generation
- Context-aware interactions

## Configuration

### Option 1: No Configuration (Quick Start)
```bash
npm install
npm run dev
```
App works immediately with browser-only storage.

### Option 2: With Supabase (Persistent Data)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run migration: `supabase/migrations/0001_mantra_core.sql`
4. Copy credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Option 3: With AI Features (Cloudflare Workers)
1. Set up worker in `worker/` directory
2. Configure `.env.local`:
```env
CLOUDFLARE_AGENT_URL=http://127.0.0.1:8787
CLOUDFLARE_AGENT_TOKEN=dev-local-token
```
3. Implement `/companion` and `/career` endpoints

See [`.env.example`](./.env.example) for full configuration options.

## API Endpoints

### User & Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile (name, universe, companion, theme)
- `GET /api/auth/status` - Check authentication status

### AI Features
- `POST /api/chat` - Send message to AI companion
- `POST /api/career` - Get career guidance roadmap

### User Content
- `GET /api/reflections` - List user's private reflections
- `POST /api/reflections` - Save new reflection
- `DELETE /api/reflections?id=xxx` - Delete reflection

### Community
- `GET /api/community/posts` - List visible community posts
- `POST /api/community/posts` - Create new post
- `GET /api/community/reports` - List user's reports
- `POST /api/community/reports` - Submit content report

### Assets
- `GET /api/models/[filename]` - Serve 3D character models (.glb files)

## Database Schema

Tables created by `supabase/migrations/0001_mantra_core.sql`:

- **profiles** - User display name, universe, companion, theme
- **reflections** - Private user reflections (RLS protected)
- **community_posts** - Public posts with status (visible/hidden/under_review)
- **community_reports** - Content moderation reports

All tables have Row Level Security (RLS) enabled for data protection.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

No secrets are required for the local demo. Optional provider configuration is
documented in [`.env.example`](./.env.example) and
[`docs/backend-integration.md`](./docs/backend-integration.md). Without those
providers, the app remains local-only and the AI routes return explicit
configuration errors rather than fake responses.

## Structure

- `src/app/` — App Router layout, root page, and global styling.
- `src/components/` — reusable presentation components.
- `src/features/` — reserved for incremental feature migrations.
- `src/lib/` — reserved for shared utilities.
- `src/data/` — reserved for preserved static product data.
- `public/` — reserved for approved static assets.
- `docs/` — migration documentation.
- `worker/` — local Cloudflare Workers AI agent entrypoint.
- `supabase/migrations/` — reviewed SQL schema and RLS policies.

The remaining audited feature destinations are intentionally pending migration. See [`docs/migration-foundation.md`](./docs/migration-foundation.md).

Tailwind CSS is configured and loaded in `src/app/globals.css`, but the temporary scaffold uses CSS matching the existing Mantra tokens so Tailwind does not replace the original styling approach.

Nunito Sans is the single application typeface. It is loaded with `next/font/google` in `src/app/layout.tsx`, applied through the shared `--font-body` token, and inherited by buttons, inputs, textareas, and selects. Pixel-art identity is preserved through the existing visual treatment rather than a separate display font.
