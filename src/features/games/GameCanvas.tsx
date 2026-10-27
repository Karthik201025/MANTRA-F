"use client";

import { useEffect, useRef, useState } from "react";
import type { GameAdapter, GameAssets, GamePhase, InputState } from "./types";
import { loadGameAssets } from "./assets";
import { followCamera } from "./camera";

export type GameCanvasProps<T> = {
  adapter: GameAdapter<T>;
  phase: GamePhase;
  onStateChange?: (state: T) => void;
  onComplete?: () => void;
  onDefeat?: () => void;
};

const EMPTY_INPUT: InputState = { left: false, right: false, jump: false, action: false };

export function GameCanvas<T>({ adapter, phase, onStateChange, onComplete, onDefeat }: GameCanvasProps<T>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(adapter.initialState());
  const inputRef = useRef<InputState>({ ...EMPTY_INPUT });
  const assetsRef = useRef<GameAssets>(new Map());
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const [assetStatus, setAssetStatus] = useState<"loading" | "ready" | "partial" | "error">("loading");
  const [failures, setFailures] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    loadGameAssets().then((result) => {
      if (!active) return;
      assetsRef.current = result.assets;
      setFailures(result.failures);
      setAssetStatus(result.failures.length ? "partial" : "ready");
    }).catch(() => {
      if (active) setAssetStatus("error");
    });
    return () => { active = false; };
  }, [adapter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setKey = (event: KeyboardEvent, pressed: boolean) => {
      const key = event.key.toLowerCase();
      if (!["arrowleft", "arrowright", "arrowup", " ", "a", "d", "w", "e"].includes(key)) return;
      event.preventDefault();
      inputRef.current = { ...inputRef.current,
        left: key === "arrowleft" || key === "a" ? pressed || inputRef.current.left : inputRef.current.left,
        right: key === "arrowright" || key === "d" ? pressed || inputRef.current.right : inputRef.current.right,
        jump: key === "arrowup" || key === "w" || key === " " ? pressed || inputRef.current.jump : inputRef.current.jump,
        action: key === "e" ? pressed || inputRef.current.action : inputRef.current.action,
      };
      if (!pressed) {
        if (key === "arrowleft" || key === "a") inputRef.current.left = false;
        if (key === "arrowright" || key === "d") inputRef.current.right = false;
        if (key === "arrowup" || key === "w" || key === " ") inputRef.current.jump = false;
        if (key === "e") inputRef.current.action = false;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => setKey(event, true);
    const onKeyUp = (event: KeyboardEvent) => setKey(event, false);
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      inputRef.current.pointer = { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) };
      inputRef.current.action = true;
    };
    const onPointerUp = () => { inputRef.current.action = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointer);
    window.addEventListener("pointerup", onPointerUp);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); canvas.removeEventListener("pointerdown", onPointer); window.removeEventListener("pointerup", onPointerUp); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== "playing" || assetStatus === "loading" || assetStatus === "error") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    const tick = (time: number) => {
      const previous = lastTimeRef.current ?? time;
      const dt = Math.min(0.05, Math.max(0, (time - previous) / 1000));
      lastTimeRef.current = time;
      stateRef.current = adapter.update(stateRef.current, inputRef.current, dt);
      onStateChange?.(stateRef.current);
      const rect = canvas.getBoundingClientRect();
      const camera = followCamera({ x: 0, y: 0 }, { width: rect.width, height: rect.height }, adapter.world);
      ctx.clearRect(0, 0, rect.width, rect.height);
      adapter.draw(ctx, stateRef.current, assetsRef.current, camera);
      if (adapter.isComplete(stateRef.current)) onComplete?.();
      else if (adapter.isDefeated(stateRef.current)) onDefeat?.();
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null; observer?.disconnect(); lastTimeRef.current = null; };
  }, [adapter, assetStatus, onComplete, onDefeat, onStateChange, phase]);

  return <div className="game-canvas-wrap">
    <canvas ref={canvasRef} className="game-canvas" aria-label={`${adapter.id} game canvas`} />
    {assetStatus === "loading" && <p className="game-status" role="status">Loading game art…</p>}
    {assetStatus === "partial" && <p className="game-status" role="status">Fallback art active{failures.length ? `: ${failures.join(", ")}` : ""}.</p>}
    {assetStatus === "error" && <p className="game-status" role="alert">Game art failed to load. Replay to try again.</p>}
    <p className="game-fallback-label">Procedural fallback artwork</p>
  </div>;
}
