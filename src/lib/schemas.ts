import { z } from "zod";

// Every content file is validated at build time. A typo or a missing field
// fails `npm run build` (and CI) instead of shipping a broken page.

const localized = z.object({ en: z.string().min(1), fr: z.string().min(1) });
/** A label that is either the same in both languages or translated. */
const label = z.union([z.string().min(1), localized]);

export const categorySchema = z.enum(["fullstack", "backend", "systems", "game", "devops"]);
export type Category = z.infer<typeof categorySchema>;

// ---------- architecture diagram (drawn as SVG from data, see components/project/arch-diagram.tsx)

const cell = z.tuple([z.number().int().min(0), z.number().int().min(0)]);

const diagramSchema = z
  .object({
    cols: z.number().int().min(1),
    rows: z.number().int().min(1),
    nodes: z
      .array(
        z.object({
          id: z.string().min(1),
          label,
          sub: label.optional(),
          at: cell,
          kind: z.enum(["client", "app", "data", "queue"]).default("app"),
        }),
      )
      .min(1),
    edges: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: label.optional(),
        both: z.boolean().default(false),
        dashed: z.boolean().default(false),
      }),
    ),
    groups: z.array(z.object({ label, from: cell, to: cell })).default([]),
  })
  .superRefine((diagram, ctx) => {
    const ids = new Set(diagram.nodes.map((node) => node.id));
    diagram.edges.forEach((edge, index) => {
      for (const end of ["from", "to"] as const) {
        if (!ids.has(edge[end])) {
          ctx.addIssue({
            code: "custom",
            message: `unknown node "${edge[end]}"`,
            path: ["edges", index, end],
          });
        }
      }
    });
  });
export type Diagram = z.infer<typeof diagramSchema>;

// ---------- projects: meta.json (facts shared by both languages) + en.json / fr.json (copy)

export const projectMetaSchema = z.object({
  order: z.number().int(),
  categories: z.array(categorySchema).min(1),
  stack: z.array(z.string().min(1)).min(1),
  /** null = not provided yet, rendered as a visible TODO */
  teamSize: z.number().int().positive().nullable(),
  repo: z.url().nullable(),
  demo: z.url().nullable(),
  diagram: diagramSchema.nullable(),
});

export const projectCopySchema = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  problem: z.string().min(1),
  role: z.string().min(1),
  features: z.array(z.string().min(1)).min(1),
  challenges: z.array(
    z.object({
      title: z.string().min(1),
      problem: z.string().min(1),
      solution: z.string().min(1),
    }),
  ),
  learned: z.array(z.string().min(1)),
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;
export type ProjectCopy = z.infer<typeof projectCopySchema>;

// ---------- site, skills, journey, community

export const siteSchema = z.object({
  name: z.string(),
  url: z.url(),
  email: z.email().nullable(),
  github: z.url(),
  linkedin: z.url(),
  /** path under /public, e.g. "/images/profile.webp" */
  photo: z.string().startsWith("/").nullable(),
  cv: z.object({
    en: z.string().startsWith("/").nullable(),
    fr: z.string().startsWith("/").nullable(),
  }),
  /** Public access key of the form service (safe to expose). */
  contactFormKey: z.string().nullable(),
});
export type Site = z.infer<typeof siteSchema>;

export const skillLevelSchema = z.enum(["used", "familiar", "learning"]);
export type SkillLevel = z.infer<typeof skillLevelSchema>;

export const skillsSchema = z.object({
  groups: z.array(
    z.object({
      id: z.string(),
      label: localized,
      items: z.array(
        z.object({
          name: z.string(),
          level: skillLevelSchema,
          /** slugs of projects that prove the skill */
          projects: z.array(z.string()).default([]),
          /** where it was used, when there is no project page to link to */
          note: localized.optional(),
        }),
      ),
    }),
  ),
});
export type SkillsData = z.infer<typeof skillsSchema>;

export const journeySchema = z.array(
  z.object({
    /** optional: a step without a date simply has no date line */
    date: label.optional(),
    title: localized,
    body: localized,
    current: z.boolean().default(false),
  }),
);
export type JourneyData = z.infer<typeof journeySchema>;

export const communitySchema = z.object({
  club: z.object({
    name: z.string(),
    description: localized,
    roles: z.array(localized),
  }),
  events: z.array(
    z.object({
      name: z.string(),
      date: label,
      role: localized,
      partners: z.array(z.string()).default([]),
    }),
  ),
});
export type CommunityData = z.infer<typeof communitySchema>;
