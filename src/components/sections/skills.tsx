import Link from "next/link";
import { projectPath, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { skillLevelSchema, type SkillLevel, type SkillsData } from "@/lib/schemas";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { Cursor, Prompt, row, TerminalWindow } from "@/components/ui/terminal";

// Status colors read like a cluster dashboard: green = in use, accent = familiar, amber = learning.
const statusStyle: Record<SkillLevel, { mark: string; text: string }> = {
  used: { mark: "bg-ok", text: "text-ok" },
  familiar: { mark: "bg-accent", text: "text-accent-text" },
  learning: { mark: "bg-todo", text: "text-todo" },
};

function Status({ level, label }: { level: SkillLevel; label: string }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${statusStyle[level].text}`}>
      <span
        aria-hidden="true"
        className={`size-2.5 shrink-0 rounded-[3px] ${statusStyle[level].mark}`}
      />
      {label}
    </span>
  );
}

export function Skills({
  locale,
  dict,
  skills,
}: {
  locale: Locale;
  dict: Messages;
  skills: SkillsData;
}) {
  const t = dict.skills;
  const levels = skillLevelSchema.options.filter((level) =>
    skills.groups.some((group) => group.items.some((item) => item.level === level)),
  );
  // Name | status | projects on wide screens; name + status, then projects, on phones.
  const grid =
    "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 sm:grid-cols-[11rem_7rem_minmax(0,1fr)]";

  return (
    <Section id="skills" eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
      <Reveal>
        <ul aria-label={t.legend} className="mb-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
          {levels.map((level) => (
            <li key={level}>
              <Status level={level} label={t.levels[level]} />
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        {skills.groups.map((group, groupIndex) => (
          <Reveal key={group.id} delay={(groupIndex % 2) * 120} className="h-full">
            <TerminalWindow
              className="h-full"
              title={
                <h3>
                  <span aria-hidden="true">~/skills/</span>
                  {group.label[locale].toLowerCase()}
                </h3>
              }
            >
              <Prompt>ls -l {group.id}/</Prompt>
              <p aria-hidden="true" className="term-row text-muted" style={row(1)}>
                total {group.items.length}
              </p>
              <div
                aria-hidden="true"
                className={`${grid} term-row mt-2 border-b border-dashed border-line pb-1.5 text-[11px] tracking-wider text-muted uppercase`}
                style={row(2)}
              >
                <span>{t.columns.name}</span>
                <span>{t.columns.status}</span>
                <span className="hidden sm:block">{t.columns.proof}</span>
              </div>

              <ul className="mt-1">
                {group.items.map((item, index) => (
                  <li
                    key={item.name}
                    className={`${grid} term-row group/row -mx-2 rounded px-2 py-1.5 transition-colors hover:bg-raised/70`}
                    style={row(index + 3)}
                  >
                    <span className="min-w-0 text-fg transition-colors group-hover/row:text-accent-text">
                      <span aria-hidden="true" className="text-muted">
                        ▸{" "}
                      </span>
                      {item.name}
                    </span>
                    <Status level={item.level} label={t.status[item.level]} />
                    <span className="col-span-2 mt-0.5 text-xs text-muted sm:col-span-1 sm:mt-0">
                      {item.projects.length > 0 || item.note ? (
                        <span className="flex flex-wrap gap-x-3 gap-y-0.5">
                          <span className="sr-only">{t.columns.proof}:</span>
                          {item.projects.map((slug) => (
                            <Link
                              key={slug}
                              href={projectPath(locale, slug)}
                              className="text-accent-text underline decoration-transparent underline-offset-4 transition hover:decoration-current"
                            >
                              {slug}
                            </Link>
                          ))}
                          {item.note && <span>{item.note[locale]}</span>}
                        </span>
                      ) : (
                        <span aria-hidden="true" className="hidden sm:inline">
                          —
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {groupIndex === skills.groups.length - 1 && (
                <div className="term-row mt-2" style={row(group.items.length + 3)}>
                  <Prompt>
                    <Cursor />
                  </Prompt>
                </div>
              )}
            </TerminalWindow>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
