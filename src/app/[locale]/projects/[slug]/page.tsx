import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArchDiagram, diagramAsText } from "@/components/project/arch-diagram";
import { VibeHero, vibeFont } from "@/components/project/vibes";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { plain, Rich } from "@/components/ui/rich";
import { hasLocale, languageAlternates, localePath, projectPath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProject, getProjects } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) return {};
  const copy = project[locale];
  const path = `projects/${slug}`;
  return {
    title: copy.title,
    description: plain(copy.tagline),
    alternates: {
      canonical: localePath(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "article",
      title: copy.title,
      description: plain(copy.tagline),
      url: localePath(locale, path),
    },
  };
}

/** One part of the case study. `kicker` is the vibe's label for it ("STAGE 1", "$ whoami"...). */
function Block({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section aria-labelledby={id} className={`cs-block cs-block-${id}`}>
        <p aria-hidden="true" className="cs-kicker">
          {kicker}
        </p>
        <h2 id={id} className="cs-title">
          {title}
        </h2>
        <div className="cs-content">{children}</div>
      </section>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) notFound();

  const dict = getDictionary(locale);
  const t = dict.caseStudy;
  const copy = project[locale];
  const all = getProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const prev = all[index - 1];
  const next = all[index + 1];
  const vibe = t.vibes[project.vibe];
  const kick = vibe.kickers;

  return (
    <article data-vibe={project.vibe} className={`cs ${vibeFont(project.vibe)}`}>
      <VibeHero project={project} copy={copy} locale={locale} dict={dict} />

      <div className="cs-body page-wrap">
        <div className="cs-wrap">
          <Block id="problem" kicker={kick.problem} title={t.problem}>
            <p className="cs-lead">
              <Rich text={copy.problem} />
            </p>
          </Block>

          <Block id="role" kicker={kick.role} title={t.role}>
            <p className="cs-lead">
              <Rich text={copy.role} />
            </p>
          </Block>

          <Block id="features" kicker={kick.features} title={t.features}>
            <ul className="cs-features">
              {copy.features.map((feature) => (
                <li key={feature} className="cs-feature">
                  <Rich text={feature} />
                </li>
              ))}
            </ul>
          </Block>

          {project.diagram && (
            <Block id="architecture" kicker={kick.architecture} title={t.architecture}>
              <figure className="cs-diagram">
                <div className="cs-diagram-box">
                  <ArchDiagram
                    diagram={project.diagram}
                    locale={locale}
                    id={`diagram-${slug}`}
                    title={`${t.architecture}: ${copy.title}`}
                  />
                </div>
                <figcaption className="cs-caption">{t.architectureNote}</figcaption>
              </figure>
              <details className="cs-details">
                <summary>{t.diagramList}</summary>
                <ul>
                  {diagramAsText(project.diagram, locale).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>
            </Block>
          )}

          {copy.challenges.length > 0 && (
            <Block id="challenges" kicker={kick.challenges} title={t.challenges}>
              <ul className="cs-challenges">
                {copy.challenges.map((challenge) => (
                  <li key={challenge.title} className="cs-challenge">
                    <h3 className="cs-challenge-title">
                      <Rich text={challenge.title} />
                    </h3>
                    <dl className="cs-qa">
                      <dt className="cs-q-label">{vibe.challengeProblem}</dt>
                      <dd className="cs-q">
                        <Rich text={challenge.problem} />
                      </dd>
                      <dt className="cs-a-label">{vibe.challengeSolution}</dt>
                      <dd className="cs-a">
                        <Rich text={challenge.solution} />
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {copy.learned.length > 0 && (
            <Block id="learned" kicker={kick.learned} title={t.learned}>
              <ul className="cs-learned">
                {copy.learned.map((item) => (
                  <li key={item} className="cs-learn">
                    <Rich text={item} />
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block id="screenshots" kicker={kick.screenshots} title={t.screenshots}>
            <div className="cs-shots">
              <Rich text={t.screenshotsTodo} />
            </div>
          </Block>

          <nav aria-label={dict.projects.title} className="cs-nav">
            {prev && (
              <Link href={projectPath(locale, prev.slug)} className="cs-nav-link group">
                <span className="cs-nav-dir">
                  <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />{" "}
                  {t.prev}
                </span>
                <span className="cs-nav-title">{prev[locale].title}</span>
              </Link>
            )}
            {next && (
              <Link href={projectPath(locale, next.slug)} className="cs-nav-link cs-nav-next group">
                <span className="cs-nav-dir">
                  {t.next}{" "}
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
                <span className="cs-nav-title">{next[locale].title}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}
