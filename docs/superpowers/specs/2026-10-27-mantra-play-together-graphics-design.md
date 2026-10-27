# Mantra Play Together Graphics Design

## Scope

Add actual graphics to every game in the Play Together section while preserving existing game identifiers, mechanics, architecture, and `index (2).html` unchanged.

Games in scope:

- Patience Garden
- Cloud Sorter
- Grounding Explorer
- Comfort Room
- Meteor Mender
- Tiny Step Trail
- Story Quest

## Goals

1. Inventory all existing games, entities, assets, identifiers, routes, and mechanics.
2. Create `MANTRA_GAME_ASSET_MANIFEST.md` with exact filenames, dimensions, formats, animation frames, and status.
3. Establish one reusable 2D graphics system rather than seven unrelated renderers.
4. Complete Tiny Step Trail first as the reference prototype.
5. Apply the validated rendering and asset-loading patterns to all remaining games.
6. Keep the application local. Do not deploy. Do not use random internet images.
7. Never claim an asset exists until it is present and loaded successfully.

## Rendering architecture

Use a shared Canvas 2D gameplay layer integrated into the existing React UI. React remains responsible for screens, controls, menus, HUD, loading, pause, victory, defeat, and replay states. Canvas owns world drawing, camera transforms, sprite animation, procedural effects, and frame updates.

Each game provides a typed adapter containing world dimensions, entities, controls, collision rules, scoring, and completion conditions. The renderer consumes this adapter through stable interfaces. Existing game IDs and state transitions remain the source of truth.

Use local transparent PNG/WebP files for characters, environments, and major props when actual artwork is available. Use Canvas or inline SVG for procedural terrain, platforms, simple collectibles, collision visuals, particles, and effects. Centralize all paths and metadata in a typed asset registry.

## Asset system

The registry must support:

- transparent PNG and WebP images;
- sprite sheets;
- frame sequences;
- frame dimensions and scale;
- animation names, frame counts, and timing;
- loading and failure state;
- graceful procedural fallback that is visibly marked as fallback artwork.

No component may construct ad hoc asset paths. Missing files must produce a controlled loading/error state rather than a broken image or silently fabricated finished artwork.

## Prototype: Tiny Step Trail

Implement Tiny Step Trail first. The prototype must provide:

- visible full-body player character;
- idle, walk, jump, and fall animation states;
- colorful layered environment and terrain;
- platforms and collision boundaries;
- horizontal movement and jumping using existing game controls;
- collectible items and score updates;
- camera following the player within world bounds;
- start screen, HUD, pause, completion, defeat, and replay states;
- loading and missing-asset handling.

The prototype establishes the interfaces and visual conventions reused by other games.

## Remaining game adaptations

After Tiny Step Trail is verified, adapt the shared renderer to each remaining game’s actual mechanics. Do not force platformer behavior onto games with different mechanics. Each game receives appropriate entities, environment layers, effects, and HUD labels while reusing the same asset registry, animation utilities, camera primitives, and lifecycle handling.

## Visual direction

Preserve Mantra’s pixel-art/pastel identity and themed universes. Characters use consistent LEGO-style toy minifigure proportions, full-body transparent artwork, and shared scale rules. Interfaces use the existing Mantra tokens with polished start, pause, HUD, victory, defeat, and replay states. Graphics must be colorful, readable, and responsive at mobile and desktop widths.

## Documentation

Create `MANTRA_GAME_ASSET_MANIFEST.md` at the project root. It must inventory every game, character, enemy, environment, collectible, object, effect, and existing asset, including:

- stable identifier;
- exact filename;
- dimensions;
- format;
- animation frames and timing;
- consuming game/component;
- status: existing, created, generated, procedural, missing, or blocked;
- notes explaining why graphics were previously absent.

## Verification

Run the application locally and manually verify every Play Together game. Confirm that graphics render, assets load, controls respond, animations change state, collisions behave, scoring updates, completion states work, and replay returns to a playable state.

Run:

```powershell
npm run lint
npm run typecheck
npm run build
```

Report actual created assets, games with functioning graphics, and incomplete or blocked work. Do not infer deployed-service behavior from local checks.

## Out of scope

- modifying `index (2).html`;
- replacing the existing application architecture;
- adding random internet images;
- deploying the application;
- claiming PNG/WebP generation when no image-generation tool is available;
- unrelated backend, auth, or community feature changes.
