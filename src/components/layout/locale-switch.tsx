"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { localePath, otherLocale, type Locale } from "@/i18n/config";

/** The section crossing the middle of the screen, so the other language opens at the same place. */
function currentSectionId(): string | null {
  const middle = window.innerHeight / 2;
  const sections = document.querySelectorAll<HTMLElement>("main section[id]");
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= middle && rect.bottom > middle) return section.id === "top" ? null : section.id;
  }
  return null;
}

/**
 * Links to the same page in the other language, and remembers the choice for the next visit.
 * A plain <a> on purpose: the language is the root layout's parameter (<html lang>), so a
 * full page load is the reliable way to swap it. A client-side <Link> re-renders the whole
 * <html> and its inline scripts, which React reports as an error.
 */
export function LocaleSwitch({
  locale,
  label,
  short,
}: {
  locale: Locale;
  label: string;
  short: string;
}) {
  const target = otherLocale(locale);
  // Same page, other language: "/en/projects/x/" → "/fr/projects/x/".
  const href = localePath(target, usePathname().slice(`/${locale}`.length));

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    try {
      localStorage.setItem("locale", target);
    } catch {
      // Storage blocked: the link still works.
    }
    // Keep the reader where they are: /en/ while reading "Skills" → /fr/#skills.
    // The browser follows the href as it is after this handler, so updating it is enough.
    const section = currentSectionId();
    event.currentTarget.href = section ? `${href}#${section}` : href;
  }

  return (
    <a
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-9 min-w-9 place-items-center rounded-md px-2 font-mono text-xs font-medium text-muted transition hover:bg-raised hover:text-fg"
    >
      {short}
    </a>
  );
}
