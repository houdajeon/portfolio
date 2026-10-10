import type { CSSProperties } from "react";
import { pick } from "@/i18n/format";
import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

export function CloudHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const t = dict.caseStudy.vibes.cloud;
  const { category, team } = facts(props);
  // Every resource of the architecture diagram except the users. The first columns after
  // the users are the public edge (load balancer, gateway); the rest stays inside the VPC.
  const tiles = (project.diagram?.nodes ?? [])
    .filter((node) => node.kind !== "client")
    .map((node) => ({
      name: pick(node.label, locale),
      sub: node.sub ? pick(node.sub, locale) : "",
      kind: node.kind,
      edge: node.at[0] <= 2,
    }));
  const zones = [
    { label: t.public, list: tiles.filter((tile) => tile.edge), cls: "cd-public" },
    { label: t.private, list: tiles.filter((tile) => !tile.edge), cls: "cd-private" },
  ];

  return (
    <header className="cd-hero">
      <div className="cd-sky" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </div>
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />
        <div className="cd-grid">
          <div>
            <p className="cd-kicker">
              {category} · <Rich text={team} />
            </p>
            <h1 className="cd-title">{copy.title}</h1>
            <p className="cd-tagline">
              <Rich text={copy.tagline} />
            </p>
            <StackList stack={project.stack} />
            <ProjectLinks project={project} dict={dict} />
          </div>

          <div className="cd-region" aria-hidden="true">
            <p className="cd-internet">{t.internet} ↓ HTTPS</p>
            <p className="cd-region-label">AWS · VPC</p>
            {zones.map((zone) => (
              <div key={zone.cls} className={`cd-zone ${zone.cls}`}>
                <p className="cd-zone-label">{zone.label}</p>
                <ul>
                  {zone.list.map((tile, i) => (
                    <li
                      key={tile.name}
                      className={`cd-tile cd-${tile.kind}`}
                      style={{ "--i": i } as CSSProperties}
                    >
                      <b>{tile.name}</b>
                      <span>{tile.sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <pre className="cd-tf" aria-hidden="true">
          <span>$ terraform apply</span>
          <span className="cd-add" style={{ "--i": 0 } as CSSProperties}>
            + vpc
          </span>
          {tiles.map((tile, i) => (
            <span key={tile.name} className="cd-add" style={{ "--i": i + 1 } as CSSProperties}>
              + {tile.name}
            </span>
          ))}
          <span className="cd-done" style={{ "--i": tiles.length + 1 } as CSSProperties}>
            Apply complete!
          </span>
        </pre>

        <p className="cd-summary">
          <Rich text={copy.summary} />
        </p>
      </div>
    </header>
  );
}
