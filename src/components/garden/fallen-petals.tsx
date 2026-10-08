import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/reveal";
import type { PetalColor } from "./defs";
import { Petal, seeded } from "./flower";

const random = seeded(11);
const COLORS: PetalColor[] = ["pink", "violet", "plum", "pink"];
/** Petals resting on the footer's top edge: place (%), tilt, size, landing order and drift. */
const FALLEN = Array.from({ length: 30 }, (_, i) => ({
  left: 1 + random() * 97,
  top: Math.round(-2 + random() * 10),
  tilt: Math.round(random() * 360),
  size: Math.round(10 + random() * 5),
  delay: Math.round(i * 70 + random() * 200),
  fall: Math.round(-60 + random() * 120),
  color: COLORS[i % COLORS.length],
}));

/** The petals that fell during the visit settle along the bottom of the page. */
export function FallenPetals() {
  return (
    <Reveal className="pointer-events-none absolute inset-x-0 -top-2.5 h-5">
      <div aria-hidden="true" className="relative size-full">
        {FALLEN.map((petal, i) => (
          <span
            key={i}
            className="fallen-petal"
            style={
              {
                left: `${petal.left.toFixed(1)}%`,
                top: `${petal.top}px`,
                width: petal.size,
                height: petal.size,
                rotate: `${petal.tilt}deg`,
                "--d": `${petal.delay}ms`,
                "--fx": `${petal.fall}px`,
              } as CSSProperties
            }
          >
            <Petal color={petal.color} />
          </span>
        ))}
      </div>
    </Reveal>
  );
}
