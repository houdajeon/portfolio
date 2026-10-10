import type { CSSProperties } from "react";
import { Rich, plain } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

export function ServerHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const { category, team } = facts(props);
  // Every service of the stack becomes a unit, described by the feature that mentions it.
  const units = project.stack
    .filter((item) => item !== "Linux" && !item.startsWith("Ubuntu"))
    .map((item) => ({
      name: item.toLowerCase(),
      note: copy.features.find((f) => f.toLowerCase().includes(item.toLowerCase())) ?? "",
    }));
  const step = (i: number) => ({ "--step": i }) as CSSProperties;

  return (
    <header className="sv-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />
        <p className="sv-kicker">
          {category} · <Rich text={team} />
        </p>
        <h1 className="sv-title">{copy.title}</h1>
        <p className="sv-tagline">
          <Rich text={copy.tagline} />
        </p>

        <div className="sv-console">
          <div className="sv-top" aria-hidden="true">
            <span>Ubuntu Server</span>
            <span>tty1</span>
          </div>
          <div className="sv-screen">
            <p className="sv-row" style={step(0)} aria-hidden="true">
              server login: <b>houda</b>
            </p>
            <p className="sv-row" style={step(1)} aria-hidden="true">
              <span className="sv-ps">houda@server</span>:<span className="sv-path">~</span>$
              systemctl status
            </p>
            <ul className="sv-units">
              {units.map((unit, i) => (
                <li key={unit.name} className="sv-row" style={step(2 + i)}>
                  <span className="sv-dot" aria-hidden="true">
                    ●
                  </span>
                  <span className="sv-unit">{unit.name}</span>
                  <span className="sv-active">active</span>
                  <span className="sv-note">{plain(unit.note)}</span>
                </li>
              ))}
            </ul>
            <p className="sv-row" style={step(3 + units.length)} aria-hidden="true">
              <span className="sv-ps">houda@server</span>:<span className="sv-path">~</span>${" "}
              <span className="sv-cursor" />
            </p>
          </div>
        </div>

        <p className="sv-summary">
          <Rich text={copy.summary} />
        </p>
        <StackList stack={project.stack} />
        <ProjectLinks project={project} dict={dict} />
      </div>
    </header>
  );
}
