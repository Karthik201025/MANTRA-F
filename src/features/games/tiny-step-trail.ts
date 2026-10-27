import type { GameAdapter } from "./types";
import { drawCollectible, drawFallbackCharacter, drawPixelTerrain } from "./rendering";
import { followCamera } from "./camera";

export type TinyStepTrailState = {
  player: { x: number; y: number; vx: number; vy: number; grounded: boolean };
  platforms: { x: number; y: number; width: number; height: number }[];
  collectibles: { x: number; y: number; collected: boolean }[];
  score: number;
  lives: number;
  goal: { x: number; y: number; width: number; height: number };
};

const WORLD = { width: 1800, height: 720 };
const START = { x: 90, y: 560 };

export function createTinyStepTrailState(): TinyStepTrailState {
  return {
    player: { ...START, vx: 0, vy: 0, grounded: false },
    platforms: [
      { x: 0, y: 640, width: 1800, height: 80 },
      { x: 280, y: 520, width: 180, height: 24 },
      { x: 590, y: 440, width: 180, height: 24 },
      { x: 930, y: 540, width: 220, height: 24 },
      { x: 1300, y: 450, width: 200, height: 24 },
    ],
    collectibles: [
      { x: 350, y: 480, collected: false },
      { x: 670, y: 400, collected: false },
      { x: 1020, y: 500, collected: false },
      { x: 1390, y: 410, collected: false },
    ],
    score: 0,
    lives: 3,
    goal: { x: 1660, y: 560, width: 44, height: 80 },
  };
}

export const tinyStepTrailAdapter: GameAdapter<TinyStepTrailState> = {
  id: "Tiny Step Trail",
  world: WORLD,
  initialState: createTinyStepTrailState,
  update: (state, input, rawDt) => {
    const dt = Math.min(0.05, Math.max(0, rawDt));
    const player = { ...state.player };
    player.vx = (input.left ? -190 : 0) + (input.right ? 190 : 0);
    if (input.jump && player.grounded) { player.vy = -390; player.grounded = false; }
    player.vy += 980 * dt;
    const previousBottom = player.y + 48;
    player.x = Math.max(16, Math.min(WORLD.width - 16, player.x + player.vx * dt));
    player.y += player.vy * dt;
    player.grounded = false;
    for (const platform of state.platforms) {
      const overlaps = player.x + 14 > platform.x && player.x - 14 < platform.x + platform.width;
      if (overlaps && previousBottom <= platform.y && player.y + 48 >= platform.y && player.vy >= 0) {
        player.y = platform.y - 48; player.vy = 0; player.grounded = true;
      }
    }
    let score = state.score;
    const collectibles = state.collectibles.map((item) => {
      if (!item.collected && Math.hypot(item.x - player.x, item.y - (player.y + 20)) < 30) { score += 1; return { ...item, collected: true }; }
      return item;
    });
    let lives = state.lives;
    if (player.y > WORLD.height + 80) { lives -= 1; player.x = START.x; player.y = START.y; player.vx = 0; player.vy = 0; }
    return { ...state, player, collectibles, score, lives };
  },
  draw: (ctx, state, assets, cameraViewport) => {
    const camera = followCamera(state.player, { width: cameraViewport.width, height: cameraViewport.height }, WORLD);
    ctx.fillStyle = "#a9d8ee"; ctx.fillRect(0, 0, camera.width, camera.height);
    ctx.save(); ctx.translate(-camera.x, -camera.y);
    ctx.fillStyle = "#d5f1e1"; ctx.fillRect(camera.x, camera.y, WORLD.width, WORLD.height);
    ctx.fillStyle = "#9ec7e8"; ctx.fillRect(camera.x, 0, WORLD.width, 220);
    for (const platform of state.platforms) drawPixelTerrain(ctx, platform.x, platform.y, platform.width, platform.height);
    for (const item of state.collectibles) if (!item.collected) drawCollectible(ctx, item.x, item.y);
    ctx.fillStyle = "#f4a8e7"; ctx.fillRect(state.goal.x, state.goal.y, state.goal.width, state.goal.height);
    drawFallbackCharacter(ctx, state.player.x, state.player.y + 48, 1.2);
    ctx.restore();
    void assets;
  },
  isComplete: (state) => state.score === state.collectibles.length && state.player.x >= state.goal.x - 30,
  isDefeated: (state) => state.lives <= 0,
};
