import type { CSSProperties } from "react";

// Purple lightning from Killua's two hands, drawn as SVG paths. The viewBox is the picture's
// own pixel grid (736×494), so the hands stay at the same spot at any size; the bolts reach
// past the edges of the picture (overflow: visible) towards the text panels: up-left for
// the first hand (About), up-right for the second (Journey). Each group is drawn by the
// scroll (--h1, --h2 set by StoryScene; bolt-* rules in globals.css).

/** Where the hands are on the picture. */
export const HANDS = [
  { x: 150, y: 385 },
  { x: 570, y: 300 },
] as const;

/** Bolt endpoints, in picture pixels, for each hand. */
const TARGETS: [number, number][][] = [
  [
    [-40, 130],
    [60, -90],
    [-150, 280],
    [210, 20],
    [-80, -20],
  ],
  [
    [700, 70],
    [610, -100],
    [820, 230],
    [780, -40],
    [500, 10],
  ],
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
function bolt(hand: Point, target: Point, seed: number) {
  const rand = random(seed);
  const main = jagged(hand, target, rand, 12, 0.1);
  const forks = [0.35, 0.62].map((at) => {
    const start = main[Math.round(at * (main.length - 1))];
    const angle = Math.atan2(target[1] - hand[1], target[0] - hand[0]) + (rand() - 0.5) * 1.6;
    const length = Math.hypot(target[0] - hand[0], target[1] - hand[1]) * (0.18 + rand() * 0.15);
    const end: Point = [start[0] + Math.cos(angle) * length, start[1] + Math.sin(angle) * length];
    return toPath(jagged(start, end, rand, 6, 0.14));
  });
  return [toPath(main), ...forks];
}

const BOLTS = HANDS.map((hand, h) =>
  TARGETS[h].map((target, i) => bolt([hand.x, hand.y], target, 11 + h * 50 + i * 7)),
);

/** Three strokes per path: a wide violet glow, a lilac body and a white-hot core. */
const LAYERS = [
  { stroke: "#a855f7", width: 11, opacity: 0.25 },
  { stroke: "#c4b5fd", width: 4, opacity: 0.85 },
  { stroke: "#faf5ff", width: 1.6, opacity: 1 },
];

export function Lightning({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 736 494"
      className={`pointer-events-none absolute inset-0 size-full overflow-visible ${className ?? ""}`}
    >
      {BOLTS.map((bolts, h) => (
        <g key={h} className={`bolts bolts-${h + 1}`}>
          {bolts.map((paths, b) => (
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
        </g>
      ))}
    </svg>
  );
}
