import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { otherLocale, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import type { Site } from "@/lib/schemas";
import { buttonStyles } from "@/components/ui/button-styles";
import { ArrowRight, Download } from "@/components/ui/icons";
import { Cursor, Prompt, TerminalWindow } from "@/components/ui/terminal";

/** Delay for the CSS load animations (`rise`, `appear` in globals.css). */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** One terminal line that shows up after `at` ms, so the session looks typed. */
function Line({
  at,
  className,
  children,
}: {
  at: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`appear ${className ?? ""}`} style={delay(at)}>
      {children}
    </div>
  );
}

/** Decorative terminal: repeats the hero facts, so it is hidden from screen readers. */
function HeroTerminal({ t }: { t: Messages["hero"]["terminal"] }) {
  return (
    <TerminalWindow decorative title={t.title} className="hidden rise sm:block" style={delay(250)}>
      <div className="space-y-1.5">
        <Line at={600}>
          <Prompt>whoami</Prompt>
        </Line>
        <Line at={850}>houda-hdili · {t.role}</Line>
        <Line at={1150}>
          <Prompt>cat stack.txt</Prompt>
        </Line>
        <Line at={1400} className="text-muted">
          go · java · rust · spring-boot · next.js · angular
        </Line>
        <Line at={1500} className="text-muted">
          docker · k3s · postgres · rabbitmq · linux
        </Line>
        <Line at={1800}>
          <Prompt>kubectl get candidate houda</Prompt>
        </Line>
        <Line at={2100} className="grid grid-cols-[auto_auto_1fr] gap-x-6 whitespace-nowrap">
          <span className="text-muted">NAME</span>
          <span className="text-muted">STATUS</span>
          <span className="text-muted">ROLE</span>
          <span>houda</span>
          <span className="text-ok">{t.status}</span>
          <span>{t.roleShort}</span>
        </Line>
        <Line at={2300}>
          <Prompt>
            <Cursor />
          </Prompt>
        </Line>
      </div>
    </TerminalWindow>
  );
}

export function Hero({ locale, dict, site }: { locale: Locale; dict: Messages; site: Site }) {
  const t = dict.hero;
  const cv = site.cv[locale] ?? site.cv[otherLocale(locale)];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-glow" />
      <div className="relative page-wrap grid items-center gap-12 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28">
        <div>
          <p
            className="inline-flex rise items-center gap-2.5 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs"
            style={delay(0)}
          >
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-ok" />
            </span>
            <span>
              {t.status} <span className="text-muted">· {dict.about.facts.basedValue}</span>
            </span>
          </p>

          <p className="mt-8 rise font-mono text-sm text-muted" style={delay(80)}>
            {t.kicker}
          </p>
          <h1
            id="hero-title"
            className="mt-3 rise text-5xl leading-[0.95] font-extrabold tracking-tight stretch-wide sm:text-6xl lg:text-7xl"
            style={delay(140)}
          >
            {t.titleStart}
            <br />
            {t.titleMiddle}{" "}
            <span className="bg-gradient-to-r from-accent to-accent-text bg-clip-text text-transparent">
              {t.titleAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-xl rise text-lg text-muted" style={delay(220)}>
            {t.lede}
          </p>

          <div className="mt-8 flex rise flex-wrap gap-3" style={delay(300)}>
            <Link href="#projects" className={`${buttonStyles.primary} group`}>
              {t.ctaProjects}
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
            {cv ? (
              <a href={cv} download className={buttonStyles.ghost}>
                <Download className="size-4" />
                {t.ctaCv}
              </a>
            ) : (
              <span
                aria-disabled="true"
                className={`${buttonStyles.ghost} cursor-not-allowed opacity-60`}
              >
                <Download className="size-4" />
                {t.cvSoon}
              </span>
            )}
          </div>
        </div>

        <HeroTerminal t={t.terminal} />
      </div>
    </section>
  );
}
