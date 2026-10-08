import type { Messages } from "@/i18n/dictionaries";
import { LitText } from "@/components/ui/lit-text";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { Flower } from "@/components/garden/flower";

export function About({ dict }: { dict: Messages }) {
  const t = dict.about;
  const facts = [
    [t.facts.school, t.facts.schoolValue],
    [t.facts.focus, t.facts.focusValue],
    [t.facts.languages, t.facts.languagesValue],
    [t.facts.based, t.facts.basedValue],
  ];

  return (
    <Section id="about" eyebrow={t.eyebrow} title={t.title} bloom="bl-violet">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <LitText
          paragraphs={t.paragraphs}
          className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted"
        />
        <Reveal delay={150} className="relative">
          <Flower
            type="rose-pink"
            size={44}
            delay={500}
            sway
            className="absolute -top-4 -right-3 z-10"
          />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-line bg-surface/85 p-6 text-sm backdrop-blur">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
