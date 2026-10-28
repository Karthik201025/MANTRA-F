import type { GameAssetDefinition, GameAssets } from "./types";

export const gameAssets: GameAssetDefinition[] = [
  { id: "player-fallback", kind: "procedural", width: 32, height: 48 },
  { id: "terrain-fallback", kind: "procedural" },
  { id: "collectible-fallback", kind: "procedural", width: 16, height: 16 },
];

export async function loadGameAssets(definitions: GameAssetDefinition[] = gameAssets): Promise<{ status: "ready" | "partial"; assets: GameAssets; failures: string[] }> {
  const assets: GameAssets = new Map();
  const failures: string[] = [];
  await Promise.all(definitions.map(async (definition) => {
    if (definition.kind === "procedural" || !definition.src) return;
    try {
      const image = new Image();
      image.src = definition.src;
      await image.decode();
      assets.set(definition.id, image);
    } catch {
      failures.push(definition.id);
    }
  }));
  return { status: failures.length ? "partial" : "ready", assets, failures };
}

export function getAssetDefinition(id: string) {
  return gameAssets.find((asset) => asset.id === id);
}
