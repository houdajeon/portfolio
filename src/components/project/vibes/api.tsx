import type { CSSProperties } from "react";
import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

// The gateway's routes, as a collection in an API client: the endpoints of the subject.
const REQUESTS: [string, string][] = [
  ["GET", "/api/movies"],
  ["GET", "/api/movies?title="],
  ["POST", "/api/movies"],
  ["DELETE", "/api/movies"],
  ["GET", "/api/movies/:id"],
  ["PUT", "/api/movies/:id"],
  ["DELETE", "/api/movies/:id"],
  ["POST", "/api/billing"],
];

/** The order sent to /api/billing, the example from the subject. */
const ORDER: [string, string][] = [
  ["user_id", "3"],
  ["number_of_items", "5"],
  ["total_amount", "180"],
];

export function ApiHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const t = dict.caseStudy.vibes.api;
  const { category, team } = facts(props);

  return (
    <header className="ap-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />
        <div className="ap-grid">
          <div>
            <p className="ap-kicker">
              {category} · <Rich text={team} />
            </p>
            <h1 className="ap-title">{copy.title}</h1>
            <p className="ap-tagline">
              <Rich text={copy.tagline} />
            </p>
            <p className="ap-summary">
              <Rich text={copy.summary} />
            </p>
            <StackList stack={project.stack} />
            <ProjectLinks project={project} dict={dict} />
          </div>

          <div className="ap-client" aria-hidden="true">
            <aside className="ap-side">
              <p className="ap-side-title">
                {t.collection} · {project.slug}
              </p>
              <ul>
                {REQUESTS.map(([method, path], i) => (
                  <li
                    key={`${method}-${path}`}
                    className={i === REQUESTS.length - 1 ? "is-on" : ""}
                  >
                    <b className={`ap-m ap-${method.toLowerCase()}`}>{method}</b>
                    <span>{path}</span>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="ap-main">
              <div className="ap-url">
                <b className="ap-m ap-post">POST</b>
                <span>{"{{gateway}}"}/api/billing</span>
                <i>{t.send}</i>
              </div>
              <p className="ap-tab">{t.body} · JSON</p>
              <pre className="ap-json">
                {"{\n"}
                {ORDER.map(([key, value], i) => (
                  <span key={key}>
                    {"  "}
                    <span className="ap-key">&quot;{key}&quot;</span>:{" "}
                    <span className="ap-val">&quot;{value}&quot;</span>
                    {i < ORDER.length - 1 ? ",\n" : "\n"}
                  </span>
                ))}
                {"}"}
              </pre>
              <p className="ap-tab">{t.response}</p>
              <p className="ap-res">
                <b>200 OK</b> <span>&quot;Message posted&quot;</span>
              </p>
            </div>
          </div>
        </div>

        {/* The resilience test of the subject: orders wait in the queue while billing-app is
            stopped with PM2, and are consumed and acknowledged once it starts again. */}
        <div className="ap-flow" aria-hidden="true">
          <span className="ap-node">api-gateway</span>
          <div className="ap-queue">
            <p>billing_queue</p>
            <div className="ap-lane">
              {[0, 1, 2].map((i) => (
                <i key={i} style={{ "--i": i } as CSSProperties} />
              ))}
            </div>
          </div>
          <span className="ap-node ap-billing">
            billing-app
            <em className="ap-down">● {t.stopped}</em>
            <em className="ap-up">● {t.online}</em>
          </span>
          <p className="ap-pm2">
            <span className="ap-down">$ pm2 stop billing-app · {t.waiting}</span>
            <span className="ap-up">$ pm2 start billing-app · ack ✓</span>
          </p>
        </div>
      </div>
    </header>
  );
}
