import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/format";
import type { Diagram } from "@/lib/schemas";

// Architecture diagrams are data (content/projects/<slug>/meta.json → "diagram"), drawn here
// as plain SVG at build time: zero JavaScript in the browser, and colors come from the theme
// tokens, so the same diagram works in dark and light mode.

const CELL_W = 236;
const CELL_H = 112;
const NODE_W = 172;
const NODE_H = 58;
const PAD = 16;
const GAP = 5; // space between an arrow tip and the node border

type Point = { x: number; y: number };
type Node = Diagram["nodes"][number];

const center = ([col, row]: [number, number]): Point => ({
  x: PAD + col * CELL_W + CELL_W / 2,
  y: PAD + row * CELL_H + CELL_H / 2,
});

/** Where the segment from `from` towards `to` leaves the node box around `from`. */
function borderPoint(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = 1 / Math.max(Math.abs(dx) / (NODE_W / 2 + GAP), Math.abs(dy) / (NODE_H / 2 + GAP));
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

// Every edge points at an existing node: the content schema rejects the build otherwise,
// which is why the edge lookups can use `!`.
const nodesById = (diagram: Diagram) => new Map(diagram.nodes.map((node) => [node.id, node]));

function NodeShape({ node, locale }: { node: Node; locale: Locale }) {
  const c = center(node.at);
  const x = c.x - NODE_W / 2;
  const y = c.y - NODE_H / 2;
  const sub = node.sub ? pick(node.sub, locale) : undefined;
  const lift = node.kind === "data" ? 4 : 0; // the cylinder lid takes some room at the top

  let shape;
  if (node.kind === "data") {
    const e = 7;
    shape = (
      <>
        <path
          d={`M${x} ${y + e} A${NODE_W / 2} ${e} 0 0 1 ${x + NODE_W} ${y + e} V${y + NODE_H - e} A${NODE_W / 2} ${e} 0 0 1 ${x} ${y + NODE_H - e} Z`}
          className="fill-surface stroke-line"
        />
        <ellipse cx={c.x} cy={y + e} rx={NODE_W / 2} ry={e} className="fill-raised stroke-line" />
      </>
    );
  } else {
    shape = (
      <>
        <rect
          x={x}
          y={y}
          width={NODE_W}
          height={NODE_H}
          rx={8}
          className={node.kind === "client" ? "fill-bg stroke-muted" : "fill-surface stroke-line"}
          strokeDasharray={node.kind === "client" ? "5 4" : undefined}
        />
        {node.kind === "app" && (
          <rect x={x} y={y + 14} width={3} height={NODE_H - 28} rx={1.5} className="fill-accent" />
        )}
        {node.kind === "queue" &&
          [0, 1, 2].map((i) => (
            <rect
              key={i}
              x={x + NODE_W - 26 + i * 6}
              y={c.y - 8}
              width={3}
              height={16}
              rx={1}
              className="fill-muted"
            />
          ))}
      </>
    );
  }

  return (
    <g>
      {shape}
      <text
        x={c.x}
        y={sub ? c.y - 7 + lift : c.y + lift}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-fg font-sans text-[13px] font-semibold"
      >
        {pick(node.label, locale)}
      </text>
      {sub && (
        <text
          x={c.x}
          y={c.y + 11 + lift}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted font-mono text-[10.5px]"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function ArchDiagram({
  diagram,
  locale,
  id,
  title,
}: {
  diagram: Diagram;
  locale: Locale;
  id: string;
  title: string;
}) {
  const width = PAD * 2 + diagram.cols * CELL_W;
  const height = PAD * 2 + diagram.rows * CELL_H;
  const byId = nodesById(diagram);

  const edges = diagram.edges.map((edge) => {
    const from = byId.get(edge.from)!;
    const to = byId.get(edge.to)!;
    const a = center(from.at);
    const b = center(to.at);
    return { ...edge, from, to, start: borderPoint(a, b), end: borderPoint(b, a) };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
      className="h-auto w-full min-w-[620px]"
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{diagramAsText(diagram, locale).join("; ")}</desc>
      <defs>
        <marker
          id={`${id}-arrow`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" className="fill-muted" />
        </marker>
      </defs>

      {diagram.groups.map((group) => {
        const x = PAD + group.from[0] * CELL_W + 8;
        const y = PAD + group.from[1] * CELL_H + 4;
        const w = (group.to[0] - group.from[0] + 1) * CELL_W - 16;
        const h = (group.to[1] - group.from[1] + 1) * CELL_H - 8;
        return (
          <g key={`${group.from}-${group.to}`}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={12}
              className="fill-raised/40 stroke-line"
              strokeDasharray="6 5"
            />
            <text
              x={x + 12}
              y={y + 15}
              className="fill-muted font-mono text-[10px] tracking-wider uppercase"
            >
              {pick(group.label, locale)}
            </text>
          </g>
        );
      })}

      {edges.map((edge) => (
        <line
          key={`${edge.from.id}-${edge.to.id}`}
          x1={edge.start.x}
          y1={edge.start.y}
          x2={edge.end.x}
          y2={edge.end.y}
          className="stroke-muted"
          strokeWidth={1.4}
          strokeDasharray={edge.dashed ? "4 4" : undefined}
          markerEnd={`url(#${id}-arrow)`}
          markerStart={edge.both ? `url(#${id}-arrow)` : undefined}
        />
      ))}

      {diagram.nodes.map((node) => (
        <NodeShape key={node.id} node={node} locale={locale} />
      ))}

      {edges
        .filter((edge) => edge.label)
        .map((edge) => {
          const text = pick(edge.label!, locale);
          const w = text.length * 6.4 + 14;
          const x = (edge.start.x + edge.end.x) / 2;
          const y = (edge.start.y + edge.end.y) / 2;
          return (
            <g key={`label-${edge.from.id}-${edge.to.id}`}>
              <rect
                x={x - w / 2}
                y={y - 9}
                width={w}
                height={18}
                rx={4}
                className="fill-bg stroke-line"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-muted font-mono text-[10.5px]"
              >
                {text}
              </text>
            </g>
          );
        })}
    </svg>
  );
}

/** Text version of the diagram, for screen readers and for anyone who prefers reading. */
export function diagramAsText(diagram: Diagram, locale: Locale): string[] {
  const byId = nodesById(diagram);
  return diagram.edges.map((edge) => {
    const from = pick(byId.get(edge.from)!.label, locale);
    const to = pick(byId.get(edge.to)!.label, locale);
    return `${from} ${edge.both ? "↔" : "→"} ${to}${edge.label ? `: ${pick(edge.label, locale)}` : ""}`;
  });
}
