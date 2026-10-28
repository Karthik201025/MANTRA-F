# Mantra Character Asset Audit

Date: 2026-10-28

## Processing summary

- Source images inspected: 25
- Transparent normalized copies created: 25
- Backgrounds auto-extracted: 25
- Original source files overwritten: 0
- Shared output canvas: 512 × 512 PNG with transparent background
- Extraction method: local corner-connected background removal, then high-quality Lanczos resampling
- Manual review required: inspect all 25 outputs for halos and fine-edge loss before production use; automatic extraction is not claimed perfect

Processed copies live in `public/images/characters/processed/`. Original files remain in `public/models/characters/`.

## Mapping

`src/data/character-assets.ts` now maps verified image-backed characters to processed PNG paths. GLB-associated characters use processed 2D images in 2D cards when a matching source image exists; GLBs remain available through `CharacterModel` for 3D contexts.

| Identifier | Character | Source | Processed image | Status |
|---|---|---|---|---|
| `spider` | Spider-Man | `public/models/characters/spiderman.jpg` | `/images/characters/processed/spiderman.png` | Mapped; GLB-associated |
| `iron` | Iron Man | `public/models/characters/ironman.jpg` | `/images/characters/processed/ironman.png` | Mapped; GLB-associated |
| `widow` | Black Widow | `public/models/characters/BlackWidow.jpg` | `/images/characters/processed/blackwidow.png` | Mapped |
| `shield` | Captain America | `public/models/characters/captain america.jpg` | `/images/characters/processed/captain-america.png` | Mapped; GLB-associated |
| `thor` | Thor | `public/models/characters/thor.jpg` | `/images/characters/processed/thor.png` | Mapped |
| `shuri` | Shuri | `public/models/characters/shuri.jpg` | `/images/characters/processed/shuri.png` | Mapped |
| `barbie` | Barbie | `public/models/characters/barbie.jpg` | `/images/characters/processed/barbie.png` | Mapped |
| `princess` | Princess Barbie | `public/models/characters/barbie princess.jpg` | `/images/characters/processed/barbie-princess.png` | Mapped |
| `mermaid` | Mermaid Barbie | `public/models/characters/barbie mermaid.jpg` | `/images/characters/processed/barbie-mermaid.png` | Mapped |
| `artist` | Artist Barbie | `public/models/characters/barbie artist.jpg` | `/images/characters/processed/barbie-artist.png` | Mapped |
| `kitty` | Hello Kitty | `public/models/characters/hello kitty.jpg` | `/images/characters/processed/hello-kitty.png` | Mapped |
| `kuromi` | Kuromi | `public/models/characters/kuromi.jpg` | `/images/characters/processed/kuromi.png` | Mapped |
| `melody` | My Melody | `public/models/characters/my melody.jpg` | `/images/characters/processed/my-melody.png` | Mapped |
| `cinnamoroll` | Cinnamoroll | `public/models/characters/cinnamoroll.jpg` | `/images/characters/processed/cinnamoroll.png` | Mapped |
| `pompom` | Pompompurin | `public/models/characters/pompompurin.png` | `/images/characters/processed/pompompurin.png` | Mapped |
| `keroppi` | Keroppi | `public/models/characters/kerropi.png` | `/images/characters/processed/kerropi.png` | Mapped |
| `batman` | Batman | `public/models/characters/batman.jpg` | `/images/characters/processed/batman.png` | Mapped; GLB-associated |
| `super` | Superman | `public/models/characters/superman.jpg` | `/images/characters/processed/superman.png` | Mapped; GLB-associated |
| `rapunzel` | Rapunzel | `public/models/characters/rapunzel.jpg` | `/images/characters/processed/rapunzel.png` | Mapped |
| `cinderella` | Cinderella | `public/models/characters/cinderella.jpg` | `/images/characters/processed/cinderella.png` | Mapped |
| `moana` | Moana | `public/models/characters/moana.jpg` | `/images/characters/processed/moana.png` | Mapped |
| `belle` | Belle | `public/models/characters/belle.jpg` | `/images/characters/processed/belle.png` | Mapped |
| `tiana` | Tiana | `public/models/characters/tiana.jpg` | `/images/characters/processed/tiana.png` | Mapped |
| `mulan` | Mulan | `public/models/characters/mulan.jpg` | `/images/characters/processed/mulan.png` | Mapped |
| `space` | Astronaut Barbie | None | None | Missing source image |
| `batgirl` | Batgirl | None | None | Missing source image |
| `block` | Block Builder, Cave Explorer, Garden Keeper | None | None | Missing source image |

## Remote Storage verification — 2026-10-28

- Private Supabase bucket: `mantra-character-assets`.
- Uploaded 24 processed PNGs under `characters/processed/`.
- Uploaded 6 GLBs under `characters/models/`.
- Authenticated object listing verified 24 processed images and 6 models.
- Authenticated retrieval verified `characters/processed/barbie.png` (HTTP 200, `image/png`, 143841 bytes).
- Local assets remain source and rollback copies; no local asset was deleted or overwritten.

## Verification notes

- Every processed file is a real local PNG and uses transparency around the extracted subject.
- Source names were matched against existing character names and visual identity; no substitutions were made.
- `Astronaut Barbie`, `Batgirl`, and the three Minecraft selections have no source image in the inspected directory.
- Automated corner extraction can miss complex background regions or create edge halos. These files require visual QA before claiming production-perfect cleanup.
- `index (2).html` was not modified.
