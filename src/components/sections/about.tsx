import type { Messages } from "@/i18n/dictionaries";
import { LitText } from "@/components/ui/lit-text";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

export function About({ dict }: { dict: Messages }) {
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
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-line bg-surface p-5 text-sm">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120} className="max-w-2xl text-lg leading-relaxed text-muted">
          <LitText paragraphs={t.paragraphs} className="space-y-5" />
        </Reveal>
      </div>
    </Section>
  );
}
