import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { format } from "@/i18n/format";
import type { Messages } from "@/i18n/dictionaries";
import { withBasePath, type Project } from "@/lib/content";
import type { ProjectCopy } from "@/lib/schemas";
import { categoryLabel, teamLabel } from "@/components/sections/projects";
import { ArrowLeft, External, GitHub } from "@/components/ui/icons";
import { Rich, richParts, isText } from "@/components/ui/rich";

/** What every vibe's header receives. */
export type HeroProps = {
  project: Project;
  copy: ProjectCopy;
  locale: Locale;
  dict: Messages;
};

/** Category and team, already in the page's language ("Full-stack", "Team of 5"). */
export function facts({ project, dict }: HeroProps) {
  return {
    category: categoryLabel(project.categories, dict.projects),
    team: teamLabel(project.teamSize, dict.projects),
  };
}

export function BackLink({ locale, label }: { locale: Locale; label: string }) {
  return (
    <Link href={`${localePath(locale)}#projects`} className="cs-back">
      <ArrowLeft className="size-3.5" />
      {label}
    </Link>
  );
}

/** Source code and live demo, or the visible placeholder while the repository is private. */
export function ProjectLinks({ project, dict }: Pick<HeroProps, "project" | "dict">) {
  const t = dict.caseStudy;
  return (
    <div className="cs-links">
      {project.repo ? (
        <a href={project.repo} className="cs-link">
          <GitHub /> {t.repo}
        </a>
      ) : (
        <span className="text-sm">
          <Rich text={t.repoTodo} />
        </span>
      )}
      {project.demo && (
        <a href={project.demo} className="cs-link">
          <External /> {t.demo}
        </a>
      )}
      {project.video?.link && (
        <a href={project.video.link} className="cs-link" rel="noopener">
          <External /> {t.watchOnLinkedIn}
        </a>
      )}
    </div>
  );
}

export function StackList({ stack, className = "" }: { stack: string[]; className?: string }) {
  return (
    <ul className={`cs-stack ${className}`}>
      {stack.map((item) => (
        <li key={item}>
          <Rich text={item} />
        </li>
      ))}
    </ul>
  );
}

/** Words of real content only: code marks are kept, [TODO] placeholders are not counted. */
function words(text: string) {
  return richParts(text).filter(isText).join(" ").split(/\s+/).filter(Boolean).length;
}

/** Reading time of the case study at 200 words a minute. */
export function readingMinutes(copy: ProjectCopy) {
  const all = [
    copy.summary,
    copy.problem,
    copy.role,
    ...copy.features,
    ...copy.challenges.flatMap((c) => [c.title, c.problem, c.solution]),
    ...copy.learned,
  ];
  return Math.max(1, Math.round(all.reduce((n, text) => n + words(text), 0) / 200));
}

/** The `code` words of a content string, e.g. the 13 commands listed in one 0-shell feature. */
export function codeWords(text: string) {
  return richParts(text)
    .filter((part) => part.length > 2 && part.startsWith("`") && part.endsWith("`"))
    .map((part) => part.slice(1, -1));
}

/** "API Gateway" → "api-gateway": a diagram label written as a service or resource name. */
export const slugify = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The project's recorded demo: nothing loads until the visitor presses play (preload="none"),
 * the poster shows meanwhile. Plain <video>: a static export has no image or video optimizer.
 */
export function DemoVideo({ project, copy, dict }: Pick<HeroProps, "project" | "copy" | "dict">) {
  if (!project.video) return null;
  return (
    <video
      className="cs-video"
      src={withBasePath(project.video.src)}
      poster={withBasePath(project.video.poster)}
      controls
      muted
      playsInline
      preload="none"
      width={1280}
      height={720}
      aria-label={format(dict.caseStudy.videoLabel, { title: copy.title })}
    />
  );
}
