export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** The language the header switch leads to. */
export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "fr" : "en");

/** Builds an internal link with the locale prefix and the trailing slash GitHub Pages expects. */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export const projectPath = (locale: Locale, slug: string) => localePath(locale, `projects/${slug}`);

/** hreflang links for a page: every translation, plus the default language for everyone else. */
export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, localePath(locale, path)])),
    "x-default": localePath(defaultLocale, path),
  };
}

/** Text that exists in both languages. */
export type Localized = Record<Locale, string>;
