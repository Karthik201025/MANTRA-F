import type { CameraState } from "./types";

export function followCamera(target: { x: number; y: number }, viewport: { width: number; height: number }, world: { width: number; height: number }): CameraState {
  return {
    x: Math.max(0, Math.min(world.width - viewport.width, target.x - viewport.width / 2)),
    y: Math.max(0, Math.min(world.height - viewport.height, target.y - viewport.height / 2)),
    width: viewport.width,
    height: viewport.height,
  };
}
