export type CharacterAsset = {
  universe: string;
  name: string;
  kind: string;
  visualNotes: string;
  imageFile: string;
  imagePath: string;
  imageExists: boolean;
  source: "original-css-demo" | "provided-local-glb";
  licensing: "review-required-before-commercial-use" | "CC-BY-4.0";
  modelFile?: string;
  modelAttribution?: string;
};

const characters: Array<[string, string, string, string]> = [
  ["Avengers", "Spider-Man", "spider", "red-and-blue suit; web hero silhouette"],
  ["Avengers", "Iron Man", "iron", "red-and-gold armored suit; helmet-inspired head detail"],
  ["Avengers", "Black Widow", "widow", "dark suit; red accent; long hair silhouette"],
  ["Avengers", "Captain America", "shield", "blue suit; light chest detail; shield-inspired accent"],
  ["Avengers", "Thor", "thor", "blue-and-gold hero palette; long-hair silhouette"],
  ["Avengers", "Shuri", "shuri", "dark-and-purple inventive hero palette"],
  ["Barbie", "Barbie", "barbie", "pink fashion silhouette; long-hair styling"],
  ["Barbie", "Princess Barbie", "princess", "lavender gown-inspired palette; crown detail"],
  ["Barbie", "Astronaut Barbie", "space", "blue-and-white explorer palette; space detail"],
  ["Barbie", "Mermaid Barbie", "mermaid", "aqua-and-lilac ocean palette"],
  ["Barbie", "Artist Barbie", "artist", "pink-and-lilac creative palette"],
  ["Sanrio", "Hello Kitty", "kitty", "white cat-ear head detail; pink accent"],
  ["Sanrio", "Kuromi", "kuromi", "dark palette; purple-and-pink ear detail"],
  ["Sanrio", "My Melody", "melody", "pink hood-inspired head detail"],
  ["Sanrio", "Cinnamoroll", "cinnamoroll", "blue-and-white soft companion palette"],
  ["Sanrio", "Pompompurin", "pompom", "golden palette; beret-inspired detail"],
  ["Sanrio", "Keroppi", "keroppi", "green palette; frog-inspired face detail"],
  ["DC Heroes", "Batman", "batman", "black-and-gold palette; bat-inspired cowl detail"],
  ["DC Heroes", "Superman", "super", "blue-and-red palette; chest emblem detail"],
  ["DC Heroes", "Wonder Woman", "wonder", "red-and-gold hero palette"],
  ["DC Heroes", "Batgirl", "batgirl", "dark-and-purple palette; bat-inspired detail"],
  ["Disney Princesses", "Rapunzel", "princess", "lavender-and-gold palette; long-hair silhouette"],
  ["Disney Princesses", "Cinderella", "princess", "blue-and-white gown-inspired palette"],
  ["Disney Princesses", "Moana", "princess", "coral-and-teal explorer palette"],
  ["Disney Princesses", "Belle", "princess", "gold-and-brown book-lover palette"],
  ["Disney Princesses", "Tiana", "princess", "green-and-gold palette"],
  ["Disney Princesses", "Mulan", "princess", "red-and-pink warrior palette"],
  ["Minecraft", "Block Builder", "block", "green block-builder palette"],
  ["Minecraft", "Cave Explorer", "block", "slate-and-blue explorer palette"],
  ["Minecraft", "Garden Keeper", "block", "green garden palette"],
];

const providedModels: Record<string, Pick<CharacterAsset, "modelFile" | "modelAttribution" | "source" | "licensing">> = {
  "Spider-Man": {
    modelFile: "lego_spiderman.glb",
    modelAttribution: "Ji3D — Lego Spiderman (CC BY 4.0)",
    source: "provided-local-glb",
    licensing: "CC-BY-4.0",
  },
  "Iron Man": {
    modelFile: "lego_iron_man.glb",
    modelAttribution: "Lego Mania — LEGO Iron Man (CC BY 4.0)",
    source: "provided-local-glb",
    licensing: "CC-BY-4.0",
  },
  "Captain America": {
    modelFile: "LEGO_-_Captain_America_(Avengers_1).glb",
    modelAttribution: "Local GLB metadata identifies Captain America; licence requires confirmation from the source page.",
    source: "provided-local-glb",
    licensing: "review-required-before-commercial-use",
  },
  Batman: {
    modelFile: "lego_batman_minifigure.glb",
    modelAttribution: "Neut2000 — Lego Batman Minifigure (CC BY 4.0)",
    source: "provided-local-glb",
    licensing: "CC-BY-4.0",
  },
  Superman: {
    modelFile: "superman_lego.glb",
    modelAttribution: "gustavo.silvas1986 — Superman Lego (CC BY 4.0)",
    source: "provided-local-glb",
    licensing: "CC-BY-4.0",
  },
};

const characterImageFiles: Record<string, string> = {
  "Spider-Man": "spider-man.png",
  "Iron Man": "iron-man.png",
  "Black Widow": "black-widow.png",
  "Captain America": "captain-america.png",
  Thor: "thor.png",
  Shuri: "shuri.png",
  Barbie: "barbie.png",
  "Princess Barbie": "princess-barbie.png",
  "Astronaut Barbie": "astronaut-barbie.png",
  "Mermaid Barbie": "mermaid-barbie.png",
  "Artist Barbie": "artist-barbie.png",
  "Hello Kitty": "hello-kitty.png",
  Kuromi: "kuromi.png",
  "My Melody": "my-melody.png",
  Cinnamoroll: "cinnamoroll.png",
  Pompompurin: "pompompurin.png",
  Keroppi: "keroppi.png",
  Batman: "batman.png",
  Superman: "superman.png",
  "Wonder Woman": "wonder-woman.png",
  Batgirl: "batgirl.png",
  Rapunzel: "rapunzel.png",
  Cinderella: "cinderella.png",
  Moana: "moana.png",
  Belle: "belle.png",
  Tiana: "tiana.png",
  Mulan: "mulan.png",
  "Block Builder": "block-builder.png",
  "Cave Explorer": "cave-explorer.png",
  "Garden Keeper": "garden-keeper.png",
};

export const characterAssets: CharacterAsset[] = characters.map(([universe, name, kind, visualNotes]) => ({
  universe,
  name,
  kind,
  visualNotes,
  imageFile: characterImageFiles[name],
  imagePath: `/images/characters/processed/${characterImageFiles[name].replace(/\.png$/i, "").replace("black-widow", "blackwidow").replace("iron-man", "ironman").replace("captain-america", "captain-america").replace("keroppi", "kerropi")}.png`,
  imageExists: ["Spider-Man", "Iron Man", "Black Widow", "Captain America", "Thor", "Shuri", "Barbie", "Princess Barbie", "Astronaut Barbie", "Mermaid Barbie", "Artist Barbie", "Hello Kitty", "Kuromi", "My Melody", "Cinnamoroll", "Pompompurin", "Keroppi", "Batman", "Superman", "Rapunzel", "Cinderella", "Moana", "Belle", "Tiana", "Mulan"].includes(name),
  ...(providedModels[name] ?? {
    source: "original-css-demo" as const,
    licensing: "review-required-before-commercial-use" as const,
  }),
}));

export const unmatchedProvidedModels = [
  {
    file: "steve_minecraft.glb",
    embeddedTitle: "steve minecraft",
    reason: "The existing selections are Block Builder, Cave Explorer, and Garden Keeper. No existing character is named Steve, so this file is not guessed-matched.",
    licensing: "CC-BY-4.0",
  },
] as const;
