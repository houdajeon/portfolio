import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { LocaleSwitch } from "./locale-switch";
import { MobileNav } from "./mobile-nav";
import { ScrollProgress } from "./scroll-progress";
import { SectionNav } from "./section-nav";
import { ThemeToggle } from "./theme-toggle";

export function Logo() {
  return (
    <span className="font-mono text-sm font-medium">
      houda-hdili<span className="text-accent-text">/</span>
      <span className="text-muted">portfolio</span>
    </span>
  );
}

export function Header({ locale, dict }: { locale: Locale; dict: Messages }) {
  const home = localePath(locale);
  const sections = ["about", "skills", "projects", "journey", "community", "contact"] as const;
  const links = sections.map((id) => ({ id, href: `${home}#${id}`, label: dict.nav[id] }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="page-wrap flex h-16 items-center justify-between gap-4">
        <Link href={home} aria-label={dict.nav.home} className="rounded-sm">
          <Logo />
        </Link>

        <SectionNav links={links} label={dict.nav.main} />

        <div className="flex items-center gap-1">
          <LocaleSwitch locale={locale} label={dict.locale.switchLabel} short={dict.locale.short} />
          <ThemeToggle toDark={dict.theme.toDark} toLight={dict.theme.toLight} />
          <MobileNav
            links={links}
            openLabel={dict.nav.openMenu}
            closeLabel={dict.nav.closeMenu}
            navLabel={dict.nav.main}
          />
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}
