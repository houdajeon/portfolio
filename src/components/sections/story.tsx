import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { pick } from "@/i18n/format";
import { withBasePath } from "@/lib/content";
import type { JourneyData } from "@/lib/schemas";
import { FallingPetals } from "@/components/ui/flowers";
import { LitText } from "@/components/ui/lit-text";
import { Reveal } from "@/components/ui/reveal";
import { RiseWords } from "@/components/ui/rise-words";
import { StoryScene } from "@/components/ui/story-scene";
import { Timeline } from "./timeline";

function Heading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="font-mono text-xs tracking-wider text-muted">
        <span className="text-accent-text">{"//"}</span> {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-3xl font-extrabold tracking-tight stretch-wide">
        <RiseWords text={title} />
      </h2>
    </Reveal>
  );
}

/**
 * About and Journey as one scene with Killua (Hunter × Hunter). On large screens the video
 * is pinned and the scroll plays it: his eyes in the dark, a flash, then lightning in his
 * right hand brings out the About panel, which stays; lightning in his left hand brings
 * out the Journey panel next to it. StoryScene drives it. On phones (and with reduced
 * motion) it is a still picture followed by the two panels.
 *
 * The #about / #journey ids are on two invisible markers (data-mark), placed where each
 * panel is fully out, so the menu links and the menu highlight work like for any section.
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
    // A night scene in both themes: `dark` switches its colors to the dark ones.
    <StoryScene
      video={withBasePath("/videos/killua-scene.mp4")}
      className="story dark relative border-t border-line bg-bg text-fg"
    >
      <span id="about" data-mark="" aria-hidden="true" className="story-mark story-mark-about" />
      <span
        id="journey"
        data-mark=""
        aria-hidden="true"
        className="story-mark story-mark-journey"
      />

      <div className="story-backdrop">
        <div className="story-stage">
          <div className="story-media">
            {/* Decorative artwork: it says nothing about the content, so no alt text. */}
            <video
              aria-hidden="true"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              className="story-video"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath("/images/killua-poster.webp")}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              className="story-poster"
            />
          </div>
          <div aria-hidden="true" className="story-petals absolute inset-0">
            <FallingPetals />
          </div>

          <div className="story-panels page-wrap">
            <div data-panel="" className="story-panel story-panel-about">
              <section aria-labelledby="about-title" className="story-card">
                <div className="story-content">
                  <Heading id="about-title" eyebrow={t.eyebrow} title={t.title} />
                  <LitText
                    paragraphs={t.paragraphs}
                    className="mt-5 space-y-4 leading-relaxed text-muted"
                  />
                  <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-line bg-bg/60 p-4 text-sm">
                    {facts.map(([label, value]) => (
                      <div key={label}>
                        <dt className="font-mono text-xs text-muted">{label}</dt>
                        <dd className="mt-0.5 font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>
            </div>

            <div data-panel="" className="story-panel story-panel-journey">
              <section aria-labelledby="journey-title" className="story-card">
                <div className="story-content">
                  <Heading
                    id="journey-title"
                    eyebrow={dict.journey.eyebrow}
                    title={dict.journey.title}
                  />
                  <div className="mt-7">
                    <Timeline steps={steps} />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </StoryScene>
  );
}
