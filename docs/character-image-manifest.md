# Character image manifest

The selector is ready to use static PNG artwork from `public/images/characters/`.
No matching character image files were present in the workspace when this
manifest was prepared, so every entry currently has `imageExists: false` and
continues using its existing selector appearance. The supplied GLB files remain
untouched.

| Universe | Character | Expected file | Exists | Integrated |
| --- | --- | --- | --- | --- |
| Avengers | Spider-Man | `spider-man.png` | No | No |
| Avengers | Iron Man | `iron-man.png` | No | No |
| Avengers | Black Widow | `black-widow.png` | No | No |
| Avengers | Captain America | `captain-america.png` | No | No |
| Avengers | Thor | `thor.png` | No | No |
| Avengers | Shuri | `shuri.png` | No | No |
| Barbie | Barbie | `barbie.png` | No | No |
| Barbie | Princess Barbie | `princess-barbie.png` | No | No |
| Barbie | Astronaut Barbie | `astronaut-barbie.png` | No | No |
| Barbie | Mermaid Barbie | `mermaid-barbie.png` | No | No |
| Barbie | Artist Barbie | `artist-barbie.png` | No | No |
| Sanrio | Hello Kitty | `hello-kitty.png` | No | No |
| Sanrio | Kuromi | `kuromi.png` | No | No |
| Sanrio | My Melody | `my-melody.png` | No | No |
| Sanrio | Cinnamoroll | `cinnamoroll.png` | No | No |
| Sanrio | Pompompurin | `pompompurin.png` | No | No |
| Sanrio | Keroppi | `keroppi.png` | No | No |
| DC Heroes | Batman | `batman.png` | No | No |
| DC Heroes | Superman | `superman.png` | No | No |
| DC Heroes | Wonder Woman | `wonder-woman.png` | No | No |
| DC Heroes | Batgirl | `batgirl.png` | No | No |
| Disney Princesses | Rapunzel | `rapunzel.png` | No | No |
| Disney Princesses | Cinderella | `cinderella.png` | No | No |
| Disney Princesses | Moana | `moana.png` | No | No |
| Disney Princesses | Belle | `belle.png` | No | No |
| Disney Princesses | Tiana | `tiana.png` | No | No |
| Disney Princesses | Mulan | `mulan.png` | No | No |
| Minecraft | Block Builder | `block-builder.png` | No | No |
| Minecraft | Cave Explorer | `cave-explorer.png` | No | No |
| Minecraft | Garden Keeper | `garden-keeper.png` | No | No |

When an approved image is added, set that character's `imageExists` flag to
`true` in `src/data/character-assets.ts`. The selector will use the image with
containment, lazy loading and transparency preserved.
