import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArchDiagram, diagramAsText } from "@/components/project/arch-diagram";
import { categoryLabel, teamLabel } from "@/components/sections/projects";
import { ArrowLeft, ArrowRight, External, GitHub } from "@/components/ui/icons";
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

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section aria-labelledby={id}>
        <h2 id={id} className="text-xl font-bold tracking-tight stretch-semi sm:text-2xl">
          <span className="font-mono text-base text-accent-text">{"// "}</span>
          {title}
        </h2>
        <div className="mt-4 text-muted">{children}</div>
      </section>
    </Reveal>
  );
}

const bulletList = "space-y-2.5";
const bullet =
  "relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-[2px] before:bg-accent";

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

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid" />
        <div className="relative page-wrap py-12 sm:py-16">
          <Link
            href={`${localePath(locale)}#projects`}
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition hover:text-fg"
          >
            <ArrowLeft className="size-3.5" />
            {t.back}
          </Link>
          <p className="mt-8 font-mono text-xs tracking-wider text-accent-text uppercase">
            {categoryLabel(project.categories, dict.projects)}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight stretch-wide sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-muted">
            <Rich text={copy.summary} />
          </p>

          <dl className="mt-10 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-10">
            <div>
              <dt className="font-mono text-xs text-muted">{t.team}</dt>
              <dd className="mt-1.5 font-medium">
                <Rich text={teamLabel(project.teamSize, dict.projects)} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-muted">{t.stack}</dt>
              <dd className="mt-1.5">
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-xs"
                    >
                      <Rich text={item} />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-muted">{t.links}</dt>
              <dd className="mt-1.5 flex flex-col gap-1.5">
                {project.repo ? (
                  <a
                    href={project.repo}
                    className="inline-flex items-center gap-2 font-medium hover:text-accent-text"
                  >
                    <GitHub /> {t.repo}
                  </a>
                ) : (
                  <Rich text={t.repoTodo} />
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    className="inline-flex items-center gap-2 font-medium hover:text-accent-text"
                  >
                    <External /> {t.demo}
                  </a>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="page-wrap">
        <div className="max-w-4xl space-y-14 py-14 sm:py-20">
          <Block id="problem" title={t.problem}>
            <p className="text-lg leading-relaxed">
              <Rich text={copy.problem} />
            </p>
          </Block>

          <Block id="role" title={t.role}>
            <p className="text-lg leading-relaxed">
              <Rich text={copy.role} />
            </p>
          </Block>

          <Block id="features" title={t.features}>
            <ul className={`${bulletList} sm:columns-2 sm:gap-10 [&>li]:break-inside-avoid`}>
              {copy.features.map((feature) => (
                <li key={feature} className={`${bullet} mb-2.5`}>
                  <Rich text={feature} />
                </li>
              ))}
            </ul>
          </Block>

          {project.diagram && (
            <Block id="architecture" title={t.architecture}>
              <figure>
                <div className="overflow-x-auto rounded-xl border border-line bg-surface p-3 sm:p-4">
                  <ArchDiagram
                    diagram={project.diagram}
                    locale={locale}
                    id={`diagram-${slug}`}
                    title={`${t.architecture}: ${copy.title}`}
                  />
                </div>
                <figcaption className="mt-3 text-sm">{t.architectureNote}</figcaption>
              </figure>
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-mono text-xs hover:text-fg">
                  {t.diagramList}
                </summary>
                <ul className="mt-3 space-y-1 font-mono text-xs">
                  {diagramAsText(project.diagram, locale).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>
            </Block>
          )}

          {copy.challenges.length > 0 && (
            <Block id="challenges" title={t.challenges}>
              <ul className="space-y-4">
                {copy.challenges.map((challenge) => (
                  <li
                    key={challenge.title}
                    className="rounded-xl border border-line bg-surface p-5 sm:p-6"
                  >
                    <h3 className="font-bold text-fg stretch-semi">
                      <Rich text={challenge.title} />
                    </h3>
                    <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
                      <dt className="font-mono text-xs tracking-wider uppercase sm:pt-0.5">
                        {t.challengeProblem}
                      </dt>
                      <dd>
                        <Rich text={challenge.problem} />
                      </dd>
                      <dt className="font-mono text-xs tracking-wider text-accent-text uppercase sm:pt-0.5">
                        {t.challengeSolution}
                      </dt>
                      <dd className="text-fg">
                        <Rich text={challenge.solution} />
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {copy.learned.length > 0 && (
            <Block id="learned" title={t.learned}>
              <ul className={bulletList}>
                {copy.learned.map((item) => (
                  <li key={item} className={bullet}>
                    <Rich text={item} />
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block id="screenshots" title={t.screenshots}>
            <div className="grid place-items-center rounded-xl border border-dashed border-line px-6 py-12 text-center text-sm">
              <Rich text={t.screenshotsTodo} />
            </div>
          </Block>

          <nav
            aria-label={dict.projects.title}
            className="grid gap-4 border-t border-line pt-10 sm:grid-cols-2"
          >
            {prev && (
              <Link
                href={projectPath(locale, prev.slug)}
                className="group rounded-xl border border-line p-5 transition hover:border-accent/60"
              >
                <span className="flex items-center gap-2 font-mono text-xs text-muted">
                  <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />{" "}
                  {t.prev}
                </span>
                <span className="mt-2 block font-bold stretch-semi">{prev[locale].title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={projectPath(locale, next.slug)}
                className="group rounded-xl border border-line p-5 text-right transition hover:border-accent/60 sm:col-start-2"
              >
                <span className="flex items-center justify-end gap-2 font-mono text-xs text-muted">
                  {t.next}{" "}
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
                <span className="mt-2 block font-bold stretch-semi">{next[locale].title}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}
