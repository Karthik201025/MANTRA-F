import type { CameraState, GameAssets } from "./types";

export function drawFallbackCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.fillStyle = "#f5c9a8"; ctx.beginPath(); ctx.arc(x, y - 22 * scale, 8 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#5b4b8a"; ctx.fillRect(x - 8 * scale, y - 14 * scale, 16 * scale, 18 * scale);
  ctx.fillStyle = "#293b70"; ctx.fillRect(x - 7 * scale, y + 4 * scale, 6 * scale, 14 * scale); ctx.fillRect(x + 1 * scale, y + 4 * scale, 6 * scale, 14 * scale);
  ctx.strokeStyle = "#26314d"; ctx.lineWidth = 2 * scale; ctx.strokeRect(x - 8 * scale, y - 14 * scale, 16 * scale, 18 * scale);
}

export function drawCollectible(ctx: CanvasRenderingContext2D, x: number, y: number, radius = 7) {
  ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#9d5c2a"; ctx.stroke();
}

export function drawPixelTerrain(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = "#6b8e62"; ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#a9cf8b"; ctx.fillRect(x, y, width, Math.min(8, height));
}

export function drawParticleBurst(ctx: CanvasRenderingContext2D, x: number, y: number, color = "#ffd166") {
  ctx.fillStyle = color;
  for (let i = 0; i < 6; i += 1) { const a = i * Math.PI / 3; ctx.fillRect(x + Math.cos(a) * 12, y + Math.sin(a) * 12, 3, 3); }
}

export function drawSprite(ctx: CanvasRenderingContext2D, assets: GameAssets, id: string, x: number, y: number, width: number, height: number) {
  const image = assets.get(id); if (image) ctx.drawImage(image, x, y, width, height);
}

export function drawSpriteFrame(ctx: CanvasRenderingContext2D, assets: GameAssets, id: string, x: number, y: number, width: number, height: number, frame: number, frames: number) {
  const image = assets.get(id); if (!image) return;
  const frameWidth = image.width / frames; ctx.drawImage(image, frame * frameWidth, 0, frameWidth, image.height, x, y, width, height);
}

export function drawLayer(ctx: CanvasRenderingContext2D, camera: CameraState, color: string, draw: () => void) {
  ctx.save(); ctx.translate(-camera.x, -camera.y); ctx.fillStyle = color; draw(); ctx.restore();
}
