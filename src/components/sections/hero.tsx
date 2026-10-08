import Link from "next/link";
import type { CSSProperties } from "react";
import { otherLocale, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import type { Site } from "@/lib/schemas";
import { buttonStyles } from "@/components/ui/button-styles";
import { FlowerLayer } from "@/components/ui/flowers";
import { ArrowRight, Download } from "@/components/ui/icons";
import { Parallax } from "@/components/ui/parallax";

/** Delay for the CSS load animations (`rise`, `unveil`, `bloom` in globals.css). */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** The photo in an arch, between two layers of flowers. It tilts towards the mouse. */
function PhotoArch({
  photo,
  alt,
  className,
}: {
  photo: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-[min(68vw,280px)] lg:w-[300px] ${className ?? ""}`}>
      <div aria-hidden="true" className="arch-glow depth-back absolute -inset-[30%]" />
      <FlowerLayer layer="back" className="depth-1" />
      <div className="unveil relative aspect-[3/4]" style={delay(250)}>
        <div className="tilt relative size-full overflow-hidden rounded-t-full rounded-b-3xl border border-line bg-surface shadow-glow">
          {photo ? (
            // A plain <img>: images are served as-is (see next.config.ts), so next/image would
            // only add its client-side code to the page.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={alt}
              width={460}
              height={460}
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover object-[56%_30%]"
            />
          ) : (
            <span className="grid size-full place-items-center font-mono text-6xl font-bold text-accent-text">
              hh
            </span>
          )}
          <div aria-hidden="true" className="arch-sheen absolute inset-0" />
        </div>
      </div>
      <FlowerLayer layer="front" className="depth-2" />
    </div>
  );
}

export function Hero({ locale, dict, site }: { locale: Locale; dict: Messages; site: Site }) {
  const t = dict.hero;
  const cv = site.cv[locale] ?? site.cv[otherLocale(locale)];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <Parallax className="relative page-wrap pt-10 pb-16 sm:pt-14 lg:pb-24">
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

        {/* The name fills the page width at every screen size (font size in container units). */}
        <div className="depth-back @container mt-8">
          <h1 id="hero-title" className="hero-title rise" style={delay(100)}>
            {t.title}
          </h1>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:mt-0 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <PhotoArch
            photo={site.photo}
            alt={dict.about.photoAlt}
            className="lg:col-start-2 lg:row-start-1 lg:-mt-11"
          />
          <div className="rise lg:col-start-1 lg:row-start-1" style={delay(450)}>
            <p className="font-mono text-xs tracking-wider text-accent-text uppercase">
              {t.kicker}
            </p>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">{t.lede}</p>
          </div>
          <div
            className="flex rise flex-wrap gap-3 lg:col-start-3 lg:row-start-1 lg:flex-col lg:items-end"
            style={delay(550)}
          >
            <Link href="#projects" className={`${buttonStyles.bloom} group`}>
              {t.ctaProjects}
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
            {cv ? (
              <a href={cv} download className={buttonStyles.pill}>
                <Download className="size-4" />
                {t.ctaCv}
              </a>
            ) : (
              <span
                aria-disabled="true"
                className={`${buttonStyles.pill} cursor-not-allowed opacity-60`}
              >
                <Download className="size-4" />
                {t.cvSoon}
              </span>
            )}
          </div>
        </div>
      </Parallax>
    </section>
  );
}
