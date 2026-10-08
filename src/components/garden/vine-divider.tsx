import { Reveal } from "@/components/ui/reveal";
import type { FlowerType } from "./defs";
import { Flower, SvgFlower } from "./flower";

// Two vines grow out from a flower in the middle, with leaves and small flowers along them.
const LEFT = "M544 32C500 18 452 46 400 32S300 16 250 32S150 46 96 30S30 26 0 32";
const RIGHT = "M544 32C588 46 636 18 688 32S788 48 838 32S938 18 992 34S1058 38 1088 32";
const LEAVES: [number, number, number][] = [
  [470, 30, -70],
  [420, 38, 110],
  [330, 24, -60],
  [262, 34, 120],
  [180, 40, -110],
  [110, 30, 70],
  [618, 34, 70],
  [668, 26, -110],
  [760, 40, 60],
  [826, 30, -120],
  [904, 24, 110],
  [972, 36, -60],
];
const CENTER: FlowerType[] = ["rose-pink", "bl-violet", "rose-plum", "daisy", "bl-pink"];

/** Grows from the middle when it scrolls into view; leaves open from the center outwards. */
const growDelay = (x: number, base: number) => base + Math.abs(544 - x) * 1.1;

/** The line between two home page sections. */
export function VineDivider({ index }: { index: number }) {
  const odd = index % 2 === 1;
  const small: [number, number, FlowerType][] = [
    [300, 30, odd ? "bl-pink" : "bl-violet"],
    [786, 34, odd ? "bl-violet" : "bud-pink"],
    [140, 36, "bud-plum"],
    [940, 28, odd ? "daisy" : "bl-plum"],
  ];
  return (
    <Reveal className="relative mx-auto max-w-[68rem] px-4 sm:px-6">
      <div aria-hidden="true" className="relative">
        <svg viewBox="0 0 1088 64" className="block h-auto w-full overflow-visible">
          <path className="g-vine" pathLength={1} d={LEFT} />
          <path className="g-vine" pathLength={1} d={RIGHT} />
          {LEAVES.map(([x, y, rotate]) => (
            <SvgFlower
              key={`${x}-${y}`}
              type="leaf"
              x={x}
              y={y}
              rotate={rotate}
              scale={0.55}
              delay={growDelay(x, 300)}
            />
          ))}
          {small.map(([x, y, type]) => (
            <SvgFlower key={x} type={type} x={x} y={y} scale={0.5} delay={growDelay(x, 500)} />
          ))}
        </svg>
        <Flower
          type={CENTER[index % CENTER.length]}
          size={56}
          delay={1300}
          sway
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </Reveal>
  );
}
