export type SpriteAnimation = { frames: number; frameMs: number; loop?: boolean; paused?: boolean };

export function advanceAnimation(animation: SpriteAnimation, elapsedMs: number) {
  if (animation.paused || animation.frames < 1 || animation.frameMs <= 0) return { frame: 0, elapsed: elapsedMs };
  const total = animation.frames * animation.frameMs;
  const elapsed = animation.loop === false ? Math.min(elapsedMs, total - 1) : elapsedMs % total;
  return { frame: Math.floor(elapsed / animation.frameMs), elapsed };
}
