import type { CSSProperties } from "react";
import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

const PAINT = ["#2496ed", "#f4a261", "#2a9d8f", "#e76f51", "#8ab4f8", "#e9c46a"];

export function ContainersHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const { category, team } = facts(props);
  // One shipping container per service of the architecture diagram (not the client).
  const services = (project.diagram?.nodes ?? [])
    .filter((node) => node.kind !== "client")
    .map((node) => node.id);
  // Stacked like on a quay: the widest row at the bottom.
  const rows = [services.slice(0, 3), services.slice(3, 5), services.slice(5)].filter(
    (r) => r.length,
  );

  return (
    <header className="ct-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />
        <div className="ct-grid">
          <div>
            <p className="ct-kicker">
              {category} · <Rich text={team} />
            </p>
            <h1 className="ct-title">{copy.title}</h1>
            <p className="ct-tagline">
              <Rich text={copy.tagline} />
            </p>
            <p className="ct-summary">
              <Rich text={copy.summary} />
            </p>
            <StackList stack={project.stack} />
            <ProjectLinks project={project} dict={dict} />
          </div>

          <div className="ct-dock" aria-hidden="true">
            <div className="ct-stack">
              {rows.map((row, r) => (
                <div key={r} className="ct-row">
                  {row.map((name) => {
                    const i = services.indexOf(name);
                    return (
                      <span
                        key={name}
                        className="ct-box"
                        style={{ "--paint": PAINT[i % PAINT.length], "--i": i } as CSSProperties}
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="ct-sea">
              <path d="M0 18Q25 6 50 18T100 18T150 18T200 18T250 18T300 18T350 18T400 18V40H0Z" />
            </svg>
            <pre className="ct-log">
              <span>$ docker compose up</span>
              {services.map((name, i) => (
                <span key={name} style={{ "--i": i } as CSSProperties}>
                  <b>✔</b> Container {name.padEnd(13)} Started
                </span>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </header>
  );
}
