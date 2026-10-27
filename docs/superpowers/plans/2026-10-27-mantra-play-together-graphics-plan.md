# Mantra Play Together Graphics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add verified, reusable graphics and playable visual game surfaces to all seven Play Together games without changing `index (2).html` or existing game identifiers/mechanics.

**Architecture:** Keep React in control of page state, menus, HUD, loading, pause, victory, defeat, and replay. Add a shared Canvas 2D runtime with typed game adapters, centralized asset metadata/loading, camera and animation utilities, and procedural fallbacks. Build Tiny Step Trail first, then adapt the remaining six games to their actual mechanics.

**Tech Stack:** Next.js 16, React 19, TypeScript, Canvas 2D, existing CSS tokens, local PNG/WebP/SVG assets, existing `LandingPage.tsx` state model.

## Global Constraints

- Preserve existing character identifiers and code references.
- Do not modify `index (2).html`.
- Keep the app local; do not deploy.
- Do not use random internet images.
- Never reference nonexistent files or claim unavailable PNG/WebP artwork is finished.
- Use procedural fallback artwork only when clearly marked as fallback.
- Preserve Mantra’s pixel-art/pastel identity and themed universes.
- Do not change unrelated backend, auth, community, or AI features.

## File map

- Create: `MANTRA_GAME_ASSET_MANIFEST.md` — exact inventory and asset status.
- Create: `src/features/games/types.ts` — shared renderer, asset, input, camera, and adapter types.
- Create: `src/features/games/assets.ts` — centralized asset registry and loader.
- Create: `src/features/games/animation.ts` — sprite-sheet/frame-sequence animation utility.
- Create: `src/features/games/camera.ts` — bounded camera calculations.
- Create: `src/features/games/rendering.ts` — Canvas drawing primitives, layers, effects, fallback visuals.
- Create: `src/features/games/GameCanvas.tsx` — React lifecycle wrapper for Canvas runtime.
- Create: `src/features/games/tiny-step-trail.ts` — prototype adapter and simulation.
- Create: `src/features/games/game-adapters.ts` — adapters for the six remaining games.
- Create: `src/features/games/GameSurface.tsx` — shared game shell with start/HUD/pause/result/replay states.
- Create or modify: `src/features/games/assets/**` — only assets actually created and verified.
- Modify: `src/features/landing/LandingPage.tsx` — connect selected game to `GameSurface`; retain existing IDs and choices.
- Modify: `src/app/globals.css` — scoped game canvas/HUD/loading/responsive styles only.
- Create: `src/features/games/__tests__/**` if test tooling exists; otherwise add deterministic pure-function tests through the repository’s available test runner.

---

### Task 1: Inventory existing games and assets

**Files:**
- Read: `src/features/landing/LandingPage.tsx`
- Read: `src/data/character-assets.ts`
- Read: `public/**/*`
- Create: `MANTRA_GAME_ASSET_MANIFEST.md`

**Interfaces:**
- Produces stable game IDs, current action labels, current story scenes, character IDs, existing asset paths, and a status table consumed by later tasks.

- [ ] **Step 1: Extract the current game list and mechanics**

Record these existing game IDs and action mechanics without renaming them: `Patience Garden`, `Cloud Sorter`, `Grounding Explorer`, `Comfort Room`, `Meteor Mender`, `Tiny Step Trail`, `Story Quest`. Record Story Quest scene/action/star behavior separately.

- [ ] **Step 2: Inventory existing files**

Record the actual contents of `public`, `public/images/characters`, `models`, and `src/data/character-assets.ts`. Mark absent graphics as `missing`; mark CSS/DOM figures and `.glb` files according to their actual state.

- [ ] **Step 3: Write the manifest**

Include stable ID, exact filename, dimensions, format, animation frames/timing, consuming game/component, status, and why graphics were previously absent. Do not list an asset as created until it exists.

- [ ] **Step 4: Verify manifest paths**

Check every non-missing path against the filesystem. Remove any path that does not exist. Record blocked PNG/WebP artwork as `blocked` if no image-generation tool is available.

- [ ] **Step 5: Commit**

```powershell
git add MANTRA_GAME_ASSET_MANIFEST.md
git commit -m "docs: inventory Play Together game assets"
```

---

### Task 2: Define shared game interfaces

**Files:**
- Create: `src/features/games/types.ts`
- Test: `src/features/games/__tests__/types.test.ts`

**Interfaces:**
- Produces `GameId`, `GamePhase`, `InputState`, `CameraState`, `SpriteAnimation`, `GameAssetDefinition`, `GameAdapter`, `GameEntity`, and `GameFrame` types.
- `GameAdapter` must expose `id`, `world`, `initialState()`, `update(state, input, dt)`, `draw(ctx, state, assets, camera)`, `isComplete(state)`, and `isDefeated(state)`.

- [ ] **Step 1: Write type-level usage tests**

Create a minimal adapter fixture that compiles with the intended interface and rejects an invalid game ID or missing lifecycle method.

- [ ] **Step 2: Run the type test**

Run `npm run typecheck`. Expected: fail because `src/features/games/types.ts` does not exist.

- [ ] **Step 3: Implement the types**

Use discriminated unions for phases and asset source kinds. Keep state opaque at the shared layer using `unknown` or adapter-owned generic state; do not put game-specific mechanics into global types.

- [ ] **Step 4: Run verification**

Run `npm run typecheck`. Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/features/games/types.ts src/features/games/__tests__/types.test.ts
git commit -m "feat: define shared game graphics interfaces"
```

---

### Task 3: Build centralized asset registry and loader

**Files:**
- Create: `src/features/games/assets.ts`
- Create: verified files under `src/features/games/assets/**` or `public/images/games/**`
- Modify: `MANTRA_GAME_ASSET_MANIFEST.md`
- Test: `src/features/games/__tests__/assets.test.ts`

**Interfaces:**
- Produces `gameAssets`, `loadGameAssets(definitions)`, and `getAssetDefinition(id)`.
- `loadGameAssets` returns `{ status: "loading" | "ready" | "partial" | "error", assets: Map<string, HTMLImageElement>, failures: string[] }`.

- [ ] **Step 1: Write loader tests**

Test registry lookup, missing-file failure, sprite-sheet metadata, frame-sequence metadata, and successful image load using a mocked `Image` implementation.

- [ ] **Step 2: Run tests to verify failure**

Run the repository’s available test command for the new test file. Expected: fail because the registry and loader are absent.

- [ ] **Step 3: Add only verified local assets**

Create deterministic local SVG/procedural source files where needed. Add PNG/WebP only when an actual generation tool produces them. Register exact dimensions, format, scale, animation names, frame count, and frame timing.

- [ ] **Step 4: Implement loader and fallback status**

Centralize all asset paths. Never let game components construct paths. Return partial/error status and preserve failures for visible UI messaging.

- [ ] **Step 5: Update manifest and run tests**

Mark each asset `created`, `procedural`, `existing`, `missing`, or `blocked` based on filesystem evidence. Run tests and `npm run typecheck`.

- [ ] **Step 6: Commit**

```powershell
git add src/features/games/assets.ts src/features/games/assets MANTRA_GAME_ASSET_MANIFEST.md
 git commit -m "feat: add verified game asset registry"
```

---

### Task 4: Implement shared animation, camera, and rendering utilities

**Files:**
- Create: `src/features/games/animation.ts`
- Create: `src/features/games/camera.ts`
- Create: `src/features/games/rendering.ts`
- Test: `src/features/games/__tests__/animation.test.ts`
- Test: `src/features/games/__tests__/camera.test.ts`

**Interfaces:**
- `advanceAnimation(animation, elapsedMs)` returns the current frame index and next elapsed value.
- `followCamera(target, viewport, world)` returns bounded `CameraState`.
- Rendering exports `drawLayer`, `drawSprite`, `drawSpriteFrame`, `drawFallbackCharacter`, `drawCollectible`, `drawParticleBurst`, and `drawPixelTerrain`.

- [ ] **Step 1: Write animation and camera tests**

Cover frame wrapping, paused animation, animation reset on state change, camera clamping at both world edges, and viewport larger than world.

- [ ] **Step 2: Run tests to verify failure**

Run the available test command. Expected: fail because utilities are absent.

- [ ] **Step 3: Implement deterministic utilities**

Keep drawing functions side-effect-free except for Canvas context drawing. Use device-pixel-ratio-safe sizing in the Canvas wrapper, not inside pure camera math.

- [ ] **Step 4: Run tests and typecheck**

Run tests, `npm run typecheck`, and `npm run lint`. Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/features/games/animation.ts src/features/games/camera.ts src/features/games/rendering.ts src/features/games/__tests__
git commit -m "feat: add shared game animation camera and rendering utilities"
```

---

### Task 5: Build the Canvas React runtime and game shell

**Files:**
- Create: `src/features/games/GameCanvas.tsx`
- Create: `src/features/games/GameSurface.tsx`
- Modify: `src/app/globals.css`
- Test: `src/features/games/__tests__/GameCanvas.test.tsx` if component test tooling exists

**Interfaces:**
- `GameCanvas({ adapter, phase, onStateChange, onComplete, onDefeat })` owns `requestAnimationFrame`, resize handling, input listeners, asset loading, and cleanup.
- `GameSurface({ gameId, companion, onExit })` owns start, loading, playing, paused, complete, defeat, and replay UI.

- [ ] **Step 1: Write runtime tests**

Test that the Canvas receives keyboard/pointer input, the animation loop is cancelled on unmount, loading failures are announced, and complete/defeat callbacks transition the shell.

- [ ] **Step 2: Implement Canvas lifecycle**

Use `useRef` for Canvas and runtime state, `useEffect` for listeners and animation loop, and `ResizeObserver` or window resize fallback. Cancel all listeners and frames in cleanup.

- [ ] **Step 3: Implement shared shell states**

Render explicit loading/error text, controls, HUD, pause, victory, defeat, replay, and exit controls. Make fallback artwork visibly labeled. Keep keyboard and pointer controls available.

- [ ] **Step 4: Add responsive scoped CSS**

Use existing Mantra variables. Ensure Canvas has a stable aspect ratio, no horizontal overflow, visible focus states, and touch-friendly controls.

- [ ] **Step 5: Run checks**

Run the component tests if configured, then `npm run lint`, `npm run typecheck`, and `npm run build`.

- [ ] **Step 6: Commit**

```powershell
git add src/features/games/GameCanvas.tsx src/features/games/GameSurface.tsx src/app/globals.css
 git commit -m "feat: add shared Canvas game runtime and UI shell"
```

---

### Task 6: Implement Tiny Step Trail prototype

**Files:**
- Create: `src/features/games/tiny-step-trail.ts`
- Modify: `src/features/games/GameSurface.tsx`
- Modify: `src/features/landing/LandingPage.tsx`
- Test: `src/features/games/__tests__/tiny-step-trail.test.ts`

**Interfaces:**
- Produces `tinyStepTrailAdapter: GameAdapter<TinyStepTrailState>` with player position/velocity, platforms, collectibles, score, lives/defeat state, camera target, and completion state.

- [ ] **Step 1: Write simulation tests**

Cover gravity, left/right movement, jump only while grounded, platform landing, collectible removal and score increment, world-bound camera target, completion after the final collectible/goal, and defeat/restart.

- [ ] **Step 2: Run tests to verify failure**

Run the targeted test command. Expected: fail because the adapter is absent.

- [ ] **Step 3: Implement minimal deterministic simulation**

Use fixed world coordinates and `dt` clamping. Preserve the existing Tiny Step Trail action labels in the surrounding React UI. Do not replace the current game ID.

- [ ] **Step 4: Implement prototype drawing**

Draw layered sky/background, terrain/platforms, player sprite or verified fallback, collectibles, particles, and goal. Select idle/walk/jump/fall animation state from velocity and grounded state.

- [ ] **Step 5: Wire prototype through `GameSurface`**

Selecting Tiny Step Trail must open the shared shell. Existing companion navigation remains available after completion.

- [ ] **Step 6: Run tests and local build**

Run targeted tests, `npm run lint`, `npm run typecheck`, and `npm run build`. Start locally with `npm run dev` and manually verify controls, animation, collisions, score, camera, pause, completion, defeat, and replay.

- [ ] **Step 7: Commit**

```powershell
git add src/features/games/tiny-step-trail.ts src/features/games/GameSurface.tsx src/features/landing/LandingPage.tsx src/features/games/__tests__/tiny-step-trail.test.ts
 git commit -m "feat: add Tiny Step Trail graphics prototype"
```

---

### Task 7: Adapt the remaining six games

**Files:**
- Create: `src/features/games/game-adapters.ts`
- Modify: `src/features/games/GameSurface.tsx`
- Modify: `src/features/landing/LandingPage.tsx`
- Modify: `MANTRA_GAME_ASSET_MANIFEST.md`
- Test: `src/features/games/__tests__/game-adapters.test.ts`

**Interfaces:**
- Produces adapters keyed by the exact existing IDs: `Patience Garden`, `Cloud Sorter`, `Grounding Explorer`, `Comfort Room`, `Meteor Mender`, and `Story Quest`.
- Every adapter implements the same lifecycle interface but retains its own mechanic: garden actions, thought sorting, sensory exploration, comfort selection, meteor tapping, and story scenes/stars.

- [ ] **Step 1: Write adapter behavior tests**

Test each game’s existing action options and state transition. Test Meteor Mender tap/collect behavior, Cloud Sorter categories, Story Quest scene progression and stars, and completion/replay for all adapters.

- [ ] **Step 2: Implement game-specific simulations**

Reuse shared drawing and lifecycle utilities. Do not impose platformer collision on non-platform games. Add only entities required by each game’s existing mechanic.

- [ ] **Step 3: Add game visuals**

Use layered procedural backgrounds, verified local character/environment/prop assets, particles, and game-specific HUD labels. Missing artwork must show the controlled fallback state.

- [ ] **Step 4: Connect all selections**

Replace the current action-only result surface with `GameSurface` for all seven games while retaining existing descriptions, action labels, Story Quest stars, and companion exit behavior.

- [ ] **Step 5: Run checks**

Run adapter tests, `npm run lint`, `npm run typecheck`, and `npm run build`. Manually open each game from Play Together in cozy and adventure modes.

- [ ] **Step 6: Commit**

```powershell
git add src/features/games/game-adapters.ts src/features/games/GameSurface.tsx src/features/landing/LandingPage.tsx MANTRA_GAME_ASSET_MANIFEST.md src/features/games/__tests__/game-adapters.test.ts
 git commit -m "feat: add graphics adapters for all Play Together games"
```

---

### Task 8: Full local verification and completion report

**Files:**
- Modify: `MANTRA_GAME_ASSET_MANIFEST.md`
- Create: `MANTRA_PLAY_TOGETHER_GRAPHICS_REPORT.md`

**Interfaces:**
- Produces a truthful report of created assets, functioning games, blocked assets, manual verification coverage, and remaining work.

- [ ] **Step 1: Run static checks**

```powershell
npm run lint
npm run typecheck
npm run build
```

Record exact failures; do not mark a check passed without output.

- [ ] **Step 2: Run the local app**

```powershell
npm run dev
```

Open `http://localhost:3000`, enter a world, open Play Together, and test every game in both modes where applicable.

- [ ] **Step 3: Verify interaction matrix**

For each game verify: loading state, visible graphics, controls, animation changes, collision or mechanic behavior, scoring/progression, completion, pause, defeat where applicable, replay, responsive layout, and keyboard focus.

- [ ] **Step 4: Verify preservation**

Confirm `index (2).html` has no modifications. Confirm existing character identifiers and API/backend files are unchanged unless a directly required game integration changed them.

- [ ] **Step 5: Update manifest and report**

List only actual assets and tested games. Clearly distinguish procedural artwork, generated artwork, missing artwork, and blocked work.

- [ ] **Step 6: Commit**

```powershell
git add MANTRA_GAME_ASSET_MANIFEST.md MANTRA_PLAY_TOGETHER_GRAPHICS_REPORT.md
 git commit -m "docs: report Play Together graphics verification"
```

## Self-review checklist

- [x] Every spec requirement maps to a task.
- [x] Prototype precedes remaining game adaptations.
- [x] Asset paths are centralized and verified.
- [x] Missing assets have explicit fallback/loading behavior.
- [x] All seven exact game names remain stable.
- [x] `index (2).html` preservation is explicit.
- [x] Local verification and truthful reporting are explicit.
- [x] No deployment or unrelated backend work is included.
