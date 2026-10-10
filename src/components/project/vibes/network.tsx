import type { CSSProperties } from "react";
import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

type Device = { id: string; kind: "router" | "switch" | "pc" | "server"; x: number; y: number };

// A small lab in the style of Cisco Packet Tracer, with its default device names.
const DEVICES: Device[] = [
  { id: "Router0", kind: "router", x: 220, y: 52 },
  { id: "Switch0", kind: "switch", x: 110, y: 150 },
  { id: "Switch1", kind: "switch", x: 330, y: 150 },
  { id: "PC0", kind: "pc", x: 50, y: 248 },
  { id: "PC1", kind: "pc", x: 165, y: 248 },
  { id: "Server0", kind: "server", x: 275, y: 248 },
  { id: "PC2", kind: "pc", x: 390, y: 248 },
];
const LINKS: [string, string][] = [
  ["Router0", "Switch0"],
  ["Router0", "Switch1"],
  ["Switch0", "PC0"],
  ["Switch0", "PC1"],
  ["Switch1", "Server0"],
  ["Switch1", "PC2"],
];
const at = (id: string) => DEVICES.find((d) => d.id === id)!;

function Icon({ kind }: { kind: Device["kind"] }) {
  switch (kind) {
    case "router":
      return (
        <g className="nw-dev">
          <path d="M-26 -6v12a26 9 0 0 0 52 0v-12" />
          <ellipse cy="-6" rx="26" ry="9" />
          <path className="nw-arrows" d="M-12 -6h8m-3-3 3 3-3 3M12 -6h-8m3-3-3 3 3 3" />
        </g>
      );
    case "switch":
      return (
        <g className="nw-dev">
          <rect x="-28" y="-11" width="56" height="22" rx="3" />
          <path className="nw-arrows" d="M-14 -4h28m-4-3 4 3-4 3M14 4h-28m4-3-4 3 4 3" />
        </g>
      );
    case "server":
      return (
        <g className="nw-dev">
          <rect x="-12" y="-18" width="24" height="36" rx="2" />
          <path className="nw-arrows" d="M-7 -10h14M-7 -4h14M-7 2h14" />
        </g>
      );
    default:
      return (
        <g className="nw-dev">
          <rect x="-16" y="-15" width="32" height="22" rx="2" />
          <path d="M-6 12h12M0 7v5" />
        </g>
      );
  }
}

export function NetworkHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const t = dict.caseStudy.vibes.network;
  const { category, team } = facts(props);

  return (
    <header className="nw-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />
        <div className="nw-grid">
          <div>
            <p className="nw-kicker">
              {category} · <Rich text={team} />
            </p>
            <h1 className="nw-title">{copy.title}</h1>
            <p className="nw-tagline">
              <Rich text={copy.tagline} />
            </p>
            <p className="nw-summary">
              <Rich text={copy.summary} />
            </p>
            <StackList stack={project.stack} />
            <ProjectLinks project={project} dict={dict} />
          </div>

          <figure className="nw-topo" aria-hidden="true">
            <svg viewBox="0 0 440 290">
              {LINKS.map(([a, b], i) => {
                const from = at(a);
                const to = at(b);
                const d = `M${from.x} ${from.y}L${to.x} ${to.y}`;
                return (
                  <g key={`${a}-${b}`}>
                    <path className="nw-link" d={d} />
                    <path className="nw-flow" d={d} style={{ "--i": i } as CSSProperties} />
                  </g>
                );
              })}
              {DEVICES.map((device) => (
                <g key={device.id} transform={`translate(${device.x} ${device.y})`}>
                  <Icon kind={device.kind} />
                  <text className="nw-name" y={device.kind === "router" ? 26 : 32}>
                    {device.id}
                  </text>
                </g>
              ))}
            </svg>
          </figure>
        </div>

        <ol className="nw-osi" aria-label="OSI">
          {t.layers.map((layer, i) => (
            <li key={layer} style={{ "--i": i } as CSSProperties}>
              <b>L{7 - i}</b>
              <span>{layer}</span>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
