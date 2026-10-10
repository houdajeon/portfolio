import type { CSSProperties } from "react";
import { Rich } from "@/components/ui/rich";
import { BackLink, codeWords, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

// "0-SHELL" in the classic figlet font, the way shells greet you.
const BANNER = String.raw`  ___        ____  _   _ _____ _     _
 / _ \      / ___|| | | | ____| |   | |
| | | |_____\___ \| |_| |  _| | |   | |
| |_| |_____|___) |  _  | |___| |___| |___
 \___/      |____/|_| |_|_____|_____|_____|`;

export function ShellHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const { category, team } = facts(props);
  // The built-in commands are the `code` words of the feature that lists the most of them.
  const commands = copy.features
    .map(codeWords)
    .reduce((most, list) => (list.length > most.length ? list : most), [] as string[]);
  const step = (i: number) => ({ "--step": i }) as CSSProperties;

  return (
    <header className="sh-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />
        <div className="sh-term">
          <div className="sh-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>houda@zone01: ~/{project.slug}</span>
          </div>
          <div className="sh-screen">
            <p className="sh-row" style={step(0)} aria-hidden="true">
              <span className="sh-ps">$</span> cargo run
            </p>
            <pre className="sh-banner sh-row" style={step(1)} aria-hidden="true">
              {BANNER}
            </pre>
            <h1 className="sh-title sh-row" style={step(2)}>
              {copy.title}
            </h1>
            <p className="sh-dim sh-row" style={step(2)}>
              {category} · <Rich text={team} /> · <Rich text={copy.tagline} />
            </p>
            <p className="sh-row" style={step(3)} aria-hidden="true">
              <span className="sh-ps">0-shell$</span> help
            </p>
            <ul className="sh-cmds sh-row" style={step(4)}>
              {commands.map((command) => (
                <li key={command}>{command}</li>
              ))}
            </ul>
            <p className="sh-row" style={step(5)} aria-hidden="true">
              <span className="sh-ps">0-shell$</span> cat README
            </p>
            <p className="sh-readme sh-row" style={step(6)}>
              <Rich text={copy.summary} />
            </p>
            <p className="sh-row" style={step(7)} aria-hidden="true">
              <span className="sh-ps">0-shell$</span> <span className="sh-cursor" />
            </p>
          </div>
        </div>
        <StackList stack={project.stack} />
        <ProjectLinks project={project} dict={dict} />
      </div>
    </header>
  );
}
