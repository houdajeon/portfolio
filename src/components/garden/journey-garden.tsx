"use client";

import { useRef, type CSSProperties } from "react";
import { useScrollFrame } from "@/components/ui/use-scroll-frame";
import { FLOWERS, type FlowerType } from "./defs";

type Point = [number, number];
type Curve = [Point, Point, Point, Point];

// The stem, top to bottom, in a 400 × 1000 box: five curves, each one starting in the
// direction the previous one ended, so the vine sways without any corner.
const STEM: Curve[] = [
  [
    [250, 0],
    [200, 60],
    [300, 140],
    [240, 200],
  ],
  [
    [240, 200],
    [180, 260],
    [320, 330],
    [250, 400],
  ],
  [
    [250, 400],
    [180, 470],
    [310, 530],
    [240, 600],
  ],
  [
    [240, 600],
    [170, 670],
    [320, 730],
    [250, 800],
  ],
  [
    [250, 800],
    [180, 870],
    [290, 920],
    [245, 960],
  ],
];
const STEM_PATH = `M${STEM[0][0].join(" ")}${STEM.map(
  ([, a, b, c]) => `C${a.join(" ")} ${b.join(" ")} ${c.join(" ")}`,
).join("")}`;

/** Point and direction (in degrees) on curve k of the stem, at t from 0 to 1. */
function on(k: number, t: number) {
  const [p0, p1, p2, p3] = STEM[k];
  const u = 1 - t;
  const point = (i: 0 | 1) =>
    u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
  const slope = (i: 0 | 1) =>
    3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]);
  return { x: point(0), y: point(1), angle: (Math.atan2(slope(1), slope(0)) * 180) / Math.PI };
}

const r = (n: number) => Math.round(n * 10) / 10;

/** Leaves along the stem, on alternate sides, pointing outwards and down the vine. */
const LEAVES = STEM.flatMap((_, k) =>
  [0.12, 0.37, 0.62, 0.87].map((t, j) => {
    const { x, y, angle } = on(k, t);
    const right = (k * 4 + j) % 2 === 0;
    return { x, y, rotate: right ? angle + 30 : angle + 150, scale: 0.7 + ((k + j) % 3) * 0.08 };
  }),
);

type Shoot = { k: number; t: number; side: 1 | -1; reach: number; type: FlowerType; scale: number };

/** Side shoots, each ending in a flower: where they start, which side, how far they reach. */
const SHOOT_SPOTS: Shoot[] = [
  { k: 0, t: 0.55, side: -1, reach: 95, type: "bl-violet", scale: 1 },
  { k: 1, t: 0.3, side: 1, reach: 85, type: "rose-pink", scale: 1.2 },
  { k: 1, t: 0.85, side: -1, reach: 150, type: "daisy", scale: 1 },
  { k: 2, t: 0.5, side: 1, reach: 90, type: "bl-pink", scale: 1.05 },
  { k: 3, t: 0.2, side: -1, reach: 125, type: "rose-plum", scale: 1.15 },
  { k: 3, t: 0.7, side: 1, reach: 85, type: "bl-violet", scale: 0.95 },
  { k: 4, t: 0.45, side: -1, reach: 140, type: "bl-plum", scale: 1 },
];
const SHOOTS = SHOOT_SPOTS.map((shoot) => {
  const { x, y } = on(shoot.k, shoot.t);
  const end = { x: x + shoot.side * shoot.reach, y: y + 18 };
  const bend = { x: x + shoot.side * shoot.reach * 0.55, y: y - 28 };
  // A leaf on the shoot, a little before the middle (quadratic curve at 0.45).
  const leaf = {
    x: 0.3025 * x + 0.495 * bend.x + 0.2025 * end.x,
    y: 0.3025 * y + 0.495 * bend.y + 0.2025 * end.y,
  };
  return {
    ...shoot,
    y,
    end,
    leaf,
    d: `M${r(x)} ${r(y)}Q${r(bend.x)} ${r(bend.y)} ${r(end.x)} ${r(end.y)}`,
  };
});

/** Small buds right on the stem. */
const BUD_SPOTS: { k: number; t: number; side: 1 | -1; type: FlowerType }[] = [
  { k: 0, t: 0.22, side: 1, type: "bud-pink" },
  { k: 2, t: 0.12, side: -1, type: "bud-violet" },
  { k: 2, t: 0.86, side: 1, type: "bud-plum" },
  { k: 4, t: 0.12, side: 1, type: "bud-violet" },
];
const BUDS = BUD_SPOTS.map((bud) => ({ ...bud, ...on(bud.k, bud.t) }));

const TIP = STEM[STEM.length - 1][3];

/** One flower centered on (0, 0) of its group: it opens, then sways. */
function Bloom({ type, swayDelay }: { type: FlowerType; swayDelay: number }) {
  const [bx, by, bw, bh] = FLOWERS[type].box;
  return (
    <g className="jg-bl">
      <g className="g-sw" style={{ "--swd": `-${swayDelay}s` } as CSSProperties}>
        <use href={`#${type}`} x={bx} y={by} width={bw} height={bh} />
      </g>
    </g>
  );
}

/**
 * A flowering vine behind the Journey section. It grows down the right side with the
 * reading line (60% of the screen height, like the stem in the timeline), and each leaf,
 * shoot and flower opens as the vine reaches it. It ends in a glowing bud: still growing.
 * Only on wide screens (see .jg in globals.css), where there is room beside the list.
 */
export function JourneyGarden() {
  const box = useRef<SVGSVGElement>(null);
  const stem = useRef<SVGPathElement>(null);
  // Height of the stem at each 1/200 of its length, measured once: turns "how far down the
  // reading line is" into "how much of the stem to draw".
  const heights = useRef<number[]>(null);

  useScrollFrame(() => {
    const svg = box.current;
    const path = stem.current;
    if (!svg || !path) return;
    const rect = svg.getBoundingClientRect();
    if (rect.height === 0) return; // hidden on small screens

    if (!heights.current) {
      const length = path.getTotalLength();
      heights.current = Array.from(
        { length: 201 },
        (_, i) => path.getPointAtLength((length * i) / 200).y,
      );
    }
    const ys = heights.current;
    // Where the reading line crosses the vine, in the 1000-unit height of the drawing.
    const line = ((innerHeight * 0.6 - rect.top) / rect.height) * 1000;
    let drawn = 1;
    if (line <= ys[0]) drawn = 0;
    else if (line < ys[200]) {
      let i = 1;
      while (ys[i] < line) i++;
      drawn = (i - 1 + (line - ys[i - 1]) / (ys[i] - ys[i - 1])) / 200;
    }

    svg.style.setProperty("--p", drawn.toFixed(4));
    svg.querySelectorAll<SVGGElement>("[data-y]").forEach((part) => {
      part.classList.toggle("is-open", line >= Number(part.dataset.y));
    });
  });

  return (
    <div aria-hidden="true" className="jg">
      <svg ref={box} viewBox="0 0 400 1000">
        <path ref={stem} className="jg-stem" pathLength={1} d={STEM_PATH} />

        {LEAVES.map((leaf, i) => (
          <g key={i} className="jg-part" data-y={Math.round(leaf.y)}>
            <g
              transform={`translate(${r(leaf.x)} ${r(leaf.y)}) rotate(${r(leaf.rotate)}) scale(${leaf.scale})`}
            >
              <Bloom type="leaf" swayDelay={(i % 5) * 1.3} />
            </g>
          </g>
        ))}

        {SHOOTS.map((shoot, i) => (
          <g key={i} className="jg-part" data-y={Math.round(shoot.y)}>
            <path className="jg-shoot" pathLength={1} d={shoot.d} />
            <g
              transform={`translate(${r(shoot.leaf.x)} ${r(shoot.leaf.y)}) rotate(${shoot.side * 50}) scale(0.6)`}
            >
              <Bloom type="leaf" swayDelay={i * 0.9} />
            </g>
            <g
              className="jg-late"
              transform={`translate(${r(shoot.end.x)} ${r(shoot.end.y)}) scale(${shoot.scale})`}
            >
              <Bloom type={shoot.type} swayDelay={i * 1.7} />
            </g>
          </g>
        ))}

        {BUDS.map((bud, i) => (
          <g key={i} className="jg-part" data-y={Math.round(bud.y)}>
            <g
              transform={`translate(${r(bud.x + bud.side * 4)} ${r(bud.y)}) rotate(${bud.side * 115}) scale(0.9)`}
            >
              <Bloom type={bud.type} swayDelay={i * 2.1} />
            </g>
          </g>
        ))}

        <g className="jg-part jg-tip" data-y={TIP[1] - 10}>
          <g transform={`translate(${TIP[0]} ${TIP[1]}) rotate(180) scale(1.4)`}>
            <Bloom type="bud-pink" swayDelay={0} />
          </g>
        </g>
      </svg>
    </div>
  );
}
