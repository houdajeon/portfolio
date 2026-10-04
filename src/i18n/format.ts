import type { Locale, Localized } from "./config";

// No dictionary imports here: client components can use these helpers
// without pulling every translation into the browser bundle.

/** Replaces `{name}` placeholders: format("Team of {n}", { n: 3 }) → "Team of 3". */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

/** Picks the right language from a label that may be shared or translated. */
export function pick(value: string | Localized, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}
