import type { CSSProperties } from "react";
import type { Messages } from "@/i18n/dictionaries";
import { withBasePath } from "@/lib/content";
import { AboutScene } from "@/components/ui/about-scene";
import { Lightning } from "@/components/ui/lightning";
import { LitText } from "@/components/ui/lit-text";
import { Reveal } from "@/components/ui/reveal";
import { RiseWords } from "@/components/ui/rise-words";

/** Order of the blocks coming out of the light (title, text, facts). */
const order = (k: number) => ({ "--k": k }) as CSSProperties;

/**
 * Killua (Hunter × Hunter) with lightning leaving his hand, and the About text coming out of
 * the light. On large screens the section is a pinned scroll scene (AboutScene); on phones
 * and with reduced motion it is a normal section with the poster above the text.
 */
export function About({ dict }: { dict: Messages }) {
  const t = dict.about;
  const facts = [
    [t.facts.school, t.facts.schoolValue],
    [t.facts.focus, t.facts.focusValue],
    [t.facts.languages, t.facts.languagesValue],
    [t.facts.based, t.facts.basedValue],
  ];

  return (
    <AboutScene className="about-scene relative border-t border-line">
      <div className="about-stage">
        <div className="page-wrap grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
            <figure className="killua relative mx-auto lg:w-[min(25rem,calc((100dvh-10rem)*0.84))]">
              <div className="killua-frame relative overflow-hidden rounded-2xl border border-line">
                {/* Decorative artwork: it says nothing about the content, so no alt text. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBasePath("/images/killua.webp")}
                  alt=""
                  width={736}
                  height={875}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
                <div aria-hidden="true" className="killua-flash absolute inset-0" />
              </div>
              <div aria-hidden="true" className="hand-glow" />
              <Lightning className="bolts hidden lg:block" />
            </figure>
          </Reveal>

          <div className="emerge">
            <Reveal className="emerge-part" style={order(0)}>
              <p className="font-mono text-xs tracking-wider text-muted">
                <span className="text-accent-text">{"//"}</span> {t.eyebrow}
              </p>
              <h2
                id="about-title"
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight stretch-wide sm:text-4xl"
              >
                <RiseWords text={t.title} />
              </h2>
            </Reveal>
            <Reveal
              delay={120}
              className="emerge-part mt-8 max-w-2xl text-lg leading-relaxed text-muted"
              style={order(1)}
            >
              <LitText paragraphs={t.paragraphs} className="space-y-5" />
            </Reveal>
            <Reveal delay={200} className="emerge-part mt-8" style={order(2)}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-line bg-surface p-5 text-sm sm:grid-cols-4">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-xs text-muted">{label}</dt>
                    <dd className="mt-0.5 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </AboutScene>
  );
}
