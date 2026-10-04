import type { Messages } from "@/i18n/dictionaries";
import type { Site } from "@/lib/schemas";
import { Rich } from "@/components/ui/rich";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

export function About({ dict, site }: { dict: Messages; site: Site }) {
  const t = dict.about;
  const facts = [
    [t.facts.school, t.facts.schoolValue],
    [t.facts.focus, t.facts.focusValue],
    [t.facts.languages, t.facts.languagesValue],
    [t.facts.based, t.facts.basedValue],
  ];

  return (
    <Section id="about" eyebrow={t.eyebrow} title={t.title}>
      <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
        <Reveal className="max-w-xs lg:max-w-none">
          {site.photo ? (
            // A plain <img>: images are served as-is (see next.config.ts), so next/image would
            // only add its client-side code to the page.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.photo}
              alt={t.photoAlt}
              width={600}
              height={750}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-xl border border-line object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-line bg-surface p-6 text-center">
              <span className="font-mono text-6xl font-bold text-accent-text">hh</span>
              <span className="text-sm">
                <Rich text={t.photoTodo} />
              </span>
            </div>
          )}
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120} className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
          {t.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>
              <Rich text={paragraph} />
            </p>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
