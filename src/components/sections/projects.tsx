import { projectPath, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { format } from "@/i18n/format";
import type { Project } from "@/lib/content";
import { categorySchema, type Category } from "@/lib/schemas";
import { Section } from "@/components/ui/section";
import { ProjectGrid, type FilterId, type ProjectCard } from "./project-grid";

export function teamLabel(teamSize: number | null, t: Messages["projects"]): string {
  if (teamSize === null) return t.teamTodo;
  return teamSize === 1 ? t.solo : format(t.team, { n: teamSize });
}

export function categoryLabel(categories: Category[], t: Messages["projects"]): string {
  return categories.map((category) => t.filters[category]).join(" · ");
}

export function Projects({
  locale,
  dict,
  projects,
}: {
  locale: Locale;
  dict: Messages;
  projects: Project[];
}) {
  const t = dict.projects;

  const cards: ProjectCard[] = projects.map((p) => ({
    slug: p.slug,
    href: projectPath(locale, p.slug),
    title: p[locale].title,
    tagline: p[locale].tagline,
    categories: p.categories,
    categoryLabel: categoryLabel(p.categories, t),
    team: teamLabel(p.teamSize, t),
    stack: p.stack.slice(0, 4),
  }));

  // Only show filters that match at least one project.
  const filters = (["all", ...categorySchema.options] satisfies FilterId[])
    .map((id) => ({
      id,
      label: t.filters[id],
      count: id === "all" ? cards.length : cards.filter((c) => c.categories.includes(id)).length,
    }))
    .filter((f) => f.count > 0);

  return (
    <Section id="projects" eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
      <ProjectGrid
        cards={cards}
        filters={filters}
        labels={{ filter: t.filterLabel, count: t.count, readCase: t.readCase }}
      />
    </Section>
  );
}
