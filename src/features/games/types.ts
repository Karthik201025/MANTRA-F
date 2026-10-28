export type GameId =
  | "Patience Garden"
  | "Cloud Sorter"
  | "Grounding Explorer"
  | "Comfort Room"
  | "Meteor Mender"
  | "Tiny Step Trail"
  | "Story Quest";

export type GamePhase = "start" | "loading" | "playing" | "paused" | "complete" | "defeat";
export type InputState = { left: boolean; right: boolean; jump: boolean; action: boolean; pointer?: { x: number; y: number } };
export type CameraState = { x: number; y: number; width: number; height: number };
export type GameAssetDefinition = { id: string; src?: string; kind: "image" | "procedural"; width?: number; height?: number; frames?: number; frameMs?: number };
export type GameAssets = Map<string, HTMLImageElement>;
export type GameAdapter<T = unknown> = {
  id: GameId;
  world: { width: number; height: number };
  initialState: () => T;
  update: (state: T, input: InputState, dt: number) => T;
  draw: (ctx: CanvasRenderingContext2D, state: T, assets: GameAssets, camera: CameraState) => void;
  isComplete: (state: T) => boolean;
  isDefeated: (state: T) => boolean;
};
