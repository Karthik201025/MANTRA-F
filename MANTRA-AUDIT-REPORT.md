# Mantra Phase 0 Audit Report

**Audit date:** 2026-10-25  
**Source of truth:** [`index (2).html`](./index%20%282%29.html)  
**Scope:** Repository audit and preservation only. No application behavior, source HTML, dependencies, or architecture were changed.

## Executive summary

The supplied product is a self-contained single-page browser application implemented in one HTML file containing inline CSS, SVG, markup, data, and JavaScript. It has a landing page, character/universe onboarding, a client-side routed application shell, ten named product areas, multiple interactive wellbeing games, a local demo community/feed/moderation loop, browser speech synthesis, and optional server-backed AI chat/career calls.

There is no Git repository in the supplied folder and no server/API source. The referenced `/api/chat` and `/api/career` endpoints are client calls only; they cannot be verified as implemented from this snapshot. The file explicitly describes some surfaces as demos and warns when a real server is required.

**Recommendation:** Preserve the HTML as the baseline and first extract behavior into small, testable modules without changing the visual system or route names. Do not introduce a framework or adopt third-party components until the user approves the migration and each component's source, dependency tree, licence, and visual fit have been reviewed.

## Repository state

- Workspace contents at audit time: one file, `index (2).html` (approximately 90 KB).
- `git status` could not be run because the folder is not a Git repository.
- No `package.json`, lockfile, server directory, API handlers, database schema, environment file, favicon asset, manifest, or test suite was present.
- Initialisation option, if approved later: create a Git repository in `g:\New folder (2)` and make an initial commit containing the supplied HTML unchanged. Do not rename, overwrite, or regenerate the source before that preservation commit. A safer alternative is to copy the source to a separately named baseline file and record its checksum, while retaining the original file.

## A. Product inventory

### Screens and product concepts

1. **Landing / marketing screen** (`#landing`)
   - Header brand, exact Mantra mark, “ENTER WORLD”.
   - Pixel-art animated world: stars, moon, clouds, portal, two figures, ground.
   - Hero copy, “CHOOSE YOUR COMPANION”, smooth-scroll “EXPLORE MANTRA”, product feature cards, footer.
2. **Onboarding / hero introduction** (`#heroIntro`)
   - Universe selection.
   - Character selection.
   - Display-name input.
   - Built-in and character theme selection.
   - “ENTER MY WORLD”.
3. **Application shell** (`#app`)
   - Sidebar navigation, responsive horizontal navigation at smaller widths, header title/subtitle, content outlet, toast status.
   - Sidebar theme menu and “Leave World”.
4. **My World** (`home`)
   - Welcome panel, in-world companion guide, cards linking to companion, career, match, worlds, and pause features.
5. **Talk to Your Companion** (`companion`)
   - Live-AI disclaimer, conversation bubbles, message form, pending state, error state, read-reply-aloud action.
6. **Career Guidance** (`career`)
   - Goal/profile form, roadmap request, follow-up form, AI conversation history, status and error messages.
7. **Your Mantra Journey / Companion Quest** (`game`)
   - Feeling, energy, need, optional note check-in.
   - Suggested-world routing.
   - Patience Garden, Cloud Sorter, Grounding Explorer, Comfort Room, Meteor Mender, Tiny Step Trail.
   - Cozy/adventure modes, selectable actions, reflections, next-step choices, companion handoff.
   - Legacy story-quest functions remain in the file and must be preserved until explicitly retired.
8. **Right Match** (`match`)
   - Seven preference questions, deterministic playful support-style result, disclaimer that it is not a clinical or real-person match.
9. **Choose a World / Worlds** (`communities`)
   - Six topic worlds: College Pressure, Confidence & Self-Worth, Friendships & Belonging, Small Wins Club, Life Changes, Quiet Corner.
   - Three-answer entry test, anti-paste demonstration, basic answer heuristics, local pass record.
10. **Community Feed** (`feed`)
    - Local post creation, escaped post rendering, support/like count, report prompt.
11. **Reflection Space** (`callie`)
    - Mood selector, reflection textarea, prompt buttons, session-only save status.
12. **Take a Pause** (`panic`)
    - Breath animation/pause control, 5–4–3–2–1 grounding voice guide, stop voice.
13. **Safety & Reports** (`moderation`)
    - Local report review, dismiss/close, remove local post, seven-day demo suspension lookup/actions.

### Data structures

- `themes`: six built-in theme objects with `name`, `bg`, `panel`, `accent`, `soft`, `text`.
- `universes`: six universes and character arrays:
  - Avengers (6), Barbie (5), Sanrio (6), DC Heroes (4), Disney Princesses (6), Minecraft (3).
  - Character tuple fields: name, description, outfit, detail, skin, hair, kind.
- `characterThemeOverrides`: explicit theme palettes for named characters.
- `pages`: route key to page title/subtitle.
- `questions`: seven Right Match question/answer sets.
- `worlds`: six community world name/description pairs.
- `companionGameScenes`: three legacy story scenes with three choices each.
- `wellnessGames`: six wellbeing games with metadata, prompts, actions, and finish prompts.
- Runtime state: `name`, `page`, `paused`, `currentTheme`, `companion`, `careerHistory`, `companionGameIndex`, `companionGameStars`, `activeWellnessGame`, `wellnessChosen`, `wellnessMode`, `mantraCheckin`.

### JavaScript functions and responsibilities

- **Navigation/lifecycle:** `$`, `esc`, `hideScreens`, `start`, `landing`, `logout`, `enterApp`, `nav`, `render`.
- **Onboarding/theme:** `renderUniverses`, `chooseUniverse`, `chooseCompanion`, `characterFromArray`, `getCharacterTheme`, `legoFigure`, `toggleThemeMenu`, `applyTheme`, `setThemeVariables`, `contrastMuted`, `applyCharacterTheme`, `renderThemeButtons`, `selectCharacterTheme`.
- **Home/match/community:** `renderHome`, `renderMatch`, `matchResult`, `renderCommunities`, `openRoom`, `submitEntryTest`.
- **Feed/moderation:** `getPosts`, `savePosts`, `getReports`, `renderFeed`, `addPost`, `postCard`, `likePost`, `reportPost`, `renderModeration`, `closeReport`, `removeReportedPost`, `suspendMember`, `suspendReportedMember`, `applySuspension`, `checkSuspension`.
- **Games:** `renderGame`, `startMantraJourney`, `openWellnessGame`, `setWellnessMode`, `chooseWellnessAction`, `talkAboutWellnessGame`, `renderBalloonGame`, `popBalloon`, `talkAboutBalloons`, `renderOldStoryQuestUnused`, `chooseGameAction`, `nextGameScene`.
- **AI:** `renderCareer`, `addCareerBubble`, `careerProfile`, `callCareerAI`, `startCareerRoadmap`, `sendCareerMessage`, `renderCompanion`, `sendCompanionMessage`.
- **Reflection/voice/pause:** `readCompanionReply`, `speakText`, `renderCallie`, `reflectionPrompt`, `saveReflection`, `renderPanic`, `toggleBreath`, `play54321`, `stopVoice`.

## B. Browser-only behavior, storage, and server requirements

### Confirmed `localStorage` keys

| Key | Written/read by | Purpose | Scope/limitation |
|---|---|---|---|
| `mantraEntryPasses` | `submitEntryTest` | Stores passed world keys as `displayName::world` | Browser-only; display name is not identity; easy to edit/clear |
| `mantraDemoPosts` | feed functions | Stores posts and likes | Browser-only; visible only in that browser |
| `mantraDemoReports` | report/moderation functions | Stores reports and status | Browser-only; no authorised moderation |
| `mantraDemoSuspensions` | moderation functions | Stores lowercase display-name expiry timestamps | Browser-only; no enforcement or identity |
| `mantraQuestStars` | legacy `chooseGameAction` | Stores story quest star count | Browser-only; current game flow may not use the legacy renderer |

There is no `sessionStorage`, IndexedDB, cookie, or database use found. Reflections, check-in state, current companion, name, themes, chat history, and career history are held only in JavaScript memory and disappear on reload/navigation lifecycle changes. `window.mantraGamePrompt` and `window.mantraJourneyContext` are transient globals.

### Browser-only demonstrations

- Landing pixel-art animation and all CSS animation.
- Universe/character selection and character-themed CSS variables.
- Right Match score/result.
- Community entry test and paste-blocking heuristic.
- Feed, likes, reporting, moderation, and suspension actions.
- Wellbeing game choices, completion, reflections, and companion handoff.
- Reflection “save” status.
- Breath animation and grounding prompts.
- Speech synthesis through `window.speechSynthesis`.

### Features requiring a real server/database for multiple users

- `/api/chat`: authenticated, rate-limited server proxy to an AI provider; requires privacy controls, abuse controls, retention policy, and secret management.
- `/api/career`: same server concerns plus careful handling of career-profile data.
- Accounts, identity, display-name ownership, sessions, and access control.
- Shared community posts, likes, reports, moderation queues, and server-enforced suspensions.
- Durable entry-test records and secure community membership/access control.
- Cross-device persistence for preferences, themes, check-ins, and game progress.
- Audit logs, moderator roles, appeals, deletion/export, and safety escalation.

## C. API verification

The HTML contains:

- `fetch('/api/chat', { method: 'POST', ... })` in `sendCompanionMessage`.
- `fetch('/api/career', { method: 'POST', ... })` in `callCareerAI`.

The supplied workspace contains no API implementation or server files. Therefore:

- **Confirmed:** the browser attempts to call both relative endpoints.
- **Not verified:** whether either endpoint exists in a deployment, Vercel project, proxy, or separate repository.
- **Not present locally:** handlers, authentication, provider configuration, database code, schema, rate limiting, logging, or secret management.
- **Do not infer backend availability from the UI text.** The career error text mentions `api/career.js` and `OPENAI_API_KEY`, but neither is present in this snapshot.

The client checks `response.ok`, attempts JSON parsing, shows a user-safe fallback, and logs the chat failure to the console. It does not enforce a request timeout, cancellation, retry policy, response schema validation beyond `data.reply`, or client-side payload-size enforcement beyond input maxlength.

## D. Logo and metadata preservation

The exact logo is an inline SVG symbol at lines 198–205:

- Symbol id: `mantra-mark`.
- View box: `0 0 16 16`.
- Four original paths with fills `#f3a8e7`, `#c4b2ff`, `#e9dfff`, and `#a995ff`.
- Reused through `<svg class="logo" viewBox="0 0 16 16"><use href="#mantra-mark"/></svg>`.
- Current uses: landing header, onboarding top bar, and application sidebar.
- Current sizing: 48×48 px normally and 40×40 px under 480 px.

**Preservation rule:** retain the symbol and path data byte-for-byte. Reuse the same `<use href="#mantra-mark">` pattern for any future header/sidebar placement. A favicon cannot directly depend on a symbol inside the page, so a future favicon should be an exact exported copy of the same SVG artwork, not a redraw or recolour; that export requires explicit approval and should be checksum-compared to the source symbol.

Head metadata currently includes charset, viewport, theme-color `#111027`, and title. There is no favicon link, manifest, description, Open Graph metadata, canonical URL, CSP, or explicit preconnect for Google Fonts. The font import is external and uses Press Start 2P and Nunito.

## E. Findings

### Confirmed defects / risks

1. **No repository or reproducible dependency boundary.** The entire product is one unversioned file; there are no tests, lockfile, build, deployment, or server sources.
2. **Backend/API implementations are absent from the supplied snapshot.** AI features will fail unless a separately deployed `/api/chat` and `/api/career` exists.
3. **Client-only community safety is not security.** Entry passes, reports, likes, and suspensions can be modified by any user through browser storage. The UI itself correctly labels this as a demo.
4. **Moderation access is not restricted.** Any visitor can open the moderation page and perform local demo actions.
5. **No server-side privacy or retention controls are visible.** Companion and career messages are sent to endpoints when configured; the client warning is useful but not a substitute for consent, minimisation, retention, deletion, or provider controls.
6. **No API timeout/cancellation.** A stalled endpoint can leave the “thinking” state active indefinitely.
7. **No favicon and limited head metadata.** This is an incomplete production document head, not a logo defect.
8. **Potential navigation defect:** the wellness completion button calls `nav('games')`, but `pages` has `game` (singular), not `games`; `nav` then dereferences `pages[p][0]`, which can throw for that action.
9. **Potential legacy-path defect:** `renderOldStoryQuestUnused` references `c.innerHTML`, although `c` is not a parameter or local in that function. It appears unused, but must not be deleted during preservation.
10. **Error handling is inconsistent:** some storage writes are guarded and notify via toast, while `closeReport` writes directly without a `try/catch`; storage quota/private-mode failure can therefore surface as an uncaught error.
11. **Dynamic inline event handlers and string-built HTML broaden XSS risk.** Many user-controlled values are escaped, but the approach is fragile and deserves a security review before server-backed content is introduced.
12. **Accessibility gaps are present:** decorative logo SVGs do not have an explicit accessible name but are inside branded text; some clickable cards are buttons with nested button-like visual spans; dynamic route changes do not move focus to the page heading; there is no skip link; `prompt`/`confirm` are blocking browser dialogs; the voice feature has limited error/status coverage.

### Recommendations, not confirmed defects

- Add a small semantic test harness before refactoring.
- Add route validation and a not-found fallback before any route extraction.
- Add endpoint timeout/abort, schema validation, and explicit offline messaging.
- Add CSP, security headers, consent/privacy documentation, and a server-side threat model when deploying AI/community features.
- Add `aria-current`, focus management, keyboard state checks, and automated accessibility testing.
- Add a manifest/favicon only by reusing the exact logo artwork.
- Preserve the pixel/pastel visual system; avoid glassmorphism, generic dashboard metrics, or default component styling.

## F. 21st.dev component evaluation

The public detail pages and one live preview were inspected. The detail pages expose author, short description, dependency metadata, installation route, licence field, and preview URL. The source-install routes require a 21st API key; no key was requested, stored, or used. The dashboard and Animated AI Chat preview pages failed to load in the browser during this audit, so their visual fit is not claimed as fully preview-verified.

| Component | Exact page / preview | Dependencies and conventions | Licence | Recommendation |
|---|---|---|---|---|
| Dashboard with Collapsible Sidebar by Sonu Kumar | [Detail page](https://21st.dev/@uniquesonu/components/dashboard-with-collapsible-sidebar) · [Live preview](https://21st.dev/@uniquesonu/components/dashboard-with-collapsible-sidebar) | React; `lucide-react`; collapsible dashboard/sidebar; dark/light CSS class theme management. Install route is shadcn-compatible and requires a 21st API key. | Unknown on page | **Structural reference only.** The existing Mantra shell already has a sidebar and responsive collapse-to-horizontal behavior. Reuse only information architecture ideas after comparing source and keyboard behavior. Reject its dashboard metrics/default dark-mode styling if it conflicts with Mantra’s pixel/pastel identity. |
| Animated AI Chat by Jatin Yadav | [Detail page](https://21st.dev/@jatin-yadav05/components/animated-ai-chat) · [Live preview](https://21st.dev/@jatin-yadav05/components/animated-ai-chat) | React, Tailwind-style utility conventions, `lucide-react`, `framer-motion`; glass-morphism and animated command/chat states. Install route requires a 21st API key. | MIT | **Do not adopt wholesale.** Consider only interaction-state ideas (pending, streaming/error affordances, focus behavior) for the existing companion chat. Reject glassmorphism, command affordances, and animation defaults until mapped to Mantra’s identity and reduced-motion behavior. |
| Spotlight Card by Preet Suthar | [Detail page](https://21st.dev/@preetsuthar17/components/spotlight-card) · [Live preview](https://21st.dev/@preetsuthar17/components/spotlight-card) | React + Tailwind; HextaUI library; hover spotlight effect. The inspected preview is a bundled Vite/React page. | Unknown | **Optional, lowest-risk reference.** If approved, adapt the hover/focus highlight to existing `.game-card` using Mantra tokens, preserving borders, pixel shadows, keyboard focus, touch behavior, and reduced motion. Do not install until source and licence are confirmed. |

### Component licensing and adoption gate

“Unknown” licence metadata is not approval to ship. Before adopting any component, obtain its actual source and dependency manifests, confirm the licence and attribution obligations, inspect transitive dependencies, test the live preview at mobile/keyboard/reduced-motion states, and document the exact adapted code. Do not pass a 21st API key into this repository or commit generated third-party code without review.

## G. Architecture options

### Recommended minimal-change route

1. Preserve the original HTML as a baseline and initialise Git.
2. Add a small test/check script around the current file and manually verify every route/action.
3. Extract CSS, data, and JavaScript into vanilla modules incrementally while keeping the same DOM concepts, route keys, text, data, SVG symbol, and CSS variables.
4. Add a thin server layer only for `/api/chat` and `/api/career`, with environment-held provider secrets, validation, timeout, rate limiting, privacy policy, and logging that excludes message contents by default.
5. Move shared community/moderation state to a database only after defining accounts, roles, consent, retention, deletion, and abuse workflows.

**Trade-offs:** lowest visual and behavioral risk; preserves static hosting and the current routing model; requires disciplined incremental tests and eventually a separate server boundary. It does not provide framework-level component composition or type checking unless added selectively.

**Deployment implications:** static HTML/CSS/JS can remain on a CDN/static host. AI endpoints can be serverless functions or a small API service. Shared data needs a managed database and authentication. Secrets must remain server-side.

### Optional framework migration route

After explicit approval, migrate to a framework in stages: first reproduce the existing shell and routes, then move data/constants and individual renderers, then wire API calls and persistence. The exact framework is intentionally not selected in Phase 0 because the current source has no package/deployment constraints to justify one.

**Benefits:** typed component boundaries, routing, test tooling, predictable server integration, and easier future design-system work.  
**Costs:** high regression risk for the inline animations, string-rendered interactions, exact logo reuse, route behavior, and visual identity; introduces build tooling, dependencies, licensing review, and a new deployment pipeline. It also makes “same behavior” harder to prove.

**Explicit approval required for:** framework choice, routing replacement, component-library adoption, visual changes, source-file renaming, backend/database introduction, data migration, and any removal of legacy/placeholder functions.

## Proposed next steps

1. Approve preservation baseline and initialise Git without modifying the supplied HTML.
2. Decide whether the product should remain a static demo or become a multi-user service; this determines auth, database, moderation, privacy, and API scope.
3. Reproduce the confirmed route defect (`games` versus `game`) and legacy-function behavior in a test harness before fixing anything.
4. Obtain/inspect source and licences for any 21st.dev candidate before adoption.
5. Approve either the minimal-change route or a framework migration as a separate phase.

