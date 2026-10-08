import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { pick } from "@/i18n/format";
import type { JourneyData } from "@/lib/schemas";
import { Section } from "@/components/ui/section";
import { Timeline } from "./timeline";

export function Journey({
  locale,
  dict,
  journey,
}: {
  locale: Locale;
  dict: Messages;
  journey: JourneyData;
}) {
  // Resolve the language here (server side); the client timeline only gets plain strings.
  const steps = journey.map((step) => ({
    key: step.title.en,
    date: step.date ? pick(step.date, locale) : null,
    title: step.title[locale],
    body: step.body[locale],
    current: step.current,
  }));

  return (
    <Section
      id="journey"
      eyebrow={dict.journey.eyebrow}
      title={dict.journey.title}
      bloom="bud-pink"
    >
      <div className="max-w-3xl rounded-2xl border border-line bg-surface/85 p-6 backdrop-blur sm:p-8">
        <Timeline steps={steps} growing={dict.journey.growing} />
      </div>
    </Section>
  );
}
