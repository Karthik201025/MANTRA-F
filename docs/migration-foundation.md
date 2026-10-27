# Migration foundation

## Scope

This stage established local tooling and the first controlled landing-page migration:

- Next.js App Router
- React
- TypeScript with strict checking
- Tailwind CSS configured alongside existing CSS
- ESLint and development/build scripts
- A working root route
- The original landing page, pixel-art hero, onboarding selection, themes, and local migration handoff

The original [`index (2).html`](../index%20%282%29.html) remains the source of truth and has not been copied over or modified.

## Preservation decisions

- The exact `mantra-mark` path data is reused in `src/components/MantraMark.tsx`.
- No 21st.dev component was installed. The previous audit found no demonstrated need for a dependency at foundation stage, and the requested references should remain references until their source and licence are approved.
- No API, authentication, database, deployment, or environment-secret setup was added.
- The root page now renders the migrated landing surface. It does not claim that the rest of the application has been migrated.
- The original `index (2).html` remains unchanged and is still the reference for all future feature migrations.
- Nunito Sans is the single primary typeface across the application. `next/font/google` loads the approved weights (`400`, `600`, `700`, `800`, and `900`) with a swap strategy; the shared CSS token and native-control inheritance apply it to current and future surfaces.
- The former Press Start 2P import and explicit font declarations were removed. Pixel-art visuals remain unchanged; `.pixel` now preserves its layout leading without introducing a second typeface.
- The complete dashboard journey is now available after character selection. Its ten routes preserve the original names and provide functional local interactions, storage-backed demo feed behavior, browser speech/breathing controls, and explicit unavailable-API states.
- Character mappings are centralized in [`src/data/character-assets.ts`](../src/data/character-assets.ts). The workspace has no supplied licensed rendered character files, so the current figures remain original CSS demo illustrations with character-specific palette/kind mappings. Official likeness assets must be sourced and licence-reviewed before public or commercial use.

## Feature status

Completed in the local migration:

- Full application shell and navigation.
- My World, Talk to Your Companion, Career Guidance, Play Together, Right Match, Worlds, Community Feed, Reflection Space, Take a Pause, and Safety & Reports.
- Character selection, character themes, six built-in themes, local demo post storage, browser speech synthesis, breathing guide, reflection flow, entry-test flow, and demo moderation controls.

Blocked or intentionally demo-only:

- `/api/chat` and `/api/career` are still absent from this workspace. The UI reports the unavailable integration instead of claiming success.
- Community identity, access control, reports, suspensions, and persistence remain browser-only demos and are not security boundaries.
- Official commercial character assets are not supplied; the manifest documents the original CSS illustrations and licensing review requirement.
- Legacy story-quest data/functions from the original HTML remain preserved in the source reference and are not silently deleted.

## Next controlled stage

Continue migrating the application shell and feature surfaces incrementally. Each new surface should inherit the global Nunito Sans contract and should not add a competing font import or family declaration without explicit approval.
