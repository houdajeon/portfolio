import type { CSSProperties } from "react";
import { seeded } from "./flower";

const COLORS = ["#a78bfa", "#f472b6", "#fde68a", "#c4b5fd"];
const random = seeded(7);
/** Fireflies: position (%), drift (px), timing (s). Seeded, so every build is the same. */
const FIREFLIES = Array.from({ length: 20 }, (_, i) => ({
  left: 2 + random() * 96,
  top: 4 + random() * 92,
  color: COLORS[i % COLORS.length],
  time: 5 + random() * 5,
  delay: -random() * 8,
  dx: Math.round(-60 + random() * 120),
  dy: Math.round(-50 + random() * 100),
}));

/** A night garden behind the Community section: a crescent moon and drifting fireflies. */
export function NightSky() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="night-moon" />
      {FIREFLIES.map((fly, i) => (
        <span
          key={i}
          className="firefly"
          style={
            {
              left: `${fly.left.toFixed(1)}%`,
              top: `${fly.top.toFixed(1)}%`,
              "--c": fly.color,
              "--t": `${fly.time.toFixed(1)}s`,
              "--delay": `${fly.delay.toFixed(1)}s`,
              "--dx": `${fly.dx}px`,
              "--dy": `${fly.dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
