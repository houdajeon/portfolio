import { Blossom, Bud, Daisy, Gradients, Leaf, Rose } from "@/components/ui/flowers";

/** Every garden flower, by name. Each is drawn around (0, 0) inside its viewBox. */
export const FLOWERS = {
  "bl-violet": { box: [-24, -24, 48, 48], art: <Blossom tone="violet" /> },
  "bl-pink": { box: [-24, -24, 48, 48], art: <Blossom tone="pink" /> },
  "bl-plum": { box: [-24, -24, 48, 48], art: <Blossom tone="plum" /> },
  "rose-pink": { box: [-30, -30, 60, 60], art: <Rose tone="pink" /> },
  "rose-plum": { box: [-30, -30, 60, 60], art: <Rose tone="plum" /> },
  daisy: { box: [-20, -20, 40, 40], art: <Daisy /> },
  "bud-pink": { box: [-10, -20, 20, 22], art: <Bud tone="pink" /> },
  "bud-violet": { box: [-10, -20, 20, 22], art: <Bud tone="violet" /> },
  "bud-plum": { box: [-10, -20, 20, 22], art: <Bud tone="plum" /> },
  leaf: { box: [-10, -32, 20, 34], art: <Leaf /> },
} as const;

export type FlowerType = keyof typeof FLOWERS;

const PETAL_SHAPE = "M0-6C4-6 6-1 0 6C-6-1-4-6 0-6Z";
export const PETAL_COLORS = { pink: "#f472b6", violet: "#a78bfa", plum: "#9f1239" } as const;
export type PetalColor = keyof typeof PETAL_COLORS;

/**
 * The garden's flowers, defined once for the whole page as SVG <symbol>s, plus the
 * gradients they are painted with. Anywhere else, `<use href="#bl-pink">` draws one
 * (Flower, SvgFlower). Rendered once, hidden, at the top of the page.
 */
export function GardenDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
      <Gradients />
      {Object.entries(FLOWERS).map(([id, { box, art }]) => (
        <symbol key={id} id={id} viewBox={box.join(" ")}>
          {art}
        </symbol>
      ))}
      {Object.entries(PETAL_COLORS).map(([name, color]) => (
        <symbol key={name} id={`petal-${name}`} viewBox="-7 -7 14 14">
          <path d={PETAL_SHAPE} fill={color} />
        </symbol>
      ))}
    </svg>
  );
}
