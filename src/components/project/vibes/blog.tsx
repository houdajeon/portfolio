import { format } from "@/i18n/format";
import { getSite } from "@/lib/content";
import { Rich } from "@/components/ui/rich";
import { BackLink, DemoVideo, facts, ProjectLinks, readingMinutes, type HeroProps } from "./shared";

/** "Spring Security" → "SpringSecurity", as a hashtag. Placeholders are left out. */
const hashtag = (item: string) =>
  item.startsWith("[TODO") ? null : item.replace(/[^\p{L}\p{N}.]/gu, "");

export function BlogHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const t = dict.caseStudy.vibes.blog;
  const { category, team } = facts(props);
  const site = getSite();
  const tags = project.stack.map(hashtag).filter(Boolean);

  return (
    <header className="bl-hero">
      <div className="bl-mast">
        <div className="bl-mast-row page-wrap">
          <BackLink locale={locale} label={dict.caseStudy.back} />
          <p className="bl-logo" aria-hidden="true">
            {copy.title}
            <span> — {t.masthead}</span>
          </p>
          <ul className="bl-nav" aria-hidden="true">
            {t.nav.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bl-wrap">
        <p className="bl-kicker">
          {category} · <Rich text={team} />
        </p>
        <h1 className="bl-title">{copy.title}</h1>
        <p className="bl-standfirst">
          <Rich text={copy.tagline} />
        </p>
        <div className="bl-byline">
          {site.photo && (
            // eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer
            <img src={site.photo} alt="" width={44} height={44} className="bl-avatar" />
          )}
          <p>
            {t.by} <b>{site.name}</b>
            <span aria-hidden="true"> · </span>
            <br className="sm:hidden" />
            {format(t.minRead, { n: readingMinutes(copy) })}
          </p>
        </div>
        <ul className="bl-tags">
          {tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      </div>

      {/* The cover of the article: the recorded demo when there is one, a drawing otherwise. */}
      {project.video ? (
        <figure className="bl-cover bl-cover-video">
          <DemoVideo project={project} copy={copy} dict={dict} />
        </figure>
      ) : (
        <figure className="bl-cover" aria-hidden="true">
          <span className="bl-cover-word">{copy.title}</span>
          <span className="bl-cover-lines" />
          <span className="bl-cover-blot" />
        </figure>
      )}

      <div className="bl-wrap">
        <p className="bl-lede">
          <Rich text={copy.summary} />
        </p>
        <div className="bl-actions" aria-hidden="true">
          <span>♡ {t.like}</span>
          <span>◌ {t.comment}</span>
          <span>↗ {t.share}</span>
        </div>
        <ProjectLinks project={project} dict={dict} />
      </div>
    </header>
  );
}
