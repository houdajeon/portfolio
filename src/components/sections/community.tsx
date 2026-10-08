import type { Messages } from "@/i18n/dictionaries";
import { pick } from "@/i18n/format";
import type { Locale } from "@/i18n/config";
import type { CommunityData } from "@/lib/schemas";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { Section } from "@/components/ui/section";
import { Cursor, Prompt, row, TerminalWindow } from "@/components/ui/terminal";
import type { FlowerType } from "@/components/garden/defs";
import { Flower } from "@/components/garden/flower";
import { NightSky } from "@/components/garden/night-sky";

/** Each event opens its own small flower in place of the ▸. */
const EVENT_BLOOMS: FlowerType[] = ["bl-violet", "bl-pink", "bl-plum"];

const key = "text-accent-text";

export function Community({
  locale,
  dict,
  community,
}: {
  locale: Locale;
  dict: Messages;
  community: CommunityData;
}) {
  const t = dict.community;
  const { club, events } = community;
  const file = `${club.name.toLowerCase()}.yml`;

  return (
    <Section
      id="community"
      eyebrow={t.eyebrow}
      title={t.title}
      intro={t.intro}
      bloom="bl-plum"
      backdrop={<NightSky />}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* The club, printed as a YAML file */}
        <Reveal className="self-start lg:sticky lg:top-24">
          <TerminalWindow title={`~/clubs/${file}`}>
            <h3 className="sr-only">{club.name}</h3>
            <Prompt>cat {file}</Prompt>
            <dl className="mt-3 space-y-2">
              <div className="term-row" style={row(1)}>
                <dt className={`inline ${key}`}>{t.yaml.name}:</dt>{" "}
                <dd className="inline font-bold text-fg">{club.name}</dd>
              </div>
              <div className="term-row" style={row(2)}>
                <dt className={key}>
                  {t.yaml.about}: <span className="text-muted">&gt;</span>
                </dt>
                <dd className="mt-0.5 pl-4 text-muted">
                  <Rich text={club.description[locale]} />
                </dd>
              </div>
              <div className="term-row" style={row(3)}>
                <dt className={key}>{t.yaml.roles}:</dt>
                <dd>
                  <ul className="mt-0.5 space-y-0.5 pl-4">
                    {club.roles.map((role) => (
                      <li key={role.en} className="text-fg">
                        <span aria-hidden="true" className="text-muted">
                          -{" "}
                        </span>
                        {role[locale]}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </TerminalWindow>
        </Reveal>

        {/* The events, printed as a log */}
        <Reveal delay={120}>
          <TerminalWindow title="~/ctf/events.log">
            <h3 className="sr-only">{t.eventsTitle}</h3>
            <Prompt>tail events.log</Prompt>
            <ul className="mt-3 space-y-1">
              {events.map((event, index) => (
                <li
                  key={event.name + pick(event.date, "en")}
                  className="term-row -mx-2 grid gap-x-4 gap-y-1 rounded px-2 py-2.5 transition-colors hover:bg-raised/70 sm:grid-cols-[8.5rem_minmax(0,1fr)]"
                  style={row(index + 1)}
                >
                  <span className="text-xs text-muted sm:pt-0.5">
                    <Rich text={pick(event.date, locale)} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-fg">
                      <Flower
                        type={EVENT_BLOOMS[index % EVENT_BLOOMS.length]}
                        size={16}
                        delay={index * 260 + 520}
                        className="mr-2 inline-block align-[-2px]"
                      />
                      <Rich text={event.name} />
                    </p>
                    <p className="mt-0.5 text-muted">
                      <span aria-hidden="true">↳ </span>
                      <Rich text={event.role[locale]} />
                    </p>
                    {event.partners.length > 0 && (
                      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-muted">{t.partners}:</span>
                        {event.partners.map((partner) => (
                          <span
                            key={partner}
                            className="rounded border border-line bg-raised/60 px-1.5 py-0.5 text-fg"
                          >
                            {partner}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="term-row mt-2" style={row(events.length + 1)}>
              <Prompt>
                <Cursor />
              </Prompt>
            </div>
          </TerminalWindow>
        </Reveal>
      </div>
    </Section>
  );
}
