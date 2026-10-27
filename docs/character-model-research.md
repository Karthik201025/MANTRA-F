# Character model research and licensing decision

## Decision

No third-party branded character model was downloaded into this project.

The requested selections include Marvel-inspired Avengers characters, Barbie, Sanrio, DC, Disney Princesses, and Minecraft. A downloadable fan model may depict the right character but still does not grant permission to redistribute or commercially use the underlying trademarked character. Importing such files without rights would create a licensing risk and would violate the requirement not to misrepresent generic or fan assets as approved production assets.

## Sources reviewed

- [Sketchfab licences](https://sketchfab.com/licenses) — the model page's licence controls permitted use; downloadability alone is not a commercial-character permission.
- [Sketchfab Standard License FAQ](https://sketchfab.com/faq#licenses) — Standard License terms apply to the purchased/approved asset and do not grant rights to a third-party trademarked character.
- [Sketchfab glTF support](https://sketchfab.com/features/gltf) — confirms glTF/GLB as a supported delivery format, but format does not change copyright or trademark rights.
- [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) — legitimate sample assets with per-asset licences, but no assets matching the Mantra character selections.
- [Kenney assets](https://kenney.nl/assets) — CC0 game assets suitable for generic fallback characters, not accurate Marvel, Barbie, Sanrio, DC, Disney, or Minecraft representations.

Searches also found downloadable fan-art Spider-Man models on Sketchfab. Their pages identify them as fan art and/or attribution/non-commercial material. They are not suitable for this application's branded selection without additional written permission from both the model author and the relevant rights holder.

## Current local manifest

[`src/data/character-assets.ts`](../src/data/character-assets.ts) maps all 30 selections to the original CSS demo illustration kind and records:

- universe
- character name
- character-specific visual notes
- `original-css-demo` source status
- `review-required-before-commercial-use` licensing status

The application deliberately labels these as fallback illustrations rather than claiming they are official 3D models. A future approved asset pass should add a local `.glb`/`.gltf` path, file checksum, triangle/material budget, attribution text, and verified licence URL for each asset before enabling it.

## Supplied local GLB inventory

| File | Embedded identity | Mantra mapping | Result |
|---|---|---|---|
| `lego_spiderman.glb` | `Lego Spiderman`; Ji3D; CC BY 4.0 | Spider-Man | Integrated |
| `lego_iron_man.glb` | `LEGO Iron Man`; Lego Mania; CC BY 4.0 | Iron Man | Integrated |
| `LEGO_-_Captain_America_(Avengers_1).glb` | Captain America nodes and shield | Captain America | Integrated; source-page licence confirmation still required |
| `lego_batman_minifigure.glb` | Lego Batman Minifigure; Neut2000; CC BY 4.0 | Batman | Integrated |
| `superman_lego.glb` | Superman Lego; gustavo.silvas1986; CC BY 4.0 | Superman | Integrated |
| `steve_minecraft.glb` | `steve minecraft`; israel2008; CC BY 4.0 | None | Intentionally not integrated; no exact existing Steve selection |

The five integrated files are not moved or copied. The app serves them from the existing `models` folder through the guarded local route `/api/models/[filename]`. `unmatchedProvidedModels` in [`src/data/character-assets.ts`](../src/data/character-assets.ts) records why Steve remains unused.

## Remaining asset gap

The requested “accurate downloadable 3D model for every character” cannot be completed responsibly from public fan-model downloads alone. The safe options are:

1. obtain written commercial permissions and trademark approvals for each branded character and model;
2. commission original, non-infringing companion designs that preserve the six-universe concept without copying protected characters; or
3. use generic CC0 models and rename/reframe the selections so they are not presented as the protected characters.
