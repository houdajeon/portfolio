import type { CSSProperties } from "react";
import { FLOWERS, type FlowerType, type PetalColor } from "./defs";

/**
 * One garden flower as an inline element (size in px). It blooms when the <Reveal> block
 * around it shows (after `delay` ms), then sways; see g-* in globals.css.
 */
export function Flower({
  type,
  size,
  delay = 0,
  sway = false,
  className = "",
  style,
}: {
  type: FlowerType;
  size: number;
  delay?: number;
  sway?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`g-fl ${sway ? "g-fl-sway" : ""} ${className}`}
      style={{ width: size, height: size, "--d": `${delay}ms`, ...style } as CSSProperties}
    >
      <svg className="size-full overflow-visible">
        <use href={`#${type}`} />
      </svg>
    </span>
  );
}

/** One garden flower inside an SVG, centered on (x, y). Blooms on reveal, then sways. */
export function SvgFlower({
  type,
  x,
  y,
  rotate = 0,
  scale = 1,
  delay = 0,
}: {
  type: FlowerType;
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  delay?: number;
}) {
  const [bx, by, bw, bh] = FLOWERS[type].box;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="g-bl" style={{ "--d": `${delay}ms` } as CSSProperties}>
        <g className="g-sw" style={{ "--swd": `${(-delay / 1000).toFixed(2)}s` } as CSSProperties}>
          <use href={`#${type}`} x={bx} y={by} width={bw} height={bh} />
        </g>
      </g>
    </g>
  );
}

/** A single loose petal, as an inline SVG filling its box. */
export function Petal({ color }: { color: PetalColor }) {
  return (
    <svg viewBox="-7 -7 14 14" className="block size-full">
      <use href={`#petal-${color}`} x={-7} y={-7} width={14} height={14} />
    </svg>
  );
}

/** Small seeded random generator: the same "random" garden on every build and visit. */
export function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
