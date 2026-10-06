import type { CSSProperties, ReactNode } from "react";

// Decorative flowers around the hero photo arch, drawn as SVG so they stay sharp at any
// size and cost no image download. Every flower is drawn around (0, 0) and placed by its
// parent <g>, so the CSS animations (bloom, sway in globals.css) turn around its center.
//
// Coordinates: the arch fills x 90→390, y 60→460 of the 480×520 viewBox, and the SVG box
// is sized to match (see FlowerLayer), so flowers line up with the photo at every width.

const PETAL = "M0 0C-7-4-10-14-6-20C-4-23-1-22 0-19C1-22 4-23 6-20C10-14 7-4 0 0Z";
const ROSE_PETAL = "M0 0C-11-4-14-18-8-26C-4-30 4-30 8-26C14-18 11-4 0 0Z";
const BUD = "M0 0C-5-4-6-12 0-18C6-12 5-4 0 0Z";
const SEPAL = "M0 0C-4-2-5-6-3-9C-1-6 1-6 3-9C5-6 4-2 0 0Z";
const LEAF = "M0 0C7-6 9-17 0-30C-9-17-7-6 0 0Z";

type Tone = "violet" | "pink" | "plum";

const ring = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, i) => offset + (360 / count) * i);

function Blossom({ tone }: { tone: Tone }) {
  return (
    <>
      {ring(5).map((a) => (
        <path key={a} d={PETAL} transform={`rotate(${a})`} fill={`url(#fl-${tone})`} />
      ))}
      <circle r="4" fill="url(#fl-heart)" />
      {ring(5, 36).map((a) => (
        <circle key={a} cy="-7" r="1.1" transform={`rotate(${a})`} fill="#fde68a" />
      ))}
    </>
  );
}

/** A rose seen from above: three rings of petals around a curled heart. */
function Rose({ tone }: { tone: Tone }) {
  return (
    <>
      {ring(6).map((a) => (
        <path key={a} d={ROSE_PETAL} transform={`rotate(${a})`} fill={`url(#fl-${tone})`} />
      ))}
      {ring(5, 36).map((a) => (
        <path
          key={a}
          d={ROSE_PETAL}
          transform={`rotate(${a}) scale(0.68)`}
          fill={`url(#fl-${tone})`}
        />
      ))}
      {ring(4, 20).map((a) => (
        <path
          key={a}
          d={ROSE_PETAL}
          transform={`rotate(${a}) scale(0.42)`}
          fill={`url(#fl-${tone})`}
        />
      ))}
      <path
        d="M-1 0a3 3 0 1 1 4 2.6a5 5 0 1 1-7.5-4.8"
        fill="none"
        stroke="#4c0519"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  );
}

function Daisy() {
  return (
    <>
      {ring(14).map((a) => (
        <ellipse
          key={a}
          cy="-9.5"
          rx="2.6"
          ry="8"
          transform={`rotate(${a})`}
          fill="url(#fl-cream)"
        />
      ))}
      <circle r="4.5" fill="url(#fl-heart)" />
    </>
  );
}

function Bud({ tone }: { tone: Tone }) {
  return (
    <>
      <path d={BUD} fill={`url(#fl-${tone})`} />
      <path d={SEPAL} fill="url(#fl-leaf)" />
    </>
  );
}

function Leaf() {
  return (
    <>
      <path d={LEAF} fill="url(#fl-leaf)" />
      <path d="M0-2V-25" stroke="#a7c79c" strokeOpacity="0.45" strokeWidth="0.9" />
    </>
  );
}

/**
 * Places a flower and gives it its two animations: `bloom` once on load (after `delay` ms),
 * then a slow endless `sway`. Nested groups, because the position lives in the SVG
 * `transform` attribute and a CSS animation on the same element would replace it.
 */
function Place({
  x,
  y,
  rotate = 0,
  scale = 1,
  delay,
  sway = 7,
  children,
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  delay: number;
  sway?: number;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="bloom" style={{ "--d": `${delay}ms` } as CSSProperties}>
        <g
          className="sway"
          style={
            { "--sway": `${sway}s`, "--sway-delay": `${-(delay % 5000) / 1000}s` } as CSSProperties
          }
        >
          {children}
        </g>
      </g>
    </g>
  );
}

function Gradients() {
  // Petal gradients run from the base (dark) to the tip (pale), in each petal's own box.
  const petal = (id: string, base: string, mid: string, tip: string) => (
    <radialGradient id={id} cx="0.5" cy="1" r="1.15">
      <stop offset="0" stopColor={base} />
      <stop offset="0.5" stopColor={mid} />
      <stop offset="1" stopColor={tip} />
    </radialGradient>
  );
  return (
    <defs>
      {petal("fl-violet", "#5b21b6", "#a78bfa", "#f3efff")}
      {petal("fl-pink", "#9d174d", "#f472b6", "#fdf2f8")}
      {/* Burgundy, like the scarf in the photo. */}
      {petal("fl-plum", "#4c0519", "#9f1239", "#fda4af")}
      {petal("fl-cream", "#fcd34d", "#fff7ed", "#ffffff")}
      <radialGradient id="fl-heart">
        <stop offset="0" stopColor="#fef3c7" />
        <stop offset="0.55" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#92400e" />
      </radialGradient>
      <linearGradient id="fl-leaf" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#1e3a2a" />
        <stop offset="1" stopColor="#6b9b62" />
      </linearGradient>
    </defs>
  );
}

const VINES = [
  "M100 482C70 440 66 380 76 320C86 260 70 220 88 170C104 128 130 100 160 84",
  "M380 482C410 430 414 370 404 300C396 250 412 200 394 150C384 124 366 104 344 92",
];

/** Behind the photo: the vines climbing the arch, their leaves, and flowers peeking out. */
function BackLayer() {
  return (
    <>
      <Gradients />
      {VINES.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className="vine"
          style={{ "--d": `${200 + i * 150}ms` } as CSSProperties}
          fill="none"
          stroke="#3f6b4a"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
      {[
        [74, 400, -40, 0.8, 500],
        [70, 330, -70, 0.7, 650],
        [84, 250, 30, 0.65, 800],
        [96, 160, -50, 0.6, 950],
        [140, 92, 20, 0.55, 1100],
        [408, 410, 40, 0.8, 600],
        [410, 330, 70, 0.7, 750],
        [400, 240, -30, 0.65, 900],
        [396, 160, 50, 0.6, 1050],
        [360, 98, -20, 0.55, 1200],
      ].map(([x, y, rotate, scale, delay]) => (
        <Place key={`${x}-${y}`} x={x} y={y} rotate={rotate} scale={scale} delay={delay} sway={6}>
          <Leaf />
        </Place>
      ))}
      <Place x={66} y={290} scale={0.7} delay={1300}>
        <Blossom tone="violet" />
      </Place>
      <Place x={416} y={282} scale={0.75} delay={1400}>
        <Blossom tone="pink" />
      </Place>
      <Place x={118} y={118} scale={0.55} delay={1550}>
        <Daisy />
      </Place>
    </>
  );
}

/** In front of the photo: the two big clusters at the base and small buds up the sides. */
function FrontLayer() {
  return (
    <>
      {/* Bottom left */}
      <Place x={58} y={452} rotate={-30} scale={0.9} delay={900}>
        <Leaf />
      </Place>
      <Place x={150} y={492} rotate={60} scale={0.85} delay={950}>
        <Leaf />
      </Place>
      <Place x={100} y={448} scale={1.15} delay={1100} sway={9}>
        <Rose tone="plum" />
      </Place>
      <Place x={148} y={474} scale={0.85} delay={1350}>
        <Blossom tone="violet" />
      </Place>
      <Place x={62} y={404} scale={0.75} delay={1500}>
        <Daisy />
      </Place>
      <Place x={56} y={478} rotate={-25} scale={0.8} delay={1650}>
        <Bud tone="pink" />
      </Place>
      {/* Bottom right */}
      <Place x={420} y={470} rotate={30} scale={0.9} delay={1000}>
        <Leaf />
      </Place>
      <Place x={338} y={496} rotate={-60} scale={0.8} delay={1050}>
        <Leaf />
      </Place>
      <Place x={386} y={440} scale={1} delay={1200} sway={8}>
        <Rose tone="pink" />
      </Place>
      <Place x={340} y={476} scale={0.7} delay={1450}>
        <Blossom tone="plum" />
      </Place>
      <Place x={424} y={396} scale={0.65} delay={1600}>
        <Blossom tone="violet" />
      </Place>
      <Place x={432} y={436} rotate={30} scale={0.7} delay={1750}>
        <Bud tone="violet" />
      </Place>
      {/* Up the sides and over the top */}
      <Place x={80} y={210} rotate={-15} scale={0.7} delay={1800}>
        <Bud tone="plum" />
      </Place>
      <Place x={372} y={118} scale={0.6} delay={1900}>
        <Blossom tone="pink" />
      </Place>
      <Place x={398} y={196} rotate={20} scale={0.6} delay={2000}>
        <Bud tone="pink" />
      </Place>
    </>
  );
}

/** One of the two flower layers around the arch; the photo sits between them. */
export function FlowerLayer({ layer, className }: { layer: "back" | "front"; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 480 520"
      className={`pointer-events-none absolute top-[-15%] left-[-30%] h-[130%] w-[160%] overflow-visible ${className ?? ""}`}
    >
      {layer === "back" ? <BackLayer /> : <FrontLayer />}
    </svg>
  );
}

// Petals drifting down across the hero: left position (%), size (px), fall time (s),
// start offset (s), sideways drift (px) and color.
const PETALS = [
  [6, 19, 17, 0, 60, "#f472b6"],
  [18, 15, 21, 7, -40, "#a78bfa"],
  [31, 17, 19, 13, 50, "#9f1239"],
  [47, 14, 23, 3, -60, "#f9a8d4"],
  [62, 18, 18, 10, 40, "#a78bfa"],
  [74, 16, 22, 16, -50, "#f472b6"],
  [86, 20, 20, 5, 70, "#c084fc"],
  [94, 14, 24, 12, -30, "#9f1239"],
] as const;

/** Decorative: a few petals falling behind the hero content. Hidden with reduced motion. */
export function FallingPetals() {
  return (
    <div aria-hidden="true" className="[container-type:size] pointer-events-none absolute inset-0">
      {PETALS.map(([left, size, duration, offset, drift, color]) => (
        <span
          key={left}
          className="petal-fall absolute top-0"
          style={
            {
              left: `${left}%`,
              "--fall": `${duration}s`,
              "--fall-delay": `${-offset}s`,
              "--drift": `${drift}px`,
            } as CSSProperties
          }
        >
          <svg viewBox="-7 -7 14 14" width={size} height={size} className="petal-flutter block">
            <path d="M0-6C4-6 6-1 0 6C-6-1-4-6 0-6Z" fill={color} />
          </svg>
        </span>
      ))}
    </div>
  );
}
