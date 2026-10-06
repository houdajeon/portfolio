import type { CSSProperties } from "react";

// Lightning bolts from Killua's hand towards the About text, drawn as SVG paths. The
// viewBox is the poster's own pixel grid (736×875), so the hand stays at the same spot at
// any size; the bolts reach past the poster's right edge (overflow: visible) into the text
// column. Each path is drawn by the scroll (bolt-* in globals.css, driven by AboutScene).

/** Where the hand is on the poster (it is just below the frame, at the end of the arm). */
export const HAND = { x: 575, y: 790 };

/** Endpoints, in poster pixels: up towards the title, across the text, down to the facts. */
const TARGETS = [
  [900, 40],
  [1260, -60],
  [1010, 380],
  [1520, 300],
  [930, 760],
  [1380, 880],
];

/** Small seeded random generator, so the bolts are the same on every build and visit. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Point = [number, number];

/** A jagged line: points along the straight line, pushed sideways, most in the middle. */
function jagged(from: Point, to: Point, rand: () => number, steps: number, spread: number) {
  const [x1, y1] = from;
  const [dx, dy] = [to[0] - x1, to[1] - y1];
  const length = Math.hypot(dx, dy);
  const [nx, ny] = [-dy / length, dx / length];
  const points: Point[] = [from];
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const offset = (rand() - 0.5) * 2 * spread * length * Math.sin(Math.PI * t);
    points.push([x1 + dx * t + nx * offset, y1 + dy * t + ny * offset]);
  }
  points.push(to);
  return points;
}

const toPath = (points: Point[]) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

/** One bolt and its forks, as SVG path strings. */
function bolt(target: Point, seed: number) {
  const rand = random(seed);
  const main = jagged([HAND.x, HAND.y], target, rand, 14, 0.09);
  const forks = [0.35, 0.6].map((at) => {
    const start = main[Math.round(at * (main.length - 1))];
    const angle = Math.atan2(target[1] - HAND.y, target[0] - HAND.x) + (rand() - 0.5) * 1.6;
    const length = Math.hypot(target[0] - HAND.x, target[1] - HAND.y) * (0.18 + rand() * 0.15);
    const end: Point = [start[0] + Math.cos(angle) * length, start[1] + Math.sin(angle) * length];
    return toPath(jagged(start, end, rand, 6, 0.14));
  });
  return [toPath(main), ...forks];
}

const BOLTS = TARGETS.map((target, i) => bolt(target as Point, 11 + i * 7));

/** Three strokes per path: a wide soft glow, a blue body and a white-hot core. */
const LAYERS = [
  { stroke: "#818cf8", width: 12, opacity: 0.22 },
  { stroke: "#a5b4fc", width: 4.4, opacity: 0.8 },
  { stroke: "#ffffff", width: 1.8, opacity: 1 },
];

export function Lightning({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 736 875"
      className={`pointer-events-none absolute inset-0 size-full overflow-visible ${className ?? ""}`}
    >
      {BOLTS.map((paths, b) => (
        <g key={b} className="bolt" style={{ "--b": b } as CSSProperties}>
          {LAYERS.map((layer) =>
            paths.map((d, p) => (
              <path
                key={`${layer.width}-${p}`}
                d={d}
                pathLength={1}
                fill="none"
                stroke={layer.stroke}
                strokeWidth={p ? layer.width * 0.6 : layer.width}
                strokeOpacity={layer.opacity}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )),
          )}
        </g>
      ))}
    </svg>
  );
}
