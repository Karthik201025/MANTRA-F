# Mantra Game Asset Manifest

**Date:** 2026-10-27  
**Scope:** Play Together graphics overhaul  
**Source of truth:** Files verified in the local workspace. Missing files are not referenced by runtime code.

## Asset status

| Stable ID | Exact path | Dimensions | Format | Animation | Consumer | Status | Notes |
|---|---|---:|---|---|---|---|---|
| `character-spiderman` | `models/lego_spiderman.glb` | runtime model | GLB | model-defined | CharacterModel | existing | Existing 3D character model; not a 2D sprite sheet. |
| `character-iron-man` | `models/lego_iron_man.glb` | runtime model | GLB | model-defined | CharacterModel | existing | Existing 3D character model; not a 2D sprite sheet. |
| `character-captain-america` | `models/LEGO_-_Captain_America_(Avengers_1).glb` | runtime model | GLB | model-defined | CharacterModel | existing | Existing 3D character model; not a 2D sprite sheet. |
| `character-batman` | `models/lego_batman_minifigure.glb` | runtime model | GLB | model-defined | CharacterModel | existing | Existing 3D character model; not a 2D sprite sheet. |
| `character-superman` | `models/superman_lego.glb` | runtime model | GLB | model-defined | CharacterModel | existing | Existing 3D character model; not a 2D sprite sheet. |
| `character-steve` | `models/steve_minecraft.glb` | runtime model | GLB | model-defined | CharacterModel | existing | Existing 3D character model; not a 2D sprite sheet. |
| `character-2d-directory` | `public/images/characters/.gitkeep` | n/a | Git keep file | none | LandingPage fallback | existing | Directory contains no PNG/WebP artwork. |
| `game-terrain` | no local file | n/a | Canvas | procedural | Play Together games | procedural | To be rendered by shared Canvas primitives; no file path claimed. |
| `game-effects` | no local file | n/a | Canvas | procedural | Play Together games | procedural | Particles, glows, sparks, and feedback drawn at runtime. |

## Stable game IDs and existing mechanics

| Game ID | Existing actions/mechanics | Visual status |
|---|---|---|
| `Patience Garden` | Give it water; Clear one stone; Sit beside it. Gentle garden choice flow. | No game-specific local artwork; procedural fallback required. |
| `Cloud Sorter` | Sort thoughts into actionable, cannot-solve-now, or certainty-seeking categories. | No game-specific local artwork; procedural fallback required. |
| `Grounding Explorer` | Notice 5 things seen, 4 things felt, 3 things heard. | No game-specific local artwork; procedural fallback required. |
| `Comfort Room` | Choose soft blanket and quiet, kind note, or friendly presence. | No game-specific local artwork; procedural fallback required. |
| `Meteor Mender` | Tap glowing meteors, then gather sparks. | No game-specific local artwork; procedural fallback required. |
| `Tiny Step Trail` | Open a task; work for two minutes; ask for help or break. Planned prototype: movement, platforms, collectibles, camera, completion/defeat/replay. | No game-specific local artwork; procedural Canvas fallback required. |
| `Story Quest` | Three scenes: The Cloud Bridge, The Quiet Forest, The Star Garden. Each action advances scene and increments persisted stars. | No game-specific local artwork; procedural fallback required. |

## Story Quest scenes

| Scene | Actions |
|---|---|
| `The Cloud Bridge` | Build it one small step at a time; Ask a friendly bird for help; Take a pause and look around. |
| `The Quiet Forest` | Follow the glowing flowers; Make a map together; Choose the coziest resting spot. |
| `The Star Garden` | Water one tiny plant; Leave a kind note; Invite your companion to help. |

## Generation and verification notes

- No PNG/WebP image-generation output exists in the workspace at inventory time; no generated artwork is claimed.
- No random internet images are used.
- Existing `.glb` files are verified local assets and remain available to the existing `CharacterModel` path.
- The new renderer must centralize asset metadata and use clearly labeled procedural fallback artwork when a local 2D asset is unavailable.
- `index (2).html` is preserved and must remain unchanged.
- Dimensions and frame timing are `n/a` for existing GLB assets because they are models, not sprite sheets. Procedural Canvas entities have no file dimensions or frame files.
