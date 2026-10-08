"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { format } from "@/i18n/format";
import type { Category } from "@/lib/schemas";
import type { PetalColor } from "@/components/garden/defs";
import { Petal } from "@/components/garden/flower";
import { scrollToY } from "@/components/layout/smooth-scroll";
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

type Labels = { filter: string; count: string; readCase: string; turn: string };

/** Each project gets one of the hero flowers' colors, in turn. */
const TONES: { color: PetalColor; ink: string; fill: string }[] = [
  { color: "violet", ink: "#a78bfa", fill: "url(#fl-violet)" },
  { color: "pink", ink: "#f472b6", fill: "url(#fl-pink)" },
  { color: "plum", ink: "#fb7185", fill: "url(#fl-plum)" },
];
const tone = (index: number) => TONES[index % TONES.length];
const number = (index: number) => String(index + 1).padStart(2, "0");
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Same petal shape as the hero roses, stretched to reach the cards. */
const BIG_PETAL = "M0 0C-11-4-14-18-8-26C-4-30 4-30 8-26C14-18 11-4 0 0Z";

/**
 * "Read case study", whose round arrow opens into a rose on hover (or keyboard focus) and
 * lets a few petals drift out.
 */
function CaseLink({
  href,
  label,
  index,
  tabIndex,
}: {
  href: string;
  label: string;
  index: number;
  tabIndex?: number;
}) {
  const { color } = tone(index);
  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className="case-link group/cta inline-flex items-center gap-3.5 text-sm font-bold whitespace-nowrap"
    >
      {label}
      <span className="case-circle">
        <span aria-hidden="true" className="case-petals">
          <svg viewBox="-30 -30 60 60" className="size-full">
            <use
              href={color === "plum" ? "#rose-plum" : "#rose-pink"}
              x={-30}
              y={-30}
              width={60}
              height={60}
            />
          </svg>
        </span>
        <ArrowRight className="relative z-10 size-4" />
        <span aria-hidden="true" className="case-drift">
          {[0, 1, 2, 3].map((k) => (
            <span
              key={k}
              style={
                {
                  "--i": k,
                  "--dx": `${-30 - k * 22}px`,
                  "--dy": `${-40 - k * 14 + (k % 2) * 30}px`,
                } as CSSProperties
              }
            >
              <Petal color={color} />
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}

/** The full card: number, type and team, title, summary, stack, case study link. */
function CardBody({
  card,
  index,
  readCase,
  linkTabIndex,
  big = false,
}: {
  card: ProjectCard;
  index: number;
  readCase: string;
  linkTabIndex?: number;
  big?: boolean;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className="project-num"
        style={{ "--ink": tone(index).ink } as CSSProperties}
      >
        {number(index)}
      </span>
      <p className="mt-3 font-mono text-[11px] tracking-wider uppercase">
        <span className="text-accent-text">{card.categoryLabel}</span>
        <span className="text-muted">
          {" · "}
          <Rich text={card.team} />
        </span>
      </p>
      <h3
        className={`mt-2 leading-tight font-extrabold stretch-semi ${big ? "text-3xl lg:text-4xl" : "text-2xl"}`}
      >
        {card.title}
      </h3>
      <p className="mt-3 text-muted">
        <Rich text={card.tagline} />
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {card.stack.map((item) => (
          <li
            key={item}
            className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
          >
            <Rich text={item} />
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <CaseLink href={card.href} label={readCase} index={index} tabIndex={linkTabIndex} />
      </div>
    </>
  );
}

/**
 * The projects as one big flower: every project is a card placed like a petal around the
 * flower's heart, and scrolling turns the flower, bringing the next project to the front
 * (on the left), where the panel beside it shows the whole card. Clicking a petal turns the
 * flower to it; clicking the front one opens its case study.
 *
 * On phones and with reduced motion, the same projects are a simple list of cards
 * (pf-plain), and the flower is not shown (pf-scene rules in globals.css).
 */
export function ProjectFlower({
  cards,
  filters,
  labels,
}: {
  cards: ProjectCard[];
  filters: { id: FilterId; label: string; count: number }[];
  labels: Labels;
}) {
  const [filter, setFilter] = useState<FilterId>("all");
  const shown = filter === "all" ? cards : cards.filter((card) => card.categories.includes(filter));
  const count = shown.length;
  const [front, setFront] = useState(0);
  const active = Math.min(front, count - 1);
  const scene = useRef<HTMLDivElement>(null);
  const flower = useRef<HTMLDivElement>(null);

  /** Where the page must be scrolled to so that petal `index` is in front. */
  const scrollFor = (index: number) => {
    const element = scene.current;
    if (!element) return null;
    const top = element.getBoundingClientRect().top + scrollY;
    const distance = element.offsetHeight - innerHeight;
    return top + (count > 1 ? (index / (count - 1)) * distance : 0);
  };

  useScrollFrame(() => {
    const element = scene.current;
    const ring = flower.current;
    if (!element || !ring || count === 0) return;
    const rect = element.getBoundingClientRect();
    const distance = rect.height - innerHeight;
    // 0 → count-1 while the scene is pinned: which petal is in front, with fractions.
    const turn = (distance > 0 ? clamp01(-rect.top / distance) : 0) * (count - 1);
    ring.style.setProperty("--turn", `${(-turn * (360 / count)).toFixed(2)}deg`);
    ring.querySelectorAll<HTMLElement>("[data-petal]").forEach((petal, i) => {
      const gap = Math.abs(i - turn);
      const near = clamp01(1 - Math.min(gap, count - gap));
      petal.style.setProperty("--near", near.toFixed(3));
      petal.style.zIndex = String(Math.round(near * 10));
    });
    setFront(Math.round(turn));
  });

  function choose(id: FilterId) {
    setFilter(id);
    setFront(0);
    // Back to the first petal if the flower was already turning.
    const element = scene.current;
    if (element && element.getBoundingClientRect().top < 0) {
      const top = element.getBoundingClientRect().top + scrollY;
      scrollToY(top);
    }
  }

  /** A petal that is not in front turns the flower to it instead of opening the page. */
  function onPetal(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (index === active) return;
    event.preventDefault();
    const y = scrollFor(index);
    if (y !== null) scrollToY(y);
  }

  const card = shown[active];

  return (
    <>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => choose(item.id)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-muted transition hover:border-muted hover:text-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
          >
            {item.label}
            <span className="opacity-70">{item.count}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {format(labels.count, { n: count })}
      </p>

      {/* Plain version: every card in a column (phones, reduced motion). */}
      <ul className="pf-plain mt-8 grid gap-6">
        {shown.map((item, index) => (
          <li
            key={item.slug}
            className="project-card rounded-2xl border border-line p-6 sm:p-8"
            style={{ "--tint": tone(index).ink } as CSSProperties}
          >
            <CardBody card={item} index={index} readCase={labels.readCase} />
          </li>
        ))}
      </ul>

      {/* The flower: pinned while the scroll turns it. */}
      <div
        ref={scene}
        className="pf-scene"
        style={{ "--count": Math.max(count, 1) } as CSSProperties}
      >
        <div className="pf-stage">
          <div aria-hidden="true" className="pf-detail">
            {card && (
              <div
                key={card.slug}
                className="project-card pf-detail-card rounded-2xl border border-line p-8"
                style={{ "--tint": tone(active).ink } as CSSProperties}
              >
                <CardBody
                  card={card}
                  index={active}
                  readCase={labels.readCase}
                  linkTabIndex={-1}
                  big
                />
              </div>
            )}
            <p className="mt-5 flex items-center gap-2 font-mono text-xs text-muted">
              <span className="pf-hint-icon" />
              {labels.turn}
            </p>
          </div>

          <div
            ref={flower}
            className="pf-flower"
            style={{ "--step": `${360 / Math.max(count, 1)}deg` } as CSSProperties}
          >
            <svg aria-hidden="true" viewBox="-100 -100 200 200" className="pf-petals">
              <g className="pf-turn">
                {shown.map((item, i) => (
                  <path
                    key={item.slug}
                    d={BIG_PETAL}
                    transform={`rotate(${(i * 360) / count - 90}) scale(2.4 2.8)`}
                    fill={tone(i).fill}
                  />
                ))}
              </g>
              <circle r="15" fill="url(#fl-heart)" />
              <circle
                r="21"
                fill="none"
                stroke="#fde68a"
                strokeOpacity="0.35"
                strokeDasharray="1 3"
              />
            </svg>
            <p aria-hidden="true" className="pf-heart">
              {number(active)}
              <span>/{number(count - 1)}</span>
            </p>
            <ol className="pf-ring">
              {shown.map((item, i) => (
                <li
                  key={item.slug}
                  data-petal=""
                  className="pf-petal"
                  style={{ "--i": i, "--tint": tone(i).ink } as CSSProperties}
                >
                  <Link
                    href={item.href}
                    onClick={(event) => onPetal(event, i)}
                    onFocus={() => {
                      const y = scrollFor(i);
                      if (y !== null && i !== active) scrollToY(y);
                    }}
                    className="pf-petal-card"
                  >
                    <span aria-hidden="true" className="pf-petal-num">
                      {number(i)}
                    </span>
                    <span className="pf-petal-kind">{item.categoryLabel}</span>
                    <span className="pf-petal-title">{item.title}</span>
                    <span className="sr-only">
                      {" — "}
                      {item.tagline}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
