import { pick } from "@/i18n/format";
import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

/** A ship's wheel with seven spokes, the usual picture for a cluster. */
function Wheel() {
  const spokes = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);
  return (
    <svg viewBox="-12 -12 24 24" className="cl-wheel" aria-hidden="true">
      <circle r="10.5" fill="currentColor" />
      <circle r="6" fill="none" stroke="#fff" strokeWidth="1.6" />
      {spokes.map((a) => (
        <line
          key={a}
          y1="-2"
          y2="-9"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r="1.8" fill="#fff" />
    </svg>
  );
}

export function ClusterHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const { category, team } = facts(props);
  // One row per workload of the architecture diagram: its name, its kind, and the rest of
  // its note ("HPA 1–3", "PVC"...), all from meta.json.
  const rows = (project.diagram?.nodes ?? [])
    .filter((node) => node.kind !== "client")
    .map((node) => {
      const parts = (node.sub ? pick(node.sub, locale) : "").split(" · ");
      const kind = parts.find((p) => p === "Deployment" || p === "StatefulSet") ?? "—";
      return { name: node.id, kind, note: parts.filter((p) => p !== kind).join(" · ") };
    });

  return (
    <header className="cl-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />

        <div className="cl-bar">
          <Wheel />
          <span className="cl-bar-name">k3s</span>
          <span className="cl-bar-ctx">context: {project.slug}</span>
          <span className="cl-bar-nodes">nodes: 2</span>
        </div>

        <div className="cl-grid">
          <div>
            <p className="cl-kicker">
              kind: CaseStudy · {category} · <Rich text={team} />
            </p>
            <h1 className="cl-title">{copy.title}</h1>
            <p className="cl-tagline">
              <Rich text={copy.tagline} />
            </p>
            <p className="cl-summary">
              <Rich text={copy.summary} />
            </p>
            <StackList stack={project.stack} />
            <ProjectLinks project={project} dict={dict} />
          </div>

          <div className="cl-panels">
            <div className="cl-panel">
              <p className="cl-cmd">$ kubectl get deploy,statefulset</p>
              <table className="cl-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>KIND</th>
                    <th>NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.name} style={{ animationDelay: `${300 + i * 120}ms` }}>
                      <td>
                        <span className="cl-dot" aria-hidden="true" />
                        {row.name}
                      </td>
                      <td>{row.kind}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cl-nodes" aria-hidden="true">
              {["k3s server", "k3s worker"].map((node, n) => (
                <div key={node} className="cl-node">
                  <p>{node}</p>
                  <span>Debian VM · Vagrant</span>
                  <div className="cl-pods">
                    {Array.from({ length: n ? 4 : 3 }, (_, i) => (
                      <i key={i} style={{ animationDelay: `${i * 0.4 + n}s` }} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="cl-hpa">
                <p>HorizontalPodAutoscaler</p>
                <div className="cl-replicas">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="cl-cpu">
                  <span />
                  <b>60% CPU</b>
                </div>
                <span>replicas 1 → 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
