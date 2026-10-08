import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { pick } from "@/i18n/format";
import { withBasePath } from "@/lib/content";
import type { JourneyData } from "@/lib/schemas";
import { FallingPetals } from "@/components/ui/flowers";
import { HANDS, Lightning } from "@/components/ui/lightning";
import { LitText } from "@/components/ui/lit-text";
import { Reveal } from "@/components/ui/reveal";
import { RiseWords } from "@/components/ui/rise-words";
import { StoryScene } from "@/components/ui/story-scene";
import { Timeline } from "./timeline";

/** The picture is 736×494; positions on it are given in % so they follow its size. */
const at = (x: number, y: number) =>
  ({ left: `${(x / 736) * 100}%`, top: `${(y / 494) * 100}%` }) as CSSProperties;
const EYES = [at(289, 114), at(343, 114)];

function Heading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="font-mono text-xs tracking-wider text-muted">
        <span className="text-accent-text">{"//"}</span> {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-3xl font-extrabold tracking-tight stretch-wide sm:text-[2.1rem]"
      >
        <RiseWords text={title} />
      </h2>
    </Reveal>
  );
}

/**
 * About and Journey as one scene with Killua (Hunter × Hunter): he appears in the dark,
 * then the About panel comes out of the lightning in his first hand and the Journey panel
 * out of the second. The picture stays pinned behind; the panels scroll over it, so long
 * text still fits and the #about / #journey links work as usual. StoryScene drives it.
 */
export function Story({
  locale,
  dict,
  journey,
}: {
  locale: Locale;
  dict: Messages;
  journey: JourneyData;
}) {
  const t = dict.about;
  const facts = [
    [t.facts.school, t.facts.schoolValue],
    [t.facts.focus, t.facts.focusValue],
    [t.facts.languages, t.facts.languagesValue],
    [t.facts.based, t.facts.basedValue],
  ];
  // Resolve the language here (server side); the client timeline only gets plain strings.
  const steps = journey.map((step) => ({
    key: step.title.en,
    date: step.date ? pick(step.date, locale) : null,
    title: step.title[locale],
    body: step.body[locale],
    current: step.current,
  }));

  return (
    // The scene is a night scene in both themes: `dark` switches its colors to the dark ones.
    <StoryScene className="story dark relative border-t border-line bg-bg text-fg">
      <div className="story-backdrop">
        <div className="story-stage">
          <div aria-hidden="true" className="story-aura absolute inset-0" />
          <div aria-hidden="true" className="story-petals absolute inset-0">
            <FallingPetals />
          </div>
          <figure className="story-figure">
            {/* Decorative artwork: it says nothing about the content, so no alt text. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath("/images/killua-lightning.webp")}
              alt=""
              width={736}
              height={494}
              loading="lazy"
              decoding="async"
              className="story-killua block h-auto w-full"
            />
            {EYES.map((style, i) => (
              <span key={i} aria-hidden="true" className="story-eye" style={style} />
            ))}
            {HANDS.map((hand, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`story-hand story-hand-${i + 1}`}
                style={at(hand.x, hand.y)}
              />
            ))}
            <Lightning className="story-bolts" />
          </figure>
          <div aria-hidden="true" className="story-flash absolute inset-0" />
          <div aria-hidden="true" className="story-flash-1 absolute inset-0" />
          <div aria-hidden="true" className="story-flash-2 absolute inset-0" />
        </div>
      </div>

      <div className="story-flow relative page-wrap">
        <div aria-hidden="true" className="story-spacer story-spacer-intro" />

        <div data-panel="" className="story-panel story-panel-1">
          <section id="about" aria-labelledby="about-title" className="story-card">
            <Heading id="about-title" eyebrow={t.eyebrow} title={t.title} />
            <LitText
              paragraphs={t.paragraphs}
              className="mt-6 space-y-4 leading-relaxed text-muted"
            />
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-line bg-bg/60 p-4 text-sm">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-xs text-muted">{label}</dt>
                  <dd className="mt-0.5 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div aria-hidden="true" className="story-spacer story-spacer-gap" />

        <div data-panel="" className="story-panel story-panel-2">
          <section id="journey" aria-labelledby="journey-title" className="story-card">
            <Heading id="journey-title" eyebrow={dict.journey.eyebrow} title={dict.journey.title} />
            <div className="mt-8">
              <Timeline steps={steps} />
            </div>
          </section>
        </div>

        <div aria-hidden="true" className="story-spacer story-spacer-end" />
      </div>
    </StoryScene>
  );
}
