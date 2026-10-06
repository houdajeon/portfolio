import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import type { Locale } from "@/i18n/config";
import {
  communitySchema,
  journeySchema,
  projectCopySchema,
  projectMetaSchema,
  siteSchema,
  skillsSchema,
  type ProjectCopy,
  type ProjectMeta,
} from "./schemas";

// Content is read from disk at build time only (static export), so it never reaches
// the browser bundle. Adding a project = adding a folder in content/projects/.

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson<S extends z.ZodType>(schema: S, ...segments: string[]): z.infer<S> {
  const file = path.join(CONTENT_DIR, ...segments);
  const raw: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${path.relative(process.cwd(), file)}:\n${result.error.message}`,
    );
  }
  return result.data;
}

// next/link adds the base path by itself, but plain <img> and <a download> paths don't.
export const withBasePath = <T extends string | null>(file: T): T =>
  (file && (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + file) as T;

export function getSite() {
  const site = readJson(siteSchema, "site.json");
  return {
    ...site,
    photo: withBasePath(site.photo),
    cv: { en: withBasePath(site.cv.en), fr: withBasePath(site.cv.fr) },
  };
}
export const getSkills = () => readJson(skillsSchema, "skills.json");
export const getJourney = () => readJson(journeySchema, "journey.json");
export const getCommunity = () => readJson(communitySchema, "community.json");

export type Project = ProjectMeta & { slug: string } & Record<Locale, ProjectCopy>;

let projectsCache: Project[] | undefined;

/** All projects, sorted by `order`. */
export function getProjects(): Project[] {
  if (projectsCache) return projectsCache;
  const dir = path.join(CONTENT_DIR, "projects");
  projectsCache = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name: slug }) => ({
      slug,
      ...readJson(projectMetaSchema, "projects", slug, "meta.json"),
      en: readJson(projectCopySchema, "projects", slug, "en.json"),
      fr: readJson(projectCopySchema, "projects", slug, "fr.json"),
    }))
    .sort((a, b) => a.order - b.order);
  return projectsCache;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
