import type { Messages } from "@/i18n/dictionaries";
import type { Site } from "@/lib/schemas";
import { GitHub, LinkedIn, Mail, MapPin } from "@/components/ui/icons";
import { Rich } from "@/components/ui/rich";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { ContactForm } from "./contact-form";
import { FormVines } from "@/components/garden/form-vines";

const row = "flex items-center gap-3";
const iconBox =
  "grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface text-muted";
const link = "underline decoration-line underline-offset-4 transition hover:decoration-accent";

export function Contact({ dict, site }: { dict: Messages; site: Site }) {
  const t = dict.contact;
  const short = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  return (
    <Section id="contact" eyebrow={t.eyebrow} title={t.title} intro={t.intro} bloom="bl-pink">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Reveal>
          <h3 className="font-mono text-xs tracking-wider text-muted uppercase">{t.direct}</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className={row}>
              <span className={iconBox}>
                <Mail />
              </span>
              {site.email ? (
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              ) : (
                <Rich text={t.emailTodo} />
              )}
            </li>
            <li className={row}>
              <span className={iconBox}>
                <LinkedIn />
              </span>
              <a href={site.linkedin} className={`${link} break-all`} rel="me noopener">
                {short(site.linkedin)}
              </a>
            </li>
            <li className={row}>
              <span className={iconBox}>
                <GitHub />
              </span>
              <a href={site.github} className={link} rel="me noopener">
                {short(site.github)}
              </a>
            </li>
            <li className={row}>
              <span className={iconBox}>
                <MapPin />
              </span>
              {dict.about.facts.basedValue}
            </li>
          </ul>
        </Reveal>
        <Reveal delay={120} className="relative mx-4 mt-6 lg:mt-0">
          <FormVines />
          <div className="relative z-10">
            <ContactForm accessKey={site.contactFormKey} labels={t.form} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
