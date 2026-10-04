"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "@/i18n/format";
import type { Category } from "@/lib/schemas";
import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";

export type ProjectCard = {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  categories: Category[];
  categoryLabel: string;
  team: string;
  stack: string[];
};

export type FilterId = "all" | Category;

type Labels = { filter: string; count: string; readCase: string };

// Only this grid needs JavaScript (the filter); the rest of the page is static HTML.
export function ProjectGrid({
  cards,
  filters,
  labels,
}: {
  cards: ProjectCard[];
  filters: { id: FilterId; label: string; count: number }[];
  labels: Labels;
}) {
  const [active, setActive] = useState<FilterId>("all");
  const shown = active === "all" ? cards : cards.filter((card) => card.categories.includes(active));

  return (
    <>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={active === filter.id}
            onClick={() => setActive(filter.id)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-muted transition hover:border-muted hover:text-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
          >
            {filter.label}
            <span className="opacity-70">{filter.count}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {format(labels.count, { n: shown.length })}
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((card, index) => (
          <li key={card.slug}>
            <Reveal delay={(index % 3) * 90} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
                <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-2.5 font-mono text-[11px] tracking-wider uppercase">
                  <span className="text-accent-text">{card.categoryLabel}</span>
                  <span className="text-muted">
                    <Rich text={card.team} />
                  </span>
                </header>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-lg leading-snug font-bold stretch-semi">
                    <Link
                      href={card.href}
                      className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {card.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted">
                    <Rich text={card.tagline} />
                  </p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {card.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
                      >
                        <Rich text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
                <footer className="flex items-center justify-between border-t border-line px-5 py-3 text-sm font-medium">
                  {labels.readCase}
                  <ArrowRight className="size-4 text-accent-text transition group-hover:translate-x-1" />
                </footer>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </>
  );
}
