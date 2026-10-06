"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { format } from "@/i18n/format";
import type { Category } from "@/lib/schemas";
import { ArrowRight } from "@/components/ui/icons";
import { Rich } from "@/components/ui/rich";
import { useScrollFrame } from "@/components/ui/use-scroll-frame";

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

// Card tints, taken from the hero flowers: violet, pink, burgundy.
const TINTS = ["var(--accent)", "#db2777", "#9f1239"];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Needs JavaScript for the filter and the stacking effect: each card sticks under the header
// and the next one slides over it (stack-* in globals.css).
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
  const list = useRef<HTMLUListElement>(null);

  // Two values per card for the CSS: --arrive (0 → 1) while it travels up to its place, which
  // zooms it in, and --cover (0 → 1) while the next card slides over it, which shrinks and
  // dims it. Reduced motion keeps the plain sticky stack.
  useScrollFrame(() => {
    const items = Array.from(list.current?.children ?? []) as HTMLElement[];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rects = items.map((item) => item.getBoundingClientRect());
    items.forEach((item, i) => {
      const stickTop = parseFloat(getComputedStyle(item).top);
      const arrive = (innerHeight - rects[i].top) / (innerHeight - stickTop);
      const next = rects[i + 1];
      const cover = next ? (rects[i].bottom - next.top) / rects[i].height : 0;
      item.style.setProperty("--arrive", clamp01(arrive).toFixed(3));
      item.style.setProperty("--cover", clamp01(cover).toFixed(3));
    });
  });

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

      <ul ref={list} className="mt-8 flex flex-col gap-8">
        {shown.map((card, index) => (
          <li
            key={card.slug}
            className="sticky"
            style={
              { top: `calc(5rem + ${index * 12}px)`, "--tint": TINTS[index % 3] } as CSSProperties
            }
          >
            <article className="stack-card group relative overflow-hidden rounded-2xl border border-line transition-[border-color] hover:border-accent/60 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
              <div className="grid gap-6 p-6 sm:p-8 lg:min-h-72 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-12 lg:p-12">
                <span aria-hidden="true" className="stack-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-[11px] tracking-wider uppercase">
                    <span className="text-accent-text">{card.categoryLabel}</span>
                    <span className="text-muted">
                      {" · "}
                      <Rich text={card.team} />
                    </span>
                  </p>
                  <h3 className="mt-3 text-2xl leading-tight font-extrabold stretch-semi sm:text-3xl lg:text-4xl">
                    <Link
                      href={card.href}
                      className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {card.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-2xl text-muted">
                    <Rich text={card.tagline} />
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
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
                <span className="inline-flex items-center gap-3 text-sm font-semibold">
                  {labels.readCase}
                  <span className="grid size-11 place-items-center rounded-full border border-line transition group-hover:border-transparent group-hover:bg-bloom group-hover:text-white">
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </span>
              </div>
              <div
                aria-hidden="true"
                className="stack-shade pointer-events-none absolute inset-0"
              />
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
