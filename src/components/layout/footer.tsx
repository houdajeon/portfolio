import type { Messages } from "@/i18n/dictionaries";
import type { Site } from "@/lib/schemas";
import { ArrowUp, GitHub, LinkedIn } from "@/components/ui/icons";
import { Logo } from "./header";

const iconLink =
  "grid size-9 place-items-center rounded-md border border-line text-muted transition hover:border-muted hover:text-fg";

export function Footer({ dict, site }: { dict: Messages; site: Site }) {
  return (
    <footer className="border-t border-line">
      <div className="page-wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted">{dict.footer.built}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
        <ul className="flex items-center gap-2">
          <li>
            <a href={site.github} className={iconLink} aria-label="GitHub" rel="me noopener">
              <GitHub />
            </a>
          </li>
          <li>
            <a href={site.linkedin} className={iconLink} aria-label="LinkedIn" rel="me noopener">
              <LinkedIn />
            </a>
          </li>
          <li>
            <a href="#main" className={iconLink} aria-label={dict.footer.top}>
              <ArrowUp />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
