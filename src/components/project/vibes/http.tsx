import type { CSSProperties } from "react";
import { getSite } from "@/lib/content";
import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

export function HttpHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const { category, team } = facts(props);
  const host = new URL(getSite().url).host;
  // The request for this very page, and an answer that says what the server is made of.
  const request = [
    ["→", `GET /${locale}/projects/${project.slug} HTTP/1.1`],
    ["", `Host: ${host}`],
    ["", "Accept: text/html"],
  ];
  const response = [
    ["←", "HTTP/1.1 200 OK"],
    ["", "Server: java.nio (single thread)"],
    ["", "Content-Type: text/html; charset=utf-8"],
    ["", "Transfer-Encoding: chunked"],
    ["", "Set-Cookie: session=…"],
  ];
  const line = (i: number) => ({ "--line": i }) as CSSProperties;

  return (
    <header className="ht-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />
        <div className="ht-grid">
          <div>
            <p className="ht-methods" aria-hidden="true">
              <span className="ht-get">GET</span>
              <span className="ht-post">POST</span>
              <span className="ht-delete">DELETE</span>
            </p>
            <p className="ht-kicker">
              {category} · <Rich text={team} />
            </p>
            <h1 className="ht-title">{copy.title}</h1>
            <p className="ht-tagline">
              <Rich text={copy.tagline} />
            </p>
            <p className="ht-summary">
              <Rich text={copy.summary} />
            </p>
            <StackList stack={project.stack} />
            <ProjectLinks project={project} dict={dict} />
          </div>

          <div className="ht-devtools" aria-hidden="true">
            <div className="ht-tabs">
              <span>Elements</span>
              <span>Console</span>
              <span className="is-on">Network</span>
              <span>Sources</span>
            </div>
            <div className="ht-sub">
              <span className="is-on">Headers</span>
              <span>Response</span>
              <span>Cookies</span>
              <span>Timing</span>
            </div>
            <pre className="ht-msg">
              {request.map(([arrow, text], i) => (
                <span key={text} className="ht-line" style={line(i)}>
                  <b>{arrow}</b> {text}
                </span>
              ))}
            </pre>
            <pre className="ht-msg ht-res">
              {response.map(([arrow, text], i) => (
                <span key={text} className="ht-line" style={line(i + request.length + 1)}>
                  <b>{arrow}</b> {text}
                </span>
              ))}
            </pre>
            <div className="ht-status" style={line(request.length + response.length + 2)}>
              <span className="ht-200">200</span>
              <span>document</span>
              <span>chunked</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
