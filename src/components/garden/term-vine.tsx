import type { CSSProperties } from "react";
import type { FlowerType } from "./defs";
import { SvgFlower } from "./flower";

/** The flower at the corner of each window, in turn. */
const CORNER: FlowerType[] = ["bl-pink", "bl-violet", "daisy", "bl-plum"];

/**
 * A vine climbing over the top corner of a terminal window (left corner, or the right one
 * when `right`), with leaves, a flower at the corner and a bud at its tip. It grows when the
 * <Reveal> around the window shows. Place it next to the window, inside a relative parent:
 * the window clips its own overflow, so the vine cannot live inside it.
 */
export function TermVine({ index, right = false }: { index: number; right?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 156 116"
      className={`pointer-events-none absolute -top-[30px] z-10 h-[116px] w-[156px] overflow-visible ${
        right ? "-right-3 -scale-x-100 sm:-right-6" : "-left-3 sm:-left-6"
      }`}
    >
      <path
        className="g-vine"
        style={{ "--d": "0ms" } as CSSProperties}
        pathLength={1}
        d="M26 116C14 92 24 72 20 52C16 34 30 22 54 26C82 30 108 16 154 22"
      />
      <SvgFlower type="leaf" x={20} y={92} rotate={-35} scale={0.7} delay={350} />
      <SvgFlower type="leaf" x={22} y={62} rotate={25} scale={0.6} delay={500} />
      <SvgFlower type="leaf" x={78} y={26} rotate={-100} scale={0.55} delay={650} />
      <SvgFlower type="leaf" x={118} y={18} rotate={75} scale={0.55} delay={800} />
      <SvgFlower type={CORNER[index % CORNER.length]} x={32} y={30} scale={0.95} delay={900} />
      <SvgFlower
        type={index % 2 ? "bud-pink" : "bud-violet"}
        x={142}
        y={20}
        rotate={20}
        scale={0.9}
        delay={1100}
      />
    </svg>
  );
}
