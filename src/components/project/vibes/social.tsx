import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, StackList, type HeroProps } from "./shared";

/** "Social Network" → "SN". */
const initials = (title: string) =>
  title
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function SocialHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const t = dict.caseStudy.vibes.social;
  const { category, team } = facts(props);
  const mark = initials(copy.title);

  return (
    <header className="so-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />

        <div className="so-profile">
          <div className="so-cover" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%` }} />
            ))}
          </div>
          <div className="so-head">
            <span className="so-avatar" aria-hidden="true">
              {mark}
            </span>
            <div className="so-who">
              <h1 className="so-name">{copy.title}</h1>
              <p className="so-handle">
                @{project.slug} · {category} · <Rich text={team} />
              </p>
            </div>
            <div className="so-actions" aria-hidden="true">
              <span className="so-btn so-btn-main">+ {t.follow}</span>
              <span className="so-btn">{t.message}</span>
            </div>
          </div>
          <ul className="so-tabs" aria-hidden="true">
            {t.tabs.map((tab, i) => (
              <li key={tab} className={i === 0 ? "is-on" : ""}>
                {tab}
              </li>
            ))}
          </ul>
        </div>

        <div className="so-grid">
          <aside className="so-card so-intro">
            <h2 className="so-card-title">{t.intro}</h2>
            <p>
              <Rich text={copy.tagline} />
            </p>
            <h3 className="so-card-sub">{t.builtWith}</h3>
            <StackList stack={project.stack} />
            <ProjectLinks project={project} dict={dict} />
          </aside>
          <div className="so-feed">
            <div className="so-card so-composer" aria-hidden="true">
              <span className="so-avatar so-avatar-sm">{mark}</span>
              <span className="so-composer-field">{t.composer}</span>
            </div>
            <article className="so-card so-post">
              <div className="so-post-head">
                <span className="so-avatar so-avatar-sm" aria-hidden="true">
                  {mark}
                </span>
                <p>
                  <b>{copy.title}</b>
                  <span>{t.kickers.problem}</span>
                </p>
              </div>
              <p className="so-post-text">
                <Rich text={copy.summary} />
              </p>
              <div className="so-post-actions" aria-hidden="true">
                <span>♡ {t.like}</span>
                <span>◌ {t.comment}</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </header>
  );
}
