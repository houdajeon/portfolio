import type { CSSProperties } from "react";
import type { FlowerType } from "./defs";
import { Flower } from "./flower";

/** Flowers up both sides of the form: x and y in % of the form, flower, size, delay, tilt. */
const FLOWERS: [number, number, FlowerType, number, number, number?][] = [
  [0, 96, "rose-pink", 58, 1000],
  [1, 86, "bl-violet", 30, 1150],
  [-1, 70, "leaf", 22, 1250, -30],
  [0, 52, "bl-pink", 26, 1350],
  [1, 32, "leaf", 20, 1450, 25],
  [1, 13, "daisy", 26, 1550],
  [7, 1, "bud-plum", 22, 1700, 40],
  [100, 95, "rose-plum", 52, 1080],
  [99, 84, "daisy", 26, 1220],
  [101, 66, "leaf", 22, 1320, 30],
  [100, 46, "bl-violet", 26, 1420],
  [99, 26, "leaf", 20, 1520, -25],
  [100, 10, "bl-pink", 26, 1620],
  [93, 0, "bud-pink", 22, 1760, -40],
];

/**
 * Vines climbing both sides of the contact form, with flowers opening at its corners, like
 * the arch around the portrait. Place inside a relative <Reveal> that wraps the form.
 */
export function FormVines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="g-rise absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] overflow-visible"
        style={{ "--d": "200ms" } as CSSProperties}
      >
        <path className="g-vine g-vine-thin" d="M3 102C-1 82 5 62 2 42C0 24 4 9 15 0" />
        <path className="g-vine g-vine-thin" d="M97 102C101 82 95 62 98 42C100 24 96 9 85 0" />
      </svg>
      {FLOWERS.map(([x, y, type, size, delay, tilt = 0]) => (
        <span
          key={`${x}-${y}`}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x}%`, top: `${y}%`, rotate: `${tilt}deg` }}
        >
          <Flower type={type} size={size} delay={delay} sway={type !== "leaf"} />
        </span>
      ))}
    </div>
  );
}
