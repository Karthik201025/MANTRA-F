"use client";

import { useCallback, useMemo, useState } from "react";
import type { GameId, GamePhase } from "./types";
import { GameCanvas } from "./GameCanvas";
import type { GameAdapter } from "./types";

export type GameSurfaceProps<T> = {
  gameId: GameId;
  adapter: GameAdapter<T>;
  onExit: () => void;
};

export function GameSurface<T>({ gameId, adapter, onExit }: GameSurfaceProps<T>) {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const displayPhase = paused ? "paused" : phase;
  const restart = useCallback(() => { setRun((value) => value + 1); setScore(0); setPaused(false); setPhase("playing"); }, []);
  const title = useMemo(() => gameId === "Tiny Step Trail" ? "Take one small step" : gameId, [gameId]);

  return <section className="game-surface game-card" aria-label={`${gameId} playable game`}>
    <div className="game-surface-header"><div><div className="eyebrow">PLAY TOGETHER · {gameId.toUpperCase()}</div><h3>{title}</h3><p className="muted">Keyboard: arrows or A/D to move, W/Space to jump, E to interact.</p></div><div className="game-hud" aria-live="polite"><span>Score {score}</span><span>{displayPhase.toUpperCase()}</span></div></div>
    {phase === "start" && <div className="game-overlay"><p>Ready for a gentle challenge?</p><button className="pixel-btn pink" onClick={() => setPhase("playing")}>START GAME</button></div>}
    {phase === "playing" && <GameCanvas key={run} adapter={adapter} phase={displayPhase} onStateChange={(state) => { const candidate = state as { score?: number }; if (typeof candidate.score === "number") setScore(candidate.score); }} onComplete={() => setPhase("complete")} onDefeat={() => setPhase("defeat")} />}
    {phase === "paused" && <div className="game-overlay"><p>Game paused. Take your time.</p><button className="pixel-btn pink" onClick={() => setPaused(false)}>RESUME</button></div>}
    {phase === "complete" && <div className="game-overlay"><p>Quest complete. Nice work.</p><button className="pixel-btn pink" onClick={restart}>PLAY AGAIN</button></div>}
    {phase === "defeat" && <div className="game-overlay"><p>That round ended. Nothing is lost.</p><button className="pixel-btn pink" onClick={restart}>TRY AGAIN</button></div>}
    <div className="button-row game-controls"><button className="pixel-btn dark" onClick={() => setPaused((value) => !value)} disabled={phase !== "playing"}>{paused ? "RESUME" : "PAUSE"}</button><button className="pixel-btn dark" onClick={onExit}>EXIT GAME</button></div>
  </section>;
}
