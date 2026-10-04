import type { MetadataRoute } from "next";
import { localePath, locales } from "@/i18n/config";
import { getProjects, getSite } from "@/lib/content";

export const dynamic = "force-static";

/** Every page in both languages, each pointing at its translation (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = getSite();
  const pages = ["", ...getProjects().map((project) => `projects/${project.slug}`)];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: url + localePath(locale, page),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, url + localePath(l, page)])),
      },
    })),
  );
}
